package com.ecommerceearn.app.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Category
import com.ecommerceearn.app.data.remote.NetworkClient
import kotlinx.coroutines.launch

// Constants
private val SIDEBAR_WIDTH = 90.dp
private const val FOR_YOU_ID = "for-you-special-id"

@Composable
fun CategoriesScreen(
    onProductClick: (com.ecommerceearn.app.data.model.Product) -> Unit = {}
) {
    var categories by remember { mutableStateOf<List<Category>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var selectedCategoryId by remember { mutableStateOf(FOR_YOU_ID) }
    
    // Fetch Data
    LaunchedEffect(Unit) {
        try {
            categories = NetworkClient.apiService.getCategories()
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            loading = false
        }
    }

    // Filter Logic matches React Native
    val sidebarCategories = remember(categories) {
        categories.filter { it.parentCategory == null }
    }

    val currentSubCategories = remember(categories, selectedCategoryId) {
        categories.filter { it.parentCategory == selectedCategoryId }
    }

    val selectedCategory = remember(categories, selectedCategoryId) {
        categories.find { it._id == selectedCategoryId }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // --- Header (All Categories) ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "All Categories",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                Icon(Icons.Outlined.Search, contentDescription = "Search", tint = Color.Black)
                Icon(Icons.Outlined.ShoppingCart, contentDescription = "Cart", tint = Color.Black)
            }
        }
        Divider(color = Color(0xFFF0F0F0))

        if (loading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFF2874F0))
            }
        } else {
            Row(modifier = Modifier.fillMaxSize()) {
                // --- Left Sidebar ---
                LazyColumn(
                    modifier = Modifier
                        .width(SIDEBAR_WIDTH)
                        .fillMaxHeight()
                        .background(Color(0xFFF0F2F5))
                        .drawBehind {
                            drawLine(
                                color = Color(0xFFE5E7EB),
                                start = androidx.compose.ui.geometry.Offset(size.width, 0f),
                                end = androidx.compose.ui.geometry.Offset(size.width, size.height),
                                strokeWidth = 1.dp.toPx()
                            )
                        }
                ) {
                    // For You Item
                    item {
                        SidebarItem(
                            isSelected = selectedCategoryId == FOR_YOU_ID,
                            name = "For You",
                            onClick = { selectedCategoryId = FOR_YOU_ID }
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(Color(0xFFE0F2FE)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Outlined.Star, // Using Star as closest to "local-offer"
                                    contentDescription = null,
                                    tint = Color(0xFF0284C7),
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                    }

                    items(sidebarCategories) { category ->
                        SidebarItem(
                            isSelected = selectedCategoryId == category._id,
                            name = category.name,
                            onClick = { selectedCategoryId = category._id },
                            imageUrl = category.image ?: category.icon
                        )
                    }
                }

                // --- Right Content Area ---
                // We use Box to stack content, or just column
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .background(Color(0xFFF9FAFB))
                ) {
                    if (selectedCategoryId == FOR_YOU_ID) {
                        ForYouView()
                    } else if (selectedCategory?.slug == "fashion" || selectedCategory?.name?.equals("Fashion", ignoreCase = true) == true) {
                        SDUIPage(slug = "fashion", onProductClick = onProductClick)
                    } else {
                        // Category Header (Gradient)
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    Brush.horizontalGradient(
                                        colors = listOf(Color(0xFFFFFFFF), Color(0xFFE3F2FD), Color(0xFFD6EBFF))
                                    )
                                )
                                .padding(horizontal = 16.dp, vertical = 14.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = selectedCategory?.name ?: "",
                                        fontSize = 20.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF2874F0)
                                    )
                                    Icon(
                                        Icons.Default.KeyboardArrowRight,
                                        contentDescription = null,
                                        tint = Color(0xFF2874F0),
                                        modifier = Modifier.size(26.dp)
                                    )
                                }
                                
                                // Category Image on right
                                AsyncImage(
                                    model = selectedCategory?.image ?: selectedCategory?.icon,
                                    contentDescription = null,
                                    modifier = Modifier.size(50.dp),
                                    contentScale = ContentScale.Fit
                                )
                            }
                        }

                        // Subcategories List with Groups
                        if (currentSubCategories.isNotEmpty()) {
                            SubCategoryGroupList(
                                subCategories = currentSubCategories,
                                groupOrder = selectedCategory?.subCategoryGroupOrder ?: emptyList()
                            )
                        } else {
                            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("No subcategories found.", color = Color.Gray)
                                    Spacer(modifier = Modifier.height(16.dp))
                                    Button(
                                        onClick = { /* Navigate to category products */ },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
                                        shape = RoundedCornerShape(6.dp)
                                    ) {
                                        Text("Explore Products")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// --- Sidebar Components ---
@Composable
fun SidebarItem(
    isSelected: Boolean,
    name: String,
    onClick: () -> Unit,
    imageUrl: String? = null,
    customIcon: @Composable (() -> Unit)? = null
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(if (isSelected) Color.White else Color.Transparent)
            .clickable { onClick() }
            .padding(vertical = 16.dp)
    ) {
        // Blue Indicator Strip
        if (isSelected) {
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .fillMaxHeight()
                    .background(
                        Color(0xFF2874F0),
                        RoundedCornerShape(topEnd = 4.dp, bottomEnd = 4.dp)
                    )
                    .align(Alignment.CenterStart)
            )
        }

        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Icon Circle
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(if ((imageUrl == null || imageUrl.isBlank()) && customIcon == null) Color(0xFFF3F4F6) else Color.Transparent)
            ) {
                if (customIcon != null) {
                    customIcon()
                } else if (!imageUrl.isNullOrBlank()) {
                    AsyncImage(
                        model = imageUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Fit,
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    // Fallback Text Initials
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(
                            text = name.firstOrNull()?.toString() ?: "",
                            fontSize = 18.sp,
                            color = Color(0xFF9CA3AF)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(6.dp))
            
            Text(
                text = name,
                fontSize = 11.sp,
                color = if (isSelected) Color(0xFF2874F0) else Color(0xFF4B5563),
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 4.dp),
                lineHeight = 14.sp
            )
        }
    }
}

