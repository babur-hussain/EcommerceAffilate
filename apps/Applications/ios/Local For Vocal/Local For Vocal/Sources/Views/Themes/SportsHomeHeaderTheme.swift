// JSON slug: sports-header-theme
// Page slug: sports
import SwiftUI

struct SportsHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct SportsThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "sports-header-theme",
            pageSlug: "sports"
        )
    }
}
