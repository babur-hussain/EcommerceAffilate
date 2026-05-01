package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun BottomActionBarView(
    price: Double,
    onAddToCart: () -> Unit,
    onBuyNow: () -> Unit,
    onOpenCart: () -> Unit
) {
    Surface(
        color = Color.White,
        shadowElevation = 8.dp,
        modifier = Modifier.navigationBarsPadding()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Cart Icon Button (Square outline)
            OutlinedButton(
                onClick = onOpenCart,
                modifier = Modifier.size(50.dp),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(0.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF111827)),
                border = BorderStroke(1.dp, Color(0xFFE5E7EB))
            ) {
                Icon(Icons.Default.ShoppingCart, contentDescription = "Open Cart", modifier = Modifier.size(20.dp))
            }

            // Add to Cart Button
            OutlinedButton(
                onClick = onAddToCart,
                modifier = Modifier
                    .weight(1f)
                    .height(50.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF111827)),
                border = BorderStroke(1.dp, Color(0xFFE5E7EB))
            ) {
                Text("Add to Cart", fontSize = 15.sp, fontWeight = FontWeight.Bold)
            }

            // Buy Now Button
            Button(
                onClick = onBuyNow,
                modifier = Modifier
                    .weight(1f)
                    .height(50.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFACC15)), // Gold/Yellow
                contentPadding = PaddingValues(0.dp)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("Buy now", fontSize = 15.sp, fontWeight = FontWeight.Black, color = Color(0xFF111827))
                    Text("at ₹${price.toInt()}", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                }
            }
        }
    }
}
