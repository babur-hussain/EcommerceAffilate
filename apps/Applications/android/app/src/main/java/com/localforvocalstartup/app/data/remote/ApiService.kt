package com.localforvocalstartup.app.data.remote

import com.localforvocalstartup.app.data.model.AdvancedLayoutResponse
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.model.Category
import com.localforvocalstartup.app.data.model.Cart
import com.localforvocalstartup.app.data.model.AccountLayout
import com.localforvocalstartup.app.data.model.AddToCartRequest
import com.localforvocalstartup.app.data.model.RemoveFromCartRequest
import com.localforvocalstartup.app.data.model.RegisterRequest
import com.localforvocalstartup.app.data.model.AuthResponse
import com.localforvocalstartup.app.data.model.UpdateCartRequest
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.DELETE
import com.localforvocalstartup.app.data.model.ServiceCategoryModel
import com.localforvocalstartup.app.data.model.ServiceSubCategoryModel
import com.localforvocalstartup.app.data.model.ServiceProviderListResponse
import com.localforvocalstartup.app.data.model.ServiceProviderModel
import com.localforvocalstartup.app.data.model.ServiceReviewListResponse
import com.localforvocalstartup.app.data.model.ServiceReviewModel

data class CreatePaymentOrderRequest(val provider: String = "RAZORPAY")
data class NetworkRazorpayOrderResponse(val paymentOrderId: String, val amount: Int, val currency: String)
data class VerifyPaymentRequest(val razorpay_order_id: String, val razorpay_payment_id: String, val razorpay_signature: String)
data class VerifyPaymentResponse(val status: String, val message: String?)
data class UpdateProfileRequest(val name: String, val phone: String?, val bio: String?, val profileImage: String? = null)

data class SaveAddressRequest(
    val name: String,
    val phone: String,
    val addressLine1: String,
    val addressLine2: String?,
    val city: String,
    val state: String,
    val pincode: String,
    val country: String = "India",
    val isDefault: Boolean = false
)

data class SetDefaultAddressResponse(val _id: String, val isDefault: Boolean)
data class CreatorApplicationRequest(
    val fullName: String,
    val email: String,
    val phone: String,
    val socialPlatform: String,
    val socialHandle: String,
    val audienceSize: String,
    val niche: String,
    val bio: String
)

data class AffiliateLinkRequest(val productId: String, val productName: String)
data class AffiliateLinkResponse(
    val success: Boolean,
    val link: String,
    val message: String?,
    val isNew: Boolean?
)

data class WishlistResponse(
    val _id: String,
    val userId: String,
    val productIds: List<Product>
)
data class WishlistToggleRequest(val productId: String)

interface ApiService {
    @GET("advanced-layout/{slug}")
    suspend fun getLayoutBySlug(@Path("slug") slug: String): AdvancedLayoutResponse

    @GET("me/account-layout")
    suspend fun getAccountLayout(): AccountLayout

    @POST("auth/register")
    suspend fun registerUser(@Body body: RegisterRequest): AuthResponse

    @GET("me")
    suspend fun getMe(): AuthResponse

    @PUT("me")
    suspend fun updateProfile(@Body body: UpdateProfileRequest): AuthResponse

    @POST("creators/apply")
    suspend fun applyCreator(@Body body: CreatorApplicationRequest)

    @GET("categories")
    suspend fun getCategories(): List<Category>

    @GET("categories/{id}")
    suspend fun getCategory(@Path("id") id: String): com.google.gson.JsonObject

