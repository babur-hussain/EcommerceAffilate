package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

// ============= Sports Data Classes =============

data class SavingsItem(
    val id: String,
    val bgImage: String,
    val gradient: List<String>?,
    val title: String,
    val offer: String,
    val actionUrl: String?
)

data class GoalItem(
    val id: String,
    val bgImage: String,
    val gradient: List<String>?,
    val titleLines: List<String>,
    val subtitle: String,
    val actionUrl: String?
)

data class AccessoryItem(
    val id: String,
    val title: String,
    val image: String,
    val discount: String,
    val actionUrl: String?
)

data class ComboItem(
    val id: String,
    val title: String,
    val image: String,
    val discount: String,
    val actionUrl: String?
)

data class CricketItem(
    val id: String,
    val actionUrl: String?,
    val bgImage: String?,
    val mainText: String?,
    val subText: String?,
    val title: String?,
    val offer: String?,
    val image: String?
)

data class WinnerBrandItem(
    val id: String,
    val brand: String,
    val logoColor: String?,
    val image: String,
    val offer: String,
    val actionUrl: String?
)

data class WishlistItem(
    val id: String,
    val image: String,
    val title: String,
    val price: String,
    val actionUrl: String?
)

// ============= Sport Savings View =============

@Composable
fun SportSavingsView(
    title: String = "Sport Savings",
    headerActionUrl: String?,
    items: List<SavingsItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
        SectionHeader(title, headerActionUrl)

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                SavingsCard(item)
            }
        }
    }
}

@Composable
fun SavingsCard(item: SavingsItem) {
    val gradientColors = item.gradient?.map { safeParseColor(it) }
        ?: listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))

    Box(
        modifier = Modifier
            .width(280.dp)
            .height(400.dp)
            .clip(RoundedCornerShape(24.dp))
            .clickable { }
    ) {
        // Background Image
        AsyncImage(
            model = item.bgImage,
            contentDescription = item.title,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(gradientColors))
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            Text(
                text = item.title.uppercase(),
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = Color.White,
                lineHeight = 36.sp
            )

            Spacer(modifier = Modifier.weight(1f))

            Text(
                text = item.offer,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFCCFF00) // Neon green
            )
        }
    }
}

// ============= Sport Support Goals View =============

@Composable
fun SportSupportGoalsView(
    title: String = "Support Your Goals",
    headerActionUrl: String?,
    items: List<GoalItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        SectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                GoalCard(item)
            }
        }
    }
}

@Composable
fun GoalCard(item: GoalItem) {
    val gradientColors = item.gradient?.map { safeParseColor(it) }
        ?: listOf(Color.Black.copy(alpha = 0.1f), Color.Black.copy(alpha = 0.9f))

    Box(
        modifier = Modifier
            .width(280.dp)
            .height(400.dp)
            .clip(RoundedCornerShape(24.dp))
            .clickable { }
    ) {
        // Background Image
        AsyncImage(
            model = item.bgImage,
            contentDescription = "Goal",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(gradientColors))
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            item.titleLines.forEach { line ->
                Text(
                    text = line,
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Black,
                    fontStyle = FontStyle.Italic,
                    color = Color.White,
                    lineHeight = 34.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = item.subtitle,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFCCFF00)
            )
        }
    }
}

// ============= Sport Gym Accessories View (2-column grid) =============

@Composable
fun SportGymAccessoriesView(
    title: String = "Gym Accessories",
    headerActionUrl: String?,
    items: List<AccessoryItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        SectionHeader(title, headerActionUrl)

        // 2-Column Grid
        val rows = (items.size + 1) / 2
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            for (row in 0 until rows) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    val index1 = row * 2
                    val index2 = row * 2 + 1
                    if (index1 < items.size) {
                        Box(modifier = Modifier.weight(1f)) {
                            AccessoryCard(items[index1])
                        }
                    }
                    if (index2 < items.size) {
                        Box(modifier = Modifier.weight(1f)) {
                            AccessoryCard(items[index2])
                        }
                    } else {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
fun AccessoryCard(item: AccessoryItem) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(
                Brush.linearGradient(
                    colors = listOf(Color(0xFF3B82F6), Color(0xFF172554))
                )
            )
            .clickable { }
    ) {
        // Title
        Text(
            text = item.title,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            maxLines = 2,
            modifier = Modifier
                .padding(top = 16.dp, start = 16.dp, end = 16.dp)
        )

        // Discount
        Text(
            text = item.discount,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFCCFF00),
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = 12.dp, end = 12.dp)
        )

        // Image
        AsyncImage(
            model = item.image,
            contentDescription = item.title,
            modifier = Modifier
                .size(110.dp)
                .align(Alignment.CenterEnd)
                .offset(x = (-10).dp),
            contentScale = ContentScale.Fit
        )
    }
}

// ============= Sport Combos View (3-column grid) =============

