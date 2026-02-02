import SwiftUI

struct GrandMobilesView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background
            Color(red: 0.97, green: 0.98, blue: 0.99)  // background-light #F8FAFC
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Status Bar Placeholder (using standard safe area instead of hardcoded)

                // Header
                headerView

                // Scrollable Content
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Hero Section
                        heroSectionView

                        // Shop by Brand
                        shopByBrandSection

                        // Trending Now
                        trendingNowSection

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
                Image(systemName: "chevron.left")
                    .font(.system(size: 20))
                    .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))  // primary #001B44
                    .padding(8)
                    .background(Color.white.opacity(0.2))
                    .clipShape(Circle())
            }

            Spacer()

            HStack(spacing: 12) {
                Button(action: {}) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 20))
                        .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                        .padding(8)
                        .background(Color.white.opacity(0.2))
                        .clipShape(Circle())
                }

                Button(action: {}) {
                    Image(systemName: "bag")
                        .font(.system(size: 20))
                        .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                        .padding(8)
                        .background(Color.white.opacity(0.2))
                        .clipShape(Circle())
                }
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 16)
    }

    // MARK: - Hero Section
    private var heroSectionView: some View {
        GeometryReader { geometry in
            ZStack {
                // Vibrant Gradient Background
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(red: 0.31, green: 0.69, blue: 0.68),  // #4FB0AE
                        Color(red: 0.83, green: 0.89, blue: 0.83),  // #D4E2D4
                        Color(red: 1.0, green: 0.84, blue: 0.44),  // #FFD670
                        Color(red: 1.0, green: 0.57, blue: 0.28),  // #FF9248
                    ]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .overlay(
                    // Pattern Overlay Placeholder - mimicking the opacity: 0.15 texture
                    Color.black.opacity(0.05)
                )

                // Sparkles
                VStack {
                    HStack {
                        Image(systemName: "sparkles")
                            .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                            .font(.system(size: 24))
                            .padding(.top, 48)
                            .padding(.leading, 40)
                        Spacer()
                        Image(systemName: "sparkles")
                            .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27).opacity(0.4))
                            .font(.system(size: 24))
                            .padding(.top, 128)
                            .padding(.trailing, 48)
                    }
                    Spacer()
                    HStack {
                        Image(systemName: "sparkles")
                            .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                            .font(.system(size: 24))
                            .padding(.bottom, 160)  // Adjusted to not overlap phone too much
                            .padding(.leading, 64)
                        Spacer()
                    }
                }

                // Content
                VStack(spacing: 0) {
                    Text("Betul's Exclusive")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                        .tracking(-0.5)
                        .padding(.bottom, 8)

                    Text("GRAND MOBILES\nSALE")
                        .font(.system(size: 42, weight: .heavy))  // Plus Jakarta Sans style
                        .multilineTextAlignment(.center)
                        .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                        .lineSpacing(-10)  // Tight leading
                        .padding(.bottom, 32)

                    Button(action: {}) {
                        Text("GRAB NOW")
                            .font(.system(size: 18, weight: .black))
                            .tracking(2)
                            .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                            .padding(.horizontal, 40)
                            .padding(.vertical, 14)
                            .overlay(
                                RoundedRectangle(cornerRadius: 0)  // Square-ish styling from button
                                    .stroke(Color(red: 0.0, green: 0.11, blue: 0.27), lineWidth: 2)
                            )
                    }
                    .padding(.bottom, 48)

                    // Phones Row
                    HStack(alignment: .bottom, spacing: 4) {
                        phoneImage(
                            url:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuAxDDaHdTrwru2LB1m_bJMDHJJXXNMH6lz9-9S8rddKmEqEWunUOUFNIbDEZPU2d-YJNwhSmwIpL5fO0epqwuAxkKHsryedI3kKY1upVgvUY8zIeQO-cDyHSq6-D05NQA0G6nx_pJudqZF6b3iWA1wThCbVLqJxo19m7Zr0YUMv3dwjt7Sy6J4CKABFbQYaor4Ku67YWhfhByHnwYFOTfjsu2ML2U_ovNFWJfYxos7yBMXhlZSbcKqy41LlXGZAyT3a7GN-2zDoKY5S",
                            height: 128, yOffset: 16, totalWidth: geometry.size.width)
                        phoneImage(
                            url:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCksjqMHl_Le2OSvtMgyqEeMo6F3kf3fFLKon7RNfxaxt4-VznnUV60f8NxHfim6HzcFbPp8g1xan7gXkkXG7QTymUM5a914tPRdFunL5GAdNouDtxDqqI6FpYeDg6JV-k3vMn3Vv59V5b21elRNYMVaMKilZnTQRoZyFd8qQTod4AQNKx_50Hsy9Guqv8as_l56QtYgg078rgL15j1EsNxw-sR6S-PfuyZuHLEfjxyMvpmJXWCuVnkuVWnVFPiHYLR7HYRSG6lytlr",
                            height: 160, yOffset: 8, totalWidth: geometry.size.width)
                        phoneImage(
                            url:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuC4DwQQFVyxxqGSPaN4wzRr5wT8_Pxg_2e8k2v_Yl0MZKth5yEZ0-GNsJqwmF9RPLRiCD-rjf7we_aMQjZpHUtp1TvWjCLfelyn9fmQDv_cr3EY2QCHDdBw5TOaVRYb7CGmoppynojkVeRqDBe1jHlv9sYjOsyksxwT0JUxoEZLW1iynywhXwMOwAhvGzCBClt3kmUAm235KTz1Glg888FK2PVzSY1u6qtSsTcDUUCJ3_o2LUICviukV1fUqd9t1EzP_V_4lO9Jx4CR",
                            height: 176, yOffset: 0, totalWidth: geometry.size.width)
                        phoneImage(
                            url:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCg091i4f0WJO63g9R2MYlHnNsNj9ietAEt0alu3p_Gv7kC4JT_nSxqhB08EWp9OfAHdy7Rj0ruLnoXD-Rmr0Muiah_EoZme97POGFxEGjiqiRa3Blqk3gIhtA5VPFEP3ZPHyGxDbZOXUtZBATJcBrA5WG5tHRQND8hCBgx_07XkBH8mt4EFGDg6BlK3VOVh76jMkYj_lW5N-htmvzStxbHJxr1T3FEhfS97iw9UYThYNevDnjbBAAUYkl977CRmQtpRVAHTzkGSi7-",
                            height: 144, yOffset: 12, totalWidth: geometry.size.width)
                    }
                    .padding(.horizontal, 8)
                }
                .padding(.top, 32)
            }
            .frame(minHeight: 500)
            .cornerRadius(32)
            .padding(.horizontal, 16)
            .padding(.top, 8)
        }
        .frame(height: 520)  // Give fixed height for GeometryReader to work within ScrollView
    }

    private func phoneImage(url: String, height: CGFloat, yOffset: CGFloat, totalWidth: CGFloat)
        -> some View
    {
        AsyncImage(url: URL(string: url)) { image in
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
        } placeholder: {
            Color.gray.opacity(0.3)
        }
        .frame(width: (totalWidth - 64) / 4, height: height)
        .cornerRadius(12, corners: [.topLeft, .topRight])
        .shadow(color: .black.opacity(0.2), radius: 10, y: 5)
        .offset(y: yOffset)
    }

    // MARK: - Shop by Brand
    private var shopByBrandSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Shop by Brand")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))

                Spacer()

                Button(action: {}) {
                    Text("See All")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                }
            }

            HStack(spacing: 0) {
                brandItem(icon: "apple.logo", name: "Apple")
                Spacer()
                brandItem(icon: "smartphone", name: "Samsung")  // approximated icon
                Spacer()
                brandItem(icon: "g.circle.fill", name: "Google")  // approximated icon
                Spacer()
                brandItem(icon: "ellipsis.circle", name: "Others")  // approximated icon
            }
        }
        .padding(.horizontal, 24)
        .padding(.top, 32)
    }

    private func brandItem(icon: String, name: String) -> some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(Color.white)
                    .frame(width: 56, height: 56)
                    .shadow(color: .black.opacity(0.05), radius: 4, y: 2)

                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
            }

            Text(name)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))  // Dark navy
        }
    }

    // MARK: - Trending Now
    private var trendingNowSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Trending Now")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                .padding(.horizontal, 24)

            // Trending Card
            ZStack(alignment: .trailing) {
                Color(red: 1.0, green: 0.92, blue: 0.92)  // #FFEBEB

                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("NEW ARRIVAL")
                            .font(.system(size: 10, weight: .bold))
                            .tracking(2)
                            .foregroundColor(.red)
                            .padding(.bottom, 4)

                        Text("iPhone 15\nSeries")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(red: 0.0, green: 0.11, blue: 0.27))
                            .lineLimit(2)

                        Text("Save up to 20% today")
                            .font(.system(size: 14))
                            .foregroundColor(Color.gray)
                            .padding(.bottom, 12)

                        Button(action: {}) {
                            Text("Explore")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color(red: 0.0, green: 0.11, blue: 0.27))
                                .cornerRadius(999)
                        }
                    }
                    .padding(.leading, 24)
                    .padding(.vertical, 24)

                    Spacer()

                    AsyncImage(
                        url: URL(
                            string:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBVV4YQT7IkJity6Ll4xYYghfXwEIIkTuqN-tN8iFCCYUakCOEcQuw4-oimostQWNU6COhUpptI2X5yR4gsFmNKmN8HYJE5iGnMX0pOgHBKx7pxq7PrYjzbc9zK6FoXhCSp8f3sDye0IOeWnTK_bmys5g1watgJWkCIXOdrZMmY6d_JI_X4jzVYILVz0XFQOXUBBTMxbANODeO84DENHZ3mg6nFH0Ll7feupW-r1PKtePcnKh1ZhPOaSdy_h0yz5LdEyff6-IbvM7sO"
                        )
                    ) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 128, height: 128)
                    .padding(.trailing, 16)
                }
            }
            .cornerRadius(24)
            .padding(.horizontal, 24)
        }
        .padding(.top, 40)
    }

    // MARK: - Bottom Nav
    private var bottomNavView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                navItem(icon: "house.fill", title: "Home", isActive: true)
                Spacer()
                navItem(icon: "square.grid.2x2", title: "Shop", isActive: false)
                Spacer()
                navItem(icon: "heart", title: "Wishlist", isActive: false)
                Spacer()
                navItem(icon: "person", title: "Profile", isActive: false)
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color(red: 0.94, green: 0.95, blue: 0.96)),  // border-slate-100
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
                    .font(.system(size: 24))
                Text(title)
                    .font(.system(size: 10, weight: .bold))
            }
            .foregroundColor(
                isActive
                    ? Color(red: 0.0, green: 0.11, blue: 0.27)
                    : Color(red: 0.58, green: 0.64, blue: 0.72))  // slate-400
        }
    }
}

struct GrandMobilesView_Previews: PreviewProvider {
    static var previews: some View {
        GrandMobilesView()
    }
}
