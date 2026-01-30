import SwiftUI

struct FurnitureSamarthStoreView: View {
    struct BannerItem: Decodable, Identifiable {
        let id: String
        let image: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [BannerItem]

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

            // Banner
            if let banner = items.first {
                Button(action: {
                    if let action = banner.actionUrl {
                        print("Navigate to: \(action)")
                    }
                }) {
                    if let url = URL(string: banner.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color(hex: "#f0f0f0")
                        }
                        .frame(height: 100)
                        .cornerRadius(12)
                        .clipped()
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 24)
    }
}
