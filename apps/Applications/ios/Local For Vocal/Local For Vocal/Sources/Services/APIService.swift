import Combine
import CoreLocation
import FirebaseCore
import Foundation
import SwiftUI

#if canImport(UIKit)
  import UIKit
#endif

// MARK: - API Service
// MARK: - API Service
public class APIService {
  public static let shared = APIService()

  // Change this to your local IP if running on device, or localhost for simulator
  // For iOS Simulator: http://localhost:4000
  // For iOS Simulator: Use LAN IP due to localhost issues
  public let baseURL = "http://192.168.29.193:4000/api"
  public let imageHost = "http://192.168.29.193:4000"

  func fetchLayout(slug: String) async throws -> AdvancedLayoutResponse? {
    // [OVERRIDE] Force the Fashion layout locally as the user skipped backend DB update.

    guard let url = URL(string: "\(baseURL)/advanced-layout/\(slug)") else {
      throw APIError.invalidURL
    }

    print("Fetching layout from: \(url.absoluteString)")

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    let (data, response) = try await URLSession.shared.data(for: request)

    if let jsonString = String(data: data, encoding: .utf8) {
      print("Received JSON for \(slug): \(jsonString)")
    }

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      print("Server Error: Status \((response as? HTTPURLResponse)?.statusCode ?? -1)")
      throw APIError.serverError
    }

    do {
      let decodedResponse = try JSONDecoder().decode(AdvancedLayoutResponse.self, from: data)
      return decodedResponse
    } catch {
      print("Decoding Error: \(error)")
      // Print JSON string for debugging
      if let jsonString = String(data: data, encoding: .utf8) {
        print("Received JSON: \(jsonString)")
      }
      throw APIError.decodingError
    }
  }

  func fetchCategoryDetails(id: String) async throws -> CategoryModel {
    guard let url = URL(string: "\(baseURL)/categories/\(id)") else {
      throw APIError.invalidURL
    }

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode(CategoryModel.self, from: data)
  }

  func fetchProductDetails(id: String) async throws -> Product? {
    guard let url = URL(string: "\(baseURL)/products/\(id)") else {
      throw APIError.invalidURL
    }

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
      print("Product JSON for ID \(id): \(jsonString)")
    }

    return try JSONDecoder().decode(Product.self, from: data)
  }

  func fetchProducts(limit: Int = 20, categoryId: String? = nil, subCategoryId: String? = nil)
    async throws -> [Product]
  {
    var components = URLComponents(string: "\(baseURL)/products")
    var queryItems = [URLQueryItem(name: "limit", value: "\(limit)")]

    // Logic matching RN: If subCat is present, use it. Else use categoryId.
    // RN also has "filters" param but for now we stick to category.
    if let sub = subCategoryId {
      queryItems.append(URLQueryItem(name: "category", value: sub))
    } else if let cat = categoryId {
      queryItems.append(URLQueryItem(name: "category", value: cat))
    }

    components?.queryItems = queryItems

    guard let url = components?.url else {
      throw APIError.invalidURL
    }

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    // Debug: Print raw JSON
    if let jsonString = String(data: data, encoding: .utf8) {
      print("📦 fetchProducts JSON: \(jsonString.prefix(500))...")
    }

    if let products = try? JSONDecoder().decode([Product].self, from: data) {
      print("✅ Decoded \(products.count) products directly")
      for p in products.prefix(2) {
        print("  - \(p.name): images=\(p.images)")
      }
      return products
    } else {
      struct ProductResponse: Decodable {
        let products: [Product]
      }
      let res = try JSONDecoder().decode(ProductResponse.self, from: data)
      print("✅ Decoded \(res.products.count) products from wrapper")
      for p in res.products.prefix(2) {
        print("  - \(p.name): images=\(p.images)")
      }
      return res.products
    }
  }

  func fetchSubCategories(parentId: String) async throws -> [SubCategory] {
    // Use the live endpoint: /categories/:idOrSlug/subcategories
    guard let url = URL(string: "\(baseURL)/categories/\(parentId)/subcategories") else {
      throw APIError.invalidURL
    }

    print("Fetching subcategories from: \(url.absoluteString)")

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    let (data, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      print(
        "Error fetching subcategories. Status: \((response as? HTTPURLResponse)?.statusCode ?? -1)")
      // If strictly 404, maybe return empty list? For now throw error.
      throw APIError.serverError
    }

    return try JSONDecoder().decode([SubCategory].self, from: data)
  }

  public func fetchGlobalSearch(query: String) async throws -> GlobalSearchResponse {
    guard let encodedQuery = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
      let url = URL(string: "\(baseURL)/search/global?q=\(encodedQuery)")
    else {
      throw APIError.invalidURL
    }

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode(GlobalSearchResponse.self, from: data)
  }

  public func fetchTrendingTerms() async throws -> [String] {
    guard let url = URL(string: "\(baseURL)/search/trending") else {
      throw APIError.invalidURL
    }

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
    guard let url = URL(string: "\(baseURL)/categories") else {
      throw APIError.invalidURL
    }

    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))

    guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode)
    else {
      throw APIError.serverError
    }

    return try JSONDecoder().decode([CategoryModel].self, from: data)
  }

  func fetchAddresses() async throws -> [UserAddress] {
    guard let url = URL(string: "\(baseURL)/addresses") else {
      throw APIError.invalidURL
    }

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

    guard let url = URL(string: "\(baseURL)/addresses") else {
      throw APIError.invalidURL
    }

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
      print("Failed to fetch trending: \(error)")
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

  // Computed helper for display name
  public var displayName: String {
    return title ?? name ?? "Unknown"
  }
}

