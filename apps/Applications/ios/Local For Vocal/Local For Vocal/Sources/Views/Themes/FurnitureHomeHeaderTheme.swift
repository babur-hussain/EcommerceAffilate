// JSON slug: furniture-header-theme
// Page slug: furniture
import SwiftUI

struct FurnitureHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct FurnitureThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "furniture-header-theme",
            pageSlug: "furniture"
        )
    }
}
