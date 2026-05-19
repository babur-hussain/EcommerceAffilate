package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay

// ============= Beauty Data Classes =============

data class KBeautyItem(
    val id: String,
    val brand: String,
    val image: String,
    val ingredientTitle: String?,
    val ingredient: String,
    val offer: String,
    val bg: String?,
    val actionUrl: String?,
    val darkText: Boolean? = false
)

data class TrendMoreItem(
    val id: String,
    val title: String,
    val image: String,
    val brands: String,
    val offer: String,
    val actionUrl: String?
)

data class LaunchPartyItem(
    val id: String,
    val image: String,
    val offer: String,
    val actionUrl: String?
)

data class InternetFamedItem(
    val id: String,
    val brand: String,
    val desc: String,
    val image: String,
    val offer: String,
    val bg: List<String>?,
    val actionUrl: String?
)

data class GlamBudgetItem(
    val id: String,
    val label: String,
    val value: String,
    val sub: String?,
    val bg: List<String>?,
    val actionUrl: String?
)

// ============= K-Beauty Carousel =============

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun KBeautyView(
    title: String = "K-Beauty",
    headerActionUrl: String?,
    items: List<KBeautyItem>
) {
    if (items.isEmpty()) return

    val pagerState = rememberPagerState(pageCount = { items.size })

    // Auto-scroll
    LaunchedEffect(pagerState) {
        while (true) {
            delay(5000)
            val next = (pagerState.currentPage + 1) % items.size
            pagerState.animateScrollToPage(next)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 32.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { handleActionUrl(headerActionUrl) }
                )
            }
        }

        // Carousel
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .height(340.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            pageSpacing = 12.dp
        ) { page ->
            KBeautyCard(items[page])
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Pagination Dots
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(items.size) { index ->
                val isActive = pagerState.currentPage == index
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .width(if (isActive) 24.dp else 12.dp)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(if (isActive) Color.Black else Color(0xFFE0E0E0))
                )
            }
        }
    }
}

@Composable
fun KBeautyCard(item: KBeautyItem) {
    val bgColor = item.bg?.let { safeParseColor(it) } ?: Color.White
    val textColor = if (item.darkText == true) Color.Black else Color.White

    Box(
        modifier = Modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .clickable { handleActionUrl(item.actionUrl) }
    ) {
        // Main Image
        AsyncImage(
            model = item.image,
            contentDescription = item.brand,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Brand Pill
        Box(
            modifier = Modifier
                .padding(20.dp)
                .background(Color.White.copy(alpha = 0.3f), CircleShape)
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Text(
                text = item.brand,
                fontSize = 24.sp,
                fontWeight = FontWeight.Light,
                color = textColor,
                letterSpacing = 2.sp
            )
        }

        // Ingredient Box (Right side)
        Box(
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .offset(y = (-40).dp)
                .background(
                    Color(0xFFE91E63),
                    RoundedCornerShape(topStart = 16.dp, bottomStart = 16.dp)
                )
                .padding(vertical = 16.dp, horizontal = 12.dp)
                .shadow(4.dp)
        ) {
            Column {
                Text(
                    text = item.ingredientTitle ?: "STAR\nINGREDIENT",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(Color.White.copy(alpha = 0.5f))
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = item.ingredient,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }

        // Gradient Footer with Offer
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp)
                .align(Alignment.BottomCenter)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.6f))
                    )
                )
        ) {
            Text(
                text = item.offer,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 20.dp)
            )
        }
    }
}

// ============= Trend More View =============

@Composable
fun BeautyTrendMoreView(
    title: String = "Trend More",
    headerActionUrl: String?,
    items: List<TrendMoreItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { handleActionUrl(headerActionUrl) }
                )
            }
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                TrendMoreCard(item)
            }
        }
    }
}

@Composable
fun TrendMoreCard(item: TrendMoreItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { handleActionUrl(item.actionUrl) }
    ) {
        // Main Card
        Box(
            modifier = Modifier
                .width(160.dp)
                .height(200.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0xFFE91E63))
        ) {
            Column {
                // Title
                Text(
                    text = item.title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp, bottom = 10.dp, start = 4.dp, end = 4.dp)
                )

                // Arched Image
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .clip(RoundedCornerShape(topStart = 100.dp, topEnd = 100.dp))
                        .background(Color.White)
                ) {
                    AsyncImage(
                        model = item.image,
                        contentDescription = item.title,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Footer Info
        Text(
            text = item.brands,
            fontSize = 10.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF666666)
        )
        Text(
            text = item.offer,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black
        )
    }
}

// ============= Launch Party View =============

