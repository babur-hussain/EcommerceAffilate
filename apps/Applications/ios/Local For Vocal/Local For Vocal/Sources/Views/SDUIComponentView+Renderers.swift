import SwiftUI

extension SDUIComponentView {

    @ViewBuilder
    func renderLuminousHeader() -> some View {
        let titleTop = component.prop(for: "titleTop") ?? "BEAUTY"
        let titleBottom = component.prop(for: "titleBottom") ?? "PRODUCT"
        let subtitle = component.prop(for: "subtitle") ?? "Subtitle"
        let buttonText = component.prop(for: "buttonText") ?? "Shop Now"
        let imageUrl = component.prop(for: "imageUrl") ?? ""

        LuminousHeaderView(
            titleTop: titleTop,
            titleBottom: titleBottom,
            subtitle: subtitle,
            buttonText: buttonText,
            imageUrl: imageUrl
        )
    }

    @ViewBuilder
    func renderLuminousSection() -> some View {
        Text("Luminous Section")
    }

    @ViewBuilder
    func renderLuminousNewsletter() -> some View {
        LuminousNewsletterView()
    }

    @ViewBuilder
    func renderLuminousBottomNav() -> some View {
        LuminousBottomNavView()
    }

    @ViewBuilder
    func renderLuminousCategories() -> some View {
        let title = component.prop(for: "title") ?? "Categories"
        let linkText = component.prop(for: "linkText") ?? "View All"

        // 1. Try to get items from component props first (Static/JSON)
        var displayItems: [SubCategory] = []

        if let itemsValue = component.props?["items"]?.value,
            let itemsArray = itemsValue as? [[String: Any]]
        {
            displayItems = itemsArray.compactMap { dict in
                // Handle various key possibilities from JSON (id vs _id, image vs image_url)
                guard let name = dict["name"] as? String else { return nil }

                // Prefer 'id', fallback to '_id', fallback to generated
                let id = (dict["id"] as? String) ?? (dict["_id"] as? String) ?? UUID().uuidString

                let image = (dict["image"] as? String) ?? (dict["image_url"] as? String)
                let icon = dict["icon"] as? String
                let slug = dict["slug"] as? String

                return SubCategory(
                    id: id,
                    name: name,
                    image: image,
                    icon: icon,
                    slug: slug
                )
            }
        }

        // 2. Fallback to BeautyManager data if no props items
        if displayItems.isEmpty {
            displayItems = beautyManager.subCategories
        }

        return LuminousCategoriesView(
            title: title,
            linkText: linkText,
            items: displayItems,
            selectedId: beautyManager.selectedCategoryId,
            onSelect: { id in
                beautyManager.selectCategory(id)
            }
        )
    }

    @ViewBuilder
    func renderLuminousGrid() -> some View {
        let title = component.prop(for: "title") ?? "Recommended"

        // Use data from BeautyManager
        if beautyManager.isLoading {
            ProgressView()
                .frame(maxWidth: .infinity, minHeight: 200)
        } else if let error = beautyManager.errorMessage {
            Text("Error: \(error)")
                .foregroundColor(.red)
                .padding()
        } else {
            LuminousGridView(title: title, items: beautyManager.products)
        }
    }

    @ViewBuilder
    func renderLuminousSale() -> some View {
        let tag = component.prop(for: "tag") ?? "Exclusive"
        let title = component.prop(for: "title") ?? "Sale"
        let linkText = component.prop(for: "linkText") ?? "Shop Now"
        let imageUrl = component.prop(for: "imageUrl") ?? ""

        LuminousSaleView(tag: tag, title: title, linkText: linkText, imageUrl: imageUrl)
    }

    // MARK: - Lumiere (50% Off) Page Renderers

    @ViewBuilder
    func renderLumiereHeader() -> some View {
        let titleTop = component.prop(for: "titleTop") ?? "50%"
        let titleBottom = component.prop(for: "titleBottom") ?? "OFF"
        let subtitle = component.prop(for: "subtitle") ?? "Limited Time"
        let buttonText = component.prop(for: "buttonText") ?? "Shop Now"
        let imageUrl = component.prop(for: "imageUrl") ?? ""

        // Reuse LuminousHeaderView since they have similar structure
        LuminousHeaderView(
            titleTop: titleTop,
            titleBottom: titleBottom,
            subtitle: subtitle,
            buttonText: buttonText,
            imageUrl: imageUrl
        )
    }

