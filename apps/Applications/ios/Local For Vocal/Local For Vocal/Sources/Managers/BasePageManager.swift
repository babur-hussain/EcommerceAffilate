import Combine
import Foundation
import SwiftUI

// MARK: - Base Page Manager
// Shared logic for pages that fetch subcategories and products based on a parent category ID.
// Fix #7: @MainActor at class level ensures all @Published mutations are thread-safe
@MainActor
class BasePageManager: ObservableObject {
    @Published var subCategories: [SubCategory] = []
    @Published var products: [Product] = []
    @Published var selectedCategoryId: String? = nil
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil

    // To be overridden by subclasses
    var parentCategoryId: String {
        return ""
    }

    // Fetch initial data
    func fetchInitialData() {
        Task {
            await fetchSubCategories()
            await fetchProducts()
        }
    }

    // Fetch Subcategories
    @MainActor
    func fetchSubCategories() async {
        guard !parentCategoryId.isEmpty else { return }

        do {
            let fetchedCategories = try await APIService.shared.fetchSubCategories(
                parentId: parentCategoryId)
            self.subCategories = fetchedCategories
        } catch {
            AppLogger.debug("Error fetching subcategories for \(parentCategoryId): \(error)")
            // Fallback to empty or local if needed
        }
    }

    // Fetch Products (optionally filtered by category)
    // Fetch Products (optionally filtered by category)
    @MainActor
    func fetchProducts(categoryId: String? = nil) async {
        guard !parentCategoryId.isEmpty else { return }

        self.isLoading = true
        self.errorMessage = nil

        do {
            if let specificCategory = categoryId {
                // Fetch for specific category
                let fetchedProducts = try await APIService.shared.fetchProducts(
                    limit: 50,
                    categoryId: nil,
                    subCategoryId: specificCategory
                )
                self.products = fetchedProducts
            } else {
                // "All Items": Fetch from ALL subcategories concurrently
                // If subCategories is empty, try fetching them first or fallback to parent
                if subCategories.isEmpty {
                    // Fallback to parent if no subcategories known yet
                    let fetchedProducts = try await APIService.shared.fetchProducts(
                        limit: 50,
                        categoryId: nil,
                        subCategoryId: parentCategoryId
                    )
                    self.products = fetchedProducts
                } else {
                    // Concurrent Fetch
                    var allProducts: [Product] = []

                    try await withThrowingTaskGroup(of: [Product].self) { group in
                        for category in subCategories {
                            group.addTask {
                                return try await APIService.shared.fetchProducts(
                                    limit: 20,  // Limit per subcat to avoid overload
                                    categoryId: nil,
                                    subCategoryId: category.id
                                )
                            }
                        }

                        for try await products in group {
                            allProducts.append(contentsOf: products)
                        }
                    }

                    // Deduplicate by ID
                    let uniqueProducts = Array(
                        Dictionary(grouping: allProducts, by: { $0.id })
                            .compactMap { $0.value.first }
                    )

                    self.products = uniqueProducts.shuffled()  // Shuffle for variety
                }
            }

            self.isLoading = false
        } catch {
            AppLogger.debug("Error fetching products: \(error)")
            self.errorMessage = error.localizedDescription
            self.isLoading = false
        }
    }

    // Handle Category Selection
    func selectCategory(_ id: String?) {
        guard self.selectedCategoryId != id else { return }

        self.selectedCategoryId = id

        Task {
            await fetchProducts(categoryId: id)
        }
    }
}
