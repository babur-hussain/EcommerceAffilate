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
            NavigationView {
                GroceryPageView(activeTab: $activeTab)
                    .navigationBarHidden(true)
            }
            .navigationViewStyle(.stack)
            .tabItem {
                Image(systemName: "house")
                Text("Grocery")
            }
            .tag(GroceryTab.grocery)

            // Categories Tab
            NavigationView {
                GroceryCategoryPageView()
                    .navigationBarHidden(true)
            }
            .navigationViewStyle(.stack)
            .tabItem {
                Image(systemName: "square.grid.2x2")
                Text("Categories")
            }
            .tag(GroceryTab.categories)

            // Top Picks Tab
            NavigationView {
                GroceryTopPicksView()
                    .navigationBarHidden(true)
            }
            .navigationViewStyle(.stack)
            .tabItem {
                Image(systemName: "star")
                Text("Top Picks")
            }
            .tag(GroceryTab.topPicks)

            // Basket Tab
            NavigationView {
                BasketPageView(groceryTab: $currentTab)
                    .navigationBarHidden(true)
            }
            .navigationViewStyle(.stack)
            .tabItem {
                Image(systemName: "basket")
                Text("Basket")
            }
            .badge(basketManager.basketCount)
            .tag(GroceryTab.basket)
        }
        .accentColor(Color(hex: "#2874F0"))  // Same blue theme as homepage
    }
}
