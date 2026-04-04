package com.ecommerceearn.app.data.remote

import com.ecommerceearn.app.data.model.AdvancedLayoutResponse
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.Category
import com.ecommerceearn.app.data.model.Cart
import com.ecommerceearn.app.data.model.AccountLayout
import com.ecommerceearn.app.data.model.AddToCartRequest
import com.ecommerceearn.app.data.model.RemoveFromCartRequest
import com.ecommerceearn.app.data.model.RegisterRequest
import com.ecommerceearn.app.data.model.AuthResponse
import com.ecommerceearn.app.data.model.UpdateCartRequest
import retrofit2.http.Body
import retrofit2.http.POST
import com.ecommerceearn.app.data.model.ServiceCategoryModel
import com.ecommerceearn.app.data.model.ServiceSubCategoryModel
import com.ecommerceearn.app.data.model.ServiceProviderListResponse
import com.ecommerceearn.app.data.model.ServiceProviderModel
import com.ecommerceearn.app.data.model.ServiceReviewListResponse
import com.ecommerceearn.app.data.model.ServiceReviewModel

interface ApiService {
    @GET("advanced-layout/{slug}")
    suspend fun getLayoutBySlug(@Path("slug") slug: String): AdvancedLayoutResponse

    @GET("me/account-layout")
    suspend fun getAccountLayout(): AccountLayout

    @POST("auth/register")
    suspend fun registerUser(@Body body: RegisterRequest): AuthResponse

    @GET("me")
    suspend fun getMe(): AuthResponse

    @GET("categories")
    suspend fun getCategories(): List<Category>

    @GET("categories/{id}/subcategories")
    suspend fun getSubCategories(@Path("id") parentId: String): List<Category>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: String): Product

    @GET("products")
    suspend fun getProductsRaw(@Query("limit") limit: Int): ProductListResponse

    // Order Endpoints
    @GET("orders/mine")
    suspend fun getOrders(): List<com.ecommerceearn.app.data.model.Order>

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
    suspend fun fetchGlobalSearch(@Query("q") query: String): com.ecommerceearn.app.data.model.GlobalSearchResponse

    @GET("search/grocery")
    suspend fun fetchGrocerySearch(@Query("q") query: String): com.ecommerceearn.app.data.model.GlobalSearchResponse

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
}

data class ProductListResponse(val products: List<Product>)

suspend fun ApiService.getProducts(limit: Int): List<Product> = getProductsRaw(limit).products
suspend fun ApiService.getGroceryProducts(limit: Int): List<Product> = getGroceryProductsRaw(limit).products
suspend fun ApiService.getProductsBySubCategoryIds(ids: List<String>, limit: Int): List<Product> = 
    getProductsBySubCategoryIdsRaw(ids.joinToString(","), limit).products
