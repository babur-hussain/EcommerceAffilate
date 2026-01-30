import SwiftUI

enum MainTab: String, CaseIterable {
    case home = "Home"
    case categories = "Categories"
    case cart = "Cart"
    case account = "Account"
}

struct TabBarView: View {
    @Binding var currentTab: MainTab
    var cartCount: Int = 0

    var body: some View {
        HStack(spacing: 0) {
            ForEach(MainTab.allCases, id: \.self) { tab in
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.1)) {
                        currentTab = tab
                    }
                }) {
                    VStack(spacing: 4) {
                        ZStack {
                            Image(systemName: iconName(for: tab))
                                .font(.system(size: 24))
                                .foregroundColor(
                                    currentTab == tab
                                        ? Color(hex: "#2874F0") : Color(hex: "#878787"))

                            if tab == .cart && cartCount > 0 {
                                Text("\(cartCount)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(4)
                                    .background(Color.red)
                                    .clipShape(Circle())
                                    .offset(x: 10, y: -10)
                            }
                        }

                        Text(tab.rawValue)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(
                                currentTab == tab ? Color(hex: "#2874F0") : Color(hex: "#878787"))
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(.top, 8)
        .padding(.bottom, 28)  // Bottom safe area approximation or padding
        .background(Color.white)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(hex: "#E0E0E0")),
            alignment: .top
        )
    }

    private func iconName(for tab: MainTab) -> String {
        switch tab {
        case .home: return "house.fill"
        case .categories: return "square.grid.2x2.fill"  // "grid-view" in RN -> square.grid.2x2 in SF Symbols
        case .cart: return "cart.fill"
        case .account: return "person.fill"
        }
    }
}
