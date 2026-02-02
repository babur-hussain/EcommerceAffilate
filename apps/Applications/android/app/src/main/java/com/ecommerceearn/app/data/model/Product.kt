package com.ecommerceearn.app.data.model

import com.google.gson.annotations.SerializedName

data class Product(
    @SerializedName("_id") val id: String,
    val name: String? = null,
    val title: String? = null,
    val price: Double,
    val images: List<String>,
    val rating: Double? = null,
    val reviewCount: Int? = 0,
    val description: String? = null,
    val shortDescription: String? = null,
    val category: String? = null,
    val discountPercentage: Int? = null,
    val mrp: Double? = null,
    val stock: Int? = null,
    val subtitle: String? = null,
    val isActive: Boolean = true,
    val sellerName: String? = null,
    val highlights: List<String>? = null,
    val offers: List<ProductOffer>? = null,
    val trustBadges: List<TrustBadge>? = null,
    val shippingCharges: Double? = null,
    val protectPromiseFee: Double? = null,
    val saleEndDate: String? = null
) {
    // Helper to get display name (name or title)
    val displayName: String
        get() = name ?: title ?: "Product"
}

data class ProductOffer(
    @SerializedName("_id") val id: String? = null,
    val title: String,
    val description: String? = null,
    val code: String? = null,
    val discountType: String? = null,
    val discountValue: Double? = null
)

data class TrustBadge(
    val icon: String? = null,
    val label: String,
    val description: String? = null
)
