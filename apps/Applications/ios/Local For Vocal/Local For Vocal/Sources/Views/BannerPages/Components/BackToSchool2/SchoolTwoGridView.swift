import SwiftUI

struct SchoolTwoGridView: View {
    let component: SDUIComponent

    // Demo Products
    private let products = [
        BTSProduct(
            id: "1", title: "Premium Sketchbook Set", subtitle: "Art & Design", price: "$12.99",
            originalPrice: nil,
            badge: "BEST SELLER", badgeColor: "#FACC15",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDMKjBvZ7lHkjDIHdFD_Oymj0ODzClyEHIIVCEtjZYwky5PRHJU43KfKpmxSOTEZvn74J2jplEhOR65Zr-roVA_EqCCW0zk31YTgr1A49Bb7Mfd7Qtw7p5OkcFO1tXwrNKUqMm6jUpAC2aK12EOPAdya9B5xf4iXZB9m2QCWjWwCM0QhdXzuRtUVTjWhioNdeNrCZQbScDN9dFGlG3b3m2L_fZn635T3_u6oEHA9L-xWdshi90_FgLCQ7djJxlyTfNTpwGflbXiwdOs"
        ),
        BTSProduct(
            id: "2", title: "Fineliner Pen Pack", subtitle: "Writing Tools", price: "$11.99",
            originalPrice: nil,
            badge: "-20%", badgeColor: "#EF4444",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcvAJiC6aMGAZ6-Z3rF0ipX2k9f-CUrcig3VnI6M8soGm9E1M4gYxgcF444jtlCqaaoeSej-kEiORfKyA_wUjSGahJ4AsMPOM1X34i5MIjRnBxp850CLR3o5PPILzzeJZl_8VMxJ-CA4aZ0Tnz3lWtboC0EDwGvBwakh7klA026drDqjoIGNwMfDGyJ5vHDj7KPlmU6z4iwukBSIlSpun0mPlI1vLB55Z4PktijMBD0RnjFIp96hEhRUr7k8j4higJfkcIgX1yPB_"
        ),
        BTSProduct(
            id: "3", title: "Classic Canvas Bag", subtitle: "Accessories", price: "$24.50",
            originalPrice: nil,
            badge: nil, badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCOVksraPr3tJaRnP1uz6GLJjAg575bnfNLFm25WspTdhn2VCnAneWHAyvlZitf-VbCVC33aFyj5DbBYS8wK-i6AqQqO8-YfElctvhJ2xLkXWf7UoERin6aicIGT-s-2u7l3Ov_jErMWcqOSWkuUPaufv72X4J23325wVtpo3UA1gNWpMvIDj_0XvIv82OC-q4XagJwieobEpr5vlkuStogIpAYGwe4xXa4BqJmGrpLPyWxrEh4ssFcpIIERqMKRm9koxNDjVnUZSCN"
        ),
        BTSProduct(
            id: "4", title: "Science Textbook", subtitle: "Education", price: "$45.00",
            originalPrice: nil,
            badge: nil,
            badgeColor: nil,
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAlKGILC8YgeYkEwG4NJNnb-WOlsreGSkaKOKu0yQnmFL7PpZDQorUjkTEmSdfo8uFOzYEzszGMhpsjE6RUNWqzwNV2nNjmbXAl6FVDaATYfHF2mWDIouVYbBMekLTnY-xvKbfLJdzLmsJJUjA7f3R5S_1nRnBf4RZP88nrG2hOLzuVJ0yP6Jk07EGXFePaVMWrvkyDUzGek2Y_-TV7wjdqFs7k3h5TWxYRXAtS9naBq1XUL1GBGCyBd26nH9R3QJpRt_5cq6B0cu8u"
        ),
    ]

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Top Picks")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                Image(systemName: "star.fill")
                    .foregroundColor(Color(hex: "FACC15"))
            }
            .padding(.horizontal, 16)

            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(products) { item in
                    SchoolTwoProductCard(item: item)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.top, 24)
        .padding(.bottom, 24)
    }
}

struct SchoolTwoProductCard: View {
    let item: BTSProduct

    var body: some View {
        VStack(spacing: 0) {
            // Badges
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
                        .foregroundColor((item.badgeColor == "#FACC15") ? .black : .white)  // Approximation
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: item.badgeColor ?? "000000"))
                        .cornerRadius(4)
                        .rotationEffect(.degrees(-3))
                        .offset(x: 8, y: 8)
                }

                VStack {
                    HStack {
                        Spacer()
                        Button(action: {}) {
                            Image(systemName: "heart.fill")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "9CA3AF"))
                                .padding(6)
                                .background(Color.white)
                                .clipShape(Circle())
                        }
                    }
                    Spacer()
                }
                .padding(8)
            }
            .frame(height: 128)
            .cornerRadius(8)
            .padding([.horizontal, .top], 12)

            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                    .lineLimit(1)

                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .lineLimit(1)
                    .padding(.bottom, 8)

                // Stars Row (Simplified)
                HStack(spacing: 2) {
                    ForEach(0..<5) { _ in
                        Image(systemName: "star.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "FACC15"))
                    }
                    Text("(42)")
                        .font(.system(size: 10))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
                .padding(.bottom, 4)

                HStack {
                    Text(item.price)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "155e48"))
                    Spacer()
                    Button(action: {}) {
                        Image(systemName: "plus")
                            .font(.system(size: 18))
                            .foregroundColor(.white)
                            .padding(6)
                            .background(Color.black)
                            .clipShape(Circle())
                    }
                }
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}
