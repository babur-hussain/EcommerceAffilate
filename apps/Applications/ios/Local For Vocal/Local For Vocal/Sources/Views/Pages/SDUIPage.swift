import Combine
import SwiftUI

// MARK: - In-Memory Layout Store (singleton, survives view recreation)

/// Keeps decoded SDUI layouts in RAM so tab switches are instant.
/// Backed by NSCache (via SDUIMemoryCache) for memory-pressure eviction.
/// Disk cache (SDUICacheManager) is the durable layer; this is the fast layer.
// Fix #10: @MainActor prevents data races on @Published layouts/isPreloaded
@MainActor
final class SDUILayoutStore: ObservableObject {
    static let shared = SDUILayoutStore()

    /// Cached layouts keyed by slug
    @Published var layouts: [String: AdvancedLayoutResponse] = [:]

    /// Whether the preloader has finished loading disk cache into memory
    @Published var isPreloaded: Bool = false

    /// Track which slugs are currently being fetched (prevents duplicate requests)
    var activeFetches: Set<String> = []

    /// Track staleness per slug
    var staleFlags: [String: Bool] = [:]

    /// Track timestamps of last network fetch per slug
    var lastFetchTime: [String: Date] = [:]

    /// Minimum interval between network fetches for the same slug (5 minutes)
    let minFetchInterval: TimeInterval = 5 * 60

    /// Stale threshold matching SDUICacheManager (1 hour)
    private let staleCacheAge: TimeInterval = 60 * 60

    private init() {
        // Fix #11: Load disk cache off main thread — only hop to MainActor for property updates
        Task.detached(priority: .userInitiated) {
            let loaded = Self.loadAllFromDisk()
            await MainActor.run {
                for (slug, entry) in loaded {
                    self.layouts[slug] = entry.response
                    self.staleFlags[slug] = entry.isStale
                    SDUIMemoryCache.shared.saveToMemory(key: slug, jsonData: entry.rawJSON)
                }
                self.isPreloaded = true
            }
        }
    }

    func shouldFetchFromNetwork(slug: String) -> Bool {
        // Don't fetch if already fetching
        if activeFetches.contains(slug) { return false }

        // Don't fetch if we fetched recently
        if let lastFetch = lastFetchTime[slug],
            Date().timeIntervalSince(lastFetch) < minFetchInterval
        {
            return false
        }

        // Don't fetch if offline
        if !NetworkMonitor.shared.isConnected { return false }

        return true
    }

    // MARK: - Background Disk Cache Loading

    /// Entry loaded from disk cache — used to transfer data from background to main thread
    private struct DiskCacheEntry {
        let response: AdvancedLayoutResponse
        let isStale: Bool
        let rawJSON: Data
    }

    /// Reads ALL .cache files from the SDUI cache directory.
    /// Runs entirely off the main thread — no @MainActor dependency.
    /// Returns parsed entries for the caller to apply on MainActor.
    private nonisolated static func loadAllFromDisk() -> [String: DiskCacheEntry] {
        let fileManager = FileManager.default
        guard let cacheBase = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first
        else { return [:] }
        let cacheDir = cacheBase.appendingPathComponent("SDUI", isDirectory: true)

        guard fileManager.fileExists(atPath: cacheDir.path) else { return [:] }

        // Internal format matching SDUIDiskCache.CacheFile
        struct CacheFile: Codable {
            let rawJSON: Data
            let version: Int
            let timestamp: Date
            let slug: String
            let checksum: String?
        }

        guard
            let files = try? fileManager.contentsOfDirectory(
                at: cacheDir, includingPropertiesForKeys: nil)
        else { return [:] }

        let staleCacheAge: TimeInterval = 60 * 60
        var result: [String: DiskCacheEntry] = [:]

        for fileURL in files {
            guard fileURL.pathExtension == "cache" else { continue }

            guard let fileData = try? Data(contentsOf: fileURL),
                let cacheFile = try? JSONDecoder().decode(CacheFile.self, from: fileData),
                let components = try? JSONDecoder().decode(
                    [SDUIComponent].self, from: cacheFile.rawJSON)
            else { continue }

            let isStale = Date().timeIntervalSince(cacheFile.timestamp) > staleCacheAge

            let response = AdvancedLayoutResponse(
                slug: cacheFile.slug,
                name: "Preloaded",
                isActive: true,
                components: components
            )

            result[cacheFile.slug] = DiskCacheEntry(
                response: response,
                isStale: isStale,
                rawJSON: cacheFile.rawJSON
            )
        }

        return result
    }
}

