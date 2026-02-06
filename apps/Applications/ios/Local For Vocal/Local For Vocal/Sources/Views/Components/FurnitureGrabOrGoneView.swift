import SwiftUI

struct FurnitureGrabOrGoneView: View {
    struct GrabItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let price: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [GrabItem]

    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Container with background color
            ZStack {
                Color(hex: "#FFCCBC")

                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text(title)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.black)

                        if let action = headerActionUrl {
                            Spacer()
                            Button(action: {
                                print("Navigate to: \(action)")
                            }) {
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.black)
                            }
                        }
                    }

                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(items) { item in
                            GrabCard(item: item)
                        }
                    }
                }
                .padding(16)
            }
            .cornerRadius(16)
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct GrabCard: View {
    let item: FurnitureGrabOrGoneView.GrabItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            VStack(alignment: .leading, spacing: 8) {
                // Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                    .frame(height: 120)
                    .clipped()
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.1))
                        .frame(height: 120)
                }

                // Content
                VStack(alignment: .leading, spacing: 4) {
                    Text(item.title)
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                        .lineLimit(1)

                    Text(item.price)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.black)
                }
                .padding(.horizontal, 8)
                .padding(.bottom, 8)
            }
            .background(Color.white)
            .cornerRadius(12)
        }
    }
}
