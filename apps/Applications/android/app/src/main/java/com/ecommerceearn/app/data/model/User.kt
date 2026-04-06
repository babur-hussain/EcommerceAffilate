package com.ecommerceearn.app.data.model

data class User(
    val _id: String,
    val name: String,
    val email: String,
    val phoneNumber: String? = null,
    val phone: String? = null,
    val profileImage: String? = null,
    val membershipStatus: String? = "Basic",
    val coins: Int = 0,
    val role: String? = null,
    val bio: String? = null,
    val isActive: Boolean = true,
    val referralCode: String? = null,
    val affiliateLinks: List<AffiliateLink>? = null
)
