import SwiftUI

struct ShoppingForOthersHubView: View {
    // Props
    var title: String = "Shopping for others?"
    var subtitle: String = "Choose a category to start exploring"
    var categories: [CategoryItem] = []

    // Grid Setup
    // width: ITEM_WIDTH = (width - 48) / 2
    // We achieve this with flexible grid items and spacing
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    struct CategoryItem: Identifiable, Decodable {
        let id: String
        let name: String
        let slug: String
        let image: String
        let actionUrl: String?

        // Helper to conform to Identifiable if id is missing in JSON (unlikely if we structure it right)
        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {  // Reduced spacing
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))  // Slightly smaller title to match "short" vibe
                    .foregroundColor(Color(hex: "#111827"))

                Text(subtitle)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#6B7280"))
            }
            .padding(.horizontal, 16)

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(categories) { item in
                        ShoppingCategoryCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
        .background(Color(hex: "#F9FAFB"))
    }
}

struct ShoppingCategoryCard: View {
    let item: ShoppingForOthersHubView.CategoryItem

    var body: some View {
        Button(action: {
            print("Navigate to /fashion/collection/\(item.slug)")
        }) {
            VStack(spacing: 8) {
                // Image Container
                ZStack {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color(hex: "#E5E7EB")
                        }
                    } else {
                        Color(hex: "#E5E7EB")
                    }
                }
                .frame(width: 120, height: 120)  // Fixed smaller size
                .background(Color(hex: "#F3F4F6"))
                .cornerRadius(12)
                .clipped()

                // Title
                Text(item.name)
                    .font(.system(size: 13, weight: .semibold))  // Smaller font
                    .foregroundColor(Color(hex: "#111827"))
                    .lineLimit(1)
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 4)
                    .frame(width: 120)  // Match image width
            }
            .padding(8)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
        }
    }
}
