import SwiftUI

// MARK: - Order Model
struct OrderItem: Identifiable, Decodable {
    let id = UUID()
    let productId: ProductRef
    let quantity: Int
    let price: Double

    struct ProductRef: Decodable {
        let _id: String
        let title: String?
        let images: [String]?
    }

    enum CodingKeys: String, CodingKey {
        case productId, quantity, price
    }
}

struct Order: Identifiable, Decodable {
    let _id: String
    let status: String
    let totalAmount: Double
    let payableAmount: Double?
    let items: [OrderItem]
    let createdAt: String?
    let shippingAddress: ShippingAddress?

    var id: String { _id }

    struct ShippingAddress: Decodable {
        let name: String?
        let city: String?
        let state: String?
    }
}

// MARK: - My Orders View
struct MyOrdersView: View {
    @Environment(\.presentationMode) var presentationMode
    private var authManager: AuthManager { AuthManager.shared }

    @State private var orders: [Order] = []
    @State private var isLoading = true
    @State private var errorMessage: String?
    @State private var showReturns = false

    // Colors
    private let primaryBlue = Color(hex: "#2563EB")
    private let successGreen = Color(hex: "#22C55E")
    private let warningAmber = Color(hex: "#F59E0B")
    private let dangerRed = Color(hex: "#EF4444")
    private let grayText = Color(hex: "#6B7280")
    private let darkText = Color(hex: "#111827")
    private let pageBg = Color(hex: "#F3F4F6")

    var body: some View {
        VStack(spacing: 0) {
            // Header
            header

            // Content
            if isLoading {
                Spacer()
                ProgressView()
                    .scaleEffect(1.2)
                Spacer()
            } else if let error = errorMessage {
                Spacer()
                errorView(message: error)
                Spacer()
            } else if orders.isEmpty {
                Spacer()
                emptyView
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(orders) { order in
                            OrderCard(order: order)
                        }
                    }
                    .padding(16)
                }
            }
        }
        .background(pageBg)
        .navigationBarHidden(true)
        .onAppear {
            fetchOrders()
        }
        .fullScreenCover(isPresented: $showReturns) {
            ReturnsView()
        }
    }

    // MARK: - Header
    private var header: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "arrow.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(darkText)
            }

            Spacer()

            Text("My Orders")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(darkText)

            Spacer()

            // Returns Button
            Button(action: {
                showReturns = true
            }) {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.uturn.left.circle")
                        .font(.system(size: 14))
                    Text("Returns")
                        .font(.system(size: 12, weight: .medium))
                }
                .foregroundColor(primaryBlue)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .background(Color.white)
        .overlay(
            Rectangle()
                .fill(Color(hex: "#E5E7EB"))
                .frame(height: 1),
            alignment: .bottom
        )
    }

    // MARK: - Empty View
    private var emptyView: some View {
        VStack(spacing: 16) {
            Image(systemName: "cube.box")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "#D1D5DB"))

            Text("No orders yet")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(darkText)

            Text("Start shopping to see your orders here")
                .font(.system(size: 14))
                .foregroundColor(grayText)
        }
    }

    // MARK: - Error View
    private func errorView(message: String) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 50))
                .foregroundColor(warningAmber)

            Text(message)
                .font(.system(size: 14))
                .foregroundColor(grayText)
                .multilineTextAlignment(.center)

            Button(action: fetchOrders) {
                Text("Retry")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 10)
                    .background(primaryBlue)
                    .cornerRadius(8)
            }
        }
        .padding(24)
    }

    // MARK: - Fetch Orders
    private func fetchOrders() {
        guard let token = authManager.authToken else {
            errorMessage = "Please login to view orders"
            isLoading = false
            return
        }

        isLoading = true
        errorMessage = nil

        Task {
            do {
                guard let url = URL(string: "\(APIService.shared.baseURL)/orders/mine") else {
                    await MainActor.run {
                        errorMessage = "Internal Error: Invalid URL"
                        isLoading = false
                    }
                    return
                }
                var request = URLRequest(url: url)
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

                let (data, response) = try await APIService.shared.session.data(for: request)
                let validData = try APIService.shared.handleResponse(data, response)

                let decoder = JSONDecoder()
                let fetchedOrders = try decoder.decode([Order].self, from: validData)

                await MainActor.run {
                    orders = fetchedOrders
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = "Failed to load orders"
                    isLoading = false
                }
                AppLogger.error("Error fetching orders: \(error)")
            }
        }
    }
}

// MARK: - Order Card
struct OrderCard: View {
    let order: Order

    private var statusColor: Color {
        switch order.status.uppercased() {
        case "PAID", "DELIVERED":
            return Color(hex: "#22C55E")
        case "PROCESSING", "SHIPPED":
            return Color(hex: "#3B82F6")
        case "CREATED", "PENDING":
            return Color(hex: "#F59E0B")
        case "CANCELLED", "FAILED", "REFUNDED":
            return Color(hex: "#EF4444")
        default:
            return Color(hex: "#6B7280")
        }
    }

    private static let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    private static let displayFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "MMM d, yyyy"
        return f
    }()

    private var formattedDate: String {
        guard let dateStr = order.createdAt else { return "" }
        if let date = Self.isoFormatter.date(from: dateStr) {
            return Self.displayFormatter.string(from: date)
        }
        return ""
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Order Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Order #\(String(order._id.suffix(8)).uppercased())")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "#111827"))

                    if !formattedDate.isEmpty {
                        Text(formattedDate)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }

                Spacer()

                // Status Badge
                Text(order.status)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(statusColor)
                    .cornerRadius(4)
            }

            Divider()

            // Items
            ForEach(order.items) { item in
                HStack(spacing: 12) {
                    // Product Image
                    if let imageUrl = item.productId.images?.first,
                        let url = URL(string: imageUrl)
                    {
                        AsyncImage(url: url) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            default:
                                Color(hex: "#E5E7EB")
                            }
                        }
                        .frame(width: 50, height: 50)
                        .cornerRadius(6)
                    } else {
                        RoundedRectangle(cornerRadius: 6)
                            .fill(Color(hex: "#E5E7EB"))
                            .frame(width: 50, height: 50)
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.productId.title ?? "Product")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "#111827"))
                            .lineLimit(1)

                        Text("Qty: \(item.quantity) × ₹\(Int(item.price))")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }

                    Spacer()
                }
            }

            Divider()

            // Footer
            HStack {
                if let address = order.shippingAddress {
                    HStack(spacing: 4) {
                        Image(systemName: "location.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                        Text("\(address.city ?? ""), \(address.state ?? "")")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }

                Spacer()

                Text("₹\(Int(order.payableAmount ?? order.totalAmount))")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, y: 2)
    }
}

// MARK: - Preview
struct MyOrdersView_Previews: PreviewProvider {
    static var previews: some View {
        MyOrdersView()
    }
}
