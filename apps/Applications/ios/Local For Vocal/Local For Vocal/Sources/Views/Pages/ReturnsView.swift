import SwiftUI

// MARK: - Return Request Models
struct ReturnItem: Identifiable, Decodable {
    let id = UUID()
    let productId: ReturnProductRef
    let quantity: Int
    let price: Double

    struct ReturnProductRef: Decodable {
        let _id: String?
        let title: String?
        let images: [String]?
    }

    enum CodingKeys: String, CodingKey {
        case productId, quantity, price
    }
}

struct ReturnRequest: Identifiable, Decodable {
    let _id: String
    let returnRequestNumber: String
    let orderId: OrderRef?
    let items: [ReturnItem]
    let status: String
    let refundAmount: Double
    let createdAt: String

    var id: String { _id }

    struct OrderRef: Decodable {
        let _id: String
        let orderNumber: String?
    }
}

struct ReturnsResponse: Decodable {
    let returns: [ReturnRequest]
}

// MARK: - Status Config
struct ReturnStatusConfig {
    let label: String
    let color: Color

    static func config(for status: String) -> ReturnStatusConfig {
        switch status.uppercased() {
        case "PENDING":
            return ReturnStatusConfig(
                label: "Pending",
                color: Color(red: 245 / 255, green: 158 / 255, blue: 11 / 255))
        case "APPROVED":
            return ReturnStatusConfig(
                label: "Approved",
                color: Color(red: 16 / 255, green: 185 / 255, blue: 129 / 255))
        case "REJECTED":
            return ReturnStatusConfig(
                label: "Rejected",
                color: Color(red: 239 / 255, green: 68 / 255, blue: 68 / 255))
        case "PICKUP_SCHEDULED":
            return ReturnStatusConfig(
                label: "Pickup Scheduled",
                color: Color(red: 139 / 255, green: 92 / 255, blue: 246 / 255))
        case "PICKED_UP":
            return ReturnStatusConfig(
                label: "Picked Up",
                color: Color(red: 99 / 255, green: 102 / 255, blue: 241 / 255))
        case "RECEIVED":
            return ReturnStatusConfig(
                label: "Received",
                color: Color(red: 20 / 255, green: 184 / 255, blue: 166 / 255))
        case "INSPECTING":
            return ReturnStatusConfig(
                label: "Inspecting",
                color: Color(red: 249 / 255, green: 115 / 255, blue: 22 / 255))
        case "REFUND_INITIATED":
            return ReturnStatusConfig(
                label: "Refund Initiated",
                color: Color(red: 6 / 255, green: 182 / 255, blue: 212 / 255))
        case "REFUND_COMPLETED":
            return ReturnStatusConfig(
                label: "Refund Completed",
                color: Color(red: 5 / 255, green: 150 / 255, blue: 105 / 255))
        default:
            return ReturnStatusConfig(
                label: status,
                color: Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255))
        }
    }
}

