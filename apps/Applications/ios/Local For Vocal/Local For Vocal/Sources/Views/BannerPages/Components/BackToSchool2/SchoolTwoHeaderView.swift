import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct SchoolTwoHeaderView: View {
    let component: SDUIComponent

    // Theme Colors
    private let primary = Color(hex: "FACC15")  // Chalk Yellow
    private let bgLight = Color(hex: "155e48")  // Chalkboard Green
    private let cardLight = Color.white

    var body: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .bottom) {
                // Header Image
                GeometryReader { geo in
                    AsyncImage(
                        url: URL(
                            string:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuAalVn-6jNXwxbl_nzvbQ21tHvnvozO9MeNdXHP0GXaTNmzbOwNWIHLfZ38ACLgPQiQsTM2f4JM8cTDBMMnwAKgXnOIgO-7cL_Xt3FNwWrTeQt7I3kKBCg3U6YBo4fhQkZYBOtYEWjnrqgC5D-l5J2Erl-fuLp8WcHtHYPf1onJaZGOaIXj_LnJxU1WKFvIfoFFhxvkw8UxqvRP2PIvbdPsZqsIMdjJaaKl5HVyTv0HOVRYn4ThOGKzNpH3BU7MvrNMQQC3RQ3wGP9u"
                        )
                    ) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: geo.size.width, height: geo.size.height)
                                .clipped()
                                .scaleEffect(1.05)
                        } else {
                            bgLight
                        }
                    }
                }
                .frame(height: 256)
                .overlay(
                    LinearGradient(
                        gradient: Gradient(colors: [.black.opacity(0.6), .clear]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )

                // Navbar
                VStack {
                    HStack {
                        Button(action: {}) {
                            Image(systemName: "line.3.horizontal")
                                .font(.system(size: 24))
                                .foregroundColor(.white)
                                .frame(width: 40, height: 40)
                                .background(Color.white.opacity(0.1))
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.white.opacity(0.2), lineWidth: 1))
                        }

                        Spacer()

                        Text("The School Shop")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                            .shadow(color: .black.opacity(0.5), radius: 4, x: 0, y: 2)

                        Spacer()

                        Button(action: {}) {
                            ZStack(alignment: .topTrailing) {
                                Image(systemName: "cart.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                                    .frame(width: 40, height: 40)
                                    .background(Color.white.opacity(0.1))
                                    .clipShape(Circle())
                                    .overlay(
                                        Circle().stroke(Color.white.opacity(0.2), lineWidth: 1))

                                Text("3")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.black)
                                    .frame(width: 16, height: 16)
                                    .background(primary)
                                    .clipShape(Circle())
                                    .offset(x: 4, y: -4)
                            }
                        }
                    }
                    .padding(.top, 48)
                    .padding(.horizontal, 16)
                    Spacer()
                }
            }
            .frame(height: 256)
            .cornerRadius(24)  // Simplified, usually only bottom corners in RN code but all 24 is fine or use ClipShape

            // Search Bar Overlap
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "9CA3AF"))
                Text("Search for books, pencils...")
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .font(.system(size: 14))
                Spacer()
                Button(action: {}) {
                    Image(systemName: "slider.horizontal.3")
                        .foregroundColor(.black)
                        .padding(6)
                        .background(primary)
                        .cornerRadius(8)
                }
            }
            .padding(12)
            .background(cardLight)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(style: StrokeStyle(lineWidth: 2, dash: [5]))
                    .foregroundColor(Color(hex: "D1D5DB"))
            )
            .padding(.horizontal, 16)
            .offset(y: -32)
            .padding(.bottom, -32)
        }
        .padding(.bottom, 24)
    }
}
