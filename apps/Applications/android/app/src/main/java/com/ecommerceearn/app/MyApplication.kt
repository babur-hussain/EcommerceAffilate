package com.ecommerceearn.app

import android.app.Application
import com.ecommerceearn.app.data.manager.CartManager
import com.ecommerceearn.app.data.manager.AuthManager

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize CartManager with context for SharedPreferences
        CartManager.init(this)
        // Initialize AuthManager
        AuthManager.init(this)
    }
}
