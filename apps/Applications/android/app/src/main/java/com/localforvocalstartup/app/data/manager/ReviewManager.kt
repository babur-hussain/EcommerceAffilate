package com.localforvocalstartup.app.data.manager

import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

data class Review(
    val _id: String,
    val productId: String,
    val userId: UserRef,
    val rating: Int,
    val comment: String,
    val createdAt: String
) {
    val id: String get() = _id
    
    data class UserRef(
        val _id: String,
        val name: String,
        val profileImage: String?
    )
}

object ReviewManager {
    private val scope = CoroutineScope(Dispatchers.Main)
    
    private val _reviews = MutableStateFlow<List<Review>>(emptyList())
    val reviews: StateFlow<List<Review>> = _reviews.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun fetchReviews(productId: String) {
        scope.launch {
            _isLoading.value = true
            _error.value = null
            
            try {
                // Warning: getReviews endpoint not strictly defined in ApiService stub yet, assuming Retrofit handles it.
                // Normally we would call NetworkClient.apiService.getReviews(productId). For now we will mock or implement if we update ApiService.
                // We will implement full logic once ApiService is updated
                // val response = NetworkClient.apiService.getReviews(productId)
                // _reviews.value = response
                
                _isLoading.value = false
            } catch (e: Exception) {
                _error.value = "Failed to fetch reviews"
                _isLoading.value = false
                AppLogger.debug("Fetch reviews error: ${e.message}")
            }
        }
    }

    suspend fun submitReview(productId: String, rating: Int, comment: String): Boolean {
        // Implement full logic when ApiService is fully mapped
        return try {
            // NetworkClient.apiService.submitReview(...)
            // fetchReviews(productId)
            true
        } catch (e: Exception) {
            AppLogger.debug("Submit review error: ${e.message}")
            false
        }
    }
}
