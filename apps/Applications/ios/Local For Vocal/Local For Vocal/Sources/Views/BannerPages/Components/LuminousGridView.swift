import SwiftUI

struct LuminousGridView: View {
    let title: String
    let items: [Product]

    var body: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16),
            ], spacing: 16
        ) {
            ForEach(items) { item in
                BeautyProductCard(item: item)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 24)
    }
}

struct BeautyProductCard: View {
    let item: Product
    @State private var isFavorite: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Container
            ZStack(alignment: .topTrailing) {
                // Use first image or empty string
                let imageUrl = item.images.first ?? ""

                CachedAsyncImage(url: URL(string: imageUrl)) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color(red: 0.99, green: 0.96, blue: 0.96)
                }
                .frame(height: 140)
                .frame(maxWidth: .infinity)
                .background(Color(red: 0.99, green: 0.96, blue: 0.96))
                .cornerRadius(16)
                .clipped()

                // Favorite Button
                Button(action: { isFavorite.toggle() }) {
                    Image(systemName: isFavorite ? "heart.fill" : "heart")
                        .font(.system(size: 14))
                        .foregroundColor(Color(red: 0.96, green: 0.44, blue: 0.52))
                        .padding(6)
                        .background(Color.white.opacity(0.8))
                        .clipShape(Circle())
                        .shadow(color: .black.opacity(0.1), radius: 2)
                }
                .padding(8)
            }
            .padding(12)

            // Content
            VStack(alignment: .leading, spacing: 4) {
                // Category Tag
                Text(item.category.uppercased())
                    .font(.system(size: 10, weight: .bold))
                    .tracking(2)
                    .foregroundColor(Color(red: 0.91, green: 0.64, blue: 0.66))

                // Title
                Text(item.name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(red: 0.12, green: 0.14, blue: 0.17))
                    .lineLimit(1)

                // Details (Placeholder for now as Product doesn't have exact fields like "50ml")
                Text(item.subtitle ?? "Premium Quality")
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 0.39, green: 0.45, blue: 0.55))
                    .padding(.bottom, 12)
                    .lineLimit(1)

                // Price Row
                HStack {
                    Text("₹\(Int(item.price))")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))

                    Spacer()

                    // Add to Cart
                    Button(action: {}) {
                        Image(systemName: "cart.badge.plus")
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color(red: 0.91, green: 0.64, blue: 0.66))
                            .cornerRadius(12)
                            .shadow(
                                color: Color(red: 0.91, green: 0.64, blue: 0.66).opacity(0.4),
                                radius: 8, y: 4)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.bottom, 12)
        }
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.04), radius: 8, y: 4)
    }
}
