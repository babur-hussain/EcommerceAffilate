import SwiftUI

struct FashionTrendingView: View {
    let component: SDUIComponent

    // Custom Colors
    private let textMain = Color(hex: "#22252a")
    private let white = Color.white

    // Model for decoding items
    struct TrendingItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let badge: String?
        let actionUrl: String?
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Section Title
            Text("Trending for You")
                .font(.custom("Georgia", size: 24))
                .fontWeight(.semibold)
                .foregroundColor(textMain)
                .padding(.horizontal, 16)
                .padding(.top, 24)

            // Cards
            VStack(spacing: 24) {
                ForEach(items) { item in
                    Button(action: {
                        if let action = item.actionUrl {
                            AppLogger.debug("Navigate to: \(action)")
                        }
                    }) {
                        ZStack(alignment: .bottomLeading) {
                            // Background Image
                            if let url = URL(string: item.image) {
                                AsyncImage(url: url) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Color.gray.opacity(0.1)
                                }
                                .frame(height: 320)
                                .frame(maxWidth: .infinity)
                                .clipped()
                            }

                            // Gradient Overlay
                            LinearGradient(
                                gradient: Gradient(colors: [.clear, .black.opacity(0.5)]),
                                startPoint: .center,
                                endPoint: .bottom
                            )
                            .frame(height: 160)

                            // Content
                            VStack(alignment: .leading, spacing: 8) {
                                if let badge = item.badge {
                                    Text(badge)
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(white)
                                        .textCase(.uppercase)
                                        .tracking(1)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 4)
                                        .background(white.opacity(0.2))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 8)
                                                .stroke(white.opacity(0.3), lineWidth: 1)
                                        )
                                        .cornerRadius(8)
                                }

                                Text(item.title)
                                    .font(.custom("Georgia", size: 24))
                                    .foregroundColor(white)
                                    .lineSpacing(4)
                            }
                            .padding(20)

                            // Favorite Button (Top Right)
                            VStack {
                                HStack {
                                    Spacer()
                                    Button(action: {
                                        // Favorite action
                                    }) {
                                        Image(systemName: "heart")
                                            .font(.system(size: 24))
                                            .foregroundColor(white)
                                            .frame(width: 40, height: 40)
                                            .background(white.opacity(0.2))
                                            .clipShape(Circle())
                                    }
                                }
                                Spacer()
                            }
                            .padding(16)
                        }
                        .background(Color.white)
                        .cornerRadius(16)
                        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }

    private var items: [TrendingItem] {
        component.decodeItems(for: "items")
    }
}
