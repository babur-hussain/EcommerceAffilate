package com.localforvocalstartup.app.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Schedule

// --- Data Models ---

data class FashionForecastItem(
    val id: String,
    val image: String,
    val title: String,
    val sub: String?,
    val align: String?,
    val actionUrl: String?
)

data class WinterCollectionItem(
    val id: String,
    val image: String,
    val name: String,
    val offer: String,
    val actionUrl: String?
)





// --- Components ---

@Composable
fun FashionForecastView(
    title: String,
    headerActionUrl: String?,
    items: List<FashionForecastItem>
) {
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Text(
            text = "$title ›",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif, // Didot approximation
            color = Color(0xFF111111),
            modifier = Modifier
                .clickable {
                    headerActionUrl?.let {
                        // Handle navigation
                        // Toast.makeText(context, "Navigating to $it", Toast.LENGTH_SHORT).show()
                    }
                }
                .padding(bottom = 8.dp)
        )

        // Cards
        items.forEach { item ->
            FashionForecastCard(item)
        }
    }
}

@Composable
fun FashionForecastCard(item: FashionForecastItem) {
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Color(0xFFF0F0F0))
            .clickable {
               item.actionUrl?.let {
                  // Handle navigation
               }
            }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Overlay Content
        
        val textAlign = when (item.align) {
            "left" -> TextAlign.Start
            "right" -> TextAlign.End
            else -> TextAlign.Start
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = if (item.align == "left" || item.align == "right") Arrangement.Center else Arrangement.Bottom,
            horizontalAlignment = if (item.align == "right") Alignment.End else Alignment.Start
        ) {
            Text(
                text = item.title,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                color = Color.White,
                textAlign = textAlign,
                modifier = Modifier.shadow(4.dp)
            )
            item.sub?.let {
                Text(
                    text = it,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White,
                    textAlign = textAlign,
                    modifier = Modifier.shadow(4.dp)
                )
            }
        }
    }
}


@Composable
fun WinterCollectionView(
    title: String,
    headerActionUrl: String?,
    items: List<WinterCollectionItem>
) {
    Column(modifier = Modifier.padding(bottom = 32.dp)) {
        // Header
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable { headerActionUrl?.let { } },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Text(
                text = " ›",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                WinterCollectionCard(item)
            }
        }
    }
}

@Composable
fun WinterCollectionCard(item: WinterCollectionItem) {
    Column(
        modifier = Modifier
            .width(140.dp)
            .height(220.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFF5F5DC))
            .clickable { item.actionUrl?.let { } }
    ) {
        // Image (70%)
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .weight(0.7f)
        )

        // Footer (30%)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(0.3f)
                .background(Color(0xFFFAF0E6)),
            contentAlignment = Alignment.Center
        ) {
             // Snowflake decor (simplified as generic circles or icons if font icon not avail)
             // Using simple canvas or shapes for snowflakes just for hint
            
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = item.name,
                    fontSize = 12.sp,
                    color = Color(0xFF555555),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = item.offer,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111111)
                )
            }
        }
    }
}




