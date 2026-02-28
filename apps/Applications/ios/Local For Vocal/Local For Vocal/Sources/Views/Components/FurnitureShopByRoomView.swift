import SwiftUI

struct FurnitureShopByRoomView: View {
    struct RoomItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let color: String?
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [RoomItem]

    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

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

            // Grid
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(items) { item in
                    RoomCard(item: item)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct RoomCard: View {
    let item: FurnitureShopByRoomView.RoomItem

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
                        Color.gray.opacity(0.1)
                    }
                    .frame(height: 200)
                    .clipped()
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.1))
                        .frame(height: 200)
                }

                // Overlay
                HStack {
                    Text(item.title)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.black)
                        .lineLimit(1)

                    Spacer()

                    Circle()
                        .fill(Color.black)
                        .frame(width: 20, height: 20)
                        .overlay(
                            Image(systemName: "arrow.right")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                        )
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color(hex: item.color ?? "#FFD54F"))
                .cornerRadius(12)
                .padding(12)
                .padding(.leading, 18)  // Extra padding to mimic design
            }
            .background(Color(hex: "#eeeeee"))
            .cornerRadius(16)
        }
    }
}
