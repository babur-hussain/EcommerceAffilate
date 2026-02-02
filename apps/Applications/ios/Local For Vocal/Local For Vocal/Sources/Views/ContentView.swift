import SwiftUI

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

    // Basket Manager (Groceries)
    @StateObject private var basketManager = BasketManager()

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .bottom) {
                // Layer 1: Content
                // We wrap content in ZStack to keep state alive if needed, or Switch for standard nav
                Group {
                    switch currentTab {
                    case .home:
                        homeContentView(geometry: geometry)
                    case .categories:
                        CategoriesPageView()
                    case .cart:
                        CartPageView()
                    case .account:
                        AccountView()
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color(hex: "#F3F4F6"))
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(
                    .bottom,
                    (navigationManager.activeTab == .influencers && currentTab == .home) ? 0 : 60
                )  // Space for TabBar (hidden on Influencers)
                .environmentObject(cartManager)
                .environmentObject(basketManager)  // Inject BasketManager
                .environmentObject(navigationManager)

                // Layer 2: Custom Tab Bar (hidden on Influencers page)
                if navigationManager.activeTab != .influencers || currentTab != .home {
                    TabBarView(currentTab: $currentTab)
                        .transition(.move(edge: .bottom))
                        .zIndex(200)
                        .environmentObject(cartManager)
                        .environmentObject(basketManager)
                }
            }
            .edgesIgnoringSafeArea(.bottom)  // Allow tab bar to sit at very bottom
        }
        .environmentObject(locationManager)
        .onAppear {
            locationManager.requestPermission()
        }
        .fullScreenCover(isPresented: $navigationManager.showBeautyPage) {
            BeautyProductView()
                .environmentObject(navigationManager)
        }
        .fullScreenCover(isPresented: $navigationManager.showSpecialDealPage) {
            SpecialDealNewStyleView()
                .environmentObject(navigationManager)
        }
        .fullScreenCover(isPresented: $navigationManager.showBrandNewArrivalPage) {
            BrandNewArrivalView()
                .environmentObject(navigationManager)
        }
        .fullScreenCover(isPresented: $navigationManager.showMenFashionPage) {
            MenFashionView()
                .environmentObject(navigationManager)
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
    }

    @ViewBuilder
    private func homeContentView(geometry: GeometryProxy) -> some View {
        if navigationManager.activeTab == .grocery {
            GroceryPageView(activeTab: $navigationManager.activeTab)
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
                            .onChange(of: navigationManager.selectedCategory) { _ in
                                // Scroll handling if needed
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
        case "grocery":
            GroceryPageView(activeTab: $navigationManager.activeTab)
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
