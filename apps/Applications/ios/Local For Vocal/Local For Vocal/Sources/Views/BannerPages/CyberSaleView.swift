import SwiftUI
import UIKit

struct CyberSaleView: View {
    @Environment(\.presentationMode) var presentationMode

    // Colors
    private let primaryYellow = Color(red: 1.0, green: 0.84, blue: 0.27)  // #FFD646
    private let cyberBlue = Color(red: 0.20, green: 0.47, blue: 0.76)  // #3478C2
    private let cyberPink = Color(red: 1.0, green: 0.32, blue: 0.56)  // #FF528F
    private let bgLight = Color(red: 0.95, green: 0.96, blue: 0.96)  // #F3F4F6

    var body: some View {
        ZStack(alignment: .bottom) {
            // Main Background
            bgLight.ignoresSafeArea()

            VStack(spacing: 0) {
                // Custom Status Bar Area (Blue)
                cyberBlue
                    .frame(height: 60)  // Approximate status bar height
                    .ignoresSafeArea()

                    .zIndex(10)

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Header
                        headerView

                        // Main Content Container
                        VStack(spacing: 24) {
                            // Categories
                            categoriesSection

                            // Flash Deals
                            flashDealsSection

                            // Secret Deals Banner
                            secretDealsBanner

                            Spacer().frame(height: 16)  // Bottom padding
                        }
                        .padding(.top, 32)
                        .padding(.horizontal, 16)
                        .background(bgLight)
                        .cornerRadius(32, corners: [.topLeft, .topRight])
                        .offset(y: -24)  // Overlap header
                    }
                }
            }
            .ignoresSafeArea(.container, edges: .top)

