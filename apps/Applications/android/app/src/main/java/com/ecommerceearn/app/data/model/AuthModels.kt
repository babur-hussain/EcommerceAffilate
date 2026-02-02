package com.ecommerceearn.app.data.model

data class RegisterRequest(
    val email: String,
    val name: String,
    val firebaseUid: String,
    val password: String? = null // Optional for Google Auth, but backend might expect it
)

data class AuthResponse(
    val user: User,
    val token: String? = null
)
