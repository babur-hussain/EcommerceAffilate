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
import androidx.compose.material.icons.outlined.FavoriteBorder
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
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

// ============= BackToSchool Header View =============

@Composable
fun BackToSchoolHeaderView(
    component: SDUIComponent
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp.dp

    Column(
        modifier = Modifier.padding(bottom = 24.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(380.dp)
                .clip(RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp))
                .background(Color(0xFF2B5F3E)) // Chalkboard Green
        ) {
            // Decorative elements
            // Top Deco Row - Yellow rectangles
            Row(
                modifier = Modifier
                    .padding(horizontal = 20.dp)
                    .padding(top = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(30.dp)
            ) {
                repeat(5) { i ->
                    Box(
                        modifier = Modifier
                            .width(8.dp)
                            .height((24 + (i % 3) * 6).dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color(0xFFFDE047).copy(alpha = 0.5f))
                    )
                }
            }

            // ABC text decoration
            Text(
                text = "ABC",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White.copy(alpha = 0.4f),
                modifier = Modifier
                    .offset(x = 60.dp, y = 100.dp)
                    .rotate(-12f)
            )

            // Lightbulb icon decoration
            Text(
                text = "💡",
                fontSize = 32.sp,
                modifier = Modifier
                    .offset(x = screenWidth - 60.dp, y = 100.dp)
                    .rotate(0f),
                color = Color.White.copy(alpha = 0.4f)
            )

            // Math equation decoration
            Text(
                text = "1 + 2 = 3",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White.copy(alpha = 0.3f),
                modifier = Modifier
                    .offset(x = screenWidth - 120.dp, y = 260.dp)
                    .rotate(12f)
            )

            // Main Content
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = 60.dp, bottom = 48.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Welcome",
                    fontSize = 18.sp,
                    color = Color.White.copy(alpha = 0.9f)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "BACK",
                    fontSize = 42.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Row {
                    Text(
                        text = "to ",
                        fontSize = 24.sp,
                        color = Color.White
                    )
                    Text(
                        text = "SCHOOL",
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Circle images and Shop Now button
                Row(
                    verticalAlignment = Alignment.Bottom,
                    horizontalArrangement = Arrangement.Center
                ) {
                    // Left circle image
                    AsyncImage(
                        model = "https://lh3.googleusercontent.com/aida-public/AB6AXuCUKcux_NhPl0HEN2ypADh8zAQqEU5oSPNSBqOkzj32oFzbKPYcBn2Vekj81U4QjVoPICK0-AEwjzXuWU-HF1McdyktPXE3e9bgq0bApl5FlLtiDPkdOkenJe5XYk97_VRUgsSLCN1IgvYqW9Obn05EkyOASEbKZSHbtVLnQ5GO2HdTjyLG_thy5nm3y9InXjyn_IRxVEd_MIzG95Lb6yl_eO4cLEjQWi-Hsz7WUJDZzWBhq_BLqbPR1Xu5_P5JTOiGfDC1j9_4ARJs",
                        contentDescription = null,
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .background(Color.Gray),
                        contentScale = ContentScale.Crop
                    )

                    Spacer(modifier = Modifier.width((-12).dp))

                    // Shop Now Button
                    Button(
                        onClick = { },
                        modifier = Modifier.padding(bottom = 20.dp),
                        shape = RoundedCornerShape(50),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFFF4B060)
                        ),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
                    ) {
                        Text(
                            text = "SHOP NOW",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }

                    Spacer(modifier = Modifier.width((-12).dp))

                    // Right circle image
                    AsyncImage(
                        model = "https://lh3.googleusercontent.com/aida-public/AB6AXuCK9aRKYsvvsjUqLQmrVhvnfXTV_bbd0S4aofnNw68dw-paqUnkPTPHSdpK0kvY74gCpBBs-qhlGas91j6q7V0VEKOQXRD4lfXAe9xLT7ZdBOauA6Fy8iLvelXrpMXQwUcofIFe9lv7Y-LuOZYvnBp9jGF4zueqbezsysreHmG8Bu2RXIGCZ_J0-x4LvuGeEZEQJRSS9iAVxO86aFSvWIUCr_nGJAC4B7sDUQvAx0J2EsGDMwGhgquDMCm0evCKUw9d0wQHnWh-XdP5",
                        contentDescription = null,
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .background(Color.Gray),
                        contentScale = ContentScale.Crop
                    )
                }
            }
        }

        // Search Bar Overlay
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .offset(y = (-24).dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = Color(0xFF9CA3AF)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Search backpacks, pencils...",
                    fontSize = 14.sp,
                    color = Color(0xFF9CA3AF),
                    modifier = Modifier.weight(1f)
                )
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .size(32.dp)
                        .background(Color(0xFFF3F4F6), RoundedCornerShape(8.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Filter",
                        tint = Color(0xFF6B7280),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

// ============= BackToSchool Grid View =============

@Composable
fun BackToSchoolGridView(
    component: SDUIComponent
) {
    val props = component.props ?: emptyMap()
    val products = parseBTSProducts(props["products"])
    
    // Demo data fallback
    val items = products.ifEmpty {
        listOf(
            BTSProduct(
                id = "1", title = "Dino Explorer Backpack", subtitle = "Ergonomic fit",
                price = "$34.99", badge = "New", badgeColor = "#F4B060",
                image = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qgZsOP70tmld6ZraMtCBaVLxR6dZxr8exrVcrnu2VlLAF1epw_2DBCombSYP8Ny5Q8NerXaaOsaH50MFgYBo3zIdQsqAweqCakaLhRvU369-cyYyZF_oS1CkqAjHTdwhnWY-xggEGvKMPBNTVHOo2HXk2vPboQ43QSSe9wPIHWh-MMJrv33bc77nfiydEXZDiSddkOS0u309A1T-i5VYfX7m6sunNVCAbEnXd-eoLdQSYFaHh1fbPZIx0miN7z24RsAYb_vaV1Xl"
            ),
            BTSProduct(
                id = "2", title = "Artist Color Pencil Set", subtitle = "24 Vibrant Colors",
                price = "$12.50",
                image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCcdvhXWvPY_GEjZhc9IoobM2aNEU1lp7iQkcfU3n82j_i6d0y00yKz6PX_WsRfpm1GR_JPpEq4M4nbhfEdGv_UopfMEESW2zq9Fch9gd8Lk7FngJA9pb1rz-XLvCRo6eYvHbcvTq_5QtfoLfhq9nOse1z3vkTHlRrcHgJXxOEXI4jxJYvuq8_0GVM3tvDFno77q7CxXsD8Z5paYzSMezi7hD7909VrRQ35Q8IFV0JwYYuBCZllVDfiwFvBYQG0LU-rT7F6bbbZlk7A"
            ),
            BTSProduct(
                id = "3", title = "Hardcover Notebook", subtitle = "Ruled pages",
                price = "$8.99", badge = "-15%", badgeColor = "#E66B6B",
                image = "https://lh3.googleusercontent.com/aida-public/AB6AXuD2OayXsAosgmuFl6A_uKlKuvYffK7mO5VmGd_uGVd7vOftDM3UmgiJhpsd2ml_Y4yETCoXhiyezFnm229e8nDaS__HTUX0hbj_Qufs7anfkqIg1mSQTSVZPAFW-vgI47f09Djzpu3-j9BqNSJr4o18v6PfWrN6yLyB8Uvu8cPZYs2FgPxRzFw8c_elAE4xGxJTWkDFvGrNFuSOmr6TWtB384daydDe0aZuvMXZq7DOWzA3ZAg4CaYh6bJLWvWDwYdf3bTkvEhHSf7q"
            ),
            BTSProduct(
                id = "4", title = "Scientific Calculator", subtitle = "Solar Powered",
                price = "$15.99",
                image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFxJ3QXPxvSONI21tIppEnXusRtXhs0IB5D_BqYLQdpO_qP3U0BkRFoKxPvRsxFPk1h-H6zg85kqfIwestz1I82gw_VEozvDmZwT7NvCN_7UwjJaTQWWDmzML1tZNpH_go0pnh3PMWQPDdh2zqE-o14iiXlaWZQU0NI29QIaD6XRQzNKPMiGYurpIyvujbWtDNKXSpC7UsxyidfoRY2rnb2gUakRpEoBd4Gi3Gg9VQdtOdrViYlfnUoBUnsxLEPD3MHanCOrGjNCcI"
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .padding(top = 24.dp)
    ) {
        Text(
            text = "Trending Now",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1F2937)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // 2-Column Grid
        val rows = items.chunked(2)
        rows.forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                rowItems.forEach { item ->
                    BTSProductCard(
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
fun BTSProductCard(
    item: BTSProduct,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = androidx.compose.ui.graphics.Brush.linearGradient(
                colors = listOf(Color(0xFFF3F4F6), Color(0xFFF3F4F6))
            )
        )
    ) {
        Column {
            // Image Area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(144.dp)
                    .background(Color(0xFFF9FAFB))
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = item.title,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    contentScale = ContentScale.Fit
                )

                // Badge
                item.badge?.let { badge ->
                    Text(
                        text = badge.uppercase(),
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

                // Favorite Button
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .size(28.dp)
                        .background(Color.White.copy(alpha = 0.8f), CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Favorite,
                        contentDescription = "Favorite",
                        tint = Color(0xFF9CA3AF),
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            // Content
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
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
                    color = Color(0xFF4B5563),
                    maxLines = 1
                )

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.price,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937)
                    )

                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(32.dp)
                            .shadow(6.dp, CircleShape)
                            .background(Color(0xFFF4B060), CircleShape)
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

// ============= BackToSchool Banner View =============

@Composable
fun BackToSchoolBannerView(
    component: SDUIComponent
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .padding(bottom = 32.dp)
            .height(140.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFF6B9EE6))
            .shadow(8.dp, RoundedCornerShape(16.dp))
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = "LIMITED TIME",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = Color.White.copy(alpha = 0.8f)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Buy 2 Get 1\nFree on Books!",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    lineHeight = 28.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = { },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White
                    )
                ) {
                    Text(
                        text = "View Offer",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF6B9EE6)
                    )
                }
            }

            // Book icon decoration
            Text(
                text = "📚",
                fontSize = 100.sp,
                modifier = Modifier
                    .rotate(12f)
                    .offset(x = 20.dp, y = 20.dp),
                color = Color.White.copy(alpha = 0.3f)
            )
        }
    }
}

// ============= BackToSchool Categories View =============

data class BTSCategory(
    val label: String,
    val icon: String,
    val color: String,
    val bg: String
)

@Composable
fun BackToSchoolCategoriesView(
    component: SDUIComponent
) {
    val categories = listOf(
        BTSCategory("Bags", "🎒", "6B9EE6", "E1EBF9"),
        BTSCategory("Books", "📚", "E66B6B", "F9E1E1"),
        BTSCategory("Uniforms", "👕", "F4D35E", "FDF6DE"),
        BTSCategory("Art", "🎨", "4ADE80", "DBF8E5"),
        BTSCategory("Lunch", "🥤", "C084FC", "F2E6FE")
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 24.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Essentials",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            TextButton(onClick = { }) {
                Text(
                    text = "See All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFF4B060)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Categories scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(categories) { cat ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .width(70.dp)
                        .clickable { }
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(safeParseColor("#${cat.bg}")),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = cat.icon,
                            fontSize = 28.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = cat.label,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF4B5563)
                    )
                }
            }
        }
    }
}

