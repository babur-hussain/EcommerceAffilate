package com.localforvocalstartup.app.data.remote

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import okhttp3.Dns
import java.net.InetAddress
import java.net.UnknownHostException

object NetworkClient {
    private const val BASE_URL = "https://api.lfvs.in/api/" // LFVS Live URL
    
    var tempToken: String? = null // Temporary token for initial login/register

    private val customDns = object : Dns {
        override fun lookup(hostname: String): List<InetAddress> {
            if (hostname == "api.lfvs.in") {
                try {
                    // Try exact EC2 IP to bypass emulator DNS caching bug
                    return listOf(InetAddress.getByName("3.208.16.32"))
                } catch (e: Exception) {
                    // fallback
                }
            }
            return Dns.SYSTEM.lookup(hostname)
        }
    }

    private val client by lazy {
        okhttp3.OkHttpClient.Builder()
            .dns(customDns)
            .connectTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
            .addInterceptor { chain ->
                val original = chain.request()
                val token = tempToken ?: com.localforvocalstartup.app.data.manager.AuthManager.getToken()
                
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
