import Combine
import Foundation
import SwiftUI

// MARK: - Wishlist Manager
@MainActor
public class WishlistManager: ObservableObject {
    public static let shared = WishlistManager()

    @Published public var wishlistItems: [Product] = []
    @Published public var wishlistIds: Set<String> = []
    @Published public var isLoading = false
    @Published public var error: String? = nil

    private init() {}

    // MARK: - Check if product is in wishlist
    public func isInWishlist(productId: String) -> Bool {
        return wishlistIds.contains(productId)
    }

    // MARK: - Fetch Wishlist
    public func fetchWishlist() async {
        guard AuthManager.shared.isAuthenticated else { return }

        isLoading = true
        error = nil

        do {
            guard let url = URL(string: "\(APIService.shared.baseURL)/wishlist") else {
                throw APIService.APIError.invalidURL
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"

            for (key, value) in AuthManager.shared.getAuthHeader() {
                request.setValue(value, forHTTPHeaderField: key)
            }

            let (data, response) = try await APIService.shared.session.data(for: request)
            let validData = try APIService.shared.handleResponse(data, response)

            // Backend returns { wishlist: [Product] } or just [Product]
            let decoder = JSONDecoder()

            if let wrapper = try? decoder.decode(WishlistResponse.self, from: validData) {
                self.wishlistItems = wrapper.wishlist
                self.wishlistIds = Set(wrapper.wishlist.map { $0.id })
                self.isLoading = false
            } else if let products = try? decoder.decode([Product].self, from: validData) {
                self.wishlistItems = products
                self.wishlistIds = Set(products.map { $0.id })
                self.isLoading = false
            } else {
                throw APIService.APIError.decodingError
            }
        } catch {
            AppLogger.debug("Wishlist fetch error: \(error)")
            self.error = error.localizedDescription
            self.isLoading = false
        }
    }

    // MARK: - Add to Wishlist
    public func addToWishlist(productId: String) async -> Bool {
        guard AuthManager.shared.isAuthenticated else { return false }

        do {
            guard let url = URL(string: "\(APIService.shared.baseURL)/wishlist/\(productId)")
            else {
                return false
            }

            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")

            for (key, value) in AuthManager.shared.getAuthHeader() {
                request.setValue(value, forHTTPHeaderField: key)
            }

            let (_, response) = try await APIService.shared.session.data(for: request)
            let _ = try APIService.shared.handleResponse(Data(), response)

            self.wishlistIds.insert(productId)

            // Refresh wishlist to get full product data
            await fetchWishlist()
            return true
        } catch {
            AppLogger.debug("Add to wishlist error: \(error)")
            return false
        }
    }

    // MARK: - Remove from Wishlist
    public func removeFromWishlist(productId: String) async -> Bool {
        guard AuthManager.shared.isAuthenticated else { return false }

        do {
            guard let url = URL(string: "\(APIService.shared.baseURL)/wishlist/\(productId)")
            else {
                return false
            }

            var request = URLRequest(url: url)
            request.httpMethod = "DELETE"

            for (key, value) in AuthManager.shared.getAuthHeader() {
                request.setValue(value, forHTTPHeaderField: key)
            }

            let (_, response) = try await APIService.shared.session.data(for: request)
            let _ = try APIService.shared.handleResponse(Data(), response)

            self.wishlistIds.remove(productId)
            self.wishlistItems.removeAll { $0.id == productId }

            return true
        } catch {
            AppLogger.debug("Remove from wishlist error: \(error)")
            return false
        }
    }

    // MARK: - Toggle Wishlist
    public func toggleWishlist(productId: String) async -> Bool {
        if isInWishlist(productId: productId) {
            return await removeFromWishlist(productId: productId)
        } else {
            return await addToWishlist(productId: productId)
        }
    }
}

// MARK: - Response Model
private struct WishlistResponse: Decodable {
    let wishlist: [Product]
}
