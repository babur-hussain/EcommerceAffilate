// JSON slug: fashion-header-theme
// Page slug: fashion
import SwiftUI

struct FashionHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct FashionThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "fashion-header-theme",
            pageSlug: "fashion",
            defaultGradientColors: [
                Color(hex: "#D4145A"), Color(hex: "#FBB03B"), Color(hex: "#D4145A"),
            ]
        )
    }
}