// --- Subcategory Grouping Logic ---
@Composable
fun SubCategoryGroupList(
    subCategories: List<Category>,
    groupOrder: List<String>
) {
    // Logic: Group by `group` -> Sort -> Render
    val grouped = remember(subCategories) {
        subCategories.groupBy { it.group ?: "Other" }
    }
    
    val sortedGroups = remember(grouped, groupOrder) {
        grouped.entries.sortedWith(Comparator { a, b ->
            if (a.key == "Other") return@Comparator 1
            if (b.key == "Other") return@Comparator -1
            
            val indexA = groupOrder.indexOf(a.key)
            val indexB = groupOrder.indexOf(b.key)
            
            when {
                indexA != -1 && indexB != -1 -> indexA - indexB
                indexA != -1 -> -1
                indexB != -1 -> 1
                else -> a.key.compareTo(b.key)
            }
        })
    }
    
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp)
    ) {
        items(sortedGroups) { (groupName, items) ->
            SubCategoryGroupSection(groupName, items)
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun SubCategoryGroupSection(groupName: String, items: List<Category>) {
    var expanded by remember { mutableStateOf(false) }
    val displayItems = if (items.size > 7 && !expanded) items.take(7) else items
    val showViewAll = items.size > 7 && !expanded
    val showViewLess = items.size > 7 && expanded

    Column {
        Text(
            text = groupName,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1F2937),
            modifier = Modifier.padding(bottom = 12.dp, top = 4.dp)
        )
        
        // Custom Grid Layout using FlowRow logic manually since we are inside LazyColumn item
        // A simple Column of Rows or non-lazy FlowRow is needed. 
        // Since standard compose FlowRow is experimental, let's just use a simple manual grid 
        // or a nested Column with Rows.
        
        // Calculating rows needed (3 items per row)
        val chunkedItems = displayItems.chunked(3)
        // Adjust for View All button being the "8th" item if truncated
        // If truncated (size 7), the 7th item is displayed, and then View All is the 8th (middle of 3rd row?)
        // Wait, Native app logic: "items.slice(0, 7) ... View All"
        // That means 3 rows: [3], [3], [1 + View All]
        
        SubCategoryGrid(
            items = displayItems, 
            onExpand = { expanded = true },
            onCollapse = { expanded = false },
            showViewAll = showViewAll,
            showViewLess = showViewLess
        )
    }
}

@Composable
fun SubCategoryGrid(
    items: List<Category>,
    onExpand: () -> Unit,
    onCollapse: () -> Unit,
    showViewAll: Boolean,
    showViewLess: Boolean
) {
    // We render items in a flow layout.
    // Combining actual items + potential action button into a single list specifically for rendering
    // This is purely for layout ease.
    
    Column {
        val allRenderables: MutableList<RenderableItem> = items.map { RenderableItem.CategoryItem(it) }.toMutableList()
        if (showViewAll) allRenderables.add(RenderableItem.ActionItem("View All", true))
        if (showViewLess) allRenderables.add(RenderableItem.ActionItem("Show Less", false))
        
        allRenderables.chunked(3).forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.Start
            ) {
                rowItems.forEach { item ->
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                        when (item) {
                            is RenderableItem.CategoryItem -> SubCategoryItemView(item.category)
                            is RenderableItem.ActionItem -> ActionItemView(item.label, item.isExpand, if(item.isExpand) onExpand else onCollapse)
                        }
                    }
                }
                // Fill remaining space if last row has fewer than 3 items
                if (rowItems.size < 3) {
                    repeat(3 - rowItems.size) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

sealed class RenderableItem {
    data class CategoryItem(val category: Category) : RenderableItem()
    data class ActionItem(val label: String, val isExpand: Boolean) : RenderableItem()
}

@Composable
fun SubCategoryItemView(category: Category) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { /* Navigate */ }
    ) {
        Box(
            modifier = Modifier
                .size(75.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color(0xFFEFF6FF))
                .border(0.5.dp, Color(0xFFDBEAFE), RoundedCornerShape(20.dp))
                .padding(6.dp),
            contentAlignment = Alignment.Center
        ) {
            AsyncImage(
                model = category.image ?: category.icon,
                contentDescription = null,
                contentScale = ContentScale.Fit, // Fixed: Contain -> Fit
                modifier = Modifier.fillMaxSize()
            )
        }
        Text(
            text = category.name,
            fontSize = 11.sp,
            color = Color(0xFF111827),
            textAlign = TextAlign.Center,
            lineHeight = 13.sp,
            maxLines = 2,
            modifier = Modifier.padding(top = 6.dp).width(75.dp)
        )
    }
}

@Composable
fun ActionItemView(label: String, isExpand: Boolean, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .size(75.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color(0xFFEFF6FF))
                .border(0.5.dp, Color(0xFFDBEAFE), RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                if (isExpand) Icons.Default.KeyboardArrowDown else Icons.Default.KeyboardArrowUp,
                contentDescription = null,
                tint = Color(0xFF3B82F6), // Blue
                modifier = Modifier.size(30.dp)
            )
        }
        Text(
            text = label,
            fontSize = 11.sp,
            color = Color(0xFF111827),
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 6.dp)
        )
    }
}


