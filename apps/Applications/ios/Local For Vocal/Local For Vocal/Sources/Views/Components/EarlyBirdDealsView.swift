import SwiftUI

struct EarlyBirdDealsView: View {
    // Props
    var title: String = "Early Bird Deals!"
    var headerActionUrl: String?
    var items: [DealItem] = []

    struct DealItem: Identifiable, Decodable {
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
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    Text("›")
                        .font(.system(size: 20, weight: .bold))  // Match title weight
                        .foregroundColor(.white)
                }
            }
            .buttonStyle(PlainButtonStyle())

            // Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(items) { item in
                        EarlyBirdCard(item: item)
                    }
                }
                .padding(.trailing, 16)  // paddingRight in RN
            }
        }
        .padding(.vertical, 16)
        .padding(.leading, 16)  // paddingLeft in RN
        .background(Color(hex: "#A2D2FF"))
        .cornerRadius(16)
        .padding(.horizontal, 12)  // marginHorizontal in RN
        .padding(.bottom, 24)  // marginBottom in RN
    }
}

struct EarlyBirdCard: View {
    let item: EarlyBirdDealsView.DealItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Image Container
                ZStack {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color(hex: "#ffffff")
                        }
                    } else {
                        Color(hex: "#ffffff")
                    }
                }
                .frame(width: 140, height: 180)
                .background(Color.white)
                .cornerRadius(12)
                .clipped()
                .zIndex(0)

                // Offer Badge (Overlapping)
                ZStack {
                    Rectangle()
                        .fill(Color(hex: "#0056D2"))
                        .frame(height: 28)  // paddingVertical 6 * 2 approx + text height
                        .clipShape(
                            RoundedCorner(radius: 12, corners: [.bottomLeft, .bottomRight])
                        )

                    Text(item.offer)
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.vertical, 6)
                }
                .frame(width: 140)
                .offset(y: -10)  // marginTop: -10
                .zIndex(1)

                // Brand
                Text(item.brand)
                    .font(.system(size: 14, weight: .medium))  // fontWeight: 500
                    .foregroundColor(Color(hex: "#334155"))
                    .multilineTextAlignment(.center)
                    .padding(.top, -4)  // Account for offset overlap visual
            }
            .frame(width: 140)
        }
    }
}
