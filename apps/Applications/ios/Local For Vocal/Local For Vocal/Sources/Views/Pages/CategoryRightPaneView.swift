import Combine
import SwiftUI

struct CategoryRightPaneView: View {
    let categoryId: String?
    let categoryName: String?
    let subCategoriesFromParent: [CategoryModel]

    // Environment
    @EnvironmentObject var cartManager: CartManager

    // State
    @State private var products: [Product] = []
    @State private var subCategories: [CategoryModel] = []
    @State private var attributes: [CategoryAttribute] = []
    @State private var isLoading = true
    @State private var activeSubCategoryId: String?
    @State private var showProductList: Bool = false
    @State private var searchQuery: String = ""

    // Details for Landing Page Banner
    @State private var currentCategory: CategoryModel?
    @State private var expandedSections: Set<String> = []

    // Grid Layouts
    private let productColumns = [
        GridItem(.flexible(), spacing: 10),
        GridItem(.flexible(), spacing: 10),
    ]

    private let categoryGridColumns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header (Always visible)
            RightPaneHeader(
                title: categoryName ?? "Category",
                searchQuery: $searchQuery,
                cartCount: cartManager.cartCount
            )

            if showProductList || activeSubCategoryId != nil {
                // MARK: - Product Listing View (Drill Down)
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Horizontal Sub-category Selector
                        CategoryRightPaneSubEntriesView(
                            subCategories: subCategories,
                            activeId: $activeSubCategoryId,
                            onSelectAll: {
                                activeSubCategoryId = nil
                                showProductList = true
                            },
                            onSelectSub: { id in
                                activeSubCategoryId = id
                                showProductList = true
                            }
                        )

                        // Filters
                        FilterBarView(attributes: attributes)

                        // Products
                        if isLoading {
                            ProgressView().padding(.top, 50)
                        } else if products.isEmpty {
                            VStack(spacing: 16) {
                                Text("No products found")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(Color(hex: "#374151"))

                                Text("Try selecting a different subcategory")
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "#6B7280"))
                            }
                            .padding(.top, 50)
                        } else {
                            LazyVGrid(columns: productColumns, spacing: 16) {
                                ForEach(products) { product in
                                    NavigationLink(
                                        destination: ProductDetailView(
                                            productId: product.id, productFragment: product)
                                    ) {
                                        CommonProductCard(product: product)
                                    }
                                }
                            }
                            .padding(16)
                        }
                    }
                }
            } else {
                // MARK: - Category Landing View (Groups)
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 24) {
                        // Banner / Title
                        if let cat = currentCategory {
                            HStack {
                                Text(cat.name)
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundColor(Color(hex: "#2874F0"))
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(Color(hex: "#2874F0"))
                                Spacer()
                                if let img = cat.image ?? cat.icon, let url = URL(string: img) {
                                    AsyncImage(url: url) { phase in
                                        if let image = phase.image {
                                            image.resizable().scaledToFit()
                                        }
                                    }
                                    .frame(width: 100, height: 80)
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.top, 16)
                            .onTapGesture {
                                showProductList = true
                                activeSubCategoryId = nil
                            }
                        }

                        // Grouped Subcategories
                        if subCategories.isEmpty && !isLoading {
                            Text("No subcategories found")
                                .foregroundColor(.gray)
                                .padding(16)
                        } else {
                            ForEach(groupedSections, id: \.id) { section in
                                VStack(alignment: .leading, spacing: 12) {
                                    Text(section.id)  // Section Title
                                        .font(.system(size: 16, weight: .bold))
                                        .foregroundColor(Color(hex: "#1F2937"))
                                        .padding(.horizontal, 16)

                                    LazyVGrid(columns: categoryGridColumns, spacing: 20) {
                                        let itemsToShow =
                                            expandedSections.contains(section.id)
                                            ? section.items
                                            : Array(section.items.prefix(8))

                                        // Logic: If not expanded and count > 8, show 7 items + View All button
                                        let displayItems =
                                            (!expandedSections.contains(section.id)
                                                && section.items.count > 8)
                                            ? Array(section.items.prefix(7))
                                            : itemsToShow

                                        ForEach(displayItems) { sub in
                                            Button(action: {
                                                activeSubCategoryId = sub.id
                                                showProductList = true
                                            }) {
                                                VStack(spacing: 8) {
                                                    // Image Container
                                                    ZStack {
                                                        RoundedRectangle(cornerRadius: 16)
                                                            .fill(Color.white)
                                                            .shadow(
                                                                color: Color.black.opacity(0.05),
                                                                radius: 2, x: 0, y: 1)

                                                        if let img = sub.image ?? sub.icon,
                                                            let url = URL(string: img)
                                                        {
                                                            AsyncImage(url: url) { image in
                                                                image.resizable().aspectRatio(
                                                                    contentMode: .fit
                                                                )
                                                                .padding(8)
                                                            } placeholder: {
                                                                Color.gray.opacity(0.1)
                                                            }
                                                        }
                                                    }
                                                    .frame(width: 85, height: 85)  // Fixed size
                                                    .clipShape(RoundedRectangle(cornerRadius: 16))

                                                    // Text
                                                    Text(sub.name)
                                                        .font(.system(size: 11, weight: .regular))
                                                        .foregroundColor(Color(hex: "#1F2937"))
                                                        .multilineTextAlignment(.center)
                                                        .lineLimit(2)
                                                        .frame(
                                                            width: 85, height: 32, alignment: .top)  // Fixed height
                                                }
                                                .frame(height: 125)  // Fixed cell height
                                            }
                                        }

                                        // View More Button
                                        if !expandedSections.contains(section.id)
                                            && section.items.count > 8
                                        {
                                            Button(action: {
                                                withAnimation {
                                                    _ = expandedSections.insert(section.id)
                                                }
                                            }) {
                                                VStack(spacing: 8) {
                                                    ZStack {
                                                        Circle()
                                                            .fill(Color.white)
                                                            .shadow(
                                                                color: Color.black.opacity(0.08),
                                                                radius: 3, x: 0, y: 1)

                                                        Image(systemName: "chevron.right")
                                                            .font(.system(size: 20, weight: .bold))
                                                            .foregroundColor(Color(hex: "#2874F0"))
                                                    }
                                                    .frame(width: 50, height: 50)
                                                    .padding(.vertical, 17.5)  // Center in 85px space

                                                    Text("View all")
                                                        .font(.system(size: 12, weight: .bold))
                                                        .foregroundColor(Color(hex: "#2874F0"))
                                                        .frame(height: 32, alignment: .top)
                                                }
                                                .frame(height: 125)
                                            }
                                        }
                                    }
                                    .padding(.horizontal, 16)
                                }
                            }
                        }

                        Spacer().frame(height: 50)
                    }
                }
            }
        }
        .background(Color(hex: "#EBF4FF").ignoresSafeArea(edges: .top))
        .onAppear {
            loadData()
        }
        .onChange(of: categoryId) { _ in
            activeSubCategoryId = nil
            showProductList = false
            products = []
            subCategories = []
            currentCategory = nil
            isLoading = true
            loadData()
        }
        .onChange(of: activeSubCategoryId) { newValue in
            if newValue != nil {
                showProductList = true
                Task { await loadProducts() }
            } else if showProductList {
                // "All" selected
                Task { await loadProducts() }
            }
        }
    }

    private func loadData() {
        guard let catId = categoryId else { return }
        isLoading = true

        Task {
            do {
                // 1. Fetch Category Details for Attributes
                let catDetails = try await APIService.shared.fetchCategoryDetails(id: catId)
                await MainActor.run {
                    self.attributes = catDetails.attributes ?? []
                    self.currentCategory = catDetails
                }

                // 2. Use passed SubCategories
                await MainActor.run {
                    self.subCategories = self.subCategoriesFromParent
                }

                // 3. Fetch Products
                await loadProducts()

            } catch {
                AppLogger.error("Error loading category data: \(error)")
                await MainActor.run {
                    self.isLoading = false
                }
            }
        }
    }

    private func loadProducts() async {
        await MainActor.run {
            self.isLoading = true
        }

        do {
            let limit = 20
            let fetchId = categoryId
            let fetchSubId = activeSubCategoryId

            let newProducts = try await APIService.shared.fetchProducts(
                limit: limit,
                categoryId: fetchId,
                subCategoryId: fetchSubId
            )

            await MainActor.run {
                self.products = newProducts
                self.isLoading = false
            }
        } catch {
            AppLogger.error("Error loading products: \(error)")
        }
    }

    // Computed property for Grouping
    private var groupedSections: [CategoryGroup] {
        // Fallback grouping: If group is nil, put in "Other".
        let grouped = Dictionary(grouping: subCategories) { $0.group ?? "Other" }
        let order = currentCategory?.subCategoryGroupOrder ?? []

        // Sort keys based on order
        let sortedKeys = grouped.keys.sorted { (a, b) in
            if a == "Other" { return false }
            if b == "Other" { return true }

            let indexA = order.firstIndex(of: a)
            let indexB = order.firstIndex(of: b)

            if let ia = indexA, let ib = indexB { return ia < ib }
            if indexA != nil { return true }
            return a < b
        }

        return sortedKeys.map { key in
            CategoryGroup(id: key, items: grouped[key] ?? [])
        }
    }

    struct CategoryGroup: Identifiable {
        let id: String
        let items: [CategoryModel]
    }
}

