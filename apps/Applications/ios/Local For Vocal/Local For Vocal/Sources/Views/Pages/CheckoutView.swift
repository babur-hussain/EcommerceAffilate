import SwiftUI

// MARK: - Order Summary View (Checkout Step 2)
struct CheckoutView: View {
    @StateObject private var viewModel: CheckoutViewModel
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var cartManager: CartManager
    @ObservedObject private var authManager = AuthManager.shared

    init(product: Product, quantity: Int, selectedOfferIds: [String]) {
        _viewModel = StateObject(
            wrappedValue: CheckoutViewModel(
                product: product,
                quantity: quantity,
                selectedOfferIds: selectedOfferIds
            ))
    }

    // Derived for view compatibility
    var product: Product { viewModel.product }
    var quantity: Int { viewModel.quantity }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(AppTheme.Colors.textPrimary)
                    }
                    .padding(4)

                    Spacer()

                    Text("Order Summary")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(AppTheme.Colors.textPrimary)

                    Spacer()

                    Color.clear.frame(width: 28, height: 28)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white)
                .overlay(
                    Rectangle()
                        .fill(AppTheme.Colors.border)
                        .frame(height: 1),
                    alignment: .bottom
                )

                // Progress Stepper
                ProgressStepperView(currentStep: viewModel.currentStep)

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Deliver To Section
                        DeliverToSection(
                            address: viewModel.currentUserAddress,
                            onChangeUserAddress: {
                                withAnimation { viewModel.isUserAddressSelectorVisible = true }
                            }
                        )

                        // Product Card
                        ProductOrderCard(
                            product: viewModel.product,
                            quantity: viewModel.quantity,
                            discountPercent: viewModel.discountPercent
                        )

                        // Protection Plans (if any)
                        if let lastChanceOffers = viewModel.product.lastChanceOffers,
                            !lastChanceOffers.isEmpty
                        {
                            ProtectionPlansSection(
                                offers: lastChanceOffers,
                                selectedOffers: $viewModel.selectedUpsells
                            )
                        }

                        // Delivery Info
                        DeliveryInfoRow(deliveryDate: viewModel.deliveryDate)

                        // Rest Assured Section
                        RestAssuredSection(productImageUrl: viewModel.product.images.first)

                        // Donation Section
                        DonationSection(selectedDonation: $viewModel.selectedDonation)

                        // Price Breakdown
                        PriceBreakdownSection(
                            mrp: viewModel.mrpTotal,
                            fees: viewModel.totalFees,
                            discount: viewModel.discount,
                            total: viewModel.totalAmount
                        )

                        // Terms
                        TermsSection()

                        Color.clear.frame(height: 100)
                    }
                }
                .background(AppTheme.Colors.backgroundLight)

                // Bottom Bar
                OrderSummaryBottomBar(
                    mrp: viewModel.mrpTotal,
                    total: viewModel.totalAmount,
                    onViewDetails: { viewModel.isPriceDetailsVisible = true },
                    onContinue: {
                        // Check if user is logged in
                        if authManager.isAuthenticated {
                            viewModel.isPaymentViewVisible = true
                        } else {
                            viewModel.showLoginPrompt = true
                        }
                    }
                )
            }

            // UserAddress Selector Overlay
            UserAddressSelectorView(
                isVisible: $viewModel.isUserAddressSelectorVisible,
                savedUserAddresses: viewModel.savedUserAddresses,
                selectedUserAddressId: $viewModel.selectedUserAddressId,
                onSelectUserAddress: { addr in
                    viewModel.useCurrentLocation = false
                    viewModel.selectedUserAddressId = addr.id
                },
                onUseCurrentLocation: {
                    viewModel.isUserAddressSelectorVisible = false
                    viewModel.isLocationPickerVisible = true
                },
                onAddNewUserAddress: {
                    viewModel.isUserAddressSelectorVisible = false
                    viewModel.isLocationPickerVisible = true
                }
            )

            // Price Details Modal
            PriceDetailsModal(
                isVisible: $viewModel.isPriceDetailsVisible,
                itemTotal: viewModel.itemTotal,
                itemCount: viewModel.quantity,
                deliveryCharges: viewModel.shippingFee,
                protectFee: viewModel.protectFee,
                selectedOffersTotal: viewModel.selectedOffersTotal,
                discount: viewModel.discount,
                donation: Double(viewModel.selectedDonation ?? 0),
                total: viewModel.totalAmount
            )
        }
        .navigationBarHidden(true)
        .fullScreenCover(isPresented: $viewModel.isLocationPickerVisible) {
            LocationPickerView(onAddressSelected: { newUserAddress in
                viewModel.handleAddressSelection(newAddress: newUserAddress)
            })
        }
        .fullScreenCover(isPresented: $viewModel.isPaymentViewVisible) {
            PaymentView(
                totalAmount: viewModel.totalAmount,
                discount: viewModel.discount,
                itemCount: viewModel.quantity,
                onBack: {
                    viewModel.isPaymentViewVisible = false
                },
                onPaymentSelect: { method in
                    viewModel.processPayment(method: method)
                },
                isLoading: $viewModel.isProcessingPayment
            )
        }
        .fullScreenCover(isPresented: $viewModel.showPaymentSuccess) {
            PaymentSuccessView(
                orderNumber: viewModel.createdOrderNumber,
                amount: viewModel.totalAmount,
                onContinueShopping: {
                    viewModel.showPaymentSuccess = false
                    presentationMode.wrappedValue.dismiss()
                },
                onViewOrder: {
                    viewModel.showPaymentSuccess = false
                    // Show My Orders page
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        viewModel.showMyOrders = true
                    }
                }
            )
        }
        .fullScreenCover(isPresented: $viewModel.showMyOrders) {
            MyOrdersView()
        }
        .fullScreenCover(isPresented: $viewModel.showPaymentFailed) {
            PaymentFailedView(
                orderId: viewModel.createdOrderId,
                amount: viewModel.totalAmount,
                onRetry: {
                    viewModel.showPaymentFailed = false
                    // Re-show payment view
                    viewModel.isPaymentViewVisible = true
                },
                onCancel: {
                    viewModel.showPaymentFailed = false
                    presentationMode.wrappedValue.dismiss()
                }
            )
        }
        .onAppear {
            Task {
                await viewModel.fetchAddresses()
            }
        }
        .alert("Login Required", isPresented: $viewModel.showLoginPrompt) {
            Button("Go to Login") {
                viewModel.showLoginView = true
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Please log in to proceed with checkout.")
        }
        .fullScreenCover(isPresented: $viewModel.showLoginView) {
            LoginView()
        }
    }
}

