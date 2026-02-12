import SwiftUI

struct SportSupportGoalsView: View {
    struct GoalItem: Decodable, Identifiable {
        let id: String
        let bgImage: String
        let gradient: [String]?
        let titleLines: [String]
        let subtitle: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [GoalItem]

    var body: some View {
        GeometryReader { geometry in
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

                // Horizontal Scroll
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(items) { item in
                            GoalCard(item: item, width: geometry.size.width * 0.75)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                }
            }
            .padding(.bottom, 24)
        }
    }
}

struct GoalCard: View {
    let item: SportSupportGoalsView.GoalItem
    let width: CGFloat

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            ZStack {
                // Background Image
                if let url = URL(string: item.bgImage) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color.gray.opacity(0.3)
                    }
                } else {
                    Color.gray
                }

                // Gradient Overlay
                LinearGradient(
                    gradient: Gradient(
                        colors: (item.gradient ?? ["#0000001A", "#000000E6"]).map { Color(hex: $0) }
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )

                // Content
                VStack(alignment: .leading, spacing: 0) {
                    Spacer()

                    VStack(alignment: .leading, spacing: -4) {
                        ForEach(item.titleLines, id: \.self) { line in
                            Text(line)
                                .font(.system(size: 36, weight: .black, design: .serif))
                                .italic()
                                .foregroundColor(.white)
                                .tracking(-1)
                                .lineLimit(1)
                        }
                    }
                    .padding(.bottom, 8)

                    Text(item.subtitle)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#CCFF00"))
                }
                .padding(20)
            }
            .frame(width: width, height: 400)
            .cornerRadius(24)
            .clipped()
        }
    }
}
