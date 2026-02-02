import SwiftUI

struct LumiereSectionView: View {
    let component: SDUIComponent

    // Properties
    private var sectionTitle: String { component.prop(for: "section_title") ?? "" }
    private var sectionSubtitle: String { component.prop(for: "section_subtitle") ?? "" }
    private var linkText: String { component.prop(for: "link_text") ?? "View All" }
    private var backgroundColorHex: String { component.prop(for: "background_color") ?? "#FFFFFF" }

    private var items: [LumiereProduct] {
        if let itemsValue = component.props?["items"]?.value,
            let data = try? JSONSerialization.data(withJSONObject: itemsValue),
            let decoded = try? JSONDecoder().decode([LumiereProduct].self, from: data)
        {
            return decoded
        }
        return []
    }

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 24) {
                // Header
                HStack(alignment: .bottom) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(sectionTitle)
                            .font(.custom("PlayfairDisplay-Bold", size: 24))
                            .foregroundColor(Color(hex: "111827"))

                        Text(sectionSubtitle)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    Button(action: {
                        // View All Action
                    }) {
                        Text(linkText)
                            .font(.system(size: 12, weight: .bold))
                            .textCase(.uppercase)
                            .tracking(1)
                            .foregroundColor(Color(hex: "6D28D9"))
                    }
                }

                // Grid
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(items, id: \.id) { item in
                        LumiereProductCard(item: item)
                    }
                }
            }
            .padding(24)
            .background(Color(hex: backgroundColorHex))
            .cornerRadius(24)
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }
}

struct LumiereProduct: Identifiable, Decodable {
    let id: String
    let title: String
    let subtitle: String
    let price: String
    let original_price: String?
    let image_url: String
    let badge: String?
    let price_color: String?

    enum CodingKeys: String, CodingKey {
        case id, title, subtitle, price, original_price, image_url, badge, price_color
    }
}

struct LumiereProductCard: View {
    let item: LumiereProduct

    var body: some View {
        Button(action: {
            // Navigate to product
        }) {
            VStack(alignment: .leading, spacing: 0) {
                // Image Container
                ZStack(alignment: .topLeading) {
                    AsyncImage(url: URL(string: item.image_url)) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } else {
                            Color(hex: "F9FAFB")
                        }
                    }
                    .frame(width: 155, height: 155)  // Approximation based on column width
                    .clipped()

                    // Badge
                    if let badge = item.badge {
                        Text(badge)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(
                                badge.contains("%") ? Color(hex: "15803D") : Color(hex: "D946EF")
                            )
                            .cornerRadius(999)
                            .padding(8)
                    }

                    // Add Button (Visual only for now)
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            Image(systemName: "plus")
                                .font(.system(size: 12))
                                .padding(6)
                                .background(Color.white.opacity(0.9))
                                .clipShape(Circle())
                                .shadow(radius: 1)
                        }
                    }
                    .padding(8)
                }
                .cornerRadius(12)
                .padding(.bottom, 12)

                Text(item.title)
                    .font(.custom("PlayfairDisplay-SemiBold", size: 16))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)
                    .padding(.bottom, 2)

                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .lineLimit(1)
                    .padding(.bottom, 8)

                HStack(spacing: 8) {
                    Text(item.price)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(
                            Color(
                                hex: item.price_color?.replacingOccurrences(of: "text-", with: "")
                                    ?? "6D28D9"))  // Fallback handling for tailwind classes if passed directly

                    if let originalPrice = item.original_price {
                        Text(originalPrice)
                            .font(.system(size: 12))
                            .strikethrough()
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        }
    }
}

// Helper extension for Hex colors if not already present
