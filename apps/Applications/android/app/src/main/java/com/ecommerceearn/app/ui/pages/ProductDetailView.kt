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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.Product

@Composable
fun ProductDetailView(productId: String, productFragment: Product? = null) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(250.dp)
                .background(Color(0xFFF3F4F6)),
            contentAlignment = Alignment.Center
        ) {
            Text("Product Image Carousel", color = Color.Gray)
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = productFragment?.name ?: "Loading Product...",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "₹${productFragment?.price ?: "..."}",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF2874F0)
        )
        
        Spacer(modifier = Modifier.weight(1f))
        
        Row(modifier = Modifier.fillMaxWidth()) {
            Button(
                onClick = { /* Add to Cart */ },
                modifier = Modifier
                    .weight(1f)
                    .padding(end = 8.dp)
            ) {
                Text("Add to Cart")
            }
            
            Button(
                onClick = { /* Buy Now */ },
                modifier = Modifier
                    .weight(1f)
                    .padding(start = 8.dp)
            ) {
                Text("Buy Now")
            }
        }
    }
}
