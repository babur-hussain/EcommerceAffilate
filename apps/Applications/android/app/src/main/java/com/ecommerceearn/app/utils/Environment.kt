package com.ecommerceearn.app.utils

enum class AppEnvironment {
    Development,
    Staging,
    Production;

    companion object {
        val current: AppEnvironment
            // Default to Development for debug builds; override with BuildConfig when enabled
            get() = Development
    }

    val apiBaseURL: String
        get() = when (this) {
            Development -> "https://api.lfvs.in/api"
            Staging -> "https://staging.lfvs.in/api"
            Production -> "https://api.lfvs.in/api"
        }

    val imageHost: String
        get() = when (this) {
            Development -> "https://api.lfvs.in"
            Staging -> "https://staging.lfvs.in"
            Production -> "https://api.lfvs.in"
        }

    val isDebugLoggingEnabled: Boolean
        get() = when (this) {
            Development, Staging -> true
            Production -> false
        }

    val sseEndpoint: String
        get() = when (this) {
            Development -> "https://api.lfvs.in/api/sse/events"
            Staging -> "https://staging.lfvs.in/api/sse/events"
            Production -> "https://api.lfvs.in/api/sse/events"
        }
}

object Environment {
    val current: AppEnvironment = AppEnvironment.current
}