@Composable
fun SportCombosView(
    title: String = "Value Combos",
    headerActionUrl: String?,
    items: List<ComboItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        SectionHeader(title, headerActionUrl)

        // 3-Column Grid
        val rows = (items.size + 2) / 3
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            for (row in 0 until rows) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    for (col in 0..2) {
                        val index = row * 3 + col
                        if (index < items.size) {
                            Box(modifier = Modifier.weight(1f)) {
                                ComboCard(items[index])
                            }
                        } else {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ComboCard(item: ComboItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF4C7BD3))
            .padding(5.dp)
            .clickable { },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Image Container
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(8.dp))
                .background(Color.White)
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.title,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(6.dp),
                contentScale = ContentScale.Fit
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Text Content
        Text(
            text = item.title,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Center,
            maxLines = 2
        )
        Text(
            text = item.discount,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFCCFF00),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(4.dp))
    }
}

// ============= Sport Cricket Season View =============

@Composable
fun SportCricketSeasonView(
    title: String = "Cricket Season",
    headerActionUrl: String?,
    items: List<CricketItem>
) {
    if (items.size < 3) return

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        SectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Main Card (first item)
            item {
                CricketMainCard(items.first())
            }

            // Secondary Cards (rest)
            items(items.drop(1)) { item ->
                CricketSecondaryCard(item)
            }
        }
    }
}

@Composable
fun CricketMainCard(item: CricketItem) {
    Box(
        modifier = Modifier
            .width(160.dp)
            .height(220.dp)
            .clip(RoundedCornerShape(16.dp))
            .clickable { }
    ) {
        // Background Image
        AsyncImage(
            model = item.bgImage,
            contentDescription = "Cricket",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Black.copy(alpha = 0.1f), Color.Black.copy(alpha = 0.7f))
                    )
                )
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item.mainText?.split(" ")?.forEach { word ->
                Text(
                    text = word,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    fontStyle = FontStyle.Italic,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
            }

            item.subText?.let {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = it,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    fontStyle = FontStyle.Italic,
                    color = Color(0xFFCCFF00)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Arrow Button
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(Color.White),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = "Go",
                    tint = Color.Black,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}

@Composable
fun CricketSecondaryCard(item: CricketItem) {
    Box(
        modifier = Modifier
            .width(150.dp)
            .height(220.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF1E293B), Color(0xFF0F172A))
                )
            )
            .clickable { }
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Header
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                item.title?.let {
                    Text(
                        text = it,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
                item.offer?.let {
                    Text(
                        text = it,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFCCFF00)
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Image
            AsyncImage(
                model = item.image,
                contentDescription = item.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .padding(horizontal = 4.dp, vertical = 12.dp),
                contentScale = ContentScale.Fit
            )
        }
    }
}

// ============= Sport Winner Brands View =============

@Composable
fun SportWinnerBrandsView(
    title: String = "Winner Brands",
    headerActionUrl: String?,
    items: List<WinnerBrandItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        SectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                WinnerBrandCard(item)
            }
        }
    }
}

@Composable
fun WinnerBrandCard(item: WinnerBrandItem) {
    val logoColor = item.logoColor?.let { safeParseColor(it) } ?: Color.Black

    Column(
        modifier = Modifier
            .width(280.dp)
            .height(420.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color(0xFFE3F2FD))
            .padding(24.dp)
            .clickable { },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Brand Logo/Name
        Box(
            modifier = Modifier.height(50.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = item.brand,
                fontSize = 30.sp,
                fontWeight = FontWeight.Black,
                fontStyle = FontStyle.Italic,
                color = logoColor,
                maxLines = 1
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Image Container
        Box(
            modifier = Modifier
                .size(240.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color.White),
            contentAlignment = Alignment.Center
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.brand,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(10.dp),
                contentScale = ContentScale.Fit
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        // Offer Text
        Text(
            text = item.offer,
            fontSize = 26.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color(0xFF111827),
            textAlign = TextAlign.Center
        )
    }
}

// ============= Sport Wishlist View =============

@Composable
fun SportWishlistView(
    title: String = "Add to your wishlist",
    headerActionUrl: String?,
    items: List<WishlistItem>
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFFFCCBC)) // Peach background
            .padding(16.dp)
    ) {
        Column {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 2-Column Grid
            val rows = (items.size + 1) / 2
            Column(
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                for (row in 0 until rows) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        val index1 = row * 2
                        val index2 = row * 2 + 1
                        if (index1 < items.size) {
                            Box(modifier = Modifier.weight(1f)) {
                                WishlistCard(items[index1])
                            }
                        }
                        if (index2 < items.size) {
                            Box(modifier = Modifier.weight(1f)) {
                                WishlistCard(items[index2])
                            }
                        } else {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WishlistCard(item: WishlistItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .shadow(2.dp, RoundedCornerShape(12.dp))
            .clickable { }
    ) {
        // Image
        AsyncImage(
            model = item.image,
            contentDescription = item.title,
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp),
            contentScale = ContentScale.Crop
        )

        // Text Content
        Column(
            modifier = Modifier.padding(8.dp)
        ) {
            Text(
                text = item.title,
                fontSize = 12.sp,
                color = Color(0xFF666666),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = item.price,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }
    }
}

// ============= Helper: Section Header =============

@Composable
private fun SectionHeader(title: String, actionUrl: String?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827)
        )
        if (actionUrl != null) {
            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = "View More",
                tint = Color(0xFF111827),
                modifier = Modifier
                    .size(18.dp)
                    .clickable { }
            )
        }
    }
}
