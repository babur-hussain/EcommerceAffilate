import Combine
import SwiftUI

struct SDUIComponentView: View {
    let component: SDUIComponent
    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var wishlistManager: WishlistManager

    // Add observed object for dynamic updates
    @StateObject var viewModel = SDUIComponentViewModel()

    init(component: SDUIComponent) {
        self.component = component
    }

    var body: some View {
        renderComponent()
            .onAppear {
                // Individual renderers handle data decoding
            }
    }

    @ViewBuilder
    private func renderComponent() -> some View {
        switch component.type {

        // MARK: - Core Components
        case .container:
            if let children = component.children {
                VStack(spacing: 0) {
                    ForEach(children) { child in
                        SDUIComponentView(component: child)
                    }
                }
            }
        case .text:
            Text(component.prop(for: "text") ?? "")
        case .image:
            if let imageUrl = component.prop(for: "imageUrl") as String? {
                CachedAsyncImage(url: URL(string: imageUrl)) { image in
                    image.resizable().scaledToFit()
                } placeholder: {
                    Color.gray.opacity(0.1)
                }
            }
        case .button:
            Button(action: {}) {
                Text(component.prop(for: "text") ?? "Button")
            }
        case .gradient:
            LinearGradient(
                gradient: Gradient(colors: [.red, .blue]), startPoint: .top, endPoint: .bottom)
        case .scrollView:
            ScrollView {
                if let children = component.children {
                    VStack {
                        ForEach(children) { child in
                            SDUIComponentView(component: child)
                        }
                    }
                }
            }
        case .productGrid:
            Text("Product Grid Placeholder")
        case .heroCarousel:
            renderHeroCarousel()
        case .categoryCircles:
            renderCategoryCircles()
        case .banner:
            renderBanner()
        case .grid:
            renderGrid()
        case .horizontalList:
            renderHorizontalList()
        case .productList:
            renderProductList()
        case .productListHorizontal:
            renderProductListHorizontal()

        // MARK: - Shopping Page Components
        case .dealsOfTheDay:
            renderDealOfTheDay()
        case .brandSpotlight:
            renderBrandSpotlight()
        case .collectionGrid:
            renderCollectionGrid()
        case .featuredProducts:
            renderFeaturedProducts()
        case .seasonalShowcase:
            renderSeasonalShowcase()

        // MARK: - Banner Pages (Generic)
        case .bannerPageHeader:
            renderBannerPageHeader()
        case .bannerPageGrid:
            renderBannerPageGrid()
        case .bannerPageFooter:
            renderBannerPageFooter()

        // MARK: - Fashion Page
        case .fashionHeader:
            renderFashionHeader()
        case .fashionCollections:
            renderFashionCollections()
        case .fashionTrending:
            renderFashionTrending()

        // MARK: - Electronics Page
        case .electronicsHeader:
            renderElectronicsHeader()
        case .electronicsDeals:
            renderElectronicsDeals()
        case .electronicsCategories:
            renderElectronicsCategories()

        // MARK: - Beauty Page
        case .beautyHeader:
            renderBeautyHeader()
        case .beautyTopPicks:
            renderBeautyTopPicks()
        case .beautyNewArrivals:
            renderBeautyNewArrivals()

        // MARK: - Home & Kitchen
        case .homeHeader:
            renderHomeHeader()
        case .homeDecor:
            renderHomeDecor()
        case .kitchenEssentials:
            renderKitchenEssentials()

        // MARK: - Sports & Fitness
        case .sportsHeader:
            renderSportsHeader()
        case .sportsGear:
            renderSportsGear()
        case .fitnessEquipment:
            renderFitnessEquipment()

        // MARK: - Toys & Baby
        case .toysHeader:
            renderToysHeader()
        case .toysTrending:
            renderToysTrending()
        case .babyCare:
            renderBabyCare()

        // MARK: - Books & Stationery
        case .booksHeader:
            renderBooksHeader()
        case .bestSellers:
            renderBestSellers()
        case .stationerySupplies:
            renderStationerySupplies()

        // MARK: - Luminous Page Components
        case .luminousHeader:
            renderLuminousHeader()
        case .luminousSection:
            renderLuminousSection()
        case .luminousCategories:
            renderLuminousCategories()
        case .luminousGrid:
            renderLuminousGrid()
        case .luminousSale:
            renderLuminousSale()
        // Note: luminousNewsletter and luminousBottomNav are static/special components
        // handled differently or mapped if needed.
        case .luminousNewsletter:
            renderLuminousNewsletter()
        case .luminousBottomNav:
            renderLuminousBottomNav()

        // MARK: - Back To School 1
        case .backToSchoolHeader:
            renderBackToSchoolHeader()
        case .backToSchoolBanner:
            renderBackToSchoolBanner()
        case .backToSchoolCategories:
            renderBackToSchoolCategories()
        case .backToSchoolGrid:
            renderBackToSchoolGrid()
        case .backToSchoolFooter:
            renderBackToSchoolFooter()

        // MARK: - Back To School 2
        case .schoolTwoHeader:
            renderSchoolTwoHeader()
        case .schoolTwoBanner:
            renderSchoolTwoBanner()
        case .schoolTwoCategories:
            renderSchoolTwoCategories()
        case .schoolTwoDeals:
            renderSchoolTwoDeals()
        case .schoolTwoGrid:
            renderSchoolTwoGrid()
        case .schoolTwoFooter:
            renderSchoolTwoFooter()

        // MARK: - Back To School 3
        case .schoolThreeHeader:
            renderSchoolThreeHeader()
        case .schoolThreeBanner:
            renderSchoolThreeBanner()
        case .schoolThreeCategories:
            renderSchoolThreeCategories()
        case .schoolThreeEssentials:
            renderSchoolThreeEssentials()
        case .schoolThreeGrid:
            renderSchoolThreeGrid()
        case .schoolThreeFooter:
            renderSchoolThreeFooter()

        // MARK: - Back To School 4
        case .schoolFourHeader:
            renderSchoolFourHeader()
        case .schoolFourCategories:
            renderSchoolFourCategories()
        case .schoolFourGrid:
            renderSchoolFourGrid()
        case .schoolFourFooter:
            renderSchoolFourFooter()

        // MARK: - Back To School 5
        case .schoolFiveHeader:
            renderSchoolFiveHeader()
        case .schoolFiveCategories:
            renderSchoolFiveCategories()
        case .schoolFiveGrid:
            renderSchoolFiveGrid()
        case .schoolFiveFooter:
            renderSchoolFiveFooter()

        // MARK: - Beauty Page Components (New)
        case .beautyPremiumPick:
            renderBeautyPremiumPick()
        case .beautyLuxeLane:
            renderBeautyLuxeLane()
        case .beautyEditorPick:
            renderBeautyEditorPick()
        case .beautyGlamTop:
            renderBeautyGlamTop()
        case .beautyFragranceLuxe:
            renderBeautyFragranceLuxe()
        case .beautyMakeupMania:
            renderBeautyMakeupMania()
        case .beautySkinCareSanctuary:
            renderBeautySkinCareSanctuary()
        case .beautyHairCareHaven:
            renderBeautyHairCareHaven()
        case .beautyBathBodyBliss:
            renderBeautyBathBodyBliss()
        case .beautyWellnessWonders:
            renderBeautyWellnessWonders()
        case .beautyGroomingGurus:
            renderBeautyGroomingGurus()
        case .beautyBrandsWeLove:
            renderBeautyBrandsWeLove()
        case .globallyLovedAlisters:
            renderGloballyLovedAlisters()
        case .beautyLaunchParty:
            renderBeautyLaunchParty()
        case .beautyTrendMore:
            renderBeautyTrendMore()
        case .internetFamedBrands:
            renderInternetFamedBrands()
        case .beautyKBeauty:
            renderBeautyKBeauty()
        case .beautyGlamBudget:
            renderBeautyGlamBudget()

        // MARK: - Sports Page Components (New)
        case .sportCricketSeason:
            renderSportCricketSeason()
        case .sportWinnerBrands:
            renderSportWinnerBrands()
        case .sportSupportGoals:
            renderSportSupportGoals()
        case .sportGymAccessories:
            renderSportGymAccessories()
        case .sportCombos:
            renderSportCombos()
        case .sportSavings:
            renderSportSavings()
        case .sportWishlist:
            renderSportWishlist()

        // MARK: - Furniture Page Components
        case .furnitureDealOfDay:
            renderFurnitureDealOfDay()
        case .furnitureTopBrands:
            renderFurnitureTopBrands()
        case .furnitureSponsorshipBanner:
            renderFurnitureSponsorshipBanner()
        case .furnitureGrabOrGone:
            renderFurnitureGrabOrGone()
        case .furnitureShopByRoom:
            renderFurnitureShopByRoom()
        case .furnitureShopByMaterial:
            renderFurnitureShopByMaterial()
        case .furnitureTrendingNow:
            renderFurnitureTrendingNow()
        case .furnitureWishlist:
            renderFurnitureWishlist()
        case .furnitureCustomerReviews:
            renderFurnitureCustomerReviews()
        case .furnitureEverybodyList:
            renderFurnitureEverybodyList()
        case .furnitureRareFinds:
            renderFurnitureRareFinds()
        case .furnitureStatementPieces:
            renderFurnitureStatementPieces()
        case .furnitureSamarthStore:
            renderFurnitureSamarthStore()
        case .furnitureEmiOffers:
            renderFurnitureEmiOffers()
        case .furnitureTopFurnitureBrands:
            renderFurnitureTopFurnitureBrands()

        // MARK: - Services Page Components
        case .serviceHeader:
            renderServiceHeader()
        case .serviceHeroSection:
            renderServiceHeroSection()
        case .serviceCategorySection:
            renderServiceCategorySection()
        case .serviceBottomNav:
            renderServiceBottomNav()

        // MARK: - For You / Promo Components (Restored)
        case .curatedCollections:
            renderCuratedCollections()
        case .fiftyPercentOffZone:
            renderFiftyPercentOffZone()
        case .grandKitchenSale:
            renderGrandKitchenSale()
        case .lightningDeals:
            renderLightningDeals()
        case .recentHistory:
            renderRecentHistory()
        case .groceryRow:
            renderGroceryRow()
        case .activeOrders:
            renderActiveOrders()
        case .subCategorySlider:
            renderSubCategorySlider()
        case .shoppingForOthersHub:
            renderShoppingForOthersHub()
        case .earlyBirdDeals:
            renderEarlyBirdDeals()
        case .sankrantiFestival:
            renderSankrantiFestival()
        case .shoeStealFest:
            renderShoeStealFest()
        case .winterClearance:
            renderWinterClearance()
        case .budgetBuys:
            renderBudgetBuys()
        case .fashionForecast:
            renderFashionForecast()
        case .winterCollection:
            renderWinterCollection()
        case .promoPoster:
            renderPromoPoster()
        case .glowForHarvest:
            renderGlowForHarvest()
        case .consultationBanner:
            renderConsultationBanner()

        // MARK: - Lumiere (50% Off) Page Components
        case .lumiereHeader:
            renderLumiereHeader()
        case .lumiereSection:
            renderLumiereSection()
        case .lumiereNewsletter:
            renderLumiereNewsletter()
        case .lumiereBottomNav:
            renderLumiereBottomNav()

        case .unknown:
            Text("Unknown: \(component.type.rawValue)")
                .font(.caption)
                .foregroundColor(.white)
                .padding()
                .background(Color.red)
                .cornerRadius(8)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 4)

        @unknown default:
            Text("Unhandled Type: \(component.type.rawValue)")
                .padding()
                .background(Color.red.opacity(0.1))
        }
    }
}

