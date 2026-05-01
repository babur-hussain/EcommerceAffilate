package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.model.Category
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.data.remote.getProducts

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CommonCategoryPageView(
    categoryId: String? = null,
    categoryName: String? = null
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var subCategories by remember { mutableStateOf<List<Category>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var activeSubCategoryId by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(categoryId, activeSubCategoryId) {
        isLoading = true
        try {
            if (categoryId != null) {
                try {
                    subCategories = NetworkClient.apiService.getSubCategories(categoryId)
                } catch (_: Exception) {}

                products = NetworkClient.apiService.getProducts(
                    limit = 20,
                    categoryId = categoryId,
                    subCategoryId = activeSubCategoryId
                )
            } else {
                products = NetworkClient.apiService.getProducts(20)
            }
        } catch (_: Exception) {}
        isLoading = false
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF5F5F5))) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF5F5F5))
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { NavigationManager.goBack() }) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
            }

            // Search Pill
            Row(
                modifier = Modifier
                    .weight(1f)
                    .background(Color.White, RoundedCornerShape(28.dp))
                    .padding(horizontal = 14.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF6B7280), modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = categoryName ?: "Category",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF374151)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))
            Icon(Icons.Default.ShoppingCart, contentDescription = null, tint = Color(0xFF1F2937), modifier = Modifier.size(22.dp))
        }

        // SubCategories Row
        if (subCategories.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(vertical = 8.dp)
            ) {
                items(subCategories) { sub ->
                    val isActive = activeSubCategoryId == sub._id
                    FilterChip(
                        selected = isActive,
                        onClick = {
                            activeSubCategoryId = if (isActive) null else sub._id
                        },
                        label = { Text(sub.name, fontSize = 13.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Color(0xFF2563EB),
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        }

        // Content
        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator()
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Loading products...", fontSize = 14.sp, color = Color.Gray)
                }
            }
        } else if (products.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.ShoppingBag, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(48.dp))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("No products found", fontSize = 16.sp, fontWeight = FontWeight.Medium, color = Color.Gray)
                    Text("Try adjusting your filters", fontSize = 14.sp, color = Color.Gray.copy(alpha = 0.7f))
                }
            }
        } else {
            Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).background(Color.White)) {
                products.forEach { product ->
                    CommonCategoryProductRow(product)
                    Divider(modifier = Modifier.padding(horizontal = 16.dp))
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun CommonCategoryProductRow(product: Product) {
    val discountPercent = product.discountPercentage ?: run {
        val mrp = product.mrp ?: return@run 0
        if (mrp > product.price) (((mrp - product.price) / mrp) * 100).toInt() else 0
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Product Image
        Box(modifier = Modifier.size(130.dp, 150.dp)) {
            AsyncImage(
                model = product.images.firstOrNull(),
                contentDescription = null,
                modifier = Modifier.fillMaxSize().background(Color.White),
                contentScale = ContentScale.Fit
            )
            if ((product.rating ?: 0.0) >= 4.5) {
                Text(
                    "BESTSELLER",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(6.dp)
                        .background(Color(0xFFF97316), RoundedCornerShape(2.dp))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                )
            }
        }

        // Product Details
        Column(modifier = Modifier.weight(1f)) {
            Text(product.name ?: "", fontSize = 14.sp, color = Color(0xFF1F2937), maxLines = 2)
            Spacer(modifier = Modifier.height(6.dp))

            // Rating
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .background(Color(0xFF166534), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(String.format("%.1f", product.rating ?: 4.0), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Spacer(modifier = Modifier.width(2.dp))
                        Icon(Icons.Default.Star, contentDescription = null, tint = Color.White, modifier = Modifier.size(9.dp))
                    }
                }

                Spacer(modifier = Modifier.width(6.dp))
                Text("(${product.reviewCount ?: 0})", fontSize = 12.sp, color = Color(0xFF6B7280))
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Price
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (discountPercent > 0) {
                    Text("↓${discountPercent}%", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF059669))
                    Spacer(modifier = Modifier.width(6.dp))
                }
                if (product.mrp != null && product.mrp > product.price) {
                    Text("₹${product.mrp.toInt()}", fontSize = 13.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                    Spacer(modifier = Modifier.width(6.dp))
                }
                Text("₹${product.price.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Delivery
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.FlashOn, contentDescription = null, tint = Color(0xFF7C3AED), modifier = Modifier.size(10.dp))
                Text("EXPRESS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF7C3AED))
                Spacer(modifier = Modifier.width(4.dp))
                Text("2 day delivery", fontSize = 11.sp, color = Color(0xFF374151))
            }
        }

        // Wishlist Icon column
        Icon(Icons.Default.FavoriteBorder, contentDescription = "Wishlist", tint = Color(0xFF6B7280), modifier = Modifier.size(18.dp))
    }
}
