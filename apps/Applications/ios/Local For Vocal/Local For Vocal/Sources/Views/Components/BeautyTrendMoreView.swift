import SwiftUI

struct BeautyTrendMoreView: View {
    struct TrendItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let brands: String
        let offer: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [TrendItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Section Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hexString: "#000000"))

                Spacer()

                if let action = headerActionUrl {
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Text("View All")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hexString: "#FF6F00"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(items) { item in
                        TrendMoreCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 24)
    }
}

struct TrendMoreCard: View {
    let item: BeautyTrendMoreView.TrendItem

    var body: some View {
        VStack(spacing: 8) {
            // Main Card (Pink + Image)
            VStack(spacing: 0) {
                // Title
                Text(item.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .padding(.top, 16)
                    .padding(.bottom, 10)
                    .padding(.horizontal, 4)

                // Arched Image Container
                ZStack {
                    Color.white
                    AsyncImage(url: URL(string: item.image)) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                }
                .clipShape(
                    CustomCorner(corners: [.topLeft, .topRight], radius: 100)
                )
                .padding(.top, 4)
            }
            .frame(width: 160, height: 200)
            .background(Color(hexString: "#E91E63"))
            .cornerRadius(24)
            .clipped()

            // Footer Info
            VStack(spacing: 2) {
                Text(item.brands)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(Color(hexString: "#666666"))
                    .textCase(.uppercase)

                Text(item.offer)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hexString: "#000000"))
            }
        }  // End Main VStack
        .onTapGesture {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }
    }
}

extension Color {
    fileprivate init(hexString: String) {
        let hex = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a: UInt64
        let r: UInt64
        let g: UInt64
        let b: UInt64
        switch hex.count {
        case 3:  // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:  // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:  // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
