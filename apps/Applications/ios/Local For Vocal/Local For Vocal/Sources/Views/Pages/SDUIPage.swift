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
                ForEach(components) { component in
                    SDUIComponentView(component: component)
                }
                .transition(.opacity)
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

    private func loadLayoutCacheFirst() async {
        isLoading = true
        errorMessage = nil

        // 1. Try loading from cache first (instant display)
        if let cached = await SDUICacheManager.shared.load(slug: slug, userId: nil) {
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
        await fetchAndUpdate(retryCount: 3)
    }

    private func fetchAndUpdate(retryCount: Int) async {
        var lastError: Error?

        for attempt in 0..<retryCount {
            do {
                try Task.checkCancellation()

                // Fetch with raw data for caching
                let (response, rawData) = try await fetchLayoutWithRawData(slug: slug)

                // Update UI only if content actually changed or we're showing skeleton
                let hasChanges = response.components.count != (layout?.components.count ?? 0)

                await MainActor.run {
                    if hasChanges || self.showSkeleton {
                        self.layout = response
                    }
                    self.showSkeleton = false
                    self.isFromCache = false
                    self.isLoading = false
                }

                // Save raw JSON to cache (non-blocking)
                if let rawData = rawData {
                    let currentSlug = slug
                    Task.detached {
                        await SDUICacheManager.shared.saveRawJSON(
                            rawData,
                            slug: currentSlug,
                            userId: nil
                        )
                    }
                }

                print("[SDUIPage] Network fetch success: \(response.components.count) components")
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

    // MARK: - Network Fetch with Raw Data

    private func fetchLayoutWithRawData(slug: String) async throws -> (
        AdvancedLayoutResponse, Data?
    ) {
        let urlString = "\(APIService.shared.baseURL)/advanced-layout/\(slug)"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10

        if let token = AuthManager.shared.authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw URLError(.badServerResponse)
        }

        // Log cache header from backend
        if let cacheHit = httpResponse.value(forHTTPHeaderField: "X-Cache") {
            print("[SDUIPage] Backend cache: \(cacheHit)")
        }

        // Decode to AdvancedLayoutResponse
        let layout = try JSONDecoder().decode(AdvancedLayoutResponse.self, from: data)

        // Return both decoded response and raw data for caching
        return (layout, data)
    }
}
