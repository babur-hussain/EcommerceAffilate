import SwiftUI

struct BeautyInternetFamedView: View {
    struct InternetFamedItem: Decodable, Identifiable {
        let id: String
        let brand: String
        let desc: String
        let image: String
        let offer: String
        let bg: [String]?  // Gradient colors
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [InternetFamedItem]

    // Grid layout: 2 columns
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
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Text("View All")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hexString: "#FF6F00"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Grid
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(items) { item in
                    InternetFamedCard(item: item)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 24)
    }
}

struct InternetFamedCard: View {
    let item: BeautyInternetFamedView.InternetFamedItem

    var body: some View {
        VStack(spacing: 8) {
            // Main Card
            ZStack(alignment: .top) {
                // Background
                LinearGradient(
                    gradient: Gradient(
                        colors: (item.bg ?? ["#F8BBD0", "#EC407A"]).map { Color(hexString: $0) }),
                    startPoint: .top,
                    endPoint: .bottom
                )

                // Content
                VStack(spacing: 0) {
                    // Logo Pill
                    Text(item.brand)
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.black)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.white)
                        .cornerRadius(16)
                        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
                        .padding(.top, 20)

                    // Description
                    Text(item.desc)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 10)
                        .padding(.top, 8)
                        .fixedSize(horizontal: false, vertical: true)

                    Spacer()
                }
                .zIndex(2)

                // Image at bottom (Absolute)
                VStack {
                    Spacer()
                    AsyncImage(url: URL(string: item.image)) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.white.opacity(0.1)
                    }
                    .frame(height: 100)
                    .frame(maxWidth: .infinity)
                    .padding(.bottom, 0)
                }
                .zIndex(1)
            }
            .frame(height: 200)
            .mask(InternetFamedShape())
            .clipShape(InternetFamedShape())  // Ensure clip applies

            // Offer Text
            Text(item.offer)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(hexString: "#000000"))
        }
        .onTapGesture {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }
    }
}

// Custom Shape to match: borderTopLeftRadius: 80, borderTopRightRadius: 80, others 20
struct InternetFamedShape: Shape {
    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath()

        let width = rect.width
        let height = rect.height
        let rad80: CGFloat = 80
        let rad20: CGFloat = 20

        // Start from top-left, moving clockwise
        // Top-Left corner (80)
        path.move(to: CGPoint(x: 0, y: rad80))
        path.addArc(
            withCenter: CGPoint(x: rad80, y: rad80), radius: rad80, startAngle: .pi,
            endAngle: 1.5 * .pi, clockwise: true)

        // Top Edge
        path.addLine(to: CGPoint(x: width - rad80, y: 0))

        // Top-Right corner (80)
        path.addArc(
            withCenter: CGPoint(x: width - rad80, y: rad80), radius: rad80, startAngle: 1.5 * .pi,
            endAngle: 0, clockwise: true)

        // Right Edge
        path.addLine(to: CGPoint(x: width, y: height - rad20))

        // Bottom-Right corner (20)
        path.addArc(
            withCenter: CGPoint(x: width - rad20, y: height - rad20), radius: rad20, startAngle: 0,
            endAngle: 0.5 * .pi, clockwise: true)

        // Bottom Edge
        path.addLine(to: CGPoint(x: rad20, y: height))

        // Bottom-Left corner (20)
        path.addArc(
            withCenter: CGPoint(x: rad20, y: height - rad20), radius: rad20, startAngle: 0.5 * .pi,
            endAngle: .pi, clockwise: true)

        // Left Edge
        path.close()

        return Path(path.cgPath)
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
