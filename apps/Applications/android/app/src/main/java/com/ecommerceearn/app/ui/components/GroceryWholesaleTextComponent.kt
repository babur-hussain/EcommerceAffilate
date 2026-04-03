package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.SDUIComponent
import com.google.gson.Gson

@Composable
fun GroceryWholesaleTextComponent(component: SDUIComponent) {
    val props = component.props

    data class WholesaleTextLine(val text: String, val size: Float, val color: String, val weight: String?)
    
    val linesArr = props?.getArray("lines")
    val lines = linesArr?.mapNotNull {
        try { Gson().fromJson(it, WholesaleTextLine::class.java) } catch(e:Exception){ null }
    } ?: emptyList()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 50.dp, bottom = 10.dp, start = 16.dp, end = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (lines.isNotEmpty()) {
            lines.forEach { line ->
                val fontWeight = when (line.weight?.lowercase()) {
                    "bold" -> FontWeight.Bold
                    "medium" -> FontWeight.Medium
                    "heavy" -> FontWeight.Black
                    "light" -> FontWeight.Light
                    else -> FontWeight.Bold
                }
                Text(
                    text = line.text,
                    fontSize = line.size.sp,
                    fontWeight = fontWeight,
                    color = safeParseColor(line.color),
                    textAlign = TextAlign.Center
                )
            }
        } else {
            // Fallback identical to iOS
            Text("You Just Experienced", fontSize = 20.sp, fontWeight = FontWeight.Medium, color = Color(0xFFD4AF37), textAlign = TextAlign.Center)
            Text("3000+", fontSize = 56.sp, fontWeight = FontWeight.Black, color = Color(0xFFD4AF37), textAlign = TextAlign.Center)
            Text("Products at\nWholesale Prices", fontSize = 34.sp, fontWeight = FontWeight.Bold, color = Color(0xFFD4AF37), textAlign = TextAlign.Center)
        }
    }
}
