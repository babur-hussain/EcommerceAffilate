package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.compose.foundation.shape.CircleShape
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.NavigationManager
import com.google.gson.annotations.SerializedName
import java.util.UUID

data class EidDealItem(
    @SerializedName("_id", alternate = ["id"])
    val id: String = UUID.randomUUID().toString(),
    
    @SerializedName("image", alternate = ["imageUrl", "image_url"])
    val image: String = "",
    
    @SerializedName("actionUrl", alternate = ["action_url"])
    val actionUrl: String? = null,
    
    val discountText: String? = null,
    val title: String? = null,
    val badgeText: String? = null,
    val overlayIcon: String? = null
)

@Composable
fun EidCelebrationDealsView(
    title: String?,
    backgroundImage: String?,
    lanternsImage: String?,
    items: List<EidDealItem>
) {
    val configuration = LocalConfiguration.current
    val cardWidth = configuration.screenWidthDp.dp * 0.26f

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 32.dp)
            .clip(RoundedCornerShape(12.dp))
    ) {
        // Background
        if (!backgroundImage.isNullOrEmpty()) {
            AsyncImage(
                model = backgroundImage,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.matchParentSize()
            )
        } else {
            Box(modifier = Modifier.matchParentSize().background(Color(0xFF265B59)))
        }

        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Header Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                if (!title.isNullOrEmpty()) {
                    Text(
                        text = title,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        maxLines = 1,
                        modifier = Modifier.padding(top = 32.dp).weight(1f)
                    )
                }

                if (!lanternsImage.isNullOrEmpty()) {
                    AsyncImage(
                        model = lanternsImage,
                        contentDescription = null,
                        contentScale = ContentScale.Fit,
                        modifier = Modifier
                            .size(80.dp)
                            .offset(y = (-8).dp)
                    )
                }
            }

            // Products Row
            LazyRow(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(items) { item ->
                    EidDealCard(item, cardWidth)
                }
            }
        }
    }
}

@Composable
private fun EidDealCard(item: EidDealItem, cardWidth: androidx.compose.ui.unit.Dp) {
    Column(
        modifier = Modifier
            .width(cardWidth)
            .clickable {
                if (!item.actionUrl.isNullOrEmpty()) {
                    NavigationManager.navigate(item.actionUrl)
                }
            },
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier
                .width(cardWidth)
                .height(cardWidth * 1.3f)
                .shadow(4.dp, RoundedCornerShape(12.dp))
                .background(Color(0xFFE5E7EB), RoundedCornerShape(12.dp))
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(12.dp))
            )

            if (!item.badgeText.isNullOrEmpty()) {
                Text(
                    text = item.badgeText,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.Black,
                    modifier = Modifier
                        .padding(8.dp)
                        .background(Color(0xFF4ADE80), CircleShape) // Using CircleShape as approx Capsule
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                        .align(Alignment.TopStart)
                )
            }

            if (!item.overlayIcon.isNullOrEmpty()) {
                AsyncImage(
                    model = item.overlayIcon,
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .size(30.dp)
                        .align(Alignment.BottomStart)
                        .offset(x = 4.dp, y = 15.dp)
                        .zIndex(2f)
                )
            }
        }

        if (!item.title.isNullOrEmpty()) {
            Text(
                text = item.title,
                fontSize = 13.sp,
                fontWeight = FontWeight.Normal,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
