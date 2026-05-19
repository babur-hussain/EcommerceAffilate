package com.localforvocalstartup.app.data.manager

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

object NotifyMeManager {

    private const val CHANNEL_ID = "restock_notifications"
    private const val CHANNEL_NAME = "Back in Stock Alerts"

    private val scope = CoroutineScope(Dispatchers.Main)

    // Set of productIds the user has asked to be notified about
    private val _notifyMeIds = MutableStateFlow<Set<String>>(emptySet())
    val notifyMeIds: StateFlow<Set<String>> = _notifyMeIds.asStateFlow()

    fun isRegistered(productId: String): Boolean = _notifyMeIds.value.contains(productId)

    /**
     * Register the user to be notified when [productId] is back in stock.
     * - Saves to backend (best-effort)
     * - Also adds to wishlist so the product appears in the user's profile
     * - Shows a local confirmation notification immediately
     */
    fun register(context: Context, productId: String, productName: String) {
        if (_notifyMeIds.value.contains(productId)) return

        _notifyMeIds.value = _notifyMeIds.value + productId

        scope.launch(Dispatchers.IO) {
            // 1. Add to wishlist (saves to profile)
            if (AuthManager.isLoggedIn()) {
                try {
                    WishlistManager.addToWishlist(productId)
                } catch (e: Exception) {
                    AppLogger.debug("NotifyMe: wishlist add failed ${e.message}")
                }
            }

            // 2. Register notify-me with backend
            try {
                NetworkClient.apiService.notifyMeWhenInStock(
                    mapOf("productId" to productId)
                )
            } catch (e: Exception) {
                AppLogger.debug("NotifyMe: backend register failed ${e.message}")
            }
        }

        // 3. Show immediate confirmation notification
        showConfirmationNotification(context, productId, productName)
    }

    fun unregister(productId: String) {
        _notifyMeIds.value = _notifyMeIds.value - productId
    }

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Alerts when out-of-stock products are available again"
            }
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.createNotificationChannel(channel)
        }
    }

    private fun showConfirmationNotification(context: Context, productId: String, productName: String) {
        createNotificationChannel(context)

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("We'll let you know! 🔔")
            .setContentText("\"$productName\" — we'll notify you the moment it's back in stock.")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(productId.hashCode(), notification)
        } catch (e: SecurityException) {
            AppLogger.debug("NotifyMe: notification permission not granted")
        }
    }

    /** Call this to simulate a back-in-stock push (for testing) */
    fun simulateRestockNotification(context: Context, productName: String) {
        createNotificationChannel(context)
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("🎉 Back in Stock!")
            .setContentText("\"$productName\" is available again. Grab it before it runs out!")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(System.currentTimeMillis().toInt(), notification)
        } catch (e: SecurityException) {
            AppLogger.debug("NotifyMe: notification permission not granted")
        }
    }
}
