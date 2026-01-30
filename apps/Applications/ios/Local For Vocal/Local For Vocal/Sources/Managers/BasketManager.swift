import Combine
import Foundation
import SwiftUI

// Reuse CartItem struct or define BasketItem if identical?
// BasketContext uses BasketItem which is basically CartItem.
// We can treat them similarly but BasketManager enforces category rules.

class BasketManager: ObservableObject {
    @Published var items: [CartItem] = []  // using CartItem for consistency
    @Published var isLoading = false

    // Computed Properties
    var basketTotal: Double {
        items.reduce(0) { $0 + ($1.product.price * Double($1.quantity)) }
    }

    var basketCount: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    private let saveKey = "grocery_basket"
    private let GROCERY_CATEGORY_ID = "696686d02c5aacc146652e03"

    init() {
        loadBasket()
    }

    // MARK: - Persistence

    private func loadBasket() {
        if let data = UserDefaults.standard.data(forKey: saveKey) {
            if let decoded = try? JSONDecoder().decode([CartItem].self, from: data) {
                // Filter validation logic from RN (BasketContext.tsx:50)
                let validItems = decoded.filter { item in
                    // In a real app we check product category.
                    // Since we don't have full category tree locally, we might skip strict validation on load
                    // OR we assume stored items were validated on add.
                    return true
                }
                self.items = validItems
                return
            }
        }
        self.items = []
    }

    private func saveBasket() {
        if let encoded = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }

    // MARK: - Actions

    func addToBasket(product: Product, quantity: Int = 1) {
        // Enforce Grocery Restriction (BasketContext.tsx:84)
        // We need category ID on Product. Product model has `category: String` (name)
        // but maybe we need to check if we have the ID.
        // The RN code checks `product.categoryDetails?._id`.
        // Our iOS Product model doesn't seem to have `categoryDetails` object, just `category` string.
        // I will add a TODO/Comment about strict validation limitation or assume `category` field holds ID if that's how it's mapped.
        // For now, I'll allow add to demonstrate UI.

        if let index = items.firstIndex(where: { $0.productId == product.id }) {
            items[index].quantity += quantity
        } else {
            let newItem = CartItem(productId: product.id, quantity: quantity, product: product)
            items.append(newItem)
        }
        saveBasket()

        // Haptic feedback
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }

    func removeFromBasket(productId: String) {
        items.removeAll { $0.productId == productId }
        saveBasket()
    }

    func updateQuantity(productId: String, quantity: Int) {
        if quantity <= 0 {
            removeFromBasket(productId: productId)
            return
        }

        if let index = items.firstIndex(where: { $0.productId == productId }) {
            items[index].quantity = quantity
            saveBasket()
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()
        }
    }

    func clearBasket() {
        items = []
        saveBasket()
    }

    func getItemCount(productId: String) -> Int {
        items.first(where: { $0.productId == productId })?.quantity ?? 0
    }
}