class SDUIComponentViewModel: ObservableObject {
    @Published var data: Any?
    @Published var isLoading = false

    func decodeItems<T: Decodable>(
        from component: SDUIComponent, type: T.Type, key: String = "items"
    ) {
        guard data == nil else { return }  // Already loaded

        isLoading = true

        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            let decodedItems: [T]

            if let itemsValue = component.props?[key]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let result = try? JSONDecoder().decode([T].self, from: data)
            {
                decodedItems = result
            } else {
                decodedItems = []
            }

            DispatchQueue.main.async {
                self?.data = decodedItems
                self?.isLoading = false
            }
        }
    }

    /// Clears cached data and resets loading state to allow refresh
    func reset() {
        data = nil
        isLoading = false
    }

    /// Refreshes data by clearing cache and re-decoding from component
    func refresh<T: Decodable>(from component: SDUIComponent, type: T.Type, key: String = "items") {
        reset()
        decodeItems(from: component, type: type, key: key)
    }
}

// MARK: - Helper Structs

// MARK: - Style Modifier

struct ComponentStyleModifier: ViewModifier {
    let style: [String: SDUIAnyCodable]?

    func body(content: Content) -> some View {
        content
            .padding(edgeInsets(from: style))
            .background(backgroundColor(from: style))
            .cornerRadius(cornerRadius(from: style))
    }

    private func edgeInsets(from style: [String: SDUIAnyCodable]?) -> EdgeInsets {
        guard let padding = style?["padding"]?.value as? [String: CGFloat] else {
            return EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)
        }
        return EdgeInsets(
            top: padding["top"] ?? 0,
            leading: padding["leading"] ?? 0,
            bottom: padding["bottom"] ?? 0,
            trailing: padding["trailing"] ?? 0
        )
    }

    private func backgroundColor(from style: [String: SDUIAnyCodable]?) -> Color {
        guard let hex = style?["backgroundColor"]?.value as? String else {
            return .clear
        }
        return Color(hex: hex)
    }

    private func cornerRadius(from style: [String: SDUIAnyCodable]?) -> CGFloat {
        guard let radius = style?["cornerRadius"]?.value as? CGFloat else {
            return 0
        }
        return radius
    }
}

// MARK: - Renderers Extension
