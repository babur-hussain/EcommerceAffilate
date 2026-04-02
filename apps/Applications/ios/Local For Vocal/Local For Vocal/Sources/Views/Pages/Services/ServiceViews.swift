import SwiftUI

// MARK: - Services Home View (Category Grid)
struct ServicesHomeView: View {
    @StateObject private var viewModel = ServicesViewModel()
    @State private var selectedCategory: ServiceCategoryModel?

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        NavigationView {
            ServicesThemePageWrapper {
                VStack(alignment: .leading, spacing: 20) {
                    // Premium Hero Section
                    ZStack(alignment: .topLeading) {
                        // Abstract Geometric Accents
                        GeometryReader { proxy in
                            let width = proxy.size.width
                            Circle()
                                .fill(LinearGradient(
                                    gradient: Gradient(colors: [Color(hex: "#EFF6FF"), Color.white.opacity(0.1)]),
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ))
                                .frame(width: width * 0.8, height: width * 0.8)
                                .offset(x: -width * 0.2, y: -width * 0.4)
                                .blur(radius: 20)
                            
                            Circle()
                                .fill(LinearGradient(
                                    gradient: Gradient(colors: [Color(hex: "#DBEAFE").opacity(0.6), Color.white.opacity(0.1)]),
                                    startPoint: .bottomTrailing,
                                    endPoint: .topLeading
                                ))
                                .frame(width: width * 0.6, height: width * 0.6)
                                .offset(x: width * 0.5, y: -width * 0.1)
                                .blur(radius: 30)
                        }
                        .frame(height: 120) // Constrain the effect height
                        .clipped()

                        VStack(alignment: .leading, spacing: 10) {
                            Text("Find Services")
                                .font(.system(size: 32, weight: .heavy, design: .default))
                                .foregroundColor(Color(hex: "#1E3A8A")) // Deep blue
                                .tracking(-0.5) // Sleek typography
                            
                            Text("Book trusted professionals near you")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "#64748B")) // Elegant slate gray
                                .padding(.top, 2)
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 24)
                        .padding(.bottom, 16)
                    }

                    if viewModel.categoriesLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity, minHeight: 200)
                    } else if viewModel.categories.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "wrench.and.screwdriver")
                                .font(.system(size: 48))
                                .foregroundColor(Color(hex: "#D1D5DB"))
                            Text("No services available yet")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                        }
                        .frame(maxWidth: .infinity, minHeight: 200)
                    } else {
                        // Category Grid
                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(viewModel.categories) { category in
                                NavigationLink(destination: SubServiceListView(category: category)) {
                                    ServiceCategoryCard(category: category)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .padding(.horizontal, 16)
                    }

                    Spacer(minLength: 40)
                }
                .onAppear {
                    Task { await viewModel.fetchCategories() }
                }
            }
            .navigationBarHidden(true)
        }
        .navigationViewStyle(.stack)
    }
}

// MARK: - Category Card
struct ServiceCategoryCard: View {
    let category: ServiceCategoryModel

    var body: some View {
        VStack(spacing: 12) {
            // Premium Icon Container
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(hex: "#EFF6FF")) // Soft blue-tinted box from Stitch
                    .frame(width: 58, height: 58)
                
                Text(category.icon.isEmpty ? "📦" : category.icon)
                    .font(.system(size: 28))
            }

            Text(category.name)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(Color(hex: "#1E3A8A")) // Deep premium blue for text
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .frame(height: 36)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .padding(.horizontal, 10)
        .background(Color.white)
        .cornerRadius(20) // Heavy premium rounding
        .shadow(color: Color(hex: "#1E3A8A").opacity(0.06), radius: 8, x: 0, y: 4) // Sophisticated soft blue shadow
    }
}

// MARK: - Sub-Service List View
struct SubServiceListView: View {
    let category: ServiceCategoryModel
    @StateObject private var viewModel = ServicesViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                Text(category.name)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                if !category.description.isEmpty {
                    Text(category.description)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#6B7280"))
                        .padding(.horizontal, 16)
                }

