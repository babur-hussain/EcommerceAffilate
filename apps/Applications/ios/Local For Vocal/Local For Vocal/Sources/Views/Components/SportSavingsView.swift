import SwiftUI

struct SportSavingsView: View {
    struct SavingsItem: Decodable, Identifiable {
        let id: String
        let bgImage: String
        let gradient: [String]?
        let title: String
        let offer: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [SavingsItem]

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

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(items) { item in
                        SavingsCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
        }
        .padding(.bottom, 24)
    }
}

struct SavingsCard: View {
    let item: SportSavingsView.SavingsItem

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
                        Color(hex: "#0F172A")
                    }
                } else {
                    Color(hex: "#0F172A")
                }

                // Gradient Overlay
                LinearGradient(
                    gradient: Gradient(
                        colors: (item.gradient ?? ["#00000000", "#000000CC"]).map { Color(hex: $0) }
                    ),
                    startPoint: .top,
                    endPoint: .bottom
                )

                // Content
                VStack(alignment: .leading) {
                    Text(item.title)
                        .font(.system(size: 32, weight: .black))
                        .textCase(.uppercase)
                        .foregroundColor(.white)
                        .lineSpacing(4)

                    Spacer()

                    Text(item.offer)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "#CCFF00"))
                }
                .padding(24)
            }
            .frame(width: UIScreen.main.bounds.width * 0.75, height: 400)
            .cornerRadius(24)
            .clipped()
        }
    }
}