public struct SearchSuggestion: Decodable, Identifiable {
  // Unique ID for SwiftUI List
  public var uniqueId: String { text + type + id }

  public let text: String
  public let type: String
  public let id: String
}

enum APIError: Error {
  case invalidURL
  case serverError
  case decodingError
  case notAuthenticated
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

public struct SDUIComponent: Identifiable, Decodable, Hashable {
  public let id: String
  public let type: ComponentType
  public let props: [String: AnyCodable]?
  public let style: [String: AnyCodable]?
  public let children: [SDUIComponent]?

  enum CodingKeys: String, CodingKey {
    case id, type, style, children
    case props  // JSON key is now 'props'
    case content  // Fallback key
  }

  // Custom decoding to handle missing IDs from backend
  public init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)

    // Try decoding ID, if missing generate one
    if let decodedId = try? container.decode(String.self, forKey: .id) {
      self.id = decodedId
    } else {
      self.id = UUID().uuidString
    }

    self.type = try container.decode(ComponentType.self, forKey: .type)

    // Try decoding 'props', if that fails/nil, try 'content'
    if let propsVal = try? container.decode([String: AnyCodable].self, forKey: .props) {
      self.props = propsVal
    } else {
      self.props = try? container.decode([String: AnyCodable].self, forKey: .content)
    }

    self.style = try? container.decode([String: AnyCodable].self, forKey: .style)
    self.children = try? container.decode([SDUIComponent].self, forKey: .children)
  }

  // Helper to extract specific props
  public func prop<T: Decodable>(for key: String, as type: T.Type = T.self) -> T? {
    guard let value = props?[key] else { return nil }
    return value.value as? T
  }

  // Hashable conformance
  public static func == (lhs: SDUIComponent, rhs: SDUIComponent) -> Bool {
    return lhs.id == rhs.id
  }

  public func hash(into hasher: inout Hasher) {
    hasher.combine(id)
  }
}

// MARK: - Component Types

