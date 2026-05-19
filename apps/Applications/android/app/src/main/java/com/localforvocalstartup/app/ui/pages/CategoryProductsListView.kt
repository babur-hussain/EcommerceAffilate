package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Info
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
import com.localforvocalstartup.app.data.manager.WishlistManager
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.data.remote.getGroceryProducts
import com.localforvocalstartup.app.data.remote.getProducts
import com.localforvocalstartup.app.data.remote.getProductsBySubCategoryIds
import kotlinx.coroutines.launch

@Composable
fun CategoryProductsListView(
    categoryId: String? = null,
    subCategoryIds: List<String> = emptyList(),
    isGrocery: Boolean = false,
    title: String = "Products",
    minimumDiscount: Int = 0
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var relatedProducts by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val context = androidx.compose.ui.platform.LocalContext.current

    LaunchedEffect(Unit) {
        try {
            var fetched: List<Product> = emptyList()
            if (isGrocery) {
                if (subCategoryIds.isNotEmpty()) {
                    fetched = NetworkClient.apiService.getProductsBySubCategoryIds(subCategoryIds, 50)
                } else {
                    fetched = NetworkClient.apiService.getGroceryProducts(50)
                }
            } else if (subCategoryIds.isNotEmpty()) {
                fetched = NetworkClient.apiService.getProducts(50, subCategoryId = subCategoryIds.firstOrNull())
            } else if (!categoryId.isNullOrEmpty()) {
                fetched = NetworkClient.apiService.getProducts(50, categoryId = categoryId)
            } else if (title.isNotEmpty() && title != "Products") {
                fetched = NetworkClient.apiService.getProducts(50, categoryId = title)
            } else {
                fetched = NetworkClient.apiService.getProducts(50)
            }

            val discounted = fetched.filter { product ->
                val discount = product.discountPercentage ?: run {
                    val mrp = product.mrp ?: return@run 0
                    if (mrp > product.price) (((mrp - product.price) / mrp) * 100).toInt() else 0
                }
                discount >= minimumDiscount
            }

            if (minimumDiscount > 0) {
                if (discounted.isNotEmpty()) {
                    products = discounted
                    relatedProducts = emptyList()
                } else {
                    products = emptyList()
                    relatedProducts = fetched.ifEmpty { NetworkClient.apiService.getProducts(20) }
                }
            } else {
                if (fetched.isNotEmpty()) {
                    products = fetched
                    relatedProducts = emptyList()
                } else {
                    products = emptyList()
                    relatedProducts = NetworkClient.apiService.getProducts(20)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6))) {
        // Navigation Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { NavigationManager.goBack() }) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937),
                maxLines = 1,
                modifier = Modifier.weight(1f)
            )
            
            if (minimumDiscount > 0) {
                Text(
                    text = "Min $minimumDiscount% off",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF16A34A),
                    modifier = Modifier
                        .background(Color(0xFFDCFCE7), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }
        }

        // Content
        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (products.isEmpty()) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(maxLineSpan) }) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Spacer(modifier = Modifier.height(40.dp))
                        // No Deals Icon/Text
                        Icon(Icons.Default.Info, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = if (minimumDiscount > 0) "No deals available" else "Out of stock",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1F2937)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "We couldn't find exactly what you're looking for.",
                            fontSize = 14.sp,
                            color = Color.Gray,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(
                            onClick = {
                                android.widget.Toast.makeText(context, "You will be notified when deals are available!", android.widget.Toast.LENGTH_SHORT).show()
                                com.localforvocalstartup.app.data.manager.NotifyMeManager.register(context, categoryId ?: title, title)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Notify Me", color = Color.White)
                        }
                        
                        Spacer(modifier = Modifier.height(40.dp))

                        if (relatedProducts.isNotEmpty()) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Start) {
                                Text(
                                    text = "Related Products",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF111827)
                                )
                            }
                        }
                    }
                }

                if (relatedProducts.isNotEmpty()) {
                    items(relatedProducts) { product ->
                        CategoryProductCard(
                            product = product,
                            onClick = {
                                val safeId = if (product.id.isNullOrBlank()) "not_found" else product.id
                                if (isGrocery) {
                                    NavigationManager.openGroceryProduct(safeId)
                                } else {
                                    NavigationManager.navigate("product/$safeId")
                                }
                            }
                        )
                    }
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(products) { product ->
                    CategoryProductCard(
                        product = product,
                        onClick = {
                            val safeId = if (product.id.isNullOrBlank()) "not_found" else product.id
                            if (isGrocery) {
                                NavigationManager.openGroceryProduct(safeId)
                            } else {
                                NavigationManager.navigate("product/$safeId")
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun CategoryProductCard(
    product: Product,
    onClick: () -> Unit = {}
) {
    val coroutineScope = rememberCoroutineScope()
    var isWishlisted by remember { mutableStateOf(WishlistManager.isInWishlist(product.id)) }
    
    val discountPercent = product.discountPercentage ?: run {
        val mrp = product.mrp ?: return@run 0
        if (mrp > product.price) (((mrp - product.price) / mrp) * 100).toInt() else 0
    }

    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            Box(modifier = Modifier.fillMaxWidth().height(150.dp)) {
                AsyncImage(
                    model = product.images.firstOrNull(),
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize().background(Color(0xFFF9FAFB)),
                    contentScale = ContentScale.Crop
                )

                // Favorite button
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(6.dp)
                        .size(30.dp)
                        .background(Color.White, CircleShape)
                        .clickable {
                            coroutineScope.launch {
                                WishlistManager.toggleWishlist(product.id)
                                isWishlisted = WishlistManager.isInWishlist(product.id)
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isWishlisted) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Wishlist",
                        tint = if (isWishlisted) Color(0xFFEF4444) else Color(0xFF9CA3AF),
                        modifier = Modifier.size(14.dp)
                    )
                }

                // Discount Badge
                if (discountPercent > 0) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(6.dp)
                            .background(Color(0xFFEF4444), RoundedCornerShape(4.dp))
                    ) {
                        Text("-$discountPercent%", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
            }

            Column(modifier = Modifier.padding(10.dp)) {
                Text(
                    text = product.name ?: "",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF1F2937),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.height(36.dp)
                )

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("₹${product.price.toInt()}", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4F46E5))
                    if (product.mrp != null && product.mrp > product.price) {
                        Text("₹${product.mrp.toInt()}", fontSize = 11.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                    }
                }

                if (product.rating != null) {
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(11.dp))
                        Spacer(modifier = Modifier.width(2.dp))
                        Text(String.format("%.1f", product.rating), fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF6B7280))
                    }
                }
            }
        }
    }
}
