package com.ecommerceearn.app.data.model

import com.google.gson.annotations.SerializedName

data class Product(
    @SerializedName(value = "_id", alternate = ["id"]) val id: String,
    val name: String? = null,
    val title: String? = null,
    val price: Double,
    @SerializedName("images")
    val rawImages: List<String>? = emptyList(),
    val image: String? = null,
    val primaryImage: String? = null,
    val category: String? = "General",
    val rating: Double? = null,
    val reviewCount: Int? = null,
    val stock: Int? = null,
    val mrp: Double? = null,
    val discountPercentage: Int? = null,
    val subtitle: String? = null,
    val description: String? = null,
    val shortDescription: String? = null,
    val saleEndDate: String? = null,
    val protectPromiseFee: Double? = null,
    val sellerName: String? = null,
    val offers: List<ProductOffer>? = null,
    val trustBadges: List<TrustBadge>? = null,
    val lastChanceOffers: List<LastChanceOffer>? = null,
    val highlights: List<String>? = null,
    val shippingCharges: Double? = null,
    val influencerCommission: Double? = null
) {
    val displayName: String
        get() = name ?: title ?: "Unknown Product"

    val images: List<String>
        get() = rawImages ?: listOfNotNull(image, primaryImage)
}

data class LastChanceOffer(
    val id: String? = null,
    @com.google.gson.annotations.SerializedName("_id")
    val _id: String? = null,
    val title: String? = null,
    val description: String? = null,
    val discount: Double? = null,
    val offerPrice: Double = 0.0,
    val originalPrice: Double? = null,
    val image: String? = null
) {
    fun tempId(index: Int): String = _id ?: id ?: "offer_${hashCode()}_$index"
}