                if viewModel.subCategoriesLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, minHeight: 200)
                } else if viewModel.subCategories.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "list.bullet")
                            .font(.system(size: 40))
                            .foregroundColor(Color(hex: "#D1D5DB"))
                        Text("No sub-services available")
                            .foregroundColor(Color(hex: "#9CA3AF"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 200)
                } else {
                    VStack(spacing: 12) {
                        ForEach(viewModel.subCategories) { subCategory in
                            NavigationLink(destination: ServiceProviderListView(
                                subCategory: subCategory,
                                categoryName: category.name
                            )) {
                                SubServiceRow(subCategory: subCategory)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal, 16)
                }

                Spacer(minLength: 40)
            }
        }
        .background(Color(hex: "#F9FAFB"))
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            Task { await viewModel.fetchSubCategories(categoryId: category.id) }
        }
    }
}

// MARK: - Sub-Service Row
struct SubServiceRow: View {
    let subCategory: ServiceSubCategoryModel

    var body: some View {
        HStack(spacing: 16) {
            // Premium Icon Container
            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color(hex: "#EFF6FF")) // Soft blue-tinted box from Stitch
                    .frame(width: 48, height: 48)
                
                Text(subCategory.icon.isEmpty ? "🔧" : subCategory.icon)
                    .font(.system(size: 24))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(subCategory.name)
                    .font(.system(size: 16, weight: .bold)) // Bolder text
                    .foregroundColor(Color(hex: "#1E3A8A")) // Deep premium blue
                
                if !subCategory.description.isEmpty {
                    Text(subCategory.description)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "#64748B")) // Refined slate gray
                        .lineLimit(1)
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .bold)) // Bold chevron
                .foregroundColor(Color(hex: "#1E3A8A").opacity(0.5)) // Faded deep blue
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(18) // Heavy premium rounding
        .shadow(color: Color(hex: "#1E3A8A").opacity(0.06), radius: 6, x: 0, y: 3) // Sophisticated soft shadow
    }
}

// MARK: - Provider List View
struct ServiceProviderListView: View {
    let subCategory: ServiceSubCategoryModel
    let categoryName: String
    @StateObject private var viewModel = ServicesViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("\(subCategory.name) Providers")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                if viewModel.providersLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, minHeight: 200)
                } else if viewModel.providers.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "person.3")
                            .font(.system(size: 40))
                            .foregroundColor(Color(hex: "#D1D5DB"))
                        Text("No providers available yet")
                            .foregroundColor(Color(hex: "#9CA3AF"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 200)
                } else {
                    VStack(spacing: 12) {
                        ForEach(viewModel.providers) { provider in
                            NavigationLink(destination: ServiceProviderDetailView(providerId: provider.id)) {
                                ProviderCard(provider: provider)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal, 16)
                }

                Spacer(minLength: 40)
            }
        }
        .background(Color(hex: "#F9FAFB"))
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            Task { await viewModel.fetchProviders(subCategoryId: subCategory.id) }
        }
    }
}

// MARK: - Provider Card
struct ProviderCard: View {
    let provider: ServiceProviderModel

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 16) {
                // Premium Avatar Container
                ZStack {
                    Circle()
                        .fill(Color(hex: "#EFF6FF")) // Soft blue tint
                        .frame(width: 54, height: 54)
                    
                    Text(String((provider.userId?.name ?? "?").prefix(1)))
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(Color(hex: "#1E3A8A")) // Deep Premium Blue
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(provider.businessName)
                        .font(.system(size: 17, weight: .bold)) // Bolder text
                        .foregroundColor(Color(hex: "#1E3A8A")) // Deep Premium Blue

                    Text(provider.userId?.name ?? "")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "#64748B")) // Refined slate gray
                }

                Spacer()

                // Premium Rating Pill
                HStack(spacing: 4) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#F59E0B"))
                    Text(String(format: "%.1f", provider.rating))
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color(hex: "#FEF3C7").opacity(0.5)) // Subtle amber tint
                .cornerRadius(10)
            }

            Divider()
                .background(Color(hex: "#F1F5F9")) // Ultra light divider

            HStack {
                // Price
                VStack(alignment: .leading, spacing: 2) {
                    Text("Starting at")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "#94A3B8")) // Lighter slate
                    Text("\(provider.currency) \(Int(provider.startingPrice))")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#1E3A8A")) // Deep blur for price
                }

                Spacer()

                // Experience Pill
                Text("\(provider.experienceYears) yrs exp.")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(hex: "#1E3A8A"))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color(hex: "#EFF6FF"))
                    .cornerRadius(8)

                // Verified badge
                if provider.isVerified {
                    HStack(spacing: 4) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#059669")) // Trust green
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 6)
                    .background(Color(hex: "#D1FAE5"))
                    .cornerRadius(8)
                }
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(20) // Heavy rounding
        .shadow(color: Color(hex: "#1E3A8A").opacity(0.06), radius: 8, x: 0, y: 4) // Premium soft shadow
    }
}

