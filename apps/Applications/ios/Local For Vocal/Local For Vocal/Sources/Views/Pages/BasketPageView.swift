import SwiftUI

struct BasketPageView: View {
    @EnvironmentObject var basketManager: BasketManager
    @Environment(\.presentationMode) var presentationMode
    @State private var isSearching = false
    var groceryTab: Binding<GroceryTab>?  // Optional: when inside GroceryContainerView
    @State private var isCheckoutActive = false

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                HStack(spacing: 12) {
                    Button(action: {
                        if let tab = groceryTab {
                            tab.wrappedValue = .grocery
                        } else {
                            presentationMode.wrappedValue.dismiss()
                        }
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "#111827"))
                    }

                    Text("My Basket (\(basketManager.basketCount) Items)")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color(hex: "#111827"))

                    Spacer()

                    Button(action: {
                        isSearching = true
                    }) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }
                .padding()
                .background(Color.white)
                .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
                .zIndex(1)

                if basketManager.items.isEmpty {
                    BasketEmptyStateView()
                } else {
                    ScrollView {
                        VStack(spacing: 0) {
                            // 1. Delivery Banner
                            DeliveryBannerView()  // Reuse from CartPageView if compatible, or redefine
                                .padding(.horizontal, 16)
                                .padding(.top, 16)

                            // 2. Items List
                            VStack(spacing: 0) {  // Divider styling
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
                            BillDetailsView(total: basketManager.basketTotal)  // Reuse
                                .padding(.horizontal, 16)
                                .padding(.bottom, 16)

                            // 4. Savings Banner
                            if basketManager.basketSavings > 0 {
                                SavingsBannerView(savings: basketManager.basketSavings)
                                    .padding(.horizontal, 16)
                                    .padding(.bottom, 100)
                            } else {
                                Color.clear.frame(height: 100)
                            }
                        }
                    }
                    .background(Color(hex: "#F3F4F6"))
                }

                // Checkout Bar (if not empty)
                if !basketManager.items.isEmpty {
                    VStack(spacing: 0) {
                        Divider()
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
                                .padding(.vertical, 12)
                                .padding(.horizontal, 24)
                                .background(Color(hex: "#15803d"))
                                .cornerRadius(8)
                            }
                        }
                        .padding(16)
                        .background(Color.white)
                    }
                    .zIndex(2)
                }
            }
            .background(Color(hex: "#F3F4F6").edgesIgnoringSafeArea(.all))
            .background(
                NavigationLink(
                    destination: CheckoutView(
                        items: basketManager.items.map { item in
                            CheckoutViewModel.CheckoutItem(
                                product: item.product,
                                quantity: item.quantity,
                                selectedOfferIds: []
                            )
                        }
                    ),
                    isActive: $isCheckoutActive
                ) { EmptyView() }
            )
            .navigationBarHidden(true)
        }  // NavigationView
        .navigationViewStyle(.stack)
        .fullScreenCover(isPresented: $isSearching) {
            GroceryGlobalSearchView()
        }
    }
}

// MARK: - Subviews

struct BasketEmptyStateView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                VStack(alignment: .center, spacing: 20) {
                    if let url = URL(
                        string: "https://cdn-icons-png.flaticon.com/512/11329/11329060.png")
                    {
                        AsyncImage(url: url) { image in
                            image.resizable().aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .frame(width: 150, height: 150)
                    }

                    Text("Your basket is empty!")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    Button(action: {
                        // Shop now action
                    }) {
                        Text("Shop now")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.vertical, 12)
                            .padding(.horizontal, 48)
                            .background(Color(hex: "#2563EB"))
                            .cornerRadius(4)
                    }
                }
                .padding(.bottom, 30)
                .padding(.top, 10)
                .frame(maxWidth: .infinity)
                .background(Color.white)

                // Recommendations Section Placeholder
                // Need to implement Steal Deal / Try it Buy it logic here if required
            }
        }
        .background(Color(hex: "#F3F4F6"))
    }
}

struct BasketItemCell: View {
    let item: CartItem
    @EnvironmentObject var basketManager: BasketManager

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Image
            ZStack {
                Color(hex: "#F9FAFB")
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
            .frame(width: 60, height: 60)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
            )

            // Info
            VStack(alignment: .leading, spacing: 4) {
                Text(item.product.name)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)

                Text(item.product.subtitle ?? "1 pc")  // Weight from description/subtitle if mapped
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#6B7280"))

                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text("₹\(Int(item.product.price))")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    if let mrp = item.product.mrp, mrp > item.product.price {
                        Text("₹\(Int(mrp))")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                            .strikethrough()
                    }
                }
            }

            Spacer()

            // Quantity Control
            HStack(spacing: 0) {
                Button(action: {
                    basketManager.updateQuantity(
                        productId: item.productId, quantity: item.quantity - 1)
                }) {
                    Text("-")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 28, height: 32)
                }

                Text("\(item.quantity)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(minWidth: 20)

                Button(action: {
                    basketManager.updateQuantity(
                        productId: item.productId, quantity: item.quantity + 1)
                }) {
                    Text("+")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 28, height: 32)
                }
            }

            .background(Color(hex: "#15803d"))
            .cornerRadius(6)
        }
    }
}

struct DeliveryBannerView: View {
    var body: some View {
        HStack {
            Image(systemName: "location.fill")
                .foregroundColor(Color(hex: "#15803d"))
            Text("Delivery to ")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "#374151"))
                + Text("Home - 560066")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(hex: "#111827"))
            Spacer()
            Button("Change") {
                // Action
            }
            .font(.system(size: 12, weight: .bold))
            .foregroundColor(Color(hex: "#15803d"))
        }
        .padding(12)
        .background(Color(hex: "#dcfce7"))
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(hex: "#86efac"), lineWidth: 1)
        )
    }
}

struct BillDetailsView: View {
    let total: Double
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Bill Details")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(hex: "#374151"))

            HStack {
                Text("Item Total")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#4b5563"))
                Spacer()
                Text("₹\(Int(total))")
            }
            HStack {
                Text("Delivery Fee")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#4b5563"))
                Spacer()
                Text("₹25")
                    .strikethrough()
                    .foregroundColor(Color(hex: "#9ca3af"))
                    + Text(" Free")
                    .foregroundColor(Color(hex: "#15803d"))
            }
            HStack {
                Text("Handling Charge")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#4b5563"))
                Spacer()
                Text("₹2")
            }
            Divider()
            HStack {
                Text("To Pay")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                Spacer()
                Text("₹\(Int(total + 2))")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
            }
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(8)
    }
}

struct SavingsBannerView: View {
    let savings: Double

    var body: some View {
        HStack {
            Image(systemName: "tag.fill")
                .foregroundColor(Color(hex: "#15803d"))
            Text("You saved ₹\(Int(savings)) on this order")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(hex: "#14532d"))
            Spacer()
        }
        .padding(10)
        .background(Color(hex: "#f0fdf4"))
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(hex: "#bbf7d0"), style: StrokeStyle(lineWidth: 1, dash: [4]))
        )
    }
}
