package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyHorizontalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.remote.NetworkClient

// ============= Data Classes =============

data class SubCategoryItem(
    val id: String,
    val name: String,
    val image: String?,
    val icon: String?
)

data class ShoppingForOthersCategoryItem(
    val id: String,
    val name: String,
    val slug: String,
    val image: String,
    val actionUrl: String?
)

data class EarlyBirdDealItem(
    val id: String,
    val image: String,
    val offer: String,
    val brand: String,
    val actionUrl: String?
)

data class SankrantiFestiveItem(
    val id: String,
    val image: String,
    val title: String,
    val price: String,
    val actionUrl: String?
)

data class ShoeStealItem(
    val id: String,
    val image: String,
    val title: String,
    val offer: String,
    val actionUrl: String?
)

data class WinterClearanceItem(
    val id: String,
    val image: String,
    val offer: String,
    val brand: String,
    val actionUrl: String?
)

// ============= Sub Category Slider =============

@Composable
fun SubCategorySliderView(
    parentCategoryId: String
) {
    var subCategories by remember { mutableStateOf<List<SubCategoryItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(parentCategoryId) {
        try {
            val result = NetworkClient.apiService.getSubCategories(parentCategoryId)
            subCategories = result.map { sub ->
                SubCategoryItem(
                    id = sub._id,
                    name = sub.name,
                    image = sub.image,
                    icon = sub.icon
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxWidth().height(200.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (subCategories.isNotEmpty()) {
            LazyHorizontalGrid(
                rows = GridCells.Fixed(2),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(230.dp),
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(subCategories) { sub ->
                    SubCategoryCell(sub)
                }
            }
        }
    }
}

@Composable
fun SubCategoryCell(sub: SubCategoryItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp),
        modifier = Modifier
            .width(80.dp)
            .clickable { }
    ) {
        // Image Container - Full bleed, no background
        Box(
            modifier = Modifier
                .size(70.dp)
                .clip(RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            AsyncImage(
                model = sub.image ?: sub.icon,
                contentDescription = sub.name,
                modifier = Modifier
                    .fillMaxSize()
                    .clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
        }
        Text(
            text = sub.name,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF374151),
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.width(80.dp)
        )
    }
}

// ============= Shopping For Others Hub =============

@Composable
fun ShoppingForOthersHubView(
    title: String = "Shopping for others?",
    subtitle: String = "Choose a category to start exploring",
    items: List<ShoppingForOthersCategoryItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF9FAFB))
            .padding(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Text(
                text = subtitle,
                fontSize = 14.sp,
                color = Color(0xFF6B7280)
            )
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                ShoppingCategoryCard(item)
            }
        }
    }
}

@Composable
fun ShoppingCategoryCard(item: ShoppingForOthersCategoryItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(136.dp)
            .background(Color.White, RoundedCornerShape(16.dp))
            .shadow(2.dp, RoundedCornerShape(16.dp))
            .clickable { }
            .padding(8.dp)
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = item.name,
            modifier = Modifier
                .size(120.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFF3F4F6)),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = item.name,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF111827),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}

// ============= Early Bird Deals =============

@Composable
fun EarlyBirdDealsView(
    title: String = "Early Bird Deals!",
    headerActionUrl: String?,
    items: List<EarlyBirdDealItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp)
            .padding(bottom = 24.dp)
            .background(Color(0xFFA2D2FF), RoundedCornerShape(16.dp))
            .padding(start = 16.dp, top = 16.dp, bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.clickable { }
        ) {
            Text(
                text = "$title ›",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        // Horizontal Scroll
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(end = 16.dp)
        ) {
            items(items) { item ->
                EarlyBirdCard(item)
            }
        }
    }
}

@Composable
fun EarlyBirdCard(item: EarlyBirdDealItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(140.dp).clickable { }
    ) {
        // Image
        AsyncImage(
            model = item.image,
            contentDescription = item.brand,
            modifier = Modifier
                .size(140.dp, 180.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color.White),
            contentScale = ContentScale.Crop
        )
        // Offer Badge
        Box(
            modifier = Modifier
                .width(140.dp)
                .offset(y = (-10).dp)
                .background(
                    Color(0xFF0056D2),
                    RoundedCornerShape(bottomStart = 12.dp, bottomEnd = 12.dp)
                )
                .padding(vertical = 6.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = item.offer,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
        // Brand
        Text(
            text = item.brand,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF334155),
            textAlign = TextAlign.Center,
            modifier = Modifier.offset(y = (-6).dp)
        )
    }
}

// ============= Sankranti Festival =============

@Composable
fun SankrantiFestivalView(
    title: String = "Shine bright this Sankranti",
    headerActionUrl: String?,
    items: List<SankrantiFestiveItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable { },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$title ›",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                FestiveCard(item)
            }
        }
    }
}

@Composable
fun FestiveCard(item: SankrantiFestiveItem) {
    Column(
        modifier = Modifier
            .width(130.dp)
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
                .width(130.dp)
                .height(160.dp)
                .background(Color(0xFFEEEEEE)),
            contentScale = ContentScale.Crop
        )
        // Festive Banner
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFBA68C8))
                .padding(vertical = 8.dp, horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Left Diamond
            Box(
                modifier = Modifier
                    .size(14.dp)
                    .background(Color(0xFFFFEB3B), RoundedCornerShape(2.dp))
            )

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = item.title,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.White.copy(alpha = 0.95f),
                    maxLines = 1,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = item.price,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
            }

            // Right Diamond
            Box(
                modifier = Modifier
                    .size(14.dp)
                    .background(Color(0xFFFFEB3B), RoundedCornerShape(2.dp))
            )
        }
    }
}

// ============= Shoe Steal Fest =============

@Composable
fun ShoeStealFestView(
    title: String = "Shoe's Steal Fest",
    headerActionUrl: String?,
    items: List<ShoeStealItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable { },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$title ›",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                ShoeStealCard(item)
            }
        }
    }
}

@Composable
fun ShoeStealCard(item: ShoeStealItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(160.dp).clickable { }
    ) {
        // Image
        AsyncImage(
            model = item.image,
            contentDescription = item.title,
            modifier = Modifier
                .size(160.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFEEEEEE)),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.height(8.dp))
        // Info
        Text(
            text = item.title,
            fontSize = 12.sp,
            color = Color(0xFF4B5563),
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Text(
            text = item.offer,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111111),
            textAlign = TextAlign.Center
        )
    }
}

// ============= Winter Clearance Sale =============

@Composable
fun WinterClearanceSaleView(
    title: String = "Winter Clearance Sale",
    headerActionUrl: String?,
    items: List<WinterClearanceItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable { },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$title ›",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }

        // Horizontal Scroll
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                WinterClearanceCard(item)
            }
        }
    }
}

@Composable
fun WinterClearanceCard(item: WinterClearanceItem) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(150.dp)
            .height(240.dp)
            .background(Color(0xFF1E88E5), RoundedCornerShape(16.dp))
            .clickable { }
    ) {
        // Image with rounded bottom corners
        AsyncImage(
            model = item.image,
            contentDescription = item.brand,
            modifier = Modifier
                .width(150.dp)
                .height(180.dp)
                .clip(RoundedCornerShape(bottomStart = 40.dp, bottomEnd = 40.dp))
                .background(Color.White),
            contentScale = ContentScale.Crop
        )
        // Bottom Info
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp)
        ) {
            Text(
                text = item.offer,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Box(
                modifier = Modifier
                    .background(Color.White, RoundedCornerShape(4.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = item.brand.uppercase(),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111111)
                )
            }
        }
    }
}
