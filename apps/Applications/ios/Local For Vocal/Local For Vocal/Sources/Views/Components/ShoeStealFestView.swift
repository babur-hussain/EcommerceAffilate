import SwiftUI

struct ShoeStealFestView: View {
    // Props
    var title: String = "Shoe's Steal Fest"
    var headerActionUrl: String?
    var items: [ShoeItem] = []

    struct ShoeItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let offer: String
        let actionUrl: String?

        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    AppLogger.debug("Navigate to: \(action)")
                }
            }) {
                HStack(spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#000000"))
                    Text("›")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#000000"))
                }
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.horizontal, 16)

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(items) { item in
                        ShoeFestCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
        .background(Color.clear)
    }
}

struct ShoeFestCard: View {
    let item: ShoeStealFestView.ShoeItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image Container
                ZStack {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color(hex: "#EEEEEE")
                        }
                    } else {
                        Color(hex: "#EEEEEE")
                    }
                }
                .frame(width: 160, height: 160)
                .cornerRadius(12)
                .background(Color(hex: "#EEEEEE"))
                .clipped()
                .padding(.bottom, 8)

                // Info
                VStack(spacing: 2) {
                    Text(item.title)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#4B5563"))
                        .multilineTextAlignment(.center)
                        .lineLimit(1)

                    Text(item.offer)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#111111"))
                        .multilineTextAlignment(.center)
                }
                .padding(.horizontal, 4)
                .frame(width: 160)
            }
            .padding(.bottom, 4)
            .shadow(color: .black.opacity(0.0), radius: 0)  // No shadow in RN version
        }
    }
}
