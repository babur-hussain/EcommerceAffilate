import Combine
import Foundation

struct Review: Identifiable, Decodable {
    let _id: String
    let productId: String
    let userId: UserRef
    let rating: Int
    let comment: String
    let createdAt: String

    var id: String { _id }

    struct UserRef: Decodable {
        let _id: String
        let name: String
        let profileImage: String?
    }
}

class ReviewManager: ObservableObject {
    static let shared = ReviewManager()

    @Published var reviews: [Review] = []
    @Published var isLoading = false
    @Published var error: String? = nil

    private init() {}

    func fetchReviews(productId: String) async {
        await MainActor.run {
            isLoading = true
            error = nil
        }

        do {
            let url = URL(string: "\(APIService.shared.baseURL)/reviews/\(productId)")!
            var request = URLRequest(url: url)

            // Should be public endpoint, but good to add auth if available
            if let token = AuthManager.shared.authToken {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }

            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse,
                (200...299).contains(httpResponse.statusCode)
            else {
                throw URLError(.badServerResponse)
            }

            let decodedReviews = try JSONDecoder().decode([Review].self, from: data)

            await MainActor.run {
                self.reviews = decodedReviews
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = "Failed to fetch reviews"
                self.isLoading = false
            }
            print("Fetch reviews error: \(error)")
        }
    }

    func submitReview(productId: String, rating: Int, comment: String) async -> Bool {
        guard let token = AuthManager.shared.authToken else {
            return false
        }

        do {
            let url = URL(string: "\(APIService.shared.baseURL)/reviews")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")

            let body: [String: Any] = [
                "productId": productId,
                "rating": rating,
                "comment": comment,
            ]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (_, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse,
                (200...299).contains(httpResponse.statusCode)
            else {
                return false
            }

            // Refresh reviews after successful submission
            await fetchReviews(productId: productId)
            return true

        } catch {
            print("Submit review error: \(error)")
            return false
        }
    }
}
