import SwiftUI

/// Full-page product listing with category/discount filters.
/// Used as "See All" destination from FiftyPercentOffZoneView and similar components.
struct CategoryProductsListView: View {
    let categoryId: String?
    let subCategoryIds: [String]
    let isGrocery: Bool
    let title: String
    let minimumDiscount: Int

    @Environment(\.presentationMode) var presentationMode
    private var wishlistManager: WishlistManager { WishlistManager.shared }

    @State private var products: [Product] = []
    @State private var isLoading = true

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Navigation Header
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }

                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(1)

                Spacer()

                Text("Min \(minimumDiscount)% off")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(hex: "#16A34A"))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color(hex: "#DCFCE7"))
                    .cornerRadius(12)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            .shadow(color: .black.opacity(0.05), radius: 2, y: 1)

            // Products Grid
            ScrollView {
                if isLoading {
                    VStack(spacing: 16) {
                        ProgressView()
                            .scaleEffect(1.2)
                        Text("Finding best deals...")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.top, 80)
                } else if products.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "tag.slash")
                            .font(.system(size: 48))
                            .foregroundColor(.gray)
                        Text("No deals found")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.gray)
                        Text("Check back later for more deals!")
                            .font(.system(size: 14))
                            .foregroundColor(Color.gray.opacity(0.7))
                    }
                    .padding(.top, 80)
                } else {
                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(products) { product in
                            NavigationLink(
                                destination: ProductDetailView(
                                    productId: product.id,
                                    productFragment: product
                                )
                            ) {
                                CategoryProductCard(product: product)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(12)
                    .padding(.bottom, 20)
                }
            }
            .background(Color(hex: "#F3F4F6"))
        }
        .navigationBarHidden(true)
        .task {
            await loadProducts()
        }
    }

    private func loadProducts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            var fetched: [Product] = []

            if isGrocery {
                if !subCategoryIds.isEmpty {
                    fetched = try await APIService.shared.fetchProductsBySubCategoryIds(
                        subCategoryIds, limit: 50)
                } else {
                    fetched = try await APIService.shared.fetchGroceryProducts(limit: 50)
                }
            } else if !subCategoryIds.isEmpty {
                fetched = try await APIService.shared.fetchProducts(
                    limit: 50, subCategoryId: subCategoryIds.first)
            } else if let catId = categoryId, !catId.isEmpty {
                fetched = try await APIService.shared.fetchProducts(
                    limit: 50, categoryId: catId)
            } else {
                fetched = try await APIService.shared.fetchProducts(limit: 50)
            }

            // Filter by minimum discount
            let discounted = fetched.filter { product in
                let discount =
                    product.discountPercentage
                    ?? {
                        guard let mrp = product.mrp, mrp > product.price else { return 0 }
                        return Int(((mrp - product.price) / mrp) * 100)
                    }()
                return discount >= minimumDiscount
            }

            await MainActor.run {
                // Prefer discounted, fallback to all if none match
                self.products = discounted.isEmpty ? fetched : discounted
            }
        } catch {
            AppLogger.debug("[CategoryProductsList] Error: \(error)")
        }
    }
}

// MARK: - Product Card for Category Grid

private struct CategoryProductCard: View {
    let product: Product
    private var wishlistManager: WishlistManager { WishlistManager.shared }

    var isWishlisted: Bool {
        wishlistManager.isInWishlist(productId: product.id)
    }

    var discountPercent: Int {
        if let d = product.discountPercentage, d > 0 { return d }
        if let mrp = product.mrp, mrp > product.price {
            return Int(((mrp - product.price) / mrp) * 100)
        }
        return 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            ZStack(alignment: .topTrailing) {
                Color(hex: "#F9FAFB")

                if let imageUrl = product.images.first, let url = URL(string: imageUrl) {
                    CachedAsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#F3F4F6")
                    }
                    .frame(height: 150)
                    .clipped()
                } else {
                    Image(systemName: "photo")
                        .font(.system(size: 30))
                        .foregroundColor(.gray)
                        .frame(height: 150)
                        .frame(maxWidth: .infinity)
                }

                // Wishlist
                Button(action: {
                    HapticManager.shared.impact(style: .medium)
                    Task { _ = await wishlistManager.toggleWishlist(productId: product.id) }
                }) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 30, height: 30)
                        .shadow(color: .black.opacity(0.1), radius: 2)
                        .overlay(
                            Image(systemName: isWishlisted ? "heart.fill" : "heart")
                                .font(.system(size: 14))
                                .foregroundColor(
                                    isWishlisted ? Color(hex: "#EF4444") : Color(hex: "#9CA3AF"))
                        )
                }
                .padding(6)

                // Discount Badge
                if discountPercent > 0 {
                    VStack {
                        HStack {
                            Text("-\(discountPercent)%")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color(hex: "#EF4444"))
                                .cornerRadius(4)
                            Spacer()
                        }
                        .padding(.leading, 6)
                        .padding(.top, 6)
                        Spacer()
                    }
                }
            }
            .frame(height: 150)

            // Product Info
            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)
                    .frame(height: 36, alignment: .topLeading)

                HStack(spacing: 4) {
                    Text("₹\(Int(product.price))")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "#4F46E5"))

                    if let mrp = product.mrp, mrp > product.price {
                        Text("₹\(Int(mrp))")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                            .strikethrough()
                    }
                }

                if let rating = product.rating {
                    HStack(spacing: 2) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 9))
                            .foregroundColor(Color(hex: "#F59E0B"))
                        Text(String(format: "%.1f", rating))
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }
            }
            .padding(10)
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.06), radius: 4, x: 0, y: 2)
    }
}
