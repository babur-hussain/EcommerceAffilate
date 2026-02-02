package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
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
import kotlinx.coroutines.delay

// ============= Books Data Classes =============

data class BestsellerItem(
    val id: String,
    val title: String,
    val author: String,
    val image: String,
    val price: String,
    val originalPrice: String?,
    val rating: Double?,
    val actionUrl: String?
)

data class GenreItem(
    val id: String,
    val name: String,
    val image: String,
    val bgColor: String?,
    val actionUrl: String?
)

data class AuthorItem(
    val id: String,
    val name: String,
    val image: String,
    val booksCount: Int?,
    val actionUrl: String?
)

data class BookDealItem(
    val id: String,
    val title: String,
    val subtitle: String?,
    val image: String,
    val discount: String,
    val bgGradient: List<String>?,
    val actionUrl: String?
)

data class NewArrivalItem(
    val id: String,
    val title: String,
    val author: String,
    val image: String,
    val price: String,
    val badge: String?,
    val actionUrl: String?
)

data class StationeryItem(
    val id: String,
    val name: String,
    val image: String,
    val price: String,
    val discount: String?,
    val actionUrl: String?
)

data class BookBannerItem(
    val id: String,
    val title: String,
    val subtitle: String?,
    val image: String,
    val bgColor: String?,
    val actionUrl: String?
)

// ============= Bestsellers View =============

@Composable
fun BooksBestsellersView(
    title: String = "Bestsellers",
    headerActionUrl: String?,
    items: List<BestsellerItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                BestsellerCard(item)
            }
        }
    }
}

@Composable
fun BestsellerCard(item: BestsellerItem) {
    Column(
        modifier = Modifier
            .width(140.dp)
            .clickable { }
    ) {
        // Book Cover
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(8.dp))
                .shadow(4.dp, RoundedCornerShape(8.dp))
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Title
        Text(
            text = item.title,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF111827),
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )

        // Author
        Text(
            text = item.author,
            fontSize = 12.sp,
            color = Color(0xFF6B7280),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )

        // Rating
        item.rating?.let { rating ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(top = 4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Rating",
                    tint = Color(0xFFFFC107),
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = rating.toString(),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF374151)
                )
            }
        }

        // Price
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(top = 4.dp)
        ) {
            Text(
                text = item.price,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF059669)
            )
            item.originalPrice?.let {
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = it,
                    fontSize = 12.sp,
                    color = Color(0xFF9CA3AF),
                    fontWeight = FontWeight.Normal
                )
            }
        }
    }
}

// ============= Shop By Genre View =============

@Composable
fun BooksGenreView(
    title: String = "Shop by Genre",
    headerActionUrl: String?,
    items: List<GenreItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                GenreCard(item)
            }
        }
    }
}

@Composable
fun GenreCard(item: GenreItem) {
    val bgColor = item.bgColor?.let { safeParseColor(it) } ?: Color(0xFFF3E5F5)

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(100.dp)
            .clickable { }
    ) {
        Box(
            modifier = Modifier
                .size(90.dp)
                .clip(CircleShape)
                .background(bgColor),
            contentAlignment = Alignment.Center
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.name,
                modifier = Modifier
                    .size(60.dp)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = item.name,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF374151),
            textAlign = TextAlign.Center,
            maxLines = 2
        )
    }
}

// ============= Featured Authors View =============

@Composable
fun BooksAuthorsView(
    title: String = "Featured Authors",
    headerActionUrl: String?,
    items: List<AuthorItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                AuthorCard(item)
            }
        }
    }
}

@Composable
fun AuthorCard(item: AuthorItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(100.dp)
            .clickable { }
    ) {
        // Author Photo
        AsyncImage(
            model = item.image,
            contentDescription = item.name,
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .shadow(4.dp, CircleShape),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = item.name,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF111827),
            textAlign = TextAlign.Center,
            maxLines = 2
        )

        item.booksCount?.let { count ->
            Text(
                text = "$count books",
                fontSize = 11.sp,
                color = Color(0xFF6B7280),
                textAlign = TextAlign.Center
            )
        }
    }
}

// ============= Book Deals View =============

@Composable
fun BooksDealsView(
    title: String = "Book Deals",
    headerActionUrl: String?,
    items: List<BookDealItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                BookDealCard(item)
            }
        }
    }
}

@Composable
fun BookDealCard(item: BookDealItem) {
    val gradientColors = item.bgGradient?.map { safeParseColor(it) }
        ?: listOf(Color(0xFF7C3AED), Color(0xFF4F46E5))

    Box(
        modifier = Modifier
            .width(280.dp)
            .height(160.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Brush.horizontalGradient(gradientColors))
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
                        fontSize = 13.sp,
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
                        text = item.discount,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = gradientColors.first()
                    )
                }
            }

            // Book Image
            AsyncImage(
                model = item.image,
                contentDescription = item.title,
                modifier = Modifier
                    .width(90.dp)
                    .height(130.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .shadow(8.dp, RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop
            )
        }
    }
}

