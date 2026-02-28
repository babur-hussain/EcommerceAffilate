import Combine
import Foundation
import SwiftUI

// MARK: - Basket Manager (Grocery)
// Fix #17: Thin wrapper around UnifiedCartCore — no duplicate logic

@MainActor
class BasketManager: ObservableObject {
    private let core = UnifiedCartCore.shared
    private let type: CartType = .grocery

    // Expose items as published for view reactivity
    @Published var items: [CartItem] = []  // using CartItem for consistency
    @Published var isLoading = false
    // Fix #16: Exposed for backward compatibility (views may observe this)
    @Published private(set) var quantityIndex: [String: Int] = [:]

    private let GROCERY_CATEGORY_ID = "696686d02c5aacc146652e03"

    init() {
        syncFromCore()
    }

    // Computed Properties
    var basketTotal: Double { core.total(for: type) }
    var basketCount: Int { core.count(for: type) }
    var basketSavings: Double { core.savings(for: type) }

    // MARK: - Actions

    func addToBasket(product: Product, quantity: Int = 1) {
        core.addItem(type: type, product: product, quantity: quantity)
        syncFromCore()
    }

    func removeFromBasket(productId: String) {
        core.removeItem(type: type, productId: productId)
        syncFromCore()
    }

    func updateQuantity(productId: String, quantity: Int) {
        core.updateQuantity(type: type, productId: productId, quantity: quantity)
        syncFromCore()
    }

    func clearBasket() {
        core.clear(type: type)
        syncFromCore()
    }

    // Fix #16: O(1) item count lookup
    func getItemCount(productId: String) -> Int {
        core.getItemCount(type: type, productId: productId)
    }

    // MARK: - Sync

    private func syncFromCore() {
        items = core.getItems(for: type)
        quantityIndex = core.quantityIndex[type] ?? [:]
    }
}
