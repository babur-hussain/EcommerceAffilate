package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.SDUIComponent

// Parse map back into class structure natively
data class BentoGridItem(
    val title: String,
    val subtitle: String?,
    val imageUrl: String?,
    val backgroundImage: String?,
    val actionUrl: String?,
    val backgroundColor: String?,
    val gradientColors: List<String>?
)

@Composable
fun ForYouBentoGridSDUI(component: SDUIComponent? = null) {
    if (component == null) return

    val itemsList = component.props?.get("items") as? List<*> ?: emptyList<Any>()
    val items = itemsList.mapNotNull {
        val map = it as? Map<*, *> ?: return@mapNotNull null
        BentoGridItem(
            title = map["title"]?.toString() ?: "",
            subtitle = map["subtitle"]?.toString(),
            imageUrl = map["imageUrl"]?.toString(),
            backgroundImage = map["backgroundImage"]?.toString(),
            actionUrl = map["actionUrl"]?.toString(),
            backgroundColor = map["backgroundColor"]?.toString(),
            gradientColors = map["gradientColors"] as? List<String>
        )
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        val columnModifier = Modifier.weight(1f)

        // Column 1 (Large Card)
        Box(modifier = columnModifier) {
            if (items.isNotEmpty()) {
                LargeBentoCard(items[0])
            }
        }

        // Column 2 (Small Cards 1 and 2)
        Column(
            modifier = columnModifier,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (items.size > 1) SmallBentoCard(items[1])
            if (items.size > 2) SmallBentoCard(items[2])
        }

        // Column 3 (Small Cards 3 and 4)
        Column(
            modifier = columnModifier,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (items.size > 3) SmallBentoCard(items[3])
            if (items.size > 4) SmallBentoCard(items[4])
        }
    }
}

@Composable
fun LargeBentoCard(item: BentoGridItem) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(350f / 650f)
            .shadow(4.dp, RoundedCornerShape(16.dp))
            .clickable { /* action handling */ }
    ) {
        // Background
        BentoBackground(item)

        // Foreground Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp)
                .zIndex(2f),
            horizontalAlignment = Alignment.Start
        ) {
            if (!item.subtitle.isNullOrEmpty()) {
                Text(
                    text = item.subtitle,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.White.copy(alpha = 0.9f)
                )
            }
            Text(
                text = item.title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                overflow = TextOverflow.Ellipsis
            )
            
            Spacer(modifier = Modifier.weight(1f))

            if (!item.imageUrl.isNullOrEmpty()) {
                AsyncImage(
                    model = item.imageUrl,
                    contentDescription = item.title,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                        .padding(bottom = 10.dp)
                )
            }
        }
    }
}

@Composable
fun SmallBentoCard(item: BentoGridItem) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(350f / 325f)
            .shadow(4.dp, RoundedCornerShape(16.dp))
            .clickable { /* action handling */ }
    ) {
        // Background
        BentoBackground(item)

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 8.dp, start = 4.dp, end = 4.dp)
                .zIndex(2f),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = item.title,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center,
                maxLines = 2,
                lineHeight = 16.sp
            )
            
            Spacer(modifier = Modifier.weight(1f))

            if (!item.imageUrl.isNullOrEmpty()) {
                AsyncImage(
                    model = item.imageUrl,
                    contentDescription = item.title,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(70.dp)
                )
            }
        }
    }
}

@Composable
fun BentoBackground(item: BentoGridItem) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(16.dp))
    ) {
        if (!item.backgroundImage.isNullOrEmpty()) {
            AsyncImage(
                model = item.backgroundImage,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(Color.Black.copy(alpha = 0.3f), Color.Transparent)
                        )
                    )
            )
        } else if (!item.gradientColors.isNullOrEmpty()) {
            val colors = item.gradientColors.map { hex ->
                try {
                    Color(android.graphics.Color.parseColor(hex))
                } catch (e: Exception) {
                    Color(0xFF2563EB)
                }
            }
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(brush = Brush.linearGradient(colors = colors))
            )
        } else {
            val fallbackColor = try {
                Color(android.graphics.Color.parseColor(item.backgroundColor ?: "#2563EB"))
            } catch (e: Exception) {
                Color(0xFF2563EB)
            }
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(fallbackColor)
            )
        }
    }
}
