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
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class GlowForHarvestItem(
    val id: String,
    val name: String,
    val image: String,
    val offer: String,
    val actionUrl: String?
)

@Composable
fun GlowForHarvestView(
    title: String,
    headerActionUrl: String?,
    items: List<GlowForHarvestItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF000000)
            )

            if (headerActionUrl != null) {
                Text(
                    text = "View All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF6F00),
                    modifier = Modifier.clickable { 
                        // Handle navigation to headerActionUrl
                    }
                )
            }
        }

        // Scroll Content
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                GlowForHarvestCard(item = item)
            }
        }
    }
}

@Composable
fun GlowForHarvestCard(item: GlowForHarvestItem) {
    Column(
        modifier = Modifier.clickable {
            item.actionUrl?.let {
                // Navigate
            }
        },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Card ZStack Equivalent
        Box(
            modifier = Modifier
                .size(140.dp, 180.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFFFFF3E0))
        ) {
            // 1. Background Image Pattern
            AsyncImage(
                model = "https://res.cloudinary.com/deljcbcvu/image/upload/v1768414560/IMG_1856_tkqhto.jpg",
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxSize()
                    .alpha(0.6f)
            )

            // 2. Kites Decoration
            Box(modifier = Modifier.fillMaxSize()) {
                Text(
                    text = "🪁",
                    fontSize = 24.sp,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 10.dp, y = (-10).dp)
                        .rotate(15f)
                )

                Text(
                    text = "🪁",
                    fontSize = 16.sp,
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .offset(x = (-10).dp, y = 10.dp)
                        .rotate(-10f)
                )
            }

            // 3. Main Product Image
            AsyncImage(
                model = item.image,
                contentDescription = item.name,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .size(140.dp)
                    .align(Alignment.Center)
            )

            // 4. Offer Badge
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .offset(y = 10.dp)
                    .fillMaxWidth(0.9f)
                    .height(40.dp)
                    .background(Color(0xFFE91E63), RoundedCornerShape(50)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = item.offer,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(vertical = 6.dp)
                )
            }
        }

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
