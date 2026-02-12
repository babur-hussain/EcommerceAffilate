import SwiftUI

extension SDUIComponentView {

    @ViewBuilder
    func renderGroceryTopPicks() -> some View {
        GroceryTopPicksSection(component: component)
    }

    @ViewBuilder
    func renderGroceryPromoCards() -> some View {
        GroceryPromoCardsComponent(component: component)
    }

    @ViewBuilder
    func renderGroceryDeals() -> some View {
        GroceryDealsComponent(component: component)
    }

    @ViewBuilder
    func renderGroceryEvents() -> some View {
        GroceryEventsComponent(component: component)
    }

    @ViewBuilder
    func renderGroceryShopByCategory() -> some View {
        GroceryShopByCategoryComponent(component: component)
    }

    // Add other grocery renderers here as needed
}
