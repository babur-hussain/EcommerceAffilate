import SwiftUI

struct FurnitureWishlistView: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.props?["title"]?.value as? String ?? "Add to your wishlist"

        // Robust Parsing attempts (Inline to avoid static/instance issues)
        let items: [WishlistItem] = {
            // Attempt 1: Direct cast to [[String: Any]]
            if let itemsList = component.props?["items"]?.value as? [[String: Any]] {
                return itemsList.map { dict in
                    WishlistItem(
                        title: dict["title"] as? String,
                        price: dict["price"] as? String,
                        image: dict["image"] as? String,
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            // Attempt 2: Cast to [Any] then [String: Any]
            if let arrayAny = component.props?["items"]?.value as? [Any] {
                return arrayAny.compactMap { item -> WishlistItem? in
                    guard let dict = item as? [String: Any] else { return nil }
                    return WishlistItem(
                        title: dict["title"] as? String,
                        price: dict["price"] as? String,
                        image: dict["image"] as? String,
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            return []
        }()

        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.black)

            if items.isEmpty {
                // DEBUG VIEW
                VStack(alignment: .leading, spacing: 8) {
                    Text("DEBUG: No items loaded")
                        .foregroundColor(.red)
                    if let rawValue = component.props?["items"]?.value {
                        Text("Type: \(String(describing: type(of: rawValue)))")
                            .font(.caption)
                            .foregroundColor(.red)
                        Text("Value: \(String(describing: rawValue))")
                            .font(.caption)
                            .foregroundColor(.red)
                            .lineLimit(4)
                    } else {
                        Text("Props['items'] is nil")
                            .foregroundColor(.red)
                        Text("Keys: \(component.props?.keys.joined(separator: ", ") ?? "none")")
                            .font(.caption)
                    }
                }
                .padding()
                .background(Color.yellow.opacity(0.2))
            } else {
                LazyVGrid(
                    columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16),
                    ], spacing: 16
                ) {
                    ForEach(items) { item in
                        NavigationLink(destination: destinationView(for: item.actionUrl)) {
                            VStack(alignment: .leading, spacing: 0) {
                                if let imageUrl = item.image {
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
                                    if let itemTitle = item.title {
                                        Text(itemTitle)
                                            .font(.system(size: 12))
                                            .foregroundColor(Color(hex: "666666"))
                                            .lineLimit(1)
                                    }
                                    if let price = item.price {
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
        }
        .padding(16)
        .background(Color(hex: "FFCCBC"))  // Peach/Orange background
        .cornerRadius(16)
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }

    private func destinationView(for action: String?) -> some View {
        Text("Product Details")
    }
}

private struct WishlistItem: Identifiable {
    let id = UUID()
    let title: String?
    let price: String?
    let image: String?
    let actionUrl: String?
}
