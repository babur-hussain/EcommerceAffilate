import SwiftUI

struct GroceryEventsComponent: View {
    let component: SDUIComponent
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            if let title = component.prop(for: "title") as String? {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .padding(.horizontal, 16)
            }

            // Horizontal Scroll List
            // Fix #8: Use screen width instead of GeometryReader (avoids two-pass layout in ScrollView)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    let items = component.decodeItems(for: "items", as: [GroceryEventItem].self)

                    // Card Width: 75% of screen
                    let cardWidth = UIScreen.main.bounds.width * 0.75

                    ForEach(items, id: \.self) { item in
                        GroceryEventCardView(item: item, width: cardWidth)
                    }
                }
                .padding(.horizontal, 16)
            }
            .frame(height: 420)
        }
        .padding(.vertical, 24)
    }
}

struct GroceryEventCardView: View {
    let item: GroceryEventItem
    let width: CGFloat
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        Button(action: {
            if let actionUrl = item.actionUrl {
                navigationManager.navigate(to: actionUrl)
            }
        }) {
            VStack(spacing: 0) {
                // Top Image Section
                ZStack(alignment: .topLeading) {
                    // Background for image area (in case of fit)
                    Color(hex: "#F3F4F6")

                    CachedAsyncImage(url: URL(string: item.imageUrl)) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fill)  // Use fill to cover full container
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(width: width, height: 320)  // Increased height to 320
                    .clipped()

                    // Badge (Optional)
                    if let badgeUrl = item.badgeUrl {
                        CachedAsyncImage(url: URL(string: badgeUrl)) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Color.clear
                        }
                        .frame(width: 60, height: 30)
                        .padding(.top, 12)
                        .padding(.leading, 12)
                    }
                }
                .frame(height: 320)  // Explicit frame for ZStack

                // Bottom Content Section
                VStack(alignment: .leading, spacing: 4) {
                    if let subtitle = item.subtitle {
                        Text(subtitle)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(.white.opacity(0.9))
                    }

                    if let title = item.title {
                        Text(title)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(2)
                    }
                }
                .padding(16)
                .frame(width: width, alignment: .leading)
                .background(Color(hex: item.backgroundColor ?? "#8B5CF6"))
            }
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.1), radius: 6, x: 0, y: 3)
        }
        .buttonStyle(PlainButtonStyle())
        .frame(width: width)  // Enforce width on button container
    }
}

struct GroceryEventItem: Codable, Hashable {
    let title: String?
    let subtitle: String?
    let imageUrl: String
    let badgeUrl: String?
    let backgroundColor: String?
    let actionUrl: String?
}
