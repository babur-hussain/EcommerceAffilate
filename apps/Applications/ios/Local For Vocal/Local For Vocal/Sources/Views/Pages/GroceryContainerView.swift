import SwiftUI

// Grocery tab enum
enum GroceryTab: Int {
    case grocery
    case categories
    case topPicks
    case basket
}

/// Full-screen grocery container with its own NATIVE TabView footer.
/// Since the parent TabView's tab bar is hidden (via .toolbar(.hidden, for: .tabBar)),
/// this inner TabView provides the grocery-specific native footer.
struct GroceryContainerView: View {
    @Binding var activeTab: TabType
    @State private var currentTab: GroceryTab = .grocery
    @EnvironmentObject var basketManager: BasketManager

    var body: some View {
        TabView(selection: $currentTab) {
            // Grocery Tab (main grocery home)
            GroceryPageView(activeTab: $activeTab)
                .tabItem {
                    Image(systemName: "house")
                    Text("Grocery")
                }
                .tag(GroceryTab.grocery)

            // Categories Tab
            CategoriesPageView()
                .tabItem {
                    Image(systemName: "square.grid.2x2")
                    Text("Categories")
                }
                .tag(GroceryTab.categories)

            // Top Picks Tab
            SDUIPage(slug: "grocery-top-picks")
                .tabItem {
                    Image(systemName: "star")
                    Text("Top Picks")
                }
                .tag(GroceryTab.topPicks)

            // Basket Tab
            BasketPageView(groceryTab: $currentTab)
                .tabItem {
                    Image(systemName: "basket")
                    Text("Basket")
                }
                .tag(GroceryTab.basket)
        }
        .accentColor(Color(hex: "#2874F0"))  // Same blue theme as homepage
    }
}
