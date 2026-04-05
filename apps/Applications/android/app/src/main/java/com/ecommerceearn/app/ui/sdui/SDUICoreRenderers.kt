package com.ecommerceearn.app.ui.sdui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
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
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.data.remote.getProducts
import com.google.gson.JsonObject
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// ——————————————————————————————————
// MARK: - Hero Carousel
// ——————————————————————————————————
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun RenderCarousel(component: SDUIComponent) {
    val items = component.decodeItems("items", JsonObject::class.java)
    if (items.isEmpty()) {
        Box(modifier = Modifier.fillMaxWidth().aspectRatio(21f / 9f).background(Color(0xFFF3F4F6)))
        return
    }

    val pagerState = rememberPagerState(pageCount = { items.size })

    // Auto-scroll logic with interaction pause
    LaunchedEffect(pagerState.isScrollInProgress, pagerState.currentPage) {
        if (!pagerState.isScrollInProgress) {
            delay(5000)
            val nextPage = (pagerState.currentPage + 1) % items.size
            pagerState.animateScrollToPage(nextPage)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .clip(RoundedCornerShape(16.dp)) // Corner radius on the container
        ) { page ->
            val item = items[page]
            val imageUrl = item.get("imageUrl")?.asString ?: item.get("image")?.asString
            val actionUrl = item.get("actionUrl")?.asString

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(21f / 9f)
                    .clickable {
                        actionUrl?.let {
                            // TODO: Navigation
                        }
                    }
            ) {
                AsyncImage(
                    model = imageUrl,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop // Replicates scaledToFill
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Lightweight indicator view mirroring iOS
        Row(
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            repeat(items.size) { index ->
                val isSelected = pagerState.currentPage == index
                Box(
                    modifier = Modifier
                        .height(4.dp)
                        .width(if (isSelected) 24.dp else 8.dp)
                        .clip(RoundedCornerShape(50)) // Capsule shape
                        .background(if (isSelected) Color(0xFF111827) else Color.Gray.copy(alpha = 0.3f))
                )
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - Category Circles
// ——————————————————————————————————
@Composable
fun RenderCategoryCircles(component: SDUIComponent) {
    val items = component.decodeItems("items", JsonObject::class.java)

    LazyRow(
        contentPadding = PaddingValues(horizontal = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp)
    ) {
        items(items) { item ->
            val name = item.get("name")?.asString ?: ""
            val imageUrl = item.get("imageUrl")?.asString ?: item.get("image")?.asString ?: item.get("icon")?.asString

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.width(72.dp)
            ) {
                AsyncImage(
                    model = imageUrl,
                    contentDescription = name,
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFF3F4F6)),
                    contentScale = ContentScale.Crop
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = name,
                    fontSize = 11.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = Color(0xFF374151),
                    lineHeight = 14.sp
                )
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - Banner
// ——————————————————————————————————
@Composable
fun RenderBanner(component: SDUIComponent) {
    val height = component.props?.get("height")?.asFloat ?: 150f
    val imageUrl = component.props?.get("imageUrl")?.asString ?: component.props?.get("image")?.asString

    AsyncImage(
        model = imageUrl,
        contentDescription = null,
        modifier = Modifier
            .fillMaxWidth()
            .height(height.dp)
            .padding(horizontal = 12.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(12.dp)),
        contentScale = ContentScale.Crop
    )
}

// ——————————————————————————————————
// MARK: - Grid
// ——————————————————————————————————
@Composable
fun RenderGrid(component: SDUIComponent) {
    val items = component.decodeItems("items", JsonObject::class.java)
    val columns = component.props?.get("columns")?.asInt ?: 2
    val title = component.props?.get("title")?.asString

    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
        if (!title.isNullOrBlank()) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937),
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }

        // Use a simple Column + Row layout instead of LazyVerticalGrid (avoids nested scrolling)
        val rows = items.chunked(columns)
        rows.forEach { row ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                row.forEach { item ->
                    val imageUrl = item.get("imageUrl")?.asString ?: item.get("image")?.asString
                    val label = item.get("title")?.asString ?: item.get("name")?.asString ?: ""

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .padding(vertical = 4.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        AsyncImage(
                            model = imageUrl,
                            contentDescription = label,
                            modifier = Modifier
                                .fillMaxWidth()
                                .aspectRatio(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFFF9FAFB)),
                            contentScale = ContentScale.Crop
                        )
                        if (label.isNotBlank()) {
                            Text(
                                text = label,
                                fontSize = 12.sp,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis,
                                color = Color(0xFF374151),
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }
                // Fill remaining space if row is not full
                repeat(columns - row.size) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - Horizontal List
// ——————————————————————————————————
@Composable
fun RenderHorizontalList(component: SDUIComponent) {
    val items = component.decodeItems("items", JsonObject::class.java)
    val title = component.props?.get("title")?.asString

    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        if (!title.isNullOrBlank()) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
            )
        }

        LazyRow(
            contentPadding = PaddingValues(horizontal = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                val imageUrl = item.get("imageUrl")?.asString ?: item.get("image")?.asString
                val label = item.get("title")?.asString ?: item.get("name")?.asString ?: ""

                Column(
                    modifier = Modifier.width(140.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    AsyncImage(
                        model = imageUrl,
                        contentDescription = label,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFFF9FAFB)),
                        contentScale = ContentScale.Crop
                    )
                    if (label.isNotBlank()) {
                        Text(
                            text = label,
                            fontSize = 12.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            color = Color(0xFF374151),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - Product List (Vertical)
// ——————————————————————————————————
@Composable
fun RenderProductList(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString
    val limit = component.props?.get("limit")?.asInt ?: 10
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(component.uniqueId) {
        try {
            products = NetworkClient.apiService.getProducts(limit)
        } catch (_: Exception) {}
        isLoading = false
    }

    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        if (!title.isNullOrBlank()) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
        }

        if (isLoading) {
            Box(modifier = Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp))
            }
        } else {
            // Two-column grid using Column+Row to avoid nested scroll issue
            val rows = products.chunked(2)
            rows.forEach { row ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    row.forEach { product ->
                        SDUIProductCard(product, modifier = Modifier.weight(1f))
                    }
                    if (row.size < 2) Spacer(modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - Product List Horizontal
// ——————————————————————————————————
@Composable
fun RenderProductListHorizontal(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: ""
    val limit = component.props?.get("limit")?.asInt ?: 10
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(component.uniqueId) {
        try {
            products = NetworkClient.apiService.getProducts(limit)
        } catch (_: Exception) {}
        isLoading = false
    }

    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        if (title.isNotBlank()) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
            )
        }

        if (isLoading) {
            Box(modifier = Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp))
            }
        } else {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(products) { product ->
                    SDUIProductCard(product, modifier = Modifier.width(160.dp))
                }
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - Generic Section Renderer
// ——————————————————————————————————
@Composable
fun RenderGenericSection(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString
    val imageUrl = component.props?.get("imageUrl")?.asString ?: component.props?.get("image")?.asString
    val subtitle = component.props?.get("subtitle")?.asString ?: component.props?.get("description")?.asString

    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp)) {
        if (!title.isNullOrBlank()) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937),
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }
        if (!subtitle.isNullOrBlank()) {
            Text(text = subtitle, fontSize = 13.sp, color = Color(0xFF6B7280), modifier = Modifier.padding(bottom = 8.dp))
        }
        if (!imageUrl.isNullOrBlank()) {
            AsyncImage(
                model = imageUrl,
                contentDescription = title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFF9FAFB)),
                contentScale = ContentScale.Crop
            )
        }

        // Render children if any
        component.children?.forEach { child ->
            SDUIComponentView(component = child)
        }

        // Decode and render items if present
        val items = component.decodeItems("items", JsonObject::class.java)
        if (items.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(items) { item ->
                    val itemImage = item.get("imageUrl")?.asString ?: item.get("image")?.asString
                    val itemLabel = item.get("title")?.asString ?: item.get("name")?.asString ?: ""

                    Column(modifier = Modifier.width(130.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        AsyncImage(
                            model = itemImage,
                            contentDescription = itemLabel,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFFF9FAFB)),
                            contentScale = ContentScale.Crop
                        )
                        if (itemLabel.isNotBlank()) {
                            Text(text = itemLabel, fontSize = 11.sp, maxLines = 2, overflow = TextOverflow.Ellipsis, color = Color(0xFF374151), modifier = Modifier.padding(top = 4.dp))
                        }
                    }
                }
            }
        }
    }
}

// ——————————————————————————————————
// MARK: - SDUI Product Card (Shared)
// ——————————————————————————————————
@Composable
fun SDUIProductCard(product: Product, modifier: Modifier = Modifier) {
    val discountPercent = product.discountPercentage ?: run {
        val mrp = product.mrp ?: return@run 0
        if (mrp > product.price) (((mrp - product.price) / mrp) * 100).toInt() else 0
    }

    Card(
        modifier = modifier.padding(vertical = 4.dp),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            Box(modifier = Modifier.fillMaxWidth().height(130.dp)) {
                AsyncImage(
                    model = product.images.firstOrNull(),
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize().background(Color(0xFFF9FAFB)),
                    contentScale = ContentScale.Crop
                )
                if (discountPercent > 0) {
                    Box(modifier = Modifier.align(Alignment.TopStart).padding(6.dp).background(Color(0xFFEF4444), RoundedCornerShape(4.dp))) {
                        Text("-$discountPercent%", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
            }

            Column(modifier = Modifier.padding(8.dp)) {
                Text(product.name ?: "", fontSize = 12.sp, fontWeight = FontWeight.Medium, maxLines = 2, overflow = TextOverflow.Ellipsis, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("₹${product.price.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4F46E5))
                    if (product.mrp != null && product.mrp > product.price) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("₹${product.mrp.toInt()}", fontSize = 10.sp, textDecoration = TextDecoration.LineThrough, color = Color(0xFF9CA3AF))
                    }
                }
                if (product.rating != null) {
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 2.dp)) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(10.dp))
                        Spacer(modifier = Modifier.width(2.dp))
                        Text(String.format("%.1f", product.rating), fontSize = 10.sp, color = Color(0xFF6B7280))
                    }
                }
            }
        }
    }
}