// --- For You View ---
@Composable
fun ForYouView() {
    LazyColumn(contentPadding = PaddingValues(bottom = 100.dp)) {
        // Popular Store
        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Popular Store",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827),
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                     // Mock Items matching Native
                     ForYouGridItem("Coming soon!", "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/2f85489d81944f0e.png?q=100")
                     ForYouGridItem("Live now", "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/43666d678be8c599.png?q=100")
                     ForYouGridItem("Harvest deals", "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/f18d2d6452292026.png?q=100")
                }
            }
        }
        
        // Recently Viewed Stores
        item {
            Column(modifier = Modifier.padding(top = 24.dp)) {
                 Text(
                    text = "Recently Viewed Stores",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827),
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 16.dp)
                )
                
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    item { StoreCard("Mobiles", "https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imaghx9qygjjg8hz.jpeg?q=70") }
                    item { StoreCard("Men's Clothing", "https://rukminim1.flixcart.com/image/612/612/xif0q/shoe/7/z/r/8-white-leaf-8-urbanbox-white-original-imagvgf4cuzs2hrw.jpeg?q=70") }
                    item { StoreCard("Blankets", "https://rukminim1.flixcart.com/image/612/612/kc54b0w0/blanket/q/d/a/ultra-soft-warm-single-bed-mink-blanket-for-winter-brown-original-imaftc6gh9z3z3gz.jpeg?q=70") }
                }
            }
        }
    }
}

@Composable
fun ForYouGridItem(title: String, imageUrl: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(100.dp)
    ) {
        Box(
            modifier = Modifier
                .size(70.dp)
                .background(Color.White)
                .padding(4.dp)
        ) {
            AsyncImage(model = imageUrl, contentDescription = null, contentScale = ContentScale.Fit) // Fixed: Contain -> Fit (already done above, reusing logic)
        }
        Text(
            text = title,
            fontSize = 12.sp,
            textAlign = TextAlign.Center,
            color = Color(0xFF1F2937),
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

@Composable
fun StoreCard(title: String, imageUrl: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(120.dp)
            .border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(8.dp))
            .padding(8.dp)
    ) {
         AsyncImage(
             model = imageUrl, 
             contentDescription = null, 
             modifier = Modifier.size(100.dp),
             contentScale = ContentScale.Fit // Fixed: Contain -> Fit
         )
         Text(
             text = title,
             fontSize = 12.sp,
             color = Color(0xFF374151),
             textAlign = TextAlign.Center,
             modifier = Modifier.padding(top = 8.dp)
         )
    }
}
