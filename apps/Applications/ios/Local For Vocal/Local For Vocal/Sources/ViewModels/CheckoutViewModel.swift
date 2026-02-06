import Combine
import SwiftUI

@MainActor
class CheckoutViewModel: ObservableObject {
    // MARK: - Input Data
    let product: Product
    let quantity: Int

    // MARK: - Dependencies
    // We will keep LocationManager here or in the View?
    // Ideally, the VM should handle address selection logic.
    // For now, let's allow the View to inject or we initialize it here.
    @Published var locationManager = LocationManager()

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
    @Published var selectedUpsells: Set<String> = []

    // MARK: - Initialization
    init(product: Product, quantity: Int, selectedOfferIds: [String]) {
        self.product = product
        self.quantity = quantity
        self.selectedUpsells = Set(selectedOfferIds)
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
    var itemTotal: Double { product.price * Double(quantity) }
    var mrpTotal: Double { (product.mrp ?? product.price) * Double(quantity) }
    var protectFee: Double { product.protectPromiseFee ?? 0 }
    var shippingFee: Double { product.shippingCharges ?? 0 }
    var discount: Double { mrpTotal - itemTotal }
    var discountPercent: Int {
        guard mrpTotal > 0 else { return 0 }
        return Int(((mrpTotal - itemTotal) / mrpTotal) * 100)
    }

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

    var totalAmount: Double {
        itemTotal + shippingFee + protectFee + selectedOffersTotal + Double(selectedDonation ?? 0)
    }

    var totalFees: Double {
        protectFee + shippingFee
    }

    var deliveryDate: String {
        let date = Calendar.current.date(byAdding: .day, value: 3, to: Date()) ?? Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, EEE"
        return formatter.string(from: date)
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
                // Fallback to last address
                self.selectedUserAddressId = self.savedUserAddresses.last?.id
            }
        }
    }

    func processPayment(method: String) {
        guard !isProcessingPayment else { return }
        guard let address = currentUserAddress else { return }
        guard let token = AuthManager.shared.authToken else { return }  // Should be checked by View before calling

        isProcessingPayment = true

        Task {
            defer { isProcessingPayment = false }

            do {
                // 1. Prepare Items
                let items = [
                    OrderService.OrderItem(
                        productId: product.id,
                        quantity: quantity,
                        price: product.price,
                        name: product.name,
                        image: product.images.first
                    )
                ]

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

                // 3. Create Order
                let response = try await OrderService.shared.createOrder(
                    items: items,
                    address: addrPayload,
                    paymentMethod: method,
                    authToken: token,
                    donation: Double(selectedDonation ?? 0),
                    protectPromiseFee: protectFee,
                    shippingFee: shippingFee,
                    lastChanceOffers: nil
                )

                self.createdOrderId = response._id
                self.createdOrderNumber = response.orderNumber
                self.showPaymentSuccess = true

            } catch {
                AppLogger.error("Error creating order: \(error)")
                self.isPaymentViewVisible = false
                // Small delay to show failure
                try? await Task.sleep(nanoseconds: 500_000_000)
                self.showPaymentFailed = true
            }
        }
    }
}
