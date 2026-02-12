import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct BackToSchoolHeaderView: View {
    let components: SDUIComponent

    // Hardcoded demo data as fallback, but ideally mapped from props
    // Props might be empty if it's static in RN, but SDUIComponent passes them.

    var body: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .bottom) {
                chalkboardBackground
                decorativeElements
                mainContent
            }
            .frame(height: 380)
            .cornerRadius(24, corners: [.bottomLeft, .bottomRight])
            .zIndex(0)

            searchBarOverlay
        }
        .padding(.bottom, 24)
    }

    private var chalkboardBackground: some View {
        Color(hex: "2B5F3E")  // Chalkboard Green
    }

    private var decorativeElements: some View {
        GeometryReader { geo in
            Group {
                // Top Deco Row
                VStack {
                    HStack(alignment: .top, spacing: 30) {
                        ForEach(0..<5) { i in
                            Rectangle()
                                .fill(Color(hex: "FDE047").opacity(0.5))
                                .frame(width: 8, height: CGFloat(24 + (i % 3) * 6))
                                .cornerRadius(4)
                        }
                    }
                    .padding(.horizontal, 20)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    Spacer()
                }
                .offset(y: -10)

                // Simulated Chalk Drawings
                Text("ABC")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                    .rotationEffect(.degrees(-12))
                    .opacity(0.4)
                    .position(x: 60, y: 100)

                Image(systemName: "lightbulb.fill")
                    .font(.system(size: 32))
                    .foregroundColor(Color.white.opacity(0.4))
                    .position(x: geo.size.width - 40, y: 100)

                Text("1 + 2 = 3")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                    .rotationEffect(.degrees(12))
                    .opacity(0.3)
                    .position(x: geo.size.width - 80, y: 260)
            }
        }
    }

    private var mainContent: some View {
        VStack(spacing: 16) {
            Text("Welcome")
                .font(.system(size: 18))
                .foregroundColor(Color.white.opacity(0.9))

            // Avoid text concatenation warning by grouping
            HStack(spacing: 0) {
                Text("BACK")
                    .font(.system(size: 42, weight: .black))
                    .foregroundColor(.white)
                Text("\n")
                Text("to")
                    .font(.system(size: 24))
                    .foregroundColor(.white)
                Text(" SCHOOL")
                    .font(.system(size: 42, weight: .black))
                    .foregroundColor(.white)
            }
            // Multiline workaround if needed, or just standard wrapping
            // Since it was "BACK\nto SCHOOL", the previous code relied on the newline working in concatenation.
            // HStack won't wrap cleanly with \n.
            // Let's use a VStack for the split
            /*
            Text("BACK")
                .font(.system(size: 42, weight: .black))
                .foregroundColor(.white)
            + Text("\n") ...
            */
            // Better approach:
            VStack(spacing: 0) {
                Text("BACK")
                    .font(.system(size: 42, weight: .black))
                    .foregroundColor(.white)
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("to")
                        .font(.system(size: 24))
                        .foregroundColor(.white)
                    Text("SCHOOL")
                        .font(.system(size: 42, weight: .black))
                        .foregroundColor(.white)
                }
            }

            HStack(alignment: .bottom, spacing: -12) {
                circleImage(
                    url:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUKcux_NhPl0HEN2ypADh8zAQqEU5oSPNSBqOkzj32oFzbKPYcBn2Vekj81U4QjVoPICK0-AEwjzXuWU-HF1McdyktPXE3e9bgq0bApl5FlLtiDPkdOkenJe5XYk97_VRUgsSLCN1IgvYqW9Obn05EkyOASEbKZSHbtVLnQ5GO2HdTjyLG_thy5nm3y9InXjyn_IRxVEd_MIzG95Lb6yl_eO4cLEjQWi-Hsz7WUJDZzWBhq_BLqbPR1Xu5_P5JTOiGfDC1j9_4ARJs"
                )

                shopNowButton
                    .zIndex(1)
                    .padding(.bottom, 20)

                circleImage(
                    url:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK9aRKYsvvsjUqLQmrVhvnfXTV_bbd0S4aofnNw68dw-paqUnkPTPHSdpK0kvY74gCpBBs-qhlGas91j6q7V0VEKOQXRD4lfXAe9xLT7ZdBOauA6Fy8iLvelXrpMXQwUcofIFe9lv7Y-LuOZYvnBp9jGF4zueqbezsysreHmG8Bu2RXIGCZ_J0-x4LvuGeEZEQJRSS9iAVxO86aFSvWIUCr_nGJAC4B7sDUQvAx0J2EsGDMwGhgquDMCm0evCKUw9d0wQHnWh-XdP5"
                )
            }
        }
        .padding(.top, 60)
        .padding(.bottom, 48)
    }

    private var shopNowButton: some View {
        Button(action: {}) {
            Text("SHOP NOW")
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 10)
                .background(Color(hex: "F4B060"))
                .cornerRadius(999)
        }
        .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 4)
    }

    private var searchBarOverlay: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color(hex: "9CA3AF"))
            Text("Search backpacks, pencils...")
                .foregroundColor(Color(hex: "9CA3AF"))
                .font(.system(size: 14))
            Spacer()
            Button(action: {}) {
                Image(systemName: "slider.horizontal.3")
                    .foregroundColor(Color(hex: "6B7280"))
                    .padding(6)
                    .background(Color(hex: "F3F4F6"))
                    .cornerRadius(8)
            }
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        .padding(.horizontal, 20)
        .offset(y: -24)
        .padding(.bottom, -24)
    }

    private func circleImage(url: String) -> some View {
        AsyncImage(url: URL(string: url)) { phase in
            if let image = phase.image {
                image.resizable().aspectRatio(contentMode: .fill)
            } else {
                Color.gray
            }
        }
        .frame(width: 80, height: 80)
        .clipShape(Circle())
        .overlay(Circle().stroke(Color.white.opacity(0.3), lineWidth: 2))
    }
}
