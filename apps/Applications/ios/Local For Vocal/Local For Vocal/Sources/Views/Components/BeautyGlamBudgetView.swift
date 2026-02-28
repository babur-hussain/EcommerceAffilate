import SwiftUI

struct BeautyGlamBudgetView: View {
    struct GlamItem: Decodable, Identifiable {
        let id: String
        let label: String
        let value: String
        let sub: String?
        let bg: [String]?  // Hex strings for gradient
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [GlamItem]

    // 3 Columns
    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
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
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(items) { item in
                    GlamBudgetCard(item: item)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 24)
    }
}

struct GlamBudgetCard: View {
    let item: BeautyGlamBudgetView.GlamItem

    var body: some View {
        ZStack {
            // Background Gradient
            LinearGradient(
                gradient: Gradient(
                    colors: (item.bg ?? ["#FFFDE7", "#FFD54F"]).map { Color(hexString: $0) }),
                startPoint: .top,
                endPoint: .bottom
            )

            // Content
            VStack(spacing: 2) {
                Text(item.label)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hexString: "#5D4037"))

                Text(item.value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hexString: "#3E2723"))

                if let sub = item.sub {
                    Text(sub)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(Color(hexString: "#5D4037"))
                }
            }
            .padding(8)
        }
        .aspectRatio(1.0, contentMode: .fit)
        .cornerRadius(12)
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
