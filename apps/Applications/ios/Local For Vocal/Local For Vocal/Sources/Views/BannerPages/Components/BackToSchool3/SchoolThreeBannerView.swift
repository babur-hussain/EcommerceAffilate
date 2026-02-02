import SwiftUI

struct SchoolThreeBannerView: View {
    let component: SDUIComponent

    private let secondary = Color(hex: "007ea7")
    private let accent = Color(hex: "FDE74C")

    var body: some View {
        VStack {
            ZStack {
                accent

                // Circles
                GeometryReader { geo in
                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 64, height: 64)
                        .position(x: geo.size.width - 48, y: -10)

                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 128, height: 128)
                        .position(x: geo.size.width - 24, y: geo.size.height + 24)
                }
                .clipped()

                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("NEW ARRIVAL")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(secondary)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.white)
                            .cornerRadius(4)
                            .padding(.bottom, 8)

                        Text("Eco Backpacks")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(secondary)

                        Text("Recycled materials, durable design.")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(secondary.opacity(0.8))
                            .padding(.bottom, 12)

                        Button(action: {}) {
                            Text("Shop Now")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(secondary)
                                .cornerRadius(999)
                                .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 4)
                        }
                    }
                    .padding(.trailing, 16)

                    Spacer()

                    // Image Wrapper
                    AsyncImage(
                        url: URL(
                            string:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuDDKkIuLeGW0-sUDIDXL2DPs44SVN6y4O_kyPE2ADOopxKXEGMIpzSaCXaJvYqDfIzQZp7SMNMKvQkd8BoHtdp5egnkZTOdE7HyXV6hsg7pWXawL5zYJh89enDiL18_cgVaj0HlBJ3TMAzjaTR2zgAxHbcLOoSv2BUE1urfl-XXJnhHO0zMvJ-qZCE93HIJcFOuiaYRInlI_XyVrKAft402uDpeOwDKxydwC7jzl0h265I1FKgQqnsOYK-EgLzM6yJN2HSJdk_wQEdI"
                        )
                    ) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Color.clear
                        }
                    }
                    .frame(width: 96, height: 96)
                    .rotationEffect(.degrees(-10))
                }
                .padding(20)
            }
            .frame(height: 180)  // Approx
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.1), radius: 6, x: 0, y: 4)
        }
        .padding(.top, 32)
        .padding(.horizontal, 16)
    }
}
