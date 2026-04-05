import SwiftUI

struct ShopByPriceView: View {
    var title: String = "Shop by Price"
    var headerActionUrl: String?
    var items: [PriceBanner] = []

    struct PriceBanner: Identifiable, Decodable {
        let id: String
        let image: String
        var actionUrl: String?
    }

    // 3 Columns Grid
    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    AppLogger.debug("Navigate to: \(action)")
                }
            }) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.horizontal, 16)

            // Grid of items
            if !items.isEmpty {
                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(items) { item in
                        Button(action: {
                            if let url = item.actionUrl {
                                AppLogger.debug("Navigate to: \(url)")
                            }
                        }) {
                            CachedAsyncImage(url: URL(string: item.image)) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                Color.gray.opacity(0.1)
                                    .aspectRatio(1.0, contentMode: .fit)
                            }
                            .cornerRadius(12)
                            .clipped()
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
        .background(Color.white)
    }
}
