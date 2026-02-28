import SwiftUI

struct CartPageView: View {
    @EnvironmentObject var cartManager: CartManager
    @EnvironmentObject var basketManager: BasketManager
    @State private var selectedTab: String = "Shopping"

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text(
                    selectedTab == "Shopping"
                        ? "My Cart" : "My Basket (\(basketManager.basketCount) Items)"
                )
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(Color(hex: "#212121"))
                Spacer()
            }
            .padding()
            .background(Color.white)
            // No shadow here in RN design, it's flat white usually or subtle
            .zIndex(2)

            // Tabs (Shopping / Grocery)
            HStack(spacing: 0) {
                // Shopping Tab
                Button(action: {
                    selectedTab = "Shopping"
                }) {
                    VStack(spacing: 12) {
                        Text("Shopping (\(cartManager.cartCount))")
                            .font(
                                .system(
                                    size: 14,
                                    weight: selectedTab == "Shopping" ? .semibold : .medium)
                            )
                            .foregroundColor(
                                Color(hex: selectedTab == "Shopping" ? "#2874F0" : "#212121"))
                        Rectangle()
                            .fill(Color(hex: selectedTab == "Shopping" ? "#2874F0" : "clear"))
                            .frame(height: 2)
                    }
                    .frame(maxWidth: .infinity)
                    .contentShape(Rectangle())
                }

                // Grocery Tab
                Button(action: {
                    selectedTab = "Grocery"
                }) {
                    VStack(spacing: 12) {
                        Text("Grocery")
                            .font(
                                .system(
                                    size: 14, weight: selectedTab == "Grocery" ? .semibold : .medium
                                )
                            )
                            .foregroundColor(
                                Color(hex: selectedTab == "Grocery" ? "#2874F0" : "#212121"))
                        Rectangle()
                            .fill(Color(hex: selectedTab == "Grocery" ? "#2874F0" : "clear"))
                            .frame(height: 2)
                    }
                    .frame(maxWidth: .infinity)
                    .contentShape(Rectangle())
                }
            }
            .background(Color.white)
            .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: 1)
            .zIndex(1)

            // Content Area
            if selectedTab == "Shopping" {
                ShoppingView(cartManager: cartManager)
            } else {
                GroceryView(basketManager: basketManager)
            }
        }
        .background(Color.white)
    }
}

// MARK: - Subviews for Tabs

struct ShoppingView: View {
    @ObservedObject var cartManager: CartManager
    @EnvironmentObject var locationManager: LocationManager
    @State private var isCheckoutActive = false

    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                // Address Bar
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 8) {
                            Text("Deliver to:")
                                .font(.system(size: 14))
                                .foregroundColor(.black)
                            Text(locationManager.address)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.black)
                                .lineLimit(1)

                            Text("HOME")
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundColor(Color(hex: "#666666"))
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color(hex: "#F0F0F0"))
                                .cornerRadius(4)
                        }

                        Text("Select your location to see delivery options")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#878787"))
                            .lineLimit(1)
                    }

                    Spacer()

                    Button(action: {
                        withAnimation {
                            locationManager.showAddressSelector = true
                        }
                    }) {
                        Text("Change")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(Color(hex: "#2874F0"))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .overlay(
                                RoundedRectangle(cornerRadius: 4)
                                    .stroke(Color(hex: "#E0E0E0"), lineWidth: 1)
                            )
                    }
                }
                .padding(12)
                .background(Color.white)
                .padding(.bottom, 8)  // Separator
                .background(Color(hex: "#F1F3F6"))  // Gap color

                if cartManager.items.isEmpty {
                    EmptyStandardCartView()
                } else {
                    ScrollView {
                        VStack(spacing: 8) {
                            ForEach(cartManager.items) { item in
                                StandardCartItemView(item: item)
                            }

                            // Price Details
                            PriceDetailsView(
                                total: cartManager.cartTotal, count: cartManager.cartCount
                            )
                            .padding(.bottom, 100)
                        }
                    }
                    .background(Color(hex: "#F1F3F6"))
                }

                // Bottom Bar
                if !cartManager.items.isEmpty {
                    VStack(spacing: 0) {
                        // Shadow effect simulation
                        Rectangle()
                            .fill(Color.white)
                            .frame(height: 1)
                            .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: -2)
                            .zIndex(1)

                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                if cartManager.cartTotal < 10000 {
                                    Text("₹\(Int(cartManager.cartTotal * 1.1))")
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "#878787"))
                                        .strikethrough()
                                }
                                Text("₹\(Int(cartManager.cartTotal))")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(Color(hex: "#212121"))
                            }
                            .padding(.leading, 10)

                            Spacer()

                            Button(action: {
                                // Place Order Action
                                isCheckoutActive = true
                            }) {
                                Text("Place Order")
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 14)
                                    .background(Color(hex: "#FB641B"))
                                    .cornerRadius(4)
                            }
                            .frame(width: geometry.size.width * 0.45)
                            .navigationDestination(isPresented: $isCheckoutActive) {
                                CheckoutView(
                                    items: cartManager.items.map { item in
                                        CheckoutViewModel.CheckoutItem(
                                            product: item.product,
                                            quantity: item.quantity,
                                            selectedOfferIds: []  // Cart items don't have selected offers yet in this flow
                                        )
                                    }
                                )
                            }
                        }
                        .padding(10)
                        .background(Color.white)
                        .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: -1)
                    }
                }
            }
        }
    }
}

