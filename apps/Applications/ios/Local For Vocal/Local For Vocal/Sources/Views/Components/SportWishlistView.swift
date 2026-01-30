import SwiftUI

struct SportWishlistView: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.props?["title"]?.value as? String ?? "Add to your wishlist"
        let items = component.children ?? []

        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.black)

            LazyVGrid(
                columns: [
                    GridItem(.flexible(), spacing: 16),
                    GridItem(.flexible(), spacing: 16),
                ], spacing: 16
            ) {
                ForEach(items, id: \.id) { item in
                    NavigationLink(destination: destinationView(for: item.prop(for: "actionUrl"))) {
                        VStack(alignment: .leading, spacing: 0) {
                            if let imageUrl = item.prop(for: "image") as String? {
                                AsyncImage(url: URL(string: imageUrl)) { phase in
                                    switch phase {
                                    case .empty:
                                        Color.gray.opacity(0.1)
                                    case .success(let image):
                                        image
                                            .resizable()
                                            .scaledToFill()
                                    case .failure:
                                        Color.gray.opacity(0.1)
                                    @unknown default:
                                        Color.gray.opacity(0.1)
                                    }
                                }
                                .frame(height: 140)
                                .clipped()
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                if let subtitle = item.props?["title"]?.value as? String {
                                    Text(subtitle)
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "666666"))
                                        .lineLimit(1)
                                }
                                if let price = item.props?["price"]?.value as? String {
                                    Text(price)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.black)
                                }
                            }
                            .padding(8)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                    }
                }
            }
        }
        .padding(16)
        .background(Color(hex: "FFCCBC"))  // Peach/Orange background
        .cornerRadius(16)
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }

    private func destinationView(for action: String?) -> some View {
        // Implement navigation logic or return a generic view
        Text("Product Details")
    }
}