// MARK: - Returns View
struct ReturnsView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject private var authManager = AuthManager.shared

    @State private var returns: [ReturnRequest] = []
    @State private var isLoading = true
    @State private var isRefreshing = false

    // Brand Colors
    private let pageBg = Color(red: 248 / 255, green: 249 / 255, blue: 250 / 255)
    private let darkText = Color(red: 31 / 255, green: 41 / 255, blue: 55 / 255)
    private let grayText = Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255)
    private let borderColor = Color(red: 229 / 255, green: 231 / 255, blue: 235 / 255)

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
            } else if returns.isEmpty {
                emptyView
            } else {
                returnsList
            }
        }
        .background(pageBg)
        .navigationBarHidden(true)
        .onAppear {
            fetchReturns()
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

            Text("My Returns")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(darkText)

            Spacer()

            Color.clear.frame(width: 24, height: 24)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
        .overlay(
            Rectangle()
                .fill(borderColor)
                .frame(height: 1),
            alignment: .bottom
        )
    }

    // MARK: - Returns List
    private var returnsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(returns) { returnRequest in
                    ReturnCard(returnRequest: returnRequest)
                }
            }
            .padding(16)
        }
        .refreshable {
            await refreshData()
        }
    }

    // MARK: - Empty View
    private var emptyView: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "arrow.uturn.left.circle")
                .font(.system(size: 64))
                .foregroundColor(Color(red: 209 / 255, green: 213 / 255, blue: 219 / 255))

            Text("No returns found")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(darkText)

            Text("You haven't requested any returns yet")
                .font(.system(size: 15))
                .foregroundColor(grayText)

            Spacer()
        }
    }

    // MARK: - Fetch Data
    private func fetchReturns() {
        guard let token = authManager.authToken else {
            isLoading = false
            return
        }

        isLoading = true

        guard let url = URL(string: "\(APIService.shared.baseURL)/returns/mine") else {
            isLoading = false
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        Task {
            do {
                let (data, response) = try await URLSession.shared.data(for: request)

                guard let httpResponse = response as? HTTPURLResponse,
                    (200...299).contains(httpResponse.statusCode)
                else {
                    await MainActor.run { isLoading = false }
                    return
                }

                let returnsResponse = try JSONDecoder().decode(
                    ReturnsResponse.self, from: data)

                await MainActor.run {
                    returns = returnsResponse.returns
                    isLoading = false
                }
            } catch {
                print("Returns fetch error: \(error)")
                await MainActor.run { isLoading = false }
            }
        }
    }

    private func refreshData() async {
        guard let token = authManager.authToken else { return }

        guard let url = URL(string: "\(APIService.shared.baseURL)/returns/mine") else {
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        do {
            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse,
                (200...299).contains(httpResponse.statusCode)
            else { return }

            let returnsResponse = try JSONDecoder().decode(
                ReturnsResponse.self, from: data)

            await MainActor.run {
                returns = returnsResponse.returns
            }
        } catch {
            print("Returns refresh error: \(error)")
        }
    }
}

// MARK: - Return Card
struct ReturnCard: View {
    let returnRequest: ReturnRequest

    private let darkText = Color(red: 31 / 255, green: 41 / 255, blue: 55 / 255)
    private let grayText = Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255)
    private let lightGray = Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)
    private let successGreen = Color(red: 16 / 255, green: 185 / 255, blue: 129 / 255)

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("#\(returnRequest.returnRequestNumber)")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(darkText)

                    Text(formatDate(returnRequest.createdAt))
                        .font(.system(size: 12))
                        .foregroundColor(grayText)
                }

                Spacer()

                // Status Badge
                let statusConfig = ReturnStatusConfig.config(for: returnRequest.status)
                Text(statusConfig.label)
                    .font(.system(size: 11, weight: .bold))
                    .textCase(.uppercase)
                    .foregroundColor(statusConfig.color)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(statusConfig.color.opacity(0.1))
                    .cornerRadius(6)
            }

            Divider()
                .background(lightGray)

            // Content
            HStack(spacing: 12) {
                // Product Image
                if let firstItem = returnRequest.items.first,
                    let imageUrl = firstItem.productId.images?.first,
                    let url = URL(string: imageUrl)
                {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        default:
                            Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)
                        }
                    }
                    .frame(width: 50, height: 50)
                    .cornerRadius(8)
                } else {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(lightGray)
                        .frame(width: 50, height: 50)
                }

                // Details
                VStack(alignment: .leading, spacing: 4) {
                    Text(returnRequest.items.first?.productId.title ?? "Unknown Product")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(red: 55 / 255, green: 65 / 255, blue: 81 / 255))
                        .lineLimit(2)

                    HStack(spacing: 8) {
                        let itemsCount = returnRequest.items.reduce(0) { $0 + $1.quantity }
                        Text("\(itemsCount) item\(itemsCount > 1 ? "s" : "")")
                            .font(.system(size: 12))
                            .foregroundColor(grayText)

                        Text("•")
                            .font(.system(size: 12))
                            .foregroundColor(
                                Color(red: 209 / 255, green: 213 / 255, blue: 219 / 255))

                        Text("Refund: ₹\(Int(returnRequest.refundAmount))")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(successGreen)
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    private func formatDate(_ dateString: String) -> String {
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        if let date = isoFormatter.date(from: dateString) {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d, yyyy"
            return formatter.string(from: date)
        }

        isoFormatter.formatOptions = [.withInternetDateTime]
        if let date = isoFormatter.date(from: dateString) {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d, yyyy"
            return formatter.string(from: date)
        }

        return ""
    }
}

// MARK: - Preview
struct ReturnsView_Previews: PreviewProvider {
    static var previews: some View {
        ReturnsView()
    }
}
