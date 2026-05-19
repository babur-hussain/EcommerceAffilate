package com.localforvocalstartup.app.ui.pages

import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Tag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.Category
import com.localforvocalstartup.app.data.remote.NetworkClient
import kotlinx.coroutines.launch

private val FOR_YOU_ID = "for-you-special-id"

@Composable
fun CategoriesPageView(
    onProductClick: (com.localforvocalstartup.app.data.model.Product) -> Unit = {}
) {
    var categories by remember { mutableStateOf<List<Category>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedCategoryId by remember { mutableStateOf(FOR_YOU_ID) }
    var showGlobalSearch by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    val sidebarCategories = categories.filter { it.parentCategory == null }
    val subCategories = categories.filter { it.parentCategory == selectedCategoryId }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                categories = NetworkClient.apiService.getCategories()
                isLoading = false
            } catch (e: Exception) {
                // Log error
                isLoading = false
            }
        }
    }

    androidx.activity.compose.BackHandler(enabled = selectedCategoryId != FOR_YOU_ID) {
        selectedCategoryId = FOR_YOU_ID
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Row(modifier = Modifier.fillMaxSize().statusBarsPadding()) {
            // Left Sidebar (90dp width)
        Box(
            modifier = Modifier
                .width(90.dp)
                .fillMaxHeight()
                .background(Color(0xFFF0F2F5))
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    SidebarItem(
                        id = FOR_YOU_ID,
                        name = "For You",
                        icon = "Tag", // Just a flag
                        isSelected = selectedCategoryId == FOR_YOU_ID,
                        onClick = { selectedCategoryId = FOR_YOU_ID },
                        isCustom = true
                    )
                }

                items(sidebarCategories) { category ->
                    SidebarItem(
                        id = category._id,
                        name = category.name,
                        imageUrl = category.icon ?: category.image,
                        isSelected = selectedCategoryId == category._id,
                        onClick = { selectedCategoryId = category._id }
                    )
                }
            }
            
            // Right border line
            Box(
                modifier = Modifier
                    .width(1.dp)
                    .fillMaxHeight()
                    .background(Color(0xFFE5E7EB))
                    .align(Alignment.CenterEnd)
            )
        }

        // Right Content Area
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .background(Color.White)
        ) {
            if (selectedCategoryId == FOR_YOU_ID) {
                ForYouContentView()
            } else {
                CategoryRightPaneView(
                    categoryId = selectedCategoryId,
                    categoryName = categories.find { it._id == selectedCategoryId }?.name,
                    subCategoriesFromParent = subCategories,
                    onSearchTap = { showGlobalSearch = true }
                )
            }
        }
    }

    if (showGlobalSearch) {
        Box(modifier = Modifier.fillMaxSize().statusBarsPadding()) {
            com.localforvocalstartup.app.ui.pages.GlobalSearchView(
                onDismiss = { showGlobalSearch = false },
                categoryId = if (selectedCategoryId == FOR_YOU_ID) null else selectedCategoryId
            )
        }
    }
    }
}

@Composable
fun SidebarItem(
    id: String,
    name: String,
    imageUrl: String? = null,
    icon: String? = null,
    isSelected: Boolean,
    onClick: () -> Unit,
    isCustom: Boolean = false
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
            .clickable(onClick = onClick)
            .background(if (isSelected) Color.White else Color.Transparent)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp)
        ) {
            // Icon / Image Circle
                Box(
                    modifier = Modifier
                        .size(50.dp)
                        .background(
                            if (isCustom) Color(0xFFE0F2FE) else Color(0xFFF3F4F6),
                            shape = CircleShape
                        )
                        .clip(CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                if (icon == "Tag") {
                    Icon(
                        imageVector = Icons.Default.Tag,
                        contentDescription = "For You",
                        tint = Color(0xFF0284C7),
                        modifier = Modifier.size(20.dp)
                    )
                } else if (imageUrl != null) {
                    val fullUrl = if (imageUrl.startsWith("http")) imageUrl else "https://api.lfvs.in$imageUrl"
                    AsyncImage(
                        model = fullUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    Text(
                        text = name.take(1).uppercase(),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF9CA3AF)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = name,
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = if (isSelected) Color(0xFF2874F0) else Color(0xFF4B5563),
                textAlign = TextAlign.Center,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(horizontal = 2.dp)
            )
        }

        // Selection Indicator Bar
        if (isSelected) {
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .fillMaxHeight()
                    .background(Color(0xFF2874F0), RoundedCornerShape(topEnd = 2.dp, bottomEnd = 2.dp))
                    .align(Alignment.CenterStart)
            )
        }
    }
}

// MARK: - Content Components

@Composable
fun ForYouContentView() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Popular Store
        Text(
            text = "Popular Store",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            GridItemView(title = "Coming soon!", image = "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/2f85489d81944f0e.png?q=100", Modifier.weight(1f))
            GridItemView(title = "Live now", image = "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/43666d678be8c599.png?q=100", Modifier.weight(1f))
            GridItemView(title = "Harvest deals", image = "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/f18d2d6452292026.png?q=100", Modifier.weight(1f))
            GridItemView(title = "Sale is Live", image = "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/d96859345c292019.png?q=100", Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recently Viewed
        Text(
            text = "Recently Viewed Stores",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            item { StoreCardView("Mobiles", "https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imaghx9qygjjg8hz.jpeg?q=70") }
            item { StoreCardView("Men's Clothing", "https://rukminim1.flixcart.com/image/612/612/xif0q/shoe/7/z/r/8-white-leaf-8-urbanbox-white-original-imagvgf4cuzs2hrw.jpeg?q=70") }
            item { StoreCardView("Blankets", "https://rukminim1.flixcart.com/image/612/612/kc54b0w0/blanket/q/d/a/ultra-soft-warm-single-bed-mink-blanket-for-winter-brown-original-imaftc6gh9z3z3gz.jpeg?q=70") }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Have you tried
        Text(
            text = "Have you tried?",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Start
        ) {
            Box(Modifier.weight(1f)) {
                GridItemView("Flipkart UPI", "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/4890d7945d81b835.png?q=100", isRound = true)
            }
            Box(Modifier.weight(1f)) {
                GridItemView("SuperCoin", "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/913e9a786d149090.png?q=100", isRound = true)
            }
            Box(Modifier.weight(1f)) {
                GridItemView("Plus Zone", "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/21a5ebeb69248446.png?q=100", isRound = true)
            }
        }
        
        Spacer(modifier = Modifier.height(100.dp))
    }
}

@Composable
fun GridItemView(title: String, image: String, modifier: Modifier = Modifier, isRound: Boolean = false) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
    ) {
        Box(
            modifier = Modifier
                .size(70.dp)
                .background(if (isRound) Color(0xFFF3F4F6) else Color.White, shape = if (isRound) CircleShape else RoundedCornerShape(16.dp))
                .clip(if (isRound) CircleShape else RoundedCornerShape(16.dp))
        ) {
            AsyncImage(
                model = image,
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxSize()
            )
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = title,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF1F2937),
            textAlign = TextAlign.Center,
            maxLines = 2,
            lineHeight = 16.sp
        )
    }
}

@Composable
fun StoreCardView(title: String, image: String) {
    Card(
        modifier = Modifier.width(120.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(8.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .padding(8.dp)
                .fillMaxWidth()
        ) {
            AsyncImage(
                model = image,
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .size(100.dp)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = title,
                fontSize = 12.sp,
                color = Color(0xFF374151),
                textAlign = TextAlign.Center,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
