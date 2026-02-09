import SwiftUI

struct BestQualityView: View {
    let title: String
    let headerActionUrl: String?
    let headerImage: String?
    let backgroundColor: String
    let items: [BestQualityItem]

    @EnvironmentObject var navigationManager: NavigationManager

    // Model for each item in the grid
    struct BestQualityItem: Decodable, Identifiable {
        let id: String
        let title: String
        let subtitle: String
        let image: String
        let actionUrl: String

        enum CodingKeys: String, CodingKey {
            case id, title, subtitle, image, actionUrl
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.id = (try? container.decode(String.self, forKey: .id)) ?? UUID().uuidString
            self.title = try container.decode(String.self, forKey: .title)
            self.subtitle = (try? container.decode(String.self, forKey: .subtitle)) ?? ""
            self.image = try container.decode(String.self, forKey: .image)
            self.actionUrl = (try? container.decode(String.self, forKey: .actionUrl)) ?? ""
        }
    }

    // Grid layout: 2 columns
    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)

                Spacer()

                // Header Image (decorative icon)
                if let imgStr = headerImage, let url = URL(string: imgStr) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        EmptyView()
                    }
                    .frame(width: 50, height: 50)
                    .rotationEffect(.degrees(-10))
                }

                // Arrow button
                Button(action: {
                    if let action = headerActionUrl {
                        navigationManager.navigate(to: action)
                    }
                }) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 32, height: 32)
                        .overlay(
                            Image(systemName: "arrow.right")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.black)
                        )
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
            .padding(.bottom, 12)

            // Items Grid (2x2)
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(items) { item in
                    Button(action: {
                        navigationManager.navigate(to: item.actionUrl)
                    }) {
                        VStack(alignment: .leading, spacing: 8) {
                            // Product Image
                            AsyncImage(url: URL(string: item.image)) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.gray.opacity(0.1))
                            }
                            .frame(height: 120)
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            .cornerRadius(12)

                            // Title
                            Text(item.title)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(Color(hex: "#1F2937"))
                                .lineLimit(1)

                            // Subtitle (tagline)
                            Text(item.subtitle)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "#111827"))
                                .lineLimit(1)
                        }
                        .padding(10)
                        .background(Color.white)
                        .cornerRadius(16)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .background(Color(hex: backgroundColor))
        .cornerRadius(24)
        .padding(.horizontal, 16)
    }
}
