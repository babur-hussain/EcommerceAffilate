import Combine
import SwiftUI

// MARK: - Sort Options
enum SortOption: String, CaseIterable {
    case relevance = "Relevance"
    case priceLowToHigh = "Price: Low to High"
    case priceHighToLow = "Price: High to Low"
    case popularity = "Popularity"
    case newest = "Newest First"
    case rating = "Customer Rating"

    var apiParam: String {
        switch self {
        case .relevance: return "relevance"
        case .priceLowToHigh: return "price_asc"
        case .priceHighToLow: return "price_desc"
        case .popularity: return "popularity"
        case .newest: return "newest"
        case .rating: return "rating"
        }
    }
}

// MARK: - Quick Filter Chips
enum QuickFilter: String, CaseIterable {
    case deliveryIn1Day = "Delivery in 1 Day"
    case topRated = "Top Rated"
    case express = "EXPRESS"
    case assured = "Assured"
    case discount50Plus = "50%+ Off"
}

struct CommonCategoryPageView: View {
    let categoryId: String?
    let categoryName: String?
    let initialSubCategoryId: String?
    let initialFilters: [String: String]

    // Environment
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var wishlistManager: WishlistManager

    // State
    @State private var products: [Product] = []
    @State private var subCategories: [CategoryModel] = []
    @State private var attributes: [CategoryAttribute] = []
    @State private var isLoading = true
    @State private var activeSubCategoryId: String?
    @State private var searchQuery: String = ""

    // Sort & Filter State
    @State private var selectedSort: SortOption = .relevance
    @State private var showSortSheet = false
    @State private var showFilterSheet = false
    @State private var activeQuickFilters: Set<QuickFilter> = []
    @State private var activeFilterCount: Int = 0

    // Grid Layout (Single Column for detailed cards)
    private let columns = [
        GridItem(.flexible())
    ]

    init(
        categoryId: String?, categoryName: String?, initialSubCategoryId: String? = nil,
        initialFilters: [String: String] = [:]
    ) {
        self.categoryId = categoryId
        self.categoryName = categoryName
        self.initialSubCategoryId = initialSubCategoryId
        self.initialFilters = initialFilters
        _activeSubCategoryId = State(initialValue: initialSubCategoryId)
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            CategoryPageHeader(
                title: categoryName ?? "Category",
                searchQuery: $searchQuery,
                onBack: { presentationMode.wrappedValue.dismiss() },
                cartCount: cartManager.cartCount
            )

            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    // Sort/Filter Toolbar
                    SortFilterToolbar(
                        selectedSort: $selectedSort,
                        showSortSheet: $showSortSheet,
                        showFilterSheet: $showFilterSheet,
                        activeFilterCount: activeFilterCount,
                        activeQuickFilters: $activeQuickFilters
                    )

                    // SubCategories
                    if !subCategories.isEmpty {
                        SubEntriesView(
                            subCategories: subCategories,
                            activeId: $activeSubCategoryId
                        )
                    }

                    // Products
                    if isLoading {
                        VStack {
                            ProgressView()
                                .scaleEffect(1.2)
                            Text("Loading products...")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                                .padding(.top, 8)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, 80)
                    } else if products.isEmpty {
                        VStack(spacing: 16) {
                            Image(systemName: "bag.badge.questionmark")
                                .font(.system(size: 48))
                                .foregroundColor(.gray)
                            Text("No products found")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.gray)
                            Text("Try adjusting your filters")
                                .font(.system(size: 14))
                                .foregroundColor(Color.gray.opacity(0.7))
                        }
                        .padding(.top, 80)
                    } else {
                        LazyVStack(spacing: 0) {
                            ForEach(products) { product in
                                NavigationLink(
                                    destination: ProductDetailView(
                                        productId: product.id, productFragment: product)
                                ) {
                                    AdvancedProductCard(product: product)
                                }

                                Divider()
                                    .padding(.horizontal, 16)
                            }
                        }
                        .padding(.bottom, 16)
                    }
                }
            }
            .background(Color.white)
        }
        .background(Color(hex: "#F5F5F5").ignoresSafeArea(edges: .top))
        .navigationBarHidden(true)
        .onAppear { loadData() }
        .onChange(of: activeSubCategoryId) { oldValue, newValue in
            Task { await loadProducts() }
        }
        .onChange(of: selectedSort) { oldValue, newValue in
            Task { await loadProducts() }
        }
        .onChange(of: activeQuickFilters) { oldValue, newValue in
            Task { await loadProducts() }
        }
        .sheet(isPresented: $showSortSheet) {
            SortOptionsSheet(selectedSort: $selectedSort, isPresented: $showSortSheet)
        }
        .sheet(isPresented: $showFilterSheet) {
            FilterSheet(
                attributes: attributes,
                activeFilterCount: $activeFilterCount,
                isPresented: $showFilterSheet
            )
        }
    }

    private func loadData() {
        guard let catId = categoryId else { return }
        isLoading = true

        Task {
            do {
                let catDetails = try await APIService.shared.fetchCategoryDetails(id: catId)
                self.attributes = catDetails.attributes ?? []

                if let subs = try? await APIService.shared.fetchSubCategories(parentId: catId) {
                    self.subCategories = subs.map {
                        CategoryModel(
                            id: $0.id,
                            name: $0.name,
                            slug: $0.slug ?? "",
                            image: $0.image,
                            icon: $0.icon,
                            parentCategory: catId,
                            group: nil,
                            subCategoryGroupOrder: nil,
                            attributes: nil
                        )
                    }
                }

                await loadProducts()
            } catch {
                AppLogger.error("Error loading category data: \(error)")
                isLoading = false
            }
        }
    }

    private func loadProducts() async {
        self.isLoading = true
        do {
            let limit = 20
            let fetchId = categoryId
            let fetchSubId = activeSubCategoryId

            self.products = try await APIService.shared.fetchProducts(
                limit: limit,
                categoryId: fetchId,
                subCategoryId: fetchSubId
            )
            self.isLoading = false
        } catch {
            AppLogger.error("Error loading products: \(error)")
            self.isLoading = false
        }
    }
}

