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

class NavigationManager: ObservableObject {
    @Published var selectedCategory: String = "For You"
    @Published var activeTab: TabType = .shopping
    @Published var showBeautyPage: Bool = false
    @Published var showSpecialDealPage: Bool = false
    @Published var showBrandNewArrivalPage: Bool = false
    @Published var showMenFashionPage: Bool = false
    @Published var showGrandMobilesPage: Bool = false
    @Published var showShoesSalesPage: Bool = false
    @Published var showCyberSalePage: Bool = false

    // Category navigation state
    @Published var categoryNavigation: CategoryNavigationParams?
    @Published var showCategoryPage: Bool = false

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
        if url == "beauty-product" {
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
            print("Navigate to collection: \(url)")
        } else {
            print("Unhandled navigation: \(url)")
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
