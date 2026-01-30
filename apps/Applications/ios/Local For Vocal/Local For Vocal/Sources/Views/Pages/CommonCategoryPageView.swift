import Combine
import SwiftUI

struct CommonCategoryPageView: View {
    let categoryId: String?
    let categoryName: String?
    // Optional: Pre-selected subcategory or filters if navigated via deep link
    let initialSubCategoryId: String?

    // Environment
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var cartManager: CartManager

    // State
    @State private var products: [Product] = []
    @State private var subCategories: [CategoryModel] = []
    @State private var attributes: [CategoryAttribute] = []
    @State private var isLoading = true
    @State private var activeSubCategoryId: String?
    @State private var searchQuery: String = ""

    // Grid Layout
    private let columns = [
        GridItem(.flexible(), spacing: 10),
        GridItem(.flexible(), spacing: 10),
    ]

    init(categoryId: String?, categoryName: String?, initialSubCategoryId: String? = nil) {
        self.categoryId = categoryId
        self.categoryName = categoryName
        self.initialSubCategoryId = initialSubCategoryId
        // activeSubCategoryId initialized in onAppear or init logic
        _activeSubCategoryId = State(initialValue: initialSubCategoryId)
    }

    var body: some View {
        VStack(spacing: 0) {
            // SAFE AREA BACKGROUND
            Color(hex: "#EBF4FF")
                .frame(height: 1)  // Tiny spacer to fill top safe area if needed, or use ignoreSafeArea on Vstack
                .ignoresSafeArea()

            // Header
            CommonCategoryHeader(
                title: categoryName ?? "Category",
                searchQuery: $searchQuery,
                onBack: {
                    presentationMode.wrappedValue.dismiss()
                },
                cartCount: cartManager.cartCount
            )

            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    // SubCategories
                    if !subCategories.isEmpty {
                        SubEntriesView(
                            subCategories: subCategories,
                            activeId: $activeSubCategoryId
                        )
                    }

                    // Filters
                    FilterBarView(attributes: attributes)

                    // Products
                    if isLoading {
                        ProgressView()
                            .padding(.top, 50)
                    } else if products.isEmpty {
                        Text("No products found")
                            .foregroundColor(.gray)
                            .padding(.top, 50)
                    } else {
                        LazyVGrid(columns: columns, spacing: 16) {
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
            .background(Color.white)
        }
        .background(Color(hex: "#EBF4FF").ignoresSafeArea(edges: .top))
        .navigationBarHidden(true)
        .onAppear {
            loadData()
        }
        .onChange(of: activeSubCategoryId) { newValue in
            Task {
                await loadProducts()
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
                self.attributes = catDetails.attributes ?? []

                // 2. Fetch SubCategories
                // Note: APIService might need update to logic for "fetchSubCategories" using ID
                // For now, assume fetchSubCategories works with parentId
                if let subs = try? await APIService.shared.fetchSubCategories(parentId: catId) {
                    // Convert [SubCategory] to [CategoryModel] or map appropriately
                    // Since SubCategory struct and CategoryModel struct differ, we might need manual mapping or assume compatibility if properties match.
                    // Actually APIService.fetchSubCategories returns [SubCategory].
                    // Let's rely on mapping.
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

                // 3. Fetch Products
                await loadProducts()

            } catch {
                print("Error loading category data: \(error)")
                isLoading = false
            }
        }
    }

    private func loadProducts() async {
        self.isLoading = true
        do {
            let limit = 20
            // If activeSubCategoryId is set, use it. Else use main categoryId.
            let catIdToUse = activeSubCategoryId ?? categoryId

            // We need to pass subCategoryId explicitly if we want filtering logic to be precise on backend
            // But APIService.fetchProducts(limit:Int) signature I just updated takes (limit, categoryId, subCategoryId)

            let fetchId = categoryId
            let fetchSubId = activeSubCategoryId

            self.products = try await APIService.shared.fetchProducts(
                limit: limit,
                categoryId: fetchId,
                subCategoryId: fetchSubId
            )
            self.isLoading = false
        } catch {
            print("Error loading products: \(error)")
            self.isLoading = false
        }
    }
}

// MARK: - Components

struct CommonCategoryHeader: View {
    let title: String
    @Binding var searchQuery: String
    var onBack: () -> Void
    var cartCount: Int

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onBack) {
                Image(systemName: "arrow.left")
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: "#1F2937"))
            }

            // Search Pill
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "#6B7280"))
                Text("Search for \(title)")
                    .foregroundColor(Color(hex: "#9CA3AF"))
                    .font(.system(size: 14))
                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color.white)
            .cornerRadius(24)
            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)

            // Cart
            Button(action: {
                // Navigate to Cart
            }) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "cart")
                        .font(.system(size: 24))
                        .foregroundColor(Color(hex: "#1F2937"))

                    if cartCount > 0 {
                        Text("\(cartCount)")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 16, height: 16)
                            .background(Color.red)
                            .clipShape(Circle())
                            .offset(x: 5, y: -5)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(hex: "#EBF4FF"))
    }
}

