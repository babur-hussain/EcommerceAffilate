import Combine
import Foundation

class SDUIPageViewModel: ObservableObject {
    @Published var components: [SDUIComponent] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil

    private let pageSlug: String
    private var cancellables = Set<AnyCancellable>()

    init(pageSlug: String) {
        self.pageSlug = pageSlug
    }

    func fetchLayout() {
        guard !isLoading else { return }

        isLoading = true
        errorMessage = nil

        // Use APIService to fetch layout
        // Expected endpoint: /api/layout/{pageSlug}
        // Response format expected: [SDUIComponent] (Array)

        let urlString = "\(APIService.shared.baseURL)/api/layout/\(pageSlug)"
        guard let url = URL(string: urlString) else {
            self.errorMessage = "Invalid URL"
            self.isLoading = false
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add Auth Token if available
        if let token = KeychainManager.shared.authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: [SDUIComponent].self, decoder: JSONDecoder())  // Changed to expect Array
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    switch completion {
                    case .finished:
                        break
                    case .failure(let error):
                        self?.errorMessage = error.localizedDescription
                        print("SDUIPageViewModel Error: \(error)")
                    // Attempt fallback decoding if array fails (legacy support)
                    // This block can be expanded if we need to support both formats
                    }
                },
                receiveValue: { [weak self] components in
                    self?.components = components
                }
            )
            .store(in: &cancellables)
    }
}

// Removed PageLayoutResponse as we now expect a direct array