public enum ComponentType: String, Decodable {
  case container = "Container"
  case text = "Text"
  case image = "Image"
  case button = "Button"
  case gradient = "Gradient"
  case scrollView = "ScrollView"
  case productGrid = "ProductGrid"
  case productListHorizontal = "product_list_horizontal"
  case heroCarousel = "hero_carousel"
  case curatedCollections = "curated_collections"
  case fiftyPercentOffZone = "fifty_percent_off"
  case grandKitchenSale = "grand_kitchen"
  case lightningDeals = "lightning_deals"
  case recentHistory = "recent_history"
  case groceryRow = "grocery_row"
  case activeOrders = "active_orders"
  case subCategorySlider = "sub_category_slider"
  case shoppingForOthersHub = "shopping_for_others_hub"
  case earlyBirdDeals = "early_bird_deals"
  case sankrantiFestival = "sankranti_festival"
  case shoeStealFest = "shoe_steal_fest"
  case winterClearance = "winter_clearance"
  case dealsOfTheDay = "deals_of_the_day"
  case budgetBuys = "budget_buys"
  case fashionForecast = "fashion_forecast"
  case winterCollection = "winter_collection"
  case promoPoster = "promo_poster"
  case glowForHarvest = "glow_for_harvest"
  case consultationBanner = "consultation_banner"
  case globallyLovedAlisters = "globally_loved_alisters"
  case beautyLaunchParty = "beauty_launch_party"
  case beautyTrendMore = "beauty_trend_more"
  case internetFamedBrands = "internet_famed_brands"
  case beautyKBeauty = "beauty_k_beauty"
  case beautyGlamBudget = "beauty_glam_budget"
  case sportCricketSeason = "sport_cricket_season"
  case sportWinnerBrands = "sport_winner_brands"
  case sportSupportGoals = "sport_support_goals"
  case sportGymAccessories = "sport_gym_accessories"
  case sportCombos = "sport_combos"
  case sportSavings = "sport_savings"
  case sportWishlist = "sport_wishlist"
  case furnitureDealOfDay = "furniture_deal_of_day"
  case furnitureTopBrands = "furniture_top_brands"
  case furnitureSponsorshipBanner = "furniture_sponsorship_banner"
  case furnitureGrabOrGone = "furniture_grab_or_gone"
  case furnitureShopByRoom = "furniture_shop_by_room"
  case furnitureSamarthStore = "furniture_samarth_store"
  case furnitureEmiOffers = "furniture_emi_offers"
  case furnitureTopFurnitureBrands = "furniture_top_furniture_brands"
  case furnitureShopByMaterial = "furniture_shop_by_material"
  case furnitureTrendingNow = "furniture_trending_now"
  case furnitureWishlist = "furniture_wishlist"
  case furnitureCustomerReviews = "furniture_customer_reviews"
  case furnitureEverybodyList = "furniture_everybody_list"
  case furnitureRareFinds = "furniture_rare_finds"
  case furnitureStatementPieces = "furniture_statement_pieces"
  // Service Hub Components
  case serviceHeader = "service_header"
  case serviceHeroSection = "service_hero_section"
  case serviceCategorySection = "service_category_section"
  case serviceBottomNav = "service_bottom_nav"
  case unknown

  public init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    let rawValue = try container.decode(String.self)
    self = ComponentType(rawValue: rawValue) ?? .unknown
  }
}

// MARK: - AnyCodable
public struct AnyCodable: Decodable, Hashable {
  public let value: Any

  public init(_ value: Any) {
    self.value = value
  }

  public init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    if let x = try? container.decode(String.self) {
      value = x
    } else if let x = try? container.decode(Int.self) {
      value = x
    } else if let x = try? container.decode(Double.self) {
      value = x
    } else if let x = try? container.decode(Bool.self) {
      value = x
    } else if let x = try? container.decode([AnyCodable].self) {
      value = x.map { $0.value }
    } else if let x = try? container.decode([String: AnyCodable].self) {
      var dict = [String: Any]()
      for (key, val) in x {
        dict[key] = val.value
      }
      value = dict
    } else {
      throw DecodingError.dataCorruptedError(
        in: container, debugDescription: "AnyCodable value cannot be decoded")
    }
  }

  public static func == (lhs: AnyCodable, rhs: AnyCodable) -> Bool {
    return String(describing: lhs.value) == String(describing: rhs.value)
  }

  public func hash(into hasher: inout Hasher) {
    hasher.combine(String(describing: value))
  }
}
