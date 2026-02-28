import SwiftUI

struct SportCombosView: View {
    struct ComboItem: Decodable, Identifiable {
        let id: String
        let title: String
        let image: String
        let discount: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [ComboItem]

    let columns = [
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8),
    ]

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
                        AppLogger.debug("Navigate to: \(action)")
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
                    ComboCard(item: item)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct ComboCard: View {
    let item: SportCombosView.ComboItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 6) {
                // Image Container
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.white)
                        .aspectRatio(1, contentMode: .fit)

                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .padding(6)
                    }
                }

                // Text Content
                VStack(spacing: 2) {
                    Text(item.title)
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)

                    Text(item.discount)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "#CCFF00"))
                        .multilineTextAlignment(.center)
                }
                .padding(.bottom, 4)
            }
            .padding(5)
            .background(Color(hex: "#4C7BD3"))
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.1), radius: 3, x: 0, y: 2)
        }
    }
}
