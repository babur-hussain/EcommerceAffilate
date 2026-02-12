import SwiftUI

/// SDUI Page with cache-first loading strategy (Flipkart-style)
/// 1. Always shows cached content instantly on launch
/// 2. Refreshes from network in background (stale-while-revalidate)
/// 3. Works fully offline using cached layouts + images
/// 4. Prefetches images from component props after layout loads
struct SDUIPage: View {
    let slug: String
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var showSkeleton = true
    @State private var isFromCache = false
    @State private var isStale = false
    @State private var errorMessage: String?

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
                        Task { await loadLayoutCacheFirst() }
                    }
                    .buttonStyle(.borderedProminent)
                    .padding(.top, 8)
                }
                .padding()
                .frame(maxWidth: .infinity, minHeight: 200)
            } else if let components = layout?.components {
                // Content loaded (from cache or network)
                // LazyVStack renders components on-demand as user scrolls
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
        .task(id: slug) {
            await loadLayoutCacheFirst()
        }
    }

    // MARK: - Cache-First Loading

    // Public refresh method
    public func refresh() async {
        await loadLayoutCacheFirst(forceRefresh: true)
    }

    // MARK: - Cache-First Loading (Flipkart Strategy)

    private func loadLayoutCacheFirst(forceRefresh: Bool = false) async {
        isLoading = true
        errorMessage = nil

        // 1. Always try loading from cache first (instant display)
        if !forceRefresh, let cached = await SDUICacheManager.shared.load(slug: slug, userId: nil) {
            await MainActor.run {
                self.layout = AdvancedLayoutResponse(
                    slug: cached.slug,
                    name: "Cached",
                    isActive: true,
                    components: cached.components
                )
                self.showSkeleton = false
                self.isFromCache = true
                self.isStale = cached.isStale
            }
            print(
                "[SDUIPage] Loaded from cache: \(cached.components.count) components (stale: \(cached.isStale))"
            )

            // Prefetch images from cached components in background
            Task.detached(priority: .utility) {
                await prefetchImages(from: cached.components)
            }
        }

        // 2. If offline and we have cache → stay on cache, skip network
        if !NetworkMonitor.shared.isConnected {
            if layout != nil {
                print("[SDUIPage] Offline — using cached content for \(slug)")
                await MainActor.run {
                    self.isLoading = false
                }
                return
            } else {
                // Offline with no cache — show offline error
                await MainActor.run {
                    self.errorMessage = "No cached content available"
                    self.showSkeleton = false
                    self.isLoading = false
                }
                return
            }
        }

        // 3. Online — fetch fresh data from network (in background)
        await fetchAndUpdate(retryCount: 3, forceRefresh: forceRefresh)
    }

    private func fetchAndUpdate(retryCount: Int, forceRefresh: Bool = false) async {
        var lastError: Error?

        for attempt in 0..<retryCount {
            do {
                try Task.checkCancellation()

                guard
                    let response = try await APIService.shared.fetchLayout(
                        slug: slug, forceRefresh: forceRefresh)
                else {
                    throw APIService.APIError.serverError
                }

                // Always update UI with fresh network data
                await MainActor.run {
                    self.layout = response
                    self.showSkeleton = false
                    self.isFromCache = false
                    self.isStale = false
                    self.isLoading = false
                }

                // Save only the components array to cache
                if let rawData = try? JSONEncoder().encode(response.components) {
                    let currentSlug = slug
                    Task.detached {
                        await SDUICacheManager.shared.saveRawJSON(
                            rawData,
                            slug: currentSlug,
                            userId: nil
                        )
                    }
                }

                // Prefetch images from fresh components
                Task.detached(priority: .utility) {
                    await prefetchImages(from: response.components)
                }

                print(
                    "[SDUIPage] Fetch success: \(response.components.count) components (Force: \(forceRefresh))"
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
            self.isLoading = false

            if self.layout == nil {
                self.errorMessage = lastError?.localizedDescription ?? "Unknown error"
                self.showSkeleton = false
            } else {
                // We have cached content, silently fail
                print("[SDUIPage] Network failed but using cached content")
            }
        }
    }

    // MARK: - Image Prefetching

    /// Extract all image URLs from SDUI component props and prefetch them
    private func prefetchImages(from components: [SDUIComponent]) async {
        var imageURLs: [String] = []

        for component in components {
            guard let props = component.props else { continue }

            for (key, prop) in props {
                // Look for common image property keys
                let imageKeys = [
                    "image", "imageUrl", "image_url", "primaryImage",
                    "headerImage", "bannerImage", "doctorImage", "icon",
                ]
                if imageKeys.contains(key), let urlString = prop.value as? String,
                    urlString.hasPrefix("http")
                {
                    imageURLs.append(urlString)
                }

                // Look for items arrays that may contain image URLs
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
