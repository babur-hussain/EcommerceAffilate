import Foundation
import SwiftUI

// MARK: - SDUI Component Model

public struct SDUIComponent: Identifiable, Codable, Hashable {
    public let id: String  // Always a unique UUID for SwiftUI identity
    public let originalId: String  // Raw id from JSON (for logic/matching)
    public let _id: String?
    public let type: ComponentType
    public let props: [String: SDUIAnyCodable]?
    public let dataSource: [String: SDUIAnyCodable]?
    public let style: [String: SDUIAnyCodable]?
    public let children: [SDUIComponent]?
    public let isHidden: Bool?

    enum CodingKeys: String, CodingKey {
        case id, _id, type, style, children, dataSource
        case props, isHidden
        case content  // Keep for decoding compatibility
    }

    // Custom decoding to handle missing IDs from backend
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

        // Always assign a fresh UUID for SwiftUI identity — guarantees uniqueness
        // even when the same JSON is decoded multiple times or across pages.
        self.id = UUID().uuidString

        // Store the original JSON id for any logic/matching needs
        self.originalId = (try? container.decode(String.self, forKey: .id)) ?? ""

        self._id = try? container.decode(String.self, forKey: ._id)
        self.dataSource = try? container.decode([String: SDUIAnyCodable].self, forKey: .dataSource)

        self.type = try container.decode(ComponentType.self, forKey: .type)

        // Try decoding 'props', if that fails/nil, try 'content'
        if let propsVal = try? container.decode([String: SDUIAnyCodable].self, forKey: .props) {
            self.props = propsVal
        } else {
            self.props = try? container.decode([String: SDUIAnyCodable].self, forKey: .content)
        }

