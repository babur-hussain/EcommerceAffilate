import SwiftUI

struct TrendingNearYouView: View {
    @State private var products: [Product] = []
    @State private var isLoading = true

    // Props
    var title: String = "Trending near you"
    var subtitle: String = "Discover the top products trending today"
    var limit: Int = 10
    var productIds: [String] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#0D9488"))  // Teal 600

                if !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "#115E59").opacity(0.9))  // Teal 800
                }
            }
            .padding(.horizontal, 16)

            // Horizontal List
            if isLoading {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(0..<3) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.gray.opacity(0.1))
                                .frame(width: 160, height: 240)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            } else if !products.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(products) { product in
                            TrendingProductCard(product: product)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)  // For shadow
                }
            } else {
                Text("No trending products found")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 24)
        .background(
            LinearGradient(
                colors: [
                    Color(hex: "#E0FAEF"),
                    Color(hex: "#ECFEFF"),
                    Color(hex: "#F0FDF4"),
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .task {
            await loadProducts()
        }
    }

    private func loadProducts() async {
        do {
            // If explicit IDs provided, typically we'd fetch those.
            // For now, we reuse fetchProducts with a limit or similar logic.
            // Ideally APIService should support `ids` param.
            let fetched = try await APIService.shared.fetchProducts(limit: limit)

            if !productIds.isEmpty {
                // Filter client side if API doesn't support ids param yet,
                // or just take the fetched ones if we can't filter easily consistent with RN logic
                self.products = fetched.filter { productIds.contains($0.id) }
                if self.products.isEmpty {
                    // Fallback if filter leaves empty (e.g. mock ids)
                    self.products = fetched
                }
            } else {
                self.products = fetched
            }
        } catch {
            AppLogger.debug("Failed to load trending products: \(error)")
        }
        isLoading = false
    }
}

struct TrendingProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            ZStack(alignment: .bottomTrailing) {
                if let imageUrl = product.images.first, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(height: 150)
                    .frame(maxWidth: .infinity)
                    .padding(12)
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.1))
                        .frame(height: 150)
                }

                // Add Button
                Button(action: {}) {
                    Text("ADD")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "#15803D"))
                        .padding(.vertical, 6)
                        .padding(.horizontal, 20)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "#4D8B4D"), lineWidth: 1)
                        )
                        .shadow(color: .black.opacity(0.1), radius: 2, y: 2)
                }
                .offset(x: -12, y: 14)  // Positioning
            }
            .zIndex(1)  // Keep button on top

            // Details
            VStack(alignment: .leading, spacing: 6) {
                Spacer().frame(height: 8)  // Space for button overlap

                // Weight Badge / Mock removal
                if let subtitle = product.subtitle, !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "#6B7280"))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(Color(hex: "#F7F9FC"))
                        .cornerRadius(4)
                }

                Text(product.name)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)
                    .frame(height: 38, alignment: .topLeading)

                // Rating
                if let rating = product.rating {
                    HStack(spacing: 2) {
                        ForEach(0..<5) { i in
                            Image(systemName: "star.fill")
                                .font(.system(size: 10))
                                .foregroundColor(i < Int(rating) ? .yellow : .gray.opacity(0.3))
                        }
                        if let count = product.reviewCount {
                            Text("(\(count))")
                                .font(.system(size: 10))
                                .foregroundColor(.gray)
                        }
                    }
                }

                // Delivery - Removed Mock "9 MINS"

                // Price
                HStack(alignment: .bottom, spacing: 6) {
                    Text("₹\(Int(product.price))")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))

                    if let mrp = product.mrp, mrp > product.price {
                        Text("MRP ₹\(Int(mrp))")
                            .font(.system(size: 11))
                            .strikethrough()
                            .foregroundColor(Color(hex: "#9CA3AF"))
                    }
                }
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: .black.opacity(0.08), radius: 8, y: 4)
        .frame(width: 160)
    }
}
