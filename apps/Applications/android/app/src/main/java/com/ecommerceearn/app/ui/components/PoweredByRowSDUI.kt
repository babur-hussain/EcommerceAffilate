package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.SDUIComponent

@Composable
fun PoweredByRowSDUI(component: SDUIComponent) {
    val props = component.props
    val title = props?.get("title")?.toString() ?: "POWERED BY"
    
    // Attempt to extract brands list 
    val brandsArray = props?.get("brands") as? List<*> ?: emptyList<Any>()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Title with transparency mapping iOS tracking
        Text(
            text = title.uppercase(),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White.copy(alpha = 0.7f),
            letterSpacing = 2.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(20.dp, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            brandsArray.forEach { brandMapRaw ->
                val brandMap = brandMapRaw as? Map<*, *> ?: return@forEach
                val name = brandMap["name"]?.toString() ?: ""
                val logoUrl = brandMap["logoUrl"]?.toString()
                val textColorHex = brandMap["textColor"]?.toString() ?: "#FFFFFF"
                
                val displayColor = try {
                    Color(android.graphics.Color.parseColor(textColorHex))
                } catch (e: Exception) {
                    Color.White
                }

                if (!logoUrl.isNullOrEmpty()) {
                    AsyncImage(
                        model = logoUrl,
                        contentDescription = name,
                        modifier = Modifier
                            .height(24.dp)
                            .background(Color.White.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                } else {
                    Text(
                        text = name,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black,
                        color = displayColor,
                        modifier = Modifier
                            .background(Color.White.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }
        }
    }
}
