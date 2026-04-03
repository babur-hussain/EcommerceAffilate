package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.data.manager.NavigationManager

@Composable
fun GroceryTopPicksSection(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    var isLoading by remember { mutableStateOf(true) }
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    val props = component.props
    val title = props?.getString("title") ?: "Top Picks for You"
    val subtitle = props?.getString("subtitle")
    val limit = props?.getDouble("limit")?.toInt() ?: 20
    val subCategoryIds = props?.getArray("subCategoryIds")?.map { it.asString } ?: emptyList()

    LaunchedEffect(subCategoryIds, limit) {
        isLoading = true
        try {
            val fetchedProducts = if (subCategoryIds.isNotEmpty()) {
                NetworkClient.apiService.getProductsBySubCategoryIdsRaw(subCategoryIds.joinToString(","), limit).products
            } else {
                NetworkClient.apiService.getGroceryProductsRaw(limit).products
            }
            products = fetchedProducts
        } catch (e: Exception) {
            e.printStackTrace()
            errorMsg = e.message
        } finally {
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 20.dp)
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
                Text(title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF111827))
                if (subtitle != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(subtitle, fontSize = 13.sp, color = Color(0xFF6B7280))
                }
            }

            Box(
                modifier = Modifier
                    .size(32.dp)
                    .background(Color(0xFF111827), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Product Cards Scroll
        if (isLoading) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(5) {
                    Box(modifier = Modifier.width(140.dp).height(240.dp).background(Color.Gray.copy(alpha=0.1f), RoundedCornerShape(12.dp)))
                }
            }
        } else if (products.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(products) { product ->
                    GroceryProductCard(product, onClick = {
                        NavigationManager.openGroceryProduct(product.id)
                        onProductClick(product)
                    })
                }
            }
        } else {
            Text("No grocery products found: ${errorMsg ?: "Empty list"}", color = Color(0xFF9CA3AF), fontSize = 14.sp, modifier = Modifier.padding(horizontal = 16.dp))
        }
    }
}