@Composable
fun BeautyLaunchPartyView(
    title: String = "New Launches",
    headerActionUrl: String?,
    items: List<LaunchPartyItem>
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(Color(0xFFF06292), Color(0xFFFF8A65))
                )
            )
            .padding(16.dp)
    ) {
        Column {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Text(
                    text = title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                // Launch Party Badge
                Box(
                    modifier = Modifier
                        .background(Color(0xFFE91E63), CircleShape)
                        .padding(vertical = 6.dp, horizontal = 10.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("The", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("LAUNCH", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("party", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Horizontal Scroll
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(items) { item ->
                    LaunchPartyCard(item)
                }
            }
        }
    }
}

@Composable
fun LaunchPartyCard(item: LaunchPartyItem) {
    Column(
        modifier = Modifier
            .width(150.dp)
            .height(200.dp)
            .clip(RoundedCornerShape(16.dp))
            .clickable { handleActionUrl(item.actionUrl) }
    ) {
        // Image
        AsyncImage(
            model = item.image,
            contentDescription = "Launch product",
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .background(Color.White),
            contentScale = ContentScale.Crop
        )

        // Footer
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(35.dp)
                .background(Color(0xFFD32F2F)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = item.offer,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
    }
}

// ============= Internet Famed View (2-column grid) =============

@Composable
fun BeautyInternetFamedView(
    title: String = "Internet Famed",
    headerActionUrl: String?,
    items: List<InternetFamedItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { }
                )
            }
        }

        // 2-Column Grid (fixed height)
        val rows = (items.size + 1) / 2
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
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
                            InternetFamedCard(items[index1])
                        }
                    }
                    if (index2 < items.size) {
                        Box(modifier = Modifier.weight(1f)) {
                            InternetFamedCard(items[index2])
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
fun InternetFamedCard(item: InternetFamedItem) {
    val gradientColors = item.bg?.map { safeParseColor(it) }
        ?: listOf(Color(0xFFF8BBD0), Color(0xFFEC407A))

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { handleActionUrl(item.actionUrl) }
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(topStart = 80.dp, topEnd = 80.dp, bottomStart = 20.dp, bottomEnd = 20.dp))
                .background(Brush.verticalGradient(gradientColors))
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Brand Pill
                Box(
                    modifier = Modifier
                        .padding(top = 20.dp)
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                        .shadow(2.dp)
                ) {
                    Text(
                        text = item.brand,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }

                // Description
                Text(
                    text = item.desc,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.White,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp)
                )

                Spacer(modifier = Modifier.weight(1f))

                // Image at bottom
                AsyncImage(
                    model = item.image,
                    contentDescription = item.brand,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    contentScale = ContentScale.Fit
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Offer Text
        Text(
            text = item.offer,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black
        )
    }
}

// ============= Glam Budget View (3-column grid) =============

@Composable
fun BeautyGlamBudgetView(
    title: String = "Glam on a Budget",
    headerActionUrl: String?,
    items: List<GlamBudgetItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { }
                )
            }
        }

        // 3-Column Grid (fixed height)
        val rows = (items.size + 2) / 3
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            for (row in 0 until rows) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    for (col in 0..2) {
                        val index = row * 3 + col
                        if (index < items.size) {
                            Box(modifier = Modifier.weight(1f)) {
                                GlamBudgetCard(items[index])
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
fun GlamBudgetCard(item: GlamBudgetItem) {
    val gradientColors = item.bg?.map { safeParseColor(it) }
        ?: listOf(Color(0xFFFFFDE7), Color(0xFFFFD54F))

    Box(
        modifier = Modifier
            .aspectRatio(1f)
            .clip(RoundedCornerShape(12.dp))
            .background(Brush.verticalGradient(gradientColors))
            .clickable { handleActionUrl(item.actionUrl) },
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(8.dp)
        ) {
            Text(
                text = item.label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF5D4037)
            )
            Text(
                text = item.value,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF3E2723)
            )
            item.sub?.let {
                Text(
                    text = it,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF5D4037)
                )
            }
        }
    }
}

// ============= Additional Beauty Page Data Classes =============

data class HarvestItem(
    val id: String,
    val name: String,
    val image: String,
    val offer: String,
    val actionUrl: String?
)

data class AlisterItem(
    val id: String,
    val brand: String,
    val subBrand: String?,
    val model: String,
    val product: String,
    val offer: String,
    val bg: String,
    val actionUrl: String?
)

data class InternetBrandItem(
    val id: String,
    val brand: String,
    val image: String,
    val offer: String,
    val actionUrl: String?
)

data class ConsultantBannerItem(
    val id: String,
    val title: String,
    val subtitle: String?,
    val image: String,
    val actionUrl: String?
)

// ============= Glow for the Harvest View =============

@Composable
fun GlowForHarvestView(
    title: String = "Glow for the harvest",
    headerActionUrl: String?,
    items: List<HarvestItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 20.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { }
                )
            }
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                HarvestCard(item)
            }
        }
    }
}

