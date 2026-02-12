import SwiftUI

struct WomenCollectionView: View {
    @Environment(\.presentationMode) var presentationMode

    // Constants from RN
    let categories = ["Western", "Ethnic", "Luxe", "Accessories", "Activewear"]
    let subCategories: [(name: String, image: String)] = [
        (
            "Dresses",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCKKsWNx-7kEcxlgVUzEHgoG64-9MNTZOur82nZavgM1Nc3OUiCJt_TSr5KWBoCcEsro9fdwJnwsdEO3Hy4HHKLepOJa6Yx8jvyBiT4DFcPSzaOHlPAV_HCqtlXkPAnQJoeH4uWPwDuCRvBk-GYqD9VVKIcVENSaw1pRhdVotBKcoDtONvdI3PXV7xiO86Nwz49ElQANWJSxape8TmkjKNRfhik02sPkyCzpiRKvzQbtLvVrHqXqC9HZvYzLf-GVcT1K_aojKFhJVtH"
        ),
        (
            "Kurta Sets",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB2vP8Mlne2objfu4XQf4oG2pIGZAQ3aKJF0enwEImMW94bCDn8EroMO0FNG13ErudRoHkjE4PBkRkL5u4DEaRx80XIBX4Zh8p0PG0euUmJKPbnDhREZm5EqRy880CYjXnoTCwamG1aJdyyO5ZOlvN_EfYEKVHKbZcx9YYSrMJnpuUc0LZVW1GSRUPvBsl0cMZEn2WEgBCnR8itSxcDpzUSNKjXbRVRSO3cyax20KrWxVBXaYZQnHLGe41SHu6JExwIs4i3Z8Xhei9H"
        ),
        (
            "Handbags",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB7mqZAiS9jux-sBIEfnk7pSk_rXG-EBSOUFXKXQ7e_Dw_gePUNyGRl8PYW1HsgLoH4lm4uAIF-mA7qk9KIv9ee6PPkfTbuYD772N6aTldY21CaXvMnvETKnXtgZxxsgjgHrDHvbL_RyJCC_34M20atBFqNcxwzmzr5apSnPpgYoLy0yInncaiE4mIV8S1YGQZhZ3BsVY3zmFi7cPssGU4nYaah0ZLkaNgEFObkgcebaGOiam-LsjSk8cikee_q_4Fi6E8R6KkijyrJ"
        ),
        (
            "Heels",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAmYp3FgtXkKe3Yh7yRpkofxE0QMT8aZtCgFyitT11pLpUvn63g4e92VO_eiKG7TWVt9UcYr1bi4HLHTIad5TmHXAd6rywXv2VUjwxyDml4azadN88c_n7VuXrlUPsHsm7kJITolfQlHhzJGChmVukxLgfOw5itQRrD21DqHrmVgvFEI9H8x9ZXCWOAkSv2niLpisDurJAK-Jl2Se-TKjCSurJPS8qqeUEB2mJVUS5poP_BEXxkP-jPMnUXDKtZoPJ9JgKePP2zCFBu"
        ),
        (
            "Jewelry",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAJDx4heTiJSnD7HMsl6zZkrK--j9AGSMFZuHhq2IuQHoUcACznJ3McMjqqLrUXDqkPXbFrjCh1V9MRa3ifKzNbTMnJOyLZL3S6Lh17PW4iq1YCw4VfAKBxJ8Hv8Z6f_05rnPT1A8sIoLzVzS2HZbGXo9BS-PigMS_hmb-cq4I0aJFdsZBQxkOEiiLIDe9a4QGiA5zNyCvlgx5GujRCqk6kl56hdXUBHM4b1ZpRl_6_wP2IuoBugRRlGaySyaU0P4qOidij5rvJzJGj"
        ),
        (
            "Watches",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBksqkdTz3XxSC1NoFe-paTB76fB8LEmR6p4xdXYovZLpgwqBpTPnboAW0q7v4jrZeCwAPoHMEG_HWmfL4GOlkYWuQHx2XACNvtBKyD7QlZLFiRjeU0HurcBn7E_dWsNoq6GfXxPRjsBRwx7qNG-kXrJS54O2eYCJ5eXiQqSH5gSt3D81WdM1OKbYprHurmWZYLmg5mfl_t7OnmOcpie9UCqOYwHV2QbKJwjxmOvGYhm_LxBiIDXH2647kDBBRWkEVmGkTqD48zeoCC"
        ),
        (
            "Bottoms",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCpaZxyGCBKY_K4CrA8x3zYu6_pvEW8UJYxyjynVCAzhR7F9peYP5PJu7cluCmKu7eN3e8RGHYacWU_WcwbxrRWq0A0HlvXyJVPiSkIC0MPWoVcsOz6dbF7tbKs-ySeC0CuXuOx0Niz2cqA3YIbUtMYK-rtwqymlxjhbLxDDYb6wIUQJMCtUAOE6GwJv9IKA22nl6YQI0G0KrVo5tjUsQy2oKGJj3RyEAt37j9AbBWM6UjAxvLzRR-R-RrGbBnAeULT5W6h7mJlS9ZA"
        ),
        (
            "Sunglasses",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ReQ8pxQcN6X2F1xii7GeNInLZXf4msMppSKROOgjlKTiKvcovbUXeW9_sCzjRc0e_ahM5oiaQTwhFfpp-8xLwIVJwIdMXiFZgxzS0Z7Ki3wUZ8zA8vzIvvTt2sw8tThQi0ozTmwmlc9L9iOJhEM5Bwb5AtL9JO8Cbmr2if-5j--F7hRVrPVXR1FbqodhEvof5GluP6DhT8y24nPVWwjgukAsaTJtR5Rc72ACq19ZCnPbzSDbHybRnvz_3YwulPZtzqkaCAjDC6aH"
        ),
    ]