            // Bottom Navigation

        }
        .navigationBarHidden(true)
        .gesture(
            DragGesture()
                .onEnded { value in
                    if value.startLocation.x < 50 && value.translation.width > 100 {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
        )
    }

    // MARK: - Header
    private var headerView: some View {
        ZStack {
            cyberBlue

            // Background Elements using GeometryReader
            GeometryReader { geo in
                ZStack {
                    // Halftone pattern approximation (dots)
                    ForEach(0..<20) { i in
                        Circle()
                            .fill(Color.black.opacity(0.05))
                            .frame(width: 4, height: 4)
                            .position(
                                x: CGFloat.random(in: 0...geo.size.width),
                                y: CGFloat.random(in: 0...geo.size.height)
                            )
                    }

                    // Action Lines (centered)
                    HStack(spacing: 20) {
                        Rectangle()
                            .fill(primaryYellow.opacity(0.15))
                            .frame(width: 40, height: 400)
                            .rotationEffect(.degrees(15))
                        Rectangle()
                            .fill(primaryYellow.opacity(0.15))
                            .frame(width: 60, height: 400)
                            .rotationEffect(.degrees(15))
                    }
                    .position(x: geo.size.width / 2, y: geo.size.height / 2)

                    // Stickers
                    // Left Sticker
                    AsyncImage(
                        url: URL(
                            string:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuAMxshYMr8JAzwDltL6x0IOeuUXLyRX3D0iqnOQFwnumDpzQtrczPhI14tUq53TGrvy4349EfonUt3HbiuDu5ZtaFSP6AelBUm0dbnczgA8lV9EFkKNJLg-Kg8Fgxp4Iy9SsLWKUMT6CGCgiYFidbtlYYrWiNMQjhh-kXDzlrKX6fOJ4ernCkp8CNe89NRXW_UmOQSxhpEcV-ZHwxfHhNhYERGnQXuOKsf-46cQbpY1yE7dxnk4nmMIm0o26-LLq-ZFwPFHRpzRcicS"
                        )
                    ) { img in
                        img.resizable().aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 80, height: 80)
                    .rotationEffect(.degrees(-15))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.white, lineWidth: 4)
                            .rotationEffect(.degrees(-15))
                    )
                    .shadow(color: .black.opacity(0.2), radius: 0, x: 4, y: 4)
                    .position(x: 50, y: 50)

                    // Right Sticker
                    AsyncImage(
                        url: URL(
                            string:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuAakzBYMcihd0rTGWjFIqPVHdHiLxdYM0HvEqLqaau4i1m-02lQ3Jw8b_ihyVZ7sR4j8p1jjiPEqssEIaqmll7YTBIfH-78Y11vPYDmsSZjKWH4xs8sZog31hI5iTzZ2FQeP8-jokq6V3sTi77XRa83AlJ3zpduqnmMoaUtH8j2bPBVKGS-xbzRPONybwbrlqrfFOhPCagRD2oYVtK9fDAwNZhK1yO9m1E1RfEw-Q7OVAsU_Frh1D0PtMPz58JiLmj-fUbnWsdxznyF"
                        )
                    ) { img in
                        img.resizable().aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 100, height: 100)
                    .rotationEffect(.degrees(20))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.white, lineWidth: 4)
                            .rotationEffect(.degrees(20))
                    )
                    .shadow(color: .black.opacity(0.2), radius: 0, x: 4, y: 4)
                    .position(x: geo.size.width - 40, y: 80)
                }
            }

            // Content
            VStack(spacing: 8) {
                Text("SPECIAL OFFER")
                    .font(.system(size: 14, weight: .bold))
                    .tracking(2)
                    .foregroundColor(.white)
                    .shadow(radius: 2)

                Text("CYBER")
                    .font(.system(size: 64, weight: .black))
                    .italic()
                    .foregroundColor(.white)
                    .shadow(color: .black.opacity(0.5), radius: 0, x: 4, y: 4)
                    .lineLimit(1)

                Text("MONDAY")
                    .font(.system(size: 48, weight: .black))
                    .italic()
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 4)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.white, lineWidth: 2)
                    )
                    .padding(.bottom, 16)

                // Pill
                Text("UP TO 70% OFF")
                    .font(.system(size: 20, weight: .heavy))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(cyberPink)
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(Color.white, lineWidth: 2))
                    .shadow(radius: 4)
                    .rotationEffect(.degrees(-2))
                    .padding(.bottom, 16)

                Button(action: {}) {
                    Text("SHOP NOW")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.black)
                        .padding(.horizontal, 32)
                        .padding(.vertical, 14)
                        .background(primaryYellow)
                        .clipShape(Capsule())
                        .shadow(color: Color.yellow.opacity(0.6), radius: 0, x: 0, y: 4)  // Border bottom simulation
                }
            }
            .padding(.top, 60)
            .padding(.bottom, 80)
        }
        .frame(height: 480)
        .overlay(
            Rectangle()
                .frame(height: 4)
                .foregroundColor(.black),
            alignment: .bottom
        )
    }

    // MARK: - Categories
    private var categoriesSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("CATEGORIES")
                    .font(.system(size: 20, weight: .heavy))
                    .foregroundColor(cyberBlue)
                Spacer()
                Text("SWIPE FOR MORE")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 8)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 20) {
                    categoryItem(icon: "desktopcomputer", name: "Tech", color: cyberBlue)
                    categoryItem(icon: "tshirt", name: "Style", color: cyberPink)
                    categoryItem(icon: "gamecontroller", name: "Gaming", color: .green)
                    categoryItem(icon: "figure.walk", name: "Active", color: .orange)
                    categoryItem(icon: "house", name: "Home", color: .purple)
                }
                .padding(.horizontal, 8)
                .padding(.bottom, 8)  // Shadow space
            }
        }
    }

    private func categoryItem(icon: String, name: String, color: Color) -> some View {
        VStack(spacing: 8) {
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white)
                    .frame(width: 64, height: 64)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.black, lineWidth: 2)
                    )
                    .shadow(color: .black, radius: 0, x: 4, y: 4)

                Image(systemName: icon)
                    .font(.system(size: 28))
                    .foregroundColor(color)
            }

            Text(name)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.black)
        }
    }

    // MARK: - Flash Deals
    private var flashDealsSection: some View {
        VStack(spacing: 16) {
            HStack {
                Image(systemName: "bolt.fill")
                    .foregroundColor(cyberPink)
                Text("FLASH DEALS")
                    .font(.system(size: 20, weight: .black))
                    .italic()
                    .foregroundColor(.black)
                Spacer()
                Text("02:45:12")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.black)
                    .cornerRadius(4)
            }
            .padding(.horizontal, 8)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                // Item 1
                flashDealCard(
                    title: "Ultra Bass Headphones",
                    price: "$89",
                    oldPrice: "$149",
                    discount: "-40%",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBynHwbBIbW9WLBg061p80sdh4VbpRXq63bVsPzAlI5S6ajFsZxBWjB2_EK9JZt8upJmTEvikcxo9UauMLnG99HKHXOqJCfrkYKr3XbMwxoHL1SR56r8b7e7riofe9e9u3vQfXFIAhfDSF94TL2f4Vl7d7QkJIbcX_0C8M3U-HyNP1qwvh2RkT6Yk7w2kTT4mdV_FX65MhowFzN6FFJc5nIGSXxN6NzQttnfniSDtDaxhm_6bVMQ0PQrgsALBuansKWBBZ9WMQ6U-cl"
                )

                // Item 2
                flashDealCard(
                    title: "Cyber Smart Watch",
                    price: "$45",
                    oldPrice: "$150",
                    discount: "-70%",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBKyo7oT2qUDEm03WU-n3BlKXSo9C7GFjtwPT1Nzwr4BxtYbRjFz87xQs0X8ZBJRb71qIMNpYkucLB0I10-PmCsQ0OIxh5Qp6Z_3FpVyyjbolxLCkrDxbiCy3zF2EGOkfBkbYiA11w-N9DElIyCPJcUk1FcToOo9X2QYdrOWJAALu8MuD4BzJ5AC-rF0rV1V08-cBeNh82raOpGHnUbm4rK1ee-OqXr5nEoN7HimcbuIkmG5HsIc0P22MMZSY8bDFhZtqgxhK4i4VDW"
                )

                // Item 3
                flashDealCard(
                    title: "Gamer Keyboard RGB",
                    price: "$120",
                    oldPrice: "$160",
                    discount: "-25%",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIyZ8lR0So1in-fb-UdKU9FWNB_HGZnD9pGnM4C8bVmePUJPw2hUfES0kQrBScFh9Ic8K0lGeF4e_AFFVY6JoWvVAZERWSsynejMCALgsXVJd4LhX_dAVYNEkAvqdGv7Vg_56rQdhee_AHFn0F5n91yZanqofaUvbY7pzdkxk1R2fVLZuK4V-wkVgiMzPYoAR7StFWz_W2yYIQQ4C9n5_ei_5l_CIafzUm912gsxbjAi8AUny-xVj2eITwpmIplzlVptvVyrtYqfS4"
                )

                // Item 4
                flashDealCard(
                    title: "Wireless Gamepad",
                    price: "$29",
                    oldPrice: "$59",
                    discount: "-50%",
                    image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMIbQ61_Ko2patxpNMwXKf6Uk0I5cSqJbw6k-9amZg1q1VVDUiSDoZda_XHLGI__Rt-_Er43XC5SsojqExgHZjrOKiyYFfJXVe1_aNbCegKx8w0TGCplwIH4h6FpovT3jxO4emg5DMCTQW1YsTwff7F3gyWJP37EQbpBGj_wdzj-VeSCGS0jnXP0pjEeXFA0b8Cyhyf_PXlKNNdfAw7y7XCd98ZUOe5640NrUg4Yvksx6HEoBPNevlGLaf9lM45URQERCbs14bt3_Q"
                )
            }
        }
    }

    // MARK: - Secret Deals Banner
    private var secretDealsBanner: some View {
        ZStack {
            Color.black

            // Halftone overlay
            GeometryReader { geo in
                ForEach(0..<10) { i in
                    Circle()
                        .fill(Color.white.opacity(0.1))
                        .frame(width: 4, height: 4)
                        .position(
                            x: CGFloat.random(in: 0...geo.size.width),
                            y: CGFloat.random(in: 0...geo.size.height)
                        )
                }
            }

            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("UNLOCK\nSECRET DEALS")
                        .font(.system(size: 24, weight: .black))
                        .italic()
                        .foregroundColor(.white)
                    Text("Limited to first 500 customers")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)

                    Button(action: {}) {
                        Text("ENTER CODE: CYBER500")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.black)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.white)
                            .clipShape(Capsule())
                    }
                    .padding(.top, 8)
                }

                Spacer()

                Image(systemName: "star.fill")
                    .font(.system(size: 48))
                    .foregroundColor(primaryYellow)
            }
            .padding(24)
        }
        .frame(height: 160)
        .cornerRadius(24)
    }

    private func flashDealCard(
        title: String, price: String, oldPrice: String, discount: String, image: String
    ) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Area
            ZStack(alignment: .topLeading) {
                Color.gray.opacity(0.1)

                AsyncImage(url: URL(string: image)) { img in
                    img.resizable().aspectRatio(contentMode: .fit)
                } placeholder: {
                    Color.clear
                }
                .padding(16)

                // Discount Badge
                Text(discount)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(cyberPink)
                    .cornerRadius(4)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(Color.white, lineWidth: 2)
                    )
                    .rotationEffect(.degrees(-5))
                    .offset(x: 8, y: 8)
            }
            .frame(height: 150)

            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text(title)
                    .font(.system(size: 14, weight: .bold))
                    .lineLimit(1)
                    .foregroundColor(.black)

                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text(price)
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(.black)
                    Text(oldPrice)
                        .font(.system(size: 12))
                        .strikethrough()
                        .foregroundColor(.gray)
                }

                Button(action: {}) {
                    Text("BUY NOW")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(primaryYellow)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(red: 0.8, green: 0.6, blue: 0.0), lineWidth: 0)
                        )
                        .shadow(color: Color.yellow.opacity(0.4), radius: 0, x: 0, y: 3)  // Border bottom fake
                }
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.white, lineWidth: 4)
        )
        .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 5)
    }

}
