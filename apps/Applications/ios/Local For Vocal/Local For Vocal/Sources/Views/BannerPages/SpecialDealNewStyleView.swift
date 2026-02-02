import SwiftUI

struct SpecialDealNewStyleView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background
            Color(red: 0.97, green: 0.97, blue: 0.97)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Yellow Status Bar
                statusBarView

                // Scrollable Content
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Hero Banner
                        heroBannerView

                        // Categories
                        categoriesView

                        // Product Grid
                        productGridView

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

    // MARK: - Status Bar (Yellow)
    private var statusBarView: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.black)
            }

            Spacer()

            Text("Special Deal")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.black)

            Spacer()

            Image(systemName: "bag")
                .font(.system(size: 18))
                .foregroundColor(.black)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
        .background(Color(red: 0.96, green: 0.62, blue: 0.04))  // Amber/Yellow
    }

    // MARK: - Hero Banner
    private var heroBannerView: some View {
        ZStack {
            // Yellow Background
            Color(red: 0.98, green: 0.75, blue: 0.14)

            // Left Model Image
            HStack {
                AsyncImage(
                    url: URL(
                        string:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDiudnkGGS8iv8yHHsfCe0T_jPjoBJB-BKtT-G1-O_2qL8l_riR9fE0gVO_g4grD4H9KihNXY3FzuTU4Pzj0Fk7_UVTxCS50ORa8MqJf9Z39zq0rB3vdLyxiVWXfJrGLsx_9JkGVltu2EtEQAj0OeDDf2o5uqIQc2dz4sblUiW5F_GOtlQtTr_uBzTG22UYIJsSVqDfwt-vyHHxPTW76FOKS5Gh0yvkNENaeUnoaKklygpcRkXNZwqpGL8Ltkzwn9POSgL0k-Jle7CL"
                    )
                ) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                        .opacity(0.8)
                } placeholder: {
                    Color.clear
                }
                .frame(width: 120, height: 200)
                .offset(x: -30)

                Spacer()

                AsyncImage(
                    url: URL(
                        string:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuCYbSFDGkRQ39hB1urhej9EeN6fynAc1PnGTp0f7f-mqinpAq9p4TIL2DVUx7KlsuMy5qCAkYpYk4uqAC5QCcfJZursg1wr80ShbqNtSOqWCt3UfcvLhKydIv_6VB40uJoaBuQ9x7cN7sS-qIr9r2iBtbUlwp7vPwnRyS4-fbP0k7Ad_a5JOp4NvDBM6Etf6nOsRzMlg_VNa9wnYMy9QQCL3c3-rmvP_da9PJs7pKgcSWtv9KXQCCMLWG8A1ZMNaQGMn4fHtm8aAA2q"
                    )
                ) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                        .opacity(0.8)
                } placeholder: {
                    Color.clear
                }
                .frame(width: 120, height: 200)
                .offset(x: 30)
            }

            // Center White Card
            VStack(spacing: 8) {
                Text("SPECIAL DEAL")
                    .font(.system(size: 12, weight: .semibold))
                    .tracking(4)
                    .foregroundColor(Color(red: 0.2, green: 0.2, blue: 0.2))

                Text("NEW STYLE")
                    .font(.system(size: 36, weight: .black))
                    .tracking(2)
                    .foregroundColor(.black)

                // 60% OFF Badge
                ZStack {
                    Rectangle()
                        .fill(Color(red: 0.98, green: 0.45, blue: 0.09))  // Orange
                        .frame(width: 140, height: 40)
                        .rotationEffect(.degrees(-6))

                    Text("60% OFF")
                        .font(.system(size: 20, weight: .bold))
                        .italic()
                        .foregroundColor(.white)
                }
                .padding(.top, 8)
            }
            .padding(.vertical, 30)
            .padding(.horizontal, 40)
            .background(Color.white)
            .rotationEffect(.degrees(-2))
            .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
        }
        .frame(height: 280)
    }

    // MARK: - Categories
    private var categoriesView: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                categoryPill("All Items", isActive: true)
                categoryPill("Floral", isActive: false)
                categoryPill("Denim", isActive: false)
                categoryPill("Dresses", isActive: false)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
        .padding(.vertical, 16)
    }

    private func categoryPill(_ text: String, isActive: Bool) -> some View {
        Text(text.uppercased())
            .font(.system(size: 11, weight: .semibold))
            .tracking(1)
            .foregroundColor(isActive ? .white : .black)
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(isActive ? Color.black : Color.white)
            .overlay(
                Rectangle()
                    .stroke(Color(red: 0.9, green: 0.9, blue: 0.9), lineWidth: isActive ? 0 : 1)
            )
    }

    // MARK: - Product Grid
    private var productGridView: some View {
        let products: [(String, String, String, String?, String, Bool)] = [
            (
                "Tropical Floral Shirt", "Men's Summer", "$24.00", "$60.00",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBlQD9lZXYQQXLs8TvAXTIHlUI9-9ZKWSxfRiYS8EFD5ECwVo1xblM8-lXgYjxWJWqVvo8xoJm_7xVekIkkJYTyS3vhusEmhSey0-dbk3b6lqI2TI_-QjZDpPvPKkqx4opqtfFF0LdhpKW2Dny8T7uoVniiovqnRqG1MrcFUYkspWO_1zvG36kD56D4TyDmwQSsVbvNNu7w5xCGtAMI45McEJgW982EzwYUbHyb0osB7M42DMzvm3yGra_nqqAwAoLGWEyTZnVAVpsQ",
                true
            ),
            (
                "Boho Mini Dress", "Women's Style", "$45.00", nil,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA99JRQY8uejhzJpX0c98eaWozoX7eEhLAxy00pyv6KjYNKfmFMlG2rMBErNITBo3x0fAL5n80l6k3B45prkz7bqfJqRWay7PMDsqHHDQ7GbVVO9fq1Mb1-LcyCmYhV8P9Yax8T_qrNsbzaAwfQ6QF-zesR0G3gbGtDmohxNDXabiCpDmDvHiEeAUa01H_oUahtMiuvDdlo7elXksC_peEYUHZbxgl8-rh941c7n6p-HKYlWFmWvLvJrcJRexG4Kgyrj-VJDBH23C8r",
                false
            ),
            (
                "Classic Raw Denim", "Denim Essential", "$32.00", "$80.00",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAXSeRlVvlQebnbrWnusc3SxRYNfhtUTv364cKQGVDBJ5_vp9jYWx5E0qvSHdEEwz2ra42ZjvD3TviyewTRuoaNdqFNlZcpNzq5W2_bI02iZrSfpbB6CSoj2orhyHnHwLmigu4JL0Vu-ch0VtnhmlRn_xzURJyBh7L7Owcl4KkzQbaNfl4rdQoyNCk8GlseqtXFdYg9BwhIhrXJ7M1WVEeb0HaMpiS6KB6IS4TkgmhtGgX7OLQhD_RSYZf8UBDx6KF7qk61ijBstYJY",
                true
            ),
            (
                "Retro Wayfarer", "Accessories", "$18.00", nil,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDKt7HCwiWoAm6DEo4I_cmJcvcQs2pCHcIoDf7Rvkv8ZATzeQcvrVuEbolWxPxXLnuITLwJQ9CuGlAsCSYkz6ySImnzMoSZceFQPNznZ8kbL9Loi5wKEMyrkVicLr_A4VSQqpVBbljsyUQMXOwbdqSQ9pYTEp_dGvhpx3ZsX1y4e-m9qge0blA7Dkq3MSeBuxp-eXryFt6BDaRqmUrckoFFgJYuWd2LyVCfMH1omnvR_5c9iYOrADtjWYWIu823Y4LzEuQ-NJ1YEvNf",
                false
            ),
        ]

        return LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16),
            ], spacing: 16
        ) {
            ForEach(0..<products.count, id: \.self) { index in
                productCard(
                    title: products[index].0,
                    category: products[index].1,
                    price: products[index].2,
                    originalPrice: products[index].3,
                    imageUrl: products[index].4,
                    hasDiscount: products[index].5
                )
            }
        }
        .padding(.horizontal, 16)
    }

    private func productCard(
        title: String, category: String, price: String, originalPrice: String?, imageUrl: String,
        hasDiscount: Bool
    ) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image with Badge
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: imageUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(3 / 4, contentMode: .fill)
                    default:
                        Color.gray.opacity(0.1)
                    }
                }
                .frame(height: 200)
                .frame(maxWidth: .infinity)
                .clipped()

                if hasDiscount {
                    Text("60% OFF")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(red: 0.98, green: 0.45, blue: 0.09))
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(category.uppercased())
                    .font(.system(size: 9, weight: .bold))
                    .foregroundColor(Color.gray)

                Text(title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.black)
                    .lineLimit(1)

                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(price)
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(
                            hasDiscount ? Color(red: 0.98, green: 0.45, blue: 0.09) : .black)

                    if let original = originalPrice {
                        Text(original)
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                            .strikethrough()
                    }
                }
                .padding(.bottom, 12)

                // Shop Now Button
                Button(action: {}) {
                    Text("SHOP NOW")
                        .font(.system(size: 10, weight: .bold))
                        .tracking(2)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .overlay(
                            Rectangle()
                                .stroke(Color.black, lineWidth: 2)
                        )
                }
            }
            .padding(16)
        }
        .background(Color.white)
        .overlay(
            Rectangle()
                .stroke(Color(red: 0.95, green: 0.95, blue: 0.95), lineWidth: 1)
        )
    }

    // MARK: - Bottom Nav
    private var bottomNavView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                navItem(icon: "house", title: "Home", isActive: true)
                Spacer()
                navItem(icon: "magnifyingglass", title: "Search", isActive: false)
                Spacer()
                navItem(icon: "heart", title: "Saved", isActive: false)
                Spacer()
                navItem(icon: "bag", title: "Cart", isActive: false)
                Spacer()
                navItem(icon: "person", title: "Profile", isActive: false)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .background(Color.white)
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
                    .font(.system(size: 9, weight: .bold))
            }
            .foregroundColor(isActive ? Color(red: 0.96, green: 0.62, blue: 0.04) : Color.gray)
        }
    }
}

struct SpecialDealNewStyleView_Previews: PreviewProvider {
    static var previews: some View {
        SpecialDealNewStyleView()
    }
}
