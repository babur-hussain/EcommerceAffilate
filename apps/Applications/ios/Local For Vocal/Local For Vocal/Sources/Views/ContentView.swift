import SwiftUI
import UIKit

// Configure tab bar with clear glass appearance
private func configureTabBarAppearance() {
    let appearance = UITabBarAppearance()
    appearance.configureWithDefaultBackground()

    // Background effect - translucent glass
    appearance.backgroundEffect = UIBlurEffect(style: .systemChromeMaterial)
    appearance.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.8)

    // Shadow line
    appearance.shadowColor = UIColor.separator.withAlphaComponent(0.3)

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

////////////////////////////////////////////////////////////////////////////////
// Scroll Offset Preference Key
////////////////////////////////////////////////////////////////////////////////
struct ScrollOffsetPreferenceKey: PreferenceKey {
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

    // Header States (Home Tab) - Now using NavigationManager defaults
    @State private var showIcons: Bool = true

    // Main Tab State
    @State private var currentTab: MainTab = .home

    // Computed slug based on category (Home Tab)
    var currentSlug: String {
        navigationManager.selectedCategory.lowercased().replacingOccurrences(of: " ", with: "-")
    }

    // Location Manager
    @StateObject private var locationManager = LocationManager()

    // Cart Manager
    @StateObject private var cartManager = CartManager()

    // Beauty Manager
    @StateObject private var beautyManager = BeautyManager()

    // Basket Manager (Groceries)
    @StateObject private var basketManager = BasketManager()

    // Configure tab bar appearance once at initialization
    init() {
        configureTabBarAppearance()
    }

    var body: some View {
        ZStack {
            TabView(selection: $currentTab) {
                // Home Tab
                GeometryReader { geometry in
                    homeContentView(geometry: geometry)
                }
                .toolbar(navigationManager.activeTab == .grocery ? .hidden : .visible, for: .tabBar)
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
            .accentColor(Color(hex: "#2874F0"))  // Blue theme color
            .environmentObject(cartManager)
            .environmentObject(beautyManager)
            .environmentObject(basketManager)
            .environmentObject(navigationManager)
            .environmentObject(locationManager)
            .onAppear {
                locationManager.requestPermission()
                // Pre-fetch addresses
                locationManager.fetchSavedAddresses()
            }
            .fullScreenCover(isPresented: $navigationManager.showBeautyPage) {
                NavigationView {
                    BeautyProductView()
                }
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
                BrandNewArrivalView()
                    .environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showMenFashionPage) {
                MenFashionView()
                    .environmentObject(navigationManager)
                    .environmentObject(cartManager)
                    .environmentObject(beautyManager)
                    .environmentObject(basketManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showGrandMobilesPage) {
                GrandMobilesView()
                    .environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showShoesSalesPage) {
                ShoesSalesView()
                    .environmentObject(navigationManager)
            }
            .fullScreenCover(isPresented: $navigationManager.showCyberSalePage) {
                CyberSaleView()
                    .environmentObject(navigationManager)
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

            // Global Address Selector Overlay
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
                    // TODO: Navigate to Add Address
                    locationManager.showAddressSelector = false
                }
            )
            .zIndex(1000)
            .ignoresSafeArea()
            .allowsHitTesting(locationManager.showAddressSelector)
        }
    }

    @ViewBuilder
    private func homeContentView(geometry: GeometryProxy) -> some View {
        if navigationManager.activeTab == .grocery {
            GroceryContainerView(activeTab: $navigationManager.activeTab)
        } else if navigationManager.activeTab == .services {
            ServicesPageView(activeTab: $navigationManager.activeTab)
                .frame(maxWidth: .infinity)
        } else if navigationManager.activeTab == .influencers {
            InfluencersPageView(activeTab: $navigationManager.activeTab)
                .frame(maxWidth: .infinity)
        } else {
            ZStack(alignment: .top) {
                // Layer 1: Global Background
                Color(hex: "#F9FAFB").ignoresSafeArea()

                // Layer 2: Status Bar Background
                Color(hex: "#8A2387")
                    .frame(height: geometry.safeAreaInsets.top)
                    .ignoresSafeArea(edges: .top)
                    .zIndex(100)

                // Layer 3: Main Content Structure
                NavigationView {
                    // Scrollable Content with Sticky Header
                    ScrollView {
                        ScrollViewReader { scrollProxy in  // Prepare for scroll to top
                            LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                                // Part 1: Top Header (Scrolls away)
                                HomeTopHeaderView(activeTab: $navigationManager.activeTab)
                                    // Natural placement below safe area
                                    .background(
                                        GeometryReader { proxy in
                                            Color.clear.preference(
                                                key: ScrollOffsetPreferenceKey.self,
                                                value: proxy.frame(in: .named("scroll")).minY
                                            )
                                        }
                                    )

                                // Part 2: Sticky Header and Content
                                Section(
                                    header: HomeStickyHeaderView(
                                        selectedCategory: $navigationManager.selectedCategory,
                                        showIcons: $showIcons
                                    ).zIndex(1)
                                ) {
                                    // Page Content
                                    pageContent(for: currentSlug)
                                        .zIndex(0)
                                }
                            }
                            .onChange(of: navigationManager.selectedCategory) {
                                oldValue, newValue in
                                // Category changed from \(oldValue) to \(newValue)
                            }
                        }
                    }
                    .coordinateSpace(name: "scroll")
                    .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                        // If offset is less than -80 (approx top header height), we are scrolled down
                        withAnimation(.easeInOut(duration: 0.3)) {
                            showIcons = value > -50
                        }
                    }
                    .background(Color(hex: "#F9FAFB"))
                    .navigationBarHidden(true)
                }
                .background(Color(hex: "#8A2387"))  // Fallback
            }
        }
    }

    @ViewBuilder
    private func pageContent(for slug: String) -> some View {
        switch slug {
        case "fashion":
            FashionPage()
        case "for-you":
            ForYouPage()
        case "beauty":
            BeautyPage()
        // beauty-product is now handled via fullScreenCover
        case "electronics":
            ElectronicsPage()
        case "sports":
            SportsPage()
        case "books":
            BooksPage()
        case "furniture":
            FurniturePage()
        // Grocery now uses SDUI (falls through to default)
        default:
            SDUIPage(slug: slug)
        }

    }
}

#if DEBUG
    struct ContentView_Previews: PreviewProvider {
        static var previews: some View {
            ContentView()
        }
    }
#endif
