// JSON slug: beauty-header-theme
// Page slug: beauty
import SwiftUI

struct BeautyHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct BeautyThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "beauty-header-theme",
            pageSlug: "beauty",
            defaultGradientColors: [
                Color(hex: "#E91E63"), Color(hex: "#AD1457"), Color(hex: "#880E4F"),
            ]
        )
    }
}
