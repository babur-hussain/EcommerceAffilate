// JSON slug: books-header-theme
// Page slug: books
import SwiftUI

struct BooksHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(AnimatedFoundationView(isHeader: false))
    }
    var textColor: Color { .white }
}

public struct BooksThemePage: View {
    public init() {}
    public var body: some View {
        CategoryThemePage(
            headerSlug: "books-header-theme",
            pageSlug: "books",
            defaultGradientColors: [
                Color(hex: "#4A148C"), Color(hex: "#6A1B9A"), Color(hex: "#7B1FA2"),
            ]
        )
    }
}
