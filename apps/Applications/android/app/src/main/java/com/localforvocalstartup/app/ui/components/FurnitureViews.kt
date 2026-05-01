package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.google.gson.annotations.SerializedName

// Models
data class FurnitureDealItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val image: String,
    val price: String,
    val actionUrl: String?
)

data class FBrandItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val image: String,
    val logo: String?,
    val brandName: String?,
    val price: String,
    val actionUrl: String?
)

data class FurnitureBannerItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val image: String,
    val actionUrl: String?
)

data class FurnitureGrabItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val image: String,
    val price: String,
    val actionUrl: String?
)

// Views Group 1

@Composable
fun FurnitureDealOfDayView(title: String, headerActionUrl: String?, items: List<FurnitureDealItem>) {
    Column(
        modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Text(
                    text = "View All ›",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black,
                    modifier = Modifier.clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        LazyRow(
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                FurnitureDealCard(item)
            }
        }
    }
}

@Composable
fun FurnitureDealCard(item: FurnitureDealItem) {
    Box(
        modifier = Modifier
            .width(250.dp)
            .height(160.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize().background(Color(0xFFF0F0F0))
        )
        
        Column(
            modifier = Modifier.align(Alignment.BottomStart).fillMaxWidth()
        ) {
            // Shadow text
            Text(
                text = item.title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .padding(horizontal = 8.dp)
                    .padding(bottom = 8.dp)
                    .shadow(elevation = 2.dp, shape = RoundedCornerShape(2.dp)) // Pseudo-shadow
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.Black)
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = item.price,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.weight(1f))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}

@Composable
fun FurnitureTopBrandsView(title: String, headerActionUrl: String?, items: List<FBrandItem>) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 24.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Brush.verticalGradient(listOf(Color(0xFFFFF176), Color(0xFFFFD54F))))
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(top = 16.dp)) {
            Row(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .clickable { headerActionUrl?.let { NavigationManager.navigate(it) } },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "$title ›",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                Text(text = "🚀", fontSize = 20.sp)
            }
            LazyRow(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(items) { item ->
                    FurnitureTopBrandCard(item)
                }
            }
        }
    }
}

@Composable
fun FurnitureTopBrandCard(item: FBrandItem) {
    Column(
        modifier = Modifier.width(140.dp).clickable { item.actionUrl?.let { NavigationManager.navigate(it) } },
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier.width(140.dp).height(180.dp).clip(RoundedCornerShape(12.dp))
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize().background(Color.Gray.copy(alpha = 0.1f))
            )
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 12.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color.White)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                if (!item.logo.isNullOrEmpty()) {
                    AsyncImage(
                        model = item.logo,
                        contentDescription = null,
                        contentScale = ContentScale.Fit,
                        modifier = Modifier.height(16.dp)
                    )
                } else if (!item.brandName.isNullOrEmpty()) {
                    Text(
                        text = item.brandName,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
        Text(
            text = item.price,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black
        )
    }
}

@Composable
fun FurnitureSponsorshipBannerView(items: List<FurnitureBannerItem>) {
    items.firstOrNull()?.let { banner ->
        AsyncImage(
            model = banner.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .padding(bottom = 24.dp)
                .height(110.dp)
                .clip(RoundedCornerShape(16.dp))
                .clickable { banner.actionUrl?.let { NavigationManager.navigate(it) } }
        )
    }
}

@Composable
fun FurnitureGrabOrGoneView(title: String, headerActionUrl: String?, items: List<FurnitureGrabItem>) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 24.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFFFCCBC))
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.weight(1f))
                if (!headerActionUrl.isNullOrEmpty()) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                        contentDescription = null,
                        tint = Color.Black,
                        modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                    )
                }
            }
            // Wait, we need a 2-column Grid. Since LazyVerticalGrid must have a fixed height or weight inside scroll containers,
            // we'll emulate a 2-column grid using standard rows if nested in scroll.
            // Better to use FlowRow or chunked indices to avoid nested lazy context issues.
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items.chunked(2).forEach { rowItems ->
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        rowItems.forEach { item ->
                            Box(modifier = Modifier.weight(1f)) {
                                FurnitureGrabCard(item)
                            }
                        }
                        // Pad empty space if odd number
                        if (rowItems.size < 2) {
                            Spacer(modifier = Modifier.weight((2 - rowItems.size).toFloat()))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureGrabCard(item: FurnitureGrabItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } },
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxWidth().height(120.dp).background(Color.Gray.copy(alpha = 0.1f))
        )
        Column(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp).padding(bottom = 8.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
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
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }
    }
}

