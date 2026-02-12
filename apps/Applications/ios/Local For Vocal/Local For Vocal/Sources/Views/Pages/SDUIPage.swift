import SwiftUI

/// SDUI Page with cache-first loading strategy
/// Loads cached content instantly, shows skeleton if no cache, fetches network in background
struct SDUIPage: View {
    let slug: String
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var showSkeleton = true
    @State private var isFromCache = false
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
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 48))
                        .foregroundColor(.orange)
                    Text("Error loading page")
                        .font(.headline)
                    Text(error)
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

    // MARK: - Cache-First Loading

    private func loadLayoutCacheFirst(forceRefresh: Bool = false) async {
        isLoading = true
        errorMessage = nil

        // 1. Try loading from cache first (instant display)
        // Skip cache if forced refresh
        if !forceRefresh, let cached = await SDUICacheManager.shared.load(slug: slug, userId: nil) {
            await MainActor.run {
                // Convert cached SDUIComponent to AdvancedLayoutResponse
                self.layout = AdvancedLayoutResponse(
                    slug: cached.slug,
                    name: "Cached",
                    isActive: true,
                    components: cached.components
                )
                self.showSkeleton = false
                self.isFromCache = true
            }
            print("[SDUIPage] Loaded from cache: \(cached.components.count) components")
        }

        // 2. Fetch fresh data from network (in background)
        await fetchAndUpdate(retryCount: 3, forceRefresh: forceRefresh)
    }

    private func fetchAndUpdate(retryCount: Int, forceRefresh: Bool = false) async {
        var lastError: Error?

        for attempt in 0..<retryCount {
            do {
                try Task.checkCancellation()

                // Fetch using APIService to ensure overrides (like 'grocery') are respected
                guard
                    let response = try await APIService.shared.fetchLayout(
                        slug: slug, forceRefresh: forceRefresh)
                else {
                    throw APIService.APIError.serverError  // Should not happen if fetchLayout handles errors
                }

                // Always update UI with fresh network data
                await MainActor.run {
                    self.layout = response
                    self.showSkeleton = false
                    self.isFromCache = false
                    self.isLoading = false
                }

                // Save only the components array to cache (not the full response wrapper)
                // SDUICacheManager.load() decodes rawJSON as [SDUIComponent], so we must
                // encode just the components array, not the full AdvancedLayoutResponse.
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

            // Only show error if we have no cached content
            if self.layout == nil {
                self.errorMessage = lastError?.localizedDescription ?? "Unknown error"
                self.showSkeleton = false
            } else {
                // We have cached content, silently fail
                print("[SDUIPage] Network failed but using cached content")
            }
        }
    }
}
