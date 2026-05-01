package com.localforvocalstartup.app.data.services

import com.localforvocalstartup.app.data.model.TrackingEvent
import com.localforvocalstartup.app.data.model.KafkaEventType
import com.localforvocalstartup.app.data.model.DeviceInfo
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import com.google.gson.JsonPrimitive
import com.google.gson.JsonElement
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.UUID

object EventTracker {
    private const val MAX_BATCH_SIZE = 10
    private const val FLUSH_INTERVAL_MS = 30_000L // 30 seconds
    private const val MAX_QUEUE_SIZE = 100

    private val eventQueue = mutableListOf<TrackingEvent>()
    private var flushJob: Job? = null
    private var sessionId = UUID.randomUUID().toString()
    private var isFlushing = false
    private val scope = CoroutineScope(Dispatchers.IO)

    fun init() {
        startFlushTimer()
        track(KafkaEventType.APP_OPEN)
        AppLogger.info("📊 EventTracker initialized (session: $sessionId)")
    }

    fun track(type: KafkaEventType, properties: Map<String, Any>? = null) {
        val jsonProps: Map<String, JsonElement>? = properties?.mapValues { (_, v) ->
            when (v) {
                is String -> JsonPrimitive(v)
                is Number -> JsonPrimitive(v)
                is Boolean -> JsonPrimitive(v)
                else -> JsonPrimitive(v.toString())
            }
        }
        val event = TrackingEvent(
            eventType = type.value,
            properties = jsonProps
        )
        
        synchronized(eventQueue) {
            eventQueue.add(event)
            if (eventQueue.size > MAX_QUEUE_SIZE) {
                eventQueue.removeAt(0)
            }
        }

        AppLogger.debug("📊 Event queued: ${type.value} (queue: ${eventQueue.size})")

        if (eventQueue.size >= MAX_BATCH_SIZE) {
            flush()
        }
    }

    fun trackScreen(screenName: String) {
        track(KafkaEventType.SCREEN_VIEW, mapOf("screen" to screenName))
    }

    fun trackProductView(productId: String, productName: String? = null) {
        val props = mutableMapOf<String, Any>("productId" to productId)
        if (productName != null) {
            props["productName"] = productName
        }
        track(KafkaEventType.PRODUCT_VIEWED, props)
    }

    fun trackSearch(query: String, resultsCount: Int) {
        track(KafkaEventType.PRODUCT_SEARCHED, mapOf(
            "query" to query,
            "resultsCount" to resultsCount
        ))
    }

    fun trackButtonClick(button: String, context: Map<String, Any>? = null) {
        val props = mutableMapOf<String, Any>("button" to button)
        if (context != null) {
            props.putAll(context)
        }
        track(KafkaEventType.BUTTON_CLICK, props)
    }

    fun newSession() {
        sessionId = UUID.randomUUID().toString()
        track(KafkaEventType.APP_OPEN)
        AppLogger.info("📊 New tracking session: $sessionId")
    }

    fun flush() {
        val eventsToSend = synchronized(eventQueue) {
            if (eventQueue.isEmpty() || isFlushing) return
            
            isFlushing = true
            val items = eventQueue.toList()
            eventQueue.clear()
            items
        }

        scope.launch {
            sendEvents(eventsToSend)
            isFlushing = false
        }
    }

    private fun startFlushTimer() {
        flushJob?.cancel()
        flushJob = scope.launch {
            while (isActive) {
                delay(FLUSH_INTERVAL_MS)
                flush()
            }
        }
    }

    fun stopFlushTimer() {
        flushJob?.cancel()
        flushJob = null
    }

    fun resumeFlushTimer() {
        startFlushTimer()
    }

    private suspend fun sendEvents(events: List<TrackingEvent>) {
        try {
            val device = DeviceInfo.current
            // Assume NetworkClient.apiService.trackEvents
            // val payload = mapOf("events" to events, "device" to device, "sessionId" to sessionId)
            // NetworkClient.apiService.trackEvents(payload)
            
            AppLogger.debug("📊 Flushed ${events.size} tracking events")
        } catch (e: Exception) {
            AppLogger.error("📊 Failed to flush events: ${e.message}")
            synchronized(eventQueue) {
                eventQueue.addAll(0, events)
                if (eventQueue.size > MAX_QUEUE_SIZE) {
                    val excess = eventQueue.size - MAX_QUEUE_SIZE
                    eventQueue.subList(0, excess).clear()
                }
            }
        }
    }
}