// Models Group 3

data class FurnitureMaterialItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val name: String,
    val image: String,
    val actionUrl: String?
)

data class FurnitureTrendingItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val titleLine1: String,
    val titleLine2: String?,
    val icon: String, // Might be an SF symbol, ignore or map to generic icon in Android
    val iconColor: String,
    val backgroundColor: String,
    val actionUrl: String?
)

data class FurnitureWishlistItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String?,
    val price: String?,
    val image: String?,
    val actionUrl: String?
)

data class FurnitureReviewItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val product: String,
    val rating: Int,
    val review: String,
    val user: String,
    val image: String,
    val actionUrl: String?
)

// Views Group 3

@Composable
fun FurnitureShopByMaterialView(title: String, headerActionUrl: String?, items: List<FurnitureMaterialItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items.chunked(2).forEach { rowItems ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    rowItems.forEach { item ->
                        Box(modifier = Modifier.weight(1f)) {
                            FurnitureMaterialCard(item)
                        }
                    }
                    if (rowItems.size < 2) {
                        Spacer(modifier = Modifier.weight((2 - rowItems.size).toFloat()))
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureMaterialCard(item: FurnitureMaterialItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 2.dp, shape = RoundedCornerShape(12.dp))
            .background(Color.White)
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } },
        verticalArrangement = Arrangement.spacedBy(0.dp)
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxWidth().height(150.dp).background(Color.Gray.copy(alpha = 0.1f)).clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
        )
        Box(
            modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = item.name,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Black,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun FurnitureTrendingNowView(title: String, headerActionUrl: String?, items: List<FurnitureTrendingItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.chunked(2).forEach { rowItems ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    rowItems.forEach { item ->
                        Box(modifier = Modifier.weight(1f)) {
                            FurnitureTrendingCard(item)
                        }
                    }
                    if (rowItems.size < 2) {
                        Spacer(modifier = Modifier.weight((2 - rowItems.size).toFloat()))
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureTrendingCard(item: FurnitureTrendingItem) {
    val bgColorHex = item.backgroundColor.let { if (it.startsWith("#")) it else "#$it" }
    val bgColor = try { Color(android.graphics.Color.parseColor(bgColorHex)) } catch (e: Exception) { Color(0xFFEEEEEE) }
    
    val iconColorHex = item.iconColor.let { if (it.startsWith("#")) it else "#$it" }
    val iconColor = try { Color(android.graphics.Color.parseColor(iconColorHex)) } catch (e: Exception) { Color(0xFF666666) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height(140.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Box(
            modifier = Modifier
                .size(if (item.titleLine1 == "Betul's") 50.dp else 60.dp)
                .clip(androidx.compose.foundation.shape.CircleShape)
                .background(Color.White.copy(alpha = 0.8f)),
            contentAlignment = Alignment.Center
        ) {
            // Mapping SF symbol roughly to a star or default icon since we don't have exact mappings
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier.size(if (item.titleLine1 == "Betul's") 24.dp else 32.dp)
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
            Text(
                text = item.titleLine1,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            if (!item.titleLine2.isNullOrEmpty()) {
                Text(
                    text = item.titleLine2,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
            }
        }
    }
}

@Composable
fun FurnitureWishlistView(title: String, items: List<FurnitureWishlistItem>) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 24.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFFFCCBC))
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                items.chunked(2).forEach { rowItems ->
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        rowItems.forEach { item ->
                            Box(modifier = Modifier.weight(1f)) {
                                FurnitureWishlistCard(item)
                            }
                        }
                        if (rowItems.size < 2) {
                            Spacer(modifier = Modifier.weight((2 - rowItems.size).toFloat()))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureWishlistCard(item: FurnitureWishlistItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
            .shadow(elevation = 1.dp, shape = RoundedCornerShape(12.dp)),
        verticalArrangement = Arrangement.spacedBy(0.dp)
    ) {
        if (!item.image.isNullOrEmpty()) {
            AsyncImage(
                model = item.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxWidth().height(140.dp).background(Color.Gray.copy(alpha = 0.1f)).clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
            )
        }
        Column(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            if (!item.title.isNullOrEmpty()) {
                Text(
                    text = item.title,
                    fontSize = 12.sp,
                    color = Color(0xFF666666),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
            if (!item.price.isNullOrEmpty()) {
                Text(
                    text = item.price,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
        }
    }
}

@Composable
fun FurnitureCustomerReviewsView(title: String, headerActionUrl: String?, items: List<FurnitureReviewItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color.Black,
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                FurnitureReviewCard(item)
            }
        }
    }
}

@Composable
fun FurnitureReviewCard(item: FurnitureReviewItem) {
    Box(
        modifier = Modifier
            .width(250.dp)
            .height(280.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFF9575CD))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = item.product,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                    for (i in 0 until 5) {
                        Text(
                            text = "★",
                            fontSize = 12.sp,
                            color = if (i < item.rating) Color(0xFFFFEB3B) else Color.Gray.copy(alpha = 0.5f)
                        )
                    }
                }
            }
            
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.White.copy(alpha = 0.6f))
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = item.review,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.Black,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = item.user,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = androidx.compose.ui.text.style.TextAlign.End
                )
            }
        }
        
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .align(Alignment.Center)
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
                .height(120.dp)
                .offset(y = (-10).dp)
        )
    }
}

