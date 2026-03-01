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
        let slug: String?
        let image: String?
        let imageUrl: String?  // Alternative key name
        let actionUrl: String?

        // Computed property to get the best available image
        var displayImage: String {
            image ?? imageUrl ?? ""
        }

        var safeSlug: String {
            slug ?? id
        }

        enum CodingKeys: String, CodingKey {
            case id, name, slug, image, imageUrl, actionUrl
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)

            // Robust ID decoding (Int or String)
            if let idInt = try? container.decode(Int.self, forKey: .id) {
                self.id = String(idInt)
            } else if let idString = try? container.decode(String.self, forKey: .id) {
                self.id = idString
            } else {
                self.id = UUID().uuidString
            }

            self.name = try container.decodeIfPresent(String.self, forKey: .name) ?? ""
            self.slug = try container.decodeIfPresent(String.self, forKey: .slug)
            self.image = try container.decodeIfPresent(String.self, forKey: .image)
            self.imageUrl = try container.decodeIfPresent(String.self, forKey: .imageUrl)
            self.actionUrl = try container.decodeIfPresent(String.self, forKey: .actionUrl)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                if !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#6B7280"))
                }
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
        .background(Color.clear)
    }
}

struct ShoppingCategoryCard: View {
    let item: ShoppingForOthersHubView.CategoryItem

    var body: some View {
        NavigationLink(destination: destinationView(for: item)) {
            VStack(spacing: 8) {
                // Image Container
                ZStack {
                    Color.clear

                    if !item.displayImage.isEmpty, let url = URL(string: item.displayImage) {
                        CachedAsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            ProgressView()
                        }
                        .frame(width: 110, height: 110)
                        .clipped()
                    } else {
                        Image(systemName: "photo")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                    }
                }
                .frame(width: 110, height: 110)
                .background(Color.clear)
                .cornerRadius(12)
                .clipped()

                // Title
                Text(item.name)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(1)
                    .multilineTextAlignment(.center)
                    .frame(width: 110)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }

    @ViewBuilder
    private func destinationView(for item: ShoppingForOthersHubView.CategoryItem) -> some View {
        // All pages are now SDUI-based as per latest requirement
        if NSClassFromString("Local_For_Vocal.SDUIPage") != nil {
            SDUIPage(slug: item.safeSlug)
        } else {
            // Fallback if class lookup fails (unlikely in same module)
            SDUIPage(slug: item.safeSlug)
        }
    }
}
