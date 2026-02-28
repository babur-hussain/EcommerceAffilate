import SwiftUI

struct FiftyPercentOffZoneView: View {
    private var wishlistManager: WishlistManager { WishlistManager.shared }

    // Props from SDUI JSON
    var title: String = "50% OFF ZONE"
    var subtitle: String = "Half the price, double the joy!"
    var bannerImage: String =
        "https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-grocery-shopping-bag-isolated-png-image_11549419.png"
    var discountText: String = "50%"
    var categoryId: String?
    var subCategoryIds: [String] = []
    var isGrocery: Bool = false

    @State private var products: [Product] = []
    @State private var isLoading = true
    @State private var hasLoaded = false
    @State private var fetchTask: Task<Void, Never>? = nil

    var body: some View {
        VStack(spacing: 0) {
            // Header Banner
            ZStack(alignment: .leading) {
                LinearGradient(
                    gradient: Gradient(colors: [Color(hex: "#F0F9FF"), Color(hex: "#E0F2FE")]),
                    startPoint: .leading,
                    endPoint: .trailing
                )

                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(alignment: .bottom, spacing: 4) {
                            Text(discountText)
                                .font(.system(size: 42, weight: .black))
                                .italic()
                                .foregroundColor(Color(hex: "#2563EB"))

                            VStack(alignment: .leading, spacing: 0) {
                                Text("OFF")
                                    .font(.system(size: 14, weight: .heavy))
                                    .italic()
                                    .foregroundColor(Color(hex: "#2563EB"))
                                Text("ZONE")
                                    .font(.system(size: 14, weight: .heavy))
                                    .italic()
                                    .foregroundColor(Color(hex: "#3B82F6"))
                            }
                            .padding(.bottom, 6)

                            Image(systemName: "sparkles")
                                .foregroundColor(Color(hex: "#3B82F6"))
                                .padding(.bottom, 12)
                        }

                        Text(subtitle)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }
                    .padding(.leading, 20)

                    Spacer()

                    AsyncImage(url: URL(string: bannerImage)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 140, height: 100)
                    .padding(.trailing, 10)
                }
            }
            .frame(height: 140)

            // Product List
            if isLoading && !hasLoaded {
                HStack {
                    Spacer()
                    ProgressView()
                    Spacer()
                }
                .padding(20)
            } else if products.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "tag.slash")
                        .font(.system(size: 28))
                        .foregroundColor(.gray)
                    Text("No deals available right now")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity)
                .padding(20)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(products) { product in
                            NavigationLink(
                                destination: ProductDetailView(
                                    productId: product.id,
                                    productFragment: product
                                )
                            ) {
                                ProductCardWithWishlist(
                                    product: product,
                                    width: 150
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 16)
                }
            }

            // See All Button
            NavigationLink(
                destination: CategoryProductsListView(
                    categoryId: categoryId,
                    subCategoryIds: subCategoryIds,
                    isGrocery: isGrocery,
                    title: title,
                    minimumDiscount: 50
                )
            ) {
                HStack {
                    Text("See all")
                        .font(.system(size: 14, weight: .semibold))
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12, weight: .bold))
                }
                .foregroundColor(Color(hex: "#4F46E5"))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color(hex: "#EEF2FF"))
                .cornerRadius(8)
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
        }
        .background(Color.white)
        .padding(.vertical, 12)
        .task {
            guard !hasLoaded else { return }
            // Cancel any existing fetch to avoid duplicates
            fetchTask?.cancel()
            let task = Task {
                await loadProducts()
            }
            fetchTask = task
            await task.value
        }
    }

    private func loadProducts() async {
        // Prevent re-entry if already loaded or currently loading
        guard !hasLoaded else { return }

        isLoading = true

        do {
            // Check for cancellation before starting network request
            try Task.checkCancellation()

            var fetchedProducts: [Product] = []

            if !subCategoryIds.isEmpty {
                // Fetch by sub-category IDs (most specific)
                fetchedProducts = try await APIService.shared.fetchProductsBySubCategoryIds(
                    subCategoryIds, limit: 30)
            } else if let catId = categoryId, !catId.isEmpty {
                // Fetch by category ID
                fetchedProducts = try await APIService.shared.fetchProducts(
                    limit: 30, categoryId: catId)
            } else {
                // Fallback: fetch general products
                fetchedProducts = try await APIService.shared.fetchProducts(limit: 30)
            }

            // Check cancellation after network call
            try Task.checkCancellation()

            // Filter to only products with >=50% discount
            let discounted = fetchedProducts.filter { product in
                if let discount = product.discountPercentage, discount >= 50 {
                    return true
                }
                // Calculate from MRP if discountPercentage not set
                if let mrp = product.mrp, mrp > product.price {
                    let calculatedDiscount = Int(((mrp - product.price) / mrp) * 100)
                    return calculatedDiscount >= 50
                }
                return false
            }

            // Show discounted products, or first 10 of fetched if no discounts found
            self.products =
                discounted.isEmpty
                ? Array(fetchedProducts.prefix(10))
                : Array(discounted.prefix(10))

            self.hasLoaded = true
            self.isLoading = false
        } catch is CancellationError {
            // SwiftUI cancelled the task — do NOT retry, just exit silently
            AppLogger.debug("[FiftyPercentOffZone] Task cancelled, not retrying")
            return
        } catch let error as NSError
            where error.domain == NSURLErrorDomain && error.code == -999
        {
            // URLSession cancelled (error -999) — same as CancellationError, exit silently
            AppLogger.debug("[FiftyPercentOffZone] URLSession cancelled (-999), not retrying")
            return
        } catch {
            AppLogger.debug("[FiftyPercentOffZone] Error fetching products: \(error)")
            // Mark as loaded even on error to prevent infinite retry loop
            self.hasLoaded = true
            self.isLoading = false
        }
    }
}

