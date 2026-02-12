import SwiftUI

struct SpecialDealNewStyleView: View {
    @Environment(\.presentationMode) var presentationMode
    @StateObject private var manager = SpecialDealManager()

    // Environment & State
    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var beautyManager: BeautyManager
    @EnvironmentObject var basketManager: BasketManager
    @State private var showSearch = false
    @State private var navigateToCart = false

    var body: some View {
        NavigationStack {  // Added NavigationStack wrapper
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
            }
            .navigationBarHidden(true)
            .ignoresSafeArea(.all, edges: .bottom)
            .navigationDestination(isPresented: $navigateToCart) {
                CartPageView()
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())  // Ensure full screen behavior
        .onAppear {
            manager.fetchInitialData()
        }
        .fullScreenCover(isPresented: $showSearch) {
            GlobalSearchView()
                .environmentObject(cartManager)
                .environmentObject(beautyManager)
                .environmentObject(basketManager)
        }
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

            // Search Icon
            Button(action: {
                showSearch = true
            }) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18))
                    .foregroundColor(.black)
            }
            .padding(.trailing, 16)

            // Cart Icon
            Button(action: {
                navigateToCart = true
            }) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "bag")
                        .font(.system(size: 18))
                        .foregroundColor(.black)

                    if cartManager.cartCount > 0 {
                        Text("\(cartManager.cartCount)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 14, height: 14)
                            .background(Color.red)
                            .clipShape(Circle())
                            .offset(x: 6, y: -6)
                    }
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 8)  // Reduced vertical padding to decrease header spacing
        .background(Color(red: 0.98, green: 0.75, blue: 0.14))  // Unified Yellow
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
                        .blendMode(.multiply)  // Fix opacity/white bg
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
                        .blendMode(.multiply)  // Fix opacity/white bg
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
            .cornerRadius(12)
            .rotationEffect(.degrees(-2))
            .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
        }
        .frame(height: 280)
        .cornerRadius(16)
        .padding(.horizontal, 16)
    }

    // MARK: - Categories
    private var categoriesView: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                // All Items Button
                Button(action: {
                    manager.selectCategory(nil)
                }) {
                    categoryPill("All Items", isActive: manager.selectedCategoryId == nil)
                }

                // Dynamic Categories
                ForEach(manager.subCategories) { category in
                    Button(action: {
                        manager.selectCategory(category.id)
                    }) {
                        categoryPill(
                            category.name, isActive: manager.selectedCategoryId == category.id)
                    }
                }
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
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16),
            ], spacing: 16
        ) {
            if manager.isLoading {
                // Skeleton Loading
                ForEach(0..<6, id: \.self) { _ in
                    ProductCardSkeleton()
                }
            } else {
                ForEach(manager.products) { product in
                    productCard(product: product)
                }
            }
        }
        .padding(.horizontal, 16)
    }

    private func productCard(product: Product) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            // Clickable Area (Navigates to Detail)
            NavigationLink(
                destination: ProductDetailView(productId: product.id, productFragment: product)
            ) {
                VStack(alignment: .leading, spacing: 0) {
                    // Image with Badge
                    ZStack(alignment: .topTrailing) {
                        AsyncImage(url: URL(string: product.images.first ?? "")) { phase in
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

                        // Calculated Discount Logic
                        if let discount = product.discountPercentage, discount > 0 {
                            discountBadge(text: "\(discount)% OFF")
                        } else if let mrp = product.mrp, mrp > product.price {
                            let discount = Int(((mrp - product.price) / mrp) * 100)
                            if discount > 0 {
                                discountBadge(text: "\(discount)% OFF")
                            }
                        }
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text(product.name)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.black)
                            .lineLimit(1)
                            .padding(.top, 4)

                        HStack(alignment: .firstTextBaseline, spacing: 8) {
                            // Integer Pricing (No decimals)
                            Text("₹\(String(format: "%.0f", product.price))")
                                .font(.system(size: 18, weight: .black))
                                .foregroundColor(.black)

                            if let mrp = product.mrp, mrp > product.price {
                                Text("₹\(String(format: "%.0f", mrp))")
                                    .font(.system(size: 12))
                                    .foregroundColor(.gray)
                                    .strikethrough()
                            }
                        }
                    }
                    .padding(16)
                    .padding(.bottom, 8)
                }
            }
            .buttonStyle(PlainButtonStyle())

            // Add to Cart Button (Action Only)
            Button(action: {
                cartManager.addToCart(product: product)
                // Haptic feedback is handled inside addToCart
            }) {
                Text("ADD TO CART")
                    .font(.system(size: 10, weight: .bold))
                    .tracking(1)
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .overlay(
                        Rectangle()
                            .stroke(Color.black, lineWidth: 1.5)
                    )
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .background(Color.white)
        .overlay(
            Rectangle()
                .stroke(Color(red: 0.95, green: 0.95, blue: 0.95), lineWidth: 1)
        )
    }

    private func discountBadge(text: String) -> some View {
        Text(text)
            .font(.system(size: 10, weight: .bold))
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color.red)
            .cornerRadius(4)
            .padding(8)
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
