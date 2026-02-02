import SwiftUI

struct BackToSchoolGridView: View {
    let component: SDUIComponent

    // Decoding Logic similar to other grids
    private var items: [BTSProduct] {
        if let itemsValue = component.props?["products"]?.value,
            let data = try? JSONSerialization.data(withJSONObject: itemsValue),
            let decoded = try? JSONDecoder().decode([BTSProduct].self, from: data)
        {
            return decoded
        }
        // Demo Data if props empty
        return [
            BTSProduct(
                id: "1", title: "Dino Explorer Backpack", subtitle: "Ergonomic fit",
                price: "$34.99", originalPrice: nil, badge: "New", badgeColor: "#F4B060",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qgZsOP70tmld6ZraMtCBaVLxR6dZxr8exrVcrnu2VlLAF1epw_2DBCombSYP8Ny5Q8NerXaaOsaH50MFgYBo3zIdQsqAweqCakaLhRvU369-cyYyZF_oS1CkqAjHTdwhnWY-xggEGvKMPBNTVHOo2HXk2vPboQ43QSSe9wPIHWh-MMJrv33bc77nfiydEXZDiSddkOS0u309A1T-i5VYfX7m6sunNVCAbEnXd-eoLdQSYFaHh1fbPZIx0miN7z24RsAYb_vaV1Xl"
            ),
            BTSProduct(
                id: "2", title: "Artist Color Pencil Set", subtitle: "24 Vibrant Colors",
                price: "$12.50", originalPrice: nil, badge: nil, badgeColor: nil,
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCcdvhXWvPY_GEjZhc9IoobM2aNEU1lp7iQkcfU3n82j_i6d0y00yKz6PX_WsRfpm1GR_JPpEq4M4nbhfEdGv_UopfMEESW2zq9Fch9gd8Lk7FngJA9pb1rz-XLvCRo6eYvHbcvTq_5QtfoLfhq9nOse1z3vkTHlRrcHgJXxOEXI4jxJYvuq8_0GVM3tvDFno77q7CxXsD8Z5paYzSMezi7hD7909VrRQ35Q8IFV0JwYYuBCZllVDfiwFvBYQG0LU-rT7F6bbbZlk7A"
            ),
            BTSProduct(
                id: "3", title: "Hardcover Notebook", subtitle: "Ruled pages", price: "$8.99",
                originalPrice: nil, badge: "-15%", badgeColor: "#E66B6B",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2OayXsAosgmuFl6A_uKlKuvYffK7mO5VmGd_uGVd7vOftDM3UmgiJhpsd2ml_Y4yETCoXhiyezFnm229e8nDaS__HTUX0hbj_Qufs7anfkqIg1mSQTSVZPAFW-vgI47f09Djzpu3-j9BqNSJr4o18v6PfWrN6yLyB8Uvu8cPZYs2FgPxRzFw8c_elAE4xGxJTWkDFvGrNFuSOmr6TWtB384daydDe0aZuvMXZq7DOWzA3ZAg4CaYh6bJLWvWDwYdf3bTkvEhHSf7q"
            ),
            BTSProduct(
                id: "4", title: "Scientific Calculator", subtitle: "Solar Powered", price: "$15.99",
                originalPrice: nil, badge: nil, badgeColor: nil,
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCFxJ3QXPxvSONI21tIppEnXusRtXhs0IB5D_BqYLQdpO_qP3U0BkRFoKxPvRsxFPk1h-H6zg85kqfIwestz1I82gw_VEozvDmZwT7NvCN_7UwjJaTQWWDmzML1tZNpH_go0pnh3PMWQPDdh2zqE-o14iiXlaWZQU0NI29QIaD6XRQzNKPMiGYurpIyvujbWtDNKXSpC7UsxyidfoRY2rnb2gUakRpEoBd4Gi3Gg9VQdtOdrViYlfnUoBUnsxLEPD3MHanCOrGjNCcI"
            ),
        ]
    }

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Trending Now")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "1F2937"))

            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(items) { item in
                    BTSProductCard(item: item)
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 24)
    }
}

struct BTSProductCard: View {
    let item: BTSProduct

    var body: some View {
        VStack(spacing: 0) {
            // Image Area
            ZStack(alignment: .topLeading) {
                Color(hex: "F9FAFB")

                AsyncImage(url: URL(string: item.image)) { phase in
                    if let image = phase.image {
                        image.resizable().aspectRatio(contentMode: .fit)
                    } else {
                        Color.clear
                    }
                }
                .padding(16)

                if let badge = item.badge {
                    Text(badge)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .textCase(.uppercase)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: item.badgeColor ?? "000000"))
                        .cornerRadius(999)
                        .padding(8)
                }

                VStack {
                    HStack {
                        Spacer()
                        Button(action: {}) {
                            Image(systemName: "heart.fill")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "9CA3AF"))
                                .padding(8)
                                .background(Color.white.opacity(0.8))
                                .clipShape(Circle())
                        }
                    }
                    Spacer()
                }
                .padding(8)
            }
            .frame(height: 144)

            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                    .lineLimit(1)

                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "4B5563"))
                    .lineLimit(1)
                    .padding(.bottom, 6)

                HStack {
                    Text(item.price)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))
                    Spacer()
                    Button(action: {}) {
                        Image(systemName: "plus")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 32, height: 32)
                            .background(Color(hex: "F4B060"))
                            .clipShape(Circle())
                            .shadow(color: Color(hex: "F4B060").opacity(0.3), radius: 6, x: 0, y: 4)
                    }
                }
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(hex: "F3F4F6"), lineWidth: 1)
        )
    }
}
