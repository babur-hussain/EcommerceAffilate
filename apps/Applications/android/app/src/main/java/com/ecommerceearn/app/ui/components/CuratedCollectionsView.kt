package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun CuratedCollectionsView(collections: List<Map<String, Any>>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        collections.forEach { collection ->
            val title = collection["title"] as? String ?: ""
            val subtitle = collection["subtitle"] as? String ?: ""
            val backgroundColorHex = collection["backgroundColor"] as? String ?: "#FFFFFF"
            val headerImage = collection["headerImage"] as? String
            val itemsRaw = collection["items"] as? List<*>
            val items = itemsRaw?.mapNotNull { it as? Map<String, String> } ?: emptyList()

            // Card Container
            Box(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .fillMaxWidth()
                    .background(
                        color = safeParseColor(backgroundColorHex),
                        shape = RoundedCornerShape(24.dp)
                    )
            ) {
                Column(
                    modifier = Modifier.padding(bottom = 24.dp)
                ) {
                    // Header Section
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 20.dp, end = 20.dp, top = 20.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = title,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1F2937)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = subtitle,
                                fontSize = 14.sp,
                                color = Color(0xFF4B5563)
                            )
                        }

                        if (headerImage != null) {
                            AsyncImage(
                                model = headerImage,
                                contentDescription = null,
                                modifier = Modifier
                                    .size(70.dp)
                                    .rotate(5f)
                                    .shadow(elevation = 5.dp, shape = RoundedCornerShape(8.dp)),
                                contentScale = ContentScale.Fit
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // 2x2 Grid Layout
                    Column(
                        modifier = Modifier.padding(horizontal = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        val rows = items.chunked(2)
                        rows.forEach { rowItems ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                rowItems.forEach { item ->
                                    CuratedItemCard(item, modifier = Modifier.weight(1f))
                                }
                                // Fill empty space if odd number
                                if (rowItems.size < 2) {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CuratedItemCard(item: Map<String, String>, modifier: Modifier = Modifier) {
    val name = item["name"] ?: ""
    val image = item["image"] ?: ""
    val bgColor = item["bgColor"] ?: "#EEEEEE"

    Row(
        modifier = modifier
            .background(Color.White.copy(alpha = 0.6f), RoundedCornerShape(12.dp))
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Icon Container
        Box(
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(safeParseColor(bgColor).copy(alpha = 0.8f))
            )
            AsyncImage(
                model = image,
                contentDescription = null,
                modifier = Modifier.size(28.dp),
                contentScale = ContentScale.Fit
            )
        }

        Text(
            text = name,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF374151),
            maxLines = 1,
            modifier = Modifier.weight(1f)
        )
    }
}


