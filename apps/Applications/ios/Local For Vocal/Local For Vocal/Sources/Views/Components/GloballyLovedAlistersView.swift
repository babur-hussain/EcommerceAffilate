import SwiftUI

struct GloballyLovedAlistersView: View {
    struct AlisterItem: Decodable, Identifiable {
        let id: String
        let brand: String
        let subBrand: String?
        let model: String
        let product: String
        let offer: String
        let bg: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [AlisterItem]

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

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

            // Grid Content
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(items) { item in
                    AlisterCard(item: item)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 24)
    }
}

struct AlisterCard: View {
    let item: GloballyLovedAlistersView.AlisterItem

    var body: some View {
        VStack(spacing: 8) {
            // Card Main
            ZStack {
                // Background
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color(hexString: item.bg))

                // Header (Brand)
                VStack(spacing: 2) {
                    Text(item.brand)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.black)
                        .multilineTextAlignment(.center)
                        .padding(.top, 15)

                    if let sub = item.subBrand {
                        Text(sub)
                            .font(.system(size: 8))
                            .foregroundColor(Color(hexString: "#333333"))
                            .textCase(.uppercase)
                    }
                    Spacer()
                }
                .zIndex(2)

                // Model Image (Bottom Right)
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        AsyncImage(url: URL(string: item.model)) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color.clear
                        }
                        .frame(width: 140 * 0.7, height: 180 * 0.8)  // approx based on logic
                        .clipShape(RoundedRectangle(cornerRadius: 20))  // Simplification
                        // Native has specific border radius logic, usually implemented with masking
                    }
                }
                .overlay(
                    // Product Image (Bottom Left)
                    VStack {
                        Spacer()
                        HStack {
                            ZStack {
                                Color.white.opacity(0.4)
                                AsyncImage(url: URL(string: item.product)) { image in
                                    image.resizable()
                                        .aspectRatio(contentMode: .fit)
                                } placeholder: {
                                    Color.gray.opacity(0.1)
                                }
                                .padding(4)
                                .rotationEffect(.degrees(-10))
                            }
                            .frame(width: 70, height: 90)
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                            .padding(.leading, 10)
                            .padding(.bottom, 10)

                            Spacer()
                        }
                    }
                )
            }
            .frame(height: 190)

            // Offer Text
            Text(item.offer)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.black)
                .fixedSize(horizontal: false, vertical: true)
                .multilineTextAlignment(.center)
        }

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
