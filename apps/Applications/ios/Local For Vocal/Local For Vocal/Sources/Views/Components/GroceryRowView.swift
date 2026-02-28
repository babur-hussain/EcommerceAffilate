import SwiftUI

struct GroceryRowView: View {
    @State private var products: [Product] = []
    @State private var isLoading = true

    var categoryId: String = "DUMMY_GROCERY_ID"

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Popular Grocery Products for You")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)

                Spacer()

                Button(action: {}) {
                    Image(systemName: "arrow.right")
                        .foregroundColor(.white)
                        .padding(8)
                        .background(Color(hex: "#1F2937"))
                        .clipShape(Circle())
                }
            }
            .padding(.horizontal, 12)
            .padding(.bottom, 16)

            // Grid
            if isLoading {
                ProgressView()
                    .frame(height: 200)
            } else {
                LazyVGrid(
                    columns: [
                        GridItem(.flexible(), spacing: 8),
                        GridItem(.flexible(), spacing: 8),
                        GridItem(.flexible(), spacing: 8),
                    ], spacing: 8
                ) {
                    ForEach(products) { product in
                        GroceryProductCard(product: product)
                    }
                }
                .padding(.horizontal, 12)
            }

            // More Button
            Button(action: {}) {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.down")
                    Text("More below")
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "#2563EB"))
                .padding(.vertical, 8)
                .padding(.horizontal, 16)
                .background(Color.white)
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.05), radius: 2, y: 1)
            }
            .padding(.top, 16)
        }
        .padding(.vertical, 16)
        .background(Color(hex: "#F9FAFB"))
        .task {
            await fetchProducts()
        }
    }

    private func fetchProducts() async {
        do {
            let fetched = try await APIService.shared.fetchProducts(limit: 6)
            // Mock category filter if needed, or just take first 6
            self.products = Array(fetched.prefix(6))
        } catch {
            AppLogger.debug("Error fetching grocery products: \(error)")
        }
        isLoading = false
    }
}

// GroceryProductCard is now defined in Views/Components/GroceryProductCard.swift
