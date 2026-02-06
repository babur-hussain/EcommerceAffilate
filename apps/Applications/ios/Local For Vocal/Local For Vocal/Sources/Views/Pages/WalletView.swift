import SwiftUI

// MARK: - Transaction Model
struct WalletTransaction: Identifiable, Decodable {
    let _id: String
    let type: String  // "CREDIT" | "DEBIT"
    let amount: Double
    let description: String
    let referenceId: String?
    let status: String  // "PENDING" | "COMPLETED" | "FAILED"
    let createdAt: String

    var id: String { _id }

    var isCredit: Bool {
        return type == "CREDIT"
    }
}

struct WalletHistoryResponse: Decodable {
    let transactions: [WalletTransaction]
    let pagination: Pagination?

    struct Pagination: Decodable {
        let total: Int
        let page: Int
        let pages: Int
    }
}

// MARK: - Wallet View
struct WalletView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject private var authManager = AuthManager.shared

    @State private var transactions: [WalletTransaction] = []
    @State private var isLoading = true
    @State private var isRefreshing = false
    @State private var error: String? = nil

    // Brand Colors
    private let primaryBlue = Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255)
    private let successGreen = Color(red: 5 / 255, green: 150 / 255, blue: 105 / 255)
    private let dangerRed = Color(red: 220 / 255, green: 38 / 255, blue: 38 / 255)
    private let amberYellow = Color(red: 252 / 255, green: 211 / 255, blue: 77 / 255)
    private let lightGray = Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)
    private let darkText = Color(red: 17 / 255, green: 24 / 255, blue: 39 / 255)
    private let grayText = Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255)

    var body: some View {
        VStack(spacing: 0) {
            // Blue Header with Balance Card
            headerSection

            // Content Area
            contentSection
        }
        .background(primaryBlue)
        .edgesIgnoringSafeArea(.top)
        .navigationBarHidden(true)
        .onAppear {
            fetchWalletHistory()
        }
    }

    // MARK: - Header Section
    private var headerSection: some View {
        VStack(spacing: 0) {
            // Safe area padding
            Color.clear.frame(height: 44)

            // Nav Bar
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white)
                        .padding(8)
                }

                Spacer()

                Text("My Wallet")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)

                Spacer()

                Color.clear.frame(width: 36, height: 36)
            }
            .padding(.horizontal, 8)
            .padding(.bottom, 20)

            // Balance Card
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Total Balance")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.8))

                    HStack(spacing: 8) {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 20))
                            .foregroundColor(amberYellow)

                        Text("\(userCoins)")
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(.white)
                    }
                }

                Spacer()

                Image(systemName: "wallet.pass")
                    .font(.system(size: 48))
                    .foregroundColor(.white.opacity(0.2))
            }
            .padding(24)
            .background(Color.white.opacity(0.15))
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.white.opacity(0.2), lineWidth: 1)
            )
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
        .background(primaryBlue)
    }

    private var userCoins: Int {
        // Try to get coins from user object - if backend supports it
        // For now return 0
        return 0
    }

    // MARK: - Content Section
    private var contentSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Transaction History")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(darkText)
                .padding(.horizontal, 16)
                .padding(.top, 24)
                .padding(.bottom, 16)

            if isLoading {
                Spacer()
                HStack {
                    Spacer()
                    ProgressView()
                        .scaleEffect(1.2)
                    Spacer()
                }
                Spacer()
            } else if let errorMsg = error {
                errorView(message: errorMsg)
            } else if transactions.isEmpty {
                emptyView
            } else {
                transactionsList
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(lightGray)
        .cornerRadius(24, corners: [.topLeft, .topRight])
    }

    // MARK: - Transactions List
    private var transactionsList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(transactions) { transaction in
                    transactionRow(transaction)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 40)
        }
        .refreshable {
            await refreshData()
        }
    }

    private func transactionRow(_ transaction: WalletTransaction) -> some View {
        HStack(spacing: 12) {
            // Icon
            Circle()
                .fill(transaction.isCredit ? successGreen.opacity(0.1) : dangerRed.opacity(0.1))
                .frame(width: 40, height: 40)
                .overlay(
                    Image(
                        systemName: transaction.isCredit
                            ? "arrow.down" : "arrow.up"
                    )
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(transaction.isCredit ? successGreen : dangerRed)
                )

            // Details
            VStack(alignment: .leading, spacing: 2) {
                Text(transaction.description)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(darkText)

                Text(formatDate(transaction.createdAt))
                    .font(.system(size: 12))
                    .foregroundColor(grayText)
            }

            Spacer()

            // Amount
            Text("\(transaction.isCredit ? "+" : "-") \(Int(transaction.amount))")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(transaction.isCredit ? successGreen : dangerRed)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
    }

    // MARK: - Empty View
    private var emptyView: some View {
        VStack(spacing: 12) {
            Spacer()

            Image(systemName: "doc.text")
                .font(.system(size: 48))
                .foregroundColor(Color(red: 156 / 255, green: 163 / 255, blue: 175 / 255))

            Text("No transactions yet")
                .font(.system(size: 16))
                .foregroundColor(grayText)

            Spacer()
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
    }

    // MARK: - Error View
    private func errorView(message: String) -> some View {
        VStack(spacing: 12) {
            Spacer()

            Text(message)
                .font(.system(size: 15))
                .foregroundColor(grayText)

            Button(action: {
                fetchWalletHistory()
            }) {
                Text("Retry")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(primaryBlue)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(
                                Color(red: 229 / 255, green: 231 / 255, blue: 235 / 255),
                                lineWidth: 1)
                    )
            }

            Spacer()
        }
        .padding()
    }

    // MARK: - Fetch Data
    private func fetchWalletHistory() {
        guard let token = authManager.authToken else {
            error = "Please login to view wallet"
            isLoading = false
            return
        }

        isLoading = true
        error = nil

        guard let url = URL(string: "\(APIService.shared.baseURL)/wallet/history") else {
            error = "Invalid URL"
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
                    await MainActor.run {
                        error = "Failed to load wallet history"
                        isLoading = false
                    }
                    return
                }

                let walletResponse = try JSONDecoder().decode(
                    WalletHistoryResponse.self, from: data)

                await MainActor.run {
                    transactions = walletResponse.transactions
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.error = "Failed to load wallet history"
                    isLoading = false
                }
                AppLogger.error("Wallet fetch error: \(error)")
            }
        }
    }

    private func refreshData() async {
        guard let token = authManager.authToken else { return }

        guard let url = URL(string: "\(APIService.shared.baseURL)/wallet/history") else {
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

            let walletResponse = try JSONDecoder().decode(
                WalletHistoryResponse.self, from: data)

            await MainActor.run {
                transactions = walletResponse.transactions
            }
        } catch {
            AppLogger.error("Wallet refresh error: \(error)")
        }
    }

    // MARK: - Helpers
    private func formatDate(_ dateString: String) -> String {
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        if let date = isoFormatter.date(from: dateString) {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d, yyyy 'at' h:mm a"
            return formatter.string(from: date)
        }

        // Try without fractional seconds
        isoFormatter.formatOptions = [.withInternetDateTime]
        if let date = isoFormatter.date(from: dateString) {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d, yyyy 'at' h:mm a"
            return formatter.string(from: date)
        }

        return ""
    }
}

// MARK: - Preview
struct WalletView_Previews: PreviewProvider {
    static var previews: some View {
        WalletView()
    }
}