    // COLORS
    let primaryColor = Color(hex: "#376F7C")
    let secondaryColor = Color(hex: "#D8B08C")
    let backgroundLight = Color(hex: "#FAF7F2")
    let surfaceLight = Color(hex: "#F2EDE5")
    let textMain = Color(hex: "#22252a")
    let textMuted = Color(hex: "#6c7c7f")

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                backgroundLight.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Header
                    HStack(spacing: 12) {
                        Button(action: {
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 40, height: 40)
                                .overlay(Image(systemName: "arrow.left").foregroundColor(textMain))
                                .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                        }

                        // Search Bar
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(primaryColor)
                            Text("Search designers, styles...")
                                .foregroundColor(textMuted)
                                .font(.system(size: 16, weight: .medium))
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .frame(height: 48)
                        .background(Color.white)
                        .cornerRadius(24)
                        .shadow(color: primaryColor.opacity(0.05), radius: 20, x: 0, y: 4)

                        Button(action: {}) {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 40, height: 40)
                                .overlay(
                                    ZStack {
                                        Image(systemName: "bell")
                                            .foregroundColor(textMain)
                                        Circle()
                                            .fill(secondaryColor)
                                            .frame(width: 8, height: 8)
                                            .offset(x: 4, y: -4)
                                    }
                                )
                                .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(backgroundLight.opacity(0.95))

                    // Categories
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(Array(categories.enumerated()), id: \.offset) { index, cat in
                                Text(cat)
                                    .font(
                                        .system(size: 14, weight: index == 0 ? .semibold : .medium)
                                    )
                                    .foregroundColor(index == 0 ? .white : textMain)
                                    .padding(.horizontal, 20)
                                    .frame(height: 36)
                                    .background(index == 0 ? primaryColor : surfaceLight)
                                    .cornerRadius(18)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 4)
                    }
                    .padding(.bottom, 8)

                    // Content
                    ScrollView {
                        VStack(spacing: 24) {
                            // Hero Section
                            ZStack(alignment: .bottomLeading) {
                                CachedAsyncImage(
                                    url: URL(
                                        string:
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuCWMEyYMVfSHhKIiqrG0BFfBtpM5oT7f5aC2cDexPxWyXACit1PnvxAZ2fcsPSskV7AbHp9fsLP4q1egPLJoza9h2JffHBvA1kCrIpg5AXROITqONfuJP9KWgz-A0-GvxfzfiL4VfULVgxCMjFA5iV8z077i1rJpZoFTEM2qmrYR5qPn-u5FnkNNlzRluWk5LAK27lJWB8tg3GX6Uvs6QumeU6DCIj2h39cb6O-EqghnXJLcZkDzYrQY0rfeLkXgl9qALqss5UsQ5ZF"
                                    )
                                ) { image in
                                    image.resizable().aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Color.gray.opacity(0.3)
                                }
                                .frame(height: 460)
                                .clipped()

                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        .clear, .black.opacity(0.1), .black.opacity(0.6),
                                    ]), startPoint: .top, endPoint: .bottom
                                )
                                .frame(height: 230)

                                VStack(alignment: .leading, spacing: 16) {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("The Spring\nFloral Edit")
                                            .font(
                                                .system(size: 36, weight: .medium, design: .serif)
                                            )
                                            .foregroundColor(.white)
                                        Text("Bloom with elegance.")
                                            .font(.system(size: 18))
                                            .foregroundColor(.white.opacity(0.9))
                                    }

