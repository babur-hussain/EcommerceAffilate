// JSON slug: mobiles-header-theme
// Page slug: mobiles
import SwiftUI

struct MobilesHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct MobilesThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "mobiles-header-theme",
            pageSlug: "mobiles"
        )
    }
}