// MARK: - Provider Detail View
struct ServiceProviderDetailView: View {
    let providerId: String
    @StateObject private var viewModel = ServicesViewModel()

    var body: some View {
        ScrollView {
            if let provider = viewModel.selectedProvider {
                VStack(alignment: .leading, spacing: 20) {
                    // Header Card
                    VStack(spacing: 14) {
                        Circle()
                            .fill(Color(hex: "#E0E7FF"))
                            .frame(width: 80, height: 80)
                            .overlay(
                                Text(String((provider.userId?.name ?? "?").prefix(1)))
                                    .font(.system(size: 32, weight: .bold))
                                    .foregroundColor(Color(hex: "#4F46E5"))
                            )

                        Text(provider.businessName)
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))

                        Text(provider.userId?.name ?? "")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "#6B7280"))

                        // Rating
                        HStack(spacing: 6) {
                            ForEach(0..<5) { index in
                                Image(systemName: index < Int(provider.rating) ? "star.fill" : "star")
                                    .font(.system(size: 16))
                                    .foregroundColor(Color(hex: "#F59E0B"))
                            }
                            Text("(\(provider.reviewCount) reviews)")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "#6B7280"))
                        }

                        if provider.isVerified {
                            HStack(spacing: 4) {
                                Image(systemName: "checkmark.seal.fill")
                                    .foregroundColor(Color(hex: "#2563EB"))
                                Text("Verified Provider")
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundColor(Color(hex: "#2563EB"))
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(hex: "#EEF2FF"))
                            .cornerRadius(20)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(20)
                    .background(Color.white)
                    .cornerRadius(16)

                    // Info Section
                    VStack(alignment: .leading, spacing: 14) {
                        Text("About")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))

                        if !provider.description.isEmpty {
                            Text(provider.description)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#4B5563"))
                        }

                        // Details Grid
                        HStack(spacing: 20) {
                            DetailItem(icon: "briefcase", label: "Experience", value: "\(provider.experienceYears) years")
                            DetailItem(icon: "indianrupeesign.circle", label: "Starting at", value: "\(provider.currency) \(Int(provider.startingPrice))")
                            DetailItem(icon: "tag", label: "Pricing", value: provider.pricingModel)
                        }
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(16)

                    // Location
                    if let address = provider.location?.address, !address.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Location")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "#1F2937"))
                            HStack(spacing: 8) {
                                Image(systemName: "location.fill")
                                    .foregroundColor(Color(hex: "#2563EB"))
                                Text(address)
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "#4B5563"))
                            }
                        }
                        .padding(16)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.white)
                        .cornerRadius(16)
                    }

                    // Reviews
                    if !viewModel.providerReviews.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Reviews")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "#1F2937"))

                            ForEach(viewModel.providerReviews) { review in
                                VStack(alignment: .leading, spacing: 6) {
                                    HStack {
                                        Text(review.customerId?.name ?? "Customer")
                                            .font(.system(size: 14, weight: .semibold))
                                        Spacer()
                                        HStack(spacing: 2) {
                                            ForEach(0..<review.rating, id: \.self) { _ in
                                                Image(systemName: "star.fill")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(Color(hex: "#F59E0B"))
                                            }
                                        }
                                    }
                                    if !review.review.isEmpty {
                                        Text(review.review)
                                            .font(.system(size: 13))
                                            .foregroundColor(Color(hex: "#6B7280"))
                                    }
                                }
                                .padding(12)
                                .background(Color(hex: "#F9FAFB"))
                                .cornerRadius(10)
                            }
                        }
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(16)
                    }

                    Spacer(minLength: 80)
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
            } else {
                ProgressView()
                    .frame(maxWidth: .infinity, minHeight: 300)
            }
        }
        .background(Color(hex: "#F3F4F6"))
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            Task {
                await viewModel.fetchProviderDetail(id: providerId)
                await viewModel.fetchProviderReviews(providerId: providerId)
            }
        }
    }
}

// MARK: - Detail Item Helper
struct DetailItem: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(Color(hex: "#4F46E5"))
            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "#9CA3AF"))
            Text(value)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(Color(hex: "#374151"))
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Services Header Parts
struct ServicesTopHeaderView: View {
    var safeAreaTop: CGFloat = 47
    @EnvironmentObject var locationManager: LocationManager

