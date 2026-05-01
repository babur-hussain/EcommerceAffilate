package com.localforvocalstartup.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.localforvocalstartup.app.data.manager.LayoutPreloader
import com.localforvocalstartup.app.data.manager.NetworkMonitor
import com.localforvocalstartup.app.data.manager.SDUICacheManager
import com.localforvocalstartup.app.data.model.SDUIComponent
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import com.google.gson.Gson
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SDUIPageViewModel(private val pageSlug: String) : ViewModel() {

    private val gson = Gson()
    private val _components = MutableStateFlow<List<SDUIComponent>>(emptyList())
    val components: StateFlow<List<SDUIComponent>> = _components.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _showSkeleton = MutableStateFlow(false)
    val showSkeleton: StateFlow<Boolean> = _showSkeleton.asStateFlow()

    private val _isFromCache = MutableStateFlow(false)
    val isFromCache: StateFlow<Boolean> = _isFromCache.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private var fetchJob: Job? = null

    fun loadLayout() {
        if (_isLoading.value) return
        fetchJob?.cancel()
        fetchJob = viewModelScope.launch {
            loadLayoutInternal()
        }
    }

    private suspend fun loadLayoutInternal() {
        _isLoading.value = true
        _errorMessage.value = null

        val cached = SDUICacheManager.getCachedSDUI(pageSlug, null)
        if (cached != null) {
            val cachedComponents = try {
                val type = com.google.gson.reflect.TypeToken.getParameterized(List::class.java, SDUIComponent::class.java).type
                gson.fromJson<List<SDUIComponent>>(String(cached.data, Charsets.UTF_8), type)
            } catch (e: Exception) { emptyList() }
            _components.value = cachedComponents
            _isFromCache.value = true
            _showSkeleton.value = false
            AppLogger.debug("[SDUI] Loaded ${cachedComponents.size} components from cache (stale: ${cached.isStale})")
        } else {
            _showSkeleton.value = true
            AppLogger.debug("[SDUI] No cache, showing skeleton for $pageSlug")
        }

        if (!NetworkMonitor.isConnected.value) {
            if (_components.value.isEmpty()) {
                _errorMessage.value = "You're offline and no cached content is available"
                _showSkeleton.value = false
            }
            _isLoading.value = false
            AppLogger.debug("[SDUI] Offline — using cached content for $pageSlug")
            return
        }

        try {
            val response = NetworkClient.apiService.getLayoutBySlug(pageSlug)
            val freshComponents = response.components
            val rawData = gson.toJson(freshComponents).toByteArray(Charsets.UTF_8)

            if (SDUICacheManager.hasContentChanged(pageSlug, rawData)) {
                _components.value = freshComponents
                _showSkeleton.value = false
                _isFromCache.value = false
                AppLogger.debug("[SDUI] Updated with ${freshComponents.size} fresh components")
            } else {
                _showSkeleton.value = false
                AppLogger.debug("[SDUI] Content unchanged for $pageSlug, skipping re-render")
            }

            SDUICacheManager.saveSDUI(pageSlug, rawData)
            LayoutPreloader.registerCachedSlug(pageSlug)

        } catch (e: Exception) {
            if (_components.value.isEmpty()) {
                _errorMessage.value = e.localizedMessage
                _showSkeleton.value = false
                AppLogger.debug("[SDUI] Network error and no cache: ${e.message}")
            } else {
                AppLogger.debug("[SDUI] Network failed but using cached content")
            }
        } finally {
            _isLoading.value = false
        }
    }

    fun forceRefresh() {
        fetchJob?.cancel()
        fetchJob = viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null

            if (!NetworkMonitor.isConnected.value) {
                _errorMessage.value = "You're offline. Cannot refresh."
                _isLoading.value = false
                return@launch
            }

            try {
                val response = NetworkClient.apiService.getLayoutBySlug(pageSlug)
                _components.value = response.components
                _isFromCache.value = false
                val rawData = gson.toJson(response.components).toByteArray(Charsets.UTF_8)
                SDUICacheManager.saveSDUI(pageSlug, rawData)
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
            } finally {
                _isLoading.value = false
            }
        }
    }

    suspend fun clearCache() {
        SDUICacheManager.clearCache(pageSlug, null)
    }

    class Factory(private val slug: String) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return SDUIPageViewModel(slug) as T
        }
    }
}
