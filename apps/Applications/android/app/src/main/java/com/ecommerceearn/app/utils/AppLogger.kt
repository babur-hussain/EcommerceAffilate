package com.ecommerceearn.app.utils

import android.util.Log

/**
 * Central logger wrapping Android's Log — mirrors iOS AppLogger.
 */
object AppLogger {
    private const val TAG = "ECommerceEarn"

    fun debug(message: String) = Log.d(TAG, message)
    fun info(message: String) = Log.i(TAG, message)
    fun warning(message: String) = Log.w(TAG, message)
    fun error(message: String) = Log.e(TAG, message)
    fun error(message: String, throwable: Throwable) = Log.e(TAG, message, throwable)
}
