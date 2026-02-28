import SwiftUI

struct DealsOfTheDayView: View {
    // Props
    var title: String = "Deals of the Day"
    var subtitle: String = "Clock is ticking!"
    var headerActionUrl: String?
    var items: [DealItem] = []

    struct DealItem: Identifiable, Decodable {
        let id: String
        let image: String
        let offer: String
        let brand: String
        let price: String
        let actionUrl: String?

        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack(alignment: .center) {
                HStack(spacing: 8) {
                    Image(systemName: "clock.fill")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                    Text(title.uppercased())
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                        .tracking(0.5)  // letter spacing
                }

                Spacer()

                if headerActionUrl != nil {
                    Button(action: {
                        AppLogger.debug("Navigate to: \(headerActionUrl!)")
                    }) {
                        Text("View All ›")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 4)

            // Subtitle
            Text(subtitle)
                .font(.system(size: 13))
                .foregroundColor(Color.white.opacity(0.9))
                .padding(.horizontal, 16)
                .padding(.bottom, 16)

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(items) { item in
                        DealsOfTheDayCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
        .background(Color(hex: "#EF5350"))
    }
}

struct DealsOfTheDayCard: View {
    let item: DealsOfTheDayView.DealItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(alignment: .leading, spacing: 0) {
                // Image Container
                ZStack(alignment: .topLeading) {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color(hex: "#F0F0F0")
                        }
                    } else {
                        Color(hex: "#F0F0F0")
                    }

                    // Badge
                    Text(item.offer)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(Color(hex: "#D32F2F"))
                        .clipShape(
                            RoundedCorner(radius: 8, corners: [.bottomRight])
                        )
                }
                .frame(width: 134, height: 150)  // Card width 150 - padding 8*2 = 134 internal width approx, but simpler to fix outer width
                .frame(maxWidth: .infinity)
                .background(Color(hex: "#F0F0F0"))
                .cornerRadius(8)
                .clipped()
                .padding(.bottom, 8)

                // Brand
                Text(item.brand)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#666666"))
                    .lineLimit(1)
                    .padding(.bottom, 2)

                // Price
                Text(item.price)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "#B71C1C"))
            }
            .padding(8)
            .padding(.bottom, 4)  // extra padding to match style
            .frame(width: 150)
            .background(Color.white)
            .cornerRadius(12)
        }
    }
}
