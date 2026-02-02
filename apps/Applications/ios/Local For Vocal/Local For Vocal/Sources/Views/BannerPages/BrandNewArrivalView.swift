import SwiftUI

struct BrandNewArrivalView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background
            Color(red: 0.99, green: 0.99, blue: 0.98)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Sticky Header
                headerView

                // Scrollable Content
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Hero Section with 3-panel images
                        heroSectionView

                        // Collection Section Header
                        collectionHeaderView

                        // Product Grid
                        productGridView

                        // Newsletter Section
                        newsletterSectionView

                        Spacer().frame(height: 120)
                    }
                }
            }

            // Fixed Bottom Nav
            bottomNavView
        }
        .navigationBarHidden(true)
        .ignoresSafeArea(.all, edges: .bottom)
    }

    // MARK: - Header
    private var headerView: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 20))
                    .foregroundColor(Color(red: 0.35, green: 0.35, blue: 0.35))
                    .padding(8)
            }

            Spacer()

            Text("LUXE")
                .font(.custom("Georgia", size: 24))
                .fontWeight(.semibold)
                .tracking(6)
                .foregroundColor(Color(red: 0.25, green: 0.22, blue: 0.20))

            Spacer()

            HStack(spacing: 4) {
                Button(action: {}) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 20))
                        .foregroundColor(Color(red: 0.35, green: 0.35, blue: 0.35))
                        .padding(8)
                }

                Button(action: {}) {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bag")
                            .font(.system(size: 20))
                            .foregroundColor(Color(red: 0.35, green: 0.35, blue: 0.35))
                            .padding(8)

                        Circle()
                            .fill(Color(red: 0.82, green: 0.71, blue: 0.55))  // Beige primary
                            .frame(width: 8, height: 8)
                            .offset(x: -4, y: 4)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            Color(red: 0.99, green: 0.99, blue: 0.98).opacity(0.8)
        )
        .background(.ultraThinMaterial)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(red: 0.9, green: 0.9, blue: 0.9)),
            alignment: .bottom
        )
    }

    // MARK: - Hero Section
    private var heroSectionView: some View {
        ZStack {
            // 3-Panel Image Layout
            HStack(spacing: 0) {
                AsyncImage(
                    url: URL(
                        string:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuC4KtvNZTORM6BF7WAkUzAbaKl09ue0n4XSt6ZFhmQe3gYh8m0SZ1NHKJpTPfOxwuigPNHzhS9nRMrZfuAifbfaOG2zAQhjMU8qyKLeE9E2FDRN16v6_q702FUuJ-dutxAr76KivmUVGWmxBloUtjNpkx3WsZHfaTu4yXMKKWl3Cm5UyAnbhWIKHDMVjsL1g7vLGSmR6IkIyzmIdhYsttn8wy3nfWcF5Ou02J7IG3KQ932ShCE66qif0Z_MuSEqgcVQJ9m7hn_kdvt4"
                    )
                ) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color(red: 0.96, green: 0.95, blue: 0.93)
                }
                .frame(width: UIScreen.main.bounds.width * 0.25)
                .clipped()

                AsyncImage(
                    url: URL(
                        string:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuB7B_ORgrzMVAzn-htq7okk_sV2-zubknWmdeCPC5YyBnXTFB5-pEnGxLUhgJS8Mu8XcxoQ4ZH-GWTOBoMRWWLiCwGeadprCA_F4hbA3mnFIrAz3H6LkFUhsdiy6i8ZePH_hwqskMNFV6h0Pm9nQR17ekhVxDiTJCxg4odCD6G7M6XslfmWhVk34wim09gnQyTba1G3OiA5Eggl0yNDeUCmBtbJpu5tNfmMgHgLrVeoYInN_UrtTrhxc8Yb-k_CBwHaDPgfxcOGR3Yl"
                    )
                ) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color(red: 0.96, green: 0.95, blue: 0.93)
                }
                .frame(width: UIScreen.main.bounds.width * 0.5)
                .clipped()

                AsyncImage(
                    url: URL(
                        string:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuARyivEa4K73CagAaakss47BJek7ZbxTuZmMDySdKenheUK0E5wI9GdoxgvndWMAu3aWVcx5MaTIn4sPfu-er5gAon0bx1R7wlUbfrvIhljRNRFKnOHU7lcOSMDldYtWAQKtDTjyZlzchXiJZraBlxKKszDrHjbaLlS9Qj6ETxwU40H3bIc-2MoMfgPeypyV8Y8PYX6LJm9rSZVP9E8YEkyjgWxt6iiNcYvUsXIl9rl6qK5BrCc9MX7WOqRfby7L7OAtaEEB-XhNLCP"
                    )
                ) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color(red: 0.96, green: 0.95, blue: 0.93)
                }
                .frame(width: UIScreen.main.bounds.width * 0.25)
                .clipped()
            }

            // Gradient Overlay
            LinearGradient(
                gradient: Gradient(stops: [
                    .init(color: Color.black.opacity(0.2), location: 0),
                    .init(color: Color.clear, location: 0.4),
                    .init(color: Color.black.opacity(0.4), location: 1),
                ]),
                startPoint: .top,
                endPoint: .bottom
            )

            // Content Overlay
            VStack(spacing: 0) {
                Text("PREMIUM JEWELRY")
                    .font(.system(size: 10, weight: .regular))
                    .tracking(4)
                    .foregroundColor(.white.opacity(0.9))
                    .padding(.bottom, 16)

                Text("Brand New Arrival")
                    .font(.custom("Georgia", size: 42))
                    .italic()
                    .foregroundColor(.white)
                    .padding(.bottom, 32)

                Button(action: {}) {
                    Text("SHOP NOW")
                        .font(.system(size: 12, weight: .semibold))
                        .tracking(3)
                        .foregroundColor(Color(red: 0.25, green: 0.22, blue: 0.20))
                        .padding(.horizontal, 40)
                        .padding(.vertical, 14)
                        .background(Color(red: 0.82, green: 0.71, blue: 0.55))  // Beige
                }
            }
        }
        .frame(height: UIScreen.main.bounds.height * 0.55)
    }

    // MARK: - Collection Header
    private var collectionHeaderView: some View {
        HStack(alignment: .bottom) {
            VStack(alignment: .leading, spacing: 4) {
                Text("NEW COLLECTION")
                    .font(.system(size: 10, weight: .regular))
                    .tracking(2)
                    .foregroundColor(Color(red: 0.6, green: 0.6, blue: 0.6))

                Text("The Pearl Series")
                    .font(.custom("Georgia", size: 28))
                    .italic()
                    .foregroundColor(Color(red: 0.25, green: 0.22, blue: 0.20))
            }

            Spacer()

            Button(action: {}) {
                Text("FILTER")
                    .font(.system(size: 11, weight: .regular))
                    .tracking(2)
                    .foregroundColor(Color(red: 0.5, green: 0.5, blue: 0.5))
                    .padding(.bottom, 4)
                    .overlay(
                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(Color(red: 0.85, green: 0.85, blue: 0.85)),
                        alignment: .bottom
                    )
            }
        }
        .padding(.horizontal, 24)
        .padding(.top, 48)
        .padding(.bottom, 24)
    }

    // MARK: - Product Grid
    private var productGridView: some View {
        let products: [(String, String, String, Bool)] = [
            (
                "Aurore Pearl Necklace", "$1,250",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAuiwcpPXDmhUygmvYubKksiP0Y8_fj1rSL6_1zIgbogTimzcnHsd9kRCuLF2y2kSMIlqYBW3lCCgIbr-mFaiIBQR-mLA5WYSwJM4iDLKS-8ryQVxtWguCra9krVFW5nzG2MFo_WHCtwpIvzIX9nc-1u5oXPU6DphALjEuSIUj10ighhbc7M6eP60Qz2wSfumpFoUw6sUBXC-F5HpiyZOxfzp04tbezIWTirkVs7XiN3Aje-Oz6pmvOIzDIlyMC0_TF6oFpl_v40NIQ",
                false
            ),
            (
                "Elysian Gold Ring", "$890",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDT9tTc_dXcx5eu9-bm1kUAADeIUancDxc_QuPsXmIVMRKZL-wHGNrhjpXQ71JaXkOuTWFV-d64SeW-_eDwtT6SqcFkvKzB7wCQiLy5v825lEOWYyPlmYYtLIW1YuMSgVI8T961NXBTxivHktd_x5n1hqfuPDY5FAv7jkRzBzy-e9R5QF9nmDw5kzxrrvKKwlWJgg_yqaAAcHo3Ra45trZC0vCT0Fd3aHCdKBLTLN0FfAHqX7Q4HiYacCLURemnI4ykmRDWMo_Xva6f",
                false
            ),
            (
                "Celeste Diamond Studs", "$2,100",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAs4RmqiRYhlEQQMR9z2KzonHOC2qzQnAn62H9Y44suSlUUqz6z3mhsb5da8nqXBctZ9EZUSY-h9znQup4MlSVPd6RsD8rby3ZyiKGjGx9QLx1jXt224-0R-xg8maF0ntudWhlrXpmKQaGpiPnq_yWa9WvgR9PYnL8vHWZz7sbzdzsIzXhOjQb6s0WFydalPa3VP5yMWv-cipSPZZFR6-BUr1dMt36rSpvwGzBmlBlvxLgFZJYcdOe6YoeiUtwRkSYUiXBr4MVqzb-y",
                false
            ),
            (
                "Luna Silk Choker", "$450",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDB0fLr9vnjQkrCGfijCA7DWL213iYlcjb-9MkxwFhEOwsAouPTuIu7WmoVMv4yxrqitG7lHuERwdGAgqDvw1j2MINPnAQejmBxxV7smJ5_eERyqfhSpR9GWJKcwNYoSDNhLU6AVP9F7ikFLzgRqjoHnFIIDfpM9mcd3t7pbUwvHnZyCC--fGlLK4dnVlqV-Revfi0ND9Vs4h4bApEbLA3elOh_UdswtAOKTAR9tCtiaAJL7eJHY-71fcMfF_71ufWl96xSV8mm6NlP",
                true
            ),
        ]

        return LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16),
            ], spacing: 24
        ) {
            ForEach(0..<products.count, id: \.self) { index in
                jewelryProductCard(
                    title: products[index].0,
                    price: products[index].1,
                    imageUrl: products[index].2,
                    isFavorite: products[index].3
                )
            }
        }
        .padding(.horizontal, 16)
    }

    private func jewelryProductCard(
        title: String, price: String, imageUrl: String, isFavorite: Bool
    ) -> some View {
        VStack(spacing: 0) {
            // Image
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: imageUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(3 / 4, contentMode: .fill)
                    default:
                        Color(red: 0.96, green: 0.95, blue: 0.93)
                    }
                }
                .frame(height: 220)
                .frame(maxWidth: .infinity)
                .background(Color(red: 0.96, green: 0.95, blue: 0.93))
                .clipped()

                Button(action: {}) {
                    Image(systemName: isFavorite ? "heart.fill" : "heart")
                        .font(.system(size: 14))
                        .foregroundColor(
                            isFavorite
                                ? Color(red: 0.82, green: 0.71, blue: 0.55)
                                : Color(red: 0.4, green: 0.4, blue: 0.4)
                        )
                        .padding(8)
                        .background(Color.white.opacity(0.8))
                        .clipShape(Circle())
                }
                .padding(12)
            }
            .shadow(color: .black.opacity(0.05), radius: 10, y: 4)

            // Content
            VStack(spacing: 4) {
                Text(title)
                    .font(.custom("Georgia", size: 16))
                    .foregroundColor(Color(red: 0.25, green: 0.22, blue: 0.20))
                    .multilineTextAlignment(.center)

                Text(price)
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 0.6, green: 0.6, blue: 0.6))
                    .padding(.top, 4)
                    .padding(.bottom, 12)

                // Shop Now Button
                Button(action: {}) {
                    Text("SHOP NOW")
                        .font(.system(size: 10, weight: .semibold))
                        .tracking(2)
                        .foregroundColor(Color(red: 0.35, green: 0.32, blue: 0.30))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color(red: 0.82, green: 0.71, blue: 0.55).opacity(0.15))
                }
            }
            .padding(.top, 16)
        }
    }

    // MARK: - Newsletter Section
    private var newsletterSectionView: some View {
        VStack(spacing: 0) {
            Text("Join the Inner Circle")
                .font(.custom("Georgia", size: 24))
                .foregroundColor(Color(red: 0.25, green: 0.22, blue: 0.20))
                .padding(.bottom, 8)

            Text("Early access to new arrivals and exclusive boutique events.")
                .font(.system(size: 12))
                .foregroundColor(Color(red: 0.5, green: 0.5, blue: 0.5))
                .multilineTextAlignment(.center)
                .frame(maxWidth: 240)
                .padding(.bottom, 24)

            VStack(spacing: 12) {
                TextField("Your email address", text: .constant(""))
                    .font(.system(size: 14))
                    .multilineTextAlignment(.center)
                    .padding(.vertical, 14)
                    .overlay(
                        Rectangle()
                            .stroke(Color(red: 0.75, green: 0.75, blue: 0.75), lineWidth: 1)
                    )

                Button(action: {}) {
                    Text("SUBSCRIBE")
                        .font(.system(size: 12, weight: .semibold))
                        .tracking(2)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color(red: 0.15, green: 0.15, blue: 0.15))
                }
            }
            .padding(.horizontal, 40)
        }
        .padding(.vertical, 48)
        .frame(maxWidth: .infinity)
        .background(Color(red: 0.96, green: 0.95, blue: 0.93))
        .padding(.top, 60)
    }

    // MARK: - Bottom Nav
    private var bottomNavView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                navItem(icon: "house", title: "Home", isActive: true)
                Spacer()
                navItem(icon: "diamond", title: "Collections", isActive: false)
                Spacer()
                navItem(icon: "heart", title: "Wishlist", isActive: false)
                Spacer()
                navItem(icon: "person", title: "Profile", isActive: false)
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white.opacity(0.95))
            .background(.ultraThinMaterial)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color(red: 0.9, green: 0.9, blue: 0.9)),
                alignment: .top
            )

            // Home Indicator
            RoundedRectangle(cornerRadius: 3)
                .fill(Color(red: 0.8, green: 0.8, blue: 0.8))
                .frame(width: 128, height: 4)
                .padding(.bottom, 8)
                .padding(.top, 4)
        }
        .background(Color.white)
    }

    private func navItem(icon: String, title: String, isActive: Bool) -> some View {
        Button(action: {}) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                Text(title.uppercased())
                    .font(.system(size: 9, weight: .medium))
                    .tracking(0.5)
            }
            .foregroundColor(
                isActive
                    ? Color(red: 0.82, green: 0.71, blue: 0.55)
                    : Color(red: 0.6, green: 0.6, blue: 0.6))
        }
    }
}

struct BrandNewArrivalView_Previews: PreviewProvider {
    static var previews: some View {
        BrandNewArrivalView()
    }
}
