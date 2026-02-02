import SwiftUI

struct SchoolThreeEssentialsView: View {
    let component: SDUIComponent

    struct EssentialItem: Identifiable {
        let id: String
        let title: String
        let subtitle: String
        let rating: Double
        let reviews: Int
        let price: String
        let image: String
    }

    let essentials = [
        EssentialItem(
            id: "1", title: "Spiral Notebooks (3 Pack)", subtitle: "College Ruled, 120 Pages",
            rating: 4, reviews: 42, price: "$15.00",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDRjIDyZaq2P-gYqnlZDpUjgOq0JdurFTMoj2Y_4zYEAiQqHSFwrgxofCPBUvuQ0lMjF82xjb7cuMmfxm9-l0HTuVWhgir-cbOJQFuDbSBt618GDL-ZUdl1uFBRa7lraoqGifRu_ehvBY6n4rGuyp-_SW2u09cdcpYDcvdXRAOOpoW1EjZs07z2VWNKFnrRka6IZzMs-9XoyO3v-nMQ-p1W6Vp5sXF-eDhr8mZYtoZM7rX10sTz3TgVTN6dHJL1lHvs1vyvDHO6iCPA"
        ),
        EssentialItem(
            id: "2", title: "Neon Highlighters", subtitle: "Smear-safe protection", rating: 4.5,
            reviews: 18, price: "$5.99",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB6BKtwlOZVZZv9oM8QSBpooeaVJYNet1spSTOPsQT5NL-scfZB35fasL-xGCqg_HPzGVWJsnPWMYbe1mkhT8p4N5zzcf_R2cGh7OUStdJOgl7SlgzqD5jJbt7WWXKJoWxzGX03QL4OoBxd4rsuyaXkv7jLv3tLIFO1VrdH2pX1SjSb6gVHmTGF4YwnYRQalzwCaMKyIK433pFxQfeDj89DXqH0nlw_quW988tj6NGgMkGeDL7v0oZjZGrMoGQEYzFwiNoaqZTZgzb1"
        ),
    ]

    private let primary = Color(hex: "FF8C42")
    private let secondary = Color(hex: "007ea7")
    private let accent = Color(hex: "FDE74C")

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Essential Gear")
                .font(.system(size: 20, weight: .black))
                .foregroundColor(secondary)
                .padding(.horizontal, 16)

            VStack(spacing: 16) {
                ForEach(essentials) { item in
                    HStack(alignment: .center) {
                        AsyncImage(url: URL(string: item.image)) { phase in
                            if let image = phase.image {
                                image.resizable().aspectRatio(contentMode: .fill)
                            } else {
                                Color.gray
                            }
                        }
                        .frame(width: 80, height: 80)
                        .cornerRadius(8)
                        .padding(.trailing, 16)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(item.title)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "333333"))

                            Text(item.subtitle)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                                .padding(.bottom, 8)

                            HStack(spacing: 2) {
                                ForEach(0..<5) { i in
                                    Image(systemName: "star.fill")
                                        .font(.system(size: 12))
                                        .foregroundColor(
                                            Double(i) < item.rating ? accent : Color(hex: "D1D5DB"))
                                }
                                Text("(\(item.reviews))")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            }
                        }

                        Spacer()

                        VStack(alignment: .trailing) {
                            Text(item.price)
                                .font(.system(size: 16, weight: .black))
                                .foregroundColor(secondary)
                            Spacer()
                            Button(action: {}) {
                                Image(systemName: "cart.badge.plus")
                                    .font(.system(size: 24))
                                    .foregroundColor(primary)
                            }
                        }
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(12)
                    .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.top, 32)
        .padding(.bottom, 24)
    }
}
