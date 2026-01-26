# Native Android App

This directory is reserved for the native Kotlin Android application.

## Setup Instructions

1.  Open **Android Studio**.
2.  Select **New Project**.
3.  Choose **Phone and Tablet** -> **Empty Views Activity** (or **Empty Activity** for Jetpack Compose).
4.  **Name**: `EcommerceEarn`
5.  **Package Name**: `com.ecommerceearn.app`
6.  **Save Location**: Browse to this directory (`apps/Applications/android`).
7.  **Language**: Kotlin
8.  **Build Configuration Language**: Kotlin DSL (recommended)

## Connecting to Backend

To connect to the backend running at `http://localhost:4000` (Use `http://10.0.2.2:4000` for Android Emulator to access localhost), use **Retrofit**.

Example Retrofit setup (pseudo-code):
```kotlin
interface ApiService {
    @GET("api/your-endpoint")
    suspend fun getData(): Response<Data>
}

val retrofit = Retrofit.Builder()
    .baseUrl("http://10.0.2.2:4000/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()
```
