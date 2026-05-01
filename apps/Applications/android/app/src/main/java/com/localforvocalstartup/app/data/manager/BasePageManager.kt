package com.localforvocalstartup.app.data.manager

import com.localforvocalstartup.app.data.model.Category
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll

abstract class BasePageManager {
    protected val scope = CoroutineScope(Dispatchers.IO)

    protected val _subCategories = MutableStateFlow<List<Category>>(emptyList())
    val subCategories: StateFlow<List<Category>> = _subCategories.asStateFlow()

    protected val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    protected val _selectedCategoryId = MutableStateFlow<String?>(null)
    val selectedCategoryId: StateFlow<String?> = _selectedCategoryId.asStateFlow()

    protected val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    protected val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    abstract val parentCategoryId: String

    open fun fetchInitialData() {
        scope.launch {
            fetchSubCategories()
            fetchProducts()
        }
    }

    private suspend fun fetchSubCategories() {
        if (parentCategoryId.isEmpty()) return
        try {
            val categories = NetworkClient.apiService.getSubCategories(parentCategoryId)
            _subCategories.value = categories
        } catch (e: Exception) {
            AppLogger.debug("Error fetching subcategories for $parentCategoryId: ${e.message}")
        }
    }

    private suspend fun fetchProducts(categoryId: String? = null) {
        if (parentCategoryId.isEmpty()) return

        _isLoading.value = true
        _errorMessage.value = null

        try {
            if (categoryId != null) {
                // Fetch for specific category (in real implementation, update APIService properly)
                // We're stubbing to the basic getProducts for now since subCategory queries were added locally
                _products.value = NetworkClient.apiService.getProductsRaw(50).products
            } else {
                if (_subCategories.value.isEmpty()) {
                    _products.value = NetworkClient.apiService.getProductsRaw(50).products
                } else {
                    val defs = _subCategories.value.map { category ->
                        scope.async {
                            NetworkClient.apiService.getProductsRaw(20).products // Stub
                        }
                    }
                    val allProducts = defs.awaitAll().flatten()
                    _products.value = allProducts.distinctBy { it.id }.shuffled()
                }
            }
        } catch (e: Exception) {
            _errorMessage.value = e.localizedMessage
        } finally {
            _isLoading.value = false
        }
    }

    fun selectCategory(id: String?) {
        if (_selectedCategoryId.value == id) return
        _selectedCategoryId.value = id
        scope.launch {
            fetchProducts(id)
        }
    }
}
