package com.ecommerceearn.app.data.repository

import com.ecommerceearn.app.data.model.Category
import com.ecommerceearn.app.data.remote.NetworkClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Singleton repository to cache category API responses.
 * Ensures the categories are only fetched once per session to provide instant UI loading.
 */
object CategoryRepository {
    private var cachedCategories: List<Category>? = null

    suspend fun getCategories(forceRefresh: Boolean = false): List<Category> {
        if (!forceRefresh && cachedCategories != null) {
            return cachedCategories!!
        }
        return try {
            withContext(Dispatchers.IO) {
                val categories = NetworkClient.apiService.getCategories()
                cachedCategories = categories
                categories
            }
        } catch (e: Exception) {
            cachedCategories ?: emptyList()
        }
    }

    suspend fun preload() {
        if (cachedCategories == null) {
            try {
                withContext(Dispatchers.IO) {
                    cachedCategories = NetworkClient.apiService.getCategories()
                }
            } catch (e: Exception) {
                // Ignore silent prefetch failures
            }
        }
    }
}
