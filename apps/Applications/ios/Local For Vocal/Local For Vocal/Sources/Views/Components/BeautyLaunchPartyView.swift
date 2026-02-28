import SwiftUI

struct BeautyLaunchPartyView: View {
    struct LaunchItem: Decodable, Identifiable {
        let id: String
        let image: String
        let offer: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [LaunchItem]

    var body: some View {
        ZStack {
            // Gradient Background
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(hexString: "#F06292"),
                    Color(hexString: "#FF8A65"),
                ]),
                startPoint: .leading,
                endPoint: .trailing
            )

            VStack(alignment: .leading, spacing: 16) {
                // Header
                HStack(alignment: .top) {
                    Text(title)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.top, 4)

                    Spacer()

                    // Badge "The LAUNCH party"
                    if headerActionUrl != nil {
                        Button(action: {
                            if let action = headerActionUrl {
                                AppLogger.debug("Navigate to: \(action)")
                            }
                        }) {
                            VStack(spacing: 0) {
                                Text("The")
                                    .font(.system(size: 8, weight: .bold))
                                Text("LAUNCH")
                                    .font(.system(size: 8, weight: .bold))
                                Text("party")
                                    .font(.system(size: 8, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .padding(.vertical, 6)
                            .padding(.horizontal, 10)
                            .background(Color(hexString: "#E91E63"))
                            .clipShape(Capsule())
                        }
                    } else {
                        VStack(spacing: 0) {
                            Text("The")
                                .font(.system(size: 8, weight: .bold))
                            Text("LAUNCH")
                                .font(.system(size: 8, weight: .bold))
                            Text("party")
                                .font(.system(size: 8, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.vertical, 6)
                        .padding(.horizontal, 10)
                        .background(Color(hexString: "#E91E63"))
                        .clipShape(Capsule())
                    }
                }
                .padding(.horizontal, 16)

                // Horizontal Scroll
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(items) { item in
                            LaunchCard(item: item)
                                .onTapGesture {
                                    if let action = item.actionUrl {
                                        AppLogger.debug("Navigate to: \(action)")
                                    }
                                }
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
            .padding(.vertical, 16)
        }
        .cornerRadius(20)
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }
}

struct LaunchCard: View {
    let item: BeautyLaunchPartyView.LaunchItem

    var body: some View {
        VStack(spacing: 0) {
            // Image Background
            AsyncImage(url: URL(string: item.image)) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.white
            }
            .frame(width: 150, height: 165)  // 200 total height - footer
            .clipped()

            // Footer
            HStack {
                Spacer()
                Text(item.offer)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
            }
            .frame(height: 35)
            .background(Color(hexString: "#D32F2F"))
        }
        .frame(width: 150, height: 200)
        .cornerRadius(16)
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