// MARK: - Category Page Header
struct CategoryPageHeader: View {
    let title: String
    @Binding var searchQuery: String
    var onBack: () -> Void
    var cartCount: Int
    var isPlaceholder: Bool = false

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onBack) {
                Image(systemName: "arrow.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(Color(hex: "#1F2937"))
            }

            // Search Pill
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "#6B7280"))
                    .font(.system(size: 16))
                Text(title)
                    .foregroundColor(isPlaceholder ? Color(hex: "#9CA3AF") : Color(hex: "#374151"))
                    .font(.system(size: 15, weight: .medium))
                Spacer()
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(Color.white)
            .cornerRadius(28)
            .shadow(color: Color.black.opacity(0.06), radius: 4, x: 0, y: 2)

            // Cart Button
            Button(action: {}) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "cart")
                        .font(.system(size: 22))
                        .foregroundColor(Color(hex: "#1F2937"))

                    if cartCount > 0 {
                        Text("\(cartCount)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 18, height: 18)
                            .background(Color(hex: "#2563EB"))
                            .clipShape(Circle())
                            .offset(x: 6, y: -6)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(hex: "#F5F5F5"))
    }
}

// MARK: - Sort/Filter Toolbar
struct SortFilterToolbar: View {
    @Binding var selectedSort: SortOption
    @Binding var showSortSheet: Bool
    @Binding var showFilterSheet: Bool
    var activeFilterCount: Int
    @Binding var activeQuickFilters: Set<QuickFilter>

    var body: some View {
        VStack(spacing: 0) {
            // Main toolbar
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    // Sort Button
                    Button(action: { showSortSheet = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "arrow.up.arrow.down")
                                .font(.system(size: 12))
                            Text("Sort")
                                .font(.system(size: 13, weight: .medium))
                            Image(systemName: "chevron.down")
                                .font(.system(size: 10))
                        }
                        .foregroundColor(Color(hex: "#374151"))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                        )
                    }

                    // Filter Button
                    Button(action: { showFilterSheet = true }) {
                        HStack(spacing: 6) {
                            if activeFilterCount > 0 {
                                Text("\(activeFilterCount)")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(Color(hex: "#1F2937"))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.white)
                                    .cornerRadius(4)
                            }
                            Text("Filter")
                                .font(.system(size: 13, weight: .medium))
                            Image(systemName: "slider.horizontal.3")
                                .font(.system(size: 12))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(Color(hex: "#1F2937"))
                        .cornerRadius(8)
                    }

                    // Quick Filter Chips
                    ForEach(QuickFilter.allCases, id: \.self) { filter in
                        QuickFilterChip(
                            filter: filter,
                            isActive: activeQuickFilters.contains(filter),
                            onTap: {
                                if activeQuickFilters.contains(filter) {
                                    activeQuickFilters.remove(filter)
                                } else {
                                    activeQuickFilters.insert(filter)
                                }
                            }
                        )
                    }
                }
                .padding(.horizontal, 16)
            }
            .padding(.vertical, 12)
            .background(Color.white)

            Divider()
        }
    }
}

