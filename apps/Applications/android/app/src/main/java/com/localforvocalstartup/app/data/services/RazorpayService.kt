package com.localforvocalstartup.app.data.services

import android.app.Activity
import com.localforvocalstartup.app.utils.AppLogger
import org.json.JSONObject
import com.razorpay.Checkout
import com.razorpay.PaymentData
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.data.remote.CreatePaymentOrderRequest
import com.localforvocalstartup.app.data.remote.VerifyPaymentRequest

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
 * This handles the full Razorpay checkout flow.
 */
object RazorpayService {
    private const val LIVE_KEY = "rzp_live_SIs9DUNl6RGng7"
    var activeListener: RazorpayResultListener? = null

    fun init(activity: Activity) {
        Checkout.preload(activity.applicationContext)
        AppLogger.debug("RazorpayService initialized (SDK stub removed)")
    }

    suspend fun createRazorpayOrder(orderId: String): RazorpayOrderResponse {
        return try {
            val networkResp = NetworkClient.apiService.createPaymentOrder(orderId, CreatePaymentOrderRequest())
            RazorpayOrderResponse(
                paymentOrderId = networkResp.paymentOrderId,
                key_id = LIVE_KEY,
                amount = networkResp.amount,
                name = null,
                description = "Payment for $orderId",
                prefill = null
            )
        } catch (e: Exception) {
            AppLogger.error("Error creating Razorpay order: ${e.message}")
            throw PaymentError.OrderCreationFailed
        }
    }

    suspend fun verifyPayment(
        _orderId: String,
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String
    ): Boolean {
        return try {
            val response = NetworkClient.apiService.verifyPayment(
                _orderId,
                VerifyPaymentRequest(
                    razorpay_order_id = razorpayOrderId,
                    razorpay_payment_id = razorpayPaymentId,
                    razorpay_signature = razorpaySignature
                )
            )
            response.status == "SUCCESS"
        } catch (e: Exception) {
            AppLogger.error("Verification failed: ${e.message}")
            false
        }
    }

    fun openRazorpayCheckout(
        activity: Activity,
        orderId: String,
        amount: Int,
        name: String?,
        description: String?,
        prefillEmail: String?,
        prefillPhone: String?,
        _prefillName: String?,
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
            options.put("order_id", orderId)
            options.put("theme.color", themeColor)
            options.put("currency", "INR")
            options.put("amount", amount.toString())
            
            // Format phone number — remove spaces (critical for UPI resolution)
            val formattedPhone = (prefillPhone ?: "8888888888").replace(" ", "")
            options.put("prefill.email", prefillEmail ?: "support@lfvs.in")
            options.put("prefill.contact", formattedPhone)

            val retryObj = JSONObject()
            retryObj.put("enabled", true)
            retryObj.put("max_count", 4)
            options.put("retry", retryObj)

            // Enable UPI Intent inside WebView — required because Razorpay SDK
            // renders checkout in a WebView and UPI Intent is disabled by default
            options.put("webview_intent", true)

            // Log the full payload for debugging
            AppLogger.info("Razorpay checkout options: ${options.toString(2)}")
            
            checkout.open(activity, options)
        } catch (e: Exception) {
            AppLogger.error("Error in starting Razorpay Checkout: ${e.message}")
            activeListener?.onPaymentError(Checkout.PAYMENT_CANCELED, "Error starting payment", null)
        }
    }
}