    @ViewBuilder
    func renderLumiereSection() -> some View {
        let title = component.prop(for: "title") ?? "Featured Section"
        Text(title)
            .font(.headline)
            .padding()
    }

    @ViewBuilder
    func renderLumiereNewsletter() -> some View {
        LuminousNewsletterView()
    }

    @ViewBuilder
    func renderLumiereBottomNav() -> some View {
        LuminousBottomNavView()
    }

    // MARK: - Core Renderers

    @ViewBuilder
    func renderCarousel() -> some View {
        // Use HeroBannerView which is the specific implementation for the main carousel
        let items: [HeroBannerView.BannerData] = component.decodeItems(for: "items")
        HeroBannerView(bannersCallback: { items })
            .frame(height: 240)
    }

    @ViewBuilder
    func renderCategoryCircles() -> some View {
        let items = (viewModel.data as? [CategoryCircleItem]) ?? []

        CategoryCirclesView(items: items)
            .onAppear {
                viewModel.decodeItems(from: component, type: CategoryCircleItem.self)
            }
    }

    @ViewBuilder
    func renderBanner() -> some View {
        let imageUrl = component.prop(for: "imageUrl") ?? ""
        let height = component.prop(for: "height") as CGFloat? ?? 150

        CachedAsyncImage(url: URL(string: imageUrl)) { image in
            image.resizable().scaledToFill()
        } placeholder: {
            Color.gray.opacity(0.3)
        }
        .frame(height: height)
        .clipped()
        .cornerRadius(16)
        .padding(.horizontal, 16)
    }

    @ViewBuilder
    func renderGrid() -> some View {
        let items = (viewModel.data as? [GridItemData]) ?? []

        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
            ForEach(items) { item in
                VStack {
                    CachedAsyncImage(url: URL(string: item.image)) { img in
                        img.resizable().scaledToFit()
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(height: 120)
                    Text(item.title)
                        .font(.caption)
                        .lineLimit(1)
                }
            }
        }
        .onAppear {
            viewModel.decodeItems(from: component, type: GridItemData.self)
        }
    }

