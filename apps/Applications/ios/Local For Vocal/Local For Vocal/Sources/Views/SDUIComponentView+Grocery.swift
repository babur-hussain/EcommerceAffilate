import SwiftUI

extension SDUIComponentView {

    @ViewBuilder
    func renderGroceryTopPicks() -> some View {
        GroceryTopPicksSection(component: component)
    }

    // Add other grocery renderers here as needed
}
