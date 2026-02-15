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

    // Safe area
    private var safeAreaTop: CGFloat {
        let scenes = UIApplication.shared.connectedScenes
        let windowScene = scenes.first as? UIWindowScene
        return windowScene?.windows.first?.safeAreaInsets.top ?? 59
    }

    // Managers
    @StateObject private var locationManager = LocationManager()
    @StateObject private var cartManager = CartManager()
    @StateObject private var beautyManager = BeautyManager()
    @StateObject private var basketManager = BasketManager()

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
                CartPageView()
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
            .onChange(of: navigationManager.activeTab) { newVal in
            }
            .onAppear {
                locationManager.requestPermission()
                locationManager.fetchSavedAddresses()
            }
            .fullScreenCover(isPresented: $navigationManager.showBeautyPage) {
                NavigationView { BeautyProductView() }
                    .environmentObject(navigationManager)
                    .environmentObject(cartManager)
                    .environmentObject(beautyManager)
                    .environmentObject(basketManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showSpecialDealPage) {
                SpecialDealNewStyleView()
                    .environmentObject(navigationManager)
                    .environmentObject(cartManager)
                    .environmentObject(beautyManager)
                    .environmentObject(basketManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showBrandNewArrivalPage) {
                BrandNewArrivalView().environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showMenFashionPage) {
                MenFashionView()
                    .environmentObject(navigationManager)
                    .environmentObject(cartManager)
                    .environmentObject(beautyManager)
                    .environmentObject(basketManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showGrandMobilesPage) {
                GrandMobilesView().environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showShoesSalesPage) {
                ShoesSalesView().environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showCyberSalePage) {
                CyberSaleView().environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showCategoryPage) {
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
                    .environmentObject(navigationManager)
                    .environmentObject(cartManager)
                    .environmentObject(basketManager)
                    .environmentObject(WishlistManager.shared)
                }
            }

            // Global Address Selector
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
            .allowsHitTesting(locationManager.showAddressSelector)
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

    // Computed props
    var currentSlug: String {
        navigationManager.selectedCategory.lowercased().replacingOccurrences(of: " ", with: "-")
    }

    var safeAreaTop: CGFloat {
        let scenes = UIApplication.shared.connectedScenes
        let windowScene = scenes.first as? UIWindowScene
        return windowScene?.windows.first?.safeAreaInsets.top ?? 59
    }

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
            } else if navigationManager.activeTab == .influencers {
                InfluencersPageView()
                    .frame(maxWidth: .infinity)
            } else {
                // Default Home / Shopping
                NavigationView {
                    let theme: HomeHeaderTheme =
                        navigationManager.selectedCategory == "For You"
                        ? ForYouHomeHeaderTheme()
                        : DefaultHomeHeaderTheme(showIcons: showIcons)

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
                                            .background(Color(hex: "#F9FAFB"))
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
                            .onChange(of: navigationManager.selectedCategory) { _, _ in
                                showIcons = true
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
                    .navigationBarHidden(true)
                }
            }
        }
    }

    @ViewBuilder
    private func pageContent(for slug: String) -> some View {
        switch slug {
        case "fashion": FashionPage()
        case "for-you": ForYouPage()
        case "mobiles": SDUIPage(slug: "mobiles")
        case "beauty": BeautyPage()
        case "electronics": ElectronicsPage()
        case "home": SDUIPage(slug: "home")
        case "appliances": SDUIPage(slug: "appliances")
        case "toys": SDUIPage(slug: "toys")
        case "food-&-health": SDUIPage(slug: "food-health")
        case "dry-fruits": SDUIPage(slug: "dry-fruits")
        case "auto": SDUIPage(slug: "auto")
        case "sports": SportsPage()
        case "books": BooksPage()
        case "furniture": FurniturePage()
        case "jewellery": SDUIPage(slug: "jewellery")
        default:
            Text("Content for \(slug)")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(hex: "#F9FAFB"))
        }
    }
}