struct SubEntriesView: View {
    let subCategories: [CategoryModel]
    @Binding var activeId: String?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                // "All" Option
                Button(action: { activeId = nil }) {
                    VStack(spacing: 6) {
                        ZStack {
                            Circle()
                                .fill(Color(hex: "#F3F4F6"))
                                .frame(width: 64, height: 64)
                                .overlay(
                                    Image(systemName: "square.grid.2x2.fill")  // "apps" icon rough match
                                        .foregroundColor(Color(hex: "#555555"))
                                )

                            if activeId == nil {
                                Circle()
                                    .fill(Color.black.opacity(0.4))
                                    .overlay(
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 24, weight: .bold))
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
                                    .frame(width: 64, height: 64)
                                    .clipShape(Circle())  // RN uses rounded rect but Circle works well too for "Pill", snippet says borderRadius: 16 which is squircle. Let's match squircle?
                                    .cornerRadius(16)  // Matching RN borderRadius: 16
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

struct FilterBarView: View {
    let attributes: [CategoryAttribute]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // Sort
                HStack(spacing: 2) {
                    Text("Sort")
                    Image(systemName: "chevron.down")
                }
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "#374151"))
                .padding(.horizontal, 12)
                .frame(height: 36)
                .background(Color.white)
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "#E5E7EB"), lineWidth: 1))

                // Filter (Black)
                HStack(spacing: 4) {
                    Text("3").font(.system(size: 10, weight: .bold))
                        .padding(3)
                        .background(Color.white)
                        .cornerRadius(4)

                    Text("Filter").foregroundColor(.white)
                    Image(systemName: "slider.horizontal.3").foregroundColor(.white)
                }
                .font(.system(size: 13, weight: .medium))
                .padding(.horizontal, 12)
                .frame(height: 36)
                .background(Color(hex: "#1F2937"))
                .cornerRadius(8)

                // Dynamic Attributes
                if !attributes.isEmpty {
                    ForEach(attributes, id: \.self) { attr in
                        HStack(spacing: 2) {
                            Text(attr.name ?? "Option")
                            Image(systemName: "chevron.down")
                        }
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "#374151"))
                        .padding(.horizontal, 12)
                        .frame(height: 36)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8).stroke(
                                Color(hex: "#E5E7EB"), lineWidth: 1))
                    }
                } else {
                    // Fallback
                    ForEach(["Brand", "Gender"], id: \.self) { label in
                        HStack(spacing: 2) {
                            Text(label)
                            Image(systemName: "chevron.down")
                        }
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "#374151"))
                        .padding(.horizontal, 12)
                        .frame(height: 36)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8).stroke(
                                Color(hex: "#E5E7EB"), lineWidth: 1))
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 12)
        }
        .background(Color.white)
    }
}

struct CommonProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Area
            ZStack(alignment: .topLeading) {
                if let mainImage = product.images.first, let url = URL(string: mainImage) {
                    AsyncImage(url: url) { phase in
                        if let image = phase.image {
                            image.resizable().aspectRatio(contentMode: .fill)
                        } else {
                            Color(hex: "#F3F4F6")
                        }
                    }
                } else {
                    Color(hex: "#F3F4F6")
                }

                // Ad Badge
                // Assuming Product model doesn't have isAd, mocking or checking if present
                // product.isAd doesn't exist on struct Product yet?
                // Let's check APIService Product struct definition. It's:
                // _id, name, price, images, category, rating, reviewCount, stock, mrp, discountPercentage, subtitle
                // So no isAd. We skip it or mock it.

                // Heart Icon
                HStack {
                    Spacer()
                    Image(systemName: "heart")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#4B5563"))
                        .padding(6)
                        .background(Color.white)
                        .clipShape(Circle())
                        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
                }
                .padding(8)

                // Rating Badge (Bottom Left of Image)
                VStack {
                    Spacer()
                    HStack(spacing: 3) {
                        Text(String(format: "%.1f", product.rating ?? 4.2))
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                        Image(systemName: "star.fill")
                            .font(.system(size: 8))
                            .foregroundColor(Color(hex: "#166534"))  // Dark green
                        Text("|")
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "#D1D5DB"))
                        Text("\(product.reviewCount ?? 0)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                    .padding(.horizontal, 6)
                    .padding(.vertical, 4)
                    .background(Color.white.opacity(0.9))
                    .cornerRadius(4)
                }
                .padding(8)
            }
            .frame(height: 200)  // Aspect ratio roughly 0.8 on RN for width ~170 -> ~210 height
            .clipped()

            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(product.category)  // Using category as Brand mock since we don't have Brand
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .textCase(.uppercase)

                Text(product.name)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .lineLimit(2)

                HStack(spacing: 4) {
                    Text("↓\(product.discountPercentage ?? 30)%")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "#059669"))

                    if let mrp = product.mrp {
                        Text("₹\(Int(mrp))")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                            .strikethrough()
                    }

                    Text("₹\(Int(product.price))")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }

                // Offer Tag
                HStack(spacing: 4) {
                    Text("WOW!")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))  // Dark Gray logic from RN?
                    // RN: bg #FEF3C7 (Yellow-ish) text #92400E (Brown)?
                    // RN Styles: wowBadge: bg #FEF3C7, wowText: #92400E

                    Text("₹\(Int(product.price)) with 3 offers")
                        .font(.system(size: 9))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
                .padding(.top, 4)

                Text("Delivery by 18th Jan")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .padding(.top, 4)
            }
            .padding(10)
        }
        .background(Color.white)
        .cornerRadius(8)  // Not much styling on RN card itself, mostly image wrapper
    }
}