// MARK: - Quick Filter Chip
struct QuickFilterChip: View {
    let filter: QuickFilter
    let isActive: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 4) {
                if filter == .express {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 10))
                        .foregroundColor(isActive ? .white : Color(hex: "#7C3AED"))
                } else if filter == .assured {
                    Image(systemName: "checkmark.shield.fill")
                        .font(.system(size: 11))
                        .foregroundColor(isActive ? .white : Color(hex: "#2563EB"))
                } else if filter == .topRated {
                    Image(systemName: "star.fill")
                        .font(.system(size: 10))
                        .foregroundColor(isActive ? .white : Color(hex: "#F59E0B"))
                }

                Text(filter.rawValue)
                    .font(.system(size: 12, weight: .medium))
            }
            .foregroundColor(isActive ? .white : Color(hex: "#374151"))
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isActive ? Color(hex: "#2563EB") : Color.white)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isActive ? Color.clear : Color(hex: "#E5E7EB"), lineWidth: 1)
            )
        }
    }
}

// MARK: - Advanced Product Card (Flipkart Style)
struct AdvancedProductCard: View {
    let product: Product
    @EnvironmentObject var wishlistManager: WishlistManager

    var isWishlisted: Bool {
        wishlistManager.isInWishlist(productId: product.id)
    }

    var discountPercent: Int {
        if let mrp = product.mrp, mrp > product.price {
            return Int(((mrp - product.price) / mrp) * 100)
        }
        return product.discountPercentage ?? 0
    }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Product Image
            ZStack(alignment: .topLeading) {
                if let mainImage = product.images.first, let url = URL(string: mainImage) {
                    AsyncImage(url: url) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Color(hex: "#F3F4F6")
                        }
                    }
                } else {
                    Color(hex: "#F3F4F6")
                }

                // BESTSELLER Badge
                if (product.rating ?? 0) >= 4.5 {
                    Text("BESTSELLER")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(Color(hex: "#F97316"))
                        .cornerRadius(2)
                        .padding(6)
                }
            }
            .frame(width: 130, height: 150)
            .background(Color.white)

            // Product Details
            VStack(alignment: .leading, spacing: 6) {
                // Title
                Text(product.name)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)

                // Rating Row
                HStack(spacing: 6) {
                    // Star Rating
                    HStack(spacing: 2) {
                        Text(String(format: "%.1f", product.rating ?? 4.0))
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        Image(systemName: "star.fill")
                            .font(.system(size: 9))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 6)
                    .padding(.vertical, 3)
                    .background(Color(hex: "#166534"))
                    .cornerRadius(4)

                    // Review Count
                    Text("(\(formatReviewCount(product.reviewCount ?? 0)))")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))

                    // Assured Badge
                    if (product.rating ?? 0) >= 4.0 {
                        HStack(spacing: 2) {
                            Image(systemName: "checkmark.shield.fill")
                                .font(.system(size: 10))
                            Text("Assured")
                                .font(.system(size: 10, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "#2563EB"))
                    }
                }

                // Price Row
                HStack(spacing: 6) {
                    if discountPercent > 0 {
                        Text("↓\(discountPercent)%")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "#059669"))
                    }

                    if let mrp = product.mrp, mrp > product.price {
                        Text("₹\(Int(mrp))")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                            .strikethrough()
                    }

                    Text("₹\(Int(product.price))")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }

                // WOW Bank Offer
                if discountPercent > 0 {
                    HStack(spacing: 4) {
                        Text("WOW!")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "#92400E"))
                            .padding(.horizontal, 4)
                            .padding(.vertical, 2)
                            .background(Color(hex: "#FEF3C7"))
                            .cornerRadius(2)

                        Text("₹\(Int(product.price * 0.95)) with Bank offer")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "#059669"))
                    }
                }

                // Exchange Offer
                if product.price > 5000 {
                    Text("Upto ₹\(Int(product.price * 0.2)) Off on Exchange")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#374151"))
                }

                // Delivery Info
                HStack(spacing: 4) {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 10))
                        .foregroundColor(Color(hex: "#7C3AED"))
                    Text("EXPRESS")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "#7C3AED"))
                    Text("2 day delivery, Thursday")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#374151"))
                }

                // Attribute Chips
                if let highlights = product.highlights, !highlights.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(Array(highlights.prefix(3)), id: \.self) { highlight in
                                Text(highlight)
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "#374151"))
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color(hex: "#F3F4F6"))
                                    .cornerRadius(4)
                            }
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Wishlist Button
            VStack {
                Button(action: {
                    Task { await wishlistManager.toggleWishlist(productId: product.id) }
                }) {
                    Image(systemName: isWishlisted ? "heart.fill" : "heart")
                        .font(.system(size: 18))
                        .foregroundColor(
                            isWishlisted ? Color(hex: "#DC2626") : Color(hex: "#6B7280"))
                }
                Spacer()
            }
        }
        .padding(16)
        .background(Color.white)
    }

    private func formatReviewCount(_ count: Int) -> String {
        if count >= 1000 {
            return String(format: "%.1fK", Double(count) / 1000)
        }
        return "\(count)"
    }
}

