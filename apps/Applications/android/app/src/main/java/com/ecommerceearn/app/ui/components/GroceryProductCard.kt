package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.manager.NavigationManager
import kotlin.math.roundToInt

@Composable
fun GroceryProductCard(product: Product, onClick: () -> Unit = {
    NavigationManager.openGroceryProduct(product.id)
}) {
    // Calculate discount percentage if not provided
    val discountPct = product.discountPercentage
        ?: if ((product.mrp ?: 0.0) > product.price) {
            (((product.mrp!! - product.price) / product.mrp!!) * 100).roundToInt()
        } else null

    Box(
        modifier = Modifier
            .width(140.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .border(0.5.dp, Color(0xFFEEEEEE), RoundedCornerShape(12.dp))
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Image Section with discount badge
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .background(Color(0xFFF9FAFB))
            ) {
                AsyncImage(
                    model = product.images.firstOrNull(),
                    contentDescription = product.displayName,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(8.dp)
                )

                // Discount Badge (top-left)
                if (discountPct != null && discountPct > 0) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(5.dp)
                            .background(Color(0xFF22C55E), RoundedCornerShape(5.dp))
                            .padding(horizontal = 5.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "↓$discountPct%",
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Circular Add Button (bottom-right)
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(6.dp)
                        .size(26.dp)
                        .background(Color.White, CircleShape)
                        .border(1.5.dp, Color(0xFF22C55E), CircleShape)
                        .clickable { /* Add to cart */ },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Add,
                        contentDescription = "Add",
                        tint = Color(0xFF22C55E),
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            // Content Section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp)
                    .padding(top = 6.dp, bottom = 8.dp)
            ) {
                // Rating Pill
                val rating = product.rating ?: 4.5
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(Color(0xFFFFF9C4), RoundedCornerShape(4.dp))
                        .padding(horizontal = 4.dp, vertical = 1.dp)
                ) {
                    Text(
                        text = "$rating",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF92400E)
                    )
                    Spacer(modifier = Modifier.width(2.dp))
                    Icon(
                        Icons.Default.Star,
                        contentDescription = null,
                        tint = Color(0xFFF59E0B),
                        modifier = Modifier.size(8.dp)
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Subtitle (e.g. "1 unit")
                if (!product.subtitle.isNullOrEmpty()) {
                    Text(
                        text = product.subtitle,
                        fontSize = 10.sp,
                        color = Color(0xFF6B7280)
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                }

                // Product Name
                Text(
                    text = product.displayName,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF111827),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 16.sp
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Price Row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "₹${product.price.roundToInt()}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                    if ((product.mrp ?: 0.0) > product.price) {
                        Text(
                            text = "₹${product.mrp!!.roundToInt()}",
                            fontSize = 11.sp,
                            color = Color(0xFF9CA3AF),
                            textDecoration = TextDecoration.LineThrough
                        )
                    }
                }
            }
        }
    }
}