// MARK: - Progress Stepper
struct ProgressStepperView: View {
    let currentStep: Int

    var body: some View {
        HStack(spacing: 0) {
            // Step 1 - UserAddress
            StepItem(
                number: 1,
                label: "UserAddress",
                isCompleted: currentStep > 1,
                isActive: currentStep == 1
            )

            StepLine(isCompleted: currentStep > 1)

            // Step 2 - Order Summary
            StepItem(
                number: 2,
                label: "Order Summary",
                isCompleted: currentStep > 2,
                isActive: currentStep == 2
            )

            StepLine(isCompleted: currentStep > 2)

            // Step 3 - Payment
            StepItem(
                number: 3,
                label: "Payment",
                isCompleted: currentStep > 3,
                isActive: currentStep == 3
            )
        }
        .padding(.vertical, 20)
        .padding(.horizontal, 16)
        .background(Color.white)
        .overlay(
            Rectangle()
                .fill(AppTheme.Colors.border)
                .frame(height: 1),
            alignment: .bottom
        )
    }
}

struct StepItem: View {
    let number: Int
    let label: String
    let isCompleted: Bool
    let isActive: Bool

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(
                        isCompleted || isActive ? AppTheme.Colors.primary : AppTheme.Colors.border
                    )
                    .frame(width: 32, height: 32)

                if isCompleted {
                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                } else {
                    Text("\(number)")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(isActive ? .white : Color(hex: "#9CA3AF"))
                }
            }

            Text(label)
                .font(.system(size: 12, weight: isActive ? .semibold : .regular))
                .foregroundColor(
                    isActive ? AppTheme.Colors.textPrimary : AppTheme.Colors.textTertiary)
        }
    }
}

