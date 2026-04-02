package com.ecommerceearn.app.ui.components.bannerPages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.BTSProduct
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.safeParseColor

// Theme Colors for SchoolFour
private val primaryPurple = Color(0xFF7C3AED)
private val accentPink = Color(0xFFEC4899)
private val lightPurple = Color(0xFFE9D5FF)

// ============= SchoolFour Header View =============

@Composable
fun SchoolFourHeaderView(
    component: SDUIComponent
) {
    Column(
        modifier = Modifier.padding(bottom = 16.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(280.dp)
        ) {
            // Background Image
            AsyncImage(
                model = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )

            // Gradient Overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Black.copy(alpha = 0.3f),
                                Color.Black.copy(alpha = 0.6f)
                            )
                        )
                    )
            )

            // Top Navigation
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 48.dp, start = 16.dp, end = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Menu",
                        tint = Color.White
                    )
                }

                Text(
                    text = "School Store",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color.White.copy(alpha = 0.2f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = "Favorites",
                            tint = Color.White
                        )
                    }
                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color.White.copy(alpha = 0.2f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingCart,
                            contentDescription = "Cart",
                            tint = Color.White
                        )
                    }
                }
            }

            // Main Content
            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(horizontal = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "BACK TO",
                    fontSize = 16.sp,
                    letterSpacing = 4.sp,
                    color = Color.White.copy(alpha = 0.9f)
                )
                Text(
                    text = "School",
                    fontSize = 48.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Up to 50% off on all essentials",
                    fontSize = 14.sp,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }
        }

        // Frosted Glass Search Bar
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .offset(y = (-24).dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = Color.White.copy(alpha = 0.95f)
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = Color(0xFF9CA3AF)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "Search for backpacks, books...",
                    fontSize = 14.sp,
                    color = Color(0xFF9CA3AF),
                    modifier = Modifier.weight(1f)
                )
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(primaryPurple, accentPink)
                            ),
                            RoundedCornerShape(8.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Filter",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

// ============= SchoolFour Grid View =============

@Composable
fun SchoolFourGridView(
    component: SDUIComponent
) {
    val items = parseBTSProducts(component.props?.get("products"))
    if (items.isEmpty()) return


    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Featured Products",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            TextButton(onClick = { }) {
                Text(
                    text = "See All",
                    color = primaryPurple,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        val rows = items.chunked(2)
        rows.forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                rowItems.forEach { item ->
                    SchoolFourProductCard(
                        item = item,
                        modifier = Modifier.weight(1f)
                    )
                }
                if (rowItems.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SchoolFourProductCard(
    item: BTSProduct,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .shadow(6.dp, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(lightPurple.copy(alpha = 0.3f), Color(0xFFFCE7F3).copy(alpha = 0.3f))
                        )
                    )
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = item.title,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    contentScale = ContentScale.Fit
                )

                item.badge?.let { badge ->
                    Box(
                        modifier = Modifier
                            .padding(8.dp)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(
                                        safeParseColor(item.badgeColor ?: "#EC4899"),
                                        safeParseColor(item.badgeColor ?: "#EC4899").copy(alpha = 0.8f)
                                    )
                                ),
                                RoundedCornerShape(8.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = badge,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .size(32.dp)
                        .background(Color.White.copy(alpha = 0.9f), CircleShape)
                        .shadow(2.dp, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "Favorite",
                        tint = Color(0xFFD1D5DB),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = item.title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Text(
                    text = item.subtitle,
                    fontSize = 12.sp,
                    color = Color(0xFF9CA3AF)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.price,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = primaryPurple
                    )

                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(32.dp)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(primaryPurple, accentPink)
                                ),
                                RoundedCornerShape(10.dp)
                            )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}

// ============= SchoolFour Categories View =============

@Composable
fun SchoolFourCategoriesView(
    component: SDUIComponent
) {
    val categories = listOf(
        Triple("All", "✨", Color(0xFFFAF5FF)),
        Triple("Bags", "🎒", Color(0xFFFFF1F2)),
        Triple("Books", "📚", Color(0xFFECFDF5)),
        Triple("Tech", "💻", Color(0xFFEFF6FF)),
        Triple("Art", "🎨", Color(0xFFFFFBEB)),
        Triple("Sports", "⚽", Color(0xFFF0FDF4))
    )

    var selectedIndex by remember { mutableStateOf(0) }

    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(categories.size) { index ->
            val (label, icon, bgColor) = categories[index]
            val isSelected = index == selectedIndex

            Surface(
                onClick = { selectedIndex = index },
                shape = RoundedCornerShape(16.dp),
                color = if (isSelected) primaryPurple else bgColor,
                shadowElevation = if (isSelected) 4.dp else 0.dp
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(text = icon, fontSize = 16.sp)
                    Text(
                        text = label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isSelected) Color.White else Color(0xFF4B5563)
                    )
                }
            }
        }
    }
}

// ============= SchoolFour Footer View =============

@Composable
fun SchoolFourFooterView() {
    // Stub - uses main app navigation
    Spacer(modifier = Modifier.height(0.dp))
}
