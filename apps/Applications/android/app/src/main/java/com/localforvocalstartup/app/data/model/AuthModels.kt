package com.localforvocalstartup.app.data.model

data class RegisterRequest(
    val email: String,
    val name: String,
    val firebaseUid: String,
    val phone: String? = null,
    val password: String? = null // Optional for Google Auth, but backend might expect it
)

data class AuthResponse(
    val user: User?,
    val token: String? = null,
    val success: Boolean? = true,
    val message: String? = null
)
