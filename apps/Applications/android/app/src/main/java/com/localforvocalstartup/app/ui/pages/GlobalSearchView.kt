package com.localforvocalstartup.app.ui.pages

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.ui.viewmodel.SearchState
import com.localforvocalstartup.app.ui.viewmodel.SearchViewModel

object SearchTheme {
    val SearchPrimary = Color(0xFF144BB8)
    val SearchBackground = Color(0xFFF6F6F8)
    val SearchTextDark = Color(0xFF111318)
    val SearchTextGrey = Color(0xFF636F88)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GlobalSearchView(
    onDismiss: () -> Unit = {},
    categoryId: String? = null
) {
    val viewModel: SearchViewModel = viewModel()
    val query by viewModel.query.collectAsState()
    val searchState by viewModel.searchState.collectAsState()
    val globalResults by viewModel.globalResults.collectAsState()
    val groceryResults by viewModel.groceryResults.collectAsState()
    val trendingTerms by viewModel.trendingTerms.collectAsState()

    var selectedResultTab by remember { mutableStateOf("All") }
    val resultTabs = listOf("All", "Products", "Groceries")
    
    val filters = listOf("Brand", "Size", "Color", "Price", "Rating")
    var selectedFilter by remember { mutableStateOf("Brand") }

    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    androidx.activity.compose.BackHandler {
        onDismiss()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SearchTheme.SearchBackground)
            .imePadding()
    ) {
        // Custom Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onDismiss) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = SearchTheme.SearchTextDark)
            }
            Spacer(modifier = Modifier.weight(1f))
            Text("Search", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = SearchTheme.SearchTextDark)
            Spacer(modifier = Modifier.weight(1f))
            IconButton(onClick = {}) {
                Icon(Icons.Default.ShoppingCart, contentDescription = "Bag", tint = SearchTheme.SearchTextDark)
            }
        }

        // Search Bar Container
        Box(
            modifier = Modifier
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .fillMaxWidth()
                .shadow(2.dp, RoundedCornerShape(12.dp))
                .background(Color.White, RoundedCornerShape(12.dp))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = SearchTheme.SearchTextGrey)
                Spacer(modifier = Modifier.width(8.dp))
                TextField(
                    value = query,
                    onValueChange = { viewModel.setQuery(it) },
                    modifier = Modifier
                        .weight(1f)
                        .focusRequester(focusRequester),
                    placeholder = { Text("Search products & groceries...", color = Color.Black, fontSize = 16.sp) },
                    colors = TextFieldDefaults.textFieldColors(
                        containerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent,
                        cursorColor = SearchTheme.SearchPrimary,
                        focusedTextColor = SearchTheme.SearchTextDark,
                        unfocusedTextColor = SearchTheme.SearchTextDark
                    ),
                    singleLine = true
                )
                if (query.isNotEmpty()) {
                    IconButton(
                        onClick = { 
                            viewModel.setQuery("")
                            selectedResultTab = "All" 
                        },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Clear", tint = SearchTheme.SearchTextGrey)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Main Content Area
        if (query.isEmpty() && globalResults == null && groceryResults == null) {
            // Live Suggestions / Trending
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "LIVE SUGGESTIONS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = SearchTheme.SearchTextGrey,
                    letterSpacing = 0.5.sp,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp)
                )
                val suggestions = if (trendingTerms.isEmpty()) {
                    listOf("Oversized Hoodie", "Rice", "Oversized T-shirt", "Oil", "Milk")
                } else trendingTerms

                suggestions.forEach { term ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { viewModel.setQuery(term) }
                            .padding(horizontal = 20.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.White)
                                .shadow(1.dp, RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Search, contentDescription = null, tint = SearchTheme.SearchTextDark, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(term, fontSize = 16.sp, fontWeight = FontWeight.Medium, color = SearchTheme.SearchTextDark, modifier = Modifier.weight(1f))
                        Icon(Icons.Default.CallMade, contentDescription = null, tint = SearchTheme.SearchTextGrey, modifier = Modifier.size(16.dp))
                    }
                }
            }
        } else {
            when (searchState) {
                is SearchState.Loading -> {
                    // Loading Skeleton
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        contentPadding = PaddingValues(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(4) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.Gray.copy(alpha = 0.2f))
                            )
                        }
                    }
                }
                is SearchState.Error -> {
                    val msg = (searchState as SearchState.Error).message
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("Error: $msg", color = Color.Red)
                    }
                }
                else -> {
                    if (viewModel.hasAnyResults) {
                        Column(modifier = Modifier.fillMaxSize()) {
                            // Tabs
                            if (viewModel.isUnifiedSearch) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Color.White)
                                        .padding(horizontal = 16.dp)
                                ) {
                                    resultTabs.forEach { tab ->
                                        val count = when (tab) {
                                            "Products" -> globalResults?.products?.size ?: 0
                                            "Groceries" -> groceryResults?.products?.size ?: 0
                                            else -> (globalResults?.products?.size ?: 0) + (groceryResults?.products?.size ?: 0)
                                        }
                                        Column(
                                            modifier = Modifier
                                                .weight(1f)
                                                .clickable { selectedResultTab = tab }
                                                .padding(top = 12.dp),
                                            horizontalAlignment = Alignment.CenterHorizontally
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Text(
                                                    text = tab,
                                                    fontSize = 14.sp,
                                                    fontWeight = if (selectedResultTab == tab) FontWeight.Bold else FontWeight.Medium,
                                                    color = if (selectedResultTab == tab) SearchTheme.SearchPrimary else SearchTheme.SearchTextGrey
                                                )
                                                if (count > 0) {
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Text(
                                                        text = "($count)",
                                                        fontSize = 12.sp,
                                                        fontWeight = FontWeight.SemiBold,
                                                        color = if (selectedResultTab == tab) SearchTheme.SearchPrimary else SearchTheme.SearchTextGrey
                                                    )
                                                }
                                            }
                                            Spacer(modifier = Modifier.height(8.dp))
                                            Box(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .height(2.dp)
                                                    .background(if (selectedResultTab == tab) SearchTheme.SearchPrimary else Color.Transparent)
                                            )
                                        }
                                    }
                                }
                            }
                            
                            // Results Content
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(2),
                                contentPadding = PaddingValues(16.dp),
                                horizontalArrangement = Arrangement.spacedBy(16.dp),
                                verticalArrangement = Arrangement.spacedBy(20.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                // Products
                                val showProducts = selectedResultTab == "All" || selectedResultTab == "Products"
                                val pList = globalResults?.products ?: emptyList()
                                if (showProducts && pList.isNotEmpty()) {
                                    item(span = { GridItemSpan(2) }) {
                                        Column {
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Icon(Icons.Default.ShoppingCart, contentDescription = null, tint = SearchTheme.SearchPrimary, modifier = Modifier.size(16.dp))
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Text("Products", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = SearchTheme.SearchTextDark)
                                                Spacer(modifier = Modifier.weight(1f))
                                                Text("${pList.size} items", fontSize = 14.sp, color = SearchTheme.SearchTextGrey)
                                            }
                                            Spacer(modifier = Modifier.height(16.dp))
                                            LazyRow(
                                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                                modifier = Modifier.fillMaxWidth()
                                            ) {
                                                items(filters) { filter ->
                                                    val isSelected = selectedFilter == filter
                                                    Box(
                                                        modifier = Modifier
                                                            .shadow(if (isSelected) 2.dp else 1.dp, RoundedCornerShape(20.dp))
                                                            .background(if (isSelected) SearchTheme.SearchPrimary else Color.White, RoundedCornerShape(20.dp))
                                                            .clickable { selectedFilter = filter }
                                                            .padding(horizontal = 16.dp, vertical = 8.dp)
                                                    ) {
                                                        Text(
                                                            text = filter,
                                                            fontSize = 13.sp,
                                                            fontWeight = FontWeight.Bold,
                                                            color = if (isSelected) Color.White else SearchTheme.SearchTextDark
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    items(pList) { product ->
                                        ModernProductCard(product) {
                                            com.localforvocalstartup.app.data.manager.NavigationManager.navigate("product/${product.id}")
                                            onDismiss()
                                        }
                                    }
                                }
                                
                                // Divider
                                val showGroceries = selectedResultTab == "All" || selectedResultTab == "Groceries"
                                val gList = groceryResults?.products ?: emptyList()
                                if (showProducts && pList.isNotEmpty() && showGroceries && gList.isNotEmpty() && selectedResultTab == "All") {
                                    item(span = { GridItemSpan(2) }) {
                                        Divider(color = Color.Gray.copy(alpha = 0.15f), modifier = Modifier.padding(vertical = 8.dp))
                                    }
                                }

                                // Groceries
                                if (showGroceries && gList.isNotEmpty()) {
                                    item(span = { GridItemSpan(2) }) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(Icons.Default.ShoppingCart, contentDescription = null, tint = Color.Green, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Text("Groceries", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = SearchTheme.SearchTextDark)
                                            Spacer(modifier = Modifier.weight(1f))
                                            Text("${gList.size} items", fontSize = 14.sp, color = SearchTheme.SearchTextGrey)
                                        }
                                    }
                                    items(gList) { product ->
                                        ModernProductCard(product, isGrocery = true) {
                                            com.localforvocalstartup.app.data.manager.NavigationManager.openGroceryProduct(product.id)
                                            onDismiss()
                                        }
                                    }
                                }
                            }
                        }
                    } else if (globalResults != null || groceryResults != null) {
                        Column(
                            modifier = Modifier.fillMaxSize().padding(top = 60.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(Icons.Default.Search, contentDescription = null, tint = Color.Gray.copy(alpha = 0.5f), modifier = Modifier.size(40.dp))
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("No results found", color = SearchTheme.SearchTextGrey, fontSize = 16.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ModernProductCard(product: Product, isGrocery: Boolean = false, onClick: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Image Container
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
                .background(Color(0xFFF3F4F6), RoundedCornerShape(12.dp))
                .clip(RoundedCornerShape(12.dp))
        ) {
            val imageUrl = product.images.firstOrNull() ?: ""
            var cleanPath = imageUrl.replace("\\", "/")
            if (cleanPath.isNotEmpty()) {
                val fullUrl = if (cleanPath.startsWith("http")) cleanPath else "https://api.ecommerceearn.com/${cleanPath.removePrefix("/")}"
                
                AsyncImage(
                    model = fullUrl,
                    contentDescription = product.displayName,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Icon(Icons.Default.Image, contentDescription = null, tint = Color.Gray, modifier = Modifier.align(Alignment.Center))
            }

            // Favorite Button
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
                    .size(28.dp)
                    .background(Color.White.copy(alpha = 0.7f), CircleShape)
                    .clickable { },
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.FavoriteBorder, contentDescription = null, tint = SearchTheme.SearchTextDark, modifier = Modifier.size(14.dp))
            }
        }

        // Details
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = product.displayName,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = SearchTheme.SearchTextDark,
                maxLines = 1
            )
            Text(
                text = product.category ?: "General",
                fontSize = 12.sp,
                color = SearchTheme.SearchTextGrey,
                maxLines = 1
            )
            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 2.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "₹${product.price.toInt()}",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = SearchTheme.SearchPrimary
                )
                Spacer(modifier = Modifier.weight(1f))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFFFD700), modifier = Modifier.size(10.dp))
                    Spacer(modifier = Modifier.width(2.dp))
                    Text(
                        text = String.format("%.1f", product.rating ?: 0.0),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = SearchTheme.SearchTextDark
                    )
                }
            }
        }
    }
}
