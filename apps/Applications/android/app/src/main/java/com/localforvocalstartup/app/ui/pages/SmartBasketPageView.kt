package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SmartBasketPageView(onNavigateBack: () -> Unit = {}) {
    val bgColor = Color(0xFFFFF8E7)
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgColor)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(bgColor)
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = onNavigateBack, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
            }
            
            Text("Your Smart Basket", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            
            Spacer(modifier = Modifier.width(24.dp))
        }
        HorizontalDivider(color = Color.Black.copy(alpha = 0.05f))
        
        // Content Loading State
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Color(0xFFFFA500))
        }
    }
}
