package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.ui.components.StandardNavigationHeader

@Composable
fun ShoesSalesView(onNavigateBack: () -> Unit = {}) {
    val bgLight = Color(0xFFF9FAFB)
    val brandOrange = Color(0xFFF97316)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgLight)
    ) {
        StandardNavigationHeader(
            title = "Footwear Sale",
            onNavigateBack = onNavigateBack,
            bgColor = Color.White,
            textColor = Color.Black
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            ShoesSalesHeader(brandOrange)
            Spacer(modifier = Modifier.height(24.dp))
            ShoesSalesFeatured(brandOrange)
            Spacer(modifier = Modifier.height(24.dp))
            ShoesSalesGrid(brandOrange)
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun ShoesSalesHeader(brandOrange: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(280.dp)
            .padding(16.dp)
            .shadow(12.dp, RoundedCornerShape(24.dp))
            .background(Color.Black, RoundedCornerShape(24.dp))
    ) {
        AsyncImage(
            model = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
            contentDescription = "Nike Shoes",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(24.dp)).background(Color.DarkGray)
        )
        
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.4f), RoundedCornerShape(24.dp))
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            Box(
                modifier = Modifier
                    .background(brandOrange, RoundedCornerShape(8.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text("LIMITED TIME", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text("SNEAKER\nDROP", fontSize = 36.sp, fontWeight = FontWeight.Black, color = Color.White, lineHeight = 38.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Up to 50% off on premium kicks.", fontSize = 14.sp, color = Color.LightGray)
        }
    }
}

@Composable
private fun ShoesSalesFeatured(brandOrange: Color) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text("HOT DROPS", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.Black)
        Spacer(modifier = Modifier.height(16.dp))
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(8.dp, RoundedCornerShape(20.dp))
                .background(Color.White, RoundedCornerShape(20.dp))
                .border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(20.dp))
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=500",
                    contentDescription = "Runner X",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.size(100.dp).clip(RoundedCornerShape(12.dp)).background(Color.LightGray)
                )
                
                Spacer(modifier = Modifier.width(16.dp))
                
                Column(modifier = Modifier.weight(1f)) {
                    Text("Pro Speed Runner X", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                    Text("Running · Men", fontSize = 12.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("$129", fontSize = 20.sp, fontWeight = FontWeight.Black, color = brandOrange)
                        Text("$199", fontSize = 14.sp, color = Color.Gray, textDecoration = TextDecoration.LineThrough)
                    }
                }
            }
        }
    }
}

@Composable
private fun ShoesSalesGrid(brandOrange: Color) {
    val items = listOf(
        Pair("Air Max 90", "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=500"),
        Pair("Jordan 1 High", "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&q=80&w=500"),
        Pair("Ultraboost 22", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=500"),
        Pair("Classic Leather", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=500")
    )
    
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text("FLASH SALE", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.Black)
        Spacer(modifier = Modifier.height(16.dp))
        
        for (i in items.indices step 2) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Box(modifier = Modifier.weight(1f)) { ShoesGridCard(items[i].first, items[i].second, brandOrange) }
                Box(modifier = Modifier.weight(1f)) { 
                    if (i + 1 < items.size) ShoesGridCard(items[i+1].first, items[i+1].second, brandOrange) 
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun ShoesGridCard(title: String, imageUrl: String, brandOrange: Color) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(6.dp, RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .background(Color(0xFFF3F4F6))
        ) {
            AsyncImage(
                model = imageUrl,
                contentDescription = title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
            )
            Box(
                modifier = Modifier
                    .offset(x = 8.dp, y = 8.dp)
                    .background(Color.Red, RoundedCornerShape(4.dp))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text("-30%", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
        
        Column(modifier = Modifier.padding(12.dp)) {
            Text(title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("$89", fontSize = 16.sp, fontWeight = FontWeight.Black, color = brandOrange)
                Text("$129", fontSize = 12.sp, color = Color.Gray, textDecoration = TextDecoration.LineThrough)
            }
        }
    }
}
