import SwiftUI
import UIKit

// Configure tab bar with clear glass appearance
private func configureTabBarAppearance() {
    let appearance = UITabBarAppearance()
    appearance.configureWithDefaultBackground()

    // Background effect - translucent glass
    appearance.backgroundEffect = UIBlurEffect(style: .systemChromeMaterial)
    appearance.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.8)

    // Shadow line (Removed for glass effect)
    appearance.shadowColor = .clear

    // Selected item appearance - Blue color
    let selectedColor = UIColor(red: 40 / 255, green: 116 / 255, blue: 240 / 255, alpha: 1)  // Blue #2874F0
    let normalColor = UIColor.secondaryLabel

    appearance.stackedLayoutAppearance.selected.iconColor = selectedColor
    appearance.stackedLayoutAppearance.selected.titleTextAttributes = [
        .foregroundColor: selectedColor
    ]

    appearance.stackedLayoutAppearance.normal.iconColor = normalColor
    appearance.stackedLayoutAppearance.normal.titleTextAttributes = [.foregroundColor: normalColor]

    UITabBar.appearance().standardAppearance = appearance
    UITabBar.appearance().scrollEdgeAppearance = appearance
}

// Configure navigation bar to remove default shadow/border
private func configureNavigationBarAppearance() {
    let appearance = UINavigationBarAppearance()
    appearance.configureWithTransparentBackground()
    appearance.shadowColor = .clear
    appearance.backgroundColor = .clear

    UINavigationBar.appearance().standardAppearance = appearance
    UINavigationBar.appearance().scrollEdgeAppearance = appearance
}

////////////////////////////////////////////////////////////////////////////////
// Scroll Offset Preference Key (Simplified)
////////////////////////////////////////////////////////////////////////////////
struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

////////////////////////////////////////////////////////////////////////////////
// Header Frame Preference Key (Tracks Bottom of Sticky Header for Glass Height)
////////////////////////////////////////////////////////////////////////////////
struct HeaderBottomPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

struct ContentView: View {
    private let api = APIService.shared
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var errorMessage: String?

    // Navigation Manager
    @StateObject private var navigationManager = NavigationManager()

    // Header States
    @State private var currentTab: MainTab = .home

    // Fix #2: Cache safeAreaTop to avoid scene traversal on every body eval
    @State private var safeAreaTop: CGFloat = 59

    // Managers
    @StateObject private var locationManager = LocationManager()
    @StateObject private var cartManager = CartManager()
    @StateObject private var beautyManager = BeautyManager()
    @StateObject private var basketManager = BasketManager()
    // Fix #24: Initialize WishlistManager at root level
    private let wishlistManager = WishlistManager.shared

    init() {
        configureTabBarAppearance()
        configureNavigationBarAppearance()
    }

    var body: some View {
        ZStack {
            TabView(selection: $currentTab) {
                // Home Tab
                HomeTabContent()
                    .toolbar(
                        navigationManager.activeTab == .grocery ? .hidden : .visible, for: .tabBar
                    )
                    .tabItem {
                        Image(systemName: "house")
                        Text("Home")
                    }
                    .tag(MainTab.home)

                // Categories Tab
                CategoriesPageView()
                    .tabItem {
                        Image(systemName: "square.grid.2x2")
                        Text("Categories")
                    }
                    .tag(MainTab.categories)

                // Cart Tab
                NavigationStack {
                    CartPageView()
                }
                .tabItem {
                    Image(systemName: "cart")
                    Text("Cart")
                }
                .tag(MainTab.cart)

                // Account Tab
                AccountView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(hex: "#F3F4F6"))
                    .tabItem {
                        Image(systemName: "person")
                        Text("Account")
                    }
                    .tag(MainTab.account)
            }
            .accentColor(Color(hex: "#2874F0"))
            .environmentObject(cartManager)
            .environmentObject(beautyManager)
            .environmentObject(basketManager)
            .environmentObject(navigationManager)
            .environmentObject(locationManager)
            .environmentObject(wishlistManager)
            .onChange(of: navigationManager.activeTab) { newVal in
            }
            .onAppear {
                locationManager.requestPermission()
                locationManager.fetchSavedAddresses()
                // Fix #2: Cache safe area insets once
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                    let window = windowScene.windows.first
                {
                    safeAreaTop = window.safeAreaInsets.top
                }
            }
            // Fix #6: Single fullScreenCover replaces 8 separate ones
            .fullScreenCover(item: $navigationManager.activeOverlay) { destination in
                overlayView(for: destination)
                    .environmentObject(navigationManager)
                    .environmentObject(cartManager)
                    .environmentObject(beautyManager)
                    .environmentObject(basketManager)
                    .environmentObject(wishlistManager)
            }

            // Fix #20: Only render address selector when visible
            if locationManager.showAddressSelector {
                UserAddressSelectorView(
                    isVisible: $locationManager.showAddressSelector,
                    savedUserAddresses: locationManager.savedAddresses,
                    selectedUserAddressId: .constant(nil),
                    onSelectUserAddress: { address in
                        locationManager.address = address.addressLine1
                        locationManager.city = address.city
                        locationManager.showAddressSelector = false
                    },
                    onUseCurrentLocation: {
                        locationManager.startUpdating()
                        locationManager.showAddressSelector = false
                    },
                    onAddNewUserAddress: {
                        locationManager.showAddressSelector = false
                    }
                )
                .zIndex(1000)
                .ignoresSafeArea()
                .transition(.opacity)
            }
        }
    }

    // Fix #6: Single overlay builder replaces 8 fullScreenCovers
    @ViewBuilder
    private func overlayView(for destination: OverlayDestination) -> some View {
        switch destination {
        case .beauty:
            NavigationView { BeautyProductView() }
        case .specialDeal:
            SpecialDealNewStyleView()
        case .brandNewArrival:
            BrandNewArrivalView()
        case .menFashion:
            MenFashionView()
        case .grandMobiles:
            GrandMobilesView()
        case .shoesSales:
            ShoesSalesView()
        case .cyberSale:
            CyberSaleView()
        case .categoryPage:
            if let params = navigationManager.categoryNavigation {
                NavigationView {
                    if params.layoutType == "grocery" {
                        GroceryListingView(
                            categoryId: params.categoryId,
                            categoryName: params.categoryName,
                            initialSubCategoryId: params.subCategoryId,
                            initialFilters: params.filters
                        )
                    } else {
                        CommonCategoryPageView(
                            categoryId: params.categoryId,
                            categoryName: params.categoryName,
                            initialSubCategoryId: params.subCategoryId,
                            initialFilters: params.filters
                        )
                    }
                }
                .background(Color.white)
            }
        }
    }
}

