import SwiftUI

struct PoweredByRowSDUI: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.prop(for: "title") as String? ?? "POWERED BY"
        let brands = component.decodeItems(for: "brands", as: [PoweredByBrand].self)

        VStack(spacing: 8) {
            Text(title)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(.white.opacity(0.7))
                .tracking(2)

            HStack(spacing: 20) {
                ForEach(brands, id: \.name) { brand in
                    if let logoUrl = brand.logoUrl {
                        // Image Logo
                        CachedAsyncImage(url: URL(string: logoUrl)) { image in
                            image.resizable().scaledToFit()
                        } placeholder: {
                            Color.clear
                        }
                        .frame(height: 24)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(4)
                    } else {
                        // Text Logo Fallback
                        Text(brand.name)
                            .font(.system(size: 14, weight: .black))
                            .foregroundColor(Color(hex: brand.textColor ?? "#FFFFFF"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.1))
                            .cornerRadius(4)
                    }
                }
            }
        }
        .padding(.vertical, 8)
    }
}

struct PoweredByBrand: Decodable {
    let name: String
    let logoUrl: String?
    let textColor: String?
}
