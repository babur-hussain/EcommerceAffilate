import SwiftUI

struct SportCricketSeasonView: View {
    struct CricketItem: Decodable, Identifiable {
        let id: String
        let actionUrl: String?
        // Main Card Props
        let bgImage: String?
        let mainText: String?
        let subText: String?
        // Secondary Card Props
        let title: String?
        let offer: String?
        let image: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [CricketItem]

    var body: some View {
        if items.count >= 3 {
            VStack(alignment: .leading, spacing: 12) {
                // Header
                HStack {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    if let action = headerActionUrl {
                        Spacer()
                        Button(action: {
                            AppLogger.debug("Navigate to: \(action)")
                        }) {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "#111827"))
                        }
                    }
                }
                .padding(.horizontal, 16)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        // Main Large Card (Index 0)
                        if let mainItem = items.first {
                            CricketMainCard(item: mainItem)
                        }

                        // Secondary Cards (Index 1 & 2...)
                        ForEach(items.dropFirst()) { item in
                            CricketSecondaryCard(item: item)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
            .padding(.bottom, 24)
        }
    }
}

struct CricketMainCard: View {
    let item: SportCricketSeasonView.CricketItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            ZStack {
                // Background Image
                if let bgParams = item.bgImage, let url = URL(string: bgParams) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color.gray.opacity(0.3)
                    }
                } else {
                    Color.black
                }

                // Gradient Overlay
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0.1), Color.black.opacity(0.7)]
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )

                // Content
                VStack(spacing: 0) {
                    Spacer()

                    if let mainText = item.mainText {
                        let lines = mainText.components(separatedBy: " ")
                        ForEach(lines, id: \.self) { line in
                            Text(line)
                                .font(.system(size: 22, weight: .black, design: .serif))  // Serif usually approximates "italic" styles better in system fonts or custom
                                .italic()
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)
                        }
                    }

                    if let subText = item.subText {
                        Text(subText)
                            .font(.system(size: 14, weight: .bold))
                            .italic()
                            .foregroundColor(Color(hex: "#CCFF00"))  // Neon Green/Yellow
                            .padding(.top, 4)
                            .padding(.bottom, 16)
                    }

                    // Arrow Button
                    Circle()
                        .fill(Color.white)
                        .frame(width: 32, height: 32)
                        .overlay(
                            Image(systemName: "arrow.right")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.black)
                        )
                        .padding(.bottom, 12)
                }
                .padding(12)
            }
            .frame(width: 160, height: 220)
            .cornerRadius(16)
            .clipped()
        }
    }
}

struct CricketSecondaryCard: View {
    let item: SportCricketSeasonView.CricketItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            ZStack {
                // Gradient Background
                LinearGradient(
                    gradient: Gradient(colors: [Color(hex: "#1e293b"), Color(hex: "#0f172a")]),
                    startPoint: .top,
                    endPoint: .bottom
                )

                VStack(alignment: .leading, spacing: 0) {
                    // Header
                    VStack(alignment: .leading, spacing: 4) {
                        if let title = item.title {
                            Text(title)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }
                        if let offer = item.offer {
                            Text(offer)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "#CCFF00"))
                        }
                    }
                    .padding(12)

                    Spacer()

                    // Image
                    if let imgUrl = item.image, let url = URL(string: imgUrl) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Color.clear
                        }
                        .frame(height: 120)
                        .padding(.bottom, 12)
                        .padding(.horizontal, 4)
                    }
                }
            }
            .frame(width: 150, height: 220)
            .cornerRadius(16)
            .clipped()
        }
    }
}
