import Combine
import CoreLocation
// import FirebaseCore
import Foundation
import SwiftUI

#if canImport(UIKit)
  import UIKit
#endif
// Note: AppLogger, AppEnvironment, Product, etc. are assumed to be available in the module scope.

// MARK: - API Service
public class APIService {
  public static let shared = APIService()

  public let session: URLSession

  private init() {
    // Configure Cache (50 MB Memory, 200 MB Disk)
    let cacheSizeMemory = 50 * 1024 * 1024
    let cacheSizeDisk = 200 * 1024 * 1024
    let cache = URLCache(
      memoryCapacity: cacheSizeMemory, diskCapacity: cacheSizeDisk, diskPath: "api_cache")

    let config = URLSessionConfiguration.default
    config.urlCache = cache
    config.requestCachePolicy = .useProtocolCachePolicy
    // Fix #15: Prevent 60s hangs — mobile users abandon long before
    config.timeoutIntervalForRequest = 15
    config.timeoutIntervalForResource = 30

    self.session = URLSession(configuration: config)
  }

  public enum APIError: Error {
    case invalidURL
    case serverError
    case decodingError
    case notAuthenticated
    case custom(message: String)
  }

  // Use environment-based configuration for production/development switching
  public var baseURL: String { AppEnvironment.current.apiBaseURL }
  public var imageHost: String { AppEnvironment.current.imageHost }

  func fetchCategoryDetails(id: String) async throws -> CategoryModel {
    let url = try makeURL("/categories/\(id)")

    // Create Request
    var request = URLRequest(url: url)
    request.cachePolicy = .useProtocolCachePolicy  // Try network, fallback to cache if server allows

    // Attempt Network Request with Fallback
    do {
      let (data, response) = try await session.data(for: request)

      guard let httpResponse = response as? HTTPURLResponse,
        (200...299).contains(httpResponse.statusCode)
      else {
        throw APIError.serverError
      }
      return try JSONDecoder().decode(CategoryModel.self, from: data)
    } catch {
      // Network failed, try strictly from cache
      AppLogger.warning("Network failed for \(url). Attempting to load from cache.")
      request.cachePolicy = .returnCacheDataDontLoad
      if let cachedResponse = session.configuration.urlCache?.cachedResponse(for: request) {
        AppLogger.info("✅ Loaded cached response for \(url)")
        return try JSONDecoder().decode(CategoryModel.self, from: cachedResponse.data)
      }
      throw error  // Rethrow original network error if no cache
    }
  }

  func fetchProductDetails(id: String) async throws -> Product? {
    let url = try makeURL("/products/\(id)")

    let (data, response) = try await session.data(for: URLRequest(url: url))

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

    var request = URLRequest(url: url)
    request.cachePolicy = .useProtocolCachePolicy

    let data: Data
    let response: URLResponse

    do {
      (data, response) = try await session.data(for: request)
    } catch {
      AppLogger.warning("Network failed for \(url). Attempting cache.")
      request.cachePolicy = .returnCacheDataDontLoad
      if let cached = session.configuration.urlCache?.cachedResponse(for: request) {
        data = cached.data
        response = cached.response
        AppLogger.info("✅ Loaded cached products")
      } else {
        throw error
      }
    }

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

  /// Fetch grocery products from the dedicated grocery_products collection
  func fetchGroceryProducts(limit: Int = 20) async throws -> [Product] {
    let queryItems = [URLQueryItem(name: "limit", value: "\(limit)")]
    let url = try makeURL("/products/public/grocery", queryItems: queryItems)

    AppLogger.debug("🛒 Fetching grocery products from: \(url.absoluteString)")

    let (rawData, response) = try await session.data(from: url)

    // Fix #14: Check status code — was silently ignoring 404/500
    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      AppLogger.error(
        "🛒 Grocery fetch failed with status: \((response as? HTTPURLResponse)?.statusCode ?? -1)")
      throw APIError.serverError
    }
    let data = rawData

    // Debug: Print raw JSON
    if let jsonString = String(data: data, encoding: .utf8) {
      AppLogger.debug("🛒 fetchGroceryProducts JSON: \(jsonString.prefix(500))...")
    }

    // The endpoint returns { products: [...], total, page, pages }
    // Extract the "products" array from the response dictionary
    guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
      let productsArray = json["products"]
    else {
      AppLogger.error("🛒 Failed to parse grocery response as dictionary")
      return []
    }

    let productsData = try JSONSerialization.data(withJSONObject: productsArray)
    let products = try JSONDecoder().decode([Product].self, from: productsData)
    AppLogger.info("🛒 Decoded \(products.count) grocery products")
    return products
  }

