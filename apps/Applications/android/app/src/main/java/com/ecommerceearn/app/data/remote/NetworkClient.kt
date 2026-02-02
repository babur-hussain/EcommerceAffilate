package com.ecommerceearn.app.data.remote

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object NetworkClient {
    private const val BASE_URL = "https://api.lfvs.in/api/" // LFVS Live URL
    
    var tempToken: String? = null // Temporary token for initial login/register

    private val client by lazy {
        okhttp3.OkHttpClient.Builder()
            .addInterceptor { chain ->
                val original = chain.request()
                // Use tempToken if available (during login), otherwise try AuthManager (if initialized/persisted)
                // Since AuthManager depends on Context, checking it here might be circular or tricky if lazy loaded.
                // ideally read from a generic TokenProvider. For now, rely on tempToken or manual header passing if needed.
                // Or better: AuthManager.getToken() if we move it to a non-context dependent object or init early.
                
                val token = tempToken ?: com.ecommerceearn.app.data.manager.AuthManager.getToken()
                
                val requestBuilder = original.newBuilder()
                if (token != null) {
                    requestBuilder.header("Authorization", "Bearer $token")
                }
                chain.proceed(requestBuilder.build())
            }
            .build()
    }

    val apiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
