import SwiftUI
import UIKit

struct BeautifulImageSliderView: View {
    // Props
    var title: String?
    var banners: [BannerData] = []

    struct BannerData: Decodable, Identifiable {
        let id: String
        let image: String
        let actionUrl: String?

        enum CodingKeys: String, CodingKey {
            case id, _id, image, imageUrl, image_url, actionUrl, action_url
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)

            if let idVal = try? container.decode(String.self, forKey: .id) {
                self.id = idVal
            } else if let idVal = try? container.decode(String.self, forKey: ._id) {
                self.id = idVal
            } else {
                self.id = UUID().uuidString
            }

            if let img = try? container.decode(String.self, forKey: .image) {
                self.image = img
            } else if let img = try? container.decode(String.self, forKey: .imageUrl) {
                self.image = img
            } else {
                self.image = try container.decodeIfPresent(String.self, forKey: .image_url) ?? ""
            }

            if let url = try? container.decode(String.self, forKey: .actionUrl) {
                self.actionUrl = url
            } else {
                self.actionUrl = try? container.decode(String.self, forKey: .action_url)
            }
        }
    }

    @EnvironmentObject var navigationManager: NavigationManager

    // Calculate size maintaining 1080x1350px (4:5 ratio)
    // Card width is 75% of screen width so the next image peeks
    let cardWidth: CGFloat = UIScreen.main.bounds.width * 0.75
    var cardHeight: CGFloat { cardWidth * (1350.0 / 1080.0) }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let title = title, !title.isEmpty {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .padding(.horizontal, 16)
            }

            if #available(iOS 17.0, *) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(banners) { banner in
                            cardView(for: banner)
                        }
                    }
                    .padding(.horizontal, 16)
                    // Bottom and Top padding to ensure shadow isn't clipped
                    .padding(.top, 4)
                    .padding(.bottom, 20)
                    .scrollTargetLayout()
                }
                .scrollTargetBehavior(.viewAligned(limitBehavior: .always))
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(banners) { banner in
                            cardView(for: banner)
                        }
                    }
                    .padding(.horizontal, 16)
                    // Bottom and Top padding to ensure shadow isn't clipped
                    .padding(.top, 4)
                    .padding(.bottom, 20)
                }
            }
        }
        .padding(.top, 16)
        .padding(.bottom, 8)
        .background(Color.clear)
    }

    @ViewBuilder
    private func cardView(for banner: BannerData) -> some View {
        Button(action: {
            if let url = banner.actionUrl, !url.isEmpty {
                navigationManager.navigate(to: url)
            }
        }) {
            ZStack {
                Color.clear  // Transparent placeholder

                if let imageUrl = URL(string: banner.image) {
                    CachedAsyncImage(url: imageUrl) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        ProgressView()
                    }
                    .frame(width: cardWidth, height: cardHeight)
                    .clipped()
                }
            }
            .frame(width: cardWidth, height: cardHeight)
            .cornerRadius(16)
            // Clean rounded corners for the images
        }
        .buttonStyle(PlainButtonStyle())
    }
}
