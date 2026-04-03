package com.ecommerceearn.app.data.services

import android.app.Activity
import com.ecommerceearn.app.utils.AppLogger
import org.json.JSONObject
import com.razorpay.Checkout
import com.razorpay.PaymentData

interface RazorpayResultListener {
    fun onPaymentSuccess(razorpayPaymentID: String?, paymentData: PaymentData?)
    fun onPaymentError(code: Int, response: String?, paymentData: PaymentData?)
}

data class PaymentSuccess(
    val razorpayPaymentId: String,
    val razorpayOrderId: String,
    val razorpaySignature: String
)

sealed class PaymentError(message: String) : Exception(message) {
    object Cancelled : PaymentError("Cancelled")
    class Failed(msg: String) : PaymentError(msg)
    object OrderCreationFailed : PaymentError("Order creation failed")
    object VerificationFailed : PaymentError("Verification failed")
}

data class RazorpayOrderResponse(
    val paymentOrderId: String,
    val key_id: String,
    val amount: Int,
    val name: String?,
    val description: String?,
    val prefill: Prefill?
) {
    data class Prefill(
        val email: String?,
        val contact: String?,
        val name: String?
    )
}

/**
 * RazorpayService — Razorpay Android SDK integration.
 *
 * NOTE: To enable full Razorpay checkout, add to build.gradle.kts:
 *   implementation("com.razorpay:checkout:1.6.33")
 * and add to AndroidManifest:
 *   <meta-data android:name="com.razorpay.ApiKey" android:value="rzp_live_SIs9DUNl6RGng7"/>
 *
 * For now this is stubbed to compile without the SDK dependency.
 */
object RazorpayService {
    private const val LIVE_KEY = "rzp_live_SIs9DUNl6RGng7"
    var activeListener: RazorpayResultListener? = null

    fun init(activity: Activity) {
        Checkout.preload(activity.applicationContext)
        AppLogger.debug("RazorpayService initialized (SDK stub removed)")
    }

    suspend fun createRazorpayOrder(orderId: String): RazorpayOrderResponse {
        // Stub implementation, as backend order creation works in CheckoutViewModel via OrderService
        throw UnsupportedOperationException("Razorpay order creation not yet wired to API")
    }

    suspend fun verifyPayment(
        orderId: String,
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String
    ): Boolean {
        // Stub — wire to NetworkClient.apiService.verifyPayment(...)
        return false
    }

    fun openRazorpayCheckout(
        activity: Activity,
        orderId: String,
        amount: Int,
        name: String?,
        description: String?,
        prefillEmail: String?,
        prefillPhone: String?,
        prefillName: String?,
        themeColor: String = "#2563EB"
    ) {
        AppLogger.info("RazorpayService.openCheckout called for orderId=$orderId amount=$amount")
        val checkout = Checkout()
        checkout.setKeyID(LIVE_KEY)
        
        try {
            val options = JSONObject()
            options.put("name", name ?: "Local For Vocal")
            options.put("description", description ?: "Order Payment")
            options.put("image", "https://api.lfvs.in/static/logo.png")
            // amount in paise (already converted to * 100 in ViewModel normally or here)
            options.put("amount", (amount * 100).toString()) 
            options.put("order_id", orderId)
            
            val theme = JSONObject()
            theme.put("color", themeColor)
            options.put("theme", theme)
            
            val prefill = JSONObject()
            prefill.put("email", prefillEmail ?: "support@lfvs.in")
            prefill.put("contact", prefillPhone ?: "8888888888")
            options.put("prefill", prefill)

            checkout.open(activity, options)
        } catch (e: Exception) {
            AppLogger.error("Error in starting Razorpay Checkout: ${e.message}")
            activeListener?.onPaymentError(Checkout.PAYMENT_CANCELED, "Error starting payment", null)
        }
    }
}
