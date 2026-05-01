package com.localforvocalstartup.app.data.manager

import android.content.Context
import android.util.Log
import com.localforvocalstartup.app.utils.AppLogger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.async

object LayoutPreloader {
    val allHeaderSlugs = listOf(
        "for-you-header-theme", "ramadan-header-theme", "fashion-header-theme",
        "mobiles-header-theme", "beauty-header-theme", "electronics-header-theme",
        "home-decor-header-theme", "appliances-header-theme", "toys-header-theme",
        "food-health-header-theme", "dry-fruits-header-theme", "auto-header-theme",
        "sports-header-theme", "books-header-theme", "furniture-header-theme",
        "jewellery-header-theme"
    )

    val allPageSlugs = listOf(
        "for-you", "ramadan-slider-theme", "fashion", "mobiles", "beauty",
        "electronics", "home", "appliances", "toys", "food-health", "dry-fruits",
        "auto", "sports", "books", "furniture", "jewellery"
    )

    private const val PREFS_NAME = "LayoutPreloader_Prefs"
    private const val DISCOVERED_SLUGS_KEY = "DiscoveredSlugs"
    private const val FIRST_LAUNCH_COMPLETE_KEY = "FirstLaunchComplete"

    private lateinit var prefs: android.content.SharedPreferences
    private val scope = CoroutineScope(Dispatchers.IO)

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    val isFirstLaunch: Boolean
        get() = !prefs.getBoolean(FIRST_LAUNCH_COMPLETE_KEY, false)

    fun prefetchAll() {
        val startTime = System.currentTimeMillis()
        AppLogger.debug("[LayoutPreloader] First launch — prefetching all ${allHeaderSlugs.size} headers + ${allPageSlugs.size} pages...")

        val allSlugs = allHeaderSlugs + allPageSlugs

        scope.launch {
            val defs = allSlugs.map { slug ->
                async { fetchAndCache(slug) }
            }
            defs.awaitAll()

            prefs.edit().putBoolean(FIRST_LAUNCH_COMPLETE_KEY, true).apply()

            val elapsed = System.currentTimeMillis() - startTime
            AppLogger.debug("[LayoutPreloader] Prefetch complete in ${elapsed}ms")
            // Note: SDUILayoutStore.shared.layouts.count functionality not mapped explicitly inside Logger here
        }
    }

    fun preloadScreens(keys: List<String>) {
        if (!NetworkMonitor.isConnected.value) {
            AppLogger.debug("[LayoutPreloader] Offline — skipping preload for ${keys.size} screens")
            return
        }

        AppLogger.debug("[LayoutPreloader] Preloading ${keys.size} screens: ${keys.joinToString(", ")}")

        scope.launch {
            val defs = keys.map { key ->
                async { fetchAndCache(key) }
            }
            defs.awaitAll()
            AppLogger.debug("[LayoutPreloader] Preload complete for ${keys.size} screens")
        }
    }

    fun refreshStaleInBackground() {
        scope.launch {
            if (!NetworkMonitor.isConnected.value) {
                AppLogger.debug("[LayoutPreloader] Offline — skipping stale refresh")
                return@launch
            }

            // Requires SDUILayoutStore which stores stale flags. Assuming implementation later.
            // val staleSlugs = SDUILayoutStore.staleFlags.filter { it.value }.keys
            // for (slug in staleSlugs) { fetchAndCache(slug) }
        }
    }

    internal fun registerCachedSlug(slug: String) {
        val discoveredSet = prefs.getStringSet(DISCOVERED_SLUGS_KEY, emptySet())?.toMutableSet() ?: mutableSetOf()
        if (!discoveredSet.contains(slug)) {
            discoveredSet.add(slug)
            prefs.edit().putStringSet(DISCOVERED_SLUGS_KEY, discoveredSet).apply()
        }
    }

    private suspend fun fetchAndCache(slug: String) {
        if (!NetworkMonitor.isConnected.value) return

        try {
            // Requires API Service to have fetchLayout
            // val response = NetworkClient.apiService.getLayoutBySlug(slug)
            // val rawData = Gson().toJson(response.components).toByteArray()
            // val changed = SDUICacheManager.hasContentChanged(slug, rawData)
            // SDUICacheManager.saveSDUI(slug, rawData)
            
            // Register success
            registerCachedSlug(slug)
        } catch (e: Exception) {
             AppLogger.debug("[LayoutPreloader] Failed to fetch $slug: ${e.message}")
        }
    }
}