// MARK: - Sort Options Sheet
struct SortOptionsSheet: View {
    @Binding var selectedSort: SortOption
    @Binding var isPresented: Bool

    var body: some View {
        NavigationView {
            List {
                ForEach(SortOption.allCases, id: \.self) { option in
                    Button(action: {
                        selectedSort = option
                        isPresented = false
                    }) {
                        HStack {
                            Text(option.rawValue)
                                .foregroundColor(Color(hex: "#1F2937"))
                            Spacer()
                            if selectedSort == option {
                                Image(systemName: "checkmark")
                                    .foregroundColor(Color(hex: "#2563EB"))
                            }
                        }
                    }
                }
            }
            .navigationTitle("Sort By")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        isPresented = false
                    }
                }
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Filter Sheet
struct FilterSheet: View {
    let attributes: [CategoryAttribute]
    @Binding var activeFilterCount: Int
    @Binding var isPresented: Bool
    @State private var selectedFilters: [String: Set<String>] = [:]
    @State private var priceRange: ClosedRange<Double> = 0...100000

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Price Range
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Price Range")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "#1F2937"))

                        HStack {
                            Text("₹\(Int(priceRange.lowerBound))")
                                .font(.system(size: 14))
                            Spacer()
                            Text("₹\(Int(priceRange.upperBound))")
                                .font(.system(size: 14))
                        }
                        .foregroundColor(Color(hex: "#6B7280"))
                    }
                    .padding(.horizontal, 16)

                    Divider()

                    // Dynamic Attributes
                    ForEach(attributes, id: \.self) { attribute in
                        VStack(alignment: .leading, spacing: 12) {
                            Text(attribute.name ?? "Filter")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "#1F2937"))

                            FlowLayout(spacing: 8) {
                                ForEach(attribute.values ?? [], id: \.self) { value in
                                    FilterChip(
                                        title: value,
                                        isSelected: selectedFilters[attribute.name ?? ""]?.contains(
                                            value) ?? false,
                                        onTap: {
                                            toggleFilter(
                                                attribute: attribute.name ?? "", value: value)
                                        }
                                    )
                                }
                            }
                        }
                        .padding(.horizontal, 16)

                        Divider()
                    }
                }
                .padding(.vertical, 16)
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Clear All") {
                        selectedFilters.removeAll()
                        activeFilterCount = 0
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Apply") {
                        activeFilterCount = selectedFilters.values.reduce(0) { $0 + $1.count }
                        isPresented = false
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }

    private func toggleFilter(attribute: String, value: String) {
        if selectedFilters[attribute] == nil {
            selectedFilters[attribute] = []
        }
        if selectedFilters[attribute]!.contains(value) {
            selectedFilters[attribute]!.remove(value)
        } else {
            selectedFilters[attribute]!.insert(value)
        }
    }
}

// MARK: - Filter Chip
struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 13))
                if isSelected {
                    Image(systemName: "xmark")
                        .font(.system(size: 10))
                }
            }
            .foregroundColor(isSelected ? .white : Color(hex: "#374151"))
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(isSelected ? Color(hex: "#2563EB") : Color(hex: "#F3F4F6"))
            .cornerRadius(20)
        }
    }
}

// MARK: - Flow Layout for Filter Chips
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrangeSubviews(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(
        in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()
    ) {
        let result = arrangeSubviews(proposal: proposal, subviews: subviews)
        for (index, position) in result.positions.enumerated() {
            subviews[index].place(
                at: CGPoint(x: bounds.minX + position.x, y: bounds.minY + position.y),
                proposal: .unspecified)
        }
    }

    private func arrangeSubviews(proposal: ProposedViewSize, subviews: Subviews) -> (
        size: CGSize, positions: [CGPoint]
    ) {
        let maxWidth = proposal.width ?? .infinity
        var positions: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth && x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(CGPoint(x: x, y: y))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }

        return (CGSize(width: maxWidth, height: y + rowHeight), positions)
    }
}

