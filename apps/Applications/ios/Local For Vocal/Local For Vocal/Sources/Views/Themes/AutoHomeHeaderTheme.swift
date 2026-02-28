// JSON slug: auto-header-theme
// Page slug: auto
import SwiftUI

struct AutoHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct AutoThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "auto-header-theme",
            pageSlug: "auto"
        )
    }
}