    @GET("categories/{id}/subcategories")
    suspend fun getSubCategories(@Path("id") parentId: String): List<Category>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: String): Product

    @GET("products")
    suspend fun getProductsRaw(
        @Query("limit") limit: Int,
        @Query("category") categoryId: String? = null,
        @Query("subCategory") subCategoryId: String? = null
    ): ProductListResponse

    // Order Endpoints
    @GET("orders/mine")
    suspend fun getOrders(): List<com.localforvocalstartup.app.data.model.Order>

    @POST("orders")
    suspend fun createOrder(@Body body: com.localforvocalstartup.app.data.services.OrderPayload): com.localforvocalstartup.app.data.services.OrderResponse

    // Payment Endpoints
    @POST("orders/{id}/pay")
    suspend fun createPaymentOrder(@Path("id") orderId: String, @Body request: CreatePaymentOrderRequest): NetworkRazorpayOrderResponse

    @POST("orders/{id}/verify")
    suspend fun verifyPayment(@Path("id") orderId: String, @Body request: VerifyPaymentRequest): VerifyPaymentResponse

    // Address Endpoints
    @GET("addresses")
    suspend fun getAddresses(): List<com.localforvocalstartup.app.data.model.Address>

    @POST("addresses")
    suspend fun saveAddress(@Body body: SaveAddressRequest): com.localforvocalstartup.app.data.model.Address

    @DELETE("addresses/{id}")
    suspend fun deleteAddress(@Path("id") id: String): retrofit2.Response<Unit>

    @POST("addresses/{id}/default")
    suspend fun setDefaultAddress(@Path("id") id: String): com.localforvocalstartup.app.data.model.Address

    // Cart Endpoints
    @GET("cart")
    suspend fun getCart(): Cart

    @POST("cart/add")
    suspend fun addToCart(@Body body: AddToCartRequest): Cart

    @POST("cart/remove")
    suspend fun removeFromCart(@Body body: RemoveFromCartRequest): Cart

    @POST("cart/update")
    suspend fun updateQuantity(@Body body: UpdateCartRequest): Cart

    @POST("cart/clear")
    suspend fun clearCart(): Cart

    // Grocery Specific
    @GET("products/public/grocery")
    suspend fun getGroceryProductsRaw(@Query("limit") limit: Int): ProductListResponse

    @GET("products/public/grocery")
    suspend fun getProductsBySubCategoryIdsRaw(
        @Query("subCategory") subCategoryIds: String,
        @Query("limit") limit: Int
    ): ProductListResponse

    // Search Endpoints
    @GET("search/global")
    suspend fun fetchGlobalSearch(@Query("q") query: String): com.localforvocalstartup.app.data.model.GlobalSearchResponse

    @GET("search/grocery")
    suspend fun fetchGrocerySearch(@Query("q") query: String): com.localforvocalstartup.app.data.model.GlobalSearchResponse

    @GET("search/trending")
    suspend fun fetchTrendingTerms(): List<String>

    // Service Marketplace APIs
    @GET("service-categories")
    suspend fun getServiceCategories(
        @Query("isActive") isActive: Boolean = true
    ): List<ServiceCategoryModel>

    @GET("service-subcategories/by-category/{categoryId}")
    suspend fun getServiceSubCategories(
        @Path("categoryId") categoryId: String
    ): List<ServiceSubCategoryModel>

    @GET("service-providers")
    suspend fun getServiceProviders(
        @Query("serviceSubCategoryId") subCategoryId: String,
        @Query("status") status: String = "APPROVED",
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): ServiceProviderListResponse

    @GET("service-providers/{id}")
    suspend fun getServiceProviderDetail(
        @Path("id") id: String
    ): ServiceProviderModel

    @GET("service-reviews/by-provider/{providerId}")
    suspend fun getServiceReviews(
        @Path("providerId") providerId: String
    ): ServiceReviewListResponse

    // Stories Endpoints
    @GET("stories/mine")
    suspend fun fetchMyStories(): List<com.localforvocalstartup.app.data.model.Story>

    @GET("stories/upload-url")
    suspend fun getPresignedUrl(
        @Query("fileName") fileName: String,
        @Query("contentType") contentType: String
    ): com.localforvocalstartup.app.data.model.PresignedUrlAPIResponse

    @POST("stories")
    suspend fun createStoryRecord(@Body request: com.localforvocalstartup.app.data.model.CreateStoryRequest): retrofit2.Response<Unit>

    // Influencer / Affiliate
    @POST("influencer/affiliate-link")
    suspend fun generateAffiliateLink(@Body request: AffiliateLinkRequest): AffiliateLinkResponse

    // Wishlist
    @GET("wishlist")
    suspend fun getWishlist(): WishlistResponse

    @POST("wishlist/add")
    suspend fun addToWishlist(@Body body: WishlistToggleRequest): WishlistResponse

    @POST("wishlist/remove")
    suspend fun removeFromWishlist(@Body body: WishlistToggleRequest): WishlistResponse

    // Notify Me - Back in Stock
    @POST("notify-me")
    suspend fun notifyMeWhenInStock(@Body body: Map<String, String>): retrofit2.Response<Unit>

    // Reviews
    @POST("reviews")
    suspend fun submitReview(@Body body: Map<String, Any>): retrofit2.Response<Unit>
}

data class ProductListResponse(val products: List<Product>)

suspend fun ApiService.getProducts(limit: Int, categoryId: String? = null, subCategoryId: String? = null): List<Product> = 
    getProductsRaw(limit, categoryId, subCategoryId).products
suspend fun ApiService.getGroceryProducts(limit: Int): List<Product> = getGroceryProductsRaw(limit).products
suspend fun ApiService.getProductsBySubCategoryIds(ids: List<String>, limit: Int): List<Product> = 
    getProductsBySubCategoryIdsRaw(ids.joinToString(","), limit).products
