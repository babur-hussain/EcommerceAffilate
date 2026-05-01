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
        return try {
            val networkResp = NetworkClient.apiService.createPaymentOrder(CreatePaymentOrderRequest(orderId = orderId))
            RazorpayOrderResponse(
                paymentOrderId = networkResp.id,
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
                VerifyPaymentRequest(
                    razorpay_order_id = razorpayOrderId,
                    razorpay_payment_id = razorpayPaymentId,
                    razorpay_signature = razorpaySignature
                )
            )
            response.success
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
            // amount is already in paise (converted by caller: totalAmount * 100)
            options.put("amount", amount.toString()) 
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