// ============= BackToSchool Footer View =============

@Composable
fun BackToSchoolFooterView() {
    Column {
        Divider()
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp)
                .padding(bottom = 24.dp, top = 12.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.Bottom
        ) {
            // Home
            BTSNavItem(icon = Icons.Default.Home, label = "Home", isActive = true)
            // Categories
            BTSNavItem(icon = Icons.Default.Menu, label = "Categories")
            
            // Center Cart Button
            IconButton(
                onClick = { },
                modifier = Modifier
                    .offset(y = (-24).dp)
                    .size(64.dp)
                    .shadow(8.dp, CircleShape)
                    .background(Color(0xFFF4B060), CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Cart",
                    tint = Color.White,
                    modifier = Modifier.size(28.dp)
                )
            }
            
            // Saved
            BTSNavItem(icon = Icons.Outlined.FavoriteBorder, label = "Saved")
            // Profile
            BTSNavItem(icon = Icons.Default.Person, label = "Profile")
        }
    }
}

@Composable
private fun BTSNavItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    isActive: Boolean = false
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { }
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isActive) Color(0xFFF4B060) else Color(0xFF9CA3AF),
            modifier = Modifier.size(26.dp)
        )
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal,
            color = if (isActive) Color(0xFFF4B060) else Color(0xFF9CA3AF)
        )
    }
}

// ============= Helper Functions =============

private fun parseBTSProducts(data: Any?): List<BTSProduct> {
    if (data == null) return emptyList()
    return try {
        val gson = Gson()
        val json = gson.toJson(data)
        val type = object : TypeToken<List<BTSProduct>>() {}.type
        gson.fromJson(json, type)
    } catch (e: Exception) {
        emptyList()
    }
}
