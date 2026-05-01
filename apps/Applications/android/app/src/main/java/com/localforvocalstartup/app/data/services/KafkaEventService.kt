package com.localforvocalstartup.app.data.services

import com.localforvocalstartup.app.data.model.KafkaEvent
import com.localforvocalstartup.app.utils.AppLogger
import com.localforvocalstartup.app.utils.Environment
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit

/**
 * Pure OkHttp SSE implementation — avoids requiring the okhttp-sse artifact separately.
 * Mirrors iOS KafkaEventService connection lifecycle.
 */
object KafkaEventService {
    private val gson = Gson()
    private val _eventStream = MutableSharedFlow<KafkaEvent>(extraBufferCapacity = 100)
    val eventStream: SharedFlow<KafkaEvent> = _eventStream.asSharedFlow()

    var isConnected = false
        private set

    private var token: String? = null
    private var retryCount = 0
    private const val MAX_RETRIES = 5
    private val scope = CoroutineScope(Dispatchers.IO)
    private var isRunning = false

    fun connect(authToken: String) {
        this.token = authToken
        this.retryCount = 0
        if (!isRunning) {
            isRunning = true
            scope.launch { startConnection() }
        }
    }

    fun disconnect() {
        isRunning = false
        isConnected = false
        AppLogger.info("📡 KafkaEventService disconnected")
    }

    private suspend fun startConnection() {
        val currentToken = token ?: run {
            AppLogger.error("❌ KafkaEventService: No auth token")
            return
        }

        val sseUrl = try { Environment.current.sseEndpoint } catch (e: Exception) { return }

        val client = OkHttpClient.Builder()
            .readTimeout(0, TimeUnit.MILLISECONDS)
            .retryOnConnectionFailure(true)
            .build()

        val request = Request.Builder()
            .url(sseUrl)
            .header("Authorization", "Bearer $currentToken")
            .header("Accept", "text/event-stream")
            .build()

        try {
            val response = client.newCall(request).execute()
            if (!response.isSuccessful) {
                AppLogger.error("📡 SSE failed: ${response.code}")
                handleRetry()
                return
            }
            isConnected = true
            retryCount = 0
            AppLogger.info("📡 KafkaEventService connected to SSE")

            val reader = BufferedReader(InputStreamReader(response.body?.byteStream()))
            val dataBuffer = StringBuilder()

            while (isRunning) {
                val line = reader.readLine() ?: break
                when {
                    line.startsWith("data:") -> dataBuffer.append(line.removePrefix("data:").trim())
                    line.isEmpty() && dataBuffer.isNotEmpty() -> {
                        try {
                            val event = gson.fromJson(dataBuffer.toString(), KafkaEvent::class.java)
                            _eventStream.emit(event)
                            AppLogger.debug("📡 SSE event: ${event.eventType}")
                        } catch (e: Exception) {
                            AppLogger.error("📡 Failed to decode SSE event: ${e.message}")
                        }
                        dataBuffer.clear()
                    }
                }
            }
        } catch (e: Exception) {
            isConnected = false
            AppLogger.error("📡 SSE connection error: ${e.message}")
            handleRetry()
        }
    }

    private suspend fun handleRetry() {
        if (retryCount >= MAX_RETRIES) {
            AppLogger.warning("📡 SSE max retries reached. Giving up.")
            isRunning = false
            return
        }
        retryCount++
        val delayMs = minOf(retryCount * retryCount * 2000L, 60000L)
        AppLogger.warning("📡 SSE reconnecting in ${delayMs / 1000}s (attempt $retryCount/$MAX_RETRIES)")
        delay(delayMs)
        startConnection()
    }
}
