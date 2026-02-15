// JSON slug: toys-header-theme
// Page slug: toys
import SwiftUI

struct ToysHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct ToysThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "toys-header-theme",
            pageSlug: "toys",
            defaultGradientColors: [
                Color(hex: "#FF6F00"), Color(hex: "#FF8F00"), Color(hex: "#FFA000"),
            ]
        )
    }
}