// MARK: - SDUIPage View

/// SDUI Page with cache-first loading strategy (Flipkart-style)
/// 1. Checks in-memory store first (instant, zero I/O)
/// 2. Falls back to disk cache (SDUICacheManager)
/// 3. Background-refreshes from network only when stale
/// 4. Works fully offline using cached layouts + images
struct SDUIPage: View {
    let slug: String
    @ObservedObject private var store = SDUILayoutStore.shared
    @State private var showSkeleton: Bool
    @State private var errorMessage: String?
    @State private var isLoading = false
    @State private var hasTriggeredLoad = false

    init(slug: String) {
        self.slug = slug

        // Check 1: Already in memory store?
        if SDUILayoutStore.shared.layouts[slug] != nil {
            _showSkeleton = State(initialValue: false)
            AppLogger.debug("[SDUIPage] INSTANT: '\(slug)' found in memory store")
        }
        // Check 2: Synchronous disk cache fallback (belt-and-suspenders)
        else if let layout = SDUIPage.loadFromDiskSync(slug: slug) {
            // Promote to memory store immediately
            SDUILayoutStore.shared.layouts[slug] = layout
            _showSkeleton = State(initialValue: false)
            AppLogger.debug(
                "[SDUIPage] SYNC-DISK: '\(slug)' loaded from disk and promoted to store")
        } else {
            _showSkeleton = State(initialValue: true)
            AppLogger.debug("[SDUIPage] MISS: '\(slug)' not cached, will show skeleton")
        }
    }

    /// Synchronously reads a single slug's cache file directly from FileManager.
    /// This bypasses the SDUICacheManager actor entirely for zero-latency.
    static func loadFromDiskSync(slug: String) -> AdvancedLayoutResponse? {
        let fileManager = FileManager.default
        guard let cacheBase = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first
        else { return nil }
        let cacheDir = cacheBase.appendingPathComponent("SDUI", isDirectory: true)
        let fileName = "\(slug)_v1.cache"
        let fileURL = cacheDir.appendingPathComponent(fileName)

        guard fileManager.fileExists(atPath: fileURL.path) else {
            AppLogger.debug("[SDUIPage] SYNC-DISK: No cache file at \(fileURL.lastPathComponent)")
            return nil
        }

        struct CacheFile: Codable {
            let rawJSON: Data
            let version: Int
            let timestamp: Date
            let slug: String
            let checksum: String?  // Optional for backward compatibility
        }

        guard let fileData = try? Data(contentsOf: fileURL),
            let cacheFile = try? JSONDecoder().decode(CacheFile.self, from: fileData),
            let components = try? JSONDecoder().decode(
                [SDUIComponent].self, from: cacheFile.rawJSON)
        else {
            AppLogger.debug("[SDUIPage] SYNC-DISK: Failed to decode cache file for '\(slug)'")
            return nil
        }

        // Also populate NSCache on disk hit
        SDUIMemoryCache.shared.saveToMemory(key: slug, jsonData: cacheFile.rawJSON)

        return AdvancedLayoutResponse(
            slug: cacheFile.slug,
            name: "Preloaded",
            isActive: true,
            components: components
        )
    }

    private var layout: AdvancedLayoutResponse? {
        store.layouts[slug]
    }