struct StepLine: View {
    let isCompleted: Bool

    var body: some View {
        Rectangle()
            .fill(isCompleted ? AppTheme.Colors.primary : AppTheme.Colors.border)
            .frame(height: 2)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 8)
            .padding(.bottom, 20)
    }
}

// MARK: - Deliver To Section
struct DeliverToSection: View {
    let address: UserAddress?
    let onChangeUserAddress: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Deliver to:")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(AppTheme.Colors.textPrimary)

                Spacer()

                Button(action: onChangeUserAddress) {
                    Text(address != nil ? "Change" : "Add UserAddress")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(AppTheme.Colors.primary)
                }
            }

            if let addr = address {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 8) {
                        Text(addr.name)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(AppTheme.Colors.textPrimary)

                        Text("HOME")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(AppTheme.Colors.textTertiary)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(AppTheme.Colors.background)
                            .cornerRadius(4)
                    }

                    Text("\(addr.addressLine1), \(addr.city), \(addr.state) - \(addr.pincode)")
                        .font(.system(size: 14))
                        .foregroundColor(AppTheme.Colors.textSecondary)

                    Text(addr.phone)
                        .font(.system(size: 14))
                        .foregroundColor(AppTheme.Colors.textSecondary)
                }
            } else {
                Text("No address selected. Please add one.")
                    .font(.system(size: 14))
                    .foregroundColor(AppTheme.Colors.textTertiary)
            }
        }
        .padding(16)
        .background(Color.white)
    }
}

// MARK: - Product Order Card
struct ProductOrderCard: View {
    let product: Product
    let quantity: Int
    let discountPercent: Int

    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .top, spacing: 12) {
                // Product Image
                if let imageUrl = product.images.first, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        AppTheme.Colors.backgroundLight
                    }
                    .frame(width: 80, height: 80)
                    .background(AppTheme.Colors.backgroundLight)
                    .cornerRadius(8)
                }

                VStack(alignment: .leading, spacing: 6) {
                    // Title
                    Text(product.name)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(AppTheme.Colors.textPrimary)
                        .lineLimit(2)

                    // Rating
                    HStack(spacing: 4) {
                        HStack(spacing: 2) {
                            ForEach(1...5, id: \.self) { star in
                                Image(systemName: "star.fill")
                                    .font(.system(size: 10))
                                    .foregroundColor(
                                        star <= Int(product.rating ?? 4)
                                            ? AppTheme.Colors.success : Color(hex: "#D1D5DB")
                                    )
                            }
                        }
                        Text(
                            "\(String(format: "%.1f", product.rating ?? 4.7)) · (\(product.reviewCount ?? 0))"
                        )
                        .font(.system(size: 11))
                        .foregroundColor(AppTheme.Colors.textTertiary)

                        HStack(spacing: 4) {
                            Image(systemName: "shield.checkmark")
                                .font(.system(size: 12))
                                .foregroundColor(AppTheme.Colors.primary)
                            Text("Assured")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(AppTheme.Colors.primary)
                        }
                    }

                    // Price Row
                    HStack(spacing: 6) {
                        HStack(spacing: 2) {
                            Image(systemName: "arrow.down")
                                .font(.system(size: 10))
                                .foregroundColor(AppTheme.Colors.success)
                            Text("\(discountPercent)%")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(AppTheme.Colors.success)
                        }

                        if let mrp = product.mrp {
                            Text("₹\(Int(mrp))")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                                .strikethrough()
                        }

                        Text("₹\(Int(product.price))")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(AppTheme.Colors.textPrimary)
                    }

                    // Quantity
                    Text("Qty: \(quantity)")
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.Colors.textTertiary)
                }

                Spacer()
            }
            .padding(16)
        }
        .background(Color.white)
    }
}

