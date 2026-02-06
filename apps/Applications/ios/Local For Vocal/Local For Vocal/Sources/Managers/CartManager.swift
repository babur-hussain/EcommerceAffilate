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

// MARK: - Cart Manager
@MainActor
public class CartManager: ObservableObject {
    @Published var items: [CartItem] = []
    @Published var isLoading = false

    // Computed Properties
    var cartTotal: Double {
        items.reduce(0) { $0 + ($1.product.price * Double($1.quantity)) }
    }

    var cartCount: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    private let saveKey = "guest_cart"

    init() {
        loadCart()
    }

    // MARK: - Persistence

    private func loadCart() {
        if let data = UserDefaults.standard.data(forKey: saveKey) {
            if let decoded = try? JSONDecoder().decode([CartItem].self, from: data) {
                self.items = decoded
                return
            }
        }
        self.items = []
    }

    private func saveCart() {
        if let encoded = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }

    // MARK: - Actions

    func addToCart(product: Product, quantity: Int = 1) {
        if let index = items.firstIndex(where: { $0.productId == product.id }) {
            // Update existing
            items[index].quantity += quantity
        } else {
            // Add new
            let newItem = CartItem(productId: product.id, quantity: quantity, product: product)
            items.append(newItem)
        }
        saveCart()

        // Haptic feedback could be added here
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }

    func removeFromCart(productId: String) {
        items.removeAll { $0.productId == productId }
        saveCart()
    }

    func updateQuantity(productId: String, quantity: Int) {
        if quantity <= 0 {
            removeFromCart(productId: productId)
            return
        }

        if let index = items.firstIndex(where: { $0.productId == productId }) {
            items[index].quantity = quantity
            saveCart()

            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()
        }
    }

    func clearCart() {
        items = []
        saveCart()
    }
}
