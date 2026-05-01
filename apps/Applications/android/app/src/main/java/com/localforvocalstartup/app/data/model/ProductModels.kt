package com.localforvocalstartup.app.data.model

import com.google.gson.annotations.SerializedName

data class TrustBadge(
    val id: String? = null,
    val name: String,
    val icon: String,
    val description: String? = null
)

data class ProductOffer(
    @SerializedName("_id") val id: String? = null,
    val type: String? = null,
    val title: String,
    val description: String? = null,
    val discountAmount: Double? = null,
    val discountType: String? = null,
    val discountValue: Double? = null,
    val code: String? = null
)
