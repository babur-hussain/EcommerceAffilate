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
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.BTSProduct
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.safeParseColor

// Theme Colors for SchoolThree
private val primaryOrange = Color(0xFFFF8C42)
private val primaryTeal = Color(0xFF007EA7)
private val accentYellow = Color(0xFFFDE74C)

// ============= SchoolThree Header View =============

@Composable
fun SchoolThreeHeaderView(
    component: SDUIComponent
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp.dp

    Column(
        modifier = Modifier.padding(bottom = 24.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp))
                .background(primaryTeal)
                .shadow(8.dp, RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp))
        ) {
            // Background Pattern
            Box(modifier = Modifier.fillMaxSize()) {
                // Leaf decorations
                Text(
                    text = "🍃",
                    fontSize = 120.sp,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = (-20).dp, y = 16.dp)
                        .rotate(45f),
                    color = accentYellow.copy(alpha = 0.2f)
                )

                Text(
                    text = "🍃",
                    fontSize = 100.sp,
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .offset(x = (-10).dp, y = 40.dp)
                        .rotate(-12f),
                    color = accentYellow.copy(alpha = 0.2f)
                )

                // Paperclip decorations
                Text(
                    text = "📎",
                    fontSize = 48.sp,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .offset(x = (-48).dp, y = (-16).dp)
                        .rotate(12f),
                    color = Color.White.copy(alpha = 0.3f)
                )

                Text(
                    text = "📎",
                    fontSize = 40.sp,
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .offset(x = 32.dp, y = 40.dp)
                        .rotate(-45f),
                    color = Color.White.copy(alpha = 0.3f)
                )
            }

            // Content
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 60.dp, bottom = 40.dp, start = 24.dp, end = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "back to",
                    fontSize = 24.sp,
                    fontStyle = FontStyle.Italic,
                    color = Color.White
                )

                Text(
                    text = "SCHOOL",
                    fontSize = 56.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.sp,
                    color = accentYellow
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Search Bar
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(50),
                    colors = CardDefaults.cardColors(
                        containerColor = Color.White.copy(alpha = 0.9f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = Color(0xFF9CA3AF)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Find pencils, rulers, backpacks...",
                            fontSize = 14.sp,
                            color = Color(0xFF9CA3AF)
                        )
                    }
                }
            }
        }
    }
}

// ============= SchoolThree Grid View =============

@Composable
fun SchoolThreeGridView(
    component: SDUIComponent
) {
    val products = listOf(
        BTSProduct(
            id = "1", title = "Colorful Markers Set", subtitle = "Art Supplies",
            price = "$9.99", badge = "Popular", badgeColor = "#FF8C42",
            image = "https://via.placeholder.com/150"
        ),
        BTSProduct(
            id = "2", title = "Geometry Set", subtitle = "Math Tools",
            price = "$14.99",
            image = "https://via.placeholder.com/150"
        ),
        BTSProduct(
            id = "3", title = "Eco Notebook", subtitle = "Stationery",
            price = "$6.99", badge = "Eco", badgeColor = "#4ADE80",
            image = "https://via.placeholder.com/150"
        ),
        BTSProduct(
            id = "4", title = "School Compass", subtitle = "Tools",
            price = "$4.50",
            image = "https://via.placeholder.com/150"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 16.dp)
    ) {
        Text(
            text = "Popular Items",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1F2937)
        )

        Spacer(modifier = Modifier.height(16.dp))

        val rows = products.chunked(2)
        rows.forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                rowItems.forEach { item ->
                    SchoolThreeProductCard(
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
private fun SchoolThreeProductCard(
    item: BTSProduct,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .shadow(4.dp, RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(Color(0xFFF9FAFB))
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = item.title,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    contentScale = ContentScale.Fit
                )

                item.badge?.let { badge ->
                    Text(
                        text = badge,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier
                            .padding(8.dp)
                            .background(
                                safeParseColor(item.badgeColor ?: "#000000"),
                                RoundedCornerShape(50)
                            )
                            .padding(horizontal = 8.dp, vertical = 4.dp)
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
                    color = Color(0xFF6B7280)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.price,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = primaryTeal
                    )

                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(28.dp)
                            .background(primaryOrange, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}

// ============= SchoolThree Banner View =============

@Composable
fun SchoolThreeBannerView(
    component: SDUIComponent
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 16.dp)
            .height(160.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(primaryTeal)
    ) {
        // Background pattern
        Text(
            text = "✏️",
            fontSize = 80.sp,
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .offset(x = 20.dp)
                .rotate(15f),
            color = Color.White.copy(alpha = 0.1f)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "SPECIAL OFFER",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                color = accentYellow
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Free Shipping on\nOrders Over \$50",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                lineHeight = 28.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = accentYellow
                )
            ) {
                Text(
                    text = "Shop Now",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
            }
        }
    }
}

// ============= SchoolThree Categories View =============

@Composable
fun SchoolThreeCategoriesView(
    component: SDUIComponent
) {
    val categories = listOf(
        "All" to "📚",
        "Art" to "🎨",
        "Math" to "🔢",
        "Science" to "🔬",
        "Sports" to "⚽"
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
            val (label, icon) = categories[index]
            val isSelected = index == selectedIndex

            Button(
                onClick = { selectedIndex = index },
                shape = RoundedCornerShape(50),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isSelected) primaryTeal else Color.White,
                    contentColor = if (isSelected) Color.White else Color(0xFF1F2937)
                ),
                elevation = ButtonDefaults.buttonElevation(
                    defaultElevation = if (isSelected) 4.dp else 0.dp
                ),
                border = if (!isSelected) ButtonDefaults.outlinedButtonBorder else null
            ) {
                Text(text = "$icon $label", fontSize = 14.sp)
            }
        }
    }
}

// ============= SchoolThree Essentials View =============

@Composable
fun SchoolThreeEssentialsView(
    component: SDUIComponent
) {
    val essentials = listOf(
        Triple("Notebooks", "📓", Color(0xFFE3F2FD)),
        Triple("Pens", "🖊️", Color(0xFFFCE4EC)),
        Triple("Erasers", "🧹", Color(0xFFF3E5F5)),
        Triple("Rulers", "📏", Color(0xFFE8F5E9)),
        Triple("Scissors", "✂️", Color(0xFFFFF3E0))
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Essential Supplies",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            TextButton(onClick = { }) {
                Text(
                    text = "View All",
                    color = primaryTeal,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(essentials) { (name, icon, bgColor) ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(bgColor),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = icon, fontSize = 32.sp)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = name,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF4B5563)
                    )
                }
            }
        }
    }
}

// ============= SchoolThree Footer View =============

@Composable
fun SchoolThreeFooterView() {
    // Stub - use main app navigation
    Spacer(modifier = Modifier.height(0.dp))
}
