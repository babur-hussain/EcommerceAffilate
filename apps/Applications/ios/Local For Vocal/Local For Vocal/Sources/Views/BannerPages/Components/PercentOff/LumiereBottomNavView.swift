import SwiftUI

struct LumiereBottomNavView: View {
    var body: some View {
        VStack(spacing: 0) {
            Divider()
                .background(Color(hex: "F3F4F6"))

            HStack(spacing: 0) {
                NavItem(icon: "house.fill", label: "Home", isSelected: true, color: "6D28D9")
                NavItem(icon: "square.grid.2x2", label: "Catalog")
                NavItem(icon: "heart", label: "Wishlist")
                NavItem(icon: "person", label: "Profile")
            }
            .background(Color.white.opacity(0.95))
            .padding(.bottom, 34)  // Safe area approximation if not using Safe Area
            .padding(.top, 12)
        }
        .frame(maxWidth: .infinity)
    }
}

struct NavItem: View {
    let icon: String
    let label: String
    var isSelected: Bool = false
    var color: String = "9CA3AF"

    var body: some View {
        Button(action: {
            // Navigation action
        }) {
            VStack(spacing: 2) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(Color(hex: color))

                Text(label)
                    .font(.system(size: 10))
                    .fontWeight(isSelected ? .bold : .regular)
                    .foregroundColor(Color(hex: color))
            }
            .frame(maxWidth: .infinity)
        }
    }
}