  /// Fetch products filtered by multiple sub-category IDs
  func fetchProductsBySubCategoryIds(_ ids: [String], limit: Int = 20) async throws -> [Product] {
    // Construct query items: limit, and multiple 'subCategory' params
    var queryItems = [URLQueryItem(name: "limit", value: "\(limit)")]

    // Add each ID as a separate 'subCategory' query parameter
    // Comma separated for Node/Express backend
    let idsString = ids.joined(separator: ",")
    queryItems.append(URLQueryItem(name: "subCategory", value: idsString))

    let url = try makeURL("/products/public/grocery", queryItems: queryItems)

    AppLogger.debug("🛒 Fetching products by subCategoryIds: \(url.absoluteString)")

    let (data, response) = try await session.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      AppLogger.error(
        "❌ Failed to fetch products by subCategoryIds. Status: \((response as? HTTPURLResponse)?.statusCode ?? -1)"
      )
      throw APIError.serverError
    }

    // Debug: Print raw JSON
    if let jsonString = String(data: data, encoding: .utf8) {
      AppLogger.debug("📦 fetchProductsBySubCategoryIds JSON: \(jsonString.prefix(500))...")
    }

    // Reuse existing decoding logic (Array or ProductResponse)
    // For simplicity, let's assume standard Product array or ProductResponse wrapper
    struct ProductResponse: Decodable {
      let products: [Product]
    }

    if let products = try? JSONDecoder().decode([Product].self, from: data) {
      return products
    }

    if let res = try? JSONDecoder().decode(ProductResponse.self, from: data) {
      return res.products
    }

