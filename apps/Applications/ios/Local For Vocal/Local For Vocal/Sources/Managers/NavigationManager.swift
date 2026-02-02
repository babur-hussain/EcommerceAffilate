import Combine
import SwiftUI

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

    func navigate(to url: String) {
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
            // Handle collection URLs if needed, or other deep links
            print("Navigate to collection: \(url)")
        } else {
            print("Unhandled navigation: \(url)")
        }
    }
}
