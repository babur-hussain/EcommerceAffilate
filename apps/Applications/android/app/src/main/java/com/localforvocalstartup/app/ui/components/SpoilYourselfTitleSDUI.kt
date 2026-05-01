package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.localforvocalstartup.app.data.model.SDUIComponent

@Composable
fun SpoilYourselfTitleSDUI(component: SDUIComponent) {
    val props = component.props
    val title = props?.get("title")?.toString() ?: "Spoil Yourself"
    
    val gradientHexColors = props?.get("gradientColors") as? List<*> ?: listOf("#FF6B00", "#FF6B00")
    val gradientColors = gradientHexColors.map { hexRaw ->
        try {
            Color(android.graphics.Color.parseColor(hexRaw.toString()))
        } catch (e: Exception) {
            Color(0xFFFF6B00)
        }
    }

    val leadingColor = gradientColors.firstOrNull() ?: Color(0xFFFF6B00)
    val trailingColor = gradientColors.lastOrNull() ?: Color(0xFFFF6B00)

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left Gradient Line
        Box(
            modifier = Modifier
                .width(60.dp)
                .height(1.dp)
                .background(
                    brush = Brush.horizontalGradient(
                        colors = listOf(Color.Transparent, leadingColor)
                    )
                )
        )

        Spacer(modifier = Modifier.width(8.dp))
        
        // Title
        Text(
            text = title,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        
        Spacer(modifier = Modifier.width(8.dp))

        // Right Gradient Line
        Box(
            modifier = Modifier
                .width(60.dp)
                .height(1.dp)
                .background(
                    brush = Brush.horizontalGradient(
                        colors = listOf(trailingColor, Color.Transparent)
                    )
                )
        )
    }
}
