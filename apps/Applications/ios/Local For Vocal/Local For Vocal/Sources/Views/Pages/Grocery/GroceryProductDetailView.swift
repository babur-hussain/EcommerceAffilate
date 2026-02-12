import SwiftUI

// MARK: - Grocery Product Detail View (Flipkart / BigBasket Style)

struct GroceryProductDetailView: View {
    let product: Product
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var basketManager: BasketManager

    @State private var selectedImageIndex = 0
    @State private var addedAnimation = false

    // Computed
    var quantity: Int {
        basketManager.getItemCount(productId: product.id)
    }

    var discountPercent: Int {
        if let mrp = product.mrp, mrp > product.price, mrp > 0 {
            return Int(((mrp - product.price) / mrp) * 100)
        }
        return product.discountPercentage ?? 0
    }

    var weightText: String {
        if let subtitle = product.subtitle, !subtitle.isEmpty {
            return subtitle
        }
        return "1 unit"
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            // ── Background ──
            Color(hex: "#F5F5F5").ignoresSafeArea()

            VStack(spacing: 0) {
                // ── Top Navigation Bar ──
                topNavigationBar

                // ── Scrollable Content ──
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 0) {
                        // 1. Image Carousel
                        imageCarouselSection

                        // 2. Product Info Card
                        productInfoCard

                        // 3. Offers Section
                        offersSection

                        // 4. Product Highlights
                        highlightsSection

                        // 5. Description
                        descriptionSection

                        // 6. Seller Info
                        sellerInfoSection

                        // Spacer for bottom bar
                        Color.clear.frame(height: 90)
                    }
                }
            }

            // ── Bottom Add to Basket Bar ──
            bottomActionBar
        }
        .navigationBarHidden(true)
    }

    // MARK: - Top Navigation Bar

    private var topNavigationBar: some View {
        HStack(spacing: 12) {
            // Back button
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "arrow.left")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .frame(width: 36, height: 36)
                    .background(Color.white)
                    .clipShape(Circle())
                    .shadow(color: Color.black.opacity(0.06), radius: 2, x: 0, y: 1)
            }

            // Search bar placeholder
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#9CA3AF"))
                Text("Search for products")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#9CA3AF"))
                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color.white)
            .cornerRadius(20)
            .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)

            // Basket icon with badge
            ZStack(alignment: .topTrailing) {
                Image(systemName: "basket.fill")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .frame(width: 36, height: 36)
                    .background(Color.white)
                    .clipShape(Circle())
                    .shadow(color: Color.black.opacity(0.06), radius: 2, x: 0, y: 1)

                if basketManager.basketCount > 0 {
                    Text("\(basketManager.basketCount)")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 16, height: 16)
                        .background(Color(hex: "#EF4444"))
                        .clipShape(Circle())
                        .offset(x: 4, y: -4)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(
            LinearGradient(
                colors: [Color(hex: "#FFF9E6"), Color(hex: "#FFFFFF")],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }

    // MARK: - Image Carousel

    private var imageCarouselSection: some View {
        VStack(spacing: 0) {
            // Image pager
            TabView(selection: $selectedImageIndex) {
                if product.images.isEmpty {
                    placeholderImage
                        .tag(0)
                } else {
                    ForEach(product.images.indices, id: \.self) { index in
                        if let url = URL(string: product.images[index]) {
                            CachedAsyncImage(url: url) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .padding(20)
                            } placeholder: {
                                ProgressView()
                                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                            }
                        } else {
                            placeholderImage
                        }
                    }
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .automatic))
            .frame(height: 320)
            .background(Color.white)

            // Page indicators (custom dots)
            if product.images.count > 1 {
                HStack(spacing: 6) {
                    ForEach(product.images.indices, id: \.self) { index in
                        Circle()
                            .fill(
                                index == selectedImageIndex
                                    ? Color(hex: "#1F2937")
                                    : Color(hex: "#D1D5DB")
                            )
                            .frame(
                                width: index == selectedImageIndex ? 8 : 6,
                                height: index == selectedImageIndex ? 8 : 6
                            )
                            .animation(.easeInOut(duration: 0.2), value: selectedImageIndex)
                    }
                }
                .padding(.vertical, 12)
                .background(Color.white)
            }
        }
    }

    private var placeholderImage: some View {
        VStack(spacing: 12) {
            Image(systemName: "photo")
                .font(.system(size: 50))
                .foregroundColor(Color(hex: "#D1D5DB"))
            Text("No image available")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "#9CA3AF"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.white)
    }

    // MARK: - Product Info Card

    private var productInfoCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Product Name
            Text(product.name)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "#1F2937"))
                .lineLimit(3)
                .fixedSize(horizontal: false, vertical: true)

            // Weight / variant
            Text(weightText)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "#6B7280"))

            // Discount badge
            if discountPercent > 0 {
                Text("\(discountPercent)% off")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#16A34A"))
            }

            // Price Row
            HStack(alignment: .bottom, spacing: 8) {
                // Sale price
                Text("₹\(Int(product.price))")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                // MRP
                if let mrp = product.mrp, mrp > product.price {
                    HStack(spacing: 4) {
                        Text("MRP")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                        Text("₹\(Int(mrp))")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                            .strikethrough()
                    }
                }

                Spacer()
            }

            // Rating Row
            if let rating = product.rating {
                HStack(spacing: 6) {
                    HStack(spacing: 3) {
                        Text(String(format: "%.1f", rating))
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: "#16A34A"))
                    .cornerRadius(4)

                    if let count = product.reviewCount, count > 0 {
                        Text("\(count) ratings")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .padding(.top, 2)
    }

    // MARK: - Offers Section

    private var offersSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let offers = product.offers, !offers.isEmpty {
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 6) {
                        Image(systemName: "tag.fill")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#16A34A"))
                        Text("Available Offers")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }

                    ForEach(Array(offers.prefix(3).enumerated()), id: \.offset) { _, offer in
                        HStack(alignment: .top, spacing: 8) {
                            Image(systemName: "percent")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "#16A34A"))
                                .frame(width: 20, height: 20)

                            Text(offer.description)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "#374151"))
                                .lineLimit(2)
                        }
                    }
                }
                .padding(16)
                .background(Color.white)
                .padding(.top, 8)
            }
        }
    }

    // MARK: - Product Highlights

    private var highlightsSection: some View {
        Group {
            if let highlights = product.highlights, !highlights.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Highlights")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))

                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(highlights, id: \.self) { highlight in
                            HStack(alignment: .top, spacing: 10) {
                                Circle()
                                    .fill(Color(hex: "#16A34A"))
                                    .frame(width: 6, height: 6)
                                    .padding(.top, 6)

                                Text(highlight)
                                    .font(.system(size: 13))
                                    .foregroundColor(Color(hex: "#374151"))
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                    }
                }
                .padding(16)
                .background(Color.white)
                .padding(.top, 8)
            }
        }
    }

    // MARK: - Description

    private var descriptionSection: some View {
        Group {
            if let description = product.description, !description.isEmpty {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Product Description")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))

                    Text(description)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "#4B5563"))
                        .lineSpacing(4)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(16)
                .background(Color.white)
                .padding(.top, 8)
            }
        }
    }

    // MARK: - Seller Info

    private var sellerInfoSection: some View {
        Group {
            if let seller = product.sellerName, !seller.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Sold by")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "#9CA3AF"))

                    HStack(spacing: 10) {
                        Image(systemName: "storefront.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "#6366F1"))

                        Text(seller)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#1F2937"))

                        Spacer()

                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#16A34A"))
                    }
                }
                .padding(16)
                .background(Color.white)
                .padding(.top, 8)
            }
        }
    }

    // MARK: - Bottom Action Bar

    private var bottomActionBar: some View {
        HStack(spacing: 16) {
            // Price summary
            VStack(alignment: .leading, spacing: 2) {
                if let mrp = product.mrp, mrp > product.price {
                    Text("₹\(Int(mrp))")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .strikethrough()
                }
                Text("₹\(Int(product.price))")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
            }

            Spacer()

            // Add / Stepper button
            if quantity > 0 {
                // Stepper
                HStack(spacing: 0) {
                    Button(action: {
                        withAnimation(.spring(response: 0.3)) {
                            basketManager.addToBasket(product: product, quantity: -1)
                        }
                    }) {
                        Image(systemName: "minus")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 40, height: 44)
                    }

                    Text("\(quantity)")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 36, height: 44)

                    Button(action: {
                        withAnimation(.spring(response: 0.3)) {
                            basketManager.addToBasket(product: product, quantity: 1)
                        }
                    }) {
                        Image(systemName: "plus")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 40, height: 44)
                    }
                }
                .background(Color(hex: "#16A34A"))
                .cornerRadius(12)
                .shadow(color: Color(hex: "#16A34A").opacity(0.3), radius: 6, x: 0, y: 3)
            } else {
                // Add button
                Button(action: {
                    withAnimation(.spring(response: 0.3)) {
                        basketManager.addToBasket(product: product, quantity: 1)
                        addedAnimation = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            addedAnimation = false
                        }
                    }
                }) {
                    HStack(spacing: 8) {
                        Image(systemName: "basket.fill")
                            .font(.system(size: 14, weight: .semibold))
                        Text("Add")
                            .font(.system(size: 16, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .frame(width: 140, height: 44)
                    .background(Color(hex: "#16A34A"))
                    .cornerRadius(12)
                    .shadow(color: Color(hex: "#16A34A").opacity(0.3), radius: 6, x: 0, y: 3)
                    .scaleEffect(addedAnimation ? 1.05 : 1.0)
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(
            Color.white
                .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: -4)
        )
    }
}
