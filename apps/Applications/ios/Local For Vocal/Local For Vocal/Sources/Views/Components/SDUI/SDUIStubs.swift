import SwiftUI

// MARK: - Helper Models
// CarouselItem, CategoryCircleItem, GridItemData are defined in SDUIComponentView.swift or elsewhere.
// Only define if truly missing, but grep showed duplicates.

// MARK: - Helper Models

struct CarouselItem: Identifiable, Decodable {
    let id: String
    let image: String
    let actionUrl: String?
}

struct CategoryCircleItem: Identifiable, Decodable {
    let id: String
    let title: String
    let image: String
}

struct GridItemData: Identifiable, Decodable {
    let id: String
    let title: String
    let image: String
    let price: String?
}

struct BannerItemData: Identifiable, Decodable {
    let id: String
    let image: String
    let link: String?
}

// MARK: - Beauty Views (New)

struct BeautyPremiumPickView: View {
    struct PremiumItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [PremiumItem]
    var body: some View { Text("Beauty Premium Pick") }
}

struct BeautyLuxeLaneView: View {
    struct LuxeItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [LuxeItem]
    var body: some View { Text("Beauty Luxe Lane") }
}

struct BeautyEditorPickView: View {
    struct EditorPickItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [EditorPickItem]
    var body: some View { Text("Beauty Editor Pick") }
}

struct BeautyGlamTopView: View {
    struct GlamItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let rank: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [GlamItem]
    var body: some View { Text("Beauty Glam Top") }
}

struct BeautyFragranceLuxeView: View {
    struct FragranceItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [FragranceItem]
    var body: some View { Text("Beauty Fragrance Luxe") }
}

struct BeautyMakeupManiaView: View {
    struct MakeupItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [MakeupItem]
    var body: some View { Text("Beauty Makeup Mania") }
}

struct BeautySkinCareSanctuaryView: View {
    struct SkinCareItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [SkinCareItem]
    var body: some View { Text("Beauty Skin Care Sanctuary") }
}

struct BeautyHairCareHavenView: View {
    struct HairCareItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [HairCareItem]
    var body: some View { Text("Beauty Hair Care Haven") }
}

struct BeautyBathBodyBlissView: View {
    struct BathBodyItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [BathBodyItem]
    var body: some View { Text("Beauty Bath Body Bliss") }
}

struct BeautyWellnessWondersView: View {
    struct WellnessItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [WellnessItem]
    var body: some View { Text("Beauty Wellness Wonders") }
}

struct BeautyGroomingGurusView: View {
    struct GroomingItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [GroomingItem]
    var body: some View { Text("Beauty Grooming Gurus") }
}

struct BeautyBrandsWeLoveView: View {
    struct BrandItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [BrandItem]
    var body: some View { Text("Beauty Brands We Love") }
}

// MARK: - Internet Famed Brands View (Restored)

struct InternetFamedBrandsView: View {
    struct BrandItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let actionUrl: String?
    }
    var title: String
    var headerActionUrl: String?
    var items: [BrandItem]
    var body: some View { Text("Internet Famed Brands") }
}

// MARK: - Generic Stubs

struct CarouselView: View {
    var items: [CarouselItem] = []

    var body: some View {
        Text("Carousel Component")
            .frame(height: 200)
            .background(Color.gray.opacity(0.1))
    }
}

struct CategoryCirclesView: View {
    var items: [CategoryCircleItem] = []

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(0..<5) { _ in
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 60, height: 60)
                }
            }
        }
        .frame(height: 80)
    }
}

// MARK: - Luminous Stubs

struct LuminousNewsletterView: View {
    var body: some View {
        Text("Luminous Newsletter")
    }
}

// MARK: - Shopping Page Stubs

struct BrandSpotlightView: View {
    var component: SDUIComponent
    var body: some View { Text("Brand Spotlight") }
}

struct CollectionGridView: View {
    var component: SDUIComponent
    var body: some View { Text("Collection Grid") }
}

struct FeaturedProductsView: View {
    var component: SDUIComponent
    var body: some View { Text("Featured Products") }
}

struct SeasonalShowcaseView: View {
    var component: SDUIComponent
    var body: some View { Text("Seasonal Showcase") }
}

// MARK: - Banner Page Stubs

struct BannerPageHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Banner Page Header") }
}

struct BannerPageGridView: View {
    var component: SDUIComponent
    var body: some View { Text("Banner Page Grid") }
}

struct BannerPageFooterView: View {
    var body: some View { Text("Banner Page Footer") }
}

// MARK: - Fashion Page Stubs

struct FashionCollectionsView: View {
    var component: SDUIComponent
    var body: some View { Text("Fashion Collections") }
}

// MARK: - Electronics Page Stubs

struct ElectronicsHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Electronics Header") }
}

struct ElectronicsDealsView: View {
    var component: SDUIComponent
    var body: some View { Text("Electronics Deals") }
}

struct ElectronicsCategoriesView: View {
    var component: SDUIComponent
    var body: some View { Text("Electronics Categories") }
}

// MARK: - Beauty Page (Old) Stubs

struct BeautyHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Beauty Header") }
}

struct BeautyTopPicksView: View {
    var component: SDUIComponent
    var body: some View { Text("Beauty Top Picks") }
}

struct BeautyNewArrivalsView: View {
    var component: SDUIComponent
    var body: some View { Text("Beauty New Arrivals") }
}

// MARK: - Home & Kitchen Stubs

// HomeHeaderView is defined in HomeHeader.swift

struct HomeDecorView: View {
    var component: SDUIComponent
    var body: some View { Text("Home Decor") }
}

struct KitchenEssentialsView: View {
    var component: SDUIComponent
    var body: some View { Text("Kitchen Essentials") }
}

// MARK: - Sports Stubs

struct SportsHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Sports Header") }
}

struct SportsGearView: View {
    var component: SDUIComponent
    var body: some View { Text("Sports Gear") }
}

struct FitnessEquipmentView: View {
    var component: SDUIComponent
    var body: some View { Text("Fitness Equipment") }
}

// MARK: - Toys Stubs

struct ToysHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Toys Header") }
}

struct ToysTrendingView: View {
    var component: SDUIComponent
    var body: some View { Text("Toys Trending") }
}

struct BabyCareView: View {
    var component: SDUIComponent
    var body: some View { Text("Baby Care") }
}

// MARK: - Books Stubs

struct BooksHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Books Header") }
}

struct BestSellersView: View {
    var component: SDUIComponent
    var body: some View { Text("Best Sellers") }
}

struct StationerySuppliesView: View {
    var component: SDUIComponent
    var body: some View { Text("Stationery Supplies") }
}

// MARK: - Services Stubs

struct ServiceHeaderView: View {
    var component: SDUIComponent
    var body: some View { Text("Service Header") }
}

struct ServiceHeroSectionView: View {
    var component: SDUIComponent
    var body: some View { Text("Service Hero") }
}

struct ServiceCategorySectionView: View {
    var component: SDUIComponent
    var body: some View { Text("Service Category") }
}

struct ServiceBottomNavView: View {
    var body: some View { Text("Service Bottom Nav") }
}
