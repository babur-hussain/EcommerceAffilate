package com.ecommerceearn.app.ui.components
// Re-compile trigger

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class RecentItem(
    val id: String,
    val label: String,
    val image: String
)

@Composable
fun RecentHistoryView(userName: String = "User") {
    // Hardcoded items as per iOS implementation
    val recentItems = listOf(
        RecentItem("1", "Mobiles", "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755562/1_ibbaod.webp"),
        RecentItem("2", "Blankets", "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755563/2_ny7exx.webp"),
        RecentItem("3", "Men's Casual Shoes", "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755563/3_vps8qm.webp"),
        RecentItem("4", "T-Shirts", "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755563/4_qd8fza.webp")
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .background(safeParseColor("#C8E6C9"), RoundedCornerShape(16.dp))
            .padding(bottom = 16.dp)
            .height(230.dp)
    ) {
        Column(
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Text(
                text = "$userName, still looking for these?",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = safeParseColor("#1B5E20"),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(recentItems) { item ->
                    RecentItemCard(item)
                }
            }
        }
    }
}

@Composable
fun RecentItemCard(item: RecentItem) {
    Card(
        modifier = Modifier
            .width(130.dp)
            .height(150.dp)
            .shadow(2.dp, RoundedCornerShape(12.dp)),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(105.dp),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }

            Text(
                text = item.label,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = safeParseColor("#4B5563"),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}


