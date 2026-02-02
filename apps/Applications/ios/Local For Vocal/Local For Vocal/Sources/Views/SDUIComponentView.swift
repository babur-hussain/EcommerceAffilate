import SwiftUI

struct SDUIComponentView: View {
    let component: SDUIComponent
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        switch component.type {
        case .container:
            renderContainer()
        case .text:
            renderText()
        case .image:
            renderImage()
        case .button:
            renderButton()
        case .scrollView:
            renderScrollView()
        case .heroCarousel:
            renderHeroCarousel()
        case .recentHistory:
            renderRecentHistory()
        case .groceryRow:
            renderGroceryRow()
        case .curatedCollections:
            renderCuratedCollections()
        case .fiftyPercentOffZone:
            renderFiftyPercentOffZone()
        case .grandKitchenSale:
            renderGrandKitchenSale()
        case .productGrid:
            renderProductGrid()
        case .productListHorizontal:
            renderProductListHorizontal()
        case .subCategorySlider:
            renderSubCategorySlider()
        case .lightningDeals:
            renderLightningDeals()
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
        case .dealsOfTheDay:
            renderDealsOfTheDay()
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
        case .furnitureSamarthStore:
            renderFurnitureSamarthStore()
        case .furnitureEmiOffers:
            renderFurnitureEmiOffers()
        case .furnitureTopFurnitureBrands:
            renderFurnitureTopFurnitureBrands()
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

        // --- 50 Percent Off Components ---
        case .lumiereHeader:
            renderLumiereHeader()
        case .lumiereSection:
            renderLumiereSection()
        case .lumiereNewsletter:
            renderLumiereNewsletter()
        case .lumiereBottomNav:
            renderLumiereBottomNav()

        // --- Back to School 1 Components ---
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

        // --- Back to School 2 Components ---
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

        // --- Back to School 3 Components ---
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

        // --- Back to School 4 Components ---
        case .schoolFourHeader:
            renderSchoolFourHeader()
        case .schoolFourCategories:
            renderSchoolFourCategories()
        case .schoolFourGrid:
            renderSchoolFourGrid()
        case .schoolFourFooter:
            renderSchoolFourFooter()

        // --- Back to School 5 Components ---
        case .schoolFiveHeader:
            renderSchoolFiveHeader()
        case .schoolFiveCategories:
            renderSchoolFiveCategories()
        case .schoolFiveGrid:
            renderSchoolFiveGrid()
        case .schoolFiveFooter:
            renderSchoolFiveFooter()

        // Service Hub Components
        case .serviceHeader:
            renderServiceHeader()
        case .serviceHeroSection:
            renderServiceHeroSection()
        case .serviceCategorySection:
            renderServiceCategorySection()
        case .serviceBottomNav:
            renderServiceBottomNav()

        // --- Beauty & Perfume (Luminous) Components ---
        case .luminousHeader:
            renderLuminousHeader()
        case .luminousCategories:
            renderLuminousCategories()
        case .luminousGrid:
            renderLuminousGrid()
        case .luminousSale:
            renderLuminousSale()
        case .luminousBottomNav:
            renderLuminousBottomNav()
        default:
            // Fallback for unknown or unimplemented types
            Text("Unknown Component: \(component.type.rawValue)")
                .padding()
                .background(Color.red.opacity(0.1))
        }
    }

    // MARK: - Renderers

    @ViewBuilder
    private func renderLuminousHeader() -> some View {
        let titleTop = component.prop(for: "titleTop") ?? "BEAUTY"
        let titleBottom = component.prop(for: "titleBottom") ?? "PRODUCT"
        let subtitle = component.prop(for: "subtitle") ?? "Subtitle"
        let buttonText = component.prop(for: "buttonText") ?? "Shop Now"
        let imageUrl = component.prop(for: "imageUrl") ?? "https://via.placeholder.com/500"

        LuminousHeaderView(
            titleTop: titleTop,
            titleBottom: titleBottom,
            subtitle: subtitle,
            buttonText: buttonText,
            imageUrl: imageUrl
        )
    }

    @ViewBuilder
    private func renderLuminousCategories() -> some View {
        let title = component.prop(for: "title") ?? "Categories"
        let linkText = component.prop(for: "linkText") ?? "View All"

        let items: [LuminousCategoriesView.CategoryItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [LuminousCategoriesView.CategoryItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        LuminousCategoriesView(title: title, linkText: linkText, items: items)
    }

    @ViewBuilder
    private func renderLuminousGrid() -> some View {
        let title = component.prop(for: "title") ?? "Latest"

        let items: [LuminousGridView.ProductItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [LuminousGridView.ProductItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        LuminousGridView(title: title, items: items)
    }

    @ViewBuilder
    private func renderLuminousSale() -> some View {
        let tag = component.prop(for: "tag") ?? "Sale"
        let title = component.prop(for: "title") ?? "Offer"
        let linkText = component.prop(for: "linkText") ?? "Shop"
        let imageUrl = component.prop(for: "imageUrl") ?? "https://via.placeholder.com/600x300"

        LuminousSaleView(
            tag: tag,
            title: title,
            linkText: linkText,
            imageUrl: imageUrl
        )
    }

    @ViewBuilder
    private func renderLuminousBottomNav() -> some View {
        LuminousBottomNavView()
    }

    @ViewBuilder
    private func renderContainer() -> some View {
        // Simple Vertical Stack for container children
        // In a real app, you'd parse 'style' for flexDirection (HStack vs VStack)
        VStack(alignment: .leading, spacing: 0) {
            if let children = component.children {
                ForEach(children) { child in
                    SDUIComponentView(component: child)
                }
            }
        }
        .modifier(StyleModifier(styles: component.style))
    }

    @ViewBuilder
    private func renderText() -> some View {
        Text(component.prop(for: "text") ?? "")
            .modifier(StyleModifier(styles: component.style))
    }

    @ViewBuilder
    private func renderImage() -> some View {
        if let source: String = component.prop(for: "source") {
            AsyncImage(url: URL(string: source)) { phase in
                switch phase {
                case .empty:
                    Color.gray.opacity(0.2)
                case .success(let image):
                    image.resizable()
                case .failure:
                    Color.red.opacity(0.2)
                @unknown default:
                    EmptyView()
                }
            }
            .modifier(StyleModifier(styles: component.style))
        }
    }

    @ViewBuilder
    private func renderButton() -> some View {
        Button(action: {
            print("Button tapped")
        }) {
            Text(component.prop(for: "text") ?? "Button")
        }
        .modifier(StyleModifier(styles: component.style))
    }

    @ViewBuilder
    private func renderScrollView() -> some View {
        let horizontal: Bool = component.prop(for: "horizontal") ?? false
        ScrollView(horizontal ? .horizontal : .vertical, showsIndicators: false) {
            StackCompat(horizontal: horizontal) {
                if let children = component.children {
                    ForEach(children) { child in
                        SDUIComponentView(component: child)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func renderCuratedCollections() -> some View {
        let result: Result<[CuratedCollectionsView.CollectionItem], Error> = {
            let propsDict = component.props?.mapValues { $0.value } ?? [:]
            do {
                // Handle "data" wrapper if present (as seen in recent backend payload)
                let sourceDict: [String: Any]
                if let dataDict = propsDict["data"] as? [String: Any] {
                    sourceDict = dataDict
                } else {
                    sourceDict = propsDict
                }

                let data = try JSONSerialization.data(withJSONObject: sourceDict)
                let wrapper = try JSONDecoder().decode(CuratedCollectionsWrapper.self, from: data)
                return .success(wrapper.collections)
            } catch {
                print("Decoding specific error for CuratedCollections: \(error)")
                return .failure(error)
            }
        }()

        switch result {
        case .success(let collections):
            CuratedCollectionsView(collections: collections)
        case .failure(let error):
            Text("Error loading collections: \(error.localizedDescription)")
                .font(.caption)
                .foregroundColor(.red)
        }
    }

    @ViewBuilder
    private func renderFiftyPercentOffZone() -> some View {
        let title = component.prop(for: "title") ?? "50% OFF ZONE"
        let subtitle = component.prop(for: "subtitle") ?? "Half the price, double the joy!"
        let bannerImage =
            component.prop(for: "bannerImage")
            ?? "https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-grocery-shopping-bag-isolated-png-image_11549419.png"
        let discountText = component.prop(for: "discountText") ?? "50%"

        FiftyPercentOffZoneView(
            title: title,
            subtitle: subtitle,
            bannerImage: bannerImage,
            discountText: discountText
        )
    }

    @ViewBuilder
    private func renderGrandKitchenSale() -> some View {
        GrandKitchenSaleView()
    }

    @ViewBuilder
    private func renderProductGrid() -> some View {
        let title = component.prop(for: "title") as String?
        // Basic mapping of products if passed in props (often they are empty and fetched by ID, but for now we look for array)
        if let productsData = try? JSONSerialization.data(
            withJSONObject: component.props?["products"]?.value ?? []),
            let products = try? JSONDecoder().decode([Product].self, from: productsData)
        {
            ProductCardGrid(products: products, title: title)
        } else {
            // Fallback empty grid or fetch logic could go here
            ProductCardGrid(products: [], title: title)
        }
    }

    @ViewBuilder
    private func renderProductListHorizontal() -> some View {
        // Reuse TrendingNearYouView for horizontal product lists
        if component.type == .productListHorizontal {
            let title = component.prop(for: "title") ?? "Trending near you"
            let subtitle = component.prop(for: "subtitle") ?? ""
            let limit = component.prop(for: "limit") ?? 10

            // Extract productIds if available
            let productIds = (component.props?["productIds"]?.value as? [String]) ?? []

            TrendingNearYouView(
                title: title,
                subtitle: subtitle,
                limit: limit,
                productIds: productIds
            )
        } else {
            Text("List Horizontal")
        }
    }

    @ViewBuilder
    private func renderLightningDeals() -> some View {
        let title = component.prop(for: "title") ?? "Lightning deals"
        let subtitle = component.prop(for: "subtitle") ?? "Big savings on select products"
        let limit = component.prop(for: "limit") ?? 6

        // Extract productIds if available
        let productIds = (component.props?["productIds"]?.value as? [String]) ?? []

        LightningDealsView(
            title: title,
            subtitle: subtitle,
            limit: limit,
            productIds: productIds
        )
    }

    @ViewBuilder
    private func renderHeroCarousel() -> some View {
        HeroBannerView(bannersCallback: {
            guard let bannersValue = component.props?["banners"]?.value else { return [] }
            if let data = try? JSONSerialization.data(withJSONObject: bannersValue),
                let banners = try? JSONDecoder().decode(
                    [HeroBannerView.BannerData].self, from: data)
            {
                return banners
            }
            return []
        })
    }

    @ViewBuilder
    private func renderRecentHistory() -> some View {
        RecentHistoryView(userName: "User")  // Can inject user name here later
    }

    @ViewBuilder
    private func renderGroceryRow() -> some View {
        GroceryRowView()
    }
    @ViewBuilder
    private func renderSubCategorySlider() -> some View {
        if let parentId = component.prop(for: "parentCategoryId") as String? {
            SubCategorySliderView(parentCategoryId: parentId)
        } else {
            EmptyView()
        }
    }

    @ViewBuilder
    private func renderShoppingForOthersHub() -> some View {
        let title = component.prop(for: "title") ?? "Shopping for others?"
        let subtitle = component.prop(for: "subtitle") ?? "Choose a category to start exploring"

        let categories: [ShoppingForOthersHubView.CategoryItem] = {
            if let itemsValue = component.props?["categories"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [ShoppingForOthersHubView.CategoryItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        ShoppingForOthersHubView(title: title, subtitle: subtitle, categories: categories)
    }

    @ViewBuilder
    private func renderEarlyBirdDeals() -> some View {
        let title = component.prop(for: "title") ?? "Early Bird Deals!"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [EarlyBirdDealsView.DealItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [EarlyBirdDealsView.DealItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        EarlyBirdDealsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSankrantiFestival() -> some View {
        let title = component.prop(for: "title") ?? "Shine bright this Sankranti"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SankrantiFestivalView.FestiveItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SankrantiFestivalView.FestiveItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SankrantiFestivalView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderShoeStealFest() -> some View {
        let title = component.prop(for: "title") ?? "Shoe's Steal Fest"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [ShoeStealFestView.ShoeItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [ShoeStealFestView.ShoeItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        ShoeStealFestView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderWinterClearance() -> some View {
        let title = component.prop(for: "title") ?? "Winter Clearance Sale"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [WinterClearanceView.ClearanceItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [WinterClearanceView.ClearanceItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        WinterClearanceView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderDealsOfTheDay() -> some View {
        let title = component.prop(for: "title") ?? "Deals of the Day"
        let subtitle = component.prop(for: "subtitle") ?? "Clock is ticking!"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [DealsOfTheDayView.DealItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [DealsOfTheDayView.DealItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        DealsOfTheDayView(
            title: title, subtitle: subtitle, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderBudgetBuys() -> some View {
        let title = component.prop(for: "title") ?? "Budget Buys"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [BudgetBuysView.BudgetItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BudgetBuysView.BudgetItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BudgetBuysView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFashionForecast() -> some View {
        let title = component.prop(for: "title") ?? "FASHION FORECAST"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FashionForecastView.ForecastItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FashionForecastView.ForecastItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FashionForecastView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderWinterCollection() -> some View {
        let title = component.prop(for: "title") ?? "Winter collection"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [WinterCollectionView.CollectionItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [WinterCollectionView.CollectionItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        WinterCollectionView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderPromoPoster() -> some View {
        let image = component.prop(for: "image") ?? ""
        let actionUrl = component.prop(for: "actionUrl") as String?

        PromoPosterView(image: image, actionUrl: actionUrl)
    }

    @ViewBuilder
    private func renderGlowForHarvest() -> some View {
        let title = component.prop(for: "title") ?? "Glow for the harvest"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [GlowForHarvestView.HarvestItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [GlowForHarvestView.HarvestItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        GlowForHarvestView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderConsultationBanner() -> some View {
        let actionUrl = component.prop(for: "actionUrl") as String?
        let title = component.prop(for: "title") ?? "Free\ndermatologist's\nconsultation"
        let callText = component.prop(for: "callText") ?? "Call on"
        // Phone number needs careful handling as it might be Int or String in JSON
        let phoneNumberString = component.prop(for: "phoneNumber") ?? "011-35664195"
        let poweredByText = component.prop(for: "poweredByText") ?? "Powered by"
        let providerName = component.prop(for: "providerName") ?? "Sarvrachna"
        let doctorImage =
            component.prop(for: "doctorImage")
            ?? "https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png"

        ConsultationBannerView(
            actionUrl: actionUrl,
            title: title,
            callText: callText,
            phoneNumber: phoneNumberString,
            poweredByText: poweredByText,
            providerName: providerName,
            doctorImage: doctorImage
        )
    }

    @ViewBuilder
    private func renderGloballyLovedAlisters() -> some View {
        let title = component.prop(for: "title") ?? "Globally loved A-listers"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [GloballyLovedAlistersView.AlisterItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [GloballyLovedAlistersView.AlisterItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        GloballyLovedAlistersView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderBeautyLaunchParty() -> some View {
        let title = component.prop(for: "title") ?? "The Launch Party"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [BeautyLaunchPartyView.LaunchItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyLaunchPartyView.LaunchItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BeautyLaunchPartyView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderBeautyTrendMore() -> some View {
        let title = component.prop(for: "title") ?? "Trend more, spend less"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [BeautyTrendMoreView.TrendItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyTrendMoreView.TrendItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BeautyTrendMoreView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderInternetFamedBrands() -> some View {
        let title = component.prop(for: "title") ?? "Internet-famed brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [BeautyInternetFamedView.InternetFamedItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyInternetFamedView.InternetFamedItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BeautyInternetFamedView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderBeautyKBeauty() -> some View {
        let title = component.prop(for: "title") ?? "K-Beauty obsessed?"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [BeautyKBeautyView.KBeautyItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyKBeautyView.KBeautyItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BeautyKBeautyView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderBeautyGlamBudget() -> some View {
        let title = component.prop(for: "title") ?? "Glam on a budget"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [BeautyGlamBudgetView.GlamItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyGlamBudgetView.GlamItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BeautyGlamBudgetView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportCricketSeason() -> some View {
        let title = component.prop(for: "title") ?? "Cricket Season Kick Off"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SportCricketSeasonView.CricketItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SportCricketSeasonView.CricketItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SportCricketSeasonView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportWinnerBrands() -> some View {
        let title = component.prop(for: "title") ?? "Winner Brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SportWinnerBrandsView.WinnerBrandItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SportWinnerBrandsView.WinnerBrandItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SportWinnerBrandsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportSupportGoals() -> some View {
        let title = component.prop(for: "title") ?? "Support your goals"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SportSupportGoalsView.GoalItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SportSupportGoalsView.GoalItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SportSupportGoalsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportGymAccessories() -> some View {
        let title = component.prop(for: "title") ?? "Gym-approved accessories"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SportGymAccessoriesView.AccessoryItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SportGymAccessoriesView.AccessoryItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SportGymAccessoriesView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportCombos() -> some View {
        let title = component.prop(for: "title") ?? "Sports combos"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SportCombosView.ComboItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SportCombosView.ComboItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SportCombosView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportSavings() -> some View {
        let title = component.prop(for: "title") ?? "Score big savings on sports"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [SportSavingsView.SavingsItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [SportSavingsView.SavingsItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        SportSavingsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderSportWishlist() -> some View {
        SportWishlistView(component: component)
    }

    // MARK: - Lumiere Renderers

    @ViewBuilder
    private func renderLumiereHeader() -> some View {
        LumiereHeaderView(component: component)
    }

    @ViewBuilder
    private func renderLumiereSection() -> some View {
        LumiereSectionView(component: component)
    }

    @ViewBuilder
    private func renderLumiereNewsletter() -> some View {
        LumiereNewsletterView()
    }

    @ViewBuilder
    private func renderLumiereBottomNav() -> some View {
        LumiereBottomNavView()
    }

    // MARK: - Back To School 1 Renderers

    @ViewBuilder
    private func renderBackToSchoolHeader() -> some View {
        BackToSchoolHeaderView(components: component)
    }

    @ViewBuilder
    private func renderBackToSchoolBanner() -> some View {
        BackToSchoolBannerView(component: component)
    }

    @ViewBuilder
    private func renderBackToSchoolCategories() -> some View {
        BackToSchoolCategoriesView(component: component)
    }

    @ViewBuilder
    private func renderBackToSchoolGrid() -> some View {
        BackToSchoolGridView(component: component)
    }

    @ViewBuilder
    private func renderBackToSchoolFooter() -> some View {
        BackToSchoolFooterView()
    }

    // MARK: - Back To School 2 Renderers

    @ViewBuilder
    private func renderSchoolTwoHeader() -> some View {
        SchoolTwoHeaderView(component: component)
    }

    @ViewBuilder
    private func renderSchoolTwoBanner() -> some View {
        SchoolTwoBannerView(component: component)
    }

    @ViewBuilder
    private func renderSchoolTwoCategories() -> some View {
        SchoolTwoCategoriesView(component: component)
    }

    @ViewBuilder
    private func renderSchoolTwoDeals() -> some View {
        SchoolTwoDealsView(component: component)
    }

    @ViewBuilder
    private func renderSchoolTwoGrid() -> some View {
        SchoolTwoGridView(component: component)
    }

    @ViewBuilder
    private func renderSchoolTwoFooter() -> some View {
        SchoolTwoFooterView()
    }

    // MARK: - Back To School 3 Renderers

    @ViewBuilder
    private func renderSchoolThreeHeader() -> some View {
        SchoolThreeHeaderView(component: component)
    }

    @ViewBuilder
    private func renderSchoolThreeBanner() -> some View {
        SchoolThreeBannerView(component: component)
    }

    @ViewBuilder
    private func renderSchoolThreeCategories() -> some View {
        SchoolThreeCategoriesView(component: component)
    }

    @ViewBuilder
    private func renderSchoolThreeEssentials() -> some View {
        SchoolThreeEssentialsView(component: component)
    }

    @ViewBuilder
    private func renderSchoolThreeGrid() -> some View {
        SchoolThreeGridView(component: component)
    }

    @ViewBuilder
    private func renderSchoolThreeFooter() -> some View {
        SchoolThreeFooterView()
    }

    // MARK: - Back To School 4 Renderers

    @ViewBuilder
    private func renderSchoolFourHeader() -> some View {
        SchoolFourHeaderView(component: component)
    }

    @ViewBuilder
    private func renderSchoolFourCategories() -> some View {
        SchoolFourCategoriesView(component: component)
    }

    @ViewBuilder
    private func renderSchoolFourGrid() -> some View {
        SchoolFourGridView(component: component)
    }

    @ViewBuilder
    private func renderSchoolFourFooter() -> some View {
        SchoolFourFooterView()
    }

    // MARK: - Back To School 5 Renderers

    @ViewBuilder
    private func renderSchoolFiveHeader() -> some View {
        SchoolFiveHeaderView(component: component)
    }

    @ViewBuilder
    private func renderSchoolFiveCategories() -> some View {
        SchoolFiveCategoriesView(component: component)
    }

    @ViewBuilder
    private func renderSchoolFiveGrid() -> some View {
        SchoolFiveGridView(component: component)
    }

    @ViewBuilder
    private func renderSchoolFiveFooter() -> some View {
        SchoolFiveFooterView()
    }

    @ViewBuilder
    private func renderFurnitureDealOfDay() -> some View {
        let title = component.prop(for: "title") ?? "Deal of the day"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureDealOfDayView.DealItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureDealOfDayView.DealItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureDealOfDayView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureTopBrands() -> some View {
        let title = component.prop(for: "title") ?? "Top furniture brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureTopBrandsView.BrandItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureTopBrandsView.BrandItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureTopBrandsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureSponsorshipBanner() -> some View {
        let items: [FurnitureSponsorshipBannerView.BannerItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureSponsorshipBannerView.BannerItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureSponsorshipBannerView(items: items)
    }

    @ViewBuilder
    private func renderFurnitureGrabOrGone() -> some View {
        let title = component.prop(for: "title") ?? "Grab or gone"

        let items: [FurnitureGrabOrGoneView.GrabItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureGrabOrGoneView.GrabItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureGrabOrGoneView(title: title, items: items)
    }

    @ViewBuilder
    private func renderFurnitureShopByRoom() -> some View {
        let title = component.prop(for: "title") ?? "Shop by room"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureShopByRoomView.RoomItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureShopByRoomView.RoomItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureShopByRoomView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureShopByMaterial() -> some View {
        let title = component.prop(for: "title") ?? "Shop by material"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureShopByMaterialView.MaterialItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureShopByMaterialView.MaterialItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureShopByMaterialView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureTrendingNow() -> some View {
        let title = component.prop(for: "title") ?? "Trending now"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureTrendingNowView.TrendingItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureTrendingNowView.TrendingItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureTrendingNowView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureWishlist() -> some View {
        FurnitureWishlistView(component: component)
    }

    @ViewBuilder
    private func renderFurnitureCustomerReviews() -> some View {
        FurnitureCustomerReviewsView(component: component)
    }

    @ViewBuilder
    private func renderFurnitureEverybodyList() -> some View {
        FurnitureEverybodyListView(component: component)
    }

    @ViewBuilder
    private func renderFurnitureRareFinds() -> some View {
        FurnitureRareFindsView(component: component)
    }

    @ViewBuilder
    private func renderFurnitureStatementPieces() -> some View {
        FurnitureStatementPiecesView(component: component)
    }

    @ViewBuilder
    private func renderFurnitureSamarthStore() -> some View {
        let title = component.prop(for: "title") ?? "Samarth store"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureSamarthStoreView.BannerItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureSamarthStoreView.BannerItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureSamarthStoreView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureEmiOffers() -> some View {
        let title = component.prop(for: "title") ?? "Special offers on no cost EMI"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureEmiOffersView.EmiItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureEmiOffersView.EmiItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureEmiOffersView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    private func renderFurnitureTopFurnitureBrands() -> some View {
        let title = component.prop(for: "title") ?? "Top furniture brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?

        let items: [FurnitureTopFurnitureBrandsView.BrandGridItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [FurnitureTopFurnitureBrandsView.BrandGridItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        FurnitureTopFurnitureBrandsView(
            title: title, headerActionUrl: headerActionUrl, items: items)
    }

    // MARK: - Service Hub Components

    @ViewBuilder
    private func renderServiceHeader() -> some View {
        // Header is rendered directly in ServicesPageView as a sticky header
        // Return empty to avoid duplicate rendering
        EmptyView()
    }

    @ViewBuilder
    private func renderServiceHeroSection() -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Featured Services")
                .font(.system(size: 18, weight: .heavy))
                .foregroundColor(Color(hex: "#111318"))
                .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    let items: [ServiceHeroItem] = {
                        if let itemsValue = component.props?["items"]?.value,
                            let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                            let decoded = try? JSONDecoder().decode(
                                [ServiceHeroItem].self, from: data)
                        {
                            return decoded
                        }
                        return getDefaultServiceHeroItems()
                    }()

                    ForEach(items.indices, id: \.self) { index in
                        let item = items[index]
                        ZStack(alignment: .bottomLeading) {
                            AsyncImage(url: URL(string: item.image)) { phase in
                                switch phase {
                                case .success(let image):
                                    image.resizable().aspectRatio(contentMode: .fill)
                                default:
                                    Color.gray.opacity(0.3)
                                }
                            }
                            .frame(width: 280, height: 157)
                            .clipped()

                            LinearGradient(
                                gradient: Gradient(colors: [.clear, Color.black.opacity(0.8)]),
                                startPoint: .top,
                                endPoint: .bottom
                            )

                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.tag)
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 2)
                                    .background(Color(hex: item.tagColor ?? "#144bb8"))
                                    .cornerRadius(4)

                                Text(item.title)
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(.white)

                                Text(item.subtitle)
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(Color(hex: "#E5E7EB"))
                            }
                            .padding(16)
                        }
                        .frame(width: 280, height: 157)
                        .cornerRadius(12)
                        .clipped()
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
    }

    @ViewBuilder
    private func renderServiceCategorySection() -> some View {
        let title = component.prop(for: "title") ?? "Services"

        VStack(alignment: .leading, spacing: 16) {
            // Header with See All
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111318"))
                Spacer()
                Button(action: {}) {
                    HStack(spacing: 4) {
                        Text("See All")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#144bb8"))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#144bb8"))
                    }
                }
            }

            // Category Grid
            let items: [ServiceCategoryItem] = {
                if let itemsValue = component.props?["items"]?.value,
                    let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                    let decoded = try? JSONDecoder().decode([ServiceCategoryItem].self, from: data)
                {
                    return decoded
                }
                return getDefaultServiceCategories()
            }()

            LazyVGrid(
                columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible()),
                    GridItem(.flexible()),
                ],
                spacing: 16
            ) {
                ForEach(items.indices, id: \.self) { index in
                    let item = items[index]
                    VStack(spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(hex: item.bgColor ?? "#E0F2FE"))
                                .frame(width: 64, height: 64)
                            Image(systemName: getSystemImageName(for: item.icon))
                                .font(.system(size: 28))
                                .foregroundColor(Color(hex: item.iconColor ?? "#144bb8"))
                        }
                        Text(item.label)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#111318"))
                            .multilineTextAlignment(.center)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }

    @ViewBuilder
    private func renderServiceBottomNav() -> some View {
        // Note: The bottom nav is typically handled at the page level
        // This is included for SDUI completeness but may not be used
        EmptyView()
    }

    // Helper function to map icon names
    private func getSystemImageName(for materialIcon: String) -> String {
        let iconMap: [String: String] = [
            "cleaning-services": "sparkles",
            "plumbing": "wrench.and.screwdriver.fill",
            "electrical-services": "bolt.fill",
            "handyman": "hammer.fill",
            "local-laundry-service": "washer.fill",
            "pest-control": "ant.fill",
            "home-repair-service": "house.fill",
            "content-cut": "scissors",
            "spa": "leaf.fill",
            "fitness-center": "figure.strengthtraining.traditional",
            "local-shipping": "shippingbox.fill",
            "build": "wrench.fill",
            "brush": "paintbrush.fill",
            "kitchen": "fork.knife",
            "ac-unit": "air.conditioner.horizontal.fill",
            "car-repair": "car.fill",
        ]
        return iconMap[materialIcon] ?? "questionmark.circle.fill"
    }

    // Default service hero items
    private func getDefaultServiceHeroItems() -> [ServiceHeroItem] {
        return [
            ServiceHeroItem(
                image:
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
                tag: "NEW",
                tagColor: "#10B981",
                title: "Home Cleaning",
                subtitle: "Professional deep cleaning"
            ),
            ServiceHeroItem(
                image:
                    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
                tag: "POPULAR",
                tagColor: "#F59E0B",
                title: "AC Repair",
                subtitle: "Expert technicians"
            ),
            ServiceHeroItem(
                image:
                    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
                tag: "OFFER",
                tagColor: "#EF4444",
                title: "Salon at Home",
                subtitle: "Up to 30% off"
            ),
        ]
    }

    // Default service categories
    private func getDefaultServiceCategories() -> [ServiceCategoryItem] {
        return [
            ServiceCategoryItem(
                icon: "sparkles", bgColor: "#DBEAFE", iconColor: "#2563EB",
                label: "Cleaning"),
            ServiceCategoryItem(
                icon: "wrench.and.screwdriver.fill", bgColor: "#FEE2E2", iconColor: "#DC2626",
                label: "Plumbing"),
            ServiceCategoryItem(
                icon: "bolt.fill", bgColor: "#FEF3C7", iconColor: "#D97706", label: "Electrical"),
            ServiceCategoryItem(
                icon: "hammer.fill", bgColor: "#D1FAE5", iconColor: "#059669", label: "Handyman"),
            ServiceCategoryItem(
                icon: "washer.fill", bgColor: "#E0E7FF", iconColor: "#4F46E5", label: "Laundry"),
            ServiceCategoryItem(
                icon: "ant.fill", bgColor: "#FCE7F3", iconColor: "#DB2777", label: "Pest Control"),
        ]
    }
}

// MARK: - Service Data Models

struct ServiceHeroItem: Decodable {
    let image: String
    let tag: String
    let tagColor: String?
    let title: String
    let subtitle: String
}

struct ServiceCategoryItem: Decodable {
    let icon: String
    let bgColor: String?
    let iconColor: String?
    let label: String
}

// Wrapper to match decoding structure for Curated Collections prop
private struct CuratedCollectionsWrapper: Decodable {
    let collections: [CuratedCollectionsView.CollectionItem]
}

// Helper to switch stack direction based on scroll view
struct StackCompat<Content: View>: View {
    let horizontal: Bool
    let content: () -> Content

    init(horizontal: Bool, @ViewBuilder content: @escaping () -> Content) {
        self.horizontal = horizontal
        self.content = content
    }

    var body: some View {
        if horizontal {
            HStack(spacing: 0) { content() }
        } else {
            VStack(spacing: 0) { content() }
        }
    }
}

// MARK: - Styling Engine

struct StyleModifier: ViewModifier {
    let styles: [String: AnyCodable]?

    func body(content: Content) -> some View {
        // Basic style parsing
        let width = styles?["width"]?.value as? CGFloat
        let height = styles?["height"]?.value as? CGFloat
        let padding = styles?["padding"]?.value as? CGFloat ?? 0
        let backgroundColor = styles?["backgroundColor"]?.value as? String

        return
            content
            .frame(width: width, height: height)
            .padding(padding)
            .background(Color(hex: backgroundColor ?? "#00000000"))
    }
}
