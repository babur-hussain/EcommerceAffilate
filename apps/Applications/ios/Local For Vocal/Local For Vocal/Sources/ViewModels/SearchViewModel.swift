#if false
    import Combine
    import SwiftUI

    @MainActor
    class SearchViewModel: ObservableObject {
        @Published var query: String = ""
        @Published var trendingTerms: [String] = []
        @Published var searchState: SearchState = .idle
        @Published var globalResults: GlobalSearchResponse?

        private var cancellables = Set<AnyCancellable>()

        enum SearchState {
            case idle
            case loading
            case results
            case error(String)
        }

        init() {
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
                let results = try await APIService.shared.fetchGlobalSearch(query: query)
                self.globalResults = results
                self.searchState = .results
            } catch {
                self.searchState = .error(error.localizedDescription)
            }
        }
    }
#endif
