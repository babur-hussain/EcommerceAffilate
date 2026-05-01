package com.localforvocalstartup.app.utils

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

object AppTheme {
    object Colors {
        val primary = Color.fromHex("#2563EB")
        val secondary = Color.fromHex("#10B981")
        val background = Color.fromHex("#F3F4F6")

        val textPrimary = Color.fromHex("#1F2937")
        val textSecondary = Color.fromHex("#4B5563")
        val textTertiary = Color.fromHex("#6B7280")

        val error = Color.fromHex("#EF4444")
        val warning = Color.fromHex("#F59E0B")
        val success = Color.fromHex("#16A34A")

        val border = Color.fromHex("#E5E7EB")
        val backgroundLight = Color.fromHex("#F9FAFB")
        val backgroundWhite = Color.White
    }

    object Constants {
        val cornerRadius = 8.dp
        val padding = 16.dp
        const val animationDuration = 300 // ms mapped from Double 0.3s
    }
}
