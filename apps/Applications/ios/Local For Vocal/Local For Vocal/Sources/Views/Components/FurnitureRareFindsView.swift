import SwiftUI

struct FurnitureRareFindsView: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.props?["title"]?.value as? String ?? "Betul's rare finds"
        let headerActionUrl = component.props?["headerActionUrl"]?.value as? String

        // Manual parsing
        let items: [RareFindItem] = {
            if let itemsList = component.props?["items"]?.value as? [[String: Any]] {
                return itemsList.map { dict in
                    RareFindItem(
                        title: dict["title"] as? String ?? "",
                        image: dict["image"] as? String ?? "",
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            if let arrayAny = component.props?["items"]?.value as? [Any] {
                return arrayAny.compactMap { item -> RareFindItem? in
                    guard let dict = item as? [String: Any] else { return nil }
                    return RareFindItem(
                        title: dict["title"] as? String ?? "",
                        image: dict["image"] as? String ?? "",
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            return []
        }()

        if !items.isEmpty {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                HStack {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.black)
                    Spacer()
                    if let action = headerActionUrl {
                        Button(action: { AppLogger.debug("Navigate to \(action)") }) {
                            Image(systemName: "chevron.right")
                                .foregroundColor(.black)
                        }
                    }
                }
                .padding(.horizontal, 16)

                // Horizontal Scroll
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(items) { item in
                            RareFindCard(item: item)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
            .padding(.bottom, 24)
        }
    }
}

struct RareFindCard: View {
    let item: RareFindItem

    var body: some View {
        NavigationLink(destination: Text("Product: \(item.title)")) {
            ZStack(alignment: .bottom) {
                // Background Image
                AsyncImage(url: URL(string: item.image)) { phase in
                    if let image = phase.image {
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } else {
                        Color.gray.opacity(0.1)
                    }
                }
                .frame(width: 280, height: 280)
                .clipped()

                // Label Container
                Text(item.title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.black)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 12)
                    .background(Color.white.opacity(0.85))
                    .cornerRadius(24)
                    .padding(.bottom, 24)
            }
            .frame(width: 280, height: 280)
            .cornerRadius(24)
            .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

struct RareFindItem: Identifiable {
    let id = UUID()
    let title: String
    let image: String
    let actionUrl: String?
}
