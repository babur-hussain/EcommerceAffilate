package com.ecommerceearn.app.ui.components

import androidx.compose.ui.graphics.Color

fun safeParseColor(colorString: String): Color {
    return try {
        Color(android.graphics.Color.parseColor(colorString))
    } catch (e: Exception) {
        Color.Black
    }
}
