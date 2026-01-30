import SwiftUI

struct LightningDealsView: View {
    @State private var products: [Product] = []
    @State private var isLoading = true

    // Props
    var title: String = "Lightning deals"
    var subtitle: String = "Big savings on select products"
    var limit: Int = 6
    var productIds: [String] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#BE123C"))  // Rose 700

                if !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "#4B5563"))  // Gray 600
                }
            }
            .padding(.horizontal, 16)

            // Horizontal List
            if isLoading {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(0..<3) { _ in
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.gray.opacity(0.1))
                                .frame(width: 160, height: 260)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            } else if !products.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(products) { product in
                            LightningDealCard(product: product)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                }
            }
        }
        .padding(.vertical, 24)
        .background(
            LinearGradient(
                colors: [
                    Color(hex: "#FFF0F5"),
                    Color(hex: "#FFE4E1"),
                    Color(hex: "#FDF2F8"),
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
            let fetched = try await APIService.shared.fetchProducts(limit: limit)
            if !productIds.isEmpty {
                self.products = fetched.filter { productIds.contains($0.id) }
                if self.products.isEmpty { self.products = fetched }
            } else {
                self.products = fetched
            }
        } catch {
            print("Failed to load lightning deals: \(error)")
        }
        isLoading = false
    }
}

struct LightningDealCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Area
            ZStack(alignment: .topTrailing) {
                // Discount Badge if applicable
                if let discount = product.discountPercentage, discount > 0 {
                    VStack(spacing: 0) {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 10))
                            .foregroundColor(.white)
                        Text("\(discount)% OFF")
                            .font(.system(size: 7, weight: .bold))
                            .multilineTextAlignment(.center)
                            .foregroundColor(.white)
                    }
                    .padding(4)
                    .background(Color(hex: "#EF4444"))
                    .cornerRadius(4, corners: [.bottomLeft, .bottomRight])
                    .offset(y: -5)  // Hang from top
                    .padding(.trailing, 10)
                }

                if let imageUrl = product.images.first, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(height: 140)
                    .frame(maxWidth: .infinity)
                    .padding(12)
                }

                // Add Button
                Button(action: {}) {
                    Text("ADD")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "#15803D"))
                        .padding(.vertical, 6)
                        .padding(.horizontal, 16)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "#4D8B4D"), lineWidth: 1)
                        )
                        .shadow(color: .black.opacity(0.1), radius: 2, y: 2)
                }
                .offset(y: 130)  // Push to bottom of image area
                .padding(.trailing, 8)
            }
            .zIndex(1)

            // Details
            VStack(alignment: .leading, spacing: 6) {
                Spacer().frame(height: 16)

                // Veg/Non-veg + Subtitle/Weight
                HStack(spacing: 6) {
                    // Using subtitle for weight/unit if available
                    if let subtitle = product.subtitle, !subtitle.isEmpty {
                        Text(subtitle)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(Color(hex: "#374151"))
                    }
                }

                Text(product.name)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)
                    .frame(height: 38, alignment: .topLeading)

                // Stars
                if let rating = product.rating {
                    HStack(spacing: 2) {
                        ForEach(0..<5) { i in
                            Image(systemName: "star.fill")
                                .font(.system(size: 10))
                                .foregroundColor(i < Int(rating) ? .yellow : .gray.opacity(0.3))
                        }
                        if let count = product.reviewCount {
                            Text("(\(count))")
                                .font(.system(size: 11))
                                .foregroundColor(.gray)
                        }
                    }
                }

                // Delivery - Removed Mock "9 MINS"

                // Scarcity
                if let stock = product.stock, stock < 10 {
                    Text("Only \(stock) left")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "#EA580C"))
                }

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

            // Footer
            Button(action: {}) {
                HStack(spacing: 4) {
                    Text("See more like this")
                        .font(.system(size: 11, weight: .bold))
                    Image(systemName: "chevron.right")
                        .font(.system(size: 10))
                }
                .foregroundColor(Color(hex: "#166534"))
                .padding(.vertical, 10)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "#ECFDF5"))
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(Color(hex: "#E5E7EB")),
                    alignment: .top
                )
            }
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, y: 2)
        .frame(width: 160)
    }
}
