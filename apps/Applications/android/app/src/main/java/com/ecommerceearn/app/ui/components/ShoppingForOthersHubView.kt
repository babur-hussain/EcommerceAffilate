package com.ecommerceearn.app.ui.components

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class ShoppingCategoryItem(
    val id: String,
    val name: String,
    val slug: String?,
    val image: String?,
    val actionUrl: String?
)

@Composable
fun ShoppingForOthersHubView(
    title: String = "Shopping for others?",
    subtitle: String = "Choose a category to start exploring",
    categories: List<ShoppingCategoryItem> = emptyList(),
    onNavigate: (String) -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827)
            )
            if (subtitle.isNotEmpty()) {
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    color = Color(0xFF6B7280)
                )
            }
        }

        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            categories.forEach { item ->
                ShoppingCategoryCard(item = item, onClick = { onNavigate(item.slug ?: item.id) })
            }
        }
    }
}

@Composable
private fun ShoppingCategoryCard(item: ShoppingCategoryItem, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(110.dp)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(110.dp)
                .background(Color.Transparent, RoundedCornerShape(12.dp))
                .clip(RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            if (!item.image.isNullOrEmpty()) {
                AsyncImage(
                    model = item.image,
                    contentDescription = item.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Icon(
                    imageVector = Icons.Default.Info, // Generic Image fallback
                    contentDescription = null,
                    tint = Color(0xFF9CA3AF),
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        Text(
            text = item.name,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF1F2937),
            textAlign = TextAlign.Center,
            maxLines = 1
        )
    }
}
