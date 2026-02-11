import SwiftUI

struct GroceryTopPicksSection: View {
    let component: SDUIComponent
    @StateObject private var viewModel = SDUIComponentViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(component.prop(for: "title") ?? "Top Picks for You")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    if let subtitle = component.prop(for: "subtitle") as String? {
                        Text(subtitle)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }

                Spacer()

                Button(action: {}) {
                    Image(systemName: "arrow.right")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 32, height: 32)
                        .background(Color(hex: "#111827"))
                        .clipShape(Circle())
                }
            }
            .padding(.horizontal, 16)

            // Horizontal Scroll List
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: 12) {
                    if let products = viewModel.data as? [Product], !products.isEmpty {
                        ForEach(products) { product in
                            GroceryProductCard(product: product)
                                .frame(width: 140)
                        }
                    } else if viewModel.isLoading {
                        ForEach(0..<4, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.gray.opacity(0.1))
                                .frame(width: 140, height: 260)
                        }
                    } else {
                        Text("No grocery products found")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                            .padding(.leading, 16)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.top, 20)
        .onAppear {
            loadProductsFromConfig()
        }
        .onChange(of: configKey) { _ in
            // Re-fetch when component props change (e.g. cache → fresh network data with different subCategoryIds)
            loadProductsFromConfig()
        }
    }

    /// A key derived from the props that affect product fetching.
    /// When the SDUI layout is updated (cache → network), this key changes if subCategoryIds differ,
    /// triggering .onChange to re-fetch products with the updated config.
    private var configKey: String {
        let subCategoryIds = component.decodeItems(for: "subCategoryIds", as: [String].self)
        let limit = component.prop(for: "limit", as: Int.self) ?? 20
        return "\(subCategoryIds.joined(separator: ","))_\(limit)"
    }

    func loadProductsFromConfig() {
        viewModel.isLoading = true

        let limit = component.prop(for: "limit", as: Int.self) ?? 20
        // Extract subCategoryIds if available
        let subCategoryIds = component.decodeItems(for: "subCategoryIds", as: [String].self)

        print("🛒 [GroceryTopPicks] Config - Limit: \(limit), SubCats: \(subCategoryIds)")

        Task {
            do {
                let products: [Product]

                if !subCategoryIds.isEmpty {
                    // Fetch by specific sub-categories
                    products = try await APIService.shared.fetchProductsBySubCategoryIds(
                        subCategoryIds, limit: limit)
                } else {
                    // Fallback to generic grocery fetch
                    products = try await APIService.shared.fetchGroceryProducts(limit: limit)
                }

                print("🛒 [GroceryTopPicks] Fetched \(products.count) products")

                await MainActor.run {
                    self.viewModel.data = products
                    self.viewModel.isLoading = false
                }
            } catch {
                print("❌ [GroceryTopPicks] Error: \(error)")
                await MainActor.run {
                    self.viewModel.isLoading = false
                }
            }
        }
    }
}
