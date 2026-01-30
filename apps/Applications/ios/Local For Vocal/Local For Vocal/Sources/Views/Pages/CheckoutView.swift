import SwiftUI

// MARK: - Order Summary View (Checkout Step 2)
struct CheckoutView: View {
    let product: Product
    let quantity: Int
    let selectedOfferIds: [String]

    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var cartManager: CartManager
    @StateObject private var locationManager = LocationManager()
    @ObservedObject private var authManager = AuthManager.shared

    // Step State
    @State private var currentStep = 2

    // UserAddress State
    @State private var isUserAddressSelectorVisible = false
    @State private var selectedUserAddressId: String?
    @State private var savedUserAddresses: [UserAddress] = []
    @State private var isLoadingUserAddresses = true
    @State private var useCurrentLocation = false

    // Donation State
    @State private var selectedDonation: Int? = nil

    // Price Details Modal
    @State private var isPriceDetailsVisible = false

    // Location Picker
    @State private var isLocationPickerVisible = false

    // Payment View
    @State private var isPaymentViewVisible = false

    // Payment Result States
    @State private var showPaymentSuccess = false
    @State private var showPaymentFailed = false
    @State private var showMyOrders = false
    @State private var createdOrderId: String? = nil
    @State private var createdOrderNumber: String? = nil
    @State private var isProcessingPayment = false

    // Login Required State
    @State private var showLoginPrompt = false
    @State private var showLoginView = false

    // Selected upsell offers
    @State private var selectedUpsells: Set<String> = []

    var currentUserAddress: UserAddress? {
        if useCurrentLocation, locationManager.address != "Locating..." {
            return UserAddress(
                _id: "current-location",
                userId: "",
                name: "Current Location",
                phone: "",
                addressLine1: locationManager.address,
                city: locationManager.city,
                state: "",
                pincode: "",
                isDefault: false
            )
        }
        return savedUserAddresses.first { $0.id == selectedUserAddressId }
            ?? savedUserAddresses.first
    }

    // Bill Calculations
    var itemTotal: Double { product.price * Double(quantity) }
    var mrpTotal: Double { (product.mrp ?? product.price) * Double(quantity) }
    var protectFee: Double { product.protectPromiseFee ?? 0 }
    var shippingFee: Double { product.shippingCharges ?? 0 }
    var discount: Double { mrpTotal - itemTotal }
    var discountPercent: Int {
        guard mrpTotal > 0 else { return 0 }
        return Int(((mrpTotal - itemTotal) / mrpTotal) * 100)
    }

    // Calculate selected last chance offers total
    var selectedOffersTotal: Double {
        guard let offers = product.lastChanceOffers else { return 0 }
        var total: Double = 0
        for (index, offer) in offers.enumerated() {
            let offerId = offer.tempId(index: index)
            if selectedUpsells.contains(offerId) {
                total += offer.offerPrice
            }
        }
        return total
    }

    // Total amount includes: item price + shipping + protect fee + selected offers + donation
    var totalAmount: Double {
        itemTotal + shippingFee + protectFee + selectedOffersTotal + Double(selectedDonation ?? 0)
    }

    // Total fees (for display)
    var totalFees: Double {
        protectFee + shippingFee
    }

    // Delivery Date
    var deliveryDate: String {
        let date = Calendar.current.date(byAdding: .day, value: 3, to: Date()) ?? Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, EEE"
        return formatter.string(from: date)
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }
                    .padding(4)

                    Spacer()

