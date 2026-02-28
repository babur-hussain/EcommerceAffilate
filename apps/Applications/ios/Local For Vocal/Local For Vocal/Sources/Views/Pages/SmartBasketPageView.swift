import SwiftUI

struct SmartBasketPageView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var products: [Product] = []
    @State private var isLoading = true
    @State private var errorMessage: String? = nil

    // IDs from React Native implementation
    private let categoryIds = [
        "69668824a35b0a2c24fa8387",  // Extra Virgin Olive Oil (1L)
        "6967547db5f185ae0ee5ba7f",  // Premium Ready-to-Use Masala Pastes
        "6967547db5f185ae0ee5ba85",  // Premium Salt
        "6967547db5f185ae0ee5ba88",  // Premium Mustard Oil
        "6967547db5f185ae0ee5ba8b",  // Premium Sunflower Oil
        "6967547db5f185ae0ee5ba8e",  // Premium Soybean Oil
        "6967547db5f185ae0ee5ba91",  // Premium Groundnut Oil
        "6967547db5f185ae0ee5ba94",  // Premium Rice Bran Oil
    ]

    // Grid Layout
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "#1F2937"))
                }

                Spacer()

                Text("Your Smart Basket")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))

                Spacer()

                // Placeholder
                Color.clear.frame(width: 20, height: 20)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color(hex: "#FFF8E7"))  // Creamy background from RN
            .overlay(
                Rectangle()
                    .fill(Color.black.opacity(0.05))
                    .frame(height: 1),
                alignment: .bottom
            )

            if isLoading {
                VStack {
                    Spacer()
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .orange))
                        .scaleEffect(1.5)
                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(hex: "#FFF8E7"))
            } else if let error = errorMessage {
                VStack {
                    Spacer()
                    Text(error)
                        .foregroundColor(.red)
                    Button("Retry") {
                        fetchProducts()
                    }
                    .padding(.top, 8)
                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(hex: "#FFF8E7"))
            } else if products.isEmpty {
                VStack {
                    Spacer()
                    Text("No smart items found.")
                        .foregroundColor(.gray)
                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(hex: "#FFF8E7"))
            } else {
                GeometryReader { geometry in
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(products) { product in
                                NavigationLink(
                                    destination: ProductDetailView(productId: product.id)
                                ) {
                                    ProductCardView(
                                        product: product,
                                        width: (geometry.size.width - 48) / 2
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .padding(16)
                    }
                    .background(Color(hex: "#FFF8E7"))
                }
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            if products.isEmpty {
                fetchProducts()
            }
        }
    }

    private func fetchProducts() {
        isLoading = true
        errorMessage = nil

        Task {
            do {
                // Fetching large list to filter client-side, matching RN implementation logic
                // In production, backend should support ?ids=... or ?category=...
                guard let url = URL(string: "\(APIService.shared.baseURL)/products?limit=200")
                else {
                    await MainActor.run {
                        self.errorMessage = "Internal Error: Invalid URL"
                        self.isLoading = false
                    }
                    return
                }
                let (data, response) = try await APIService.shared.session.data(from: url)

                guard let httpResponse = response as? HTTPURLResponse,
                    (200...299).contains(httpResponse.statusCode)
                else {
                    throw URLError(.badServerResponse)
                }

                let allProducts = try JSONDecoder().decode([Product].self, from: data)

                let filtered = allProducts.filter { categoryIds.contains($0.id) }  // Filtering by ID as proxy

                await MainActor.run {
                    self.products = filtered
                    self.isLoading = false
                }
            } catch {
                AppLogger.error("Smart Basket fetch error: \(error)")
                await MainActor.run {
                    self.errorMessage = "Failed to load smart basket"
                    self.isLoading = false
                }
            }
        }
    }
}
