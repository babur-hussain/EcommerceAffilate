import SwiftUI

struct GroceryPromoCardsComponent: View {
    let component: SDUIComponent

    // Fix #8: Calculate width from screen bounds instead of GeometryReader
    private var containerWidth: CGFloat {
        UIScreen.main.bounds.width - 32  // 16pt padding on each side
    }

    var body: some View {
        if let backgroundImage = component.prop(for: "backgroundImage") as String? {
            ZStack {
                // Background Image
                CachedAsyncImage(url: URL(string: backgroundImage)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: containerWidth, height: 300)
                        .clipped()
                } placeholder: {
                    Color.gray.opacity(0.1)
                }
                .frame(width: containerWidth, height: 300)

                // Content Overlay
                VStack(spacing: 0) {
                    // Title
                    if let title = component.prop(for: "title") as String? {
                        Text(title)
                            .font(.system(size: 24, weight: .heavy))
                            .foregroundColor(.white)
                            .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)
                            .multilineTextAlignment(.center)
                            .padding(.top, 40)
                    }

                    Spacer()

                    // Cards
                    let spacing: CGFloat = 10
                    let horizontalPadding: CGFloat = 10
                    let totalSpacing = (spacing * 2) + (horizontalPadding * 2)
                    let cardWidth = (containerWidth - totalSpacing) / 3

                    HStack(spacing: spacing) {
                        let items = component.decodeItems(
                            for: "items", as: [GroceryPromoCardItem].self)

                        ForEach(items.prefix(3), id: \.self) { item in
                            GroceryPromoCardView(item: item)
                                .frame(width: cardWidth)
                        }
                    }
                    .padding(.horizontal, horizontalPadding)
                    .padding(.bottom, 20)
                }
                .frame(width: containerWidth)
            }
            .frame(width: containerWidth, height: 300)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .frame(height: 300)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
    }
}

struct GroceryPromoCardView: View {
    let item: GroceryPromoCardItem
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        Button(action: {
            if let actionUrl = item.actionUrl {
                navigationManager.navigate(to: actionUrl)
            }
        }) {
            VStack(spacing: 0) {
                // Card Image
                CachedAsyncImage(url: URL(string: item.imageUrl)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                } placeholder: {
                    Color.white
                }
                .frame(height: 120)
                .clipped()

                // Title
                if let title = item.title {
                    Text(title)
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.black)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .padding(.horizontal, 4)
                        .padding(.vertical, 6)
                        .frame(maxWidth: .infinity)
                        .background(Color.white)
                }
            }
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct GroceryPromoCardItem: Codable, Hashable {
    let title: String?
    let imageUrl: String
    let actionUrl: String?
}
