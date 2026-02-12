import SwiftUI

struct BeautyProductView: View {
    @Environment(\.presentationMode) var presentationMode

    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var beautyManager: BeautyManager
    @State private var showSearch = false
    @State private var showCart = false

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
                    .padding(.top, -10)
                    .padding(.bottom, 120)
                }
            }

        }

        .navigationBarHidden(true)
        .ignoresSafeArea(.all, edges: .bottom)
        .navigationDestination(isPresented: $showCart) {
            CartPageView()
        }
        .fullScreenCover(isPresented: $showSearch) {
            GlobalSearchView()
        }
        .onAppear {
            beautyManager.fetchInitialData()
        }
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
                Button(action: {
                    showSearch = true
                }) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 20))
                        .foregroundColor(.black)
                        .padding(10)
                        .background(Color.pink.opacity(0.05))
                        .clipShape(Circle())
                }

                Button(action: {
                    showCart = true
                }) {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bag")
                            .font(.system(size: 20))
                            .foregroundColor(.black)
                            .padding(10)
                            .background(Color.pink.opacity(0.05))
                            .clipShape(Circle())

                        if cartManager.cartCount > 0 {
                            Text("\(cartManager.cartCount)")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .frame(width: 16, height: 16)
                                .background(Color.red)
                                .clipShape(Circle())
                                .offset(x: 2, y: -2)
                        } else {
                            Circle()
                                .fill(Color(red: 0.91, green: 0.64, blue: 0.66))
                                .frame(width: 10, height: 10)
                                .overlay(Circle().stroke(Color.white, lineWidth: 2))
                                .offset(x: -2, y: 2)
                        }
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
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

}

struct BeautyProductView_Previews: PreviewProvider {
    static var previews: some View {
        BeautyProductView()
            .environmentObject(CartManager())
    }
}