    var body: some View {
        Group {
            if showSkeleton && layout == nil {
                // Show skeleton while loading
                if slug == "home" {
                    HomeSkeletonView()
                } else {
                    SDUIPageSkeleton()
                }
            } else if let error = errorMessage, layout == nil {
                // Error state only if no cached content
                VStack(spacing: 16) {
                    Image(
                        systemName: NetworkMonitor.shared.isConnected
                            ? "exclamationmark.triangle"
                            : "wifi.slash"
                    )
                    .font(.system(size: 48))
                    .foregroundColor(.orange)
                    Text(
                        NetworkMonitor.shared.isConnected
                            ? "Error loading page"
                            : "You're offline"
                    )
                    .font(.headline)
                    Text(
                        NetworkMonitor.shared.isConnected
                            ? error
                            : "Connect to the internet to load this page"
                    )
                    .font(.caption)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    Button("Retry") {
                        Task { await loadLayout(forceRefresh: true) }
                    }
                    .buttonStyle(.borderedProminent)
                    .padding(.top, 8)
                }
                .padding()
                .frame(maxWidth: .infinity, minHeight: 200)
            } else if let components = layout?.components {
                // Content loaded (from memory, disk cache, or network)
                LazyVStack(spacing: 0) {
                    ForEach(components.filter { $0.isHidden != true }) { component in
                        SDUIComponentView(component: component)
                            .transition(.opacity)
                    }
                }
            } else {
                Text("No content found")
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, minHeight: 200)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: layout?.components.count ?? 0)
        .task(id: slug) {
            // Reload whenever slug changes. Guard via hasTriggeredLoad
            // to prevent re-entry. The store.layouts check only fires if
            // view was recreated (hasTriggeredLoad reset).
            guard !hasTriggeredLoad else { return }
            hasTriggeredLoad = true
            await loadLayout()
        }
    }

    // MARK: - Public Refresh

    public func refresh() async {
        await loadLayout(forceRefresh: true)
    }

    // MARK: - Loading Strategy

    private func loadLayout(forceRefresh: Bool = false) async {
        errorMessage = nil

        // ── Layer 1: In-memory store (instant) ──
        if !forceRefresh, layout != nil {
            // Already have it in RAM — just check if stale and bg-refresh
            showSkeleton = false
            isLoading = false

            if store.shouldFetchFromNetwork(slug: slug) {
                let isStale = store.staleFlags[slug] ?? false
                if isStale {
                    Task.detached { await self.fetchFromNetwork() }
                }
            }
            return
        }

        isLoading = true

        // ── Layer 2: Disk cache (fast, persisted) ──
        if !forceRefresh, let cached = await SDUICacheManager.shared.load(slug: slug, userId: nil) {
            let response = AdvancedLayoutResponse(
                slug: cached.slug,
                name: "Cached",
                isActive: true,
                components: cached.components
            )

            await MainActor.run {
                store.layouts[slug] = response
                store.staleFlags[slug] = cached.isStale
                showSkeleton = false
                isLoading = false
            }

            // Prefetch images in background
            Task.detached(priority: .utility) {
                await self.prefetchImages(from: cached.components)
            }

            // If stale, bg-refresh from network
            if cached.isStale && store.shouldFetchFromNetwork(slug: slug) {
                Task.detached { await self.fetchFromNetwork() }
            }
            return
        }

        // ── Layer 3: Network fetch ──
        if NetworkMonitor.shared.isConnected {
            await fetchFromNetwork()
        } else {
            // Offline with no cache
            await MainActor.run {
                errorMessage = "No cached content available"
                showSkeleton = false
                isLoading = false
            }
        }
    }

    // MARK: - Network Fetch