        self.style = try? container.decode([String: SDUIAnyCodable].self, forKey: .style)
        self.children = try? container.decode([SDUIComponent].self, forKey: .children)
        self.isHidden = try? container.decode(Bool.self, forKey: .isHidden)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        // Write originalId as "id" so re-encoded JSON stays clean
        try container.encode(originalId, forKey: .id)
        try container.encodeIfPresent(_id, forKey: ._id)
        try container.encode(type, forKey: .type)
        try container.encodeIfPresent(props, forKey: .props)
        try container.encodeIfPresent(dataSource, forKey: .dataSource)
        try container.encodeIfPresent(style, forKey: .style)
        try container.encodeIfPresent(children, forKey: .children)
        try container.encodeIfPresent(isHidden, forKey: .isHidden)
    }

    public init(
        id: String, _id: String? = nil, type: ComponentType, props: [String: SDUIAnyCodable]? = nil,
        dataSource: [String: SDUIAnyCodable]? = nil, style: [String: SDUIAnyCodable]? = nil,
        children: [SDUIComponent]? = nil, isHidden: Bool? = nil
    ) {
        // For manual creation, use a fresh UUID for SwiftUI identity
        self.id = UUID().uuidString
        self.originalId = id
        self._id = _id
        self.type = type
        self.props = props
        self.dataSource = dataSource
        self.style = style
        self.children = children
        self.isHidden = isHidden
    }

    // Helper to extract specific props
    public func prop<T: Decodable>(for key: String, as type: T.Type = T.self) -> T? {
        guard let value = props?[key] else { return nil }
        return value.value as? T
    }

    // Helper to decode array of items from AnyCodable
    public func decodeItems<T: Decodable>(for key: String, as type: [T].Type = [T].self) -> [T] {
        guard let anyCodable = props?[key] else { return [] }

        // If the value is already the expected array type
        if let directValue = anyCodable.value as? [T] {
            return directValue
        }

        // If it's an array of dictionaries (AnyCodable usually wraps [String: Any])
        // We need to re-encode and decode to get strongly typed objects
        if let dictArray = anyCodable.value as? [[String: Any]] {
            do {
                let data = try JSONSerialization.data(withJSONObject: dictArray)
                let decoded = try JSONDecoder().decode([T].self, from: data)
                return decoded
            } catch {
                AppLogger.debug("Error decoding items for key \(key): \(error)")
                return []
            }
        }

        return []
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

public enum ComponentType: String, Codable {
    case container = "Container"
    case text = "Text"
    case image = "Image"
    case button = "Button"
    case gradient = "Gradient"
    case scrollView = "ScrollView"
    case productGrid = "ProductGrid"
    case categoryCircles = "category_circles"
    case banner = "banner"
    case grid = "grid"
    case horizontalList = "horizontal_list"
    case productList = "product_list"
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
    case beautifulImageSlider = "beautiful_image_slider"
    case eidCelebrationDeals = "eid_celebration_deals"
    case topDeals = "top_deals"
    case upcomingLaunches = "upcoming_launches"
    case shopByPrice = "shop_by_price"

    // --- For You Custom Sections ---
    case forYouBentoGrid = "for_you_bento_grid"
    case poweredByRow = "powered_by_row"
    case spoilYourselfTitle = "spoil_yourself_title"
    case headerBackground = "header_background"

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

    // --- 50 Percent Off Components ---
    case lumiereHeader = "lumiere_header"
    case lumiereSection = "lumiere_section"
    case lumiereNewsletter = "lumiere_newsletter"
    case lumiereBottomNav = "lumiere_bottom_nav"

    // --- Luminous Page Components ---
    case luminousSection = "luminous_section"
    case luminousNewsletter = "luminous_newsletter"

    // --- Back to School 1 Components ---
    case backToSchoolHeader = "back_to_school_header"
    case backToSchoolBanner = "back_to_school_banner"
    case backToSchoolCategories = "back_to_school_categories"
    case backToSchoolGrid = "back_to_school_grid"
    case backToSchoolFooter = "back_to_school_footer"

    // --- Back to School 2 Components ---
    case schoolTwoHeader = "school_two_header"
    case schoolTwoBanner = "school_two_banner"
    case schoolTwoCategories = "school_two_categories"
    case schoolTwoDeals = "school_two_deals"
    case schoolTwoGrid = "school_two_grid"
    case schoolTwoFooter = "school_two_footer"

    // --- Back to School 3 Components ---
    case schoolThreeHeader = "school_three_header"
    case schoolThreeBanner = "school_three_banner"
    case schoolThreeCategories = "school_three_categories"
    case schoolThreeEssentials = "school_three_essentials"
    case schoolThreeGrid = "school_three_grid"
    case schoolThreeFooter = "school_three_footer"

    // --- Back to School 4 Components ---
    case schoolFourHeader = "school_four_header"
    case schoolFourCategories = "school_four_categories"
    case schoolFourGrid = "school_four_grid"
    case schoolFourFooter = "school_four_footer"

    // --- Back to School 5 Components ---
    case schoolFiveHeader = "school_five_header"
    case schoolFiveCategories = "school_five_categories"
    case schoolFiveGrid = "school_five_grid"
    case schoolFiveFooter = "school_five_footer"

    // --- Service Hub Components ---
    case serviceHeader = "service_header"
    case serviceHeroSection = "service_hero_section"
    case serviceCategorySection = "service_category_section"
    case serviceBottomNav = "service_bottom_nav"

    // --- Shopping Page Components ---
    case brandSpotlight = "brand_spotlight"
    case collectionGrid = "collection_grid"
    case featuredProducts = "featured_products"
    case seasonalShowcase = "seasonal_showcase"

    // --- Banner Pages (Generic) ---
    case bannerPageHeader = "banner_page_header"
    case bannerPageGrid = "banner_page_grid"
    case bannerPageFooter = "banner_page_footer"

    // --- Fashion Page ---
    case fashionHeader = "fashion_header"
    case fashionCollections = "fashion_collections"
    case fashionTrending = "fashion_trending"

    // --- Electronics Page ---
    case electronicsHeader = "electronics_header"
    case electronicsDeals = "electronics_deals"
    case electronicsCategories = "electronics_categories"

    // --- Beauty Page (Old/Generic) ---
    case beautyHeader = "beauty_header"
    case beautyTopPicks = "beauty_top_picks"
    case beautyNewArrivals = "beauty_new_arrivals"

    // --- Beauty Page (New/Specific) ---
    case beautyPremiumPick = "beauty_premium_pick"
    case beautyLuxeLane = "beauty_luxe_lane"
    case beautyEditorPick = "beauty_editor_pick"
    case beautyGlamTop = "beauty_glam_top"
    case beautyFragranceLuxe = "beauty_fragrance_luxe"
    case beautyMakeupMania = "beauty_makeup_mania"
    case beautySkinCareSanctuary = "beauty_skin_care_sanctuary"
    case beautyHairCareHaven = "beauty_hair_care_haven"
    case beautyBathBodyBliss = "beauty_bath_body_bliss"
    case beautyWellnessWonders = "beauty_wellness_wonders"
    case beautyGroomingGurus = "beauty_grooming_gurus"
    case beautyBrandsWeLove = "beauty_brands_we_love"
    // globallyLovedAlisters should be below
    // beautyLaunchParty should be below
    // beautyTrendMore should be below
    // beautyKBeauty should be below
    // beautyKBeauty should be below

    // --- Home & Kitchen ---
    case homeHeader = "home_header"
    case homeDecor = "home_decor"
    case kitchenEssentials = "kitchen_essentials"

    // --- Sports & Fitness (Old/Generic) ---
    case sportsHeader = "sports_header"
    case sportsGear = "sports_gear"
    case fitnessEquipment = "fitness_equipment"

    // --- Toys & Baby ---
    case toysHeader = "toys_header"
    case toysTrending = "toys_trending"
    case babyCare = "baby_care"

    // --- Books & Stationery ---
    case booksHeader = "books_header"
    case bestSellers = "best_sellers"
    case stationerySupplies = "stationery_supplies"

    // --- Beauty & Perfume (Luminous) Components ---
    case luminousHeader = "luminous_header"
    case luminousCategories = "luminous_categories"
    case luminousGrid = "luminous_grid"
    case luminousSale = "luminous_sale"
    case luminousBottomNav = "luminous_bottom_nav"

    // --- Shoes Sales Components ---
    case shoesSalesHeader = "shoes_sales_header"
    case shoesSalesFeatured = "shoes_sales_featured"
    case shoesSalesGrid = "shoes_sales_grid"
    case textBlock = "text_block"
    case flashSaleGrid = "flash_sale_grid"
    case featuredCarousel = "featured_carousel"
    case bestQuality = "best_quality"
    case groceryListing = "grocery_listing"
    case smartBasket = "smart_basket"

    case groceryTopPicks = "grocery_top_picks"
    case groceryDeals = "grocery_deals"
    case groceryPromoCards = "grocery_promo_cards"
    case groceryEvents = "grocery_events"
    case groceryShopByCategory = "grocery_shop_by_category"
    case grocerySpecialPicks = "grocery_special_picks"
    case groceryWholesaleText = "grocery_wholesale_text"
    case spacer = "spacer"
    case unknown

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let rawValue = try container.decode(String.self)
        self = ComponentType(rawValue: rawValue) ?? .unknown
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(self.rawValue)
    }
}

