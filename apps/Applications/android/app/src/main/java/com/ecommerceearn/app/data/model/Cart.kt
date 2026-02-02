package com.ecommerceearn.app.data.model

data class Cart(
    val _id: String? = null,
    val items: List<CartItem> = emptyList(),
    val userId: String? = null,
    val totalAmount: Double = 0.0
)

data class CartItem(
    val productId: Product, // In Android we assume full product object for now to simplify
    var quantity: Int
)

data class AddToCartRequest(
    val productId: String,
    val quantity: Int
)

data class RemoveFromCartRequest(
    val productId: String
)

data class UpdateCartRequest(
    val productId: String,
    val quantity: Int
)
