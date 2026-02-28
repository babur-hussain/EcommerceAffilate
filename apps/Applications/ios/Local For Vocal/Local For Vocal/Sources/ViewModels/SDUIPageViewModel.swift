import Combine
import Foundation

/// Enhanced SDUI Page ViewModel with cache-first loading strategy
/// Loads cached content immediately, then refreshes from network in background
/// Uses checksum comparison to avoid unnecessary re-renders
@MainActor
class SDUIPageViewModel: ObservableObject {
    @Published var components: [SDUIComponent] = []
    @Published var isLoading: Bool = false
    @Published var showSkeleton: Bool = false
    @Published var isFromCache: Bool = false
    @Published var errorMessage: String? = nil

    private let pageSlug: String
    private var cancellables = Set<AnyCancellable>()
    private var fetchTask: Task<Void, Never>? = nil

    init(pageSlug: String) {
        self.pageSlug = pageSlug
    }

    deinit {
        fetchTask?.cancel()
    }

    // MARK: - Cache-First Loading (Recommended)

    /// Load layout with cache-first strategy
    /// 1. Load from cache immediately (memory → disk)
    /// 2. Show skeleton if no cache
    /// 3. Fetch fresh data in background (only if online)
    /// 4. Update UI only if JSON actually changed (checksum comparison)
    func loadLayout() {
        guard !isLoading else { return }

        fetchTask?.cancel()
        fetchTask = Task {
            await loadLayoutAsync()
        }
    }

    private func loadLayoutAsync() async {
        isLoading = true
        errorMessage = nil

        // 1. Try loading from cache first (instant display)
        if let cached = await SDUICacheManager.shared.load(slug: pageSlug, userId: nil) {
            self.components = cached.components
            self.isFromCache = true
            self.showSkeleton = false
            AppLogger.debug(
                "[SDUI] Loaded \(cached.components.count) components from cache (stale: \(cached.isStale))"
            )
        } else {
            // No cache - show skeleton
            self.showSkeleton = true
            AppLogger.debug("[SDUI] No cache, showing skeleton for \(pageSlug)")
        }

        // 2. Fetch fresh data from network (only if online)
        guard NetworkMonitor.shared.isConnected else {
            // Offline — use whatever cache we have, no error if we have content
            if self.components.isEmpty {
                self.errorMessage = "You're offline and no cached content is available"
                self.showSkeleton = false
            }
            isLoading = false
            AppLogger.debug("[SDUI] Offline — using cached content for \(pageSlug)")
            return
        }

        do {
            let (freshComponents, rawData) = try await fetchFromNetworkWithRawData()

            // Check if task was cancelled
            guard !Task.isCancelled else { return }

            // 3. Check if content actually changed (SHA256 checksum comparison)
            var shouldUpdateUI = true
            if let rawData = rawData {
                shouldUpdateUI = await SDUICacheManager.shared.hasContentChanged(
                    key: pageSlug, newData: rawData)
            }

            if shouldUpdateUI {
                // Content changed — update UI
                self.components = freshComponents
                self.showSkeleton = false
                self.isFromCache = false
                AppLogger.debug(
                    "[SDUI] Updated with \(freshComponents.count) fresh components (content changed)"
                )
            } else {
                // Content identical — skip re-render
                self.showSkeleton = false
                self.isFromCache = false
                AppLogger.debug("[SDUI] Content unchanged for \(pageSlug), skipping re-render")
            }

            // 4. Save to both memory + disk cache (non-blocking)
            if let rawData = rawData {
                let slug = self.pageSlug
                Task.detached {
                    await SDUICacheManager.shared.saveSDUI(
                        key: slug,
                        jsonData: rawData
                    )
                    LayoutPreloader.shared.registerCachedSlug(slug)
                }
            }

        } catch {
            // Network failed - but we might have cache, so only show error if no content
            if self.components.isEmpty {
                self.errorMessage = error.localizedDescription
                self.showSkeleton = false
                AppLogger.debug("[SDUI] Network error and no cache: \(error)")
            } else {
                AppLogger.debug("[SDUI] Network failed but using cached content")
            }
        }

        isLoading = false
    }

    // MARK: - Network Fetch

    private func fetchFromNetworkWithRawData() async throws -> ([SDUIComponent], Data?) {
        let urlString = "\(APIService.shared.baseURL)/advanced-layout/\(pageSlug)"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10

        // Add auth token if available
        if let token = AuthManager.shared.authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await APIService.shared.session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw URLError(.badServerResponse)
        }

        // Log cache header from backend
        if let cacheHit = httpResponse.value(forHTTPHeaderField: "X-Cache") {
            AppLogger.debug("[SDUI] Backend cache: \(cacheHit)")
        }

        // Decode components
        let components = try JSONDecoder().decode([SDUIComponent].self, from: data)

        return (components, data)
    }

    // MARK: - Legacy Combine-based Fetch (Deprecated)

    /// Original fetch method for backward compatibility
    @available(*, deprecated, message: "Use loadLayout() for cache-first behavior")
    func fetchLayout() {
        guard !isLoading else { return }

        isLoading = true
        errorMessage = nil

        let urlString = "\(APIService.shared.baseURL)/api/layout/\(pageSlug)"
        guard let url = URL(string: urlString) else {
            self.errorMessage = "Invalid URL"
            self.isLoading = false
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = AuthManager.shared.authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        APIService.shared.session.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: [SDUIComponent].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    switch completion {
                    case .finished:
                        break
                    case .failure(let error):
                        self?.errorMessage = error.localizedDescription
                        AppLogger.debug("[SDUI] Error: \(error)")
                    }
                },
                receiveValue: { [weak self] components in
                    self?.components = components
                }
            )
            .store(in: &cancellables)
    }

    // MARK: - Cache Management

    /// Force refresh from network, ignoring cache
    func forceRefresh() {
        fetchTask?.cancel()
        fetchTask = Task {
            isLoading = true
            errorMessage = nil

            // Check connectivity first
            guard NetworkMonitor.shared.isConnected else {
                self.errorMessage = "You're offline. Cannot refresh."
                isLoading = false
                return
            }

            do {
                let (freshComponents, rawData) = try await fetchFromNetworkWithRawData()
                self.components = freshComponents
                self.isFromCache = false

                // Update cache
                if let rawData = rawData {
                    let slug = self.pageSlug
                    Task.detached {
                        await SDUICacheManager.shared.saveSDUI(
                            key: slug,
                            jsonData: rawData
                        )
                    }
                }
            } catch {
                self.errorMessage = error.localizedDescription
            }

            isLoading = false
        }
    }

    /// Clear local cache for this page
    func clearCache() async {
        await SDUICacheManager.shared.clearCache(
            key: pageSlug,
            userId: nil
        )
    }
}
