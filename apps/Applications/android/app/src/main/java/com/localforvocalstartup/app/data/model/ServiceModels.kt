package com.localforvocalstartup.app.data.model

import com.google.gson.annotations.SerializedName

data class ServiceCategoryModel(
    @SerializedName("_id") val id: String,
    val name: String,
    val slug: String,
    val icon: String,
    val description: String,
    val isActive: Boolean
)

data class ServiceSubCategoryModel(
    @SerializedName("_id") val id: String,
    val categoryId: String,
    val name: String,
    val slug: String,
    val description: String,
    val icon: String,
    val isActive: Boolean
)

data class ServiceProviderModel(
    @SerializedName("_id") val id: String,
    val userId: ServiceProviderUser?,
    val serviceCategoryId: ServiceCategoryRef?,
    val serviceSubCategoryId: ServiceSubCategoryRef?,
    val businessName: String,
    val description: String,
    val experienceYears: Int,
    val rating: Double,
    val reviewCount: Int,
    val location: ServiceLocation?,
    val serviceArea: List<String>,
    val pricingModel: String,
    val startingPrice: Double,
    val currency: String,
    val images: List<String>,
    val isVerified: Boolean,
    val status: String
) {
    data class ServiceProviderUser(
        @SerializedName("_id") val id: String,
        val name: String?,
        val email: String?,
        val profileImage: String?
    )

    data class ServiceCategoryRef(
        @SerializedName("_id") val id: String,
        val name: String?,
        val slug: String?,
        val icon: String?
    )

    data class ServiceSubCategoryRef(
        @SerializedName("_id") val id: String,
        val name: String?,
        val slug: String?
    )

    data class ServiceLocation(
        val type: String?,
        val coordinates: List<Double>?,
        val address: String?
    )
}

data class ServiceProviderListResponse(
    val data: List<ServiceProviderModel>,
    val meta: PaginationMeta
) {
    data class PaginationMeta(
        val total: Int,
        val page: Int,
        val limit: Int,
        val pages: Int
    )
}

data class ServiceReviewModel(
    @SerializedName("_id") val id: String,
    val serviceProviderId: String,
    val bookingId: String,
    val customerId: ReviewCustomer?,
    val rating: Int,
    val review: String,
    val createdAt: String?
) {
    data class ReviewCustomer(
        @SerializedName("_id") val id: String,
        val name: String?,
        val profileImage: String?
    )
}

data class ServiceReviewListResponse(
    val data: List<ServiceReviewModel>,
    val meta: ServiceProviderListResponse.PaginationMeta
)
