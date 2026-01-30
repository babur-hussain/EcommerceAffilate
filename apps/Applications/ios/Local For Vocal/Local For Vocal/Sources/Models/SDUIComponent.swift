#if false
    import Foundation
    import SwiftUI

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
        case unknown

        public init(from decoder: Decoder) throws {
            let container = try decoder.singleValueContainer()
            let rawValue = try container.decode(String.self)
            self = ComponentType(rawValue: rawValue) ?? .unknown
        }
    }

#endif
