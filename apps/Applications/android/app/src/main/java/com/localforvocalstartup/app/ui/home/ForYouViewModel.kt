package com.localforvocalstartup.app.ui.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.localforvocalstartup.app.data.model.SDUIComponent
import com.localforvocalstartup.app.data.remote.NetworkClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ForYouState(
    val isLoading: Boolean = true,
    val components: List<SDUIComponent> = emptyList(),
    val error: String? = null
)

class ForYouViewModel(application: Application) : AndroidViewModel(application) {

    private val _state = MutableStateFlow(ForYouState())
    val state: StateFlow<ForYouState> = _state.asStateFlow()

    init {
        fetchLayout()
    }

    fun fetchLayout() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            try {
                val response = NetworkClient.apiService.getLayoutBySlug("for-you")
                _state.value = ForYouState(
                    isLoading = false,
                    components = response.components
                )
            } catch (e: Exception) {
                _state.value = ForYouState(
                    isLoading = false,
                    error = e.message ?: "Failed to load layout"
                )
            }
        }
    }
}