// MARK: - Protection Plans Section
struct ProtectionPlansSection: View {
    let offers: [LastChanceOffer]
    @Binding var selectedOffers: Set<String>

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(offers.enumerated()), id: \.element.id) { index, offer in
                let offerId = offer.tempId(index: index)
                let isSelected = selectedOffers.contains(offerId)

                Button(action: {
                    if isSelected {
                        selectedOffers.remove(offerId)
                    } else {
                        selectedOffers.insert(offerId)
                    }
                }) {
                    HStack {
                        HStack(spacing: 12) {
                            Image(systemName: "shield.checkmark")
                                .font(.system(size: 18))
                                .foregroundColor(AppTheme.Colors.textTertiary)

                            Text(offer.title)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(AppTheme.Colors.textPrimary)
                        }

                        Spacer()

                        Button(action: {
                            selectedOffers.remove(offerId)
                        }) {
                            Image(systemName: "xmark")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                        }
                    }
                    .padding(16)
                    .background(isSelected ? Color(hex: "#EFF6FF") : Color.white)
                }
                .buttonStyle(PlainButtonStyle())

                // Price Row
                HStack(spacing: 8) {
                    Text("₹\(Int(offer.originalPrice))")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .strikethrough()

                    Text("₹\(Int(offer.offerPrice))")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(AppTheme.Colors.textPrimary)

                    if let discount = offer.discountPercentage {
                        Text("\(discount)% off")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(AppTheme.Colors.success)
                    }

                    if let tag = offer.tag {
                        Text("· \(tag)")
                            .font(.system(size: 12))
                            .foregroundColor(AppTheme.Colors.textTertiary)
                    }
                }
                .padding(.horizontal, 56)
                .padding(.bottom, 12)
                .background(isSelected ? Color(hex: "#EFF6FF") : Color.white)

                if index < offers.count - 1 {
                    Rectangle()
                        .fill(AppTheme.Colors.border)
                        .frame(height: 1)
                }
            }
        }
    }
}

// MARK: - Delivery Info Row
struct DeliveryInfoRow: View {
    let deliveryDate: String

    var body: some View {
        HStack {
            Text("Delivery by \(deliveryDate)")
                .font(.system(size: 14))
                .foregroundColor(AppTheme.Colors.textSecondary)
            Spacer()
        }
        .padding(16)
        .background(Color.white)
    }
}

// MARK: - Rest Assured Section
struct RestAssuredSection: View {
    let productImageUrl: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Image(systemName: "cube.box.fill")
                    .font(.system(size: 24))
                    .foregroundColor(Color(hex: "#F59E0B"))

                Text("Rest assured with Open Box Delivery")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(AppTheme.Colors.textPrimary)
            }

            if let imageUrl = productImageUrl, let url = URL(string: imageUrl) {
                HStack {
                    Spacer()
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        AppTheme.Colors.background
                    }
                    .frame(width: 80, height: 60)
                    Spacer()
                }
            }

            Text(
                "Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery. "
            )
            .font(.system(size: 12))
            .foregroundColor(AppTheme.Colors.textTertiary)
                + Text("Why?")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(AppTheme.Colors.primary)
        }
        .padding(16)
        .background(Color.white)
        .padding(.top, 8)
    }
}

// MARK: - Donation Section
struct DonationSection: View {
    @Binding var selectedDonation: Int?

    let amounts = [10, 20, 50, 100]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Donate to Support Education")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(AppTheme.Colors.textPrimary)

                    Text("Support transformative social work in India")
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.Colors.textTertiary)
                }

                Spacer()

                // Placeholder image
                RoundedRectangle(cornerRadius: 8)
                    .fill(AppTheme.Colors.background)
                    .frame(width: 80, height: 50)
            }

            HStack(spacing: 12) {
                ForEach(amounts, id: \.self) { amount in
                    Button(action: {
                        if selectedDonation == amount {
                            selectedDonation = nil
                        } else {
                            selectedDonation = amount
                        }
                    }) {
                        Text("₹\(amount)")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(
                                selectedDonation == amount ? .white : Color(hex: "#374151")
                            )
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(
                                selectedDonation == amount ? AppTheme.Colors.primary : Color.white
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 6)
                                    .stroke(
                                        selectedDonation == amount
                                            ? AppTheme.Colors.primary : Color(hex: "#D1D5DB"),
                                        lineWidth: 1)
                            )
                            .cornerRadius(6)
                    }
                }
            }

            Text("Note: 100% of the donation goes to the cause")
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "#9CA3AF"))
        }
        .padding(16)
        .background(Color.white)
        .padding(.top, 8)
    }
}

