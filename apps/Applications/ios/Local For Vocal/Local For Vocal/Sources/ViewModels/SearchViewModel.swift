import Combine
import SwiftUI

@MainActor
class SearchViewModel: ObservableObject {
    @Published var query: String = ""
    @Published var trendingTerms: [String] = []
    @Published var searchState: SearchState = .idle
    @Published var globalResults: GlobalSearchResponse?
    @Published var groceryResults: GlobalSearchResponse?

    private var cancellables = Set<AnyCancellable>()
    private var categoryId: String?  // Optional filter
    // Fix #21: Track active search task for cancellation
    private var searchTask: Task<Void, Never>?

    enum SearchState {
        case idle
        case loading
        case results
        case error(String)
    }

    /// If true, search both products AND grocery in parallel (unified search)
    var isUnifiedSearch: Bool {
        categoryId == nil
    }

    init(categoryId: String? = nil) {
        self.categoryId = categoryId
        // Debounce query
        $query
            .debounce(for: .milliseconds(500), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] val in
                // Fix #21: Cancel previous search before starting new one
                self?.searchTask?.cancel()
                self?.searchTask = Task {
                    await self?.performSearch(query: val)
                }
            }
            .store(in: &cancellables)

        Task {
            await fetchTrending()
        }
    }

    func fetchTrending() async {
        do {
            self.trendingTerms = try await APIService.shared.fetchTrendingTerms()
        } catch {
            AppLogger.debug("Failed to fetch trending: \(error)")
        }
    }

    func performSearch(query: String) async {
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else {
            self.searchState = .idle
            self.globalResults = nil
            self.groceryResults = nil
            return
        }

        self.searchState = .loading
        do {
            if self.categoryId == "grocery" {
                // Grocery-only search
                let results = try await APIService.shared.fetchGrocerySearch(query: query)
                self.globalResults = results
                self.groceryResults = nil
            } else if isUnifiedSearch {
                // Unified search: fetch BOTH in parallel
                async let productTask = APIService.shared.fetchGlobalSearch(query: query)
                async let groceryTask = APIService.shared.fetchGrocerySearch(query: query)

                let (productResults, groceryResultsFetched) = try await (productTask, groceryTask)
                self.globalResults = productResults
                self.groceryResults = groceryResultsFetched
            } else {
                // Category-specific product search
                let results = try await APIService.shared.fetchGlobalSearch(query: query)
                self.globalResults = results
                self.groceryResults = nil
            }

            self.searchState = .results
        } catch {
            self.searchState = .error(error.localizedDescription)
        }
    }

    /// Combined flag: true if both product and grocery results are empty
    var hasNoResults: Bool {
        let productEmpty = globalResults?.products.isEmpty ?? true
        let groceryEmpty = groceryResults?.products.isEmpty ?? true
        return productEmpty && groceryEmpty
    }

    /// True if either result set has items
    var hasAnyResults: Bool {
        !hasNoResults
    }
}
