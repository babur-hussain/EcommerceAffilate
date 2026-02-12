import Combine
import SwiftUI

@MainActor
class SearchViewModel: ObservableObject {
    @Published var query: String = ""
    @Published var trendingTerms: [String] = []
    @Published var searchState: SearchState = .idle
    @Published var globalResults: GlobalSearchResponse?

    private var cancellables = Set<AnyCancellable>()
    private var categoryId: String?  // Optional filter

    enum SearchState {
        case idle
        case loading
        case results
        case error(String)
    }

    init(categoryId: String? = nil) {
        self.categoryId = categoryId
        // Debounce query
        $query
            .debounce(for: .milliseconds(500), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] val in
                Task {
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
            print("Failed to fetch trending: \(error)")
        }
    }

    func performSearch(query: String) async {
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else {
            self.searchState = .idle
            self.globalResults = nil
            return
        }

        self.searchState = .loading
        do {
            let results: GlobalSearchResponse

            if self.categoryId == "grocery" {
                // Use dedicated grocery search endpoint
                results = try await APIService.shared.fetchGrocerySearch(query: query)
            } else {
                // Pass categoryId to APIService if available (assuming API supports it)
                // For now, we'll just search globally but in future we can add category filter
                results = try await APIService.shared.fetchGlobalSearch(query: query)
            }

            // Client-side filtering if API doesn't support it yet (Optional optimization)
            /*
            if let categoryId = categoryId {
                // This would require results to have category IDs, which they might not fully have yet.
                // For now, rely on global search.
            }
            */

            self.globalResults = results
            self.searchState = .results
        } catch {
            self.searchState = .error(error.localizedDescription)
        }
    }
}
