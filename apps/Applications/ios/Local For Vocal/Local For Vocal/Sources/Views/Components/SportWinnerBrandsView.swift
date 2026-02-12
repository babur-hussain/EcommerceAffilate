import SwiftUI

struct SportWinnerBrandsView: View {
    struct WinnerBrandItem: Decodable, Identifiable {
        let id: String
        let brand: String
        let logoColor: String?
        let image: String
        let offer: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [WinnerBrandItem]

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
                            WinnerBrandCard(item: item, width: geometry.size.width * 0.75)
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

struct WinnerBrandCard: View {
    let item: SportWinnerBrandsView.WinnerBrandItem
    let width: CGFloat

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            VStack(spacing: 0) {
                // Brand Logo/Name Area
                VStack {
                    Text(item.brand)
                        .font(.system(size: 30, weight: .black, design: .serif))
                        .italic()
                        .foregroundColor(Color(hex: item.logoColor ?? "#000000"))
                        .tracking(-0.5)
                        .multilineTextAlignment(.center)
                        .lineLimit(1)
                        .minimumScaleFactor(0.5)
                }
                .frame(height: 50)
                .frame(maxWidth: .infinity)
                .padding(.bottom, 10)

                // Image Container
                ZStack {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(Color.white)

                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .padding(10)
                    }
                }
                .frame(width: 240, height: 240)  // Square container
                .padding(.bottom, 20)

                Spacer()

                // Offer Text
                Text(item.offer)
                    .font(.system(size: 26, weight: .heavy))
                    .foregroundColor(Color(hex: "#111827"))
                    .tracking(0.5)
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 4)
            }
            .padding(24)
            .background(Color(hex: "#E3F2FD"))  // Light Blue Background
            .cornerRadius(24)
            .frame(width: width, height: 420)
        }
    }
}
