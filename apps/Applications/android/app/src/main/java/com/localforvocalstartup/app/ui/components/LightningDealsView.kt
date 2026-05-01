package com.localforvocalstartup.app.ui.components
// Cache buster 1

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.Product

@Composable
fun LightningDealsView(
    title: String,
    subtitle: String,
    products: List<Product>,
    onProductClick: (Product) -> Unit = {}
) {
    if (products.isEmpty()) return

    Column(
        modifier = Modifier
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFFFFF0F5),
                        Color(0xFFFFE4E1),
                        Color(0xFFFDF2F8)
                    ),
                    start = Offset(0f, 0f),
                    end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY)
                )
            )
            .padding(vertical = 24.dp)
            .fillMaxWidth()
    ) {
        // Header
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                text = title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFBE123C)
            )
            if (subtitle.isNotEmpty()) {
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF4B5563)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(products) { product ->
                LightningDealCard(product, onClick = { onProductClick(product) })
            }
        }
    }
}

@Composable
fun LightningDealCard(product: Product, onClick: () -> Unit = {}) {
    Card(
        modifier = Modifier
            .width(160.dp)
            .shadow(4.dp, RoundedCornerShape(16.dp))
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(bottom = 0.dp)) {
            
            // Image Area + Overlay Elements
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
            ) {
                // Product Image
                AsyncImage(
                    model = product.images.firstOrNull(),
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    contentScale = ContentScale.Fit
                )

                // Discount Badge (Top Right hanging)
                if ((product.discountPercentage ?: 0) > 0) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(end = 12.dp)
                            .offset(y = (-4).dp)
                            .background(
                                color = Color(0xFFEF4444),
                                shape = RoundedCornerShape(bottomStart = 4.dp, bottomEnd = 4.dp)
                            )
                            .padding(horizontal = 4.dp, vertical = 4.dp)
                    ) {
                        // Bolt Icon would go here (optional)
                        Text(
                            text = "${product.discountPercentage}% OFF",
                            fontSize = 7.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                // ADD Button (Bottom Right, overlaid)
                // Using nested box to position it partially over image area if needed, 
                // but simpler to just put it at bottomEnd with padding
                Button(
                    onClick = { /* Add to cart */ },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFF4D8B4D)),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 0.dp),
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(end = 8.dp, bottom = 0.dp) // adjusted in parent usually, effectively offset
                        .offset(y = 14.dp) // Push it down slightly into the details text area like iOS
                        .height(30.dp)
                        .zIndex(1f)
                ) {
                    Text(
                        text = "ADD",
                        color = Color(0xFF15803D),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp)) // Space for the offset button

            // Details Area
            Column(modifier = Modifier.padding(horizontal = 12.dp)) {
                
                // Subtitle/Weight
                if (!product.subtitle.isNullOrEmpty()) {
                    Text(
                        text = product.subtitle,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF374151)
                    )
                }

                Text(
                    text = product.displayName,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.height(38.dp)
                )

                // Rating
                Row(verticalAlignment = Alignment.CenterVertically) {
                    repeat(5) { index ->
                        val rating = product.rating ?: 0.0
                        val isColored = index < rating
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = if (isColored) Color(0xFFFFC107) else Color.Gray.copy(alpha = 0.3f),
                            modifier = Modifier.size(10.dp)
                        )
                    }
                    if ((product.reviewCount ?: 0) > 0) {
                        Spacer(modifier = Modifier.width(2.dp))
                        Text(
                            text = "(${product.reviewCount})",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                }

                // Scarcity
                val stock = product.stock ?: 0
                if (stock in 1..9) {
                    Text(
                        text = "Only $stock left",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFEA580C)
                    )
                }

                // Price
                Row(
                   verticalAlignment = Alignment.Bottom,
                   modifier = Modifier.padding(top = 4.dp)
                ) {
                   Text(
                       text = "₹${product.price.toInt()}",
                       fontSize = 14.sp,
                       fontWeight = FontWeight.Bold,
                       color = Color(0xFF1F2937)
                   )
                   if ((product.mrp ?: 0.0) > product.price) {
                       Spacer(modifier = Modifier.width(4.dp))
                       Text(
                           text = "MRP ₹${product.mrp?.toInt()}",
                           fontSize = 10.sp,
                           textDecoration = TextDecoration.LineThrough,
                           color = Color(0xFF9CA3AF)
                       )
                   }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            
            // Footer "See more like this"
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFECFDF5))
                    .clickable { }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "See more like this",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF166534)
                    )
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowRight,
                        contentDescription = null,
                        tint = Color(0xFF166534),
                        modifier = Modifier.size(12.dp)
                    )
                }
            }
        }
    }
}
