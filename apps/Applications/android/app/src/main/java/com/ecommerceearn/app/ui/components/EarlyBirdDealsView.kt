package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class EarlyBirdDealItem(
    val id: String,
    val image: String,
    val offer: String,
    val brand: String,
    val actionUrl: String?
)

@Composable
fun EarlyBirdDealsView(
    title: String = "Early Bird Deals!",
    headerActionUrl: String? = null,
    items: List<EarlyBirdDealItem> = emptyList(),
    onNavigate: (String) -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 12.dp) // Adjusted padding
            .background(Color(0xFFA2D2FF), RoundedCornerShape(16.dp))
            .padding(top = 16.dp, start = 16.dp, bottom = 24.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .clickable { headerActionUrl?.let { onNavigate(it) } }
                .padding(bottom = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "›",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        // Horizontal Scroll
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(end = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.forEach { item ->
                EarlyBirdCard(item = item, onClick = { item.actionUrl?.let { onNavigate(it) } })
            }
        }
    }
}

@Composable
private fun EarlyBirdCard(item: EarlyBirdDealItem, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(140.dp)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(width = 140.dp, height = 180.dp)
                .background(Color.White, RoundedCornerShape(12.dp))
                .clip(RoundedCornerShape(12.dp))
        ) {
            AsyncImage(
                model = item.image,
                contentDescription = item.brand,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize().background(Color.White)
            )
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset(y = (-10).dp)
                .background(Color(0xFF0056D2), RoundedCornerShape(bottomStart = 12.dp, bottomEnd = 12.dp)),
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

        Text(
            text = item.brand,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF334155),
            textAlign = TextAlign.Center,
            maxLines = 1,
            modifier = Modifier.offset(y = (-4).dp)
        )
    }
}
