import SwiftUI

struct GroceryDealsComponent: View {
    let component: SDUIComponent
    @EnvironmentObject var navigationManager: NavigationManager

    // Fix #8: Calculate width from screen bounds instead of GeometryReader (avoids two-pass layout in ScrollView)
    private var containerWidth: CGFloat {
        UIScreen.main.bounds.width - 32 // 16pt padding on each side
    }

    var body: some View {
        if let backgroundImage = component.prop(for: "backgroundImage") as String? {
            ZStack {
                // Background Image
                CachedAsyncImage(url: URL(string: backgroundImage)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: containerWidth, height: 400)
                        .clipped()
                } placeholder: {
                    Color.gray.opacity(0.1)
                }
                .frame(width: containerWidth, height: 400)

                // Content
                VStack(spacing: 0) {
                    Spacer()

                    // Cards Row
                    let spacing: CGFloat = 10
                    let horizontalPadding: CGFloat = 10
                    let totalSpacing = (spacing * 2) + (horizontalPadding * 2)
                    let cardWidth = (containerWidth - totalSpacing) / 3

                    HStack(spacing: spacing) {
                        let items = component.decodeItems(
                            for: "items", as: [GroceryDealItem].self)

                        ForEach(items.prefix(3), id: \.self) { item in
                            GroceryDealCardView(item: item)
                                .frame(width: cardWidth, height: 130)
                        }
                    }
                    .padding(.horizontal, horizontalPadding)
                    .padding(.bottom, 4)

                    // Explore More Button
                    if let exploreUrl = component.prop(for: "exploreUrl") as String? {
                        Button(action: {
                            navigationManager.navigate(to: exploreUrl)
                        }) {
                            HStack(spacing: 8) {
                                Text("Explore more")
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(.white)

                                Image(systemName: "arrow.right.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                            }
                        }
                        .padding(.bottom, 20)
                    }
                }
                .frame(width: containerWidth)
            }
            .frame(width: containerWidth, height: 400)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .frame(height: 400)
            .padding(.horizontal, 16)
            .padding(.top, 24)
            .padding(.bottom, 8)
        }
    }
}

struct GroceryDealCardView: View {
    let item: GroceryDealItem
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        Button(action: {
            if let actionUrl = item.actionUrl {
                navigationManager.navigate(to: actionUrl)
            }
        }) {
            VStack(spacing: 0) {
                // Title at the Top
                Text(item.title ?? "")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.black)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                    .padding(.top, 12)
                    .padding(.bottom, 8)
                    .padding(.horizontal, 4)

                // Product Image
                CachedAsyncImage(url: URL(string: item.imageUrl)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color.gray.opacity(0.1)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .clipped()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// Data Model
struct GroceryDealItem: Codable, Hashable {
    let title: String?
    let imageUrl: String
    let actionUrl: String?
}
