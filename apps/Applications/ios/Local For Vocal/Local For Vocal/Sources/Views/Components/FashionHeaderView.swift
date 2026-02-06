import SwiftUI

struct FashionHeaderView: View {
    let component: SDUIComponent

    // Custom Colors matching React Native implementation
    private let primaryColor = Color(hex: "#376F7C")  // Muted Teal
    private let secondaryColor = Color(hex: "#D8B08C")  // Muted Rose Gold
    private let backgroundLight = Color(hex: "#FAF7F2")  // Soft Ivory
    private let surfaceLight = Color(hex: "#F2EDE5")  // Off-White
    private let textMain = Color(hex: "#22252a")
    private let white = Color.white

    // Fallback categories if none provided in props
    private let defaultCategories = ["Western", "Ethnic", "Luxe", "Accessories", "Activewear"]

    var body: some View {
        VStack(spacing: 0) {
            // Top Search Header
            HStack(spacing: 12) {
                // Menu Button
                Button(action: {
                    // Menu Action
                }) {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 24))
                        .foregroundColor(textMain)
                        .frame(width: 40, height: 40)
                        .background(white)
                        .clipShape(Circle())
                        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                }

                // Search Bar
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 20))
                        .foregroundColor(primaryColor)

                    Text("Search designers, styles...")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(Color(hex: "#6c7c7f"))  // textMuted

                    Spacer()
                }
                .padding(.horizontal, 16)
                .frame(height: 48)
                .background(white)
                .cornerRadius(24)
                .shadow(color: primaryColor.opacity(0.05), radius: 20, x: 0, y: 4)

                // Notification Button
                Button(action: {
                    // Notification Action
                }) {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bell")
                            .font(.system(size: 24))
                            .foregroundColor(textMain)

                        Circle()
                            .fill(secondaryColor)
                            .frame(width: 8, height: 8)
                            .overlay(Circle().stroke(white, lineWidth: 1))
                            .offset(x: 2, y: -2)
                    }
                    .frame(width: 40, height: 40)
                    .background(white)
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 12)

            // Horizontal Categories
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(categories.indices, id: \.self) { index in
                        let cat = categories[index]
                        let isSelected = index == 0

                        Text(cat)
                            .font(.system(size: 14, weight: isSelected ? .semibold : .medium))
                            .foregroundColor(isSelected ? white : textMain)
                            .tracking(isSelected ? 0.5 : 0)
                            .padding(.horizontal, 20)
                            .frame(height: 36)
                            .background(isSelected ? primaryColor : surfaceLight)
                            .cornerRadius(18)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 4)
            }
            .padding(.bottom, 8)
        }
        .background(backgroundLight.opacity(0.95))
    }

    private var categories: [String] {
        // Try to get categories from props, otherwise use default
        if let items = component.props?["categories"]?.value as? [String] {
            return items
        }
        return defaultCategories
    }
}
