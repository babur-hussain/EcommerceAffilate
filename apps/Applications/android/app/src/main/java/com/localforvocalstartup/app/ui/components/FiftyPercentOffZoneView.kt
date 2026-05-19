package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient

@Composable
fun FiftyPercentOffZoneView(
    title: String = "50% OFF ZONE",
    subtitle: String = "Half the price, double the joy!",
    discountText: String = "50%",
    categoryId: String? = null,
    subCategoryIds: List<String> = emptyList(),
    isGrocery: Boolean = false,
    onProductClick: (Product) -> Unit = {}
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(categoryId, subCategoryIds) {
        try {
            val fetched = when {
                isGrocery && subCategoryIds.isNotEmpty() ->
                    NetworkClient.apiService.getProductsBySubCategoryIdsRaw(
                        subCategoryIds.joinToString(","), 12
                    ).products
                subCategoryIds.isNotEmpty() ->
                    NetworkClient.apiService.getProductsBySubCategoryIdsRaw(
                        subCategoryIds.joinToString(","), 12
                    ).products
                categoryId != null ->
                    NetworkClient.apiService.getProductsRaw(12, categoryId).products
                else ->
                    NetworkClient.apiService.getProductsRaw(12).products
            }
            // filter to approx 50% discounted products if possible, else show all
            products = fetched.sortedByDescending { it.discountPercentage ?: 0 }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    // Build the "See All" navigation url
    val seeAllUrl = when {
        subCategoryIds.isNotEmpty() -> "category://All Products?subCategoryIds=${subCategoryIds.joinToString(",")}"
        categoryId != null -> "category://All Products?categoryId=$categoryId"
        else -> "category://All Products"
    }

    Column(
        modifier = Modifier
            .padding(vertical = 12.dp)
            .background(Color.White)
    ) {
        // Header Banner — bold gradient
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(Color(0xFF1E3A8A), Color(0xFF2563EB), Color(0xFF3B82F6))
                    )
                )
        ) {
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier
                        .padding(start = 20.dp)
                        .weight(1f)
                ) {
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = discountText,
                            fontSize = 52.sp,
                            fontWeight = FontWeight.Black,
                            fontStyle = FontStyle.Italic,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Column(modifier = Modifier.padding(bottom = 8.dp)) {
                            Text(
                                text = "OFF",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFBFDBFE)
                            )
                            Text(
                                text = "ZONE",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFBFDBFE)
                            )
                        }
                    }
                    Text(
                        text = subtitle,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.White.copy(alpha = 0.9f)
                    )
                }

                // Percentage badge on the right
                Box(
                    modifier = Modifier
                        .padding(end = 20.dp)
                        .size(90.dp)
                        .clip(RoundedCornerShape(50))
                        .background(Color.White.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🏷️", fontSize = 28.sp)
                        Text(
                            text = "DEALS",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White
                        )
                    }
                }
            }
        }

        // Product List
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxWidth().height(200.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = Color(0xFF2563EB))
            }
        } else if (products.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(products) { product ->
                    ProductCardView(
                        product = product,
                        modifier = Modifier.width(150.dp),
                        onClick = { onProductClick(product) }
                    )
                }
            }
        }

        // See All Button
        Box(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(bottom = 16.dp)
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(Color(0xFFEFF6FF), Color(0xFFDBEAFE))
                    )
                )
                .clickable { NavigationManager.navigate(seeAllUrl) }
                .padding(vertical = 14.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "See all ${discountText} off deals",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF2563EB)
                )
                Icon(
                    imageVector = Icons.Default.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF2563EB),
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
