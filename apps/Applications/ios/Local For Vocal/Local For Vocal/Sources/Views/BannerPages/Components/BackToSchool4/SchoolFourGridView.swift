import SwiftUI

struct SchoolFourGridView: View {
    let component: SDUIComponent

    private let products = [
        BTSProduct(
            id: "1", title: "Pleated Skirt", subtitle: "Grey & Navy Options", price: "$24.99",
            originalPrice: nil, badge: "IN STOCK", badgeColor: "#DCFCE7",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAbAgp5kIduqiKyWmtqcIYF7zO_T68btBFWT_2HOkQy-mZzM75b-lXHdoGoXnThkc2Cyi7kNTTskIbYyYcqllCY-fbvzH3SV_8v5q1784x8xHbqgZD-bBIYGbHZwyHKOzSJnHLRAacSvQwBghvLxC6guQYWtL8c1Po8IxCGrzaLEBiIvjrjVzbUkQAhJa1RaxU4RNDyE3jzBgVIircc3LuRBbr6O_NQlB-7IADlgHsmJ3yjdtZ283mYxKHPvrAsFPsIFRxf7vyvaquf"
        ),
        BTSProduct(
            id: "2", title: "Premium Polo", subtitle: "Cotton Blend (2-Pack)", price: "$18.50",
            originalPrice: nil, badge: "IN STOCK", badgeColor: "#DCFCE7",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDspN1w-OKG1sC1udjRFw5eQuMOsUgiwY89bWPd3Zfld2BXkbsQeCi14nKYNyRE5SD8c_fA4_ona5G7ViY-c5cPMq54IyooRSMyvroTFki06Rgwdrv1Syln7lvPmJ_yKgiCLcuqmPy0afmUThKhbl0u8trSY_Xt-t4AlYnmLbmUtaJzu0KZk3f7G-RufiB11TAgWntNuoAfi3n-Gt6ddRperI7tTnJ0hdq4KIKftFN1e_fDK0k4OFtmivOP39wpiyRH9Fl589rD3lMV"
        ),
        BTSProduct(
            id: "3", title: "Classic Blazer", subtitle: "Embroidered Badge Ready", price: "$45.00",
            originalPrice: nil, badge: nil, badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB8XaXQDpYxSrbNKu8N_FqFsT9IijFf2tO_iNGGCPkvTgVeleqZaRnw8t4r-9-3-t048UgFPVkAz61T5i4icG-fFcNYb-KylYbUxAkAd0pgDaD3fxQX9q_9-g90CL5AYmYDuTQ3U66KCX9NaFxCDDjs2--wSxrPzXmgwA9m7CjM27AnSw8v0ltsW7_UVMB4yV3GH9hPwO_z9blmYRCKQKrILsn4xOQLt3Us4GgSxpnzplAVhmO6CTswl3xHPooXtA9_ARQUWLeePPsM"
        ),
        BTSProduct(
            id: "4", title: "Striped Tie", subtitle: "Standard House Colors", price: "$8.99",
            originalPrice: nil, badge: "LOW STOCK", badgeColor: "#FEE2E2",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAnjyr6QlwCJibx6-VYHNaJc-G0veToQYr513y2tNXeRraDxoWWe7uyEBjOVJuJSAIOT-M3d4C98PpIQ3M4K3J1YOLDs2eiAiAUoMKuPRfIWCf6aibZre9el9b-PoTi489Bd4hhKnBPOicMAFZkxCiTnjETxOEcdA5fSC4PWy1ltOpOd1iy5NWd9z_NZJk7FLYN-O3dkKwip-uUATgYfz1Fz_ftjBJ9abRQOQftdNy2f6JYy_uKoK9itqEuSut0N3Z82rN3DHmsI2LY"
        ),
    ]

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    private let primary = Color(hex: "1565C0")

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .bottom) {
                Text("Essentials")
                    .font(.system(size: 24, weight: .black))
                    .foregroundColor(Color(hex: "111827"))
                Spacer()
                Button(action: {}) {
                    Text("See All")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(primary)
                        .underline()
                }
            }
            .padding(.horizontal, 20)

            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(products) { item in
                    SchoolFourProductCard(item: item)
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.top, 24)
        .padding(.bottom, 24)
    }
}

struct SchoolFourProductCard: View {
    let item: BTSProduct
    private let primary = Color(hex: "1565C0")

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
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
                        .foregroundColor(
                            badge == "LOW STOCK" ? Color(hex: "B91C1C") : Color(hex: "15803D")
                        )
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: item.badgeColor ?? "FFFFFF"))
                        .cornerRadius(8)
                        .offset(x: -12, y: 12)
                }
            }
            .frame(height: 128)
            .cornerRadius(16)
            .padding(.bottom, 12)

            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .padding(.bottom, 12)

                HStack {
                    Text(item.price)
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(Color(hex: "111827"))
                    Spacer()
                    Button(action: {}) {
                        Image(systemName: "plus")
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                            .frame(width: 32, height: 32)
                            .background(primary)
                            .clipShape(Circle())
                            .shadow(color: Color(hex: "3B82F6").opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.1), radius: 25, x: 0, y: 10)
    }
}
