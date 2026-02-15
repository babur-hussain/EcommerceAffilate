// JSON slug: appliances-header-theme
// Page slug: appliances
import SwiftUI

struct AppliancesHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct AppliancesThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "appliances-header-theme",
            pageSlug: "appliances",
            defaultGradientColors: [
                Color(hex: "#37474F"), Color(hex: "#455A64"), Color(hex: "#546E7A"),
            ]
        )
    }
}
