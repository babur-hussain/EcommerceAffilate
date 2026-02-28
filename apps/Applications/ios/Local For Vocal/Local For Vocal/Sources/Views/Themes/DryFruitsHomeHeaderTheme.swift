// JSON slug: dry-fruits-header-theme
// Page slug: dry-fruits
import SwiftUI

struct DryFruitsHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct DryFruitsThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "dry-fruits-header-theme",
            pageSlug: "dry-fruits"
        )
    }
}
