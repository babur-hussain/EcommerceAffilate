import SwiftUI

struct FurnitureEmiOffersView: View {
    struct EmiItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let price: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [EmiItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                if let action = headerActionUrl {
                    Spacer()
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Image(systemName: "chevron.right")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Horizontal List
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(items) { item in
                        EmiCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 24)
    }
}

struct EmiCard: View {
    let item: FurnitureEmiOffersView.EmiItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image (75% height)
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(width: 140, height: 135)  // 75% of 180
                    .clipped()
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.1))
                        .frame(width: 140, height: 135)
                }

                // Footer (25% height)
                VStack(spacing: 2) {
                    Text(item.title)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)

                    Text(item.price)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#cccccc"))
                        .lineLimit(1)
                }
                .frame(width: 140, height: 45)  // 25% of 180
                .background(Color.black)
            }
            .cornerRadius(12)
            .frame(width: 140, height: 180)
        }
    }
}
