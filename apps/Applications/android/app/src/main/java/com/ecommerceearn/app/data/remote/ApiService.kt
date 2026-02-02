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
    suspend fun getProducts(@Query("limit") limit: Int): List<Product>

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
}
