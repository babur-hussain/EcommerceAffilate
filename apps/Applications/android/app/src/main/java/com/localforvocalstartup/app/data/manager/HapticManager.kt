package com.localforvocalstartup.app.data.manager

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.os.Build

enum class HapticStyle {
    LIGHT, MEDIUM, HEAVY, SELECTION, NOTIFICATION
}

object HapticManager {
    private var vibrator: Vibrator? = null

    fun init(context: Context) {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vibratorManager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }
    }

    fun selection() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            vibrator?.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(20)
        }
    }

    fun impact(style: HapticStyle = HapticStyle.MEDIUM) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val effect = when (style) {
                HapticStyle.LIGHT -> VibrationEffect.EFFECT_TICK
                HapticStyle.MEDIUM -> VibrationEffect.EFFECT_CLICK
                HapticStyle.HEAVY -> VibrationEffect.EFFECT_HEAVY_CLICK
                else -> VibrationEffect.EFFECT_CLICK
            }
            vibrator?.vibrate(VibrationEffect.createPredefined(effect))
        } else {
            val duration = when (style) {
                HapticStyle.LIGHT -> 10L
                HapticStyle.MEDIUM -> 30L
                HapticStyle.HEAVY -> 50L
                else -> 30L
            }
            @Suppress("DEPRECATION")
            vibrator?.vibrate(duration)
        }
    }

    fun notification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            vibrator?.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_DOUBLE_CLICK))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(longArrayOf(0, 50, 50, 50), -1)
        }
    }
}
