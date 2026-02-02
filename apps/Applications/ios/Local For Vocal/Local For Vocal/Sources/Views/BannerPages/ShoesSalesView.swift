import SwiftUI

struct ShoesSalesView: View {
    @Environment(\.presentationMode) var presentationMode

    // Custom Colors
    private let primaryColor = Color(red: 0.99, green: 0.76, blue: 0.16)  // #fcc228
    private let accentColor = Color(red: 0.49, green: 0.07, blue: 1.0)  // #7d12ff
    private let bgLight = Color(red: 0.97, green: 0.98, blue: 0.98)  // #f8f9fa

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.white.ignoresSafeArea()

            // Main Content
            VStack(spacing: 0) {
                // Header Area with Yellow Background
                ZStack(alignment: .top) {
                    primaryColor.ignoresSafeArea()

                    // Decorative patterns
                    GeometryReader { geometry in
                        // Triangle top right
                        Path { path in
                            path.move(to: CGPoint(x: geometry.size.width - 50, y: 20))
                            path.addLine(to: CGPoint(x: geometry.size.width + 10, y: 80))
                            path.addLine(to: CGPoint(x: geometry.size.width - 60, y: 80))
                        }
                        .fill(Color.white.opacity(0.2))
                        .rotationEffect(.degrees(12))

                        // Circle bottom left
                        Circle()
                            .stroke(Color.white, lineWidth: 8)
                            .frame(width: 100, height: 100)
                            .opacity(0.1)
                            .offset(x: -20, y: geometry.size.height - 40)
                    }

                    VStack(spacing: 0) {
                        // Top Navigation
                        HStack {
                            Button(action: {
                                presentationMode.wrappedValue.dismiss()
                            }) {
                                Image(systemName: "chevron.left")
                                    .font(.system(size: 18, weight: .bold))  // arrow_back_ios_new
                                    .foregroundColor(.white)
                                    .padding(8)
                                    .background(Color.white.opacity(0.2))
                                    .clipShape(Circle())
                            }

                            Spacer()

                            HStack(spacing: 12) {
                                Button(action: {}) {
                                    Image(systemName: "magnifyingglass")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(.white)
                                        .padding(8)
                                        .background(Color.white.opacity(0.2))
                                        .clipShape(Circle())
                                }

                                Button(action: {}) {
                                    ZStack(alignment: .topTrailing) {
                                        Image(systemName: "bag")
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(.white)
                                            .padding(8)

                                        Text("2")
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.white)
                                            .frame(width: 16, height: 16)
                                            .background(accentColor)
                                            .clipShape(Circle())
                                            .overlay(Circle().stroke(primaryColor, lineWidth: 2))
                                            .offset(x: 4, y: 0)
                                    }
                                    .background(Color.white.opacity(0.2))
                                    .clipShape(Circle())
                                }
                            }
                        }
                        .padding(.horizontal, 24)
                        .padding(.horizontal, 24)
                        .padding(.top, 60)  // Safe area adjustment handled by ignoreSafeArea typically

                        // Title
                        VStack(alignment: .leading, spacing: 4) {
                            Text("50% OFF")
                                .font(.system(size: 40, weight: .black))
                                .italic()
                                .foregroundColor(.white)
                            Text("FOOTWEAR SALE")
                                .font(.system(size: 40, weight: .black))
                                .italic()
                                .foregroundColor(.white)
                                .lineLimit(1)
                                .minimumScaleFactor(0.8)

                            Text("SPECIAL PRICE UP TO 50% OFF")
                                .font(.system(size: 14, weight: .bold))
                                .italic()
                                .foregroundColor(Color.white.opacity(0.9))
                                .tracking(1)
                                .padding(.top, 4)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 24)
                        .padding(.top, 24)
                        .padding(.bottom, 60)  // Space for the overlap
                    }
                }
                .frame(height: 340)  // Fixed height for header area

