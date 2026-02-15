import SwiftUI

struct SpoilYourselfTitleSDUI: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.prop(for: "title") as String? ?? "Spoil Yourself"
        let gradientHexColors =
            component.prop(for: "gradientColors") as [String]? ?? ["#FF6B00", "#FF6B00"]
        let gradientColors = gradientHexColors.map { Color(hex: $0) }

        // Adaptive background (if needed via style props)
        // For now, mirroring the reference implementation of just the title arrangement

        HStack {
            // Left Gradient Line
            LinearGradient(
                gradient: Gradient(colors: [.clear, gradientColors.first ?? .orange]),
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: 1)
            .frame(width: 60)

            // Sparkle
            Image(systemName: "sparkle")
                .font(.system(size: 12))
                .foregroundColor(gradientColors.first ?? .orange)

            // Title
            Text(title)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.white)

            // Sparkle
            Image(systemName: "sparkle")
                .font(.system(size: 12))
                .foregroundColor(gradientColors.last ?? .orange)

            // Right Gradient Line
            LinearGradient(
                gradient: Gradient(colors: [gradientColors.last ?? .orange, .clear]),
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: 1)
            .frame(width: 60)
        }
        .padding(.horizontal, 16)
        .padding(.top, 0)  // Reduced from 8
        .padding(.bottom, 0)  // Reduced from 4
    }
}