                    Text("Order Summary")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "#1F2937"))

                    Spacer()

                    Color.clear.frame(width: 28, height: 28)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white)
                .overlay(
                    Rectangle()
                        .fill(Color(hex: "#E5E7EB"))
                        .frame(height: 1),
                    alignment: .bottom
                )

                // Progress Stepper
                ProgressStepperView(currentStep: currentStep)

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Deliver To Section
                        DeliverToSection(
                            address: currentUserAddress,
                            onChangeUserAddress: {
                                withAnimation { isUserAddressSelectorVisible = true }
                            }
                        )

                        // Product Card
                        ProductOrderCard(
                            product: product,
                            quantity: quantity,
                            discountPercent: discountPercent
                        )

                        // Protection Plans (if any)
                        if let lastChanceOffers = product.lastChanceOffers,
                            !lastChanceOffers.isEmpty
                        {
                            ProtectionPlansSection(
                                offers: lastChanceOffers,
                                selectedOffers: $selectedUpsells
                            )
                        }

                        // Delivery Info
                        DeliveryInfoRow(deliveryDate: deliveryDate)

                        // Rest Assured Section
                        RestAssuredSection(productImageUrl: product.images.first)

                        // Donation Section
                        DonationSection(selectedDonation: $selectedDonation)

                        // Price Breakdown
                        PriceBreakdownSection(
                            mrp: mrpTotal,
                            fees: totalFees,
                            discount: discount,
                            total: totalAmount
                        )

                        // Terms
                        TermsSection()

                        Color.clear.frame(height: 100)
                    }
                }
                .background(Color(hex: "#F9FAFB"))

                // Bottom Bar
                OrderSummaryBottomBar(
                    mrp: mrpTotal,
                    total: totalAmount,
                    onViewDetails: { isPriceDetailsVisible = true },
                    onContinue: {
                        // Check if user is logged in
                        if authManager.isAuthenticated {
                            isPaymentViewVisible = true
                        } else {
                            showLoginPrompt = true
                        }
                    }
                )
            }

            // UserAddress Selector Overlay
            UserAddressSelectorView(
                isVisible: $isUserAddressSelectorVisible,
                savedUserAddresses: savedUserAddresses,
                selectedUserAddressId: $selectedUserAddressId,
                onSelectUserAddress: { addr in
                    useCurrentLocation = false
                    selectedUserAddressId = addr.id
                },
                onUseCurrentLocation: {
                    isUserAddressSelectorVisible = false
                    isLocationPickerVisible = true
                },
                onAddNewUserAddress: {
                    isUserAddressSelectorVisible = false
                    isLocationPickerVisible = true
                }
            )

            // Price Details Modal
            PriceDetailsModal(
                isVisible: $isPriceDetailsVisible,
                itemTotal: itemTotal,
                itemCount: quantity,
                deliveryCharges: shippingFee,
                protectFee: protectFee,
                selectedOffersTotal: selectedOffersTotal,
                discount: discount,
                donation: Double(selectedDonation ?? 0),
                total: totalAmount
            )
        }
        .navigationBarHidden(true)
        .fullScreenCover(isPresented: $isLocationPickerVisible) {
            LocationPickerView(onAddressSelected: { newUserAddress in
                // Refresh addresses from server to get the saved one
                Task {
                    do {
                        let addresses = try await APIService.shared.fetchAddresses()
                        await MainActor.run {
                            savedUserAddresses = addresses
                            // Select the newly added address (or find it by matching)
                            if let savedAddr = addresses.first(where: {
                                $0.name == newUserAddress.name && $0.phone == newUserAddress.phone
                            }) {
                                selectedUserAddressId = savedAddr.id
                            } else if !addresses.isEmpty {
                                selectedUserAddressId = addresses.last?.id
                            }
                            useCurrentLocation = false
                        }
                    } catch {
                        // Fallback: just add locally
                        await MainActor.run {
                            savedUserAddresses.append(newUserAddress)
                            selectedUserAddressId = newUserAddress.id
                            useCurrentLocation = false
                        }
                    }
                }
            })
        }
        .fullScreenCover(isPresented: $isPaymentViewVisible) {
            PaymentView(
                totalAmount: totalAmount,
                discount: discount,
                itemCount: quantity,
                onBack: {
                    isPaymentViewVisible = false
                },
                onPaymentSelect: { method in
                    processPayment(method: method)
                },
                isLoading: $isProcessingPayment
            )
        }
        .fullScreenCover(isPresented: $showPaymentSuccess) {
            PaymentSuccessView(
                orderNumber: createdOrderNumber,
                amount: totalAmount,
                onContinueShopping: {
                    showPaymentSuccess = false
                    presentationMode.wrappedValue.dismiss()
                },
                onViewOrder: {
                    showPaymentSuccess = false
                    // Show My Orders page
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        showMyOrders = true
                    }
                }
            )
        }
        .fullScreenCover(isPresented: $showMyOrders) {
            MyOrdersView()
        }
        .fullScreenCover(isPresented: $showPaymentFailed) {
            PaymentFailedView(
                orderId: createdOrderId,
                amount: totalAmount,
                onRetry: {
                    showPaymentFailed = false
                    // Re-show payment view
                    isPaymentViewVisible = true
                },
                onCancel: {
                    showPaymentFailed = false
                    presentationMode.wrappedValue.dismiss()
                }
            )
        }
        .onAppear {
            // Pre-select offers that came from LastChancePopup
            selectedUpsells = Set(selectedOfferIds)

            // Fetch saved addresses from API
            Task {
                do {
                    let addresses = try await APIService.shared.fetchAddresses()
                    await MainActor.run {
                        savedUserAddresses = addresses
                        isLoadingUserAddresses = false

                        // Auto-select default address or first one
                        if let defaultAddr = addresses.first(where: { $0.isDefault }) {
                            selectedUserAddressId = defaultAddr.id
                        } else if let firstAddr = addresses.first {
                            selectedUserAddressId = firstAddr.id
                        }
                    }
                } catch {
                    print("Error fetching addresses: \(error)")
                    await MainActor.run {
                        isLoadingUserAddresses = false
                    }
                }
            }
        }
        .alert("Login Required", isPresented: $showLoginPrompt) {
            Button("Go to Login") {
                showLoginView = true
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Please log in to proceed with checkout.")
        }
        .fullScreenCover(isPresented: $showLoginView) {
            LoginView()
        }
    }

    // MARK: - Process Payment
    private func processPayment(method: String) {
        guard let address = currentUserAddress else {
            print("No address selected")
            return
        }

        isProcessingPayment = true

        Task {
            do {
                // Prepare order items
                let orderItems = [
                    OrderService.OrderItem(
                        productId: product._id,
                        quantity: quantity,
                        price: itemTotal / Double(quantity),
                        name: product.name,
                        image: product.images.first
                    )
                ]

                // Prepare address payload
                let addressPayload = OrderService.AddressPayload(
                    name: address.name,
                    phone: address.phone,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    country: address.country
                )

                // Prepare last chance offers if any
                var lastChanceOfferPayloads: [OrderService.LastChanceOfferPayload]? = nil
                if !selectedUpsells.isEmpty, let offers = product.lastChanceOffers {
                    lastChanceOfferPayloads =
                        offers
                        .filter { selectedUpsells.contains($0.id) }
                        .map {
                            OrderService.LastChanceOfferPayload(
                                id: $0.id, name: $0.title, price: $0.offerPrice)
                        }
                }

                // Create order
                guard let token = authManager.authToken else { return }

                let orderResponse = try await OrderService.shared.createOrder(
                    items: orderItems,
                    address: addressPayload,
                    addressId: address.id,  // Pass the address ID
                    paymentMethod: method,
                    authToken: token,
                    donation: selectedDonation != nil ? Double(selectedDonation!) : nil,
                    protectPromiseFee: protectFee,
                    shippingFee: shippingFee,  // Pass shipping fee
                    lastChanceOffers: lastChanceOfferPayloads
                )

                await MainActor.run {
                    createdOrderId = orderResponse._id
                    createdOrderNumber = orderResponse.orderNumber ?? orderResponse._id

                    // Do NOT dismiss PaymentView yet if using Razorpay
                    // isPaymentViewVisible = false

                    if method == "COD" {
                        // Cash on Delivery - show success immediately
                        isProcessingPayment = false
                        isPaymentViewVisible = false
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            showPaymentSuccess = true
                        }
                    } else {
                        // Razorpay - initiate payment using the real service
                        // Keep isProcessingPayment = true until Razorpay callback

                        // Resolve the TOPMOST UIViewController to present the checkout
                        var topVC = UIApplication.shared.connectedScenes
                            .compactMap { $0 as? UIWindowScene }
                            .first?.windows
                            .filter { $0.isKeyWindow }.first?.rootViewController

                        // Climb the hierarchy to find the topmost presented view controller
                        // This will likely find the PaymentView's hosting controller
                        while let presentedVC = topVC?.presentedViewController {
                            topVC = presentedVC
                        }

                        guard let presentingVC = topVC else {
                            print("Could not find root view controller to present Razorpay")
                            isProcessingPayment = false
                            showPaymentFailed = true
                            return
                        }

                        print("📱 Presenting Razorpay on: \(presentingVC)")

                        RazorpayService.shared.initiatePayment(
                            orderId: orderResponse._id, from: presentingVC
                        ) { result in
                            Task { @MainActor in
                                // Reset processing state
                                isProcessingPayment = false

                                // Dismiss PaymentView first
                                isPaymentViewVisible = false

                                // Wait for dismissal to complete before showing result
                                try? await Task.sleep(nanoseconds: 500_000_000)  // 0.5s

                                switch result {
                                case .success(let paymentData):
                                    // Payment Verified by Service
                                    print("✅ Payment success! ID: \(paymentData.razorpayPaymentId)")
                                    showPaymentSuccess = true
                                case .failure(let error):
                                    print("❌ Payment failed: \(error)")
                                    showPaymentFailed = true
                                }
                            }
                        }
                    }
                }
            } catch {
                print("Error creating order: \(error)")
                await MainActor.run {
                    isProcessingPayment = false
                    isPaymentViewVisible = false
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        showPaymentFailed = true
                    }
                }
            }
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
                .fill(Color(hex: "#E5E7EB"))
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
                    .fill(isCompleted || isActive ? Color(hex: "#2563EB") : Color(hex: "#E5E7EB"))
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
                .foregroundColor(isActive ? Color(hex: "#1F2937") : Color(hex: "#6B7280"))
        }
    }
}

