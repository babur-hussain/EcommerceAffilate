import SwiftUI

struct WinterCollectionView: View {
    // Props
    var title: String = "Winter collection"
    var headerActionUrl: String?
    var items: [CollectionItem] = []

    struct CollectionItem: Identifiable, Decodable {
        let id: String
        let image: String
        let name: String
        let offer: String
        let actionUrl: String?

        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    print("Navigate to: \(action)")
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
                HStack(spacing: 16) {
                    ForEach(items) { item in
                        WinterCollectionCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 32)
    }
}

struct WinterCollectionCard: View {
    let item: WinterCollectionView.CollectionItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#F0F0F0")
                    }
                    .frame(width: 140, height: 220 * 0.70)
                    .clipped()
                } else {
                    Color(hex: "#F0F0F0")
                        .frame(width: 140, height: 220 * 0.70)
                }

                // Footer
                ZStack {
                    // Snowflakes
                    // Left
                    Image(systemName: "snowflake")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#B3E5FC"))
                        .rotationEffect(.degrees(15))
                        .opacity(0.6)
                        .position(x: 10, y: (220 * 0.3) - 15)  // Approximate positioning based on native bottom:10, left:5

                    // Right
                    Image(systemName: "snowflake")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#B3E5FC"))
                        .rotationEffect(.degrees(-15))
                        .opacity(0.6)
                        .position(x: 140 - 10, y: (220 * 0.3) - 15)

                    // Text
                    VStack(spacing: 2) {
                        Text(item.name)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#555555"))
                            .multilineTextAlignment(.center)
                            .lineLimit(1)

                        Text(item.offer)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#111111"))
                            .multilineTextAlignment(.center)
                    }
                }
                .frame(width: 140, height: 220 * 0.30)
                .background(Color(hex: "#FAF0E6"))
            }
            .frame(width: 140, height: 220)
            .background(Color(hex: "#F5F5DC"))  // Fallback BG, though covered
            .cornerRadius(16)
        }
    }
}
