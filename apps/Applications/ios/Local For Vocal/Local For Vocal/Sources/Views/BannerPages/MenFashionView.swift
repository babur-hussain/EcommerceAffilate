import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct MenFashionView: View {
    @Environment(\.presentationMode) var presentationMode

    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var beautyManager: BeautyManager
    @EnvironmentObject var basketManager: BasketManager
    @State private var showSearch = false
    @State private var navigateToCart = false

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                // Background
                Color.white
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Fixed Header
                    headerView

                    // Scrollable Content
                    ScrollView(showsIndicators: false) {
                        ZStack {
                            // Background MEN watermark
                            VStack(spacing: 0) {
                                ForEach(0..<3, id: \.self) { _ in
                                    Text("MEN")
                                        .font(.system(size: 120, weight: .black))
                                        .foregroundColor(
                                            Color(red: 0.1, green: 0.1, blue: 0.1).opacity(0.05))
                                }
                            }
                            .offset(x: 80, y: 100)

                            VStack(spacing: 0) {
                                // Hero Section
                                heroSectionView

                                // New Arrivals Section
                                newArrivalsSection

                                // Newsletter Section
                                newsletterSection

                                Spacer().frame(height: 120)
                            }
                        }
                    }
                }
            }
            .navigationBarHidden(true)
            .ignoresSafeArea(.all, edges: .bottom)
            .navigationDestination(isPresented: $navigateToCart) {
                CartPageView()
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .fullScreenCover(isPresented: $showSearch) {
            GlobalSearchView()
                .environmentObject(cartManager)
                .environmentObject(beautyManager)
                .environmentObject(basketManager)
        }
    }

    // MARK: - Header
    private var headerView: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 24))
                    .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))
            }

            Spacer()

            Text("ELEGANCE")
                .font(.system(size: 20, weight: .heavy))
                .tracking(-1)
                .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))

            Spacer()

            // Search Icon
            Button(action: {
                showSearch = true
            }) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 20))  // Matched size with other icons roughly or kept consistent
                    .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))
            }
            .padding(.trailing, 16)

            Button(action: {
                navigateToCart = true
            }) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "bag")
                        .font(.system(size: 24))
                        .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))

                    if cartManager.cartCount > 0 {
                        Text("\(cartManager.cartCount)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 14, height: 14)
                            .background(Color.red)
                            .clipShape(Circle())
                            .offset(x: 6, y: -6)
                    }
                }
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 16)
        .background(Color.white.opacity(0.8))
        .background(.ultraThinMaterial)
    }

    // MARK: - Hero Section
    private var heroSectionView: some View {
        VStack(spacing: 0) {
            // Model Image
            AsyncImage(
                url: URL(
                    string:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEuynzBd2nHSibVQI3wT2OYzuGstbDMjzOywD0pt_QxjXpHf4Sn-EXbxLa9ojrY6nc-CXj_nu2V8y0UWPpgbVxheV_7T_ukIzlxMBFtHwowGS6GaAkhkttWdKYdw0CmDgvKPwwXZWQR3EsKXNX4vghu4zFFbdPI8D62V6G345f0167V1nk_bF6xJKMXNmdzPJeCoZrRKixa5xhop_Nprz311RU-GTtfw0RfiqsEV9U_z0RP6TqzBNSCxF1hnZ0aRTfnvpgn7uZdCtG"
                )
            ) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .shadow(color: .black.opacity(0.2), radius: 20, y: 10)
            } placeholder: {
                Color.clear
            }
            .frame(height: 400)
            .padding(.top, 0)

            // Text Content
            VStack(spacing: 0) {
                Text("SPECIAL OFFER")
                    .font(.system(size: 12, weight: .semibold))
                    .tracking(4)
                    .foregroundColor(Color(red: 0.85, green: 0.47, blue: 0.02))  // Amber/Orange
                    .padding(.bottom, 8)

                Text("EXCLUSIVE")
                    .font(.system(size: 48, weight: .heavy))
                    .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))
                    .padding(.top, 40)  // Added padding to downshift
                Text("MEN'S")
                    .font(.system(size: 48, weight: .heavy))
                    .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))
                    .padding(.bottom, 16)

                // 50% OFF with lines
                HStack(spacing: 16) {
                    Rectangle()
                        .fill(Color(red: 0.8, green: 0.8, blue: 0.8))
                        .frame(width: 48, height: 1)

                    Text("50% OFF")
                        .font(.system(size: 28, weight: .light))
                        .italic()
                        .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))

                    Rectangle()
                        .fill(Color(red: 0.8, green: 0.8, blue: 0.8))
                        .frame(width: 48, height: 1)
                }
                .padding(.bottom, 32)

                // Shop Now Button
                Button(action: {}) {
                    Text("SHOP NOW")
                        .font(.system(size: 14, weight: .bold))
                        .tracking(3)
                        .foregroundColor(.white)
                        .padding(.horizontal, 40)
                        .padding(.vertical, 16)
                        .background(Color(red: 0.85, green: 0.47, blue: 0.02))
                        .cornerRadius(999)
                        .shadow(
                            color: Color(red: 0.85, green: 0.47, blue: 0.02).opacity(0.3),
                            radius: 16, y: 8)
                }
            }
            .offset(y: -40)
        }
    }

    // MARK: - New Arrivals Section
    private var newArrivalsSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Section Header
            HStack {
                Text("New Arrivals")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))

                Spacer()

                Button(action: {}) {
                    HStack(spacing: 4) {
                        Text("View All")
                            .font(.system(size: 14, weight: .semibold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(red: 0.85, green: 0.47, blue: 0.02))
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)

            // Horizontal Scroll Products
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    arrivalCard(
                        title: "Trench Collection",
                        subtitle: "Fall Essentials",
                        imageUrl:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDMtzXmq0wI6gDRY_hBGNUfm-b_trSkxzVn9ArA1J4CMFnqe_Uove6oCroh5adkzea1aqRSEGNOyFO4lfwx7yviVb3_pkIO1HWjNWuISCLQ0nxE4AjwaKurjOVYrXh-yK9reFHAYFVxp5OViwSb2viLhaOKI1XjDULWEFSPnsYHUA-BMAyGlBK8hmhaoKeS2YIcBzxfec1N69aKkMeKpScSRqikqG2NpwmDVWWEqoujCqNssMcThYLsnI4zOilwLYaA1CT0HTbWpVKs"
                    )

                    arrivalCard(
                        title: "Street Style",
                        subtitle: "Urban Vibe",
                        imageUrl:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuAEGLDO4V75reSP9RTq555WTOj5nIHeN_uc5moNrDj_0j7GoC9Fj6lDry-FRMs3lnYlnmcnp5URcvEASGFTy1LKQZkZ4pi-peTIWMITozVnKokEfQs9gtRj4ZlhzPV1FI_vlgfUtOkkIsVvjPUhAmxKfvwYizhwzYddMwGbucK24SfJvy4RZIsP4z6CltYMJ1rPD3IALRlrsbh6khsOgAR92zGhj-nBYPv5Z-6Ur40uhC69_-nm5N1P_DNMHuZgRqmqWStqF2-IrvdJ"
                    )
                }
                .padding(.horizontal, 24)
            }
        }
        .padding(.top, 40)
    }

    private func arrivalCard(title: String, subtitle: String, imageUrl: String) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: imageUrl)) { image in
                    image
                        .resizable()
                        .aspectRatio(3 / 4, contentMode: .fill)
                } placeholder: {
                    Color(red: 0.94, green: 0.94, blue: 0.96)
                }
                .frame(width: 240, height: 320)
                .background(Color(red: 0.94, green: 0.94, blue: 0.96))
                .cornerRadius(24)
                .clipped()

                Button(action: {}) {
                    Image(systemName: "heart")
                        .font(.system(size: 16))
                        .foregroundColor(Color(red: 0.3, green: 0.3, blue: 0.3))
                        .padding(10)
                        .background(Color.white.opacity(0.8))
                        .clipShape(Circle())
                }
                .padding(16)
            }

            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))

            Text(subtitle)
                .font(.system(size: 14))
                .foregroundColor(Color(red: 0.5, green: 0.5, blue: 0.5))
        }
    }

    // MARK: - Newsletter Section
    private var newsletterSection: some View {
        ZStack {
            // Background
            Color(red: 0.1, green: 0.12, blue: 0.14)

            // Decorative Circle
            Circle()
                .fill(Color.white.opacity(0.05))
                .frame(width: 160, height: 160)
                .offset(x: 100, y: 60)

            // Content
            VStack(alignment: .leading, spacing: 16) {
                Text("Winter is coming.")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.white)

                Text("Get first access to our limited winter drop.")
                    .font(.system(size: 14))
                    .foregroundColor(Color(red: 0.7, green: 0.7, blue: 0.75))
                    .frame(maxWidth: 200, alignment: .leading)
                    .padding(.bottom, 8)

                // Email Input
                HStack(spacing: 0) {
                    TextField("Email", text: .constant(""))
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(12, corners: [.topLeft, .bottomLeft])

                    Button(action: {}) {
                        Text("Join")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(red: 0.1, green: 0.12, blue: 0.14))
                            .padding(.horizontal, 20)
                            .padding(.vertical, 14)
                            .background(Color.white)
                            .cornerRadius(12, corners: [.topRight, .bottomRight])
                    }
                }
            }
            .padding(32)
        }
        .frame(height: 240)
        .cornerRadius(32)
        .padding(.horizontal, 24)
        .padding(.top, 48)
    }

}

struct MenFashionView_Previews: PreviewProvider {
    static var previews: some View {
        MenFashionView()
    }
}
