import Combine
import Foundation
import SwiftUI

// MARK: - Cart Type

/// Identifies which cart/basket a product belongs to
public enum CartType: String, Codable {
    case shopping = "guest_cart"
    case grocery = "grocery_basket"
}

// MARK: - Unified Cart Core

/// Shared persistence and business logic for both CartManager and BasketManager.
/// Fix #17: Eliminates duplicate code (debounced saves, haptic feedback, quantity indexing).
/// CartManager and BasketManager remain as thin wrappers for backward compatibility.
@MainActor
final class UnifiedCartCore {
    static let shared = UnifiedCartCore()

    // MARK: - State per cart type
    private(set) var items: [CartType: [CartItem]] = [
        .shopping: [],
        .grocery: [],
    ]

    // Fix #16: O(1) lookup dictionary per cart type
    private(set) var quantityIndex: [CartType: [String: Int]] = [
        .shopping: [:],
        .grocery: [:],
    ]

    // Fix #4: Debounce timers per cart type
    private var saveTimers: [CartType: Timer] = [:]

    private init() {
        loadAll()
    }

    // MARK: - Persistence

    private func loadAll() {
        for type in [CartType.shopping, .grocery] {
            if let data = UserDefaults.standard.data(forKey: type.rawValue),
                let decoded = try? JSONDecoder().decode([CartItem].self, from: data)
            {
                items[type] = decoded
                rebuildIndex(for: type)
            }
        }
    }

    private func scheduleSave(for type: CartType) {
        saveTimers[type]?.invalidate()
        saveTimers[type] = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: false) {
            [weak self] _ in
            guard let self = self else { return }
            if let encoded = try? JSONEncoder().encode(self.items[type]) {
                UserDefaults.standard.set(encoded, forKey: type.rawValue)
            }
        }
    }

    private func rebuildIndex(for type: CartType) {
        let cartItems = items[type] ?? []
        quantityIndex[type] = Dictionary(
            uniqueKeysWithValues: cartItems.map { ($0.productId, $0.quantity) })
    }

    // MARK: - Computed Properties

    func total(for type: CartType) -> Double {
        (items[type] ?? []).reduce(0) { $0 + ($1.product.price * Double($1.quantity)) }
    }

    func count(for type: CartType) -> Int {
        (items[type] ?? []).reduce(0) { $0 + $1.quantity }
    }

    func savings(for type: CartType) -> Double {
        (items[type] ?? []).reduce(0) { total, item in
            let mrp = item.product.mrp ?? item.product.price
            let price = item.product.price
            let savingsPerItem = max(0, mrp - price)
            return total + (savingsPerItem * Double(item.quantity))
        }
    }

    func getItemCount(type: CartType, productId: String) -> Int {
        quantityIndex[type]?[productId] ?? 0
    }

    // MARK: - Mutations

    func addItem(type: CartType, product: Product, quantity: Int = 1) {
        var cartItems = items[type] ?? []

        if let index = cartItems.firstIndex(where: { $0.productId == product.id }) {
            cartItems[index].quantity += quantity
        } else {
            let newItem = CartItem(productId: product.id, quantity: quantity, product: product)
            cartItems.append(newItem)
        }

        items[type] = cartItems
        rebuildIndex(for: type)
        scheduleSave(for: type)

        // Fix #5: Use shared HapticManager
        HapticManager.shared.impact(style: .light)
    }

    func removeItem(type: CartType, productId: String) {
        items[type]?.removeAll { $0.productId == productId }
        rebuildIndex(for: type)
        scheduleSave(for: type)
    }

    func updateQuantity(type: CartType, productId: String, quantity: Int) {
        if quantity <= 0 {
            removeItem(type: type, productId: productId)
            return
        }

        if let index = items[type]?.firstIndex(where: { $0.productId == productId }) {
            items[type]?[index].quantity = quantity
            rebuildIndex(for: type)
            scheduleSave(for: type)
            HapticManager.shared.impact(style: .light)
        }
    }

    func clear(type: CartType) {
        items[type] = []
        quantityIndex[type] = [:]
        scheduleSave(for: type)
    }

    func getItems(for type: CartType) -> [CartItem] {
        items[type] ?? []
    }
}
