package com.ecommerceearn.app.ui.components.bannerPages

import androidx.compose.foundation.background
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.BTSProduct
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.safeParseColor

// Theme Colors for SchoolFive
private val primaryOrange = Color(0xFFF97316)
private val secondaryOrange = Color(0xFFFB923C)
private val accentYellow = Color(0xFFFBBF24)

// ============= SchoolFive Header View =============

@Composable
fun SchoolFiveHeaderView(
    component: SDUIComponent
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp.dp

    Column(
        modifier = Modifier.padding(bottom = 16.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(320.dp)
                .clip(RoundedCornerShape(bottomStart = 40.dp, bottomEnd = 40.dp))
                .background(primaryOrange)
        ) {
            // Background Pattern Text (diagonal "SCHOOL" repeating)
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .rotate(-15f)
                    .offset(x = (-40).dp, y = 40.dp)
            ) {
                repeat(8) {
                    Text(
                        text = "SCHOOL SCHOOL SCHOOL SCHOOL",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 4.sp,
                        color = secondaryOrange.copy(alpha = 0.4f),
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
            }

            // Floating Emojis
            Text(
                text = "✏️",
                fontSize = 48.sp,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = (-32).dp, y = 80.dp)
                    .rotate(15f)
            )
            Text(
                text = "📚",
                fontSize = 40.sp,
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .offset(x = 24.dp, y = 100.dp)
                    .rotate(-10f)
            )
            Text(
                text = "🎒",
                fontSize = 56.sp,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .offset(x = (-48).dp, y = (-80).dp)
                    .rotate(8f)
            )

            // Main Content
            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(horizontal = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "BACK TO",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 6.sp,
                    color = Color.White
                )
                Text(
                    text = "SCHOOL",
                    fontSize = 52.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "SALE",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    color = accentYellow
                )

                Spacer(modifier = Modifier.height(16.dp))

                ElevatedButton(
                    onClick = { },
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.elevatedButtonColors(
                        containerColor = Color.White
                    ),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 8.dp)
                ) {
                    Text(
                        text = "Explore Deals",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = primaryOrange
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = null,
                        tint = primaryOrange,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        // Search Bar
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .offset(y = (-20).dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 12.dp)
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
                    text = "What are you looking for?",
                    fontSize = 14.sp,
                    color = Color(0xFF9CA3AF),
                    modifier = Modifier.weight(1f)
                )
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .size(40.dp)
                        .background(primaryOrange, RoundedCornerShape(12.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Filter",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

// ============= SchoolFive Grid View =============

@Composable
fun SchoolFiveGridView(
    component: SDUIComponent
) {
    val products = listOf(
        BTSProduct(
            id = "1", title = "Sports Backpack", subtitle = "Outdoor",
            price = "$39.99", badge = "🔥 Hot", badgeColor = "#F97316",
            image = "https://via.placeholder.com/150"
        ),
        BTSProduct(
            id = "2", title = "Water Bottle Set", subtitle = "Essentials",
            price = "$15.99", badge = "-25%", badgeColor = "#10B981",
            image = "https://via.placeholder.com/150"
        ),
        BTSProduct(
            id = "3", title = "Lunch Box Kit", subtitle = "Food",
            price = "$22.99",
            image = "https://via.placeholder.com/150"
        ),
        BTSProduct(
            id = "4", title = "Pencil Case", subtitle = "Stationery",
            price = "$8.99", badge = "New", badgeColor = "#3B82F6",
            image = "https://via.placeholder.com/150"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Best Deals 🎁",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
                Text(
                    text = "Save up to 50% on selected items",
                    fontSize = 12.sp,
                    color = Color(0xFF6B7280)
                )
            }
            TextButton(onClick = { }) {
                Text(
                    text = "View All",
                    color = primaryOrange,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        val rows = products.chunked(2)
        rows.forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                rowItems.forEach { item ->
                    SchoolFiveProductCard(
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
private fun SchoolFiveProductCard(
    item: BTSProduct,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .padding(8.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color(0xFFFFF7ED))
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = item.title,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(8.dp),
                    contentScale = ContentScale.Fit
                )

                item.badge?.let { badge ->
                    Card(
                        modifier = Modifier
                            .padding(8.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = safeParseColor(item.badgeColor ?: "#F97316")
                        )
                    ) {
                        Text(
                            text = badge,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(4.dp)
                        .size(32.dp)
                        .shadow(4.dp, CircleShape)
                        .background(Color.White, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "Favorite",
                        tint = Color(0xFFE5E7EB),
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
                        color = primaryOrange
                    )

                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(36.dp)
                            .shadow(6.dp, CircleShape)
                            .background(primaryOrange, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingCart,
                            contentDescription = "Add to cart",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}

// ============= SchoolFive Categories View =============

@Composable
fun SchoolFiveCategoriesView(
    component: SDUIComponent
) {
    val categories = listOf(
        Triple("All", "🏷️", Color(0xFFFEF3C7)),
        Triple("Bags", "🎒", Color(0xFFDCFCE7)),
        Triple("Books", "📖", Color(0xFFDBEAFE)),
        Triple("Tech", "📱", Color(0xFFFCE7F3)),
        Triple("Sports", "🏀", Color(0xFFFFE4E6)),
        Triple("Art", "🖌️", Color(0xFFE9D5FF))
    )

    var selectedIndex by remember { mutableStateOf(0) }

    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        contentPadding = PaddingValues(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(categories.size) { index ->
            val (label, icon, bgColor) = categories[index]
            val isSelected = index == selectedIndex

            Card(
                onClick = { selectedIndex = index },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) primaryOrange else bgColor
                ),
                elevation = CardDefaults.cardElevation(
                    defaultElevation = if (isSelected) 6.dp else 0.dp
                )
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = icon, fontSize = 18.sp)
                    Text(
                        text = label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (isSelected) Color.White else Color(0xFF374151)
                    )
                }
            }
        }
    }
}

// ============= SchoolFive Footer View =============

@Composable
fun SchoolFiveFooterView() {
    // Stub - uses main app navigation
    Spacer(modifier = Modifier.height(0.dp))
}
