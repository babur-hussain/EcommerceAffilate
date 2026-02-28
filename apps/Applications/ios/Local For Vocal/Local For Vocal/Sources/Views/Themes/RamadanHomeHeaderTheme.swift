// JSON slug: ramadan-header-theme
// Page slug: ramadan
import SwiftUI

struct RamadanHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct RamadanPage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "ramadan-header-theme",
            pageSlug: "ramadan-slider-theme"
        )
    }
}
