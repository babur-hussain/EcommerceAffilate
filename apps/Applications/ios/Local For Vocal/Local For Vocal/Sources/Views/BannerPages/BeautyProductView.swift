import SwiftUI

struct BeautyProductView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background
            Color(red: 0.99, green: 0.96, blue: 0.96)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Sticky Header
                headerView

                // Scrollable SDUI Content
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        SDUIPage(slug: "beauty_product")
                    }
                    .padding(.bottom, 120)
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
                    .foregroundColor(.black)
                    .padding(10)
                    .background(Color.pink.opacity(0.05))
                    .clipShape(Circle())
            }

            Spacer()

            Text("Beauty & Perfume")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))

            Spacer()

            HStack(spacing: 8) {
                Button(action: {}) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 20))
                        .foregroundColor(.black)
                        .padding(10)
                        .background(Color.pink.opacity(0.05))
                        .clipShape(Circle())
                }

                Button(action: {}) {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bag")
                            .font(.system(size: 20))
                            .foregroundColor(.black)
                            .padding(10)
                            .background(Color.pink.opacity(0.05))
                            .clipShape(Circle())

                        Circle()
                            .fill(Color(red: 0.91, green: 0.64, blue: 0.66))
                            .frame(width: 10, height: 10)
                            .overlay(Circle().stroke(Color.white, lineWidth: 2))
                            .offset(x: -2, y: 2)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            Color(red: 0.99, green: 0.96, blue: 0.96).opacity(0.8)
        )
        .background(.ultraThinMaterial)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color.pink.opacity(0.15)),
            alignment: .bottom
        )
    }

    // MARK: - Bottom Nav
    private var bottomNavView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                navItem(icon: "house", title: "Home", isActive: true)
                Spacer()
                navItem(icon: "square.grid.2x2", title: "Categories", isActive: false)
                Spacer()
                navItem(icon: "heart", title: "Wishlist", isActive: false)
                Spacer()
                navItem(icon: "person", title: "Profile", isActive: false)
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white.opacity(0.95))
            .background(.ultraThinMaterial)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color.pink.opacity(0.15)),
                alignment: .top
            )

            // Home Indicator
            RoundedRectangle(cornerRadius: 3)
                .fill(Color(red: 0.88, green: 0.88, blue: 0.88))
                .frame(width: 128, height: 6)
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
                Text(title)
                    .font(.system(size: 10, weight: isActive ? .bold : .medium))
            }
            .foregroundColor(
                isActive
                    ? Color(red: 0.91, green: 0.64, blue: 0.66)
                    : Color(red: 0.58, green: 0.64, blue: 0.72))
        }
    }
}

struct BeautyProductView_Previews: PreviewProvider {
    static var previews: some View {
        BeautyProductView()
    }
}
