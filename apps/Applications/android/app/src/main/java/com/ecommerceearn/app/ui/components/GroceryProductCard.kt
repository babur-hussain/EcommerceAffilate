package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.Product

@Composable
fun GroceryProductCard(product: Product) {
    Column(
        modifier = Modifier
            .width(160.dp)
            .height(280.dp)
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(8.dp)
    ) {
        // Mock Cached Image Container
        androidx.compose.foundation.layout.Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(110.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFFF3F4F6))
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(product.name ?: product.displayName, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, maxLines = 2)
        Text("Quantity Selector", fontSize = 12.sp, color = Color.Gray)
        
        Spacer(modifier = Modifier.weight(1f))
        
        Text("₹${product.price}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.Black)
        
        Button(
            onClick = { /* Add to basket */ },
            modifier = Modifier.fillMaxWidth().padding(top = 4.dp)
        ) {
            Text("Add")
        }
    }
}
