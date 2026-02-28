import SwiftUI

struct FurnitureSponsorshipBannerView: View {
    struct BannerItem: Decodable, Identifiable {
        let id: String
        let image: String
        let actionUrl: String?
    }

    let items: [BannerItem]

    var body: some View {
        if let banner = items.first {
            Button(action: {
                if let action = banner.actionUrl {
                    AppLogger.debug("Navigate to: \(action)")
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
                    .frame(height: 110)
                    .cornerRadius(16)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