    throw APIError.decodingError
  }

  func fetchSubCategories(parentId: String) async throws -> [SubCategory] {
    // Use the live endpoint: /categories/:idOrSlug/subcategories
    let url = try makeURL("/categories/\(parentId)/subcategories")

    AppLogger.debug("Fetching subcategories from: \(url.absoluteString)")

    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.cachePolicy = .useProtocolCachePolicy

    let data: Data
    let response: URLResponse

    do {
      (data, response) = try await session.data(for: request)
    } catch {
      // Fallback to cache
      request.cachePolicy = .returnCacheDataDontLoad
      if let cached = session.configuration.urlCache?.cachedResponse(for: request) {
        data = cached.data
        response = cached.response
        AppLogger.info("✅ Loaded cached subcategories")
      } else {
        throw error
      }
    }

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

    let (data, response) = try await session.data(for: URLRequest(url: url))

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

  public func fetchGrocerySearch(query: String) async throws -> GlobalSearchResponse {
    let url = try makeURL("/search/grocery", queryItems: [URLQueryItem(name: "q", value: query)])

    let (data, response) = try await session.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    if let jsonString = String(data: data, encoding: .utf8) {
      AppLogger.debug("🔍 fetchGrocerySearch Response: \(jsonString)")
    }
    return try JSONDecoder().decode(GlobalSearchResponse.self, from: data)
  }

  public func fetchTrendingTerms() async throws -> [String] {
    let url = try makeURL("/search/trending")

    let (data, response) = try await session.data(for: URLRequest(url: url))

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

    let (data, response) = try await session.data(for: URLRequest(url: url))

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

    let (data, response) = try await session.data(for: request)

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

    let (data, response) = try await session.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse else {
      throw APIError.serverError
    }

    if httpResponse.statusCode == 401 {
      AppLogger.error("Session expired (401). Logging out.")
      await MainActor.run {
        AuthManager.shared.logout()
      }
      throw APIError.custom(message: "Session expired. Please log in again.")
    }

    if !(200...299).contains(httpResponse.statusCode) {
      if let responseString = String(data: data, encoding: .utf8) {
        AppLogger.error(
          "Save Address Failed: Status \(httpResponse.statusCode), Body: \(responseString)")
      } else {
        AppLogger.error("Save Address Failed: Status \(httpResponse.statusCode)")
      }
      throw APIError.serverError
    }

    return try JSONDecoder().decode(UserAddress.self, from: data)
  }

  // MARK: - Affiliate Links
  struct AffiliateLinkResponse: Decodable {
    let success: Bool
    let link: String
    let message: String?
    let isNew: Bool?
  }

  func generateAffiliateLink(productId: String, productName: String) async throws -> String {
    guard AuthManager.shared.isAuthenticated else {
      throw APIError.notAuthenticated
    }

    let url = try makeURL("/influencer/affiliate-link")

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    if let token = AuthManager.shared.authToken {
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let body: [String: Any] = [
      "productId": productId,
      "productName": productName,
    ]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    let (data, response) = try await session.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse else {
      throw APIError.serverError
    }

    if httpResponse.statusCode == 401 {
      throw APIError.custom(message: "Authentication failed. Please try again.")
    }

    if !(200...299).contains(httpResponse.statusCode) {
      if let responseString = String(data: data, encoding: .utf8) {
        AppLogger.error(
          "Generate Affiliate Link Failed: Status \(httpResponse.statusCode), Body: \(responseString)"
        )
      }
      throw APIError.serverError
    }

    let result = try JSONDecoder().decode(AffiliateLinkResponse.self, from: data)
    return result.link
  }
  // MARK: - Fix #4: Central 401 Handler
  /// Checks response for 401 and auto-logs out. Returns data for further processing.
  func handleResponse(_ data: Data, _ response: URLResponse) throws -> Data {
    guard let httpResponse = response as? HTTPURLResponse else {
      throw APIError.serverError
    }
    if httpResponse.statusCode == 401 {
      Task { @MainActor in
        AppLogger.error("Session expired (401). Logging out.")
        AuthManager.shared.logout()
      }
      throw APIError.custom(message: "Session expired. Please log in again.")
    }
    guard (200...299).contains(httpResponse.statusCode) else {
      let body = String(data: data, encoding: .utf8) ?? "No body"
      AppLogger.error("❌ Server error \(httpResponse.statusCode): \(body)")
      throw APIError.serverError
    }
    return data
  }

  // MARK: - Private Helper
  private func makeURL(_ path: String, queryItems: [URLQueryItem]? = nil) throws -> URL {
    guard var components = URLComponents(string: baseURL) else {
      AppLogger.error("Invalid base URL: \(baseURL)")
      throw APIError.invalidURL
    }

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

  func fetchLayout(slug: String, forceRefresh: Bool = false) async throws -> AdvancedLayoutResponse?
  {
    // [OVERRIDE] Force the Fashion layout locally as the user skipped backend DB update.
    let targetSlug = slug == "fashion-women" ? "women" : slug

    // [OVERRIDE] Grocery Listing (PLP)
    if slug.hasPrefix("grocery-listing") || slug == "grocery-plp" {
      if let url = Bundle.main.url(forResource: "common_grocery_listing", withExtension: "json"),
        let data = try? Data(contentsOf: url),
        let components = try? JSONDecoder().decode([SDUIComponent].self, from: data)
      {

        // Inject category ID from slug if possible (e.g. grocery-listing-CAT123)
        // For now, just return the template
        return AdvancedLayoutResponse(
          slug: slug, name: "Grocery Listing", isActive: true, components: components)
      }
    }

    // 1. Try Network Request
    let url = try makeURL("/advanced-layout/\(targetSlug)")
    AppLogger.debug("Fetching layout from: \(url.absoluteString) (Force Refresh: \(forceRefresh))")

    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    if forceRefresh {
      request.cachePolicy = .reloadIgnoringLocalCacheData
    }

    let data: Data
    let response: URLResponse

    do {
      (data, response) = try await session.data(for: request)
    } catch {
      // Network failed, try strictly from cache
      AppLogger.warning("Network failed for \(url). Attempting to load from cache.")
      request.cachePolicy = .returnCacheDataDontLoad
      if let cachedResponse = session.configuration.urlCache?.cachedResponse(for: request) {
        AppLogger.info("✅ Loaded cached layout for \(url)")
        data = cachedResponse.data
        response = cachedResponse.response
      } else {
        throw error  // Rethrow original network error if no cache
      }
    }

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
  }
  // MARK: - Stories
  func fetchMyStories() async throws -> [Story] {
    guard AuthManager.shared.isAuthenticated else {
      throw APIError.notAuthenticated
    }

    let url = try makeURL("/stories/my")
    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    if let token = AuthManager.shared.authToken {
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let (data, response) = try await session.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    struct StoryResponse: Decodable {
      let success: Bool
      let data: [Story]
    }

    let result = try JSONDecoder().decode(StoryResponse.self, from: data)
    return result.data
  }
}

// MARK: - Search View Model
// SearchViewModel moved to Sources/ViewModels/SearchViewModel.swift

struct AdvancedLayoutResponse: Codable {
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

  // Restore memberwise initializer lost due to custom init(from:)
  public init(
    id: String, name: String, slug: String, image: String?, icon: String?, parentCategory: String?,
    group: String?, subCategoryGroupOrder: [String]?, attributes: [CategoryAttribute]?
  ) {
    self.id = id
    self.name = name
    self.slug = slug
    self.image = image
    self.icon = icon
    self.parentCategory = parentCategory
    self.group = group
    self.subCategoryGroupOrder = subCategoryGroupOrder
    self.attributes = attributes
  }

  // Custom decoding to handle parentCategory as String or Object
  public init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    id = try container.decode(String.self, forKey: .id)
    name = try container.decode(String.self, forKey: .name)
    slug = try container.decode(String.self, forKey: .slug)
    image = try? container.decode(String.self, forKey: .image)
    icon = try? container.decode(String.self, forKey: .icon)
    group = try? container.decode(String.self, forKey: .group)
    subCategoryGroupOrder = try? container.decode([String].self, forKey: .subCategoryGroupOrder)
    attributes = try? container.decode([CategoryAttribute].self, forKey: .attributes)

    // Handle parentCategory: String or Object
    if let parentId = try? container.decode(String.self, forKey: .parentCategory) {
      parentCategory = parentId
    } else if let parentObj = try? container.decode(CategoryParentRef.self, forKey: .parentCategory)
    {
      parentCategory = parentObj._id
    } else {
      parentCategory = nil
    }
  }

  // Helper struct for decoding parent object
  struct CategoryParentRef: Decodable {
    let _id: String
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

  // Grocery endpoint omits categories and brands arrays
  enum CodingKeys: String, CodingKey {
    case products, categories, brands, suggestions
  }

  public init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    products = (try? container.decode([SearchResultItem].self, forKey: .products)) ?? []
    categories = (try? container.decode([SearchResultItem].self, forKey: .categories)) ?? []
    brands = (try? container.decode([SearchResultItem].self, forKey: .brands)) ?? []
    suggestions = (try? container.decode([SearchSuggestion].self, forKey: .suggestions)) ?? []
  }
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
  public let mrp: Double?

  // Computed helper for display name
  public var displayName: String {
    return title ?? name ?? "Unknown"
  }

  // Handle both "id" (global search) and "_id" (grocery search)
  enum CodingKeys: String, CodingKey {
    case id, _id, title, name, image, price, rating, brand, category, mrp
    case primaryImage
  }

  public init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    // Try "id" first, then "_id"
    if let idVal = try? container.decode(String.self, forKey: .id) {
      id = idVal
    } else if let idVal = try? container.decode(String.self, forKey: ._id) {
      id = idVal
    } else {
      id = UUID().uuidString
    }
    title = try? container.decode(String.self, forKey: .title)
    name = try? container.decode(String.self, forKey: .name)
    // Try "image" first, then "primaryImage" (grocery uses both)
    if let img = try? container.decode(String.self, forKey: .image), !img.isEmpty {
      image = img
    } else {
      image = try? container.decode(String.self, forKey: .primaryImage)
    }
    price = try? container.decode(Double.self, forKey: .price)
    rating = try? container.decode(Double.self, forKey: .rating)
    brand = try? container.decode(String.self, forKey: .brand)
    category = try? container.decode(String.self, forKey: .category)
    mrp = try? container.decode(Double.self, forKey: .mrp)
  }
}

public struct SearchSuggestion: Decodable, Identifiable {
  // Unique composite ID for SwiftUI List (satisfies Identifiable)
  public var id: String { text + type + (suggestionId ?? "") }

  public let text: String
  public let type: String

  // Backend ID field — optional because grocery suggestions don't include it
  public let suggestionId: String?

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

extension APIService.APIError: LocalizedError {
  public var errorDescription: String? {
    switch self {
    case .custom(let message): return message
    case .notAuthenticated: return "Please log in to continue."
    case .serverError: return "Server error. Please try again."
    case .decodingError: return "Data processing error."
    case .invalidURL: return "Invalid URL."
    }
  }
}
