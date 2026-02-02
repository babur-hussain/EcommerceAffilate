import SwiftUI

struct BackToSchoolFooterView: View {
    var body: some View {
        VStack(spacing: 0) {
            Divider()
            HStack(alignment: .bottom) {
                NavItem(icon: "house.fill", label: "Home", isActive: true)
                NavItem(icon: "square.grid.2x2.fill", label: "Categories")

                // Center Button
                Button(action: {}) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "F4B060"))
                            .frame(width: 64, height: 64)
                            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)

                        Image(systemName: "cart.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white)
                    }
                }
                .offset(y: -24)

                NavItem(icon: "heart", label: "Saved")
                NavItem(icon: "person", label: "Profile")
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)  // safe area
            .background(
                Color.white
                    .clipShape(CustomFooterShape())
                    .shadow(color: .black.opacity(0.05), radius: 15, x: 0, y: -5)
            )
        }
    }

    struct NavItem: View {
        let icon: String
        let label: String
        var isActive: Bool = false

        var body: some View {
            Button(action: {}) {
                VStack(spacing: 4) {
                    Image(systemName: icon)
                        .font(.system(size: 26))
                        .foregroundColor(isActive ? Color(hex: "F4B060") : Color(hex: "9CA3AF"))

                    Text(label)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(isActive ? Color(hex: "F4B060") : Color(hex: "9CA3AF"))
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 12)
            }
        }
    }

    // Optional: Custom Shape for curve near center button if needed, otherwise Rectangle
    struct CustomFooterShape: Shape {
        func path(in rect: CGRect) -> Path {
            var path = Path()
            path.addRoundedRect(in: rect, cornerSize: CGSize(width: 24, height: 24))
            return path
        }
    }
}
