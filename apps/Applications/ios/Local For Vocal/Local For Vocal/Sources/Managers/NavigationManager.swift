import Combine
import SwiftUI

// Model for category navigation parameters
struct CategoryNavigationParams: Equatable {
    let categoryId: String?
    let categoryName: String?
    let subCategoryId: String?
    let filters: [String: String]
    let layoutType: String?

    init(
        categoryId: String? = nil, categoryName: String? = nil, subCategoryId: String? = nil,
        filters: [String: String] = [:], layoutType: String? = nil
    ) {
        self.categoryId = categoryId
        self.categoryName = categoryName
        self.subCategoryId = subCategoryId
        self.filters = filters
        self.layoutType = layoutType
    }
}

enum TabType: String, CaseIterable, Identifiable {
    case shopping = "Shopping"
    case services = "Services"
    case grocery = "Grocery"
    case influencers = "Influencers"

    var id: String { rawValue }

    var iconName: String {
        switch self {
        case .shopping: return "bag.fill"
        case .services: return "building.2.fill"
        case .grocery: return "basket.fill"
        case .influencers: return "person.3.fill"
        }
    }

    var color: Color {
        switch self {
        // Using System Colors for now to avoid init errors until Extension is confirmed
        case .shopping: return Color(hex: "#2563EB")
        case .services: return Color(hex: "#7C3AED")
        case .grocery: return Color(hex: "#10B981")
        case .influencers: return Color(hex: "#EC4899")
        }
    }
}

// Enum for overlay navigation — replaces 7 separate @Published booleans
enum OverlayDestination: String, Identifiable {
    case beauty
    case specialDeal
    case brandNewArrival
    case menFashion
    case grandMobiles
    case shoesSales
    case cyberSale
    case categoryPage

    var id: String { rawValue }
}

class NavigationManager: ObservableObject {
    @Published var selectedCategory: String = "For You"
    @Published var activeTab: TabType = .shopping

    // Single enum replaces 7+ booleans — one objectWillChange instead of many
    @Published var activeOverlay: OverlayDestination? = nil

    // Category navigation state
    @Published var categoryNavigation: CategoryNavigationParams?

    // Computed compatibility properties for existing code
    var showBeautyPage: Bool {
        get { activeOverlay == .beauty }
        set { activeOverlay = newValue ? .beauty : nil }
    }
    var showSpecialDealPage: Bool {
        get { activeOverlay == .specialDeal }
        set { activeOverlay = newValue ? .specialDeal : nil }
    }
    var showBrandNewArrivalPage: Bool {
        get { activeOverlay == .brandNewArrival }
        set { activeOverlay = newValue ? .brandNewArrival : nil }
    }
    var showMenFashionPage: Bool {
        get { activeOverlay == .menFashion }
        set { activeOverlay = newValue ? .menFashion : nil }
    }
    var showGrandMobilesPage: Bool {
        get { activeOverlay == .grandMobiles }
        set { activeOverlay = newValue ? .grandMobiles : nil }
    }
    var showShoesSalesPage: Bool {
        get { activeOverlay == .shoesSales }
        set { activeOverlay = newValue ? .shoesSales : nil }
    }
    var showCyberSalePage: Bool {
        get { activeOverlay == .cyberSale }
        set { activeOverlay = newValue ? .cyberSale : nil }
    }
    var showCategoryPage: Bool {
        get { activeOverlay == .categoryPage }
        set { activeOverlay = newValue ? .categoryPage : nil }
    }

    func navigate(to url: String) {
        // Handle grocery category deep links with multiple IDs
        if url.starts(with: "/grocery/category/") {
            let ids = url.replacingOccurrences(of: "/grocery/category/", with: "")
            self.categoryNavigation = CategoryNavigationParams(
                categoryId: nil,  // Category ID might not be needed if we have sub-category IDs
                categoryName: "Groceries",
                subCategoryId: ids,
                layoutType: "grocery"
            )
            self.showCategoryPage = true
            return
        }

        // Handle category:// URLs
        if url.starts(with: "category://") {
            parseCategoryURL(url)
            return
        }

        // Handle slug-based navigation
        if url == "shopping" {
            if self.activeTab == .shopping {
                self.selectedCategory = "For You"
            }
            self.activeTab = .shopping
        } else if url == "services" {
            self.activeTab = .services
        } else if url == "grocery" {
            self.activeTab = .grocery
        } else if url == "influencers" {
            self.activeTab = .influencers
        } else if url == "beauty-product" {
            self.showBeautyPage = true
        } else if url == "special-deal-new-style" {
            self.showSpecialDealPage = true
        } else if url == "brand-new-arrival" {
            self.showBrandNewArrivalPage = true
        } else if url == "men-fashion" {
            self.showMenFashionPage = true
        } else if url == "grand-mobiles-sale" {
            self.showGrandMobilesPage = true
        } else if url == "footwear-collection" || url == "footwear-sale-collection" {
            self.showShoesSalesPage = true
        } else if url == "cyber-sale" {
            self.showCyberSalePage = true
        } else if url.starts(with: "/collection/") {
            AppLogger.debug("Navigate to collection: \(url)")
        } else {
            AppLogger.debug("Unhandled navigation: \(url)")
        }
    }

    // Parse category:// URLs
    // Format: category://categoryName?categoryId=xxx&subCategoryId=yyy&filters=key:value
    private func parseCategoryURL(_ url: String) {
        // Remove the scheme
        let withoutScheme = url.replacingOccurrences(of: "category://", with: "")

        // Split path and query
        let components = withoutScheme.components(separatedBy: "?")
        let categoryName = components.first?.removingPercentEncoding ?? "Category"

        var categoryId: String?
        var subCategoryId: String?
        var layoutType: String?
        var filters: [String: String] = [:]

        // Parse query params
        if components.count > 1 {
            let queryString = components[1]
            let params = queryString.components(separatedBy: "&")

            for param in params {
                let keyValue = param.components(separatedBy: "=")
                guard keyValue.count == 2 else { continue }

                let key = keyValue[0]
                let value = keyValue[1].removingPercentEncoding ?? keyValue[1]

                switch key {
                case "categoryId":
                    categoryId = value
                case "subCategoryId":
                    subCategoryId = value
                case "layout":
                    layoutType = value
                case "filters":
                    // Parse filters format: key1:value1,key2:value2
                    let filterPairs = value.components(separatedBy: ",")
                    for pair in filterPairs {
                        let kv = pair.components(separatedBy: ":")
                        if kv.count == 2 {
                            filters[kv[0]] = kv[1]
                        }
                    }
                default:
                    break
                }
            }
        }

        // Set navigation state
        self.categoryNavigation = CategoryNavigationParams(
            categoryId: categoryId,
            categoryName: categoryName,
            subCategoryId: subCategoryId,
            filters: filters,
            layoutType: layoutType
        )

        self.showCategoryPage = true
    }

    func dismissCategoryPage() {
        self.showCategoryPage = false
        self.categoryNavigation = nil
    }
}
