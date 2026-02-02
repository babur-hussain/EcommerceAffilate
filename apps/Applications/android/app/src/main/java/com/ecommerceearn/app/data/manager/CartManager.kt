package com.ecommerceearn.app.data.manager

import android.content.Context
import android.content.SharedPreferences
import com.ecommerceearn.app.data.model.Cart
import com.ecommerceearn.app.data.model.CartItem
import com.ecommerceearn.app.data.model.Product
import com.google.gson.Gson
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object CartManager {
    private const val PREFS_NAME = "ecommerce_prefs"
    private const val KEY_CART = "guest_cart"
    private lateinit var prefs: SharedPreferences
    private val gson = Gson()

    private val _cartState = MutableStateFlow(Cart())
    val cartState: StateFlow<Cart> = _cartState.asStateFlow()

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        loadCart()
    }

    private fun loadCart() {
        val json = prefs.getString(KEY_CART, null)
        if (json != null) {
            try {
                _cartState.value = gson.fromJson(json, Cart::class.java)
            } catch (e: Exception) {
                e.printStackTrace()
                _cartState.value = Cart()
            }
        }
    }

    private fun saveCart() {
        val json = gson.toJson(_cartState.value)
        prefs.edit().putString(KEY_CART, json).apply()
    }

    fun addToCart(product: Product, quantity: Int = 1) {
        val currentItems = _cartState.value.items.toMutableList()
        val existingIndex = currentItems.indexOfFirst { it.productId.id == product.id }

        if (existingIndex != -1) {
            val existingItem = currentItems[existingIndex]
            currentItems[existingIndex] = existingItem.copy(quantity = existingItem.quantity + quantity)
        } else {
            currentItems.add(CartItem(product, quantity))
        }

        updateCartState(currentItems)
    }

    fun removeFromCart(productId: String) {
        val currentItems = _cartState.value.items.filter { it.productId.id != productId }
        updateCartState(currentItems)
    }

    fun updateQuantity(productId: String, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        val currentItems = _cartState.value.items.map {
            if (it.productId.id == productId) it.copy(quantity = quantity) else it
        }
        updateCartState(currentItems)
    }

    fun clearCart() {
        updateCartState(emptyList())
    }

    private fun updateCartState(items: List<CartItem>) {
        val total = items.sumOf { it.productId.price * it.quantity }
        _cartState.value = Cart(items = items, totalAmount = total)
        saveCart()
    }

    fun getCount(): Int {
        return _cartState.value.items.sumOf { it.quantity }
    }
}