// Models Group 2

data class FurnitureRoomItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val image: String,
    val color: String?,
    val actionUrl: String?
)

data class FurnitureEmiItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val image: String,
    val price: String,
    val actionUrl: String?
)

data class FBrandGridItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val logo: String?,
    val isViewAll: Boolean?,
    val actionUrl: String?
)

// Views Group 2

@Composable
fun FurnitureShopByRoomView(title: String, headerActionUrl: String?, items: List<FurnitureRoomItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.chunked(2).forEach { rowItems ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    rowItems.forEach { item ->
                        Box(modifier = Modifier.weight(1f)) {
                            FurnitureRoomCard(item)
                        }
                    }
                    if (rowItems.size < 2) {
                        Spacer(modifier = Modifier.weight((2 - rowItems.size).toFloat()))
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureRoomCard(item: FurnitureRoomItem) {
    // Parse color or fallback to #FFD54F
    val hexColor = item.color?.let { if (it.startsWith("#")) it else "#$it" } ?: "#FFD54F"
    val parsedColor = try {
        Color(android.graphics.Color.parseColor(hexColor))
    } catch (e: Exception) {
        Color(0xFFFFD54F) // Fallback
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFEEEEEE))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxWidth().height(200.dp).background(Color.Gray.copy(alpha = 0.1f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(bottom = 12.dp, start = 12.dp, end = 12.dp, top = 12.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(parsedColor)
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = item.title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black,
                    maxLines = 1,
                    modifier = Modifier.weight(1f)
                )
                Box(
                    modifier = Modifier
                        .size(20.dp)
                        .clip(androidx.compose.foundation.shape.CircleShape)
                        .background(Color.Black),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(10.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun FurnitureSamarthStoreView(title: String, headerActionUrl: String?, items: List<FurnitureBannerItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        items.firstOrNull()?.let { banner ->
            AsyncImage(
                model = banner.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .height(100.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { banner.actionUrl?.let { NavigationManager.navigate(it) } }
            )
        }
    }
}

@Composable
fun FurnitureEmiOffersView(title: String, headerActionUrl: String?, items: List<FurnitureEmiItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                FurnitureEmiCard(item)
            }
        }
    }
}

@Composable
fun FurnitureEmiCard(item: FurnitureEmiItem) {
    Column(
        modifier = Modifier
            .width(140.dp)
            .height(180.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxWidth().height(135.dp).background(Color.Gray.copy(alpha = 0.1f))
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .height(45.dp)
                .background(Color.Black),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = item.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                maxLines = 1
            )
            Text(
                text = item.price,
                fontSize = 12.sp,
                color = Color(0xFFCCCCCC),
                maxLines = 1
            )
        }
    }
}

@Composable
fun FurnitureTopFurnitureBrandsView(title: String, headerActionUrl: String?, items: List<FBrandGridItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.chunked(3).forEach { rowItems ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    rowItems.forEach { item ->
                        Box(modifier = Modifier.weight(1f).aspectRatio(1f)) {
                            FurnitureBrandGridCard(item)
                        }
                    }
                    if (rowItems.size < 3) {
                        Spacer(modifier = Modifier.weight((3 - rowItems.size).toFloat()))
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureBrandGridCard(item: FBrandGridItem) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFFFFF9C4))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } },
        contentAlignment = Alignment.Center
    ) {
        if (item.isViewAll == true) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "View all",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                Box(
                    modifier = Modifier.size(24.dp).clip(androidx.compose.foundation.shape.CircleShape).background(Color.Black),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(10.dp)
                    )
                }
            }
        } else if (!item.logo.isNullOrEmpty()) {
            AsyncImage(
                model = item.logo,
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxSize().padding(12.dp)
            )
        }
    }
}

