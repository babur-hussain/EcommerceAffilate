package com.localforvocalstartup.app.data.manager

import com.localforvocalstartup.app.data.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object CartManager {
    private val core = UnifiedCartCore
    private val type = CartType.SHOPPING

    private val _items = MutableStateFlow<List<CartItem>>(emptyList())
    val items: StateFlow<List<CartItem>> = _items.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    val cartTotal: Double get() = core.total(type)
    val cartCount: Int get() = core.count(type)
    val cartSavings: Double get() = core.savings(type)

    init {
        syncFromCore()
    }

    fun addToCart(product: Product, quantity: Int = 1) {
        core.addItem(type, product, quantity)
        syncFromCore()
    }

    fun removeFromCart(productId: String) {
        core.removeItem(type, productId)
        syncFromCore()
    }

    fun updateQuantity(productId: String, quantity: Int) {
        core.updateQuantity(type, productId, quantity)
        syncFromCore()
    }

    fun clearCart() {
        core.clear(type)
        syncFromCore()
    }

    private fun syncFromCore() {
        _items.value = core.getItems(type)
    }
}
