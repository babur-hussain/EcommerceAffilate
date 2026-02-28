import Combine
import SwiftUI

@MainActor
class CheckoutViewModel: ObservableObject {
    // MARK: - Input Data
    struct CheckoutItem: Identifiable {
        let id = UUID()
        let product: Product
        let quantity: Int
        let selectedOfferIds: [String]
    }

    let items: [CheckoutItem]

    // Convenience for single product access (e.g. if we want to show the first one or logic depends on it)
    var firstProduct: Product? { items.first?.product }

    // MARK: - Dependencies
    // Fix #2: Use shared singleton instead of creating duplicate GPS tracker
    @Published var locationManager = LocationManager.shared

    // MARK: - Step State
    @Published var currentStep = 2

    // MARK: - Address State
    @Published var isUserAddressSelectorVisible = false
    @Published var selectedUserAddressId: String?
    @Published var savedUserAddresses: [UserAddress] = []
    @Published var isLoadingUserAddresses = true
    @Published var useCurrentLocation = false
    @Published var isLocationPickerVisible = false

    // MARK: - Donation
    @Published var selectedDonation: Int? = nil

    // MARK: - Price Details
    @Published var isPriceDetailsVisible = false

    // MARK: - Payment & Order State
    @Published var isPaymentViewVisible = false
    @Published var showPaymentSuccess = false
    @Published var showPaymentFailed = false
    @Published var showMyOrders = false
    @Published var createdOrderId: String? = nil
    @Published var createdOrderNumber: String? = nil
    @Published var isProcessingPayment = false

    // MARK: - Auth State
    @Published var showLoginPrompt = false
    @Published var showLoginView = false

    // MARK: - Upsells
    // We can track selected upsells globally or per item. For simplicity, let's assume global for now,
    // or we might need to change how protection plans work.
    // Assuming protection plans are per-product, we might need a more complex structure.
    // For MVP/Speed, let's keep `selectedUpsells` as a set of Offer IDs across all products.
    @Published var selectedUpsells: Set<String> = []

    // MARK: - Initialization
    // Init for Single Product (Buy Now)
    init(product: Product, quantity: Int, selectedOfferIds: [String]) {
        self.items = [
            CheckoutItem(product: product, quantity: quantity, selectedOfferIds: selectedOfferIds)
        ]
        self.selectedUpsells = Set(selectedOfferIds)
    }

    // Init for Cart (Multiple Items)
    init(items: [CheckoutItem]) {
        self.items = items
        // Initialize selectedUpsells from items if needed
        self.selectedUpsells = Set(items.flatMap { $0.selectedOfferIds })
    }

    // MARK: - Computed Properties

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
    var itemTotal: Double {
        items.reduce(0) { sum, item in
            sum + (item.product.price * Double(item.quantity))
        }
    }

    var mrpTotal: Double {
        items.reduce(0) { sum, item in
            sum + ((item.product.mrp ?? item.product.price) * Double(item.quantity))
        }
    }

    var protectFee: Double {
        items.reduce(0) { sum, item in
            sum + (item.product.protectPromiseFee ?? 0)
        }
    }

    var shippingFee: Double {
        items.reduce(0) { sum, item in
            sum + (item.product.shippingCharges ?? 0)
        }
    }

    var discount: Double { mrpTotal - itemTotal }

    var discountPercent: Int {
        guard mrpTotal > 0 else { return 0 }
        return Int(((mrpTotal - itemTotal) / mrpTotal) * 100)
    }

    var totalQuantity: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    var selectedOffersTotal: Double {
        // This logic assumes offers are global or unique IDs.
        // We'll iterate through all items and check their offers.
        var total: Double = 0
        for item in items {
            guard let offers = item.product.lastChanceOffers else { continue }
            for (index, offer) in offers.enumerated() {
                let offerId = offer.tempId(index: index)
                if selectedUpsells.contains(offerId) {
                    total += offer.offerPrice
                }
            }
        }
        return total
    }

    var totalAmount: Double {
        itemTotal + shippingFee + protectFee + selectedOffersTotal + Double(selectedDonation ?? 0)
    }

    var totalFees: Double {
        protectFee + shippingFee
    }

