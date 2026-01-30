import SwiftUI

struct WinterClearanceView: View {
    // Props
    var title: String = "Winter Clearance Sale"
    var headerActionUrl: String?
    var items: [ClearanceItem] = []

    struct ClearanceItem: Identifiable, Decodable {
        let id: String
        let image: String
        let offer: String
        let brand: String
        let actionUrl: String?

        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    print("Navigate to: \(action)")
                }
            }) {
                HStack(spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#000000"))
                    Text("›")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#000000"))
                }
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.horizontal, 16)

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(items) { item in
                        WinterClearanceCard(item: item)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
        .background(Color.clear)
    }
}

struct WinterClearanceCard: View {
    let item: WinterClearanceView.ClearanceItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image Container with unique bottom rounded corners
                ZStack {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color(hex: "#FFFFFF")
                        }
                    } else {
                        Color(hex: "#FFFFFF")
                    }
                }
                .frame(width: 150, height: 180)
                .background(Color.white)
                // We need to clip specific corners. Assuming RoundedCorner is available globally
                // based on previous context. If not, we might need to inline it or use built-in.
                // React Native code: borderBottomLeftRadius: 40, borderBottomRightRadius: 40
                .clipShape(
                    RoundedCorner(radius: 40, corners: [.bottomLeft, .bottomRight])
                )

                // Bottom Info Area
                VStack(spacing: 6) {
                    Text(item.offer)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)

                    Text(item.brand)
                        .font(.system(size: 10, weight: .bold))
                        .textCase(.uppercase)
                        .foregroundColor(Color(hex: "#111111"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.white)
                        .cornerRadius(4)
                }
                .frame(height: 60)
                .frame(maxWidth: .infinity)
            }
            .frame(width: 150, height: 240)
            .background(Color(hex: "#1E88E5"))
            .cornerRadius(16)
        }
    }
}
