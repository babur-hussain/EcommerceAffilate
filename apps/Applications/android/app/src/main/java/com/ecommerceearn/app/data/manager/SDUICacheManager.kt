package com.ecommerceearn.app.data.manager

import android.content.Context
import android.util.LruCache
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.security.MessageDigest

object SDUICacheManager {
    private const val STALE_CACHE_AGE_MS = 60 * 60 * 1000L

    // Memory Cache
    private val memoryCache = object : LruCache<String, ByteArray>(30 * 1024 * 1024) {
        override fun sizeOf(key: String, value: ByteArray): Int = value.size
    }

    private var cacheDir: File? = null

    fun init(context: Context) {
        cacheDir = File(context.cacheDir, "SDUI").apply { mkdirs() }
    }

    suspend fun getCachedSDUI(key: String, userId: String? = null): CacheResult? = withContext(Dispatchers.IO) {
        // Check Memory First
        memoryCache.get(key)?.let { memData ->
            AppLogger.debug("[SDUICacheManager] Memory HIT: $key")
            val isStale = (System.currentTimeMillis() - getFileTimestamp(key, userId)) > STALE_CACHE_AGE_MS
            return@withContext CacheResult(memData, isStale)
        }

        // Check Disk Cache
        val file = getCacheFile(key, userId)
        if (file != null && file.exists()) {
            try {
                val data = file.readBytes()
                val isStale = (System.currentTimeMillis() - file.lastModified()) > STALE_CACHE_AGE_MS
                AppLogger.debug("[SDUICacheManager] Disk HIT: $key -> promoting to memory")
                memoryCache.put(key, data)
                return@withContext CacheResult(data, isStale)
            } catch (e: Exception) {
                AppLogger.error("[SDUICacheManager] Failed to read disk cache for $key")
            }
        }
        AppLogger.debug("[SDUICacheManager] MISS: $key")
        return@withContext null
    }

    suspend fun saveSDUI(key: String, jsonData: ByteArray, userId: String? = null) = withContext(Dispatchers.IO) {
        memoryCache.put(key, jsonData)
        val file = getCacheFile(key, userId)
        try {
            file?.writeBytes(jsonData)
            AppLogger.debug("[SDUICacheManager] Saved to both layers: $key")
        } catch (e: Exception) {
            AppLogger.error("[SDUICacheManager] Failed to write disk cache for $key: ${e.message}")
        }
    }

    suspend fun clearCache(key: String, userId: String? = null) = withContext(Dispatchers.IO) {
        memoryCache.remove(key)
        getCacheFile(key, userId)?.delete()
        AppLogger.debug("[SDUICacheManager] Cleared: $key")
    }

    suspend fun clearAll() = withContext(Dispatchers.IO) {
        memoryCache.evictAll()
        cacheDir?.listFiles()?.forEach { it.delete() }
    }

    suspend fun hasContentChanged(key: String, newData: ByteArray): Boolean = withContext(Dispatchers.Default) {
        val newHash = sha256(newData)
        val oldHash = memoryCache.get(key)?.let { sha256(it) } ?: ""
        return@withContext newHash != oldHash
    }

    private fun getCacheFile(slug: String, userId: String?): File? {
        if (cacheDir == null) return null
        val fileName = if (!userId.isNullOrEmpty()) "${slug}_user_$userId.cache" else "${slug}_v1.cache"
        return File(cacheDir, fileName)
    }

    private fun getFileTimestamp(slug: String, userId: String?): Long {
        return getCacheFile(slug, userId)?.lastModified() ?: 0L
    }

    private fun sha256(data: ByteArray): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hash = digest.digest(data)
        return hash.joinToString("") { "%02x".format(it) }
    }
}

data class CacheResult(val data: ByteArray, val isStale: Boolean)