    @ViewBuilder
    func renderHorizontalList() -> some View {
        let items = (viewModel.data as? [GridItemData]) ?? []

        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(items) { item in
                    VStack {
                        CachedAsyncImage(url: URL(string: item.image)) { img in
                            img.resizable().scaledToFit()
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .frame(width: 100, height: 100)
                        Text(item.title)
                            .font(.caption)
                    }
                }
            }
        }
        .onAppear {
            viewModel.decodeItems(from: component, type: GridItemData.self)
        }
    }

    @ViewBuilder
    func renderProductList() -> some View {
        Text("Product List Component")
    }

    @ViewBuilder
    func renderProductListHorizontal() -> some View {
        // Horizontal product list - similar to product list but scrolls horizontally
        let items = (viewModel.data as? [Product]) ?? []
        let title = component.prop(for: "title") ?? ""

        VStack(alignment: .leading, spacing: 16) {
            if !title.isEmpty {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .padding(.horizontal, 16)
            }

            if viewModel.isLoading {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(0..<4) { _ in
                            ProductCardSkeleton()
                                .frame(width: 160)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            } else if !items.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(items) { product in
                            ProductCardView(product: product, width: 160)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            } else {
                // Fallback or Empty State
                Text("No products found")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 8)
        .onAppear {
            // Check if we have static items first
            if let itemsValue = component.props?["items"]?.value {
                viewModel.decodeItems(from: component, type: Product.self)
            } else {
                // If no static items, try fetching from API (e.g. Trending)
                loadDynamicProducts()
            }
        }
    }

    private func loadDynamicProducts() {
        guard !viewModel.isLoading, viewModel.data == nil else { return }
        viewModel.isLoading = true

        Task {
            do {
                // Default to trending/global fetch if no specific endpoint props
                // For "Trending near you", we can use a general fetch or specific trending endpoint
                let products = try await APIService.shared.fetchProducts(limit: 10)

                await MainActor.run {
                    viewModel.data = products
                    viewModel.isLoading = false
                }
            } catch {
                print("Failed to load dynamic products: \(error)")
                await MainActor.run {
                    viewModel.isLoading = false
                }
            }
        }
    }

    // MARK: - Shopping Page Renderers

    @ViewBuilder
    func renderDealOfTheDay() -> some View {
        let title = component.prop(for: "title") ?? "Deals of the Day"
        let subtitle = component.prop(for: "subtitle") ?? "Clock is ticking!"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [DealsOfTheDayView.DealItem] = []  // TODO: decode items
        DealsOfTheDayView(
            title: title, subtitle: subtitle, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBrandSpotlight() -> some View {
        BrandSpotlightView(component: component)
    }

    @ViewBuilder
    func renderCollectionGrid() -> some View {
        CollectionGridView(component: component)
    }

    @ViewBuilder
    func renderFeaturedProducts() -> some View {
        FeaturedProductsView(component: component)
    }

    @ViewBuilder
    func renderSeasonalShowcase() -> some View {
        SeasonalShowcaseView(component: component)
    }

    // MARK: - Banner Pages (Generic)

    @ViewBuilder
    func renderBannerPageHeader() -> some View {
        BannerPageHeaderView(component: component)
    }

    @ViewBuilder
    func renderBannerPageGrid() -> some View {
        BannerPageGridView(component: component)
    }

    @ViewBuilder
    func renderBannerPageFooter() -> some View {
        BannerPageFooterView()
    }

    // MARK: - Fashion Page Renderers

    @ViewBuilder
    func renderFashionHeader() -> some View {
        FashionHeaderView(component: component)
    }

    @ViewBuilder
    func renderFashionCollections() -> some View {
        FashionCollectionsView(component: component)
    }

    @ViewBuilder
    func renderFashionTrending() -> some View {
        FashionTrendingView(component: component)
    }

    // MARK: - Electronics Page Renderers

    @ViewBuilder
    func renderElectronicsHeader() -> some View {
        ElectronicsHeaderView(component: component)
    }

    @ViewBuilder
    func renderElectronicsDeals() -> some View {
        ElectronicsDealsView(component: component)
    }

    @ViewBuilder
    func renderElectronicsCategories() -> some View {
        ElectronicsCategoriesView(component: component)
    }

    // MARK: - Beauty Page Renderers

    @ViewBuilder
    func renderBeautyHeader() -> some View {
        BeautyHeaderView(component: component)
    }

    @ViewBuilder
    func renderBeautyTopPicks() -> some View {
        BeautyTopPicksView(component: component)
    }

    @ViewBuilder
    func renderBeautyNewArrivals() -> some View {
        BeautyNewArrivalsView(component: component)
    }

    // MARK: - Home & Kitchen Renderers

    @ViewBuilder
    func renderHomeHeader() -> some View {
        HomeHeaderView()
    }

    @ViewBuilder
    func renderHomeDecor() -> some View {
        HomeDecorView(component: component)
    }

    @ViewBuilder
    func renderKitchenEssentials() -> some View {
        KitchenEssentialsView(component: component)
    }

    // MARK: - Sports & Fitness Renderers

    @ViewBuilder
    func renderSportsHeader() -> some View {
        SportsHeaderView(component: component)
    }

    @ViewBuilder
    func renderSportsGear() -> some View {
        SportsGearView(component: component)
    }

    @ViewBuilder
    func renderFitnessEquipment() -> some View {
        FitnessEquipmentView(component: component)
    }

    // MARK: - Toys & Baby Renderers

    @ViewBuilder
    func renderToysHeader() -> some View {
        ToysHeaderView(component: component)
    }

    @ViewBuilder
    func renderToysTrending() -> some View {
        ToysTrendingView(component: component)
    }

    @ViewBuilder
    func renderBabyCare() -> some View {
        BabyCareView(component: component)
    }

    // MARK: - Books & Stationery Renderers

    @ViewBuilder
    func renderBooksHeader() -> some View {
        BooksHeaderView(component: component)
    }

    @ViewBuilder
    func renderBestSellers() -> some View {
        BestSellersView(component: component)
    }

    @ViewBuilder
    func renderStationerySupplies() -> some View {
        StationerySuppliesView(component: component)
    }

    // MARK: - Beauty Components (New)

    @ViewBuilder
    func renderBeautyPremiumPick() -> some View {
        let title = component.prop(for: "title") ?? "Premium Pick"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items = (viewModel.data as? [BeautyPremiumPickView.PremiumItem]) ?? []

        BeautyPremiumPickView(title: title, headerActionUrl: headerActionUrl, items: items)
            .onAppear {
                viewModel.decodeItems(from: component, type: BeautyPremiumPickView.PremiumItem.self)
            }
    }

    @ViewBuilder
    func renderBeautyLuxeLane() -> some View {
        let title = component.prop(for: "title") ?? "Luxe Lane"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items = (viewModel.data as? [BeautyLuxeLaneView.LuxeItem]) ?? []

        BeautyLuxeLaneView(title: title, headerActionUrl: headerActionUrl, items: items)
            .onAppear {
                viewModel.decodeItems(from: component, type: BeautyLuxeLaneView.LuxeItem.self)
            }
    }

    @ViewBuilder
    func renderBeautyEditorPick() -> some View {
        let title = component.prop(for: "title") ?? "Editor's Pick"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyEditorPickView.EditorPickItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyEditorPickView.EditorPickItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyEditorPickView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyGlamTop() -> some View {
        let title = component.prop(for: "title") ?? "Glam Top 10"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyGlamTopView.GlamItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyGlamTopView.GlamItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyGlamTopView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyFragranceLuxe() -> some View {
        let title = component.prop(for: "title") ?? "Fragrance Luxe"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyFragranceLuxeView.FragranceItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyFragranceLuxeView.FragranceItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyFragranceLuxeView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyMakeupMania() -> some View {
        let title = component.prop(for: "title") ?? "Makeup Mania"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyMakeupManiaView.MakeupItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyMakeupManiaView.MakeupItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyMakeupManiaView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautySkinCareSanctuary() -> some View {
        let title = component.prop(for: "title") ?? "Skincare Sanctuary"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautySkinCareSanctuaryView.SkinCareItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautySkinCareSanctuaryView.SkinCareItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautySkinCareSanctuaryView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyHairCareHaven() -> some View {
        let title = component.prop(for: "title") ?? "Haircare Haven"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyHairCareHavenView.HairCareItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyHairCareHavenView.HairCareItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyHairCareHavenView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyBathBodyBliss() -> some View {
        let title = component.prop(for: "title") ?? "Bath & Body Bliss"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyBathBodyBlissView.BathBodyItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyBathBodyBlissView.BathBodyItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyBathBodyBlissView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyWellnessWonders() -> some View {
        let title = component.prop(for: "title") ?? "Wellness Wonders"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyWellnessWondersView.WellnessItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyWellnessWondersView.WellnessItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyWellnessWondersView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyGroomingGurus() -> some View {
        let title = component.prop(for: "title") ?? "Grooming Gurus"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyGroomingGurusView.GroomingItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyGroomingGurusView.GroomingItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyGroomingGurusView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyBrandsWeLove() -> some View {
        let title = component.prop(for: "title") ?? "Brands We Love"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [BeautyBrandsWeLoveView.BrandItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BeautyBrandsWeLoveView.BrandItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        BeautyBrandsWeLoveView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderGloballyLovedAlisters() -> some View {
        let title = component.prop(for: "title") ?? "Globally Loved A-listers"
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
    func renderBeautyLaunchParty() -> some View {
        let title = component.prop(for: "title") ?? "Beauty Launch Party"
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
    func renderBeautyTrendMore() -> some View {
        let title = component.prop(for: "title") ?? "Trend & More"
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
    func renderInternetFamedBrands() -> some View {
        let title = component.prop(for: "title") ?? "Internet Famed Brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [InternetFamedBrandsView.BrandItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [InternetFamedBrandsView.BrandItem].self, from: data)
            {
                return decoded
            }
            return []
        }()
        InternetFamedBrandsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBeautyKBeauty() -> some View {
        let title = component.prop(for: "title") ?? "K-Beauty"
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
    func renderBeautyGlamBudget() -> some View {
        let title = component.prop(for: "title") ?? "Glam on a Budget"
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

    // MARK: - Sports & Fitness Renderers (New)

    @ViewBuilder
    func renderSportCricketSeason() -> some View {
        let title = component.prop(for: "title") ?? "Cricket Season Essentials"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items = (viewModel.data as? [SportCricketSeasonView.CricketItem]) ?? []

        SportCricketSeasonView(title: title, headerActionUrl: headerActionUrl, items: items)
            .onAppear {
                viewModel.decodeItems(
                    from: component, type: SportCricketSeasonView.CricketItem.self)
            }
    }

    @ViewBuilder
    func renderSportWinnerBrands() -> some View {
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
    func renderSportSupportGoals() -> some View {
        let title = component.prop(for: "title") ?? "Support Your Goals"
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
    func renderSportGymAccessories() -> some View {
        let title = component.prop(for: "title") ?? "Gym Accessories"
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
    func renderSportCombos() -> some View {
        let title = component.prop(for: "title") ?? "Sport Combos"
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
    func
        renderSportSavings() -> some View
    {
        let title = component.prop(for: "title") ?? "Sport Savings"
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
    func renderSportWishlist() -> some View {
        SportWishlistView(component: component)
    }

    // MARK: - Furniture Renderers

    @ViewBuilder
    func renderFurnitureDealOfDay() -> some View {
        let title = component.prop(for: "title") ?? "Deal of the Day"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureDealOfDayView.DealItem] = component.decodeItems(for: "items")
        FurnitureDealOfDayView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureTopBrands() -> some View {
        let title = component.prop(for: "title") ?? "Top Brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FBrandItem] = component.decodeItems(for: "items")
        FurnitureTopBrandsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureSponsorshipBanner() -> some View {
        let items: [FurnitureSponsorshipBannerView.BannerItem] = component.decodeItems(for: "items")
        FurnitureSponsorshipBannerView(items: items)
    }

    @ViewBuilder
    func renderFurnitureGrabOrGone() -> some View {
        let title = component.prop(for: "title") ?? "Grab or Gone"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureGrabOrGoneView.GrabItem] = component.decodeItems(for: "items")
        FurnitureGrabOrGoneView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureShopByRoom() -> some View {
        let title = component.prop(for: "title") ?? "Shop By Room"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureShopByRoomView.RoomItem] = component.decodeItems(for: "items")
        FurnitureShopByRoomView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureShopByMaterial() -> some View {
        let title = component.prop(for: "title") ?? "Shop By Material"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureShopByMaterialView.MaterialItem] = component.decodeItems(for: "items")
        FurnitureShopByMaterialView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureTrendingNow() -> some View {
        let title = component.prop(for: "title") ?? "Trending Now"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureTrendingNowView.TrendingItem] = component.decodeItems(for: "items")
        FurnitureTrendingNowView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureWishlist() -> some View {
        FurnitureWishlistView(component: component)
    }

    @ViewBuilder

    func renderFurnitureCustomerReviews() -> some View {
        FurnitureCustomerReviewsView(component: component)
    }

    @ViewBuilder
    func renderFurnitureEverybodyList() -> some View {
        FurnitureEverybodyListView(component: component)
    }

    @ViewBuilder

    func renderFurnitureRareFinds() -> some View {
        FurnitureRareFindsView(component: component)
    }

    @ViewBuilder
    func renderFurnitureStatementPieces() -> some View {
        FurnitureStatementPiecesView(component: component)
    }

    @ViewBuilder
    func renderFurnitureSamarthStore() -> some View {
        let title = component.prop(for: "title") ?? "Samarth Store"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureSamarthStoreView.BannerItem] = component.decodeItems(for: "items")
        FurnitureSamarthStoreView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureEmiOffers() -> some View {
        let title = component.prop(for: "title") ?? "EMI Offers"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FurnitureEmiOffersView.EmiItem] = component.decodeItems(for: "items")
        FurnitureEmiOffersView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFurnitureTopFurnitureBrands() -> some View {
        let title = component.prop(for: "title") ?? "Top Furniture Brands"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let items: [FBrandGridItem] = component.decodeItems(for: "items")
        FurnitureTopFurnitureBrandsView(
            title: title, headerActionUrl: headerActionUrl, items: items)
    }

    // MARK: - For You / Promo Renderers (Restored)

    @ViewBuilder
    func renderCuratedCollections() -> some View {
        let items: [CuratedCollectionsView.CollectionItem] = component.decodeItems(for: "items")
        CuratedCollectionsView(collections: items)
    }

    @ViewBuilder
    func renderFiftyPercentOffZone() -> some View {
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
    func renderGrandKitchenSale() -> some View {
        // This view manages its own data and content
        GrandKitchenSaleView()
    }

    @ViewBuilder
    func renderLightningDeals() -> some View {
        let title = component.prop(for: "title") ?? "Lightning deals"
        let subtitle = component.prop(for: "subtitle") ?? "Big savings on select products"
        // Items might be passed as productIds or limit, usually this view fetches its own data
        // We'll pass standard props if available
        LightningDealsView(title: title, subtitle: subtitle)
    }

    @ViewBuilder
    func renderRecentHistory() -> some View {
        RecentHistoryView()
    }

    @ViewBuilder
    func renderGroceryRow() -> some View {
        let categoryId = component.prop(for: "categoryId") ?? "GROCERY_ID"
        GroceryRowView(categoryId: categoryId)
    }

    @ViewBuilder
    func renderActiveOrders() -> some View {
        Text("Active Orders Component Placeholder")
    }

    @ViewBuilder
    func renderHeroCarousel() -> some View {
        let items: [HeroBannerView.BannerData] = component.decodeItems(for: "items")
        let finalItems: [HeroBannerView.BannerData] =
            items.isEmpty ? component.decodeItems(for: "banners") : items

        HeroBannerView(bannersCallback: { finalItems })
    }

    @ViewBuilder
    func renderSubCategorySlider() -> some View {
        let parentId =
            component.prop(for: "categoryId")
            ?? component.prop(for: "parentCategoryId")
            ?? ""

        SubCategorySliderView(parentCategoryId: parentId)
    }

    @ViewBuilder
    func renderShoppingForOthersHub() -> some View {
        // Try multiple keys for robustness
        let items: [ShoppingForOthersHubView.CategoryItem] = {
            var loaded = component.decodeItems(
                for: "items", as: [ShoppingForOthersHubView.CategoryItem].self)
            if loaded.isEmpty {
                loaded = component.decodeItems(
                    for: "categories", as: [ShoppingForOthersHubView.CategoryItem].self)
            }
            if loaded.isEmpty {
                loaded = component.decodeItems(
                    for: "data", as: [ShoppingForOthersHubView.CategoryItem].self)
            }
            return loaded
        }()

        let title = component.prop(for: "title") ?? "Shopping for others?"
        let subtitle = component.prop(for: "subtitle") ?? "Choose a category to start exploring"

        if items.isEmpty {
            VStack(alignment: .leading, spacing: 4) {
                Text(title).font(.headline)
                Text(subtitle).font(.subheadline)
                Text("⚠️ No items loaded").foregroundColor(.red).font(.caption)
                Text(
                    "Available props: \(component.props?.keys.sorted().joined(separator: ", ") ?? "nil")"
                ).font(.caption2).foregroundColor(.gray)
                if let itemsVal = component.props?["items"] {
                    Text("Items Type: \(type(of: itemsVal.value))").font(.caption2)
                }
            }
            .padding()
            .background(Color.yellow.opacity(0.1))
        } else {
            ShoppingForOthersHubView(title: title, subtitle: subtitle, categories: items)
        }
    }

    @ViewBuilder
    func renderEarlyBirdDeals() -> some View {
        let items: [EarlyBirdDealsView.DealItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Early Bird Deals!"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        EarlyBirdDealsView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderSankrantiFestival() -> some View {
        let items: [SankrantiFestivalView.FestiveItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Shine bright this Sankranti"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        SankrantiFestivalView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderShoeStealFest() -> some View {
        let items: [ShoeStealFestView.ShoeItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Shoe's Steal Fest"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        ShoeStealFestView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderWinterClearance() -> some View {
        let items: [WinterClearanceView.ClearanceItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Winter Clearance Sale"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        WinterClearanceView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderBudgetBuys() -> some View {
        let items: [BudgetBuysView.BudgetItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Budget Buys"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        BudgetBuysView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderFashionForecast() -> some View {
        let items: [FashionForecastView.ForecastItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "FASHION FORECAST"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        FashionForecastView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderWinterCollection() -> some View {
        let items: [WinterCollectionView.CollectionItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Winter collection"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        WinterCollectionView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderPromoPoster() -> some View {
        let title = component.prop(for: "title") ?? "Promotions"  // Keep title just in case, though view might not use it
        let image = component.prop(for: "image") ?? ""
        let actionUrl = component.prop(for: "actionUrl") as String?

        // PromoPosterView only takes image and actionUrl
        PromoPosterView(image: image, actionUrl: actionUrl)
    }

    @ViewBuilder
    func renderGlowForHarvest() -> some View {
        // Correct type name is HarvestItem, not GlowItem
        let items: [GlowForHarvestView.HarvestItem] = component.decodeItems(for: "items")
        let title = component.prop(for: "title") ?? "Glow for Harvest"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        GlowForHarvestView(title: title, headerActionUrl: headerActionUrl, items: items)
    }

    @ViewBuilder
    func renderConsultationBanner() -> some View {
        let title = component.prop(for: "title") ?? "Consult with top doctors"
        let callText = component.prop(for: "callText") ?? "Call now:"
        let phoneNumber = component.prop(for: "phoneNumber") ?? "1800-123-4567"
        let poweredByText = component.prop(for: "poweredByText") ?? "Powered by"
        let providerName = component.prop(for: "providerName") ?? "HealthLine"
        let doctorImage = component.prop(for: "doctorImage") ?? ""
        let actionUrl = component.prop(for: "actionUrl") as String?

        ConsultationBannerView(
            actionUrl: actionUrl,
            title: title,
            callText: callText,
            phoneNumber: phoneNumber,
            poweredByText: poweredByText,
            providerName: providerName,
            doctorImage: doctorImage
        )
    }

    // MARK: - Services Renderers

    @ViewBuilder
    func renderServiceHeader() -> some View {
        ServiceHeaderView(component: component)
    }

    @ViewBuilder
    func renderServiceHeroSection() -> some View {
        ServiceHeroSectionView(component: component)
    }

    @ViewBuilder
    func renderServiceCategorySection() -> some View {
        ServiceCategorySectionView(component: component)
    }

    @ViewBuilder
    func renderServiceBottomNav() -> some View {
        ServiceBottomNavView()
    }

    // MARK: - Back To School Stubs

    @ViewBuilder
    func renderBackToSchoolHeader() -> some View { Text("BTS Header") }
    @ViewBuilder
    func renderBackToSchoolBanner() -> some View { Text("BTS Banner") }
    @ViewBuilder
    func renderBackToSchoolCategories() -> some View { Text("BTS Categories") }
    @ViewBuilder
    func renderBackToSchoolGrid() -> some View { Text("BTS Grid") }
    @ViewBuilder
    func renderBackToSchoolFooter() -> some View { Text("BTS Footer") }

    @ViewBuilder
    func renderSchoolTwoHeader() -> some View { Text("School 2 Header") }
    @ViewBuilder
    func renderSchoolTwoBanner() -> some View { Text("School 2 Banner") }
    @ViewBuilder
    func renderSchoolTwoCategories() -> some View { Text("School 2 Categories") }
    @ViewBuilder
    func renderSchoolTwoDeals() -> some View { Text("School 2 Deals") }
    @ViewBuilder
    func renderSchoolTwoGrid() -> some View { Text("School 2 Grid") }
    @ViewBuilder
    func renderSchoolTwoFooter() -> some View { Text("School 2 Footer") }

    @ViewBuilder
    func renderSchoolThreeHeader() -> some View { Text("School 3 Header") }
    @ViewBuilder
    func renderSchoolThreeBanner() -> some View { Text("School 3 Banner") }
    @ViewBuilder
    func renderSchoolThreeCategories() -> some View { Text("School 3 Categories") }
    @ViewBuilder
    func renderSchoolThreeEssentials() -> some View { Text("School 3 Essentials") }
    @ViewBuilder
    func renderSchoolThreeGrid() -> some View { Text("School 3 Grid") }
    @ViewBuilder
    func renderSchoolThreeFooter() -> some View { Text("School 3 Footer") }

    @ViewBuilder
    func renderSchoolFourHeader() -> some View { Text("School 4 Header") }
    @ViewBuilder
    func renderSchoolFourCategories() -> some View { Text("School 4 Categories") }
    @ViewBuilder
    func renderSchoolFourGrid() -> some View { Text("School 4 Grid") }
    @ViewBuilder
    func renderSchoolFourFooter() -> some View { Text("School 4 Footer") }

    @ViewBuilder
    func renderSchoolFiveHeader() -> some View { Text("School 5 Header") }
    @ViewBuilder
    func renderSchoolFiveCategories() -> some View { Text("School 5 Categories") }
    @ViewBuilder
    func renderSchoolFiveGrid() -> some View { Text("School 5 Grid") }
    @ViewBuilder
    func renderSchoolFiveFooter() -> some View { Text("School 5 Footer") }

    // MARK: - Dry Fruits / Generic Renderers (New)

    @ViewBuilder
    func renderTextBlock() -> some View {
        let text = component.prop(for: "text") ?? ""
        Text(text)
            .padding()
    }

    @ViewBuilder
    func renderProductGrid() -> some View {
        let title = component.prop(for: "title") ?? ""
        let items = (viewModel.data as? [Product]) ?? []

        ProductCardGrid(products: items, title: title)
            .onAppear {
                // Try static props first, then dynamic
                if let itemsValue = component.props?["items"]?.value {
                    viewModel.decodeItems(from: component, type: Product.self)
                } else {
                    loadDynamicProducts()
                }
            }
    }

    @ViewBuilder
    func renderFlashSaleGrid() -> some View {
        // Renders a grid of flash sale items
        let title = component.prop(for: "title") ?? "Flash Sale"
        let subtitle = component.prop(for: "subtitle") ?? ""
        // Use ProductCardGrid for the grid layout
        // Decode items from props
        let items: [Product] = component.decodeItems(for: "items")

        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#BE123C"))

                if !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "#4B5563"))
                }
            }
            .padding(.horizontal, 16)

            ProductCardGrid(products: items, title: nil)
        }
        .padding(.vertical, 16)
        .background(Color(hex: "#FFF7ED"))  // Light orange bg
    }

    @ViewBuilder
    func renderFeaturedCarousel() -> some View {
        // Horizontal list of products
        let title = component.prop(for: "title") ?? "Featured"
        let items: [Product] = component.decodeItems(for: "items")

        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                Spacer()
            }
            .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(items) { product in
                        ProductCardView(product: product, width: 160)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
    }

    @ViewBuilder
    func renderBestQuality() -> some View {
        let title = component.prop(for: "title") ?? "Best quality"
        let headerActionUrl = component.prop(for: "headerActionUrl") as String?
        let headerImage = component.prop(for: "headerImage") as String?
        let backgroundColor = component.prop(for: "backgroundColor") ?? "#DD1717"

        let items: [BestQualityView.BestQualityItem] = {
            if let itemsValue = component.props?["items"]?.value,
                let data = try? JSONSerialization.data(withJSONObject: itemsValue),
                let decoded = try? JSONDecoder().decode(
                    [BestQualityView.BestQualityItem].self, from: data)
            {
                return decoded
            }
            return []
        }()

        BestQualityView(
            title: title,
            headerActionUrl: headerActionUrl,
            headerImage: headerImage,
            backgroundColor: backgroundColor,
            items: items
        )
    }
}
