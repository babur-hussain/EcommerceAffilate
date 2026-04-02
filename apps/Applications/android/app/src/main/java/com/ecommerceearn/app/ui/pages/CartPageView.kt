package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.utils.AppTheme

@Composable
fun CartPageView() {
    var selectedTab by remember { mutableStateOf("Shopping") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F3F6))
    ) {
        // App Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (selectedTab == "Shopping") "My Cart" else "My Basket",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF212121)
            )
        }
        
        // Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
        ) {
            Button(
                onClick = { selectedTab = "Shopping" },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Transparent,
                    contentColor = if (selectedTab == "Shopping") AppTheme.Colors.primary else Color(0xFF212121)
                )
            ) {
                Text("Shopping", fontWeight = if (selectedTab == "Shopping") FontWeight.Bold else FontWeight.Medium)
            }
            
            Button(
                onClick = { selectedTab = "Grocery" },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Transparent,
                    contentColor = if (selectedTab == "Grocery") AppTheme.Colors.primary else Color(0xFF212121)
                )
            ) {
                Text("Grocery", fontWeight = if (selectedTab == "Grocery") FontWeight.Bold else FontWeight.Medium)
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        // Content View Area
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            if (selectedTab == "Shopping") {
                Text("Shopping Cart is Empty")
            } else {
                Text("Grocery Basket is Empty")
            }
        }
    }
}