// MARK: - Product Card with Working Wishlist

private struct ProductCardWithWishlist: View {
    let product: Product
    let width: CGFloat
    private var wishlistManager: WishlistManager { WishlistManager.shared }

    var isWishlisted: Bool {
        wishlistManager.isInWishlist(productId: product.id)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Container
            ZStack(alignment: .topTrailing) {
                Color(hex: "#F3F4F6")

                if let imageUrl = product.images.first, let url = URL(string: imageUrl) {
                    CachedAsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#F3F4F6")
                    }
                    .frame(width: width, height: 160)
                    .clipped()
                } else {
                    Image(systemName: "photo")
                        .font(.system(size: 40))
                        .foregroundColor(.gray)
                        .frame(width: width, height: 160)
                }

                // Wishlist Button (functional)
                Button(action: {
                    HapticManager.shared.impact(style: .medium)
                    Task {
                        _ = await wishlistManager.toggleWishlist(productId: product.id)
                    }
                }) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 32, height: 32)
                        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
                        .overlay(
                            Image(systemName: isWishlisted ? "heart.fill" : "heart")
                                .font(.system(size: 16))
                                .foregroundColor(
                                    isWishlisted
                                        ? Color(hex: "#EF4444") : Color(hex: "#4F46E5"))
                        )
                }
                .padding(8)

                // Discount Badge
                if let discount = product.discountPercentage, discount > 0 {
                    Text("-\(discount)%")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "#EF4444"))
                        .cornerRadius(4)
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .topLeading)
                }
            }
            .frame(height: 160)

            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "#111827"))
                    .lineLimit(2)
                    .frame(height: 40, alignment: .topLeading)

                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("₹\(Int(product.price))")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#4F46E5"))

                        if let mrp = product.mrp, mrp > product.price {
                            Text("₹\(Int(mrp))")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                                .strikethrough()
                        }
                    }

                    Spacer()

                    // Rating
                    if let rating = product.rating {
                        HStack(spacing: 2) {
                            Image(systemName: "star.fill")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "#F59E0B"))
                            Text(String(format: "%.1f", rating))
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Color(hex: "#B45309"))
                        }
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "#FFFBEB"))
                        .cornerRadius(4)
                    }
                }
                .padding(.top, 4)
            }
            .padding(12)
        }
        .frame(width: width)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