// MARK: - Price Breakdown Section
struct PriceBreakdownSection: View {
    let mrp: Double
    let fees: Double
    let discount: Double
    let total: Double

    var body: some View {
        VStack(spacing: 12) {
            // MRP
            HStack {
                Text("MRP(incl. of all taxes)")
                    .font(.system(size: 14))
                    .foregroundColor(AppTheme.Colors.textSecondary)
                Spacer()
                Text("₹\(Int(mrp))")
                    .font(.system(size: 14))
                    .foregroundColor(AppTheme.Colors.textPrimary)
            }

            DottedDivider()

            // Fees
            HStack {
                HStack(spacing: 4) {
                    Text("Fees")
                        .font(.system(size: 14))
                        .foregroundColor(AppTheme.Colors.textSecondary)
                    Image(systemName: "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.Colors.textTertiary)
                }
                Spacer()
                Text("₹\(Int(fees))")
                    .font(.system(size: 14))
                    .foregroundColor(AppTheme.Colors.textPrimary)
            }

            DottedDivider()

            // Discounts
            HStack {
                HStack(spacing: 4) {
                    Text("Discounts")
                        .font(.system(size: 14))
                        .foregroundColor(AppTheme.Colors.textSecondary)
                    Image(systemName: "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.Colors.textTertiary)
                }
                Spacer()
                Text("-₹\(Int(discount))")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "#059669"))
            }

            DottedDivider()

            // Total
            HStack {
                Text("Total Amount")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(AppTheme.Colors.textPrimary)
                Spacer()
                Text("₹\(Int(total))")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(AppTheme.Colors.textPrimary)
            }

            // Savings Box
            HStack {
                Spacer()
                Text("You will save ₹\(Int(discount)) on this order")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "#047857"))
                Spacer()
            }
            .padding(10)
            .background(Color(hex: "#ECFDF5"))
            .cornerRadius(6)
        }
        .padding(16)
        .background(Color.white)
        .padding(.top, 8)
    }
}

struct DottedDivider: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                let width = geometry.size.width
                var x: CGFloat = 0
                while x < width {
                    path.move(to: CGPoint(x: x, y: 0))
                    path.addLine(to: CGPoint(x: x + 4, y: 0))
                    x += 8
                }
            }
            .stroke(AppTheme.Colors.border, lineWidth: 1)
        }
        .frame(height: 1)
    }
}

// MARK: - Terms Section
struct TermsSection: View {
    var body: some View {
        VStack(spacing: 4) {
            Text(
                "By continuing with the order, you confirm that you are above 18 years of age, and you agree to our "
            )
            .font(.system(size: 11))
            .foregroundColor(AppTheme.Colors.textTertiary)
                + Text("Terms of Use")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(AppTheme.Colors.primary)
                + Text(" and ")
                .font(.system(size: 11))
                .foregroundColor(AppTheme.Colors.textTertiary)
                + Text("Privacy Policy")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(AppTheme.Colors.primary)
        }
    }
}

// MARK: - Bottom Bar
struct OrderSummaryBottomBar: View {
    let mrp: Double
    let total: Double
    let onViewDetails: () -> Void
    let onContinue: () -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("₹\(Int(mrp))")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#9CA3AF"))
                    .strikethrough()

                Text("₹\(Int(total))")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(AppTheme.Colors.textPrimary)

                Button(action: onViewDetails) {
                    Text("View price details")
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.Colors.primary)
                }
            }

            Spacer()

            Button(action: onContinue) {
                Text("Continue")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 14)
                    .background(Color(hex: "#FFD700"))
                    .foregroundColor(AppTheme.Colors.textPrimary)
                    .cornerRadius(8)
            }
        }
        .padding(16)
        .background(Color.white)
        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: -2)
    }
}