// MARK: - SubEntries (Existing Component - Keep for compatibility)
struct SubEntriesView: View {
    let subCategories: [CategoryModel]
    @Binding var activeId: String?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                Button(action: { activeId = nil }) {
                    VStack(spacing: 6) {
                        ZStack {
                            Circle()
                                .fill(Color(hex: "#F3F4F6"))
                                .frame(width: 56, height: 56)
                                .overlay(
                                    Image(systemName: "square.grid.2x2.fill")
                                        .foregroundColor(Color(hex: "#555555"))
                                )
                            if activeId == nil {
                                Circle()
                                    .fill(Color.black.opacity(0.4))
                                    .frame(width: 56, height: 56)
                                    .overlay(
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 20, weight: .bold))
                                            .foregroundColor(.white)
                                    )
                            }
                        }
                        Text("All")
                            .font(.system(size: 11, weight: activeId == nil ? .bold : .medium))
                            .foregroundColor(activeId == nil ? .black : Color(hex: "#4B5563"))
                    }
                }

                ForEach(subCategories) { sub in
                    Button(action: { activeId = sub.id }) {
                        VStack(spacing: 6) {
                            ZStack {
                                if let img = sub.image ?? sub.icon, let url = URL(string: img) {
                                    AsyncImage(url: url) { phase in
                                        if let image = phase.image {
                                            image.resizable().aspectRatio(contentMode: .fill)
                                        } else {
                                            Color(hex: "#F3F4F6")
                                        }
                                    }
                                    .frame(width: 56, height: 56)
                                    .clipShape(Circle())
                                } else {
                                    Circle()
                                        .fill(Color(hex: "#F3F4F6"))
                                        .frame(width: 56, height: 56)
                                }
                                if activeId == sub.id {
                                    Circle()
                                        .fill(Color.black.opacity(0.4))
                                        .frame(width: 56, height: 56)
                                        .overlay(
                                            Image(systemName: "checkmark")
                                                .font(.system(size: 20, weight: .bold))
                                                .foregroundColor(.white)
                                        )
                                }
                            }
                            Text(sub.name)
                                .font(
                                    .system(size: 11, weight: activeId == sub.id ? .bold : .medium)
                                )
                                .foregroundColor(
                                    activeId == sub.id ? .black : Color(hex: "#4B5563")
                                )
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                                .frame(width: 64)
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.white)
    }
}

// MARK: - FilterBarView (Legacy compatibility)
struct FilterBarView: View {
    let attributes: [CategoryAttribute]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(attributes, id: \.self) { attribute in
                    Menu {
                        ForEach(attribute.values ?? [], id: \.self) { value in
                            Button(value) {
                                // Filter selection
                            }
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Text(attribute.name ?? "Filter")
                                .font(.system(size: 12, weight: .medium))
                            Image(systemName: "chevron.down")
                                .font(.system(size: 10))
                        }
                        .foregroundColor(Color(hex: "#374151"))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                        )
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
        .background(Color(hex: "#F9FAFB"))
    }
}

// MARK: - CommonProductCard (Legacy compatibility)
struct CommonProductCard: View {
    let product: Product

    var discountPercent: Int {
        if let mrp = product.mrp, mrp > product.price {
            return Int(((mrp - product.price) / mrp) * 100)
        }
        return product.discountPercentage ?? 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Product Image
            ZStack(alignment: .topLeading) {
                if let mainImage = product.images.first, let url = URL(string: mainImage) {
                    AsyncImage(url: url) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } else {
                            Color(hex: "#F3F4F6")
                        }
                    }
                } else {
                    Color(hex: "#F3F4F6")
                }

                // Discount Badge
                if discountPercent > 0 {
                    Text("\(discountPercent)% OFF")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(Color(hex: "#DC2626"))
                        .cornerRadius(4)
                        .padding(6)
                }
            }
            .frame(height: 140)
            .frame(maxWidth: .infinity)
            .background(Color.white)
            .cornerRadius(8)

            // Product Name
            Text(product.name)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "#1F2937"))
                .lineLimit(2)

            // Rating
            if let rating = product.rating {
                HStack(spacing: 2) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 10))
                        .foregroundColor(Color(hex: "#F59E0B"))
                    Text(String(format: "%.1f", rating))
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#6B7280"))
                }
            }

            // Price
            HStack(spacing: 4) {
                Text("₹\(Int(product.price))")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))

                if let mrp = product.mrp, mrp > product.price {
                    Text("₹\(Int(mrp))")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .strikethrough()
                }
            }
        }
        .padding(8)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