    var body: some View {
        VStack(spacing: 0) {
            // Transparent background layer for status bar spacing
            Color.clear.frame(height: safeAreaTop)

            TopCategoryBoxesView()

            LocationBarView(onTap: {
                withAnimation {
                    locationManager.showAddressSelector = true
                }
            })
        }
    }
}

struct ServicesStickyHeaderView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    var safeAreaTop: CGFloat = 47
    var headerHeight: CGFloat = 0
    var scrollOffset: CGFloat = 0  // Passed from parent

    var body: some View {
        let threshold: CGFloat = 100
        let glassOpacity = min(1.0, max(0.0, -scrollOffset / threshold))

        return VStack(spacing: 0) {
            SearchBarView()
                .padding(.top, 2)
            
            // Removed CategoriesSliderView to keep it clean
            Spacer().frame(height: 12)
        }
        .padding(.top, safeAreaTop)
        .background(
            Group {
                RealAppleGlass(style: .systemUltraThinMaterial)
                    .ignoresSafeArea(edges: .top)
                    .frame(height: max(headerHeight, safeAreaTop + 50) + 20)
                    .overlay(
                        Color.white.opacity(0.1)
                            .allowsHitTesting(false)
                    )
                    .opacity(glassOpacity)
            },
            alignment: .bottom
        )
    }
}

// MARK: - Services Theme Page Wrapper
public struct ServicesThemePageWrapper<Content: View>: View {
    let headerSlug: String
    let defaultGradientColors: [Color]
    let content: () -> Content

    @State private var headerComponents: [SDUIComponent] = []
    @State private var backgroundImage: String?
    @State private var lottieLayers: [LottieLayerConfig] = []
    @State private var gradientColors: [String] = []
    @State private var hasError = false
    
    // Header States
    @State private var headerHeight: CGFloat = 150
    @State private var scrollOffset: CGFloat = 0
    @State private var safeAreaTop: CGFloat = 59

    public init(
        headerSlug: String = "services-header-theme",
        defaultGradientColors: [Color] = [
            Color(hex: "#1E3A8A"), // Deep blue
            Color(hex: "#3B82F6")  // Vivid blue
        ],
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.headerSlug = headerSlug
        self.defaultGradientColors = defaultGradientColors
        self.content = content
        
        let cachedComponents: [SDUIComponent]
        if let cached = SDUILayoutStore.shared.layouts[headerSlug] {
            cachedComponents = cached.components
            AppLogger.debug("[ServicesThemePageWrapper] INSTANT: header '\(headerSlug)' from memory")
        } else if let layout = SDUIPage.loadFromDiskSync(slug: headerSlug) {
            SDUILayoutStore.shared.layouts[headerSlug] = layout
            cachedComponents = layout.components
            AppLogger.debug("[ServicesThemePageWrapper] SYNC-DISK: header '\(headerSlug)' from disk")
        } else {
            cachedComponents = []
        }

        _headerComponents = State(initialValue: cachedComponents)

        let bg = cachedComponents.first(where: { $0.type == .headerBackground })
        _backgroundImage = State(initialValue: bg?.prop(for: "imageUrl") as String?)
        _lottieLayers = State(initialValue: bg?.decodeItems(for: "lottieLayers", as: [LottieLayerConfig].self) ?? [])
        _gradientColors = State(initialValue: bg?.decodeItems(for: "gradientColors", as: [String].self) ?? [])
    }

    private var resolvedGradientColors: [Color] {
        if gradientColors.isEmpty { return defaultGradientColors }
        return gradientColors.map { Color(hex: $0) }
    }

