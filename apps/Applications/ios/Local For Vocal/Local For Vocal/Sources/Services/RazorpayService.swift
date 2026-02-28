#if canImport(UIKit)
    import Foundation
    import SwiftUI
    import UIKit
    import Razorpay

    // MARK: - Razorpay Service
    class RazorpayService: NSObject, RazorpayPaymentCompletionProtocolWithData {
        static let shared = RazorpayService()

        // Fix S2: Live Razorpay key — no hardcoded test key fallback in production
        private let keyId: String = {
            if let plistKey = Bundle.main.object(forInfoDictionaryKey: "RAZORPAY_KEY_ID") as? String
            {
                return plistKey
            }
            #if DEBUG
                return "rzp_test_S2fkx4mZP0xAQm"  // Test key for debug only
            #else
                return "rzp_live_SIs9DUNl6RGng7"
            #endif
        }()

        // SDK instance
        private var razorpay: RazorpayCheckout!

        private var completionHandler: ((Result<PaymentSuccess, PaymentError>) -> Void)?
        private var presentingViewController: UIViewController?

        private override init() {
            super.init()
            // Initialize Razorpay SDK
            // Note: This relies on "Razorpay" module being available.
            // If built without the pod/package, this will error.
            self.razorpay = RazorpayCheckout.initWithKey(keyId, andDelegate: self)
        }

        // MARK: - Payment Success Response
        struct PaymentSuccess {
            let razorpayPaymentId: String
            let razorpayOrderId: String
            let razorpaySignature: String
        }

        // MARK: - Payment Error
        enum PaymentError: Error {
            case cancelled
            case failed(String)
            case orderCreationFailed
            case verificationFailed
        }

        // MARK: - Create Order and Initiate Payment
        func initiatePayment(
            orderId: String,
            from viewController: UIViewController,
            completion: @escaping (Result<PaymentSuccess, PaymentError>) -> Void
        ) {
            self.completionHandler = completion
            self.presentingViewController = viewController

            // Ensure SDK is initialized
            if self.razorpay == nil {
                self.razorpay = RazorpayCheckout.initWithKey(keyId, andDelegate: self)
            }

            // Set the external delegate to the view controller if needed, but normally we handle it here
            // self.razorpay.setExternalWalletSelectionDelegate(self)

            // Step 1: Create Razorpay order via backend
            Task {
                do {
                    let paymentData = try await createRazorpayOrder(orderId: orderId)

                    await MainActor.run {
                        // Step 2: Open Razorpay checkout (Native)
                        openRazorpayCheckout(
                            orderId: paymentData.paymentOrderId,
                            amount: paymentData.amount,
                            name: paymentData.name,
                            description: paymentData.description,
                            prefillEmail: paymentData.prefillEmail,
                            prefillPhone: paymentData.prefillPhone,
                            themeColor: "#2563EB"  // Default blue
                        )
                    }
                } catch {
                    await MainActor.run {
                        completion(.failure(.orderCreationFailed))
                    }
                }
            }
        }

        // MARK: - Create Razorpay Order via Backend
        private func createRazorpayOrder(orderId: String) async throws -> RazorpayOrderResponse {
            guard let url = URL(string: "\(APIService.shared.baseURL)/orders/\(orderId)/pay") else {
                throw PaymentError.orderCreationFailed
            }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")

            if let token = AuthManager.shared.authToken {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }

            let body = ["provider": "RAZORPAY"]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (data, response) = try await APIService.shared.session.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse,
                (200...299).contains(httpResponse.statusCode)
            else {
                throw PaymentError.orderCreationFailed
            }

            let razorpayResponse = try JSONDecoder().decode(RazorpayOrderResponse.self, from: data)
            return razorpayResponse
        }

        // MARK: - Razorpay Order Response
        struct RazorpayOrderResponse: Decodable {
            let paymentOrderId: String
            let keyId: String
            let amount: Int
            let name: String?
            let description: String?
            let prefillEmail: String?
            let prefillPhone: String?
            let prefillName: String?

            enum CodingKeys: String, CodingKey {
                case paymentOrderId
                case keyId = "key_id"
                case amount
                case name
                case description
                case prefill
            }

            struct Prefill: Decodable {
                let email: String?
                let contact: String?
                let name: String?
            }

            init(from decoder: Decoder) throws {
                let container = try decoder.container(keyedBy: CodingKeys.self)
                paymentOrderId = try container.decode(String.self, forKey: .paymentOrderId)
                keyId = try container.decode(String.self, forKey: .keyId)
                amount = try container.decode(Int.self, forKey: .amount)
                name = try container.decodeIfPresent(String.self, forKey: .name)
                description = try container.decodeIfPresent(String.self, forKey: .description)

                if let prefill = try container.decodeIfPresent(Prefill.self, forKey: .prefill) {
                    prefillEmail = prefill.email
                    prefillPhone = prefill.contact
                    prefillName = prefill.name
                } else {
                    prefillEmail = nil
                    prefillPhone = nil
                    prefillName = nil
                }
            }
        }

        // MARK: - Native Razorpay Checkout
        private func openRazorpayCheckout(
            orderId: String,
            amount: Int,
            name: String?,
            description: String?,
            prefillEmail: String?,
            prefillPhone: String?,
            themeColor: String
        ) {

            let options: [String: Any] = [
                "amount": amount,  // Method automatically converts to proper format if needed, but usually passed as is from backend (paise)
                "currency": "INR",
                "description": description ?? "Payment",
                "order_id": orderId,
                "name": name ?? "Local For Vocal",
                "prefill": [
                    "contact": prefillPhone ?? "",
                    "email": prefillEmail ?? "",
                ],
                "theme": ["color": themeColor],
            ]

            if let rootVC = presentingViewController {
                razorpay.open(options, displayController: rootVC)
            } else {
                AppLogger.error("Error: No presenting view controller for Razorpay")
                completionHandler?(.failure(.failed("Internal UI Error")))
            }
        }

        // MARK: - RazorpayPaymentCompletionProtocolWithData
        func onPaymentError(
            _ code: Int32, description str: String, andData response: [AnyHashable: Any]?
        ) {
            AppLogger.error("Razorpay Payment Error: \(code) - \(str)")
            // Extract error details if needed from response
            DispatchQueue.main.async {
                self.completionHandler?(.failure(.failed(str)))
            }
        }

        func onPaymentSuccess(_ payment_id: String, andData response: [AnyHashable: Any]?) {
            // Fix S3: Don't log payment ID (PCI-sensitive)
            AppLogger.info("Razorpay Payment Success")

            guard let response = response else {
                DispatchQueue.main.async {
                    self.completionHandler?(.failure(.verificationFailed))
                }
                return
            }

            // Extract signature and order id from response data
            let razorpayOrderId = response["razorpay_order_id"] as? String ?? ""
            let razorpaySignature = response["razorpay_signature"] as? String ?? ""
            // payment_id is passed as argument, but also in response as razorpay_payment_id

            let successData = PaymentSuccess(
                razorpayPaymentId: payment_id,
                razorpayOrderId: razorpayOrderId,
                razorpaySignature: razorpaySignature
            )

            DispatchQueue.main.async {
                self.completionHandler?(.success(successData))
            }
        }

        // MARK: - Verify Payment (Backend)
        func verifyPayment(
            orderId: String,
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String
        ) async throws -> Bool {
            guard let url = URL(string: "\(APIService.shared.baseURL)/orders/\(orderId)/verify")
            else {
                return false
            }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")

            if let token = AuthManager.shared.authToken {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }

            let body: [String: Any] = [
                "razorpay_order_id": razorpayOrderId,
                "razorpay_payment_id": razorpayPaymentId,
                "razorpay_signature": razorpaySignature,
            ]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (_, response) = try await APIService.shared.session.data(for: request)

            if let httpResponse = response as? HTTPURLResponse {
                return httpResponse.statusCode == 200
            }
            return false
        }
    }

    // MARK: - SwiftUI Integration Helper
    struct RazorpayCheckoutView: UIViewControllerRepresentable {
        let orderId: String
        let onSuccess: (RazorpayService.PaymentSuccess) -> Void
        let onFailure: (RazorpayService.PaymentError) -> Void

        func makeUIViewController(context: Context) -> UIViewController {
            let viewController = UIViewController()
            // Make background transparent or suitable for overlay
            viewController.view.backgroundColor = .clear
            return viewController
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
            // Only initiate payment once when view appears with a valid controller
            guard !context.coordinator.hasInitiated else { return }
            context.coordinator.hasInitiated = true

            RazorpayService.shared.initiatePayment(orderId: orderId, from: uiViewController) {
                result in
                switch result {
                case .success(let success):
                    onSuccess(success)
                case .failure(let error):
                    onFailure(error)
                }
            }
        }

        func makeCoordinator() -> Coordinator {
            Coordinator()
        }

        class Coordinator {
            var hasInitiated = false
        }
    }

#else
    import Foundation
    import SwiftUI

    class RazorpayService: NSObject {
        static let shared = RazorpayService()

        struct PaymentSuccess {
            let razorpayPaymentId: String
            let razorpayOrderId: String
            let razorpaySignature: String
        }

        enum PaymentError: Error {
            case cancelled
            case failed(String)
            case orderCreationFailed
            case verificationFailed
        }

        func initiatePayment(
            orderId: String,
            from viewController: Any,
            completion: @escaping (Result<PaymentSuccess, PaymentError>) -> Void
        ) {
            completion(.failure(.failed("Razorpay not supported on this platform")))
        }

        func verifyPayment(
            orderId: String,
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String
        ) async throws -> Bool {
            return false
        }
    }

    struct RazorpayCheckoutView: View {
        let orderId: String
        let onSuccess: (RazorpayService.PaymentSuccess) -> Void
        let onFailure: (RazorpayService.PaymentError) -> Void

        var body: some View {
            Text("Razorpay Checkout not supported on this platform")
        }
    }
#endif