struct GroceryView: View {
    @ObservedObject var basketManager: BasketManager
    @State private var isCheckoutActive = false

    var body: some View {
        VStack(spacing: 0) {
            if basketManager.items.isEmpty {
                BasketEmptyStateView()
            } else {
                ScrollView {
                    VStack(spacing: 0) {
                        // 1. Delivery Banner
                        DeliveryBannerView()
                            .padding(.horizontal, 16)
                            .padding(.top, 16)

                        // 2. Items List
                        VStack(spacing: 0) {
                            ForEach(basketManager.items) { item in
                                BasketItemCell(item: item)
                                    .padding(.vertical, 16)
                                    .overlay(
                                        Divider(),
                                        alignment: .bottom
                                    )
                            }
                        }
                        .padding(.horizontal, 16)
                        .background(Color.white)
                        .padding(.bottom, 16)

                        // 3. Bill Details
                        BillDetailsView(total: basketManager.basketTotal)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 16)

                        // 4. Savings Banner
                        if basketManager.basketSavings > 0 {
                            SavingsBannerView(savings: basketManager.basketSavings)
                                .padding(.horizontal, 16)
                                .padding(.bottom, 80)
                        } else {
                            Color.clear.frame(height: 80)
                        }
                    }
                }
                .background(Color.white)
            }

            // Checkout Bar (if not empty)
            if !basketManager.items.isEmpty {
                HStack {
                    VStack(alignment: .leading) {
                        Text("Total")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                        Text("₹\(Int(basketManager.basketTotal + 2))")  // +2 handling
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                    Spacer()
                    Button(action: {
                        isCheckoutActive = true
                    }) {
                        HStack {
                            Text("Proceed to Pay")
                                .font(.system(size: 14, weight: .bold))
                            Image(systemName: "arrow.right")
                        }
                        .foregroundColor(.white)
                        .padding(.vertical, 10)
                        .padding(.horizontal, 20)
                        .background(Color(hex: "#15803d"))
                        .cornerRadius(8)
                    }
                    .navigationDestination(isPresented: $isCheckoutActive) {
                        CheckoutView(
                            items: basketManager.items.map { item in
                                CheckoutViewModel.CheckoutItem(
                                    product: item.product,
                                    quantity: item.quantity,
                                    selectedOfferIds: []
                                )
                            }
                        )
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color.white)
            }
        }
        .background(Color.white)
    }
}

// MARK: - Standard Cart Views

struct EmptyStandardCartView: View {
    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "cart.badge.minus")  // Placeholder
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "#C2C2C2"))

            Text("Your Cart is empty")
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(Color(hex: "#212121"))

            Button(action: {
                // Shop now
            }) {
                Text("Shop now")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.vertical, 10)
                    .padding(.horizontal, 24)
                    .background(Color(hex: "#2874F0"))
                    .cornerRadius(4)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.white)
    }
}