    public var body: some View {
        ZStack(alignment: .top) {
            // Background Layer
            ZStack(alignment: .top) {
                LinearGradient(
                    gradient: Gradient(colors: resolvedGradientColors),
                    startPoint: .top,
                    endPoint: .bottom
                )
                
                if let imageUrl = backgroundImage, let url = URL(string: imageUrl), lottieLayers.isEmpty {
                    CachedAsyncImage(url: url) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        EmptyView()
                    }
                    .clipped()
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.top, -400) // Overscroll coverage
            .ignoresSafeArea(edges: .top)

            if !lottieLayers.isEmpty {
                ZStack {
                    ForEach(lottieLayers) { layer in
                        GlobalLottieLayer(layer: layer)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 450)
                .offset(y: -50) // Adjust position relative to content
                .allowsHitTesting(false)
                .ignoresSafeArea(edges: .top)
            }

            // Scrollable Content
            ScrollView {
                VStack(spacing: 0) {
                    // Top Header
                    ServicesTopHeaderView(safeAreaTop: safeAreaTop)
                        .padding(.bottom, -safeAreaTop)
                        .frame(minHeight: 120)
                        .zIndex(1)

                    LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                        Section(
                            header: ServicesStickyHeaderView(
                                safeAreaTop: safeAreaTop,
                                headerHeight: headerHeight,
                                scrollOffset: scrollOffset
                            )
                            .frame(minHeight: 60)
                            .background(
                                GeometryReader { proxy in
                                    Color.clear.preference(
                                        key: HeaderBottomPreferenceKey.self,
                                        value: proxy.frame(in: .global).maxY
                                    )
                                }
                            )
                        ) {
                            // SDUI Components like banners going above grid
                            if !headerComponents.filter({ $0.type != .headerBackground }).isEmpty {
                                VStack(spacing: 8) {
                                    ForEach(headerComponents.filter { $0.type != .headerBackground }) { component in
                                        SDUIComponentView(component: component)
                                    }
                                }
                                .padding(.top, 10)
                                .padding(.bottom, 8)
                            }
                            
                            // Native Grid Content
                            ZStack(alignment: .top) {
                                // Background transition from blue to white
                                LinearGradient(
                                    gradient: Gradient(stops: [
                                        .init(color: resolvedGradientColors.last ?? .blue, location: 0.0),
                                        .init(color: Color(hex: "#F9FAFB"), location: 0.1)
                                    ]),
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                                .frame(height: 200) // short gradient fade
                                
                                content()
                                    .padding(.top, 10)
                            }
                            .background(Color(hex: "#F9FAFB")) // Base background for native grid
                            .clipShape(ServicesRoundedCorner(radius: 24, corners: [.topLeft, .topRight]))
                        }
                    }
                }
                // Scroll tracking
                .overlay(
                    GeometryReader { proxy in
                        Color.clear
                            .preference(
                                key: ScrollOffsetPreferenceKey.self,
                                value: proxy.frame(in: .named("servicesScroll")).minY
                            )
                    },
                    alignment: .top
                )
            }
            .coordinateSpace(name: "servicesScroll")
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                self.scrollOffset = value
            }
            .onPreferenceChange(HeaderBottomPreferenceKey.self) { value in
                if value > 0 { self.headerHeight = value }
            }
            .background(Color.clear)
            .ignoresSafeArea(edges: .top)
            .zIndex(2)
        }
        .onAppear {
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                safeAreaTop = window.safeAreaInsets.top
            }
        }
        .task(id: headerSlug) {
            await loadComponents()
        }
    }

    private func loadComponents() async {
        let maxRetries = 3
        for attempt in 1...maxRetries {
            do {
                if let layout = try await APIService.shared.fetchLayout(slug: headerSlug, forceRefresh: true) {
                    await MainActor.run {
                        self.headerComponents = layout.components
                        updateBackgroundData()
                        SDUILayoutStore.shared.layouts[headerSlug] = layout
                    }
                    if let rawData = try? JSONEncoder().encode(layout.components) {
                        Task.detached {
                            await SDUICacheManager.shared.saveRawJSON(rawData, slug: headerSlug, userId: nil)
                            LayoutPreloader.shared.registerCachedSlug(headerSlug)
                        }
                    }
                    return
                }
            } catch {
                AppLogger.debug("ServicesThemePageWrapper failed fetch (Attempt \(attempt)): \(error)")
            }
            if attempt < maxRetries { try? await Task.sleep(nanoseconds: 500_000_000) }
        }
        await MainActor.run { if headerComponents.isEmpty { self.hasError = true } }
    }

    private func updateBackgroundData() {
        let bg = headerComponents.first(where: { $0.type == .headerBackground })
        backgroundImage = bg?.prop(for: "imageUrl") as String?
        lottieLayers = bg?.decodeItems(for: "lottieLayers", as: [LottieLayerConfig].self) ?? []
        gradientColors = bg?.decodeItems(for: "gradientColors", as: [String].self) ?? []
    }
}

// Custom corner shaping
struct ServicesRoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}