// MARK: - Helper Type for Compilation
public struct SDUIAnyCodable: Decodable, Encodable {
    public let value: Any

    public init(_ value: Any) {
        self.value = value
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let x = try? container.decode(Bool.self) {
            value = x
        } else if let x = try? container.decode(Int.self) {
            value = x
        } else if let x = try? container.decode(Double.self) {
            value = x
        } else if let x = try? container.decode(String.self) {
            value = x
        } else if let x = try? container.decode([SDUIAnyCodable].self) {
            value = x.map { $0.value }
        } else if let x = try? container.decode([String: SDUIAnyCodable].self) {
            value = x.mapValues { $0.value }
        } else {
            throw DecodingError.dataCorruptedError(
                in: container, debugDescription: "AnyCodable value cannot be decoded")
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let x = value as? Bool {
            try container.encode(x)
        } else if let x = value as? Int {
            try container.encode(x)
        } else if let x = value as? Double {
            try container.encode(x)
        } else if let x = value as? String {
            try container.encode(x)
        } else if let x = value as? [SDUIAnyCodable] {
            try container.encode(x)
        } else if let x = value as? [String: SDUIAnyCodable] {
            try container.encode(x)
        } else {
            throw EncodingError.invalidValue(
                value,
                EncodingError.Context(
                    codingPath: container.codingPath,
                    debugDescription: "AnyCodable value cannot be encoded"))
        }
    }
}
