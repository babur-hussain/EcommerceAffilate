package com.localforvocalstartup.app.utils

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.LruCache
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import java.net.URL
import javax.net.ssl.HttpsURLConnection

object ImageCache {
    // 100 MB cache limit mapped from NSCache totalCostLimit
    private val maxMemory = (Runtime.getRuntime().maxMemory() / 1024).toInt()
    private val cacheSize = 100 * 1024 // 100MB in KB

    private val cache = object : LruCache<String, Bitmap>(cacheSize) {
        override fun sizeOf(key: String, bitmap: Bitmap): Int {
            return bitmap.byteCount / 1024
        }
    }

    fun get(key: String): Bitmap? {
        return cache.get(key)
    }

    fun set(key: String, bitmap: Bitmap) {
        cache.put(key, bitmap)
    }
}

class ImageLoader(private val urlString: String?) {
    private val _image = MutableStateFlow<Bitmap?>(null)
    val image: StateFlow<Bitmap?> = _image.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _hasError = MutableStateFlow(false)
    val hasError: StateFlow<Boolean> = _hasError.asStateFlow()

    private var hasLoaded = false

    suspend fun load() {
        if (hasLoaded) return
        if (urlString.isNullOrEmpty()) {
            _hasError.value = true
            return
        }

        // Check Cache
        val cachedImage = ImageCache.get(urlString)
        if (cachedImage != null) {
            _image.value = cachedImage
            hasLoaded = true
            return
        }

        _isLoading.value = true
        hasLoaded = true

        withContext(Dispatchers.IO) {
            try {
                val url = URL(urlString)
                val connection = url.openConnection() as HttpsURLConnection
                connection.connectTimeout = 15000
                connection.readTimeout = 15000

                if (connection.responseCode != 200) {
                    throw Exception("Bad Server Response: ${connection.responseCode}")
                }

                val inputStream = connection.inputStream
                val bitmap = BitmapFactory.decodeStream(inputStream)
                
                if (bitmap != null) {
                    ImageCache.set(urlString, bitmap)
                    _image.value = bitmap
                    AppLogger.debug("✅ Image loaded successfully: $urlString")
                } else {
                    throw Exception("Cannot Decode Content Data")
                }
            } catch (e: Exception) {
                _hasError.value = true
                AppLogger.error("Image load error: ${e.message} for URL: $urlString")
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun cancel() {
        // iOS version deliberately avoids cancellation to prevent UI jank loop
    }
}
