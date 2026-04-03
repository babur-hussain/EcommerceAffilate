package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Category
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.ui.components.ProductCardView
import kotlinx.coroutines.launch

@Composable
fun CategoryRightPaneView(
    categoryId: String?,
    categoryName: String?,
    subCategoriesFromParent: List<Category>
) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var activeSubCategoryId by remember { mutableStateOf<String?>(null) }
    var showProductList by remember { mutableStateOf(false) }
    var showGlobalSearch by remember { mutableStateOf(false) }
    var showBasket by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()
    val basketItems by com.ecommerceearn.app.data.manager.BasketManager.items.collectAsState()
    val basketCount = basketItems.size

    // Key to trigger reload
    LaunchedEffect(categoryId) {
        activeSubCategoryId = null
        showProductList = false
        products = emptyList()
        if (categoryId != null) {
            // If we needed to fetch category details (like attributes) we would do it here
            // We just wait for user to click a subcategory to load products
            isLoading = false
        }
    }

    LaunchedEffect(activeSubCategoryId) {
        if (activeSubCategoryId != null || showProductList) {
            isLoading = true
            try {
                // Not passing subCategoryId if null, in a real env it would be a query param
                products = NetworkClient.apiService.getProductsRaw(limit = 20).products
                isLoading = false
            } catch (e: Exception) {
                isLoading = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFEBF4FF))
    ) {
        // Header
        RightPaneHeader(
            title = categoryName ?: "Category",
            cartCount = basketCount,
            onSearchTap = { showGlobalSearch = true },
            onCartTap = { showBasket = true }
        )

        if (showProductList || activeSubCategoryId != null) {
            // Product Listing View
            Column(modifier = Modifier.fillMaxSize()) {
                // Horizontal Sub-category Selector
                CategoryRightPaneSubEntriesView(
                    subCategories = subCategoriesFromParent,
                    activeId = activeSubCategoryId,
                    onSelectAll = {
                        activeSubCategoryId = null
                        showProductList = true
                    },
                    onSelectSub = { id ->
                        activeSubCategoryId = id
                        showProductList = true
                    }
                )

                if (isLoading) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                } else if (products.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No products found")
                    }
                } else {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        contentPadding = PaddingValues(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        items(products) { product ->
                            ProductCardView(product = product, onClick = {
                                com.ecommerceearn.app.data.manager.NavigationManager.openGroceryProduct(product.id)
                            })
                        }
                    }
                }
            }
        } else {
            // Category Landing View (Groups)
            val groupedSections = subCategoriesFromParent.groupBy { it.group ?: "Other" }
            
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                if (categoryName != null) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 16.dp)
                            .clickable {
                                showProductList = true
                                activeSubCategoryId = null
                            },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = categoryName,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF2874F0)
                        )
                        Icon(
                            imageVector = Icons.Default.ChevronRight,
                            contentDescription = null,
                            tint = Color(0xFF2874F0),
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }

                if (subCategoriesFromParent.isEmpty() && !isLoading) {
                    Text(
                        text = "No subcategories found",
                        color = Color.Gray,
                        modifier = Modifier.padding(16.dp)
                    )
                } else {
                    groupedSections.forEach { (groupName, items) ->
                        Column(modifier = Modifier.padding(bottom = 24.dp)) {
                            Text(
                                text = groupName,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1F2937),
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
                            )

                            // Mapping subcategories into a pseudo-grid flow
                            // Simple implementation for fixed 3-column
                            val chunkedItems = items.take(8).chunked(3)
                            
                            chunkedItems.forEach { rowItems ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 10.dp),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    for (sub in rowItems) {
                                        Box(modifier = Modifier.weight(1f)) {
                                            SubCategoryItemExt(sub = sub) {
                                                activeSubCategoryId = sub._id
                                                showProductList = true
                                            }
                                        }
                                    }
                                    // Pad empty spaces
                                    for (i in 0 until (3 - rowItems.size)) {
                                        Spacer(modifier = Modifier.weight(1f))
                                    }
                                }
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(50.dp))
            }
        }
    }

    if (showGlobalSearch) {
        com.ecommerceearn.app.ui.pages.GlobalSearchView(
            onDismiss = { showGlobalSearch = false },
            categoryId = categoryId
        )
    }

    if (showBasket) {
        com.ecommerceearn.app.ui.pages.BasketPageView(onDismiss = { showBasket = false })
    }
}

