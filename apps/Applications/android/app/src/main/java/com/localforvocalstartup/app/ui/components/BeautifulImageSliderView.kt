package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.google.gson.annotations.SerializedName
import java.util.UUID

data class BeautifulBannerData(
    @SerializedName("_id", alternate = ["id"])
    val id: String = UUID.randomUUID().toString(),
    
    @SerializedName("image", alternate = ["imageUrl", "image_url"])
    val image: String = "",
    
    @SerializedName("actionUrl", alternate = ["action_url"])
    val actionUrl: String? = null
)

@Composable
fun BeautifulImageSliderView(
    title: String?,
    banners: List<BeautifulBannerData>
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.dp
    val cardWidth = screenWidth * 0.75f
    val cardHeight = cardWidth * (1350f / 1080f)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 16.dp, bottom = 8.dp)
    ) {
        if (!title.isNullOrEmpty()) {
            Text(
                text = title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827),
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
            )
        }

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 20.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(banners) { banner ->
                AsyncImage(
                    model = banner.image,
                    contentDescription = null,
                    contentScale = ContentScale.Crop, // Fill frame cleanly
                    modifier = Modifier
                        .width(cardWidth)
                        .height(cardHeight)
                        .clip(RoundedCornerShape(16.dp))
                        .clickable {
                            if (!banner.actionUrl.isNullOrEmpty()) {
                                NavigationManager.navigate(banner.actionUrl)
                            }
                        }
                )
            }
        }
    }
}