// ============= New Arrivals View =============

@Composable
fun BooksNewArrivalsView(
    title: String = "New Arrivals",
    headerActionUrl: String?,
    items: List<NewArrivalItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

        // 2-Column Grid
        val rows = (items.size + 1) / 2
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
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
                            NewArrivalCard(items[index1])
                        }
                    }
                    if (index2 < items.size) {
                        Box(modifier = Modifier.weight(1f)) {
                            NewArrivalCard(items[index2])
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
fun NewArrivalCard(item: NewArrivalItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .shadow(2.dp, RoundedCornerShape(12.dp))
            .clickable { }
    ) {
        Box {
            AsyncImage(
                model = item.image,
                contentDescription = item.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp),
                contentScale = ContentScale.Crop
            )

            // Badge
            item.badge?.let { badge ->
                Box(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(8.dp)
                        .background(Color(0xFFEF4444), RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = badge,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Text(
                text = item.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF111827),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = item.author,
                fontSize = 12.sp,
                color = Color(0xFF6B7280),
                maxLines = 1
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = item.price,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF059669)
            )
        }
    }
}

// ============= Stationery View =============

@Composable
fun BooksStationeryView(
    title: String = "Stationery & Supplies",
    headerActionUrl: String?,
    items: List<StationeryItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

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
                                StationeryCard(items[index])
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
fun StationeryCard(item: StationeryItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFFFFF7ED))
            .clickable { },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                .background(Color.White)
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.name,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(8.dp),
                contentScale = ContentScale.Fit
            )

            // Discount Badge
            item.discount?.let { discount ->
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(4.dp)
                        .background(Color(0xFFEF4444), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = discount,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = item.name,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF374151),
                textAlign = TextAlign.Center,
                maxLines = 2
            )
            Text(
                text = item.price,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF059669)
            )
        }
    }
}

// ============= Books Banner Carousel =============

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun BooksBannerView(
    items: List<BookBannerItem>
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
            .padding(bottom = 24.dp)
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            pageSpacing = 12.dp
        ) { page ->
            BookBannerCard(items[page])
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Page Indicators
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(items.size) { index ->
                val isActive = pagerState.currentPage == index
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .width(if (isActive) 20.dp else 8.dp)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(if (isActive) Color(0xFF7C3AED) else Color(0xFFE5E7EB))
                )
            }
        }
    }
}

@Composable
fun BookBannerCard(item: BookBannerItem) {
    val bgColor = item.bgColor?.let { safeParseColor(it) } ?: Color(0xFFFEF3C7)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .clickable { }
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
                    text = item.title,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827),
                    lineHeight = 28.sp
                )
                item.subtitle?.let {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = it,
                        fontSize = 14.sp,
                        color = Color(0xFF6B7280)
                    )
                }
            }

            AsyncImage(
                model = item.image,
                contentDescription = item.title,
                modifier = Modifier
                    .width(100.dp)
                    .height(140.dp)
                    .clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop
            )
        }
    }
}

// ============= Reading Lists View =============

data class ReadingListItem(
    val id: String,
    val name: String,
    val description: String?,
    val booksCount: Int,
    val coverImages: List<String>,
    val actionUrl: String?
)

@Composable
fun BooksReadingListsView(
    title: String = "Curated Reading Lists",
    headerActionUrl: String?,
    items: List<ReadingListItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp)
    ) {
        BooksSectionHeader(title, headerActionUrl)

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                ReadingListCard(item)
            }
        }
    }
}

@Composable
fun ReadingListCard(item: ReadingListItem) {
    Column(
        modifier = Modifier
            .width(200.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFF3F4F6))
            .clickable { }
            .padding(12.dp)
    ) {
        // Stacked Book Covers
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)
        ) {
            item.coverImages.take(3).forEachIndexed { index, imageUrl ->
                AsyncImage(
                    model = imageUrl,
                    contentDescription = "Book cover",
                    modifier = Modifier
                        .width(70.dp)
                        .height(100.dp)
                        .offset(x = (index * 30).dp, y = (index * 5).dp)
                        .clip(RoundedCornerShape(4.dp))
                        .shadow(4.dp, RoundedCornerShape(4.dp)),
                    contentScale = ContentScale.Crop
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = item.name,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            maxLines = 2
        )

        item.description?.let {
            Text(
                text = it,
                fontSize = 12.sp,
                color = Color(0xFF6B7280),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = "${item.booksCount} books",
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF7C3AED)
        )
    }
}

// ============= Helper: Section Header =============

@Composable
private fun BooksSectionHeader(title: String, actionUrl: String?) {
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
            Text(
                text = "View All",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF7C3AED),
                modifier = Modifier.clickable { }
            )
        }
    }
}
