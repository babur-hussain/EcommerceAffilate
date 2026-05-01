package com.localforvocalstartup.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.localforvocalstartup.app.data.model.GlobalSearchResponse
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import kotlinx.coroutines.Job
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.CancellationException

sealed class SearchState {
    object Idle : SearchState()
    object Loading : SearchState()
    object Results : SearchState()
    data class Error(val message: String) : SearchState()
}

@OptIn(FlowPreview::class)
class SearchViewModel(private val categoryId: String? = null) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _trendingTerms = MutableStateFlow<List<String>>(emptyList())
    val trendingTerms: StateFlow<List<String>> = _trendingTerms.asStateFlow()

    private val _searchState = MutableStateFlow<SearchState>(SearchState.Idle)
    val searchState: StateFlow<SearchState> = _searchState.asStateFlow()

    private val _globalResults = MutableStateFlow<GlobalSearchResponse?>(null)
    val globalResults: StateFlow<GlobalSearchResponse?> = _globalResults.asStateFlow()

    private val _groceryResults = MutableStateFlow<GlobalSearchResponse?>(null)
    val groceryResults: StateFlow<GlobalSearchResponse?> = _groceryResults.asStateFlow()

    private var searchJob: Job? = null

    val isUnifiedSearch: Boolean get() = categoryId == null

    init {
        viewModelScope.launch {
            _query
                .debounce(500)
                .distinctUntilChanged()
                .collectLatest { valQuery ->
                    performSearch(valQuery)
                }
        }

        viewModelScope.launch {
            fetchTrending()
        }
    }

    fun setQuery(q: String) {
        _query.value = q
    }

    private suspend fun fetchTrending() {
        try {
            val terms = NetworkClient.apiService.fetchTrendingTerms()
            _trendingTerms.value = terms
        } catch (e: Exception) {
            AppLogger.debug("Failed to fetch trending: ${e.message}")
        }
    }

    private suspend fun performSearch(q: String) {
        if (q.trim().isEmpty()) {
            _searchState.value = SearchState.Idle
            _globalResults.value = null
            _groceryResults.value = null
            return
        }

        _searchState.value = SearchState.Loading
        try {
            if (categoryId == "grocery") {
                val results = NetworkClient.apiService.fetchGrocerySearch(q)
                _globalResults.value = results
                _groceryResults.value = null
            } else if (isUnifiedSearch) {
                // Unified: Launch both concurrently
                coroutineScope {
                    val pRes = async { NetworkClient.apiService.fetchGlobalSearch(q) }
                    val gRes = async { NetworkClient.apiService.fetchGrocerySearch(q) }
                    _globalResults.value = pRes.await()
                    _groceryResults.value = gRes.await()
                }
            } else {
                val results = NetworkClient.apiService.fetchGlobalSearch(q)
                _globalResults.value = results
                _groceryResults.value = null
            }
            _searchState.value = SearchState.Results
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            _searchState.value = SearchState.Error(e.localizedMessage ?: "Error searching")
        }
    }

    val hasNoResults: Boolean
        get() {
            val productEmpty = _globalResults.value?.products?.isEmpty() ?: true
            val groceryEmpty = _groceryResults.value?.products?.isEmpty() ?: true
            return productEmpty && groceryEmpty
        }

    val hasAnyResults: Boolean get() = !hasNoResults
}
