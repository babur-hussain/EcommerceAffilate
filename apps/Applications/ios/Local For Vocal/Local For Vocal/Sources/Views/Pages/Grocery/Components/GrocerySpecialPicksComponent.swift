import SwiftUI

struct GrocerySpecialPicksComponent: View {
    let component: SDUIComponent
    @StateObject private var viewModel = SDUIComponentViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            if let title = component.prop(for: "title") as String? {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .padding(.horizontal, 16)
            } else {
                Text("Special picks for you")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .padding(.horizontal, 16)
            }

            // Horizontal Scroll List
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    if let items = viewModel.data as? [SpecialPickItem], !items.isEmpty {
                        ForEach(items, id: \.self) { item in
                            Button(action: {
                                if let actionUrl = item.actionUrl {
                                    // TODO: Navigate using NavigationManager
                                    // For now, we'll just print or rely on a parent to handle it if passed down
                                    // ideally we use EnvironmentObject which we will add below
                                    NotificationCenter.default.post(
                                        name: NSNotification.Name("NavigateToUrl"),
                                        object: nil,
                                        userInfo: ["url": actionUrl]
                                    )
                                }
                            }) {
                                CachedAsyncImage(url: URL(string: item.image)) { image in
                                    image.resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Color.gray.opacity(0.1)
                                }
                                .frame(width: 280, height: 160)
                                .clipShape(RoundedRectangle(cornerRadius: 16))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                                )
                                // Add a subtle shadow for "beautiful" effect
                                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    } else if viewModel.isLoading {
                        ForEach(0..<2, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.gray.opacity(0.1))
                                .frame(width: 280, height: 160)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)  // Space for shadow
            }
        }
        .padding(.top, 24)
        .padding(.bottom, 16)
        .onAppear {
            viewModel.decodeItems(from: component, type: SpecialPickItem.self)
        }
    }
}

struct SpecialPickItem: Codable, Hashable {
    let id: String?
    let image: String
    let actionUrl: String?
    let title: String?
    let subtitle: String?

    // Helper to decode from different JSON keys if needed
    enum CodingKeys: String, CodingKey {
        case id, _id
        case image, image_url, imageUrl
        case actionUrl, action_url
        case title, subtitle
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id =
            try? container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decodeIfPresent(String.self, forKey: ._id)

        // Handle image variants
        if let img = try? container.decode(String.self, forKey: .image) {
            self.image = img
        } else if let img = try? container.decode(String.self, forKey: .image_url) {
            self.image = img
        } else {
            self.image = try container.decode(String.self, forKey: .imageUrl)
        }

        self.actionUrl =
            try? container.decodeIfPresent(String.self, forKey: .actionUrl)
            ?? container.decodeIfPresent(String.self, forKey: .action_url)
        self.title = try? container.decodeIfPresent(String.self, forKey: .title)
        self.subtitle = try? container.decodeIfPresent(String.self, forKey: .subtitle)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(id, forKey: .id)
        try container.encode(image, forKey: .image)
        try container.encodeIfPresent(actionUrl, forKey: .actionUrl)
        try container.encodeIfPresent(title, forKey: .title)
        try container.encodeIfPresent(subtitle, forKey: .subtitle)
    }

    // Manual init for preview/testing
    init(
        id: String = UUID().uuidString, image: String, actionUrl: String? = nil,
        title: String? = nil, subtitle: String? = nil
    ) {
        self.id = id
        self.image = image
        self.actionUrl = actionUrl
        self.title = title
        self.subtitle = subtitle
    }
}