@Composable
fun SubCategoryItemExt(sub: Category, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(85.dp)
                .shadow(2.dp, RoundedCornerShape(16.dp))
                .background(Color.White, RoundedCornerShape(16.dp))
                .clip(RoundedCornerShape(16.dp))
        ) {
            val urlStr = sub.image ?: sub.icon
            if (urlStr != null) {
                val fullUrl = if (urlStr.startsWith("http")) urlStr else "https://api.lfvs.in$urlStr"
                AsyncImage(
                    model = fullUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize().padding(8.dp)
                )
            } else {
                Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6)))
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = sub.name,
            fontSize = 11.sp,
            color = Color(0xFF1F2937),
            textAlign = TextAlign.Center,
            maxLines = 2,
            modifier = Modifier.height(32.dp)
        )
    }
}

@Composable
fun RightPaneHeader(title: String, cartCount: Int, onSearchTap: () -> Unit = {}, onCartTap: () -> Unit = {}) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFEBF4FF))
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Search Pill
        Row(
            modifier = Modifier
                .weight(1f)
                .background(Color.White, RoundedCornerShape(12.dp))
                .shadow(2.dp, RoundedCornerShape(12.dp))
                .clickable { onSearchTap() }
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = Color(0xFF9CA3AF),
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "Search for $title",
                fontSize = 15.sp,
                color = Color(0xFF9CA3AF)
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        // Cart
        Box(contentAlignment = Alignment.TopEnd) {
            Icon(
                imageVector = Icons.Default.ShoppingCart,
                contentDescription = "Cart",
                tint = Color(0xFF1F2937),
                modifier = Modifier.size(26.dp).clickable { onCartTap() }
            )
            if (cartCount > 0) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 4.dp, y = (-4).dp)
                        .size(16.dp)
                        .background(Color(0xFFEF4444), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "$cartCount", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun CategoryRightPaneSubEntriesView(
    subCategories: List<Category>,
    activeId: String?,
    onSelectAll: () -> Unit,
    onSelectSub: (String) -> Unit
) {
    LazyRow(
        contentPadding = PaddingValues(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {
        item {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable(onClick = onSelectAll)
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .shadow(if (activeId == null) 0.dp else 2.dp, RoundedCornerShape(16.dp))
                        .background(if (activeId == null) Color(0xFF374151) else Color.White, RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    if (activeId == null) {
                        Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color.White)
                    } else {
                        Icon(imageVector = Icons.Default.GridView, contentDescription = null, tint = Color(0xFF555555))
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "All",
                    fontSize = 11.sp,
                    fontWeight = if (activeId == null) FontWeight.Bold else FontWeight.Medium,
                    color = if (activeId == null) Color.Black else Color(0xFF4B5563)
                )
            }
        }

        items(subCategories) { sub ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable { onSelectSub(sub._id) }
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .shadow(2.dp, RoundedCornerShape(16.dp))
                        .background(Color.White, RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    val urlStr = sub.image ?: sub.icon
                    if (urlStr != null) {
                        val fullUrl = if (urlStr.startsWith("http")) urlStr else "https://api.lfvs.in$urlStr"
                        AsyncImage(
                            model = fullUrl,
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(16.dp))
                        )
                    } else {
                        Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6), RoundedCornerShape(16.dp)))
                    }

                    if (activeId == sub._id) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color.White)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = sub.name,
                    fontSize = 11.sp,
                    fontWeight = if (activeId == sub._id) FontWeight.Bold else FontWeight.Medium,
                    color = if (activeId == sub._id) Color.Black else Color(0xFF4B5563),
                    textAlign = TextAlign.Center,
                    maxLines = 2,
                    modifier = Modifier.width(72.dp)
                )
            }
        }
    }
}