struct StepLine: View {
    let isCompleted: Bool

    var body: some View {
        Rectangle()
            .fill(isCompleted ? Color(hex: "#2563EB") : Color(hex: "#E5E7EB"))
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
                    .foregroundColor(Color(hex: "#1F2937"))

                Spacer()

                Button(action: onChangeUserAddress) {
                    Text(address != nil ? "Change" : "Add UserAddress")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "#2563EB"))
                }
            }

            if let addr = address {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 8) {
                        Text(addr.name)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))

                        Text("HOME")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(hex: "#6B7280"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color(hex: "#F3F4F6"))
                            .cornerRadius(4)
                    }

                    Text("\(addr.addressLine1), \(addr.city), \(addr.state) - \(addr.pincode)")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#4B5563"))

                    Text(addr.phone)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#4B5563"))
                }
            } else {
                Text("No address selected. Please add one.")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#6B7280"))
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
                        Color(hex: "#F9FAFB")
                    }
                    .frame(width: 80, height: 80)
                    .background(Color(hex: "#F9FAFB"))
                    .cornerRadius(8)
                }

                VStack(alignment: .leading, spacing: 6) {
                    // Title
                    Text(product.name)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "#1F2937"))
                        .lineLimit(2)

                    // Rating
                    HStack(spacing: 4) {
                        HStack(spacing: 2) {
                            ForEach(1...5, id: \.self) { star in
                                Image(systemName: "star.fill")
                                    .font(.system(size: 10))
                                    .foregroundColor(
                                        star <= Int(product.rating ?? 4)
                                            ? Color(hex: "#16A34A") : Color(hex: "#D1D5DB")
                                    )
                            }
                        }
                        Text(
                            "\(String(format: "%.1f", product.rating ?? 4.7)) · (\(product.reviewCount ?? 0))"
                        )
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#6B7280"))

                        HStack(spacing: 4) {
                            Image(systemName: "shield.checkmark")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#2563EB"))
                            Text("Assured")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Color(hex: "#2563EB"))
                        }
                    }

                    // Price Row
                    HStack(spacing: 6) {
                        HStack(spacing: 2) {
                            Image(systemName: "arrow.down")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "#16A34A"))
                            Text("\(discountPercent)%")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "#16A34A"))
                        }

                        if let mrp = product.mrp {
                            Text("₹\(Int(mrp))")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                                .strikethrough()
                        }

                        Text("₹\(Int(product.price))")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }

                    // Quantity
                    Text("Qty: \(quantity)")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
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
                                .foregroundColor(Color(hex: "#6B7280"))

                            Text(offer.title)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "#1F2937"))
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
                        .foregroundColor(Color(hex: "#1F2937"))

                    if let discount = offer.discountPercentage {
                        Text("\(discount)% off")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(Color(hex: "#16A34A"))
                    }

                    if let tag = offer.tag {
                        Text("· \(tag)")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }
                .padding(.horizontal, 56)
                .padding(.bottom, 12)
                .background(isSelected ? Color(hex: "#EFF6FF") : Color.white)

                if index < offers.count - 1 {
                    Rectangle()
                        .fill(Color(hex: "#E5E7EB"))
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
                .foregroundColor(Color(hex: "#4B5563"))
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
                    .foregroundColor(Color(hex: "#1F2937"))
            }

            if let imageUrl = productImageUrl, let url = URL(string: imageUrl) {
                HStack {
                    Spacer()
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color(hex: "#F3F4F6")
                    }
                    .frame(width: 80, height: 60)
                    Spacer()
                }
            }

            Text(
                "Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery. "
            )
            .font(.system(size: 12))
            .foregroundColor(Color(hex: "#6B7280"))
                + Text("Why?")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "#2563EB"))
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
                        .foregroundColor(Color(hex: "#1F2937"))

                    Text("Support transformative social work in India")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
                }

                Spacer()

                // Placeholder image
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(hex: "#F3F4F6"))
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
                                selectedDonation == amount ? Color(hex: "#2563EB") : Color.white
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 6)
                                    .stroke(
                                        selectedDonation == amount
                                            ? Color(hex: "#2563EB") : Color(hex: "#D1D5DB"),
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
                    .foregroundColor(Color(hex: "#4B5563"))
                Spacer()
                Text("₹\(Int(mrp))")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#1F2937"))
            }

            DottedDivider()

            // Fees
            HStack {
                HStack(spacing: 4) {
                    Text("Fees")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#4B5563"))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
                }
                Spacer()
                Text("₹\(Int(fees))")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#1F2937"))
            }

            DottedDivider()

            // Discounts
            HStack {
                HStack(spacing: 4) {
                    Text("Discounts")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#4B5563"))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
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
                    .foregroundColor(Color(hex: "#1F2937"))
                Spacer()
                Text("₹\(Int(total))")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
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
            .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
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
            .foregroundColor(Color(hex: "#6B7280"))
                + Text("Terms of Use")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Color(hex: "#2563EB"))
                + Text(" and ")
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "#6B7280"))
                + Text("Privacy Policy")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Color(hex: "#2563EB"))
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
                    .foregroundColor(Color(hex: "#1F2937"))

                Button(action: onViewDetails) {
                    Text("View price details")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#2563EB"))
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
                    .foregroundColor(Color(hex: "#1F2937"))
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
                            .foregroundColor(Color(hex: "#1F2937"))

                        Spacer()

                        Button(action: {
                            withAnimation(.easeInOut(duration: 0.25)) {
                                isVisible = false
                            }
                        }) {
                            Image(systemName: "xmark")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(Color(hex: "#6B7280"))
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
                            valueColor: Color(hex: "#1F2937")
                        )

                        // Delivery Charges
                        PriceDetailRow(
                            label: "Delivery Charges",
                            value: deliveryCharges > 0 ? "₹\(Int(deliveryCharges))" : "FREE",
                            valueColor: deliveryCharges > 0
                                ? Color(hex: "#1F2937") : Color(hex: "#059669")
                        )

                        // Protect Promise Fee (if any)
                        if protectFee > 0 {
                            PriceDetailRow(
                                label: "Protect Promise Fee",
                                value: "₹\(Int(protectFee))",
                                valueColor: Color(hex: "#1F2937")
                            )
                        }

                        // Selected Offers (if any)
                        if selectedOffersTotal > 0 {
                            PriceDetailRow(
                                label: "Add-ons",
                                value: "₹\(Int(selectedOffersTotal))",
                                valueColor: Color(hex: "#1F2937")
                            )
                        }

                        // Donation (if any)
                        if donation > 0 {
                            PriceDetailRow(
                                label: "Donation",
                                value: "₹\(Int(donation))",
                                valueColor: Color(hex: "#1F2937")
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
                            .fill(Color(hex: "#E5E7EB"))
                            .frame(height: 1)
                            .padding(.vertical, 16)
                            .padding(.horizontal, 20)

                        // Total Amount
                        HStack {
                            Text("Total Amount")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color(hex: "#1F2937"))

                            Spacer()

                            Text("₹\(Int(total))")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "#1F2937"))
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
                .foregroundColor(Color(hex: "#4B5563"))

            Spacer()

            Text(value)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(valueColor)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }
}
