import SwiftUI

struct FurnitureDealOfDayView: View {
    struct DealItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let price: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [DealItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#000000"))

                if let action = headerActionUrl {
                    Spacer()
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Text("View All ›")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#000000"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(items) { item in
                        DealCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
        }
        .padding(.bottom, 24)
    }
}

struct DealCard: View {
    let item: FurnitureDealOfDayView.DealItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            ZStack(alignment: .bottomLeading) {
                // Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#f0f0f0")
                    }
                    .frame(width: 250, height: 160)
                    .clipped()
                } else {
                    Rectangle()
                        .fill(Color(hex: "#f0f0f0"))
                        .frame(width: 250, height: 160)
                }

                // Overlay Title
                Text(item.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .shadow(color: Color.black.opacity(0.5), radius: 3, x: 0, y: 1)
                    .padding(.bottom, 40)  // Space for footer
                    .padding(.horizontal, 8)

                // Footer
                HStack {
                    Text(item.price)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)

                    Spacer()

                    Image(systemName: "arrow.right")
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .frame(width: 250)
                .background(Color.black)
            }
            .cornerRadius(12)
            .frame(width: 250, height: 160)
        }
    }
}
