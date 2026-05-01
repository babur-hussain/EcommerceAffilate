package com.localforvocalstartup.app.utils

import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp

// Color Extensions
fun Color.Companion.fromHex(hex: String): Color {
    val safeHex = hex.trim('#').let {
        when (it.length) {
            3 -> StringBuilder().apply { it.forEach { char -> append(char).append(char) } }.toString()
            else -> it
        }
    }
    
    val a: Int
    val r: Int
    val g: Int
    val b: Int

    return try {
        val intValue = safeHex.toLong(16)
        when (safeHex.length) {
            3, 6 -> {
                a = 255
                r = (intValue shr 16 and 0xFF).toInt()
                g = (intValue shr 8 and 0xFF).toInt()
                b = (intValue and 0xFF).toInt()
            }
            8 -> {
                a = (intValue shr 24 and 0xFF).toInt()
                r = (intValue shr 16 and 0xFF).toInt()
                g = (intValue shr 8 and 0xFF).toInt()
                b = (intValue and 0xFF).toInt()
            }
            else -> {
                a = 255; r = 255; g = 255; b = 255
            }
        }
        Color(r, g, b, a)
    } catch (e: Exception) {
        Color.Transparent
    }
}

// View Extensions
fun Modifier.cornerRadius(radius: Dp): Modifier {
    return this.clip(RoundedCornerShape(radius))
}
