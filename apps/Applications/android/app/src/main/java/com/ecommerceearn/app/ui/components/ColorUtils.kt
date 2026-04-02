package com.ecommerceearn.app.ui.components

import androidx.compose.ui.graphics.Color

fun safeParseColor(colorString: String): Color {
    return try {
        // Server sometimes omits the "#" prefix — e.g. "62cff4" instead of "#62cff4"
        val normalised = if (colorString.startsWith("#")) colorString else "#$colorString"
        Color(android.graphics.Color.parseColor(normalised))
    } catch (e: Exception) {
        Color.Transparent
    }
}
