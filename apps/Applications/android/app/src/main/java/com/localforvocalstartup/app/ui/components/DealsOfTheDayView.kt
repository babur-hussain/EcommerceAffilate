package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class DealOfTheDayItem(
    val id: String,
    val image: String,
    val offer: String,
    val brand: String,
    val price: String,
    val actionUrl: String?
)

@Composable
fun DealsOfTheDayView(
    title: String = "Deals of the Day",
    subtitle: String = "Clock is ticking!",
    headerActionUrl: String? = null,
    items: List<DealOfTheDayItem> = emptyList(),
    onNavigate: (String) -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFEF5350))
            .padding(vertical = 16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(
                    imageVector = Icons.Default.Info, // Time/Clock icon fallback
                    contentDescription = "Clock",
                    tint = Color.White,
                    modifier = Modifier.size(18.dp)
                )
                Text(
                    text = title.uppercase(),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp,
                    color = Color.White
                )
            }

            if (headerActionUrl != null) {
                Text(
                    text = "View All ›",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White,
                    modifier = Modifier.clickable { onNavigate(headerActionUrl) }
                )
            }
        }

        Text(
            text = subtitle,
            fontSize = 13.sp,
            color = Color.White.copy(alpha = 0.9f),
            modifier = Modifier.padding(horizontal = 16.dp).padding(bottom = 16.dp)
        )

        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.forEach { item ->
                DealsOfTheDayCard(item = item, onClick = { item.actionUrl?.let { onNavigate(it) } })
            }
        }
    }
}

@Composable
private fun DealsOfTheDayCard(item: DealOfTheDayItem, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(150.dp)
            .background(Color.White, RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(8.dp)
            .padding(bottom = 4.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(150.dp)
                .background(Color(0xFFF0F0F0), RoundedCornerShape(8.dp))
                .clip(RoundedCornerShape(8.dp))
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.brand,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            Text(
                text = item.offer,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .background(Color(0xFFD32F2F), RoundedCornerShape(bottomEnd = 8.dp))
                    .padding(horizontal = 6.dp, vertical = 3.dp)
            )
        }

        Text(
            text = item.brand,
            fontSize = 12.sp,
            color = Color(0xFF666666),
            maxLines = 1,
            modifier = Modifier.padding(top = 8.dp, bottom = 2.dp)
        )

        Text(
            text = item.price,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFB71C1C)
        )
    }
}
