package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.remote.NetworkClient
import kotlinx.coroutines.launch

@Composable
fun TrendingNearYouView(
    title: String = "Trending near you",
    subtitle: String = "Discover the top products trending today",
    limit: Int = 10,
    productIds: List<String> = emptyList(),
    onProductClick: (Product) -> Unit = {}
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            // Replicating simplified fetch logic
            val fetched = NetworkClient.apiService.getProducts(limit)
            products = fetched
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
                        safeParseColor("#E0FAEF"),
                        safeParseColor("#ECFEFF"),
                        safeParseColor("#F0FDF4")
                    )
                )
            )
            .padding(vertical = 24.dp)
    ) {
        // Header
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                text = title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = safeParseColor("#0D9488")
            )
            if (subtitle.isNotEmpty()) {
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = safeParseColor("#115E59").copy(alpha = 0.9f)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            Box(modifier = Modifier.fillMaxWidth().height(240.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (products.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(products) { product ->
                    TrendingProductCard(product, onClick = { onProductClick(product) })
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
fun TrendingProductCard(product: Product, onClick: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .width(160.dp)
            .shadow(8.dp, RoundedCornerShape(20.dp))
            .background(Color.White, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(bottom = 12.dp)
    ) {
        // Image Area
        Box(
            modifier = Modifier.fillMaxWidth()
        ) {
            AsyncImage(
                model = product.images.firstOrNull(),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .padding(12.dp),
                contentScale = ContentScale.Fit
            )
            
            // Add Button (Overlapping)
            Button(
                onClick = { /* Add */ },
                colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 6.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .offset(x = (-12).dp, y = 14.dp)
                    .zIndex(1f)
                    .height(30.dp)
            ) {
                Text(
                    text = "ADD",
                    color = safeParseColor("#15803D"),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        
        Spacer(modifier = Modifier.height(12.dp))

        // Details
        Column(modifier = Modifier.padding(horizontal = 12.dp)) {
            // Weight Subtitle
            if (!product.subtitle.isNullOrEmpty()) {
                Text(
                    text = product.subtitle,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = safeParseColor("#6B7280"),
                    modifier = Modifier
                        .background(safeParseColor("#F7F9FC"), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = product.displayName,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = safeParseColor("#1F2937"),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.height(38.dp)
            )

            // Simplistic Price
             Row(
               verticalAlignment = Alignment.Bottom,
               modifier = Modifier.padding(top = 4.dp)
            ) {
               Text(
                   text = "₹${product.price.toInt()}",
                   fontSize = 14.sp,
                   fontWeight = FontWeight.Bold,
                   color = safeParseColor("#1F2937")
               )
               if ((product.mrp ?: 0.0) > product.price) {
                   Spacer(modifier = Modifier.width(4.dp))
                   Text(
                       text = "MRP ₹${product.mrp?.toInt()}",
                       fontSize = 11.sp,
                       textDecoration = TextDecoration.LineThrough,
                       color = safeParseColor("#9CA3AF")
                   )
               }
            }
        }
    }
}
