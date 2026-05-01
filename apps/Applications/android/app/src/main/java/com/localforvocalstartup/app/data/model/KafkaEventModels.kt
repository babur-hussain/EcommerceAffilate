package com.localforvocalstartup.app.data.model

import com.google.gson.JsonElement
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

data class KafkaEvent(
    val id: String = UUID.randomUUID().toString(),
    val eventType: String,
    val payload: Map<String, JsonElement>,
    val timestamp: String? = null
)

enum class KafkaEventType(val value: String) {
    ORDER_CREATED("order.created"),
    ORDER_STATUS_CHANGED("order.status-changed"),
    ORDER_CANCELLED("order.cancelled"),
    PAYMENT_SUCCESS("payment.success"),
    PAYMENT_FAILED("payment.failed"),
    CART_UPDATED("cart.updated"),
    CART_ABANDONED("cart.abandoned"),
    USER_REGISTERED("user.registered"),
    USER_LOGIN("user.login"),
    PRODUCT_VIEWED("product.viewed"),
    PRODUCT_CLICKED("product.clicked"),
    PRODUCT_SEARCHED("product.searched"),
    NOTIFICATION_SENT("notification.sent"),
    INFLUENCER_CLICK("influencer.click"),
    INFLUENCER_CONVERSION("influencer.conversion"),
    SCREEN_VIEW("app.screen_view"),
    BUTTON_CLICK("app.button_click"),
    APP_OPEN("app.open"),
    APP_BACKGROUND("app.background")
}

data class TrackingEvent(
    val eventType: String,
    val properties: Map<String, JsonElement>? = null,
    val timestamp: String = isoFormatter.format(Date())
) {
    companion object {
        val isoFormatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
    }
}

data class DeviceInfo(
    val platform: String,
    val version: String,
    val os: String
) {
    companion object {
        val current: DeviceInfo
            get() = DeviceInfo(
                platform = "Android",
                version = "1.0", // Fetch via Context ideally
                os = "Android " + android.os.Build.VERSION.RELEASE
            )
    }
}
