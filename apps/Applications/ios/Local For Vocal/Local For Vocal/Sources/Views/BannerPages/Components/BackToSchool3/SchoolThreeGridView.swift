import SwiftUI

struct SchoolThreeGridView: View {
    let component: SDUIComponent

    private let products = [
        BTSProduct(
            id: "1", title: "Prismacolor Set", subtitle: "24 Vibrant Colors", price: "$12.99",
            originalPrice: nil, badge: "BEST SELLER", badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDPYg2e-CCyEimCdpztr2uZXLrwEBtGsORQDbV1ln1T0WrIZBnZ3B4s5UZFWan4FoXMeA8w4JWpoEmb4eQd0OJi20sV914otWEfHMl6o6AtRrTCG7Aan0mqvn8tfHVwF36fuF9RkbpyL2PFUIx8BiFSQtKhdp2RTImwa22S1hsrYvwiGcgE8DWYr-3A7FOZdApFkf5Fs0mMQMzfpyzmx3sNbhsH4Wh-sArzJaC-sFb4cTr6vJ4sWk7RyVmITZoTzFmy2GbdCJwwmj_x"
        ),
        BTSProduct(
            id: "2", title: "Geo Ruler Kit", subtitle: "Precision Tools", price: "$8.50",
            originalPrice: nil, badge: nil, badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB-_IOBIPy6ZeJNUY2um8EQYm6RD6f6DPLaZeBCO0gCjoWV2DuLTfs6sOUTO-Bw5JJbnkADrQKI6givbfIPXUBj5UVfr17z2cDAG5mba3bPDwnE6lXGctl1CpIbY3B28s01rdlYKF9l9b5nYmU3CCS_vGTWGxp-_vD5DN8MAX4-g_vXzpHWG2chwTnapeOe6r5DgLEr2H1V5ykXz85EnYoD2Wa-4M-ZbuBh9K-hOyC5bnG-qLfcFAKAUwjStBhgyf03ADh6cqPaDaZI"
        ),
    ]

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    private let primary = Color(hex: "FF8C42")
    private let secondary = Color(hex: "007ea7")

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .bottom) {
                Text("Best Sellers")
                    .font(.system(size: 20, weight: .black))
                    .foregroundColor(secondary)
                Spacer()
                Button(action: {}) {
                    Text("See All")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(primary)
                }
            }
            .padding(.horizontal, 16)

            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(products) { item in
                    SchoolThreeProductCard(item: item)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.top, 24)
        .padding(.bottom, 24)
    }
}

struct SchoolThreeProductCard: View {
    let item: BTSProduct
    private let primary = Color(hex: "FF8C42")
    private let secondary = Color(hex: "007ea7")

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topLeading) {
                Color(hex: "F9FAFB")
                AsyncImage(url: URL(string: item.image)) { phase in
                    if let image = phase.image {
                        image.resizable().aspectRatio(contentMode: .fill)
                    } else {
                        Color.clear
                    }
                }

                if let badge = item.badge {
                    Text(badge)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(primary)
                        .cornerRadius(6)
                        .offset(x: 12, y: 12)
                }
            }
            .frame(height: 128)
            .cornerRadius(8)

            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "333333"))

                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))

                HStack {
                    Text(item.price)
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(secondary)
                    Spacer()
                    Button(action: {}) {
                        Image(systemName: "plus")
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                            .padding(6)
                            .background(primary)
                            .clipShape(Circle())
                            .shadow(color: primary.opacity(0.5), radius: 4, x: 0, y: 2)
                    }
                }
                .padding(.top, 8)
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 6, x: 0, y: 4)
    }
}
