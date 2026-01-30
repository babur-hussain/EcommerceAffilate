import SwiftUI

struct FurnitureEverybodyListView: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.props?["title"]?.value as? String ?? "On everybody's list"

        // Manual parsing from props
        let items: [EverybodyItem] = {
            if let itemsList = component.props?["items"]?.value as? [[String: Any]] {
                return itemsList.map { dict in
                    EverybodyItem(
                        title: dict["title"] as? String ?? "",
                        subtitle: dict["subtitle"] as? String ?? "",
                        image: dict["image"] as? String ?? "",
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            if let arrayAny = component.props?["items"]?.value as? [Any] {
                return arrayAny.compactMap { item -> EverybodyItem? in
                    guard let dict = item as? [String: Any] else { return nil }
                    return EverybodyItem(
                        title: dict["title"] as? String ?? "",
                        subtitle: dict["subtitle"] as? String ?? "",
                        image: dict["image"] as? String ?? "",
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            return []
        }()

        if !items.isEmpty {
            VStack(alignment: .leading, spacing: 16) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.black)

                LazyVGrid(
                    columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16),
                    ], spacing: 16
                ) {
                    ForEach(items) { item in
                        NavigationLink(destination: destinationView(for: item.actionUrl)) {
                            VStack(alignment: .leading, spacing: 0) {
                                if !item.image.isEmpty {
                                    AsyncImage(url: URL(string: item.image)) { phase in
                                        switch phase {
                                        case .empty:
                                            Color.gray.opacity(0.1)
                                        case .success(let image):
                                            image
                                                .resizable()
                                                .scaledToFill()
                                        case .failure:
                                            Color.gray.opacity(0.1)
                                        @unknown default:
                                            Color.gray.opacity(0.1)
                                        }
                                    }
                                    .frame(height: 140)
                                    .clipped()
                                }

                                VStack(alignment: .leading, spacing: 4) {
                                    Text(item.title)
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "666666"))
                                        .lineLimit(1)

                                    Text(item.subtitle)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.black)
                                }
                                .padding(8)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            }
                            .background(Color.white)
                            .cornerRadius(12)
                            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                        }
                    }
                }
            }
            .padding(16)
            .background(Color(hex: "FFCCBC"))  // Peach/Orange background
            .cornerRadius(16)
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }

    private func destinationView(for action: String?) -> some View {
        Text("Product Details")
    }
}

private struct EverybodyItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let image: String
    let actionUrl: String?
}