// MARK: - Right Pane Header
struct RightPaneHeader: View {
    let title: String
    @Binding var searchQuery: String
    var cartCount: Int

    var body: some View {
        HStack(spacing: 16) {
            // Search Pill
            HStack(spacing: 12) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color(hex: "#9CA3AF"))

                Text("Search for \(title)")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "#9CA3AF"))

                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            .cornerRadius(12)  // Slightly less rounded for a modern look
            .shadow(color: Color.black.opacity(0.06), radius: 3, x: 0, y: 2)

            // Cart
            Button(action: {
                // Navigate to Cart
            }) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "cart")
                        .font(.system(size: 26))  // Slightly larger
                        .foregroundColor(Color(hex: "#1F2937"))

                    if cartCount > 0 {
                        Text("\(cartCount)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 18, height: 18)
                            .background(Color.red)
                            .clipShape(Circle())
                            .offset(x: 6, y: -6)
                            .overlay(
                                Circle().stroke(Color(hex: "#EBF4FF"), lineWidth: 2).offset(
                                    x: 6, y: -6))  // Border for separation
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(hex: "#EBF4FF"))
    }
}

// MARK: - Custom SubEntries View for Right Pane
struct CategoryRightPaneSubEntriesView: View {
    let subCategories: [CategoryModel]
    @Binding var activeId: String?
    var onSelectAll: () -> Void = {}
    var onSelectSub: (String) -> Void = { _ in }

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                // "All" Option
                Button(action: {
                    activeId = nil
                    onSelectAll()
                }) {
                    VStack(spacing: 6) {
                        ZStack {
                            if activeId == nil {
                                // Selected State: Solid Dark Grey with Checkmark
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color(hex: "#374151"))  // Dark Grey matching filter button or screenshot
                                    .frame(width: 64, height: 64)
                                    .overlay(
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 24, weight: .bold))
                                            .foregroundColor(.white)
                                    )
                            } else {
                                // Unselected State: White with Grid Icon
                                RoundedRectangle(cornerRadius: 16)  // Squircle
                                    .fill(Color.white)
                                    .frame(width: 64, height: 64)
                                    .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                                    .overlay(
                                        Image(systemName: "square.grid.2x2.fill")
                                            .font(.system(size: 24))
                                            .foregroundColor(Color(hex: "#555555"))
                                    )
                            }
                        }

                        Text("All")
                            .font(.system(size: 11, weight: activeId == nil ? .bold : .medium))
                            .foregroundColor(activeId == nil ? .black : Color(hex: "#4B5563"))
                    }
                }

                ForEach(subCategories) { sub in
                    Button(action: {
                        activeId = sub.id
                        onSelectSub(sub.id)
                    }) {
                        VStack(spacing: 6) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.white)
                                    .frame(width: 64, height: 64)
                                    .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)  // Subtle shadow

                                if let img = sub.image ?? sub.icon, let url = URL(string: img) {
                                    AsyncImage(url: url) { phase in
                                        if let image = phase.image {
                                            image.resizable().aspectRatio(contentMode: .fill)
                                        } else {
                                            Color(hex: "#F3F4F6")
                                        }
                                    }
                                    .frame(width: 64, height: 64)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                } else {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color(hex: "#F3F4F6"))
                                        .frame(width: 64, height: 64)
                                }

                                if activeId == sub.id {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color.black.opacity(0.4))
                                        .frame(width: 64, height: 64)
                                        .overlay(
                                            Image(systemName: "checkmark")
                                                .font(.system(size: 24, weight: .bold))
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
                                .frame(width: 72)
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 16)
        }
        .background(Color.white)
    }
}
