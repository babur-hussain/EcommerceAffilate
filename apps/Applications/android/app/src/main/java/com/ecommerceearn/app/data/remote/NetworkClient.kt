package com.ecommerceearn.app.data.remote

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object NetworkClient {
    private const val BASE_URL = "https://api.lfvs.in/api/" // LFVS Live URL
    
    var tempToken: String? = null // Temporary token for initial login/register

    private val client by lazy {
        okhttp3.OkHttpClient.Builder()
            .connectTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .addInterceptor { chain ->
                val original = chain.request()
                val token = tempToken ?: com.ecommerceearn.app.data.manager.AuthManager.getToken()
                
                val requestBuilder = original.newBuilder()
                if (token != null) {
                    requestBuilder.header("Authorization", "Bearer $token")
                }
                android.util.Log.d("NetworkClient", "→ ${original.method} ${original.url}")
                val response = chain.proceed(requestBuilder.build())
                android.util.Log.d("NetworkClient", "← ${response.code} ${original.url}")
                response
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
