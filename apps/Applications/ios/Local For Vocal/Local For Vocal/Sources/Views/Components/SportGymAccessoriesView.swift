import SwiftUI

struct SportGymAccessoriesView: View {
    struct AccessoryItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let discount: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [AccessoryItem]

    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    // Removing 'hex:' label based on previous lint feedback
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

            // Grid
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(items) { item in
                    AccessoryCard(item: item)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct AccessoryCard: View {
    let item: SportGymAccessoriesView.AccessoryItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            ZStack(alignment: .topLeading) {
                // Gradient Background
                LinearGradient(
                    gradient: Gradient(colors: [Color(hex: "#3B82F6"), Color(hex: "#172554")]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                // Content
                VStack(alignment: .leading) {
                    Text(item.title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)
                        .padding(.top, 16)
                        .padding(.horizontal, 16)
                        .zIndex(2)

                    Spacer()

                    Text(item.discount)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "#CCFF00"))
                        .padding(.bottom, 12)
                        .padding(.trailing, 12)
                        .frame(maxWidth: .infinity, alignment: .bottomTrailing)
                        .zIndex(4)
                }

                // Decorative Line
                // Native: position: 'absolute', left: 16, top: 60, bottom: 30, width: 40, borderLeftWidth: 1, borderBottomWidth: 1...
                // Approximating with a shape
                Path { path in
                    path.move(to: CGPoint(x: 16, y: 60))
                    path.addLine(to: CGPoint(x: 16, y: 190))  // adjust height
                    path.addLine(to: CGPoint(x: 56, y: 190))
                }
                .stroke(Color.white.opacity(0.4), lineWidth: 1)

                // Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 110, height: 110)
                    .position(x: 110, y: 100)  // Approximate positioning relative to card size
                    .offset(x: 10, y: 0)  // Push right
                }
            }
            .frame(height: 220)
            .cornerRadius(16)
            .clipped()
        }
    }
}