struct StandardCartItemView: View {
    let item: CartItem
    @EnvironmentObject var cartManager: CartManager

    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .top, spacing: 0) {
                // Image Column
                VStack(spacing: 8) {
                    ZStack {
                        if let firstImage = item.product.images.first {
                            let urlString =
                                firstImage.hasPrefix("http")
                                ? firstImage : "\(APIService.shared.imageHost)\(firstImage)"
                            AsyncImage(url: URL(string: urlString)) { image in
                                image.resizable().aspectRatio(contentMode: .fit)
                            } placeholder: {
                                Color.gray.opacity(0.1)
                            }
                        }
                    }
                    .frame(width: 80, height: 80)
                    .padding(.bottom, 8)

                    // Qty Selector (Box style with arrow for RN match)
                    HStack(spacing: 4) {
                        Text("Qty: \(item.quantity)")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(Color(hex: "#212121"))
                        Image(systemName: "arrowtriangle.down.fill")
                            .font(.system(size: 8))
                            .foregroundColor(Color(hex: "#212121"))
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .border(Color(hex: "#E0E0E0"), width: 1)
                }
                .frame(width: 100)

                // Details Column
                VStack(alignment: .leading, spacing: 6) {
                    Text(item.product.name)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#212121"))
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)

                    // Rating Badge
                    if let rating = item.product.rating {
                        HStack(spacing: 4) {
                            HStack(spacing: 2) {
                                Text(String(format: "%.1f", rating))
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)
                                Image(systemName: "star.fill")
                                    .font(.system(size: 8))
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "#388E3C"))
                            .cornerRadius(3)

                            Text("(\(item.product.reviewCount ?? 0))")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#878787"))
                        }
                    }

                    // Price Row
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        if let mrp = item.product.mrp, mrp > item.product.price {
                            let discount = Int(((mrp - item.product.price) / mrp) * 100)
                            if discount > 0 {
                                Text("\(discount)% off")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(Color(hex: "#388E3C"))
                            }
                            Text("₹\(Int(mrp))")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "#878787"))
                                .strikethrough()
                        }

                        Text("₹\(Int(item.product.price))")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "#212121"))
                    }

                    if let mrp = item.product.mrp, mrp > item.product.price {
                        Text("Best Price Applied")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#2874F0"))
                    }

                    // Delivery
                    HStack(spacing: 4) {
                        Text("Standard Delivery")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#212121"))
                        Text("|")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#E0E0E0"))
                        Text("Free")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "#388E3C"))
                    }
                }
                .padding(.leading, 12)
            }
            .padding(12)

            // Actions Row
            HStack(spacing: 0) {
                Button(action: {
                    // Save
                }) {
                    HStack {
                        Image(systemName: "archivebox")  // Similar to archive icon
                            .font(.system(size: 16))
                        Text("Save")
                    }
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "#878787"))
                    .frame(maxWidth: .infinity)
                }

                Divider().frame(height: 30)

                Button(action: {
                    cartManager.removeFromCart(productId: item.productId)
                }) {
                    HStack {
                        Image(systemName: "trash")
                            .font(.system(size: 16))
                        Text("Remove")
                    }
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "#878787"))
                    .frame(maxWidth: .infinity)
                }

                Divider().frame(height: 30)

                // Qty Controls (- 1 +)
                HStack(spacing: 16) {
                    Button(action: {
                        cartManager.updateQuantity(
                            productId: item.productId, quantity: item.quantity - 1)
                    }) {
                        Image(systemName: "minus")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#212121"))
                            .frame(width: 28, height: 28)
                            .background(Circle().stroke(Color(hex: "#E0E0E0"), lineWidth: 1))
                    }

                    Button(action: {
                        cartManager.updateQuantity(
                            productId: item.productId, quantity: item.quantity + 1)
                    }) {
                        Image(systemName: "plus")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#212121"))
                            .frame(width: 28, height: 28)
                            .background(Circle().stroke(Color(hex: "#E0E0E0"), lineWidth: 1))
                    }
                }
                .frame(maxWidth: .infinity)
            }
            .padding(.vertical, 12)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color(hex: "#F0F0F0")),
                alignment: .top
            )
        }
        .background(Color.white)
    }
}

struct PriceDetailsView: View {
    let total: Double
    let count: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Price Details")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "#878787"))
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.white)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(Color(hex: "#F0F0F0")),
                    alignment: .bottom
                )

            VStack(spacing: 12) {
                HStack {
                    Text("Price (\(count) items)")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#212121"))
                    Spacer()
                    Text("₹\(Int(total))")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#212121"))
                }

                HStack {
                    Text("Delivery Charges")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#212121"))
                    Spacer()
                    Text("FREE")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#388E3C"))
                }

                Divider()
                    .background(Color(hex: "#F0F0F0"))
                    .padding(.vertical, 4)

                HStack {
                    Text("Total Amount")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "#212121"))
                    Spacer()
                    Text("₹\(Int(total))")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "#212121"))
                }
            }
            .padding(16)
        }
        .background(Color.white)
        .padding(.top, 8)  // Separator from items similar to borderTopWidth 8 in RN
    }
}