// Models Group 4

data class FurnitureEverybodyItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val subtitle: String,
    val image: String,
    val actionUrl: String?
)

data class FurnitureRareFindItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val image: String,
    val actionUrl: String?
)

data class FurnitureStatementPieceItem(
    @SerializedName("id", alternate = ["_id"]) val id: String,
    val title: String,
    val image: String,
    val actionUrl: String?
)

// Views Group 4

@Composable
fun FurnitureEverybodyListView(title: String, items: List<FurnitureEverybodyItem>) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 24.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFFFCCBC))
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                items.chunked(2).forEach { rowItems ->
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        rowItems.forEach { item ->
                            Box(modifier = Modifier.weight(1f)) {
                                FurnitureEverybodyCard(item)
                            }
                        }
                        if (rowItems.size < 2) {
                            Spacer(modifier = Modifier.weight((2 - rowItems.size).toFloat()))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FurnitureEverybodyCard(item: FurnitureEverybodyItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
            .shadow(elevation = 1.dp, shape = RoundedCornerShape(12.dp)),
        verticalArrangement = Arrangement.spacedBy(0.dp)
    ) {
        if (!item.image.isNullOrEmpty()) {
            AsyncImage(
                model = item.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxWidth().height(140.dp).background(Color.Gray.copy(alpha = 0.1f)).clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
            )
        }
        Column(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = item.title,
                fontSize = 12.sp,
                color = Color(0xFF666666),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = item.subtitle,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }
    }
}

@Composable
fun FurnitureRareFindsView(title: String, headerActionUrl: String?, items: List<FurnitureRareFindItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color.Black,
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                FurnitureRareFindCard(item)
            }
        }
    }
}

@Composable
fun FurnitureRareFindCard(item: FurnitureRareFindItem) {
    Box(
        modifier = Modifier
            .width(280.dp)
            .height(280.dp)
            .clip(RoundedCornerShape(24.dp))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize().background(Color.Gray.copy(alpha = 0.1f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 24.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color.White.copy(alpha = 0.85f))
                .padding(horizontal = 32.dp, vertical = 12.dp)
        ) {
            Text(
                text = item.title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }
    }
}

@Composable
fun FurnitureStatementPiecesView(title: String, headerActionUrl: String?, items: List<FurnitureStatementPieceItem>) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Spacer(modifier = Modifier.weight(1f))
            if (!headerActionUrl.isNullOrEmpty()) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = Color.Black,
                    modifier = Modifier.size(18.dp).clickable { NavigationManager.navigate(headerActionUrl) }
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                FurnitureStatementPieceCard(item)
            }
        }
    }
}

@Composable
fun FurnitureStatementPieceCard(item: FurnitureStatementPieceItem) {
    Box(
        modifier = Modifier
            .width(280.dp)
            .height(350.dp)
            .clip(RoundedCornerShape(24.dp))
            .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize().background(Color.Gray.copy(alpha = 0.1f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 24.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color.White.copy(alpha = 0.85f))
                .padding(horizontal = 32.dp, vertical = 12.dp)
        ) {
            Text(
                text = item.title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
                // Removed serif as Compose doesn't have an exact serif default that looks perfectly identical easily, 
                // but standard bold should be fine.
            )
        }
    }
}
