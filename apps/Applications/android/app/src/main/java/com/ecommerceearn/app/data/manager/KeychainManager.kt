package com.ecommerceearn.app.data.manager

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.ecommerceearn.app.utils.AppLogger

object KeychainManager {
    private const val PREFS_FILE = "com.localforvocal.secure_prefs"
    private const val KEY_AUTH_TOKEN = "com.localforvocal.authToken"
    private const val KEY_REFRESH_TOKEN = "com.localforvocal.refreshToken"

    private lateinit var encryptedPrefs: SharedPreferences

    fun init(context: Context) {
        try {
            val masterKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()

            encryptedPrefs = EncryptedSharedPreferences.create(
                context,
                PREFS_FILE,
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            )
        } catch (e: Exception) {
            AppLogger.error("[KeychainManager] Initialization failed: ${e.message}")
            // Fallback (unsafe but avoids crashes if hardware keystore fails)
            encryptedPrefs = context.getSharedPreferences(PREFS_FILE, Context.MODE_PRIVATE)
        }
    }

    var authToken: String?
        get() = getString(KEY_AUTH_TOKEN)
        set(value) {
            if (value != null) {
                setString(KEY_AUTH_TOKEN, value)
            } else {
                deleteItem(KEY_AUTH_TOKEN)
            }
        }

    var refreshToken: String?
        get() = getString(KEY_REFRESH_TOKEN)
        set(value) {
            if (value != null) {
                setString(KEY_REFRESH_TOKEN, value)
            } else {
                deleteItem(KEY_REFRESH_TOKEN)
            }
        }

    fun clearAll() {
        encryptedPrefs.edit().clear().apply()
    }

    private fun setString(key: String, value: String) {
        encryptedPrefs.edit().putString(key, value).apply()
    }

    private fun getString(key: String): String? {
        return encryptedPrefs.getString(key, null)
    }

    private fun deleteItem(key: String) {
        encryptedPrefs.edit().remove(key).apply()
    }
}
