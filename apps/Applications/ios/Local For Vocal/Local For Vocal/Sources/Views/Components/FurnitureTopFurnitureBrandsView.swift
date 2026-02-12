import SwiftUI

struct FurnitureTopFurnitureBrandsView: View {
    let title: String
    let headerActionUrl: String?
    let items: [FBrandGridItem]

    init(title: String, headerActionUrl: String?, items: [FBrandGridItem]) {
        self.title = title
        self.headerActionUrl = headerActionUrl
        self.items = items
    }

    let columns = [
        GridItem(.flexible(), spacing: 12),
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
                        print("Navigate to: \(action)")
                    }) {
                        Image(systemName: "chevron.right")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Grid
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(items) { item in
                    BrandGridCard(item: item)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct BrandGridCard: View {
    let item: FBrandGridItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            ZStack {
                if item.isViewAll == true {
                    VStack(spacing: 8) {
                        Text("View all")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.black)

                        Circle()
                            .fill(Color.black)
                            .frame(width: 24, height: 24)
                            .overlay(
                                Image(systemName: "arrow.right")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                            )
                    }
                } else if let logoUrl = item.logo, let url = URL(string: logoUrl) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .padding(12)
                }
            }
            .aspectRatio(1, contentMode: .fit)  // Making it square based on available width
            .background(Color(hex: "#FFF9C4"))
            .cornerRadius(12)
        }
    }
}

struct FBrandGridItem: Decodable, Identifiable {
    let id: String
    let logo: String?
    let isViewAll: Bool?
    let actionUrl: String?
}
