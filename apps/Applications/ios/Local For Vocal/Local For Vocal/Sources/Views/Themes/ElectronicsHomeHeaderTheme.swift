import Lottie
// JSON slug: electronics-header-theme
// Page slug: electronics
import SwiftUI

struct ElectronicsHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct ElectronicsThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "electronics-header-theme",
            pageSlug: "electronics",
            defaultGradientColors: [
                Color(hex: "#1A237E"), Color(hex: "#283593"), Color(hex: "#303F9F"),
            ]
        )
    }
}
