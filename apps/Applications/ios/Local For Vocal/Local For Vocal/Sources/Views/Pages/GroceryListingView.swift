import Combine
import SwiftUI

struct GroceryListingView: View {
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

    // Grid Layout (2 Columns for Grocery)
    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
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
                title: "Search for products...",
                searchQuery: $searchQuery,
                onBack: { presentationMode.wrappedValue.dismiss() },
                cartCount: cartManager.cartCount,
                isPlaceholder: true
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

                    // SubCategories (Horizontal List)
                    if !subCategories.isEmpty {
                        SubEntriesView(
                            subCategories: subCategories,
                            activeId: $activeSubCategoryId
                        )
                    }

                    // Products Grid
                    if isLoading {
                        VStack {
                            ProgressView()
                                .scaleEffect(1.2)
                            Text("Loading groceries...")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                                .padding(.top, 8)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, 80)
                    } else if products.isEmpty {
                        VStack(spacing: 16) {
                            Image(systemName: "basket")
                                .font(.system(size: 48))
                                .foregroundColor(.gray)
                            Text("No groceries found")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.gray)
                            Text("Try adjusting your filters")
                                .font(.system(size: 14))
                                .foregroundColor(Color.gray.opacity(0.7))
                        }
                        .padding(.top, 80)
                    } else {
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(products) { product in
                                NavigationLink(
                                    destination: ProductDetailView(
                                        productId: product.id, productFragment: product)
                                ) {
                                    GroceryProductCard(product: product)
                                }
                            }
                        }
                        .padding(12)
                        .padding(.bottom, 16)
                    }
                }
            }
            .background(Color(hex: "#F3F4F6"))  // Light Grey background for contrast
        }
        .background(Color(hex: "#F5F5F5").ignoresSafeArea(edges: .top))
        .navigationBarHidden(true)
        .onAppear { loadData() }
        .onChange(of: activeSubCategoryId) { _ in
            Task { await loadProducts() }
        }
        .onChange(of: selectedSort) { _ in
            Task { await loadProducts() }
        }
        .onChange(of: activeQuickFilters) { _ in
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
        isLoading = true

        Task {
            do {
                if let catId = categoryId {
                    // Fetch Category Data (Attributes, SubCategories)
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
                }

                await loadProducts()
            } catch {
                AppLogger.error("Error loading grocery category data: \(error)")
                // Still try to load products even if category details failed
                await loadProducts()
            }
        }
    }

    private func loadProducts() async {
        await MainActor.run { self.isLoading = true }

        defer {
            Task { @MainActor in self.isLoading = false }
        }

        do {
            let limit = 20
            let fetchId = categoryId
            let fetchSubId = activeSubCategoryId

            AppLogger.info("🛒 Loading products for SubCat: \(fetchSubId ?? "nil")")

            let fetchedProducts: [Product]
            if let subIdsString = fetchSubId, !subIdsString.isEmpty {
                let ids = subIdsString.components(separatedBy: ",")
                fetchedProducts = try await APIService.shared.fetchProductsBySubCategoryIds(
                    ids, limit: limit)
            } else {
                fetchedProducts = try await APIService.shared.fetchGroceryProducts(limit: limit)
            }

            await MainActor.run {
                self.products = fetchedProducts
            }
            AppLogger.info("🛒 Loaded \(fetchedProducts.count) grocery products")

        } catch {
            AppLogger.error("Error loading groceries: \(error)")
        }
    }
}
