package com.ecommerceearn.app.data.model

import com.google.gson.annotations.SerializedName

data class AffiliateLink(
    val id: String,
    val productId: String,
    val productName: String,
    val link: String
)
