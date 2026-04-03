package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.ui.components.ProductCardView

@Composable
fun FiftyPercentOffZoneView(
    title: String = "50% OFF ZONE",
    subtitle: String = "Half the price, double the joy!",
    bannerImage: String = "https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-grocery-shopping-bag-isolated-png-image_11549419.png",
    discountText: String = "50%"
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val fetched = NetworkClient.apiService.getProductsRaw(10).products
            products = fetched
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .padding(vertical = 12.dp)
            .background(Color.White)
    ) {
        // Header Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(safeParseColor("#F0F9FF"), safeParseColor("#E0F2FE"))
                    )
                )
        ) {
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Text Content
                Column(
                    modifier = Modifier
                        .padding(start = 20.dp)
                        .weight(1f)
                ) {
                    Row(verticalAlignment = Alignment.Bottom) {
                         Text(
                            text = discountText,
                            fontSize = 42.sp,
                            fontWeight = FontWeight.Black,
                            fontStyle = FontStyle.Italic,
                            color = safeParseColor("#2563EB")
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Column(modifier = Modifier.padding(bottom = 6.dp)) {
                            Text(
                                text = "OFF",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.ExtraBold,
                                fontStyle = FontStyle.Italic,
                                color = safeParseColor("#2563EB")
                            )
                            Text(
                                text = "ZONE",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.ExtraBold,
                                fontStyle = FontStyle.Italic,
                                color = safeParseColor("#3B82F6")
                            )
                        }
                    }
                    Text(
                        text = subtitle,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = safeParseColor("#1F2937")
                    )
                }

                // Image
                AsyncImage(
                    model = bannerImage,
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .width(140.dp)
                        .height(100.dp)
                        .padding(end = 10.dp)
                )
            }
        }

        // Product List
        if (isLoading) {
            Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (products.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(products) { product ->
                    ProductCardView(product = product, modifier = Modifier.width(150.dp))
                }
            }
        }

        // See All Button
        Box(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(bottom = 16.dp)
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(safeParseColor("#EEF2FF"))
                .clickable { }
                .padding(vertical = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "See all",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = safeParseColor("#4F46E5")
                )
                Icon(
                    imageVector = Icons.Default.KeyboardArrowRight,
                    contentDescription = null,
                    tint = safeParseColor("#4F46E5"),
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}
