import SwiftUI

struct LuminousGridView: View {
    let title: String

    struct ProductItem: Decodable, Identifiable {
        let id: String
        let title: String
        let subtitle: String
        let price: String
        let original_price: String?
        let image_url: String
        let badge: String?
        let badge_bg: String?
    }

    let items: [ProductItem]

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
    let item: LuminousGridView.ProductItem
    @State private var isFavorite: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Container
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: item.image_url)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        Color(red: 0.99, green: 0.96, blue: 0.96)
                    case .empty:
                        Color(red: 0.99, green: 0.96, blue: 0.96)
                    @unknown default:
                        Color(red: 0.99, green: 0.96, blue: 0.96)
                    }
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
                Text(item.subtitle.uppercased())
                    .font(.system(size: 10, weight: .bold))
                    .tracking(2)
                    .foregroundColor(Color(red: 0.91, green: 0.64, blue: 0.66))

                // Title
                Text(item.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(red: 0.12, green: 0.14, blue: 0.17))
                    .lineLimit(1)

                // Details
                Text("50ml • Organic formula")
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 0.39, green: 0.45, blue: 0.55))
                    .padding(.bottom, 12)

                // Price Row
                HStack {
                    Text(item.price)
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
