package com.ecommerceearn.app.ui.components

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.ecommerceearn.app.data.model.AdvancedLayoutResponse
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.data.remote.NetworkClient
import com.google.gson.Gson
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class SDUIHeaderState(
    val slug: String = "",
    val isLoading: Boolean = false,
    val components: List<SDUIComponent> = emptyList(),
    val error: String? = null
)

class SDUIHeaderViewModel(application: Application) : AndroidViewModel(application) {

    private val _state = MutableStateFlow(SDUIHeaderState())
    val state: StateFlow<SDUIHeaderState> = _state.asStateFlow()

    companion object {
        private const val TAG = "SDUIHeaderVM"
        private val gson = Gson()

        /**
         * Built-in fallback JSON for the "for-you-header-theme" slug.
         * This ensures the header renders with proper colors immediately,
         * even if the network call is slow or the emulator is offline.
         * Mirrors the live API response from https://api.lfvs.in/api/advanced-layout/for-you-header-theme
         */
        private const val FALLBACK_FOR_YOU_HEADER_JSON = """
        {
            "_id": "local_fallback",
            "slug": "for-you-header-theme",
            "name": "ForYou Header Theme (Fallback)",
            "isActive": true,
            "components": [
                {
                    "id": "header_background_image",
                    "type": "header_background",
                    "props": {
                        "imageUrl": "",
                        "gradientColors": ["62cff4", "2c67f2"],
                        "lottieLayers": [
                            {
                                "animationName": "Holi",
                                "frame": { "x": 0, "y": 54, "width": 100, "height": 100 },
                                "loop": true,
                                "speed": 1,
                                "contentMode": "fill",
                                "opacity": 1
                            },
                            {
                                "animationName": "Holi Pichakari",
                                "frame": { "x": 55, "y": 5, "width": 40, "height": 40 },
                                "loop": true,
                                "speed": 1,
                                "contentMode": "fill",
                                "opacity": 1
                            }
                        ]
                    },
                    "children": []
                }
            ]
        }
        """

        private fun parseFallback(): List<SDUIComponent> {
            return try {
                val response = gson.fromJson(FALLBACK_FOR_YOU_HEADER_JSON, AdvancedLayoutResponse::class.java)
                response.components
            } catch (e: Exception) {
                Log.e(TAG, "Failed to parse fallback JSON: ${e.message}")
                emptyList()
            }
        }
    }

    fun fetchLayout(slug: String) {
        if (_state.value.slug == slug && _state.value.components.isNotEmpty()) {
            Log.d(TAG, "fetchLayout: Already loaded slug='$slug' with ${_state.value.components.size} components, skipping.")
            return
        }

        // Immediately apply the built-in fallback (instant render, no network wait)
        val fallback = parseFallback()
        if (fallback.isNotEmpty() && _state.value.components.isEmpty()) {
            Log.d(TAG, "fetchLayout: Applying built-in fallback (${fallback.size} components) while network loads.")
            _state.value = SDUIHeaderState(
                slug = slug,
                isLoading = true,  // still mark loading so we try to refresh from network
                components = fallback
            )
        } else {
            _state.value = _state.value.copy(slug = slug, isLoading = true, error = null)
        }

        Log.d(TAG, "fetchLayout: Starting network fetch for slug='$slug'")
        viewModelScope.launch {
            try {
                val response = NetworkClient.apiService.getLayoutBySlug(slug)
                Log.d(TAG, "fetchLayout: SUCCESS for slug='$slug'. Got ${response.components.size} components from API.")
                response.components.forEach { c ->
                    Log.d(TAG, "  component: id=${c.originalId}, type=${c.rawType}, propsKeys=${c.props?.keySet()}")
                }
                _state.value = SDUIHeaderState(
                    slug = slug,
                    isLoading = false,
                    components = response.components
                )
            } catch (e: Exception) {
                Log.e(TAG, "fetchLayout: FAILED for slug='$slug': ${e::class.simpleName}: ${e.message}", e)
                // Keep the fallback components if we have them; just clear loading
                if (_state.value.components.isNotEmpty()) {
                    Log.d(TAG, "Keeping fallback components despite network failure.")
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = "${e::class.simpleName}: ${e.message}"
                    )
                } else {
                    _state.value = SDUIHeaderState(
                        slug = slug,
                        isLoading = false,
                        error = "${e::class.simpleName}: ${e.message}"
                    )
                }
            }
        }
    }
}