                // Scrollable Body
                ScrollView(showsIndicators: false) {
                    ZStack(alignment: .top) {
                        // White Background Layer
                        bgLight
                            .cornerRadius(30, corners: [.topLeft, .topRight])
                            .padding(.top, 80)  // Push background down so card overlaps top

                        VStack(spacing: 24) {
                            // Featured Product Card
                            featuredProductCard
                            // .padding(.top, -60) // Removed negative padding, handled by ZStack alignment

                            // Flash Sale Section
                            flashSaleSection

                            Spacer().frame(height: 100)
                        }
                        .padding(.horizontal, 20)
                    }
                }
                .padding(.top, -80)  // Move ScrollView up to overlap header significantly
            }
            .ignoresSafeArea(edges: .top)

            // Bottom Nav
            bottomNavView
        }
        .navigationBarHidden(true)
        .ignoresSafeArea(.all, edges: .bottom)
    }

    // MARK: - Featured Product
    private var featuredProductCard: some View {
        ZStack {
            Color.white

            // Curved Accent Background
            GeometryReader { geo in
                VStack {
                    primaryColor.opacity(0.1)
                        .frame(height: geo.size.height * 0.55)
                        .clipShape(CurvedBottomShape())
                    Spacer()
                }
            }

            VStack {
                HStack {
                    Text("New Arrival")
                        .font(.system(size: 10, weight: .bold))
                        .textCase(.uppercase)
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(accentColor)
                        .clipShape(Capsule())
                    Spacer()
                    Image(systemName: "heart")
                        .foregroundColor(Color.gray.opacity(0.5))
                }
                .padding(.horizontal, 24)
                .padding(.top, 24)

                // Shoe Image
                AsyncImage(
                    url: URL(
                        string:
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuAEbKXkrU9m09ROnV_bRa8vS2jxQCkQ2NWtdK0COAkjh9OVdWXb7lJXOY5wnv7gi2S9CUMEv444RXL8hwxR-bp_xaNnpGcMuqPx6o1OT_RwJK1N5GMngjxgNlH3vvb4f7mgQORdqUIdpDHMQ8jBQ6y2S1pOrx9cjXnJ5KeOdp4MqnpRQwQlfhiwUY2NBuJL1xMZWxnK26NhJEx7t8v8Ln8BovH0a83rXIDArBd_lk9ZV2DTeRz-QLZ2NpNjfaCgoJ5JKDBnfJaMi2gY"
                    )
                ) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                        .rotationEffect(.degrees(-12))
                        .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 10)
                } placeholder: {
                    Color.clear
                }
                .frame(height: 180)
                .padding(.vertical, 8)

                // Info
                VStack(spacing: 8) {
                    Text("Pro Speed Runner X")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(.black)

                    HStack(spacing: 8) {
                        Text("$89.00")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(accentColor)
                        Text("$178.00")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                            .strikethrough()
                    }

                    Button(action: {}) {
                        HStack {
                            Text("SHOP NOW")
                                .font(.system(size: 14, weight: .bold))
                            Image(systemName: "arrow.right")
                                .font(.system(size: 12))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(accentColor)
                        .cornerRadius(16)
                    }
                    .padding(.top, 8)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }

            // Decorative Dots
            HStack(spacing: 6) {
                Circle().fill(accentColor).frame(width: 8, height: 8)
                Circle().fill(Color.gray.opacity(0.3)).frame(width: 8, height: 8)
                Circle().fill(Color.gray.opacity(0.3)).frame(width: 8, height: 8)
            }
            .padding(16)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .trailing)
        }
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.05), radius: 15, x: 0, y: 5)
    }

    // MARK: - Flash Sale Section
    private var flashSaleSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Flash Sale Items")
                    .font(.system(size: 20, weight: .black))
                    .italic()
                    .foregroundColor(.black)
                Spacer()
                Button("View All") {}
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(accentColor)
            }

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                flashSaleItem(
                    name: "Air Max Strike",
                    category: "Running Footwear",
                    price: "$45.00",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCy9Ld8b69_VgsmF-wBS4toZC0Esunhuw81VfLYOsnbY3D0Ei7b27NGEFpAMRlY2vveBRoF2R77XU6sFjwxmAZZJiNBhJcuW_oPboFp_1XiTnIC-Fd99Vx-cIk7TE4BP3EekgjFT49g0veysXMnQfgefF8ckUNJA9Dafy--OJs0a-8uIyfK3IWz_B5bTRSvSZc_c0aWXlW5jxJAwzarSRzzW9Ki3LBA5l9sKduB5YYZ42cQyFIwEB4mSD5s7zdLyvrxhEeUx1W9WuuV"
                )
                flashSaleItem(
                    name: "Court Classic",
                    category: "Casual Wear",
                    price: "$32.50",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDsSvmhLEDhGzFHTlpInfJSd9MAs3Qx9UAzpBByLZz3_NeRvcfa9KE_KxgUp2ztAEV5qnY7lsCH0zUAtJzqVzo9XQeWn_jabK86ZYUZsZKwF9zFpu7d2nA4iv_fbiF9hRP8i93ALXYLJ-u7SQO_YEDSJMZeviyv2Vl9gToXuKCOBFhBrHLTuakPzGtI2MAcC3JzO-alpn5VpMPgK19Y--HtSaAdSjzo27LMXQn8Yep0vGEyB0bdCDSO2ohl6_LV3_SaDGGH2s8VjG9Q"
                )
                flashSaleItem(
                    name: "Flash Elite V2",
                    category: "Training Shoes",
                    price: "$55.00",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDMmEhsdieguv3wky1MAlt86pzbGlCf-FQPoUxFZrQaLSIt2n3AfMPeSxy2yowR61IsUp_9_Vk0QHN22JBm1gNPkTLoxTwpWw1SzAX00ojyXyIbe8YCuDHaDDeJUdBrifnG-Q5l-q3ZeIlkuOCbXoxv4eOCUsJM-YBaoJid3uqAAZiy_N99V4GPEQSQiFo-h9SDXXd-sP0IzYfl1Dt7zEX9Jxd8M4xB6PlukjQdYTeFc6fMTw4rKozYowRg8xEAUkuW-y3uHKIuHHZl"
                )
                flashSaleItem(
                    name: "Striker FG",
                    category: "Football Cleats",
                    price: "$62.00",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAmiedhMKuYgKKv3PkzHItcTYnhslINz6797OKaEnOpGMm2lq26sp7wvOZOUMxdWQTWRXvzpdWeaDJW5h-PxKxCc-FthQJRJ4NThKVNRSmKxscrziTnb6TmZm7wc9_qac9Lk9XPSdrTUg9tMkZc-gXjWZZ4NnpzeUAdz_MdH-OTDyHBV3OujN_Dk2yIUu7lIAhZhIdlR5QIU8MKRPc7bdG50tBFBfOYFKYhoj-8EQRHbzBt1CJuBevjMSI3NpGe_rCWclWSWSxOY6IR"
                )
            }
        }
    }

    private func flashSaleItem(name: String, category: String, price: String, image: String)
        -> some View
    {
        VStack(alignment: .leading, spacing: 10) {
            ZStack(alignment: .topTrailing) {
                // Circular bg
                Circle()
                    .fill(primaryColor.opacity(0.05))
                    .frame(width: 100, height: 100)
                    .scaleEffect(1.2)

                AsyncImage(url: URL(string: image)) { img in
                    img.resizable().aspectRatio(contentMode: .fit)
                } placeholder: {
                    Color.clear
                }
                .frame(height: 100)

                Text("-50%")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.black)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(primaryColor)
                    .cornerRadius(4)
                    .offset(x: 10, y: -10)
            }
            .frame(height: 120)
            .frame(maxWidth: .infinity)
            .padding(.bottom, 8)

            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.black)
                    .lineLimit(1)
                Text(category)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }

            HStack {
                Text(price)
                    .font(.system(size: 16, weight: .heavy))
                    .foregroundColor(accentColor)
                Spacer()
                Button(action: {}) {
                    Image(systemName: "cart.badge.plus")  // add_shopping_cart
                        .font(.system(size: 14))
                        .foregroundColor(.black)
                        .padding(8)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }

    // MARK: - Bottom Nav
    private var bottomNavView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                navItem(icon: "house.fill", title: "HOME", isActive: true)
                Spacer()
                navItem(icon: "square.grid.2x2", title: "CATEGORIES", isActive: false)  // grid_view
                Spacer()
                navItem(icon: "tag", title: "DEALS", isActive: false)  // local_offer
                Spacer()
                navItem(icon: "person", title: "PROFILE", isActive: false)
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white.opacity(0.8))
            .background(.ultraThinMaterial)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color.gray.opacity(0.1)),
                alignment: .top
            )

            // Home Indicator
            RoundedRectangle(cornerRadius: 3)
                .fill(Color.gray.opacity(0.3))
                .frame(width: 128, height: 4)
                .padding(.bottom, 8)
                .padding(.top, 4)
        }
        .background(Color.white)
        .cornerRadius(24, corners: [.topLeft, .topRight])
        .shadow(color: .black.opacity(0.05), radius: 20, y: -5)
    }

    private func navItem(icon: String, title: String, isActive: Bool) -> some View {
        Button(action: {}) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                Text(title)
                    .font(.system(size: 10, weight: .bold))
            }
            .foregroundColor(isActive ? accentColor : Color.gray)
        }
    }
}

// Helper Shape for curved background
struct CurvedBottomShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: rect.height - 40))
        path.addQuadCurve(
            to: CGPoint(x: 0, y: rect.height - 40),
            control: CGPoint(x: rect.width / 2, y: rect.height + 40)
        )
        path.closeSubpath()
        return path
    }
}

struct ShoesSalesView_Previews: PreviewProvider {
    static var previews: some View {
        ShoesSalesView()
    }
}