                                    Button(action: {}) {
                                        HStack(spacing: 8) {
                                            Text("Shop the Look")
                                                .fontWeight(.bold)
                                            Image(systemName: "arrow.right")
                                        }
                                        .font(.system(size: 14))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 24)
                                        .padding(.vertical, 12)
                                        .background(secondaryColor)
                                        .cornerRadius(12)
                                        .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
                                    }
                                }
                                .padding(24)
                            }
                            .cornerRadius(16)
                            .padding(.horizontal, 16)
                            .padding(.top, 8)

                            // Sub Categories Grid
                            LazyVGrid(
                                columns: Array(
                                    repeating: GridItem(.flexible(), spacing: 12), count: 4),
                                spacing: 12
                            ) {
                                ForEach(subCategories, id: \.name) { item in
                                    VStack(spacing: 8) {
                                        ZStack {
                                            surfaceLight
                                            CachedAsyncImage(url: URL(string: item.image)) {
                                                image in
                                                image.resizable().aspectRatio(contentMode: .fill)
                                            } placeholder: {
                                                Color.gray.opacity(0.1)
                                            }
                                        }
                                        .frame(
                                            width: (geometry.size.width - 68) / 4,
                                            height: (geometry.size.width - 68) / 4
                                        )
                                        .cornerRadius(16)
                                        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)

                                        Text(item.name)
                                            .font(.system(size: 12, weight: .semibold))
                                            .foregroundColor(textMain)
                                            .multilineTextAlignment(.center)
                                    }
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.top, 8)

                            // Trending Section
                            VStack(alignment: .leading, spacing: 20) {
                                Text("Trending for You")
                                    .font(.system(size: 24, weight: .semibold, design: .serif))
                                    .foregroundColor(textMain)

                                VStack(spacing: 24) {
                                    // Card 1
                                    TrendingCard(
                                        image:
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Oo1nZKXGGqOkuRCXFOKA7srndEVXEaYUCnRtI3SZ1gLKoYKHx5D3YxQjbrwUFHl5PB9f23jQSPgUq8YdJkcnh6hC8xxsIxdHvUR4pBWgdvlCT-mw8hF2pkxW0TV7CbM6GsubCxkfvspWHNUu33gxDl7XYhThH-XeuQklG1z-hl0UoIJzTNN9f9pm-HTego4z62qvM9GfAOg2A1x1qqYcgRu25gOlpbNJmv-e-JxmP_UbVJkIGHV_TlR2zjJjdx6VxIO6O8k1YpJ3",
                                        badge: "NEW SEASON",
                                        title: "Satin Slip Dresses"
                                    )

                                    // Card 2
                                    TrendingCard(
                                        image:
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDEGb5afFGFiBY8qbiW_kHE_Bd7cmDatWW5OWiYdzTeM0EXefomGJmOstOrqRcsKzxhTE2ZCGzqfL5Bfb4xIojeqNpNMYezyy137pYCzXK1R6jSrAHpq9BrG72C4wdSXuJueoZr2yG64mS1DLKTb-rgvocJWD3F0B-0SWONSFkOTuZuunpiwCHz85Tnltv6vZUY8SdbM3Sfy1DI8WzU6VwcZqVMEoGW4Dhjqcdlmbqf2Br0MOmjLFyfDSdE1Bwudce3cbCa743xCKmw",
                                        badge: "WEDDING EDIT",
                                        title: "Embroidered Lehengas"
                                    )
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.bottom, 40)
                        }
                    }
                }
            }
        }
        .navigationBarHidden(true)
    }
}

struct TrendingCard: View {
    let image: String
    let badge: String
    let title: String

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            CachedAsyncImage(url: URL(string: image)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.gray.opacity(0.3)
            }
            .frame(height: 320)
            .clipped()

            LinearGradient(
                gradient: Gradient(colors: [.clear, .black.opacity(0.5)]), startPoint: .center,
                endPoint: .bottom)

            VStack(alignment: .leading, spacing: 8) {
                Text(badge)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 4)
                    .background(Color.white.opacity(0.2))
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8).stroke(
                            Color.white.opacity(0.3), lineWidth: 1))

                Text(title)
                    .font(.system(size: 24, design: .serif))
                    .foregroundColor(.white)
            }
            .padding(20)

            // Heart Icon Top Right
            VStack {
                HStack {
                    Spacer()
                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 40, height: 40)
                        .overlay(Image(systemName: "heart").foregroundColor(.white))
                }
                Spacer()
            }
            .padding(16)
        }
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}
