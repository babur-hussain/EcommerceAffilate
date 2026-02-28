import SwiftUI

struct GlowForHarvestView: View {
    struct HarvestItem: Decodable, Identifiable {
        let id: String
        let name: String
        let image: String
        let offer: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [HarvestItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#000000"))

                Spacer()

                if let action = headerActionUrl {
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Text("View All")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#FF6F00"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Scroll Content
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(items) { item in
                        HarvestCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 20)
    }
}

struct HarvestCard: View {
    let item: GlowForHarvestView.HarvestItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 8) {
                // Card
                ZStack {
                    // 1. Background Image Pattern
                    AsyncImage(
                        url: URL(
                            string:
                                "https://res.cloudinary.com/deljcbcvu/image/upload/v1768414560/IMG_1856_tkqhto.jpg"
                        )
                    ) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#FFF3E0")
                    }
                    .opacity(0.6)

                    // 2. Kites Decoration
                    VStack {
                        HStack {
                            Spacer()
                            Text("🪁")
                                .font(.system(size: 24))
                                .rotationEffect(.degrees(15))
                                .offset(x: 10, y: -10)
                        }
                        Spacer()
                    }
                    VStack {
                        HStack {
                            Text("🪁")
                                .font(.system(size: 16))
                                .rotationEffect(.degrees(-10))
                                .offset(x: -10, y: 10)
                            Spacer()
                        }
                    }

                    // 3. Main Product Image
                    AsyncImage(url: URL(string: item.image)) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 90, height: 90)

                    // 4. Offer Badge
                    VStack {
                        Spacer()
                        Text(item.offer)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 6)
                            .background(
                                Ellipse()
                                    .fill(Color(hex: "#E91E63"))
                                    .frame(height: 40)
                                    .offset(y: 10)
                            )
                    }
                }
                .frame(width: 140, height: 180)
                .background(Color(hex: "#FFF3E0"))
                .cornerRadius(16)
                .clipped()

                // Name Pill
                Text(item.name)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "#333333"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 4)
                    .background(Color(hex: "#FCE4EC"))
                    .cornerRadius(12)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}
