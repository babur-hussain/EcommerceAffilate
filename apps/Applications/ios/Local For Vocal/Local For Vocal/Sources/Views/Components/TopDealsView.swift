import SwiftUI

struct TopDealsView: View {
    var title: String = "Top Deals"
    var headerActionUrl: String?
    var items: [DealItem] = []

    struct DealItem: Identifiable, Decodable {
        let id: String
        let title: String
        let price: String
        let image: String
        let bgColor: String?
        let barColor: String?
        let actionUrl: String?
        
        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    AppLogger.debug("Navigate to: \(action)")
                }
            }) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.black)
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.horizontal, 16)

            VStack(spacing: 16) {
                // Top Row (2 Items)
                if items.count >= 2 {
                    HStack(spacing: 12) {
                        TopDealsCard(item: items[0], isLarge: true)
                        TopDealsCard(item: items[1], isLarge: true)
                    }
                    .padding(.horizontal, 16)
                }

                // Bottom Row (3 Items)
                if items.count >= 5 {
                    HStack(spacing: 12) {
                        TopDealsCard(item: items[2], isLarge: false)
                        TopDealsCard(item: items[3], isLarge: false)
                        TopDealsCard(item: items[4], isLarge: false)
                    }
                    .padding(.horizontal, 16)
                }
            }
        }
        .padding(.vertical, 16)
        .background(Color.white)
    }
}

struct TopDealsCard: View {
    let item: TopDealsView.DealItem
    let isLarge: Bool

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image area
                VStack {
                    Spacer()
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Color.clear
                        }
                        .frame(height: isLarge ? 120 : 90)
                    }
                    Spacer()
                }
                .frame(maxWidth: .infinity)
                .frame(height: isLarge ? 150 : 120)
                .background(Color(hex: item.bgColor ?? "#EADEFF")) // default light purple

                // Bottom info
                VStack(spacing: 4) {
                    Text(item.title)
                        .font(.system(size: isLarge ? 14 : 12, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .padding(.horizontal, 4)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 6)
                        .background(Color(hex: item.barColor ?? "#A55CFF")) // default purple

                    Text(item.price)
                        .font(.system(size: isLarge ? 14 : 12, weight: .bold))
                        .foregroundColor(.black)
                        .padding(.bottom, 8)
                }
                .background(Color(hex: item.bgColor ?? "#EADEFF"))
            }
            .cornerRadius(12)
        }
    }
}
