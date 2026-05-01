package com.localforvocalstartup.app.data.manager

import com.localforvocalstartup.app.data.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object BasketManager {
    private val core = UnifiedCartCore
    private val type = CartType.GROCERY
    
    private const val GROCERY_CATEGORY_ID = "696686d02c5aacc146652e03"

    private val _items = MutableStateFlow<List<CartItem>>(emptyList())
    val items: StateFlow<List<CartItem>> = _items.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _quantityIndex = MutableStateFlow<Map<String, Int>>(emptyMap())
    val quantityIndex: StateFlow<Map<String, Int>> = _quantityIndex.asStateFlow()

    val basketTotal: Double get() = core.total(type)
    val basketCount: Int get() = core.count(type)
    val basketSavings: Double get() = core.savings(type)

    init {
        syncFromCore()
    }

    fun addToBasket(product: Product, quantity: Int = 1) {
        core.addItem(type, product, quantity)
        syncFromCore()
    }

    fun removeFromBasket(productId: String) {
        core.removeItem(type, productId)
        syncFromCore()
    }

    fun updateQuantity(productId: String, quantity: Int) {
        core.updateQuantity(type, productId, quantity)
        syncFromCore()
    }

    fun clearBasket() {
        core.clear(type)
        syncFromCore()
    }

    fun getItemCount(productId: String): Int {
        return core.getItemCount(type, productId)
    }

    private fun syncFromCore() {
        _items.value = core.getItems(type)
        _quantityIndex.value = core.quantityIndex[type]?.toMap() ?: emptyMap()
    }
}
