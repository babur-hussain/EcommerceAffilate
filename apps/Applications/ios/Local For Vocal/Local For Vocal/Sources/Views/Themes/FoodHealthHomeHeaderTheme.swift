// JSON slug: food-health-header-theme
// Page slug: food-health
import SwiftUI

struct FoodHealthHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct FoodHealthThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "food-health-header-theme",
            pageSlug: "food-health",
            defaultGradientColors: [
                Color(hex: "#2E7D32"), Color(hex: "#388E3C"), Color(hex: "#43A047"),
            ]
        )
    }
}