// MARK: - Price Details Modal
struct PriceDetailsModal: View {
    @Binding var isVisible: Bool
    let itemTotal: Double
    let itemCount: Int
    let deliveryCharges: Double
    let protectFee: Double
    let selectedOffersTotal: Double
    let discount: Double
    let donation: Double
    let total: Double

    var body: some View {
        ZStack(alignment: .bottom) {
            if isVisible {
                // Dimmed Background
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation(.easeInOut(duration: 0.25)) {
                            isVisible = false
                        }
                    }

                // Modal Content
                VStack(spacing: 0) {
                    // Header
                    HStack {
                        Text("Price Details")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(AppTheme.Colors.textPrimary)

                        Spacer()

                        Button(action: {
                            withAnimation(.easeInOut(duration: 0.25)) {
                                isVisible = false
                            }
                        }) {
                            Image(systemName: "xmark")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(AppTheme.Colors.textTertiary)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 18)
                    .background(Color.white)

                    // Content
                    VStack(spacing: 0) {
                        // Price (X items)
                        PriceDetailRow(
                            label: "Price (\(itemCount) item\(itemCount > 1 ? "s" : ""))",
                            value: "₹\(Int(itemTotal))",
                            valueColor: AppTheme.Colors.textPrimary
                        )

                        // Delivery Charges
                        PriceDetailRow(
                            label: "Delivery Charges",
                            value: deliveryCharges > 0 ? "₹\(Int(deliveryCharges))" : "FREE",
                            valueColor: deliveryCharges > 0
                                ? AppTheme.Colors.textPrimary : Color(hex: "#059669")
                        )

                        // Protect Promise Fee (if any)
                        if protectFee > 0 {
                            PriceDetailRow(
                                label: "Protect Promise Fee",
                                value: "₹\(Int(protectFee))",
                                valueColor: AppTheme.Colors.textPrimary
                            )
                        }

                        // Selected Offers (if any)
                        if selectedOffersTotal > 0 {
                            PriceDetailRow(
                                label: "Add-ons",
                                value: "₹\(Int(selectedOffersTotal))",
                                valueColor: AppTheme.Colors.textPrimary
                            )
                        }

                        // Donation (if any)
                        if donation > 0 {
                            PriceDetailRow(
                                label: "Donation",
                                value: "₹\(Int(donation))",
                                valueColor: AppTheme.Colors.textPrimary
                            )
                        }

                        // Discount
                        PriceDetailRow(
                            label: "Discount",
                            value: "-₹\(Int(discount))",
                            valueColor: Color(hex: "#059669")
                        )

                        // Divider
                        Rectangle()
                            .fill(AppTheme.Colors.border)
                            .frame(height: 1)
                            .padding(.vertical, 16)
                            .padding(.horizontal, 20)

                        // Total Amount
                        HStack {
                            Text("Total Amount")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppTheme.Colors.textPrimary)

                            Spacer()

                            Text("₹\(Int(total))")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(AppTheme.Colors.textPrimary)
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 16)

                        // Savings Banner
                        if discount > 0 {
                            HStack {
                                Spacer()
                                Text("You will save ₹\(Int(discount)) on this order")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(Color(hex: "#047857"))
                                Spacer()
                            }
                            .padding(.vertical, 14)
                            .background(Color(hex: "#ECFDF5"))
                            .cornerRadius(8)
                            .padding(.horizontal, 20)
                            .padding(.bottom, 20)
                        }
                    }
                    .padding(.top, 8)
                }
                .background(Color.white)
                .cornerRadius(20, corners: [.topLeft, .topRight])
                .transition(.move(edge: .bottom))
            }
        }
        .edgesIgnoringSafeArea(.all)
        .zIndex(200)
        .animation(.easeInOut(duration: 0.25), value: isVisible)
    }
}

// MARK: - Price Detail Row
struct PriceDetailRow: View {
    let label: String
    let value: String
    let valueColor: Color

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 15))
                .foregroundColor(AppTheme.Colors.textSecondary)

            Spacer()

            Text(value)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(valueColor)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }
}
