package com.ecommerceearn.app.data.manager

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.LruCache
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import java.io.File
import java.io.FileOutputStream
import java.net.URL
import java.security.MessageDigest
import java.util.concurrent.ConcurrentHashMap
import java.net.HttpURLConnection

object ImageDiskCache {
    private const val MAX_CACHE_SIZE = 500L * 1024L * 1024L // 500 MB
    private lateinit var cacheDir: File

    private val fileIndex = ConcurrentHashMap.newKeySet<String>()
    private var currentCacheSize: Long = 0L
    private val hashCache = ConcurrentHashMap<String, String>()
    private val accessTimes = ConcurrentHashMap<String, Long>()

    // Memory cache limits size in KB
    private val memoryCache = object : LruCache<String, Bitmap>( (Runtime.getRuntime().maxMemory() / 1024 / 8).toInt() ) {
        override fun sizeOf(key: String, bitmap: Bitmap): Int {
            return bitmap.byteCount / 1024
        }
    }

    fun init(context: Context) {
        cacheDir = File(context.cacheDir, "Images").apply { mkdirs() }

        CoroutineScope(Dispatchers.IO).launch {
            buildIndex()
        }
    }

    suspend fun loadImage(urlString: String): Bitmap? = withContext(Dispatchers.IO) {
        val hash = cachedHash(urlString)

        memoryCache.get(hash)?.let { memImage ->
            accessTimes[hash] = System.currentTimeMillis()
            return@withContext memImage
        }

        if (!fileIndex.contains(hash)) return@withContext null

        val filePath = File(cacheDir, hash)
        if (filePath.exists()) {
            try {
                val bitmap = BitmapFactory.decodeFile(filePath.absolutePath)
                if (bitmap != null) {
                    memoryCache.put(hash, bitmap)
                    accessTimes[hash] = System.currentTimeMillis()
                    return@withContext bitmap
                } else {
                    fileIndex.remove(hash)
                }
            } catch (e: Exception) {
                fileIndex.remove(hash)
            }
        }
        return@withContext null
    }

    suspend fun saveImage(bitmap: Bitmap, urlString: String) = withContext(Dispatchers.IO) {
        val hash = cachedHash(urlString)
        memoryCache.put(hash, bitmap)

        val filePath = File(cacheDir, hash)
        try {
            FileOutputStream(filePath).use { out ->
                // Compress logic (approximating iOS .jpegData(quality: 0.85))
                bitmap.compress(Bitmap.CompressFormat.JPEG, 85, out)
            }
            
            val size = filePath.length()
            fileIndex.add(hash)
            accessTimes[hash] = System.currentTimeMillis()
            currentCacheSize += size

            if (currentCacheSize > MAX_CACHE_SIZE) {
                evictIfNeeded()
            }
        } catch (e: Exception) {
            AppLogger.error("[ImageDiskCache] Failed to save image: ${e.message}")
        }
    }

    suspend fun saveData(data: ByteArray, urlString: String) = withContext(Dispatchers.IO) {
        val hash = cachedHash(urlString)
        val filePath = File(cacheDir, hash)

        try {
            filePath.writeBytes(data)
            val size = data.size.toLong()
            fileIndex.add(hash)
            accessTimes[hash] = System.currentTimeMillis()
            currentCacheSize += size

            val bitmap = BitmapFactory.decodeByteArray(data, 0, data.size)
            if (bitmap != null) {
                memoryCache.put(hash, bitmap)
            }

            if (currentCacheSize > MAX_CACHE_SIZE) {
                evictIfNeeded()
            }
        } catch (e: Exception) {
            AppLogger.error("[ImageDiskCache] Failed to save raw data: ${e.message}")
        }
    }

    fun hasImage(urlString: String): Boolean {
        return fileIndex.contains(cachedHash(urlString))
    }

    suspend fun prefetch(urls: List<String>) = withContext(Dispatchers.IO) {
        // Implement concurrent limited downloads via coroutines
        val defs = urls.filter { !hasImage(it) }.map { urlString ->
            async {
                try {
                    val url = URL(urlString)
                    val connection = url.openConnection() as HttpURLConnection
                    connection.connectTimeout = 30000
                    connection.readTimeout = 30000
                    
                    if (connection.responseCode == 200) {
                        val bytes = connection.inputStream.readBytes()
                        saveData(bytes, urlString)
                    }
                } catch (e: Exception) {
                    // Silent fail for prefetch
                }
            }
        }
        defs.awaitAll()
    }

    fun clearAll() {
        cacheDir.listFiles()?.forEach { it.delete() }
        memoryCache.evictAll()
        fileIndex.clear()
        currentCacheSize = 0L
        accessTimes.clear()
    }

    private fun buildIndex() {
        val files = cacheDir.listFiles() ?: return
        currentCacheSize = 0L
        for (file in files) {
            fileIndex.add(file.name)
            currentCacheSize += file.length()
        }
        AppLogger.debug("[ImageDiskCache] Indexed ${fileIndex.size} cached images (${currentCacheSize / 1024 / 1024}MB)")
    }

    private fun evictIfNeeded() {
        if (currentCacheSize <= MAX_CACHE_SIZE) return

        val sortedHashes = accessTimes.toList()
            .sortedBy { (_, time) -> time }
            .map { it.first }

        val targetSize = MAX_CACHE_SIZE / 2

        for (hash in sortedHashes) {
            if (currentCacheSize <= targetSize) break
            val filePath = File(cacheDir, hash)
            if (filePath.exists()) {
                val size = filePath.length()
                if (filePath.delete()) {
                    fileIndex.remove(hash)
                    accessTimes.remove(hash)
                    currentCacheSize -= size
                }
            }
        }
        AppLogger.debug("[ImageDiskCache] Evicted to ${currentCacheSize / 1024 / 1024}MB")
    }

    private fun cachedHash(string: String): String {
        return hashCache.getOrPut(string) {
            val digest = MessageDigest.getInstance("SHA-256")
            val hash = digest.digest(string.toByteArray())
            hash.joinToString("") { "%02x".format(it) }
        }
    }
}
