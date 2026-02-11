import SwiftUI

struct SmartBasketView: View {
    let component: SDUIComponent
    @StateObject private var viewModel = SDUIComponentViewModel()
    @EnvironmentObject var navigationManager: NavigationManager

    // Props
    private var title: String { component.prop(for: "title") ?? "YOUR SMART BASKET" }
    private var saveAmount: String { component.prop(for: "saveAmount") ?? "300" }
    private var backgroundColor: Color {
        if let hex = component.prop(for: "backgroundColor") as String? {
            return Color(hex: hex)
        }
        return Color(hex: "#FFF9C4")  // Default yellow background
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 4) {
                        Text("YOUR")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))

                        Text("SMART")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 2)
                            .background(Color(hex: "#111827"))
                            .cornerRadius(4)

                        Text("BASKET")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }

                Spacer()

                // Save Badge
                HStack(spacing: 4) {
                    Text("Save minimum")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(Color(hex: "#111827"))

                    Text("₹\(saveAmount)")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "#FFD700"))  // Gold/Yellow
                        .clipShape(Capsule())
                }
            }
            .padding(.horizontal, 16)

            // Product List
            if viewModel.isLoading {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(0..<3) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white.opacity(0.5))
                                .frame(width: 140, height: 200)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            } else if let products = viewModel.data as? [Product], !products.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(products) { product in
                            GroceryProductCard(product: product)
                                .frame(width: 150)
                                .background(Color.white)
                                .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            } else {
                // Empty state or hidden
                Text("Your basket is empty")
                    .font(.caption)
                    .padding(.horizontal, 16)
                    .foregroundColor(.gray)
            }

            // Footer Action
            Button(action: {
                // Navigate to listing with subCategoryIds
                let subCategoryIds = component.decodeItems(for: "subCategoryIds", as: [String].self)
                if !subCategoryIds.isEmpty {
                    let idsString = subCategoryIds.joined(separator: ",")
                    // Use NavigationManager's category scheme
                    let url = "category://Smart%20Basket?subCategoryId=\(idsString)&layout=grocery"
                    navigationManager.navigate(to: url)
                }
            }) {
                HStack {
                    Text("View All")
                        .font(.system(size: 14, weight: .semibold))
                    Image(systemName: "arrow.right")
                        .font(.system(size: 12))
                }
                .foregroundColor(Color(hex: "#111827"))
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(Color.white)
                .cornerRadius(12)
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 20)
        .background(backgroundColor)
        .cornerRadius(16)
        .padding(.horizontal, 16)
        .padding(.top, 24)  // Add spacing above the section
        .onAppear {
            loadProducts()
        }
    }

    private func loadProducts() {
        guard !viewModel.isLoading, viewModel.data == nil else { return }
        viewModel.isLoading = true

        let productIds = component.decodeItems(for: "productIds", as: [String].self)

        guard !productIds.isEmpty else {
            viewModel.isLoading = false
            return
        }

        Task {
            // Fetch products in parallel
            var fetchedProducts: [Product] = []

            await withTaskGroup(of: Product?.self) { group in
                for id in productIds {
                    group.addTask {
                        try? await APIService.shared.fetchProductDetails(id: id)
                    }
                }

                for await product in group {
                    if let p = product {
                        fetchedProducts.append(p)
                    }
                }
            }

            // Sort by order in productIds if needed, current parallel might jumble.
            // For now, accept random order or sort by ID index.

            await MainActor.run {
                self.viewModel.data = fetchedProducts
                self.viewModel.isLoading = false
            }
        }
    }
}
