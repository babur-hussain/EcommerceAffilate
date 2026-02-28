import SwiftUI

struct ConsultationBannerView: View {
    let actionUrl: String?
    let title: String
    let callText: String
    let phoneNumber: String
    let poweredByText: String
    let providerName: String
    let doctorImage: String

    var body: some View {
        Button(action: {
            if let action = actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            HStack(alignment: .center, spacing: 0) {
                // Left Content
                VStack(alignment: .leading, spacing: 10) {
                    // Title Row
                    HStack(alignment: .top, spacing: 8) {
                        Text("🩺")
                            .font(.system(size: 24))
                        Text(title)  // Dynamic Title
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hexString: "#0D47A1"))
                            .lineLimit(3)
                            .multilineTextAlignment(.leading)
                    }

                    HStack(spacing: 12) {
                        // Divider
                        Rectangle()
                            .fill(Color(hexString: "#90CAF9"))
                            .frame(width: 1, height: 30)

                        // Call Info
                        VStack(alignment: .leading, spacing: 2) {
                            Text(callText)  // Dynamic Call Text
                                .font(.system(size: 10))
                                .foregroundColor(Color(hexString: "#1565C0"))
                            Text(phoneNumber)  // Dynamic Phone
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hexString: "#0D47A1"))
                        }
                    }

                    // Powered By Badge
                    VStack(alignment: .leading, spacing: 0) {
                        Text(poweredByText)  // Dynamic Powered By
                            .font(.system(size: 9))
                            .foregroundColor(Color(hexString: "#555555"))
                        Text(providerName)  // Dynamic Provider
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hexString: "#0056D2"))
                            .italic()
                    }
                }
                .padding(.leading, 16)
                .padding(.vertical, 16)
                .zIndex(1)

                Spacer()
            }
            .frame(height: 140)
            .frame(maxWidth: .infinity)
            .background(Color(hexString: "#D1E7FC"))
            .cornerRadius(16)
            .overlay(
                // Doctor Image positioned bottom trailing
                AsyncImage(url: URL(string: doctorImage)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                } placeholder: {
                    Color.clear
                }
                .frame(width: 120, height: 130)
                .offset(x: 0, y: 10), alignment: .bottomTrailing
            )
            .overlay(
                // Decorative Bubbles
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.5))
                        .frame(width: 20, height: 20)
                        .offset(x: 80, y: -40)

                    Circle()
                        .fill(Color.white.opacity(0.3))
                        .frame(width: 10, height: 10)
                        .offset(x: 60, y: 30)
                }
            )
            .clipped()
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
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
