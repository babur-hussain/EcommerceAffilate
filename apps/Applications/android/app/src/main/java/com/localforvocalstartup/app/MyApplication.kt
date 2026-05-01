package com.localforvocalstartup.app

import android.app.Application
import com.localforvocalstartup.app.data.manager.UnifiedCartCore
import com.localforvocalstartup.app.data.manager.AuthManager

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize cart core with context for SharedPreferences
        UnifiedCartCore.init(this)
        // Initialize AuthManager
        AuthManager.init(this)
    }
}
