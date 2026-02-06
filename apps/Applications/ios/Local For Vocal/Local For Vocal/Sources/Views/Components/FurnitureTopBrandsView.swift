import SwiftUI

struct FurnitureTopBrandsView: View {
    let title: String
    let headerActionUrl: String?
    let items: [FBrandItem]

    init(title: String, headerActionUrl: String?, items: [FBrandItem]) {
        self.title = title
        self.headerActionUrl = headerActionUrl
        self.items = items
    }

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                // Gradient Background
                LinearGradient(
                    gradient: Gradient(colors: [Color(hex: "#FFF176"), Color(hex: "#FFD54F")]),
                    startPoint: .top,
                    endPoint: .bottom
                )

                VStack(alignment: .leading, spacing: 16) {
                    // Header
                    Button(action: {
                        if let action = headerActionUrl {
                            print("Navigate to: \(action)")
                        }
                    }) {
                        HStack(spacing: 8) {
                            Text("\(title) ›")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.black)

                            Text("🚀")
                                .font(.system(size: 20))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)

                    // Horizontal Scroll
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 16) {
                            ForEach(items) { item in
                                TopBrandOfferCard(item: item)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 16)
                    }
                }
            }
            .cornerRadius(16)
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct TopBrandOfferCard: View {
    let item: FBrandItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 8) {
                // Card Image Container
                ZStack(alignment: .bottom) {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .frame(width: 140, height: 180)
                        .clipped()
                    } else {
                        Rectangle()
                            .fill(Color.gray.opacity(0.1))
                            .frame(width: 140, height: 180)
                    }

                    // Logo Pill
                    ZStack {
                        Capsule()
                            .fill(Color.white)
                            .shadow(color: Color.black.opacity(0.2), radius: 2, x: 0, y: 1)

                        if let logoUrl = item.logo, let url = URL(string: logoUrl) {
                            AsyncImage(url: url) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                Color.clear
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                        } else if let name = item.brandName {
                            Text(name)
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.black)
                                .padding(.horizontal, 8)
                        }
                    }
                    .frame(height: 32)
                    .padding(.horizontal, 20)  // approximate 15% margin
                    .padding(.bottom, 12)
                }
                .cornerRadius(12)

                // Price
                Text(item.price)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.black)
            }
            .frame(width: 140)
        }
    }
}

struct FBrandItem: Decodable, Identifiable {
    let id: String
    let image: String
    let logo: String?
    let brandName: String?
    let price: String
    let actionUrl: String?
}
