// JSON slug: home-decor-header-theme
// Page slug: home
import SwiftUI

struct HomeDecorHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct HomeDecorThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "home-decor-header-theme",
            pageSlug: "home",
            defaultGradientColors: [
                Color(hex: "#4E342E"), Color(hex: "#5D4037"), Color(hex: "#6D4C41"),
            ]
        )
    }
}
