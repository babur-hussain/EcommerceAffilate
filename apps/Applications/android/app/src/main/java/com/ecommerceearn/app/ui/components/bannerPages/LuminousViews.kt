package com.ecommerceearn.app.ui.components.bannerPages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
import com.ecommerceearn.app.data.model.LuminousCategoryItem
import com.ecommerceearn.app.data.model.LuminousProductItem
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.safeParseColor
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

// ============= Luminous Header View =============

@Composable
fun LuminousHeaderView(
    component: SDUIComponent
) {
    val props = component.props
    val titleTop = props?.get("title_top")?.asString ?: "BEAUTY"
    val titleBottom = props?.get("title_bottom")?.asString ?: "PERFUME"
    val subtitle = props?.get("subtitle")?.asString ?: "with new organic formula for your daily use"
    val buttonText = props?.get("button_text")?.asString ?: "SHOP NOW"
    val imageUrl = props?.get("image_url")?.asString ?: ""

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(32.dp))
    ) {
        // Background Image
        AsyncImage(
            model = imageUrl,
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            Color(0xFFF2C4C6).copy(alpha = 0.9f),
                            Color(0xFFF2C4C6).copy(alpha = 0.4f),
                            Color.Transparent
                        )
                    )
                )
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxHeight()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center
        ) {
            // Eyebrow
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "BETUL'S EXCLUSIVE",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    color = Color(0xFF1F2328)
                )
                Box(
                    modifier = Modifier
                        .width(48.dp)
                        .height(1.dp)
                        .background(Color(0xFF1F2328))
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Main Title
            Text(
                text = titleTop,
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF0F1729),
                lineHeight = 36.sp
            )
            Text(
                text = titleBottom,
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF0F1729),
                lineHeight = 36.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Subtitle
            Text(
                text = subtitle,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF334054),
                modifier = Modifier.widthIn(max = 180.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Button
            OutlinedButton(
                onClick = { },
                shape = RoundedCornerShape(0.dp),
                border = ButtonDefaults.outlinedButtonBorder.copy(width = 2.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = Color(0xFF0F1729)
                )
            ) {
                Text(
                    text = buttonText,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}

// ============= Luminous Grid View =============

@Composable
fun LuminousGridView(
    component: SDUIComponent
) {
    val items = parseProductItems(component.props?.get("products"))

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(top = 24.dp)
    ) {
        // 2-Column Grid
        val rows = items.chunked(2)
        rows.forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                rowItems.forEach { item ->
                    BeautyProductCard(
                        item = item,
                        modifier = Modifier.weight(1f)
                    )
                }
                // Fill empty space if odd number
                if (rowItems.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun BeautyProductCard(
    item: LuminousProductItem,
    modifier: Modifier = Modifier
) {
    var isFavorite by remember { mutableStateOf(false) }

    Card(
        modifier = modifier
            .clip(RoundedCornerShape(24.dp))
            .shadow(4.dp, RoundedCornerShape(24.dp)),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column {
            // Image Container
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .padding(12.dp)
            ) {
                AsyncImage(
                    model = item.image_url,
                    contentDescription = item.title,
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFFFDF5F5)),
                    contentScale = ContentScale.Fit
                )

                // Favorite Button
                IconButton(
                    onClick = { isFavorite = !isFavorite },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .size(32.dp)
                        .background(Color.White.copy(alpha = 0.8f), CircleShape)
                ) {
                    Icon(
                        imageVector = if (isFavorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = Color(0xFFF57085),
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            // Content
            Column(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                // Category Tag
                Text(
                    text = item.subtitle.uppercase(),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    color = Color(0xFFE8A3A9)
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Title
                Text(
                    text = item.title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2328),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                // Details
                Text(
                    text = "50ml • Organic formula",
                    fontSize = 12.sp,
                    color = Color(0xFF637388)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Price Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.price,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F1729)
                    )

                    // Add to Cart
                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(40.dp)
                            .shadow(8.dp, RoundedCornerShape(12.dp))
                            .background(Color(0xFFE8A3A9), RoundedCornerShape(12.dp))
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ShoppingCart,
                            contentDescription = "Add to Cart",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}

// ============= Luminous Categories View =============

@Composable
fun LuminousCategoriesView(
    component: SDUIComponent
) {
    val items = parseCategoryItems(component.props?.get("items"))
    var selectedIndex by remember { mutableStateOf(0) }

    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 32.dp),
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // "All Products" button (always first)
        item {
            Button(
                onClick = { selectedIndex = 0 },
                shape = RoundedCornerShape(50),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFE8A3A9)
                ),
                elevation = ButtonDefaults.buttonElevation(
                    defaultElevation = 8.dp
                )
            ) {
                Text(
                    text = "All Products",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White
                )
            }
        }

        // Dynamic category items
        items(items.size) { index ->
            OutlinedButton(
                onClick = { selectedIndex = index + 1 },
                shape = RoundedCornerShape(50),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color.White,
                    contentColor = Color(0xFF0F1729)
                ),
                border = ButtonDefaults.outlinedButtonBorder.copy(
                    brush = Brush.linearGradient(
                        colors = listOf(Color(0xFFFFD6D9), Color(0xFFFFD6D9))
                    )
                )
            ) {
                Text(
                    text = items[index].name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

// ============= Luminous Sale View =============

@Composable
fun LuminousSaleView(
    component: SDUIComponent
) {
    val props = component.props
    val tag = props?.get("tag")?.asString ?: "Member Exclusive"
    val title = props?.get("title")?.asString ?: "Get 20% off on all"
    val subtitle = props?.get("subtitle")?.asString ?: "Betul's Organic line"
    val linkText = props?.get("link_text")?.asString ?: "Unlock Deal"

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(top = 40.dp)
            .height(180.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color(0xFF0F1729))
    ) {
        // Content
        Column(
            modifier = Modifier
                .padding(24.dp)
                .fillMaxHeight(),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = tag,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Text(
                text = "$title\n$subtitle",
                fontSize = 14.sp,
                color = Color.White.copy(alpha = 0.7f),
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFE8A3A9)
                ),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 8.dp)
            ) {
                Text(
                    text = linkText,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }

        // Decorative Icon - simplified gift icon representation
        Text(
            text = "🎁",
            fontSize = 120.sp,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .offset(x = 20.dp, y = 20.dp),
            color = Color.White.copy(alpha = 0.08f)
        )
    }
}

// ============= Helper Functions =============

private fun parseProductItems(data: com.google.gson.JsonElement?): List<LuminousProductItem> {
    if (data == null || data.isJsonNull) return emptyList()
    return try {
        val gson = Gson()
        val type = object : TypeToken<List<LuminousProductItem>>() {}.type
        gson.fromJson(data, type)
    } catch (e: Exception) {
        emptyList()
    }
}

private fun parseCategoryItems(data: com.google.gson.JsonElement?): List<LuminousCategoryItem> {
    if (data == null || data.isJsonNull) return emptyList()
    return try {
        val gson = Gson()
        val type = object : TypeToken<List<LuminousCategoryItem>>() {}.type
        gson.fromJson(data, type)
    } catch (e: Exception) {
        emptyList()
    }
}
