import Foundation

// MARK: - Order Service
public class OrderService {
    public static let shared = OrderService()

    private init() {}

    // MARK: - Order Item
    public struct OrderItem: Codable {
        public let productId: String
        public let quantity: Int
        public let price: Double
        public let name: String?
        public let image: String?

        public init(productId: String, quantity: Int, price: Double, name: String?, image: String?)
        {
            self.productId = productId
            self.quantity = quantity
            self.price = price
            self.name = name
            self.image = image
        }
    }

    // MARK: - LastChanceOfferPayload
    public struct LastChanceOfferPayload: Codable {
        public let id: String
        public let name: String
        public let price: Double

        public init(id: String, name: String, price: Double) {
            self.id = id
            self.name = name
            self.price = price
        }
    }

    // MARK: - Order Payload
    public struct OrderPayload: Codable {
        public let items: [OrderItem]
        public let address: AddressPayload?
        public let addressId: String?
        public let paymentMethod: String
        public let donation: Double?
        public let protectPromiseFee: Double?
        public let shippingFee: Double?  // Added shippingFee
        public let lastChanceOffers: [LastChanceOfferPayload]?

        public init(
            items: [OrderItem],
            address: AddressPayload? = nil,
            addressId: String? = nil,
            paymentMethod: String,
            donation: Double?,
            protectPromiseFee: Double?,
            shippingFee: Double? = nil,  // Added parameter
            lastChanceOffers: [LastChanceOfferPayload]?
        ) {
            self.items = items
            self.address = address
            self.addressId = addressId
            self.paymentMethod = paymentMethod
            self.donation = donation
            self.protectPromiseFee = protectPromiseFee
            self.shippingFee = shippingFee
            self.lastChanceOffers = lastChanceOffers
        }
    }

    public struct AddressPayload: Codable {
        public let name: String
        public let phone: String
        public let addressLine1: String
        public let addressLine2: String?
        public let city: String
        public let state: String
        public let pincode: String
        public let country: String

        public init(
            name: String, phone: String, addressLine1: String, addressLine2: String?, city: String,
            state: String, pincode: String, country: String
        ) {
            self.name = name
            self.phone = phone
            self.addressLine1 = addressLine1
            self.addressLine2 = addressLine2
            self.city = city
            self.state = state
            self.pincode = pincode
            self.country = country
        }
    }

    // MARK: - Order Response
    public struct OrderResponse: Decodable {
        public let _id: String
        public let orderNumber: String?
        public let status: String
        public let totalAmount: Double
    }

    // MARK: - Create Order
    public func createOrder(
        items: [OrderItem],
        address: AddressPayload? = nil,
        addressId: String? = nil,
        paymentMethod: String,
        authToken: String,
        donation: Double? = nil,
        protectPromiseFee: Double? = nil,
        shippingFee: Double? = nil,  // Added parameter
        lastChanceOffers: [LastChanceOfferPayload]? = nil
    ) async throws -> OrderResponse {

        let url = URL(string: "\(APIService.shared.baseURL)/orders")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")

        let payload = OrderPayload(
            items: items,
            address: address,
            addressId: addressId,
            paymentMethod: paymentMethod,
            donation: donation,
            protectPromiseFee: protectPromiseFee,
            shippingFee: shippingFee,
            lastChanceOffers: lastChanceOffers
        )

        let encoder = JSONEncoder()
        let jsonData = try encoder.encode(payload)
        request.httpBody = jsonData

        // DEBUG: Log the JSON payload
        if let jsonString = String(data: jsonData, encoding: .utf8) {
            print("📦 [OrderService] Sending order payload: \(jsonString)")
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw OrderError.creationFailed
        }

        if !(200...299).contains(httpResponse.statusCode) {
            print("Order Create failed with status: \(httpResponse.statusCode)")
            if let errorText = String(data: data, encoding: .utf8) {
                print("Response: \(errorText)")
            }
            throw OrderError.creationFailed
        }

        let orderResponse = try JSONDecoder().decode(OrderResponse.self, from: data)
        return orderResponse
    }

    // MARK: - Update Order Status
    public func updateOrderStatus(orderId: String, status: String, authToken: String) async throws {
        let url = URL(string: "\(APIService.shared.baseURL)/orders/\(orderId)/status")!
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add Authorization Header
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")

        let body = ["status": status]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200
        else {
            throw OrderError.updateFailed
        }
    }

    // MARK: - Order Error
    enum OrderError: Error, LocalizedError {
        case creationFailed
        case updateFailed
        case paymentFailed

        var errorDescription: String? {
            switch self {
            case .creationFailed:
                return "Failed to create order"
            case .updateFailed:
                return "Failed to update order"
            case .paymentFailed:
                return "Payment failed"
            }
        }
    }
}
