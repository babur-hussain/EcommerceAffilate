import Combine
import SwiftUI

struct BeautyKBeautyView: View {
    struct KBeautyItem: Decodable, Identifiable {
        let id: String
        let brand: String
        let image: String
        let ingredientTitle: String?
        let ingredient: String
        let offer: String
        let bg: String?  // Hex string for background color
        let actionUrl: String?
        let darkText: Bool?
    }

    let title: String
    let headerActionUrl: String?
    let items: [KBeautyItem]

    @State private var activeIndex = 0
    private let timer = Timer.publish(every: 5, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hexString: "#000000"))

                Spacer()

                if let action = headerActionUrl {
                    Button(action: {
                        print("Navigate to: \(action)")
                    }) {
                        Text("View All")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hexString: "#FF6F00"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Carousel
            VStack(spacing: 12) {
                TabView(selection: $activeIndex) {
                    ForEach(0..<items.count, id: \.self) { index in
                        KBeautyCard(item: items[index])
                            .tag(index)
                    }
                }
                // .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never)) // Unavailable in macOS
                .frame(height: 340)  // Height from native: 340

                // Pagination Dots
                HStack(spacing: 8) {
                    ForEach(0..<items.count, id: \.self) { index in
                        Capsule()
                            .fill(index == activeIndex ? Color.black : Color(hexString: "#E0E0E0"))
                            .frame(width: index == activeIndex ? 24 : 12, height: 4)
                            .animation(.spring(), value: activeIndex)
                    }
                }
            }
        }
        .padding(.bottom, 32)
        .onReceive(timer) { _ in
            withAnimation {
                activeIndex = (activeIndex + 1) % items.count
            }
        }
    }
}

struct KBeautyCard: View {
    let item: BeautyKBeautyView.KBeautyItem

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background Color
                Color(hexString: item.bg ?? "#FFFFFF")

                // Main Image
                AsyncImage(url: URL(string: item.image)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color.gray.opacity(0.1)
                }
                .frame(width: geometry.size.width, height: geometry.size.height)

                // Brand Pill (Top Left)
                // Native: top: 20, left: 20
                VStack {
                    HStack {
                        Text(item.brand)
                            .font(.system(size: 24, weight: .light))
                            .tracking(2)
                            .foregroundColor((item.darkText ?? false) ? .black : .white)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(Color.white.opacity(0.3))
                            .clipShape(Capsule())
                        Spacer()
                    }
                    Spacer()
                }
                .padding(.top, 20)
                .padding(.leading, 20)

                // Ingredient Box (Floating Right Middle)
                // Native: right: 0, top: '45%'
                // We typically use alignment .trailing in ZStack or GeometryReader
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        VStack(alignment: .leading, spacing: 4) {
                            Text(item.ingredientTitle ?? "STAR\nINGREDIENT")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .textCase(.uppercase)

                            Rectangle()
                                .fill(Color.white.opacity(0.5))
                                .frame(height: 1)
                                .frame(maxWidth: .infinity)

                            Text(item.ingredient)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .padding(.vertical, 16)
                        .padding(.horizontal, 12)
                        .background(Color(hexString: "#E91E63"))
                        .clipShape(
                            CustomCorner(corners: [.topLeft, .bottomLeft], radius: 16)
                        )
                        .shadow(radius: 4)
                        // No padding on the right to flush with edge
                    }
                    // Adjust spacer ratio to approximate top 45%
                    // Using spacers is rough. Let's use alignment.bottom + offset or padding.
                    // If we want it roughly vertically centered but slightly up?
                    Spacer().frame(height: 80)
                }

                // Gradient Footer with Offer
                VStack {
                    Spacer()
                    LinearGradient(
                        gradient: Gradient(colors: [.clear, Color.black.opacity(0.6)]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 100)
                    .overlay(
                        Text(item.offer)
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                            .shadow(color: .black.opacity(0.5), radius: 4, x: 0, y: 1)
                            .padding(.bottom, 20),
                        alignment: .bottom
                    )
                }
            }
        }
        .cornerRadius(20)
        .padding(.horizontal, 16)  // Padding to simulate card width < screen width
        .onTapGesture {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
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
