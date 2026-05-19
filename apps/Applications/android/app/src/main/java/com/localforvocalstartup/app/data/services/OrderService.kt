package com.localforvocalstartup.app.data.services

import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.utils.AppLogger
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class OrderItem(
    val productId: String,
    val quantity: Int,
    val price: Double,
    val name: String?,
    val image: String?
)

data class LastChanceOfferPayload(
    val id: String,
    val name: String,
    val price: Double
)

data class AddressPayload(
    val name: String,
    val phone: String,
    val addressLine1: String,
    val addressLine2: String?,
    val city: String,
    val state: String,
    val pincode: String,
    val country: String
)

data class OrderPayload(
    val items: List<Map<String, Any>>,
    val address: AddressPayload?,
    val addressId: String?,
    val paymentMethod: String,
    val donation: Double?,
    val protectPromiseFee: Double?,
    val shippingFee: Double?,
    val lastChanceOffers: List<LastChanceOfferPayload>?
)

data class OrderResponse(
    val _id: String,
    val orderNumber: String?,
    val status: String,
    val totalAmount: Double
)

object OrderService {
    @Suppress("UNUSED_PARAMETER")
    suspend fun createOrder(
        items: List<OrderItem>,
        address: AddressPayload? = null,
        addressId: String? = null,
        paymentMethod: String,
        authToken: String,   // kept for API compatibility
        donation: Double? = null,
        protectPromiseFee: Double? = null,
        shippingFee: Double? = null,
        lastChanceOffers: List<LastChanceOfferPayload>? = null
    ): OrderResponse = withContext(Dispatchers.IO) {
        // Backend expects items as { productId, quantity } only
        val itemsPayload: List<Map<String, Any>> = items.map { item ->
            mapOf(
                "productId" to item.productId,
                "quantity" to item.quantity
            )
        }

        // Only send addressId if it looks like a real MongoDB ObjectId (24 hex chars)
        val validAddressId = if (addressId != null && addressId.length == 24 && addressId.all { it.isLetterOrDigit() } && addressId != "current-location") {
            addressId
        } else null

        val payload = OrderPayload(
            items = itemsPayload,
            address = address,    // always send inline address as fallback
            addressId = validAddressId,
            paymentMethod = paymentMethod,
            donation = donation,
            protectPromiseFee = protectPromiseFee,
            shippingFee = shippingFee,
            lastChanceOffers = lastChanceOffers
        )
        NetworkClient.apiService.createOrder(payload)
    }

    @Suppress("UNUSED_PARAMETER")
    suspend fun updateOrderStatus(orderId: String, status: String, authToken: String) {
        // Reserved for future use
    }
}
