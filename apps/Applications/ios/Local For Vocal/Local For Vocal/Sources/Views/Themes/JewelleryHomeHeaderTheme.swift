// JSON slug: jewellery-header-theme
// Page slug: jewellery
import SwiftUI

struct JewelleryHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct JewelleryThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "jewellery-header-theme",
            pageSlug: "jewellery"
        )
    }
}
