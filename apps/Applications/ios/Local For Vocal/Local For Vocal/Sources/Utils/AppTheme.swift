import SwiftUI

struct AppTheme {
    struct Colors {
        static let primary = Color(hex: "#2563EB")
        static let secondary = Color(hex: "#10B981")  // Or #1F2937 depending on usage
        static let background = Color(hex: "#F3F4F6")

        static let textPrimary = Color(hex: "#1F2937")
        static let textSecondary = Color(hex: "#4B5563")  // Adjusted to match UI usage
        static let textTertiary = Color(hex: "#6B7280")

        static let error = Color(hex: "#EF4444")
        static let warning = Color(hex: "#F59E0B")
        static let success = Color(hex: "#16A34A")

        static let border = Color(hex: "#E5E7EB")
        static let backgroundLight = Color(hex: "#F9FAFB")
        static let backgroundWhite = Color.white
    }

    struct Constants {
        static let cornerRadius: CGFloat = 8
        static let padding: CGFloat = 16
        static let animationDuration: Double = 0.3
    }
}