@Composable
fun HarvestCard(item: HarvestItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { }
    ) {
        // Card
        Box(
            modifier = Modifier
                .width(140.dp)
                .height(180.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFFFFF3E0))
        ) {
            // Background pattern (festive)
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.radialGradient(
                            colors = listOf(Color(0xFFFFF8E1), Color(0xFFFFF3E0))
                        )
                    )
            )

            // Kite decorations
            Text(
                text = "🪁",
                fontSize = 24.sp,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
            )
            Text(
                text = "🪁",
                fontSize = 16.sp,
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(start = 8.dp, top = 16.dp)
            )

            // Product Image
            AsyncImage(
                model = item.image,
                contentDescription = item.name,
                modifier = Modifier
                    .size(90.dp)
                    .align(Alignment.Center),
                contentScale = ContentScale.Fit
            )

            // Offer Badge at bottom
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .height(40.dp)
                    .clip(RoundedCornerShape(topStart = 50.dp, topEnd = 50.dp))
                    .background(Color(0xFFE91E63)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = item.offer,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Name Pill
        Text(
            text = item.name,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF333333),
            modifier = Modifier
                .background(Color(0xFFFCE4EC), RoundedCornerShape(12.dp))
                .padding(horizontal = 16.dp, vertical = 4.dp)
        )
    }
}

// ============= Free Dermatologist's Consultant View =============

@Composable
fun DermatologistConsultantView(
    title: String = "Free dermatologist's consultant",
    headerActionUrl: String?,
    items: List<ConsultantBannerItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { }
                )
            }
        }

        // Banner Cards
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                ConsultantBannerCard(item)
            }
        }
    }
}

@Composable
fun ConsultantBannerCard(item: ConsultantBannerItem) {
    Box(
        modifier = Modifier
            .width(300.dp)
            .height(160.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(Color(0xFF4CAF50), Color(0xFF81C784))
                )
            )
            .clickable { }
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Text Content
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = item.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                item.subtitle?.let {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = it,
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.9f)
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                Box(
                    modifier = Modifier
                        .background(Color.White, RoundedCornerShape(20.dp))
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "Consult Now",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF4CAF50)
                    )
                }
            }

            // Doctor Image
            AsyncImage(
                model = item.image,
                contentDescription = "Dermatologist",
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
        }
    }
}

// ============= Globally Loved A-listers View =============

@Composable
fun GloballyLovedAlistersView(
    title: String = "Globally loved A-listers",
    headerActionUrl: String?,
    items: List<AlisterItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { }
                )
            }
        }

        // 2-Column Grid
        val rows = (items.size + 1) / 2
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
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
                            AlisterCard(items[index1])
                        }
                    }
                    if (index2 < items.size) {
                        Box(modifier = Modifier.weight(1f)) {
                            AlisterCard(items[index2])
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
fun AlisterCard(item: AlisterItem) {
    val bgColor = safeParseColor(item.bg)

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { }
    ) {
        // Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(190.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(bgColor)
        ) {
            // Brand Header
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 15.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = item.brand,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                item.subBrand?.let {
                    Text(
                        text = it.uppercase(),
                        fontSize = 8.sp,
                        color = Color(0xFF333333)
                    )
                }
            }

            // Model Image (Bottom Right)
            AsyncImage(
                model = item.model,
                contentDescription = item.brand,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .fillMaxWidth(0.7f)
                    .height(152.dp)
                    .clip(RoundedCornerShape(20.dp)),
                contentScale = ContentScale.Crop
            )

            // Product Image (Bottom Left)
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 10.dp, bottom = 10.dp)
                    .size(70.dp, 90.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.White.copy(alpha = 0.4f))
                    .shadow(4.dp, RoundedCornerShape(12.dp))
            ) {
                AsyncImage(
                    model = item.product,
                    contentDescription = "Product",
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(4.dp),
                    contentScale = ContentScale.Fit
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Offer Text
        Text(
            text = item.offer,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            textAlign = TextAlign.Center
        )
    }
}

// ============= Internet-famed Brands View =============

@Composable
fun InternetFamedBrandsView(
    title: String = "Internet-famed brands",
    headerActionUrl: String?,
    items: List<InternetBrandItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        // Header
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
                color = Color.Black
            )
            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { }
                )
            }
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                InternetBrandCard(item)
            }
        }
    }
}

@Composable
fun InternetBrandCard(item: InternetBrandItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { }
    ) {
        // Card
        Box(
            modifier = Modifier
                .width(140.dp)
                .height(180.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFFFCE4EC), Color(0xFFF8BBD0))
                    )
                )
        ) {
            // Brand name at top
            Text(
                text = item.brand,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFAD1457),
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 12.dp)
            )

            // Product Image
            AsyncImage(
                model = item.image,
                contentDescription = item.brand,
                modifier = Modifier
                    .size(100.dp)
                    .align(Alignment.Center),
                contentScale = ContentScale.Fit
            )

            // Offer at bottom
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .background(Color(0xFFE91E63))
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = item.offer,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}
