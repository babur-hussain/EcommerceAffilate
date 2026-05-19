package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.CartManager
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient
import kotlinx.coroutines.launch

@Composable
fun TrendingNearYouView(
    title: String = "Trending near you",
    limit: Int = 10,
    onProductClick: (Product) -> Unit = {}
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(limit) {
        try {
            products = NetworkClient.apiService.getProductsRaw(limit).products
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFFE0FAEF),
                        Color(0xFFECFEFF),
                        Color(0xFFF0FDF4)
                    )
                )
            )
            .padding(vertical = 24.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D9488)
                )
                Text(
                    text = "Discover the top products trending today",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF115E59).copy(alpha = 0.8f)
                )
            }
            Box(
                modifier = Modifier
                    .background(Color(0xFF0D9488).copy(alpha = 0.12f), RoundedCornerShape(20.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text("📍 Nearby", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF0D9488))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxWidth().height(240.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = Color(0xFF0D9488))
            }
        } else if (products.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(products) { product ->
                    TrendingProductCard(
                        product = product,
                        onClick = { onProductClick(product) },
                        onAddToCart = {
                            scope.launch { CartManager.addToCart(product, 1) }
                        }
                    )
                }
            }
        } else {
            Text(
                text = "No trending products found",
                fontSize = 12.sp,
                color = Color.Gray,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
    }
}

@Composable
fun TrendingProductCard(
    product: Product,
    onClick: () -> Unit = {},
    onAddToCart: () -> Unit = {}
) {
    var addedToCart by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .width(160.dp)
            .shadow(6.dp, RoundedCornerShape(20.dp))
            .background(Color.White, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(bottom = 12.dp)
    ) {
        // Image Area
        Box(modifier = Modifier.fillMaxWidth()) {
            AsyncImage(
                model = product.images.firstOrNull(),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .padding(10.dp),
                contentScale = ContentScale.Fit
            )

            // Discount badge
            product.discountPercentage?.let { discount ->
                if (discount > 0) {
                    Box(
                        modifier = Modifier
                            .padding(8.dp)
                            .background(Color(0xFF10B981), RoundedCornerShape(6.dp))
                            .padding(horizontal = 6.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "$discount% OFF",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }

            // ADD button overlapping bottom-right
            Button(
                onClick = {
                    addedToCart = true
                    onAddToCart()
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (addedToCart) Color(0xFF10B981) else Color.White
                ),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 3.dp),
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .offset(x = (-10).dp, y = 14.dp)
                    .zIndex(1f)
                    .height(30.dp)
            ) {
                Text(
                    text = if (addedToCart) "✓" else "ADD",
                    color = if (addedToCart) Color.White else Color(0xFF15803D),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        Column(modifier = Modifier.padding(horizontal = 12.dp)) {
            if (!product.subtitle.isNullOrEmpty()) {
                Text(
                    text = product.subtitle,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF6B7280),
                    modifier = Modifier
                        .background(Color(0xFFF7F9FC), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                )
                Spacer(modifier = Modifier.height(4.dp))
            }

            Text(
                text = product.displayName,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF1F2937),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = "₹${product.price.toInt()}",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
                if ((product.mrp ?: 0.0) > product.price) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "₹${product.mrp?.toInt()}",
                        fontSize = 11.sp,
                        textDecoration = TextDecoration.LineThrough,
                        color = Color(0xFF9CA3AF)
                    )
                }
            }
        }
    }
}
