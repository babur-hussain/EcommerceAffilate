import Combine
import CoreLocation
// import FirebaseCore
import Foundation
import SwiftUI

#if canImport(UIKit)
  import UIKit
#endif

// MARK: - API Service
public class APIService {
  public static let shared = APIService()

  public enum APIError: Error {
    case invalidURL
    case serverError
    case decodingError
    case notAuthenticated
  }

  // Use environment-based configuration for production/development switching
  public var baseURL: String { AppEnvironment.current.apiBaseURL }
  public var imageHost: String { AppEnvironment.current.imageHost }

  func fetchCategoryDetails(id: String) async throws -> CategoryModel {
    let url = try makeURL("/categories/\(id)")

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode(CategoryModel.self, from: data)
  }

  func fetchProductDetails(id: String) async throws -> Product? {
    let url = try makeURL("/products/\(id)")

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      // If 404, return nil
      if (response as? HTTPURLResponse)?.statusCode == 404 {
        return nil
      }
      throw APIError.serverError
    }

    // Debug JSON
    if let jsonString = String(data: data, encoding: .utf8) {
      AppLogger.debug("Product JSON for ID \(id): \(jsonString)")
    }

    return try JSONDecoder().decode(Product.self, from: data)
  }

  func fetchProducts(limit: Int = 20, categoryId: String? = nil, subCategoryId: String? = nil)
    async throws -> [Product]
  {
    // Logic matching RN: If subCat is present, use it. Else use categoryId.
    var queryItems = [URLQueryItem(name: "limit", value: "\(limit)")]
    if let sub = subCategoryId {
      queryItems.append(URLQueryItem(name: "category", value: sub))
    } else if let cat = categoryId {
      queryItems.append(URLQueryItem(name: "category", value: cat))
    }

    let url = try makeURL("/products", queryItems: queryItems)

    // Helper struct for decoding dictionary response
    struct ProductResponse: Decodable {
      let products: [Product]
    }

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    // Debug: Print raw JSON
    if let jsonString = String(data: data, encoding: .utf8) {
      AppLogger.debug("📦 fetchProducts JSON: \(jsonString.prefix(500))...")
    }

    // Try decoding as Array first (most common for this API)
    do {
      let products = try JSONDecoder().decode([Product].self, from: data)
      AppLogger.info("✅ Decoded \(products.count) products directly")
      return products
    } catch let arrayError {
      // If array decoding failed, check if it was because it's actually a dictionary
      if (try? JSONDecoder().decode(ProductResponse.self, from: data)) != nil {
        // It IS a dictionary, so re-try decoding as response (or just fall through)
      } else {
        // It was likely an array but with invalid items. Throw the ARRAY error.
        // Unless the data is clearly a dictionary (starts with '{').
        if let jsonStr = String(data: data, encoding: .utf8)?.trimmingCharacters(
          in: .whitespacesAndNewlines), jsonStr.hasPrefix("{")
        {
          // Try decoding as ProductResponse
          do {
            let res = try JSONDecoder().decode(ProductResponse.self, from: data)
            return res.products
          } catch {
            throw error/// Throw the dictionary error
          }
        }

        // It looks like an array, so throw the array error to see WHICH field failed
        AppLogger.error("❌ Failed to decode Product Array: \(arrayError)")
        throw arrayError
      }

      // Fallback for Dictionary (ProductResponse)
      let res = try JSONDecoder().decode(ProductResponse.self, from: data)
      return res.products
    }
  }

  func fetchSubCategories(parentId: String) async throws -> [SubCategory] {
    // Use the live endpoint: /categories/:idOrSlug/subcategories
    let url = try makeURL("/categories/\(parentId)/subcategories")

    AppLogger.debug("Fetching subcategories from: \(url.absoluteString)")

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    let (data, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      AppLogger.error(
        "Error fetching subcategories. Status: \((response as? HTTPURLResponse)?.statusCode ?? -1)")
      // If strictly 404, maybe return empty list? For now throw error.
      throw APIError.serverError
    }

    return try JSONDecoder().decode([SubCategory].self, from: data)
  }

  public func fetchGlobalSearch(query: String) async throws -> GlobalSearchResponse {
    let url = try makeURL("/search/global", queryItems: [URLQueryItem(name: "q", value: query)])

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    if let jsonString = String(data: data, encoding: .utf8) {
      AppLogger.debug("🔍 fetchGlobalSearch Response: \(jsonString)")
    }
    return try JSONDecoder().decode(GlobalSearchResponse.self, from: data)
  }

  public func fetchTrendingTerms() async throws -> [String] {
    let url = try makeURL("/search/trending")

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode([String].self, from: data)
  }

  func fetchCategories() async throws -> [CategoryModel] {
    // /api/categories endpoint returns all categories
    let url = try makeURL("/categories")

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode([CategoryModel].self, from: data)
  }

  func fetchAddresses() async throws -> [UserAddress] {
    let url = try makeURL("/addresses")

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    // Add auth header
    if let token = AuthManager.shared.authToken {
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let (data, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode([UserAddress].self, from: data)
  }

  func saveAddress(_ address: UserAddress) async throws -> UserAddress {
    guard AuthManager.shared.isAuthenticated else {
      throw APIError.notAuthenticated
    }

    let url = try makeURL("/addresses")

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    // Add auth header
    if let token = AuthManager.shared.authToken {
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let encoder = JSONEncoder()
    request.httpBody = try encoder.encode(address)

    let (data, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode(UserAddress.self, from: data)
  }
  // MARK: - Private Helper
  private func makeURL(_ path: String, queryItems: [URLQueryItem]? = nil) throws -> URL {
    guard var components = URLComponents(string: baseURL) else {
      AppLogger.error("Invalid base URL: \(baseURL)")
      throw APIError.invalidURL
    }

    // Append path safely
    // components.path deals with unencoded strings and will handle encoding when accessing .url
    let cleanPath = path.hasPrefix("/") ? path : "/" + path
    components.path.append(cleanPath)

    if let items = queryItems {
      components.queryItems = items
    }

    guard let url = components.url else {
      AppLogger.error(
        "Failed to construct URL with path: \(path) and query: \(String(describing: queryItems))")
      throw APIError.invalidURL
    }

    return url
  }

  func fetchLayout(slug: String) async throws -> AdvancedLayoutResponse? {
    // [OVERRIDE] Force the Fashion layout locally as the user skipped backend DB update.
    let targetSlug = slug == "fashion-women" ? "women" : slug

    // 1. Try Network Request
    do {
      let url = try makeURL("/advanced-layout/\(targetSlug)")
      AppLogger.debug("Fetching layout from: \(url.absoluteString)")

      var request = URLRequest(url: url)
      request.httpMethod = "GET"

      let (data, response) = try await URLSession.shared.data(for: request)

      guard let httpResponse = response as? HTTPURLResponse,
        (200...299).contains(httpResponse.statusCode)
      else {
        throw APIError.serverError
      }

      // Try decoding as Object (Standard)
      if let responseObj = try? JSONDecoder().decode(AdvancedLayoutResponse.self, from: data) {
        return responseObj
      }

      // Try decoding as Array (Legacy/Direct)
      if let components = try? JSONDecoder().decode([SDUIComponent].self, from: data) {
        return AdvancedLayoutResponse(
          slug: slug,
          name: slug,
          isActive: true,
          components: components
        )
      }

      throw APIError.decodingError

    } catch {
      AppLogger.error("⚠️ Layout fetch failed for \(slug): \(error). Attempting local fallback.")

      // 2. Local Fallback (If API is down or returns 404/Error)
      // Hardcoded check for known pages
      if slug == "women" || slug == "fashion-women" {
        if let data = LocalData.womenLayoutJSON.data(using: .utf8),
          let components = try? JSONDecoder().decode([SDUIComponent].self, from: data)
        {
          AppLogger.info("✅ Loaded local fallback layout for \(slug)")
          return AdvancedLayoutResponse(
            slug: slug,
            name: slug,
            isActive: true,
            components: components
          )
        }
      }

      // If no fallback exists, return nil (which triggers "No content found")
      return nil
    }
  }
}

// MARK: - Search View Model
@MainActor
public class SearchViewModel: ObservableObject {
  @Published public var query: String = ""
  @Published public var trendingTerms: [String] = []
  @Published public var searchState: SearchState = .idle
  @Published public var globalResults: GlobalSearchResponse?

  private var cancellables = Set<AnyCancellable>()

  public enum SearchState {
    case idle
    case loading
    case results
    case error(String)
  }

  public init() {
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

  public func fetchTrending() async {
    do {
      self.trendingTerms = try await APIService.shared.fetchTrendingTerms()
    } catch {
      AppLogger.error("Failed to fetch trending: \(error)")
    }
  }

  public func performSearch(query: String) async {
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

struct AdvancedLayoutResponse: Decodable {
  let slug: String
  let name: String
  let isActive: Bool
  let components: [SDUIComponent]

  enum CodingKeys: String, CodingKey {
    case slug, name, isActive, components
  }
}

// Renamed to CategoryModel to avoid conflict with potential SwiftUI/Foundation types if any
struct CategoryModel: Decodable, Identifiable {
  let id: String
  let name: String
  let slug: String
  let image: String?
  let icon: String?
  let parentCategory: String?
  let group: String?
  let subCategoryGroupOrder: [String]?
  let attributes: [CategoryAttribute]?

  enum CodingKeys: String, CodingKey {
    case id = "_id"
    case name, slug, image, icon, parentCategory, group, subCategoryGroupOrder, attributes
  }
}

struct CategoryAttribute: Decodable, Hashable {
  let name: String?
  let values: [String]?
  let attributeId: AttributeDetail?
}

struct AttributeDetail: Decodable, Hashable {
  let _id: String
  let name: String
  let values: [String]
  let isFilterable: Bool?
}

public struct GlobalSearchResponse: Decodable {
  public let products: [SearchResultItem]
  public let categories: [SearchResultItem]
  public let brands: [SearchResultItem]
  public let suggestions: [SearchSuggestion]
}

public struct SearchResultItem: Decodable, Identifiable {
  public let id: String
  public let title: String?
  public let name: String?
  public let image: String?
  public let price: Double?
  public let rating: Double?
  public let brand: String?
  public let category: String?

  // Computed helper for display name
  public var displayName: String {
    return title ?? name ?? "Unknown"
  }
}

public struct SearchSuggestion: Decodable, Identifiable {
  // Unique composite ID for SwiftUI List (satisfies Identifiable)
  public var id: String { text + type + suggestionId }

  public let text: String
  public let type: String

  // Backend ID field (renamed to avoid conflict with Identifiable.id)
  public let suggestionId: String

  enum CodingKeys: String, CodingKey {
    case text, type
    case suggestionId = "id"
  }
}

// MARK: - ==========================================
// MARK: - CONSOLIDATED MODELS AND SERVICES
// MARK: - ==========================================

// MARK: - Product Model

// Product model moved to Models/Product.swift

// MARK: - Helper Models for Product

// ProductOffer model moved to Models/ProductModels.swift

// TrustBadge model moved to Models/ProductModels.swift

public struct LastChanceOffer: Identifiable, Codable, Hashable {
  public let _id: String
  public let title: String
  public let description: String?
  public let originalPrice: Double
  public let offerPrice: Double
  public let discountPercentage: Int?
  public let tag: String?
  public let features: [String]?
  public let image: String?

  public var id: String { _id }

  public init(
    _id: String,
    title: String,
    description: String?,
    originalPrice: Double,
    offerPrice: Double,
    discountPercentage: Int?,
    tag: String?,
    features: [String]?,
    image: String?
  ) {
    self._id = _id
    self.title = title
    self.description = description
    self.originalPrice = originalPrice
    self.offerPrice = offerPrice
    self.discountPercentage = discountPercentage
    self.tag = tag
    self.features = features
    self.image = image
  }

  // For selection tracking
  public func tempId(index: Int) -> String {
    return _id.isEmpty ? "temp-\(index)" : _id
  }
}

// MARK: - Sub Category Model

public struct SubCategory: Identifiable, Decodable {
  public let id: String
  public let name: String
  public let image: String?
  public let icon: String?
  public let slug: String?

  enum CodingKeys: String, CodingKey {
    case id = "_id"
    case name, image, icon, slug
  }

  public init(id: String, name: String, image: String?, icon: String?, slug: String?) {
    self.id = id
    self.name = name
    self.image = image
    self.icon = icon
    self.slug = slug
  }
}

// MARK: - Address Model

public struct UserAddress: Identifiable, Codable, Hashable {
  public let _id: String
  public var id: String { _id }
  public let userId: String
  public let name: String
  public let phone: String
  public let addressLine1: String
  public let addressLine2: String?
  public let city: String
  public let state: String
  public let pincode: String
  public let country: String
  public let isDefault: Bool

  enum CodingKeys: String, CodingKey {
    case _id, userId, name, phone, addressLine1, addressLine2, city, state, pincode, country,
      isDefault
  }

  public init(
    _id: String = UUID().uuidString,
    userId: String = "",
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String? = nil,
    city: String,
    state: String,
    pincode: String,
    country: String = "India",
    isDefault: Bool = false
  ) {
    self._id = _id
    self.userId = userId
    self.name = name
    self.phone = phone
    self.addressLine1 = addressLine1
    self.addressLine2 = addressLine2
    self.city = city
    self.state = state
    self.pincode = pincode
    self.country = country
    self.isDefault = isDefault
  }
}

// MARK: - SDUI Component Model

// SDUI Component Model moved to Models/SDUIComponent.swift

// AnyCodable moved to Utils/AnyCodable.swift