    // Fix #9: Cached instead of recomputing DateFormatter on every render
    private static let deliveryDateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "MMM d, EEE"
        return f
    }()

    var deliveryDate: String {
        let date = Calendar.current.date(byAdding: .day, value: 3, to: Date()) ?? Date()
        return Self.deliveryDateFormatter.string(from: date)
    }

    // MARK: - Methods

    func fetchAddresses() async {
        do {
            let addresses = try await APIService.shared.fetchAddresses()
            // We are already on MainActor due to class annotation, but explicit check doesn't hurt
            self.savedUserAddresses = addresses
            self.isLoadingUserAddresses = false

            // Auto-select
            if self.selectedUserAddressId == nil {
                if let defaultAddr = addresses.first(where: { $0.isDefault }) {
                    self.selectedUserAddressId = defaultAddr.id
                } else if let firstAddr = addresses.first {
                    self.selectedUserAddressId = firstAddr.id
                }
            }
        } catch {
            AppLogger.error("Error fetching addresses: \(error)")
            self.isLoadingUserAddresses = false
        }
    }

    func handleAddressSelection(newAddress: UserAddress) {
        // Capture address details before async operation to avoid race condition
        let addressName = newAddress.name
        let addressPhone = newAddress.phone
        let addressId = newAddress.id

        Task { @MainActor in
            // Disable current location when selecting a saved address
            self.useCurrentLocation = false

            // Update list if new
            if !self.savedUserAddresses.contains(where: { $0.id == addressId }) {
                self.savedUserAddresses.append(newAddress)
            }

            // Optimistically select the new address
            self.selectedUserAddressId = addressId

            // Refresh addresses from server in background
            await fetchAddresses()

            // After fetch, verify selection is still valid
            if let savedAddr = self.savedUserAddresses.first(where: {
                $0.name == addressName && $0.phone == addressPhone
            }) {
                self.selectedUserAddressId = savedAddr.id
            } else if self.savedUserAddresses.contains(where: { $0.id == addressId }) {
                // Original ID still valid
                self.selectedUserAddressId = addressId
            } else if !self.savedUserAddresses.isEmpty {
                // Ensure we don't deselect if fetch fails or address matches
                if self.selectedUserAddressId == nil {
                    self.selectedUserAddressId = self.savedUserAddresses.last?.id
                }
            }
        }
    }

    @Published var showRazorpay = false

    func processPayment(method: String) {
        guard !isProcessingPayment else { return }
        guard let address = currentUserAddress else { return }
        guard let token = AuthManager.shared.authToken else { return }

        isProcessingPayment = true

        Task {
            defer { isProcessingPayment = false }

            do {
                // 1. Prepare Items
                let items = self.items.map { item in
                    OrderService.OrderItem(
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
                        name: item.product.name,
                        image: item.product.images.first
                    )
                }

                // 2. Prepare Address
                let addrPayload = OrderService.AddressPayload(
                    name: address.name,
                    phone: address.phone,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    country: address.country
                )

                // 3. Prepare Last Chance Offers
                var selectedOffers: [OrderService.LastChanceOfferPayload] = []
                for item in self.items {
                    if let offers = item.product.lastChanceOffers {
                        for (index, offer) in offers.enumerated() {
                            let offerId = offer.tempId(index: index)
                            if self.selectedUpsells.contains(offerId) {
                                selectedOffers.append(
                                    OrderService.LastChanceOfferPayload(
                                        id: offer._id,
                                        name: offer.title,
                                        price: offer.offerPrice
                                    )
                                )
                            }
                        }
                    }
                }

                // 4. Create Order
                let response = try await OrderService.shared.createOrder(
                    items: items,
                    address: addrPayload,
                    addressId: address.id,
                    paymentMethod: method,
                    authToken: token,
                    donation: Double(selectedDonation ?? 0),
                    protectPromiseFee: protectFee,
                    shippingFee: shippingFee,
                    lastChanceOffers: selectedOffers.isEmpty ? nil : selectedOffers
                )

                self.createdOrderId = response._id
                self.createdOrderNumber = response.orderNumber

                // Close Payment View First to avoid "Multiple sheets" error
                self.isPaymentViewVisible = false

                // Allow time for sheet dismissal animation
                try? await Task.sleep(nanoseconds: 600_000_000)  // 0.6s

                if method == "RAZORPAY" {
                    self.showRazorpay = true
                } else {
                    self.showPaymentSuccess = true
                }

            } catch {
                AppLogger.error("Error creating order: \(error)")
                self.isPaymentViewVisible = false
                try? await Task.sleep(nanoseconds: 500_000_000)
                self.showPaymentFailed = true
            }
        }
    }

    func handleRazorpaySuccess(paymentId: String, orderId: String, signature: String) {
        self.showRazorpay = false
        Task {
            do {
                // Verify with backend
                let isValid = try await RazorpayService.shared.verifyPayment(
                    orderId: self.createdOrderId ?? "",
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    razorpaySignature: signature
                )

                await MainActor.run {
                    if isValid {
                        self.showPaymentSuccess = true
                    } else {
                        self.showPaymentFailed = true
                    }
                }
            } catch {
                await MainActor.run {
                    self.showPaymentFailed = true
                }
            }
        }
    }

    func handleRazorpayFailure(error: String) {
        self.showRazorpay = false
        // Small delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.showPaymentFailed = true
        }
    }
}
