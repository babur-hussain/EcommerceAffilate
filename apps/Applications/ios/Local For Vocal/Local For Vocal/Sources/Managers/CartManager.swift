import Combine
import Foundation
import SwiftUI

// MARK: - Cart Item Model
public struct CartItem: Codable, Identifiable {
    public var id: String { productId }  // Helper for List
    public let productId: String
    public var quantity: Int
    // We store minimal product details to display the cart even if offline/API fails
    // or to show immediately before fetching full details.
    // In a real app, you might only store ID and fetch details, but storing a snapshot is common for guest carts.
    public let product: Product
}

// MARK: - Cart Manager (Shopping)
// Fix #17: Thin wrapper around UnifiedCartCore — no duplicate logic

@MainActor
public class CartManager: ObservableObject {
    private let core = UnifiedCartCore.shared
    private let type: CartType = .shopping

    // Expose items as published for view reactivity
    @Published var items: [CartItem] = []
    @Published var isLoading = false

    private var syncTimer: Timer?

    // Computed Properties
    var cartTotal: Double { core.total(for: type) }
    var cartCount: Int { core.count(for: type) }
    var cartSavings: Double { core.savings(for: type) }

    init() {
        syncFromCore()
    }

    // MARK: - Actions

    func addToCart(product: Product, quantity: Int = 1) {
        core.addItem(type: type, product: product, quantity: quantity)
        syncFromCore()
    }

    func removeFromCart(productId: String) {
        core.removeItem(type: type, productId: productId)
        syncFromCore()
    }

    func updateQuantity(productId: String, quantity: Int) {
        core.updateQuantity(type: type, productId: productId, quantity: quantity)
        syncFromCore()
    }

    func clearCart() {
        core.clear(type: type)
        syncFromCore()
    }

    // MARK: - Sync

    private func syncFromCore() {
        items = core.getItems(for: type)
    }
}
