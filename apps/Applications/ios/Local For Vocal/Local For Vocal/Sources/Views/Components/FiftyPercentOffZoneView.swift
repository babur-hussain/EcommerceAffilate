import SwiftUI

struct FiftyPercentOffZoneView: View {
    @State private var products: [Product] = []
    private let api = APIService.shared

    // Props
    var title: String = "50% OFF ZONE"
    var subtitle: String = "Half the price, double the joy!"
    var bannerImage: String =
        "https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-grocery-shopping-bag-isolated-png-image_11549419.png"  // Default fallback
    var discountText: String = "50%"

    var body: some View {
        VStack(spacing: 0) {
            // Header Banner
            ZStack(alignment: .leading) {
                LinearGradient(
                    gradient: Gradient(colors: [Color(hex: "#F0F9FF"), Color(hex: "#E0F2FE")]),
                    startPoint: .leading,
                    endPoint: .trailing
                )

                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(alignment: .bottom, spacing: 4) {
                            Text(discountText)
                                .font(.system(size: 42, weight: .black))
                                .italic()
                                .foregroundColor(Color(hex: "#2563EB"))

                            VStack(alignment: .leading, spacing: 0) {
                                Text("OFF")
                                    .font(.system(size: 14, weight: .heavy))
                                    .italic()
                                    .foregroundColor(Color(hex: "#2563EB"))
                                Text("ZONE")
                                    .font(.system(size: 14, weight: .heavy))
                                    .italic()
                                    .foregroundColor(Color(hex: "#3B82F6"))
                            }
                            .padding(.bottom, 6)

                            Image(systemName: "sparkles")
                                .foregroundColor(Color(hex: "#3B82F6"))
                                .padding(.bottom, 12)
                        }

                        Text(subtitle)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }
                    .padding(.leading, 20)

                    Spacer()

                    AsyncImage(url: URL(string: bannerImage)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 140, height: 100)
                    .padding(.trailing, 10)
                }
            }
            .frame(height: 140)

            // Product List
            if products.isEmpty {
                HStack {
                    Spacer()
                    ProgressView()
                    Spacer()
                }
                .padding(20)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(products) { product in
                            ProductCardView(product: product, width: 150)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 16)
                }
            }

            // See All Button
            Button(action: {
                // Navigate to list
            }) {
                HStack {
                    Text("See all")
                        .font(.system(size: 14, weight: .semibold))
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12, weight: .bold))
                }
                .foregroundColor(Color(hex: "#4F46E5"))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color(hex: "#EEF2FF"))
                .cornerRadius(8)
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
        }
        .background(Color.white)
        .padding(.vertical, 12)
        .onAppear {
            loadProducts()
        }
    }

    private func loadProducts() {
        Task {
            do {
                let fetchedProducts = try await api.fetchProducts(limit: 10)
                // In a real app we might filter by discount here
                DispatchQueue.main.async {
                    self.products = fetchedProducts
                }
            } catch {
                print("Error fetching products: \(error)")
            }
        }
    }
}