// MARK: - Home Tab Content View
struct HomeTabContent: View {
    @EnvironmentObject var navigationManager: NavigationManager
    @EnvironmentObject var locationManager: LocationManager
    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var beautyManager: BeautyManager
    @EnvironmentObject var basketManager: BasketManager

    // Header States
    @State private var showIcons: Bool = true
    @State private var headerHeight: CGFloat = 300
    @State private var scrollOffset: CGFloat = 0

    // Fix #15: Cache slug in @State, computed on category change
    @State private var currentSlug: String = "for-you"
    // Fix #3: Cache theme in @State
    @State private var cachedTheme: (category: String, showIcons: Bool, theme: HomeHeaderTheme)?

    // Fix #2: Cache safe area insets
    @State private var safeAreaTop: CGFloat = 59

    var body: some View {
        Group {
            if navigationManager.activeTab == .grocery {
                NavigationView {
                    GroceryPageView()
                        .navigationBarHidden(true)
                }
                .navigationViewStyle(.stack)
            } else if navigationManager.activeTab == .services {
                ServicesPageView()
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
            } else if navigationManager.activeTab == .influencers {
                InfluencersPageView()
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
            } else {
                // Default Home / Shopping
                NavigationView {
                    // Fix #3: Use cached theme, only recompute when category/showIcons change
                    let theme: HomeHeaderTheme = resolvedTheme
                    ZStack(alignment: .top) {
                        // SCROLLABLE CONTENT (Top Layer)
                        ScrollView {
                            VStack(spacing: 0) {
                                // TOP HEADER (Scrolls Away - Wrapped in standard VStack to prevent recycling)
                                HomeTopHeaderView(
                                    theme: theme,
                                    safeAreaTop: safeAreaTop
                                )
                                .padding(.bottom, -safeAreaTop)  // Pull up sticky header to overlap gap
                                .frame(minHeight: 120)
                                .zIndex(1)

                                LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                                    // STICKY HEADER (Pins)
                                    Section(
                                        header: HomeStickyHeaderView(
                                            showIcons: $showIcons,
                                            theme: theme,
                                            safeAreaTop: safeAreaTop,
                                            headerHeight: headerHeight,
                                            scrollOffset: scrollOffset
                                        )
                                        .frame(minHeight: 110)
                                        // TRACK BOTTOM EDGE -> SETS GLASS HEIGHT
                                        .background(
                                            GeometryReader { proxy in
                                                Color.clear.preference(
                                                    key: HeaderBottomPreferenceKey.self,
                                                    value: proxy.frame(in: .global).maxY
                                                )
                                            }
                                        )
                                    ) {
                                        pageContent(for: currentSlug)
                                            .id(currentSlug)
                                            .background(Color.white)
                                    }
                                }
                            }
                            // Removed BodyContentHeightKey background usage to fix build error
                            .overlay(
                                GeometryReader { proxy in
                                    Color.clear
                                        .preference(
                                            key: ScrollOffsetPreferenceKey.self,
                                            value: proxy.frame(in: .named("scroll")).minY
                                        )
                                },
                                alignment: .top
                            )
                            .onChange(of: navigationManager.selectedCategory) { _, newValue in
                                showIcons = true
                                // Fix #15: Update cached slug on category change
                                currentSlug = newValue.lowercased().replacingOccurrences(
                                    of: " ", with: "-")
                                // Fix #3: Eagerly rebuild cached theme
                                cachedTheme = (
                                    category: newValue, showIcons: showIcons,
                                    theme: themeForCategory(newValue, showIcons: showIcons)
                                )
                            }
                            .onChange(of: showIcons) { _, newValue in
                                // Fix #3: Eagerly rebuild cached theme on showIcons change
                                let cat = navigationManager.selectedCategory
                                cachedTheme = (
                                    category: cat, showIcons: newValue,
                                    theme: themeForCategory(cat, showIcons: newValue)
                                )
                            }
                        }
                        .coordinateSpace(name: "scroll")
                        .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                            self.scrollOffset = value
                            let shouldShow = value > -5
                            if shouldShow != showIcons {
                                withAnimation(.easeInOut(duration: 0.25)) {
                                    showIcons = shouldShow
                                }
                            }
                        }
                        .onPreferenceChange(HeaderBottomPreferenceKey.self) { value in
                            // Sync Glass Height to Header Bottom
                            if value > 0 {
                                headerHeight = value
                            }
                        }
                        .background(Color.clear)  // Transparent so ZStack background shows through
                        .ignoresSafeArea(edges: .top)
                        .zIndex(2)
                    }
                    .background(Color.white)
                    .navigationBarHidden(true)
                }
            }
        }
        .onAppear {
            // Fix #2: Cache safe area insets once
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                let window = windowScene.windows.first
            {
                safeAreaTop = window.safeAreaInsets.top
            }
            // Fix #15: Initialize slug
            currentSlug = navigationManager.selectedCategory.lowercased().replacingOccurrences(
                of: " ", with: "-")
            // Fix #3: Initialize cached theme on first appear
            let cat = navigationManager.selectedCategory
            cachedTheme = (
                category: cat, showIcons: showIcons,
                theme: themeForCategory(cat, showIcons: showIcons)
            )
        }
    }

    // Fix #3: Resolve theme from cache — always populated by onChange/onAppear
    private var resolvedTheme: HomeHeaderTheme {
        if let cached = cachedTheme,
            cached.category == navigationManager.selectedCategory,
            cached.showIcons == showIcons
        {
            return cached.theme
        }
        // Fallback: should rarely hit since cachedTheme is populated in onAppear/onChange
        return themeForCategory(navigationManager.selectedCategory, showIcons: showIcons)
    }

    // MARK: - Theme per category
    private func themeForCategory(_ category: String, showIcons: Bool) -> HomeHeaderTheme {
        switch category {
        case "For You": return ForYouHomeHeaderTheme()
        case "Ramadan": return RamadanHomeHeaderTheme()
        case "Fashion": return FashionHomeHeaderTheme()
        case "Mobiles": return MobilesHomeHeaderTheme()
        case "Beauty": return BeautyHomeHeaderTheme()
        case "Electronics": return ElectronicsHomeHeaderTheme()
        case "Home": return HomeDecorHomeHeaderTheme()
        case "Appliances": return AppliancesHomeHeaderTheme()
        case "Toys": return ToysHomeHeaderTheme()
        case "Food & Health": return FoodHealthHomeHeaderTheme()
        case "Dry Fruits": return DryFruitsHomeHeaderTheme()
        case "Auto": return AutoHomeHeaderTheme()
        case "Sports": return SportsHomeHeaderTheme()
        case "Books": return BooksHomeHeaderTheme()
        case "Furniture": return FurnitureHomeHeaderTheme()
        case "Jewellery": return JewelleryHomeHeaderTheme()
        default: return DefaultHomeHeaderTheme(showIcons: showIcons)
        }
    }

    @ViewBuilder
    private func pageContent(for slug: String) -> some View {
        switch slug {
        case "for-you": ForYouPage()
        case "ramadan": RamadanPage()
        case "fashion": FashionThemePage()
        case "mobiles": MobilesThemePage()
        case "beauty": BeautyThemePage()
        case "electronics": ElectronicsThemePage()
        case "home": HomeDecorThemePage()
        case "appliances": AppliancesThemePage()
        case "toys": ToysThemePage()
        case "food-&-health": FoodHealthThemePage()
        case "dry-fruits": DryFruitsThemePage()
        case "auto": AutoThemePage()
        case "sports": SportsThemePage()
        case "books": BooksThemePage()
        case "furniture": FurnitureThemePage()
        case "jewellery": JewelleryThemePage()
        default:
            Text("Content for \(slug)")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.white)
        }
    }
}
