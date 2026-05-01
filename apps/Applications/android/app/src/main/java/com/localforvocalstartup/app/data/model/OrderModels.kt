package com.localforvocalstartup.app.data.model

import com.google.gson.annotations.SerializedName

data class Order(
    @SerializedName("_id") val id: String,
    val status: String,
    val totalAmount: Double,
    val payableAmount: Double?,
    val items: List<OrderItem>,
    val createdAt: String?,
    val shippingAddress: ShippingAddress?
)

data class OrderItem(
    val productId: OrderProduct,
    val quantity: Int,
    val price: Double
)

data class OrderProduct(
    @SerializedName("_id") val id: String,
    val title: String?,
    val images: List<String>?
)

data class ShippingAddress(
    val name: String?,
    val city: String?,
    val state: String?,
    val addressLine1: String?,
    val pincode: String?
)
