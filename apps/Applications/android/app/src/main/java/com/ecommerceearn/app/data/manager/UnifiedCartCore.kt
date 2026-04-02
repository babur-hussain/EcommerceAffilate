package com.ecommerceearn.app.data.manager

import android.content.Context
import android.content.SharedPreferences
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.utils.AppLogger
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap

enum class CartType(val id: String) {
    SHOPPING("guest_cart"),
    GROCERY("grocery_basket")
}

data class CartItem(
    val productId: String,
    var quantity: Int,
    val product: Product
) {
    val id: String get() = productId
}

object UnifiedCartCore {
    private val scope = CoroutineScope(Dispatchers.Main)
    private lateinit var prefs: SharedPreferences
    private val gson = Gson()

    val items: ConcurrentHashMap<CartType, MutableList<CartItem>> = ConcurrentHashMap(mapOf(
        CartType.SHOPPING to mutableListOf(),
        CartType.GROCERY to mutableListOf()
    ))

    val quantityIndex: ConcurrentHashMap<CartType, MutableMap<String, Int>> = ConcurrentHashMap(mapOf(
        CartType.SHOPPING to mutableMapOf(),
        CartType.GROCERY to mutableMapOf()
    ))

    private val saveJobs = ConcurrentHashMap<CartType, kotlinx.coroutines.Job>()

    fun init(context: Context) {
        prefs = context.getSharedPreferences("cart_prefs", Context.MODE_PRIVATE)
        loadAll()
    }

    private fun loadAll() {
        for (type in CartType.values()) {
            val json = prefs.getString(type.id, null)
            if (json != null) {
                try {
                    val listType = object : TypeToken<MutableList<CartItem>>() {}.type
                    val decoded: MutableList<CartItem> = gson.fromJson(json, listType)
                    items[type] = decoded
                    rebuildIndex(type)
                } catch (e: Exception) {
                    AppLogger.error("Failed to parse cart JSON for ${type.id}: ${e.message}")
                }
            }
        }
    }

    private fun scheduleSave(type: CartType) {
        saveJobs[type]?.cancel()
        saveJobs[type] = scope.launch {
            delay(500) // 500ms debounce
            val encoded = gson.toJson(items[type])
            prefs.edit().putString(type.id, encoded).apply()
        }
    }

    private fun rebuildIndex(type: CartType) {
        val cartItems = items[type] ?: return
        val index = mutableMapOf<String, Int>()
        for (item in cartItems) {
            index[item.productId] = item.quantity
        }
        quantityIndex[type] = index
    }

    fun total(type: CartType): Double {
        return items[type]?.sumOf { (it.product.price ?: 0.0) * it.quantity } ?: 0.0
    }

    fun count(type: CartType): Int {
        return items[type]?.sumOf { it.quantity } ?: 0
    }

    fun savings(type: CartType): Double {
        return items[type]?.sumOf { item ->
            val mrp = item.product.mrp ?: item.product.price ?: 0.0
            val price = item.product.price ?: 0.0
            val savingsPerItem = maxOf(0.0, mrp - price)
            savingsPerItem * item.quantity
        } ?: 0.0
    }

    fun getItemCount(type: CartType, productId: String): Int {
        return quantityIndex[type]?.get(productId) ?: 0
    }

    fun addItem(type: CartType, product: Product, quantity: Int = 1) {
        val cartItems = items[type] ?: mutableListOf()
        val index = cartItems.indexOfFirst { it.productId == product.id }

        if (index != -1) {
            cartItems[index].quantity += quantity
        } else {
            cartItems.add(CartItem(product.id, quantity, product))
        }

        items[type] = cartItems
        rebuildIndex(type)
        scheduleSave(type)
        HapticManager.impact()
    }

    fun removeItem(type: CartType, productId: String) {
        items[type]?.removeAll { it.productId == productId }
        rebuildIndex(type)
        scheduleSave(type)
    }

    fun updateQuantity(type: CartType, productId: String, quantity: Int) {
        if (quantity <= 0) {
            removeItem(type, productId)
            return
        }

        val cartItems = items[type] ?: return
        val index = cartItems.indexOfFirst { it.productId == productId }
        if (index != -1) {
            cartItems[index].quantity = quantity
            items[type] = cartItems
            rebuildIndex(type)
            scheduleSave(type)
            HapticManager.impact()
        }
    }

    fun clear(type: CartType) {
        items[type]?.clear()
        quantityIndex[type]?.clear()
        scheduleSave(type)
    }

    fun getItems(type: CartType): List<CartItem> {
        return items[type]?.toList() ?: emptyList()
    }
}
