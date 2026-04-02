package com.ecommerceearn.app.data.manager

import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

object WishlistManager {
    private val scope = CoroutineScope(Dispatchers.Main)
    
    private val _wishlistItems = MutableStateFlow<List<Product>>(emptyList())
    val wishlistItems: StateFlow<List<Product>> = _wishlistItems.asStateFlow()

    private val _wishlistIds = MutableStateFlow<Set<String>>(emptySet())
    val wishlistIds: StateFlow<Set<String>> = _wishlistIds.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun isInWishlist(productId: String): Boolean {
        return _wishlistIds.value.contains(productId)
    }

    fun fetchWishlist() {
        if (!AuthManager.isLoggedIn()) return

        scope.launch(Dispatchers.IO) {
            _isLoading.value = true
            _error.value = null
            
            try {
                // Requires ApiService to have getWishlist
                // val wrapper = NetworkClient.apiService.getWishlist()
                // _wishlistItems.value = wrapper.wishlist
                // _wishlistIds.value = wrapper.wishlist.map { it.id }.toSet()
            } catch (e: Exception) {
                AppLogger.debug("Wishlist fetch error: ${e.message}")
                _error.value = e.localizedMessage
            } finally {
                _isLoading.value = false
            }
        }
    }

    suspend fun addToWishlist(productId: String): Boolean {
        if (!AuthManager.isLoggedIn()) return false
        
        return try {
            // NetworkClient.apiService.addToWishlist(productId)
            val updatedSet = _wishlistIds.value.toMutableSet().apply { add(productId) }
            _wishlistIds.value = updatedSet
            fetchWishlist()
            true
        } catch (e: Exception) {
            AppLogger.debug("Add to wishlist error: ${e.message}")
            false
        }
    }

    suspend fun removeFromWishlist(productId: String): Boolean {
        if (!AuthManager.isLoggedIn()) return false

        return try {
            // NetworkClient.apiService.removeFromWishlist(productId)
            val updatedSet = _wishlistIds.value.toMutableSet().apply { remove(productId) }
            _wishlistIds.value = updatedSet
            
            val updatedItems = _wishlistItems.value.filter { it.id != productId }
            _wishlistItems.value = updatedItems
            true
        } catch (e: Exception) {
            AppLogger.debug("Remove from wishlist error: ${e.message}")
            false
        }
    }

    suspend fun toggleWishlist(productId: String): Boolean {
        return if (isInWishlist(productId)) {
            removeFromWishlist(productId)
        } else {
            addToWishlist(productId)
        }
    }
}
