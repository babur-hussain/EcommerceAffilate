import SwiftUI

struct SankrantiFestivalView: View {
    // Props
    var title: String = "Shine bright this Sankranti"
    var headerActionUrl: String?
    var items: [FestiveItem] = []

    struct FestiveItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let price: String
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
                        FestiveCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
        .background(Color.clear)  // Section background
    }
}

struct FestiveCard: View {
    let item: SankrantiFestivalView.FestiveItem

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
                .frame(width: 130, height: 160)
                .clipped()
                .background(Color(hex: "#EEEEEE"))

                // Festive Banner
                HStack(spacing: 0) {
                    // Left Icon (Yellow Diamond)
                    Rectangle()
                        .fill(Color(hex: "#FFEB3B"))
                        .frame(width: 14, height: 14)
                        .cornerRadius(2)
                        .rotationEffect(.degrees(-45))

                    Spacer()

                    // Text Content
                    VStack(spacing: 2) {
                        Text(item.title)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(Color.white.opacity(0.95))
                            .multilineTextAlignment(.center)
                            .lineLimit(1)

                        Text(item.price)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                    }

                    Spacer()

                    // Right Icon (Yellow Diamond)
                    Rectangle()
                        .fill(Color(hex: "#FFEB3B"))
                        .frame(width: 14, height: 14)
                        .cornerRadius(2)
                        .rotationEffect(.degrees(45))
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 8)
                .frame(width: 130)
                .background(Color(hex: "#BA68C8"))
            }
            .cornerRadius(12)
            .background(Color.white)
            .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
        }
    }
}