    private func fetchFromNetwork(retryCount: Int = 3) async {
        let currentSlug = slug

        // Prevent duplicate fetches
        guard
            await MainActor.run(body: {
                if store.activeFetches.contains(currentSlug) { return false }
                store.activeFetches.insert(currentSlug)
                return true
            })
        else { return }

        defer {
            Task { @MainActor in
                store.activeFetches.remove(currentSlug)
            }
        }

        var lastError: Error?

        for attempt in 0..<retryCount {
            do {
                try Task.checkCancellation()

                // Skip if gone offline mid-retry
                guard NetworkMonitor.shared.isConnected else {
                    AppLogger.debug("[SDUIPage] Gone offline during fetch for \(currentSlug)")
                    break
                }

                guard
                    let response = try await APIService.shared.fetchLayout(
                        slug: currentSlug, forceRefresh: true)
                else {
                    throw APIService.APIError.serverError
                }

                // Encode for caching — non-fatal if this fails
                var contentChanged = true
                if let rawData = try? JSONEncoder().encode(response.components) {
                    contentChanged = await SDUICacheManager.shared.hasContentChanged(
                        key: currentSlug, newData: rawData)

                    let slugToSave = currentSlug
                    Task.detached {
                        await SDUICacheManager.shared.saveSDUI(
                            key: slugToSave, jsonData: rawData)
                        LayoutPreloader.shared.registerCachedSlug(slugToSave)
                    }
                }

                // ALWAYS update the store to prevent .task re-trigger loop.
                // Only skip the assignment if store already has this slug AND content is unchanged.
                await MainActor.run {
                    if contentChanged || store.layouts[currentSlug] == nil {
                        store.layouts[currentSlug] = response
                    }
                    store.staleFlags[currentSlug] = false
                    store.lastFetchTime[currentSlug] = Date()
                    showSkeleton = false
                    isLoading = false
                }

                if contentChanged {
                    AppLogger.debug("[SDUIPage] Network: Updated \(currentSlug) with new content")
                } else {
                    AppLogger.debug("[SDUIPage] Network: \(currentSlug) unchanged (checksum match)")
                }

                // Prefetch images
                Task.detached(priority: .utility) {
                    await self.prefetchImages(from: response.components)
                }

                return

            } catch is CancellationError {
                return
            } catch let error as NSError
                where error.domain == NSURLErrorDomain && error.code == -999
            {
                lastError = error
                if attempt < retryCount - 1 {
                    try? await Task.sleep(nanoseconds: UInt64(100_000_000 * (attempt + 1)))
                }
            } catch {
                lastError = error
                if attempt < retryCount - 1 {
                    try? await Task.sleep(nanoseconds: UInt64(500_000_000 * (attempt + 1)))
                }
            }
        }

        // Network failed
        await MainActor.run {
            isLoading = false
            if store.layouts[currentSlug] == nil {
                errorMessage = lastError?.localizedDescription ?? "Unknown error"
                showSkeleton = false
            } else {
                // Network failed but cached content available, silently use it
            }
        }
    }

    // MARK: - Image Prefetching

    private func prefetchImages(from components: [SDUIComponent]) async {
        var imageURLs: [String] = []

        for component in components {
            guard let props = component.props else { continue }

            for (key, prop) in props {
                let imageKeys = [
                    "image", "imageUrl", "image_url", "primaryImage",
                    "headerImage", "bannerImage", "doctorImage", "icon",
                ]
                if imageKeys.contains(key), let urlString = prop.value as? String,
                    urlString.hasPrefix("http")
                {
                    imageURLs.append(urlString)
                }

                if key == "items" || key == "banners",
                    let items = prop.value as? [[String: Any]]
                {
                    for item in items {
                        for imageKey in ["image", "imageUrl", "image_url", "icon"] {
                            if let urlString = item[imageKey] as? String,
                                urlString.hasPrefix("http")
                            {
                                imageURLs.append(urlString)
                            }
                        }
                    }
                }
            }
        }

        guard !imageURLs.isEmpty else { return }
        await ImageDiskCache.shared.prefetch(urls: imageURLs)
    }
}
