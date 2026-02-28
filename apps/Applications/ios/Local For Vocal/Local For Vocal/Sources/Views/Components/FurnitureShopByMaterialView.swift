import SwiftUI

struct FurnitureShopByMaterialView: View {
    struct MaterialItem: Decodable, Identifiable {
        let id: String
        let name: String
        let image: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [MaterialItem]

    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                if let action = headerActionUrl {
                    Spacer()
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Image(systemName: "chevron.right")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Grid
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(items) { item in
                    MaterialCard(item: item)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct MaterialCard: View {
    let item: FurnitureShopByMaterialView.MaterialItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(height: 150)
                    .clipped()
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.1))
                        .frame(height: 150)
                }

                // Footer
                VStack {
                    Text(item.name)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.black)
                        .lineLimit(1)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(Color.white)
            }
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}
