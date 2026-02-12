import Combine
import SwiftUI

// MARK: - In-Memory Layout Store (singleton, survives view recreation)

/// Keeps decoded SDUI layouts in RAM so tab switches are instant.
/// Disk cache (SDUICacheManager) is the durable layer; this is the fast layer.
final class SDUILayoutStore: ObservableObject {
    static let shared = SDUILayoutStore()

    /// Cached layouts keyed by slug
    @Published var layouts: [String: AdvancedLayoutResponse] = [:]

    /// Track which slugs are currently being fetched (prevents duplicate requests)
    var activeFetches: Set<String> = []

    /// Track staleness per slug
    var staleFlags: [String: Bool] = [:]

    /// Track timestamps of last network fetch per slug
    var lastFetchTime: [String: Date] = [:]

    /// Minimum interval between network fetches for the same slug (5 minutes)
    let minFetchInterval: TimeInterval = 5 * 60

    private init() {}

    func shouldFetchFromNetwork(slug: String) -> Bool {
        // Don't fetch if already fetching
        if activeFetches.contains(slug) { return false }

        // Don't fetch if we fetched recently
        if let lastFetch = lastFetchTime[slug],
            Date().timeIntervalSince(lastFetch) < minFetchInterval
        {
            return false
        }

        return true
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
    @State private var showSkeleton = true
    @State private var errorMessage: String?
    @State private var isLoading = false
    @State private var hasTriggeredLoad = false

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
                    ForEach(components) { component in
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
        .onAppear {
            // Only trigger loading once, or if no layout exists
            if !hasTriggeredLoad || layout == nil {
                hasTriggeredLoad = true
                Task { await loadLayout() }
            }
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
                    print("[SDUIPage] \(slug): In-memory but stale, bg-refreshing…")
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

            print(
                "[SDUIPage] \(slug): Loaded from disk cache (\(cached.components.count) components, stale: \(cached.isStale))"
            )

            // Prefetch images in background
            Task.detached(priority: .utility) {
                await self.prefetchImages(from: cached.components)
            }

            // If stale, bg-refresh from network
            if cached.isStale && store.shouldFetchFromNetwork(slug: slug) {
                print("[SDUIPage] \(slug): Disk cache stale, bg-refreshing…")
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

                guard
                    let response = try await APIService.shared.fetchLayout(
                        slug: currentSlug, forceRefresh: true)
                else {
                    throw APIService.APIError.serverError
                }

                // Update in-memory store + UI
                await MainActor.run {
                    store.layouts[currentSlug] = response
                    store.staleFlags[currentSlug] = false
                    store.lastFetchTime[currentSlug] = Date()
                    showSkeleton = false
                    isLoading = false
                }

                // Save to disk cache
                if let rawData = try? JSONEncoder().encode(response.components) {
                    Task.detached {
                        await SDUICacheManager.shared.saveRawJSON(
                            rawData,
                            slug: currentSlug,
                            userId: nil
                        )
                    }
                }

                // Prefetch images
                Task.detached(priority: .utility) {
                    await self.prefetchImages(from: response.components)
                }

                print(
                    "[SDUIPage] \(currentSlug): Network fetch success (\(response.components.count) components)"
                )
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
                print("[SDUIPage] \(currentSlug): Network failed, using cached content")
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
        print("[SDUIPage] Prefetching \(imageURLs.count) images for \(slug)")
        await ImageDiskCache.shared.prefetch(urls: imageURLs)
    }
}
