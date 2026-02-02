package com.ecommerceearn.app.ui.components

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

data class DealItem(
    val id: String,
    val image: String,
    val offer: String,
    val brand: String,
    val price: String,
    val actionUrl: String?
)

data class BudgetItem(
    val id: String,
    val image: String,
    val price: String,
    val actionUrl: String?
)

// --- Components ---

@Composable
fun FashionForecastView(
    title: String,
    headerActionUrl: String?,
    items: List<FashionForecastItem>
) {
    val context = LocalContext.current
    
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
    val context = LocalContext.current
    
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
        val align = when (item.align) {
            "left" -> Alignment.CenterStart
            "right" -> Alignment.CenterEnd
            else -> Alignment.BottomStart
        }
        
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

@Composable
fun PromoPosterView(image: String, actionUrl: String?) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 20.dp) // adjusted padding
            .height(120.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFFF0F0F0))
            .clickable { actionUrl?.let { } }
    ) {
        AsyncImage(
            model = image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
    }
}

@Composable
fun DealsOfTheDayView(
    title: String,
    subtitle: String,
    headerActionUrl: String?,
    items: List<DealItem>
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
                .padding(horizontal = 16.dp)
                .padding(bottom = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Schedule,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = title.uppercase(),
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.weight(1f))
            if (headerActionUrl != null) {
                Text(
                    text = "View All ›",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White,
                    modifier = Modifier.clickable { }
                )
            }
        }

        Text(
            text = subtitle,
            fontSize = 13.sp,
            color = Color.White.copy(alpha = 0.9f),
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(bottom = 16.dp)
        )

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items) { item ->
                DealsOfTheDayCard(item)
            }
        }
    }
}

@Composable
fun DealsOfTheDayCard(item: DealItem) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier
            .width(150.dp)
            .clickable { item.actionUrl?.let { } }
    ) {
        Column(
            modifier = Modifier.padding(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFF0F0F0))
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                
                // Badge
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .clip(RoundedCornerShape(topStart = 8.dp))
                        .background(Color(0xFFD32F2F))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = item.offer,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = item.brand,
                fontSize = 12.sp,
                color = Color(0xFF666666),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            
            Text(
                text = item.price,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFB71C1C)
            )
        }
    }
}

@Composable
fun BudgetBuysView(
    title: String,
    headerActionUrl: String?,
    items: List<BudgetItem>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(bottom = 16.dp)
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

        // Grid approximation using Column and Rows since LazyVerticalGrid inside ScrollView can be tricky
        // But SDUIRenderer components are usually inside a Column, so using LazyVerticalGrid with fixed height or flow layout is needed.
        // For simplicity, let's use a FlowRow equivalent or a custom grid layout since items count is likely small/fixed.
        // Or if we know the height...
        // Let's use a simple Column with Rows for 2 items per row.
        
        val chunkedItems = items.chunked(2)
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            chunkedItems.forEach { rowItems ->
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    rowItems.forEach { item ->
                        Box(modifier = Modifier.weight(1f)) {
                            BudgetBuysCard(item)
                        }
                    }
                    if (rowItems.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
fun BudgetBuysCard(item: BudgetItem) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFFF0F0F0))
            .clickable { item.actionUrl?.let { } }
    ) {
         AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        
        // Overlay
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "UNDER",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = FontFamily.Serif,
                letterSpacing = 2.sp,
                color = Color(0xFF111111)
            )
            Text(
                text = "₹${item.price}",
                fontSize = 42.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                color = Color(0xFF111111)
            )
        }
    }
}
