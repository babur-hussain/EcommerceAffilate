import SwiftUI

struct SchoolFiveGridView: View {
    let component: SDUIComponent

    private let products = [
        BTSProduct(
            id: "1", title: "Neon Gel Pens", subtitle: "Pack of 12 colors", price: "$8.99",
            originalPrice: "$12.00", badge: "SALE", badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAh9W-P6SzvcUquKkj8oRartWE3IYELg0HGry7XiS-vZN78khe1Gf4E8HZwS9QoTv7qxV3X1doKiUtWCbD8JoXn4IMTFt4cuRPDqnbUiCyke6YXioUGHVUwQGpcuC34T35-qGG3Yo4EA66N-1BqKaKlhNwdNJQIMeueBtGmCq0OqiG9nR2GES65ZxwKKDDT4tNJwI5cN7t0zN3KBHzBbs2wjTYqaIVtqs9JSEHbVRZ1JhlVbJHEPNAcGcvwbJBN5e8lNduAADH0Oao3"
        ),
        BTSProduct(
            id: "2", title: "Spiral Notebooks", subtitle: "A4, Ruled, 3-Pack", price: "$14.50",
            originalPrice: nil, badge: nil, badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDJv6ZhzRgq1AXy-L3x6Dyb1tIONByYLyCQYId4ScwyXPCikbbgdYN6lo4qe77OmM60ch7cz8FnbBzClarY_SvLAr_2Rt6E65_NFunrbEN7CSLqNfFbhGf7vTFCNwGCjPWLRkOHkGWhI05C946v0BDgX1ElN6wdDQrknc9PNcIFLmI0pAV2ex9E0uZ8k3g16OuH-9jQRPunhjoz8lG438wyVKwd1cBYpw5xoG57l3O5yw8jKGY4y7L9AeMMN8Xi6YvIBjUDbCKNZqsX"
        ),
        BTSProduct(
            id: "3", title: "Classic Alarm", subtitle: "Wake up in style", price: "$19.99",
            originalPrice: "$25.00", badge: "-20%", badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD3CNS_TyF0xwREb3GXQGDbMaXExgYe6yva89TVACy3UVK0duuroi1MoLiJqpAKTNWBinOMwtufLejzsYajEWduGio9EbSYpSGVnOw1bBLwolL2CkxkZjtsYrNPJXqBu05LfOBzDxauJmDov2ktFS4gmuoG7bff2d8AIOCqORBbcntzu2XkeKKR9lF_V3ryWLSio2dVArBXNAIDIziSjSskmKSuz0535nmGu8IiS7XxZSqkvCjLI-L7JxCnSaC8KcFbU5qfFAOG6p0h"
        ),
        BTSProduct(
            id: "4", title: "Desk Tidy Pro", subtitle: "Keep it organized", price: "$16.00",
            originalPrice: nil, badge: nil, badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCYxiEUEVf8Kmizk0wj6pRmPGuu1VC1bbUw3OvQBII33y_OD6AQenO-FJ0-YdnBYd_lmsV2f3Gjs_aNtQd3BuaeOftk2WUTsuEPMiCzRS9zffoZHUCu1as0QYUVY93M3pQCJCAP_UO8_YQqsMpt_e4KLdqNTZ1w52j5OW-9R0dUMYncXcnv9l6XP6pq-sNlg8j5POTDQrPQfy86ih6kxWy_ZQaV-uHc5qBOfHomqy37cFGpSE009rz8wrzkTtYZ2d-_qCoRqX8Hf69C"
        ),
    ]

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    private let primary = Color(hex: "DC2626")

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .bottom) {
                Text("Trending Now")
                    .font(.system(size: 20, weight: .bold))
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

            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(products) { item in
                    SchoolFiveProductCard(item: item)
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.bottom, 24)
    }
}

struct SchoolFiveProductCard: View {
    let item: BTSProduct
    private let primary = Color(hex: "DC2626")

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topLeading) {
                Color(hex: "F3F4F6")
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
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(primary)
                        .cornerRadius(6)
                        .offset(x: 20, y: 20)
                }

                // Fav Button
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        Button(action: {}) {
                            Image(systemName: "heart.fill")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "9CA3AF"))
                                .frame(width: 28, height: 28)
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                        }
                    }
                }
                .padding(8)
            }
            .frame(height: 140)
            .cornerRadius(12)
            .padding(.bottom, 12)

            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)

                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .padding(.bottom, 8)

                HStack {
                    VStack(alignment: .leading, spacing: 0) {
                        if let original = item.originalPrice {
                            Text(original)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                                .strikethrough()
                        }
                        Text(item.price)
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(
                                item.originalPrice != nil ? primary : Color(hex: "111827"))
                    }

                    Spacer()

                    Button(action: {}) {
                        Image(systemName: "plus")
                            .font(.system(size: 18))
                            .foregroundColor(
                                item.originalPrice != nil ? .white : Color(hex: "1F2937")
                            )
                            .frame(width: 32, height: 32)
                            .background(item.originalPrice != nil ? primary : Color(hex: "F3F4F6"))
                            .cornerRadius(12)
                            .shadow(
                                color: item.originalPrice != nil ? Color(hex: "FECACA") : .clear,
                                radius: 10, x: 0, y: 4)
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 20, x: 0, y: 4)
    }
}
