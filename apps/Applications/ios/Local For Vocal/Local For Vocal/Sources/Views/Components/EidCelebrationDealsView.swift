import SwiftUI
import UIKit

struct EidCelebrationDealsView: View {
    // Props
    var title: String?
    var backgroundImage: String?
    var lanternsImage: String?  // e.g. "https://example.com/lanterns.png"
    var items: [DealItem] = []

    struct DealItem: Decodable, Identifiable {
        let id: String
        let image: String
        let actionUrl: String?
        let discountText: String?
        let title: String?
        let badgeText: String?
        let overlayIcon: String?

        enum CodingKeys: String, CodingKey {
            case id, _id, image, image_url, imageUrl, actionUrl, action_url, discountText, title,
                badgeText, overlayIcon
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)

            self.id =
                (try? container.decode(String.self, forKey: .id))
                ?? (try? container.decode(String.self, forKey: ._id)) ?? UUID().uuidString

            self.image =
                (try? container.decode(String.self, forKey: .image))
                ?? (try? container.decode(String.self, forKey: .imageUrl))
                ?? (try? container.decode(String.self, forKey: .image_url)) ?? ""

            self.actionUrl =
                (try? container.decodeIfPresent(String.self, forKey: .actionUrl))
                ?? (try? container.decodeIfPresent(String.self, forKey: .action_url))

            self.discountText = try? container.decodeIfPresent(String.self, forKey: .discountText)
            self.title = try? container.decodeIfPresent(String.self, forKey: .title)
            self.badgeText = try? container.decodeIfPresent(String.self, forKey: .badgeText)
            self.overlayIcon = try? container.decodeIfPresent(String.self, forKey: .overlayIcon)
        }
    }

    @EnvironmentObject var navigationManager: NavigationManager

    let cardWidth: CGFloat = UIScreen.main.bounds.width * 0.26  // Roughly 4 cards visible

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HStack(alignment: .top) {
                if let title = title, !title.isEmpty {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .padding(.top, 32)
                }
                Spacer()
                if let lanternsImage = lanternsImage, !lanternsImage.isEmpty,
                    let lanternsUrl = URL(string: lanternsImage)
                {
                    AsyncImage(url: lanternsUrl) { phase in
                        switch phase {
                        case .success(let image):
                            image.resizable().scaledToFit()
                        case .failure(_), .empty:
                            Color.clear
                        @unknown default:
                            Color.clear
                        }
                    }
                    .frame(width: 80, height: 80)
                    .clipped()
                    // push it flushed to top edge
                    .offset(y: -8)
                }
            }
            .padding(.horizontal, 16)

            if #available(iOS 17.0, *) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(items) { item in
                            cardView(for: item)
                        }
                    }
                    .padding(.horizontal, 4)
                    .padding(.bottom, 8)
                    .scrollTargetLayout()
                }
                .scrollTargetBehavior(.viewAligned(limitBehavior: .always))
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(items) { item in
                            cardView(for: item)
                        }
                    }
                    .padding(.horizontal, 4)
                    .padding(.bottom, 8)
                }
            }
        }
        .background(
            Group {
                if let bgImage = backgroundImage, let bgUrl = URL(string: bgImage) {
                    CachedAsyncImage(url: bgUrl) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#265B59")
                    }
                } else {
                    Color(hex: "#265B59")
                }
            }
        )
        .clipped()
        .cornerRadius(12)
        .padding(.horizontal, 12)
        .padding(.vertical, 32)
    }

    @ViewBuilder
    private func cardView(for item: DealItem) -> some View {
        Button(action: {
            if let url = item.actionUrl, !url.isEmpty {
                navigationManager.navigate(to: url)
            }
        }) {
            VStack(spacing: 8) {
                // Top Image Section
                ZStack(alignment: .bottomLeading) {
                    Group {
                        if let imageUrl = URL(string: item.image) {
                            CachedAsyncImage(url: imageUrl) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            } placeholder: {
                                Color(hex: "#E5E7EB")
                            }
                            .frame(width: cardWidth, height: cardWidth * 1.3)
                            .clipped()
                        } else {
                            Color(hex: "#E5E7EB").frame(
                                width: cardWidth, height: cardWidth * 1.3)
                        }
                    }
                    .overlay(alignment: .topLeading) {
                        // Top Left Badge
                        if let badge = item.badgeText, !badge.isEmpty {
                            Text(badge)
                                .font(.system(size: 10, weight: .heavy))
                                .foregroundColor(.black)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color(hex: "#4ADE80"))  // bright green
                                .clipShape(Capsule())
                                .padding(8)
                        }
                    }

                    // Moon overlapping bottom edge
                    if let overlay = item.overlayIcon, !overlay.isEmpty,
                        let overlayUrl = URL(string: overlay)
                    {
                        AsyncImage(url: overlayUrl) { phase in
                            switch phase {
                            case .success(let image):
                                image.resizable().scaledToFit()
                            case .empty, .failure(_):
                                Color.clear
                            @unknown default:
                                Color.clear
                            }
                        }
                        .frame(width: 30, height: 30)
                        // push down so it splits the edge between image and discount tag below
                        .offset(x: 4, y: 15)
                        .zIndex(2)
                    }
                }
                .frame(width: cardWidth, height: cardWidth * 1.3)
                .cornerRadius(12)
                .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)

                // Title (Outside the card box, floating below)
                if let titleText = item.title, !titleText.isEmpty {
                    Text(titleText)
                        .font(.system(size: 13, weight: .regular))
                        .foregroundColor(.white)
                        .lineLimit(1)
                }
            }
            .frame(width: cardWidth)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
