package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun MenFashionView(onNavigateBack: () -> Unit = {}) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            MenFashionHeader(onNavigateBack)
            
            Box(modifier = Modifier.weight(1f)) {
                MenFashionWatermark()
                
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    MenFashionHero()
                    MenFashionNewArrivals()
                    MenFashionNewsletter()
                    Spacer(modifier = Modifier.height(120.dp))
                }
            }
        }
    }
}

@Composable
private fun MenFashionHeader(onNavigateBack: () -> Unit) {
    val darkColor = Color(0xFF1A1F24)
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White.copy(alpha = 0.8f))
            .padding(horizontal = 24.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onNavigateBack) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = darkColor, modifier = Modifier.size(24.dp))
        }
        
        Text(
            "ELEGANCE",
            fontSize = 20.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = (-1).sp,
            color = darkColor
        )
        
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconButton(onClick = {}) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = darkColor, modifier = Modifier.size(24.dp))
            }
            IconButton(onClick = {}) {
                Box(contentAlignment = Alignment.TopEnd) {
                    Icon(Icons.Default.ShoppingCart, contentDescription = "Cart", tint = darkColor, modifier = Modifier.size(24.dp))
                    Box(modifier = Modifier.size(14.dp).offset(x = 6.dp, y = (-6).dp).background(Color.Red, CircleShape), contentAlignment = Alignment.Center) {
                        Text("3", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White) // Stubbed cart count
                    }
                }
            }
        }
    }
}

@Composable
private fun MenFashionWatermark() {
    Column(modifier = Modifier.offset(x = 80.dp, y = 100.dp)) {
        for (i in 0..2) {
            Text(
                "MEN",
                fontSize = 120.sp,
                fontWeight = FontWeight.Black,
                color = Color.Black.copy(alpha = 0.05f),
                lineHeight = 100.sp
            )
        }
    }
}

@Composable
private fun MenFashionHero() {
    val darkColor = Color(0xFF1A1F24)
    val amberColor = Color(0xFFD97805)
    
    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        AsyncImage(
            model = "https://lh3.googleusercontent.com/aida-public/AB6AXuBEuynzBd2nHSibVQI3wT2OYzuGstbDMjzOywD0pt_QxjXpHf4Sn-EXbxLa9ojrY6nc-CXj_nu2V8y0UWPpgbVxheV_7T_ukIzlxMBFtHwowGS6GaAkhkttWdKYdw0CmDgvKPwwXZWQR3EsKXNX4vghu4zFFbdPI8D62V6G345f0167V1nk_bF6xJKMXNmdzPJeCoZrRKixa5xhop_Nprz311RU-GTtfw0RfiqsEV9U_z0RP6TqzBNSCxF1hnZ0aRTfnvpgn7uZdCtG",
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier.fillMaxWidth().height(400.dp).shadow(20.dp, spotColor = Color.Black.copy(alpha = 0.2f))
        )
        
        Column(
            modifier = Modifier.offset(y = (-40).dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("SPECIAL OFFER", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 4.sp, color = amberColor, modifier = Modifier.padding(bottom = 8.dp))
            Text("EXCLUSIVE", fontSize = 48.sp, fontWeight = FontWeight.Black, color = darkColor, modifier = Modifier.padding(top = 40.dp))
            Text("MEN'S", fontSize = 48.sp, fontWeight = FontWeight.Black, color = darkColor, modifier = Modifier.padding(bottom = 16.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp), modifier = Modifier.padding(bottom = 32.dp)) {
                Box(modifier = Modifier.width(48.dp).height(1.dp).background(Color(0xFFCCCCCC)))
                Text("50% OFF", fontSize = 28.sp, fontWeight = FontWeight.Light, fontStyle = FontStyle.Italic, color = darkColor)
                Box(modifier = Modifier.width(48.dp).height(1.dp).background(Color(0xFFCCCCCC)))
            }
            
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = amberColor),
                shape = CircleShape,
                contentPadding = PaddingValues(horizontal = 40.dp, vertical = 16.dp),
                modifier = Modifier.shadow(16.dp, CircleShape, spotColor = amberColor.copy(alpha = 0.3f))
            ) {
                Text("SHOP NOW", fontSize = 14.sp, fontWeight = FontWeight.Bold, letterSpacing = 3.sp, color = Color.White)
            }
        }
    }
}

@Composable
private fun MenFashionNewArrivals() {
    val darkColor = Color(0xFF1A1F24)
    val amberColor = Color(0xFFD97805)
    
    Column(modifier = Modifier.fillMaxWidth().padding(top = 40.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp).padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("New Arrivals", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = darkColor)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("View All", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = amberColor)
                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = amberColor, modifier = Modifier.size(12.dp))
            }
        }
        
        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 24.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            MenFashionArrivalCard(
                title = "Trench Collection",
                subtitle = "Fall Essentials",
                imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDMtzXmq0wI6gDRY_hBGNUfm-b_trSkxzVn9ArA1J4CMFnqe_Uove6oCroh5adkzea1aqRSEGNOyFO4lfwx7yviVb3_pkIO1HWjNWuISCLQ0nxE4AjwaKurjOVYrXh-yK9reFHAYFVxp5OViwSb2viLhaOKI1XjDULWEFSPnsYHUA-BMAyGlBK8hmhaoKeS2YIcBzxfec1N69aKkMeKpScSRqikqG2NpwmDVWWEqoujCqNssMcThYLsnI4zOilwLYaA1CT0HTbWpVKs"
            )
            MenFashionArrivalCard(
                title = "Street Style",
                subtitle = "Urban Vibe",
                imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAEGLDO4V75reSP9RTq555WTOj5nIHeN_uc5moNrDj_0j7GoC9Fj6lDry-FRMs3lnYlnmcnp5URcvEASGFTy1LKQZkZ4pi-peTIWMITozVnKokEfQs9gtRj4ZlhzPV1FI_vlgfUtOkkIsVvjPUhAmxKfvwYizhwzYddMwGbucK24SfJvy4RZIsP4z6CltYMJ1rPD3IALRlrsbh6khsOgAR92zGhj-nBYPv5Z-6Ur40uhC69_-nm5N1P_DNMHuZgRqmqWStqF2-IrvdJ"
            )
        }
    }
}

@Composable
private fun MenFashionArrivalCard(title: String, subtitle: String, imageUrl: String) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Box(
            modifier = Modifier
                .width(240.dp)
                .height(320.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0xFFF0F0F5))
        ) {
            AsyncImage(
                model = imageUrl,
                contentDescription = title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            
            IconButton(
                onClick = {},
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(16.dp)
                    .background(Color.White.copy(alpha = 0.8f), CircleShape)
                    .size(32.dp)
            ) {
                Icon(Icons.Default.Favorite, contentDescription = "Favorite", tint = Color.DarkGray, modifier = Modifier.size(16.dp))
            }
        }
        
        Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1F24))
        Text(subtitle, fontSize = 14.sp, color = Color(0xFF808080))
    }
}

@Composable
private fun MenFashionNewsletter() {
    val darkColor = Color(0xFF1A1F24)
    var email by remember { mutableStateOf("") }
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 48.dp, start = 24.dp, end = 24.dp)
            .height(240.dp)
            .clip(RoundedCornerShape(32.dp))
            .background(darkColor)
    ) {
        // Decorative Circle
        Box(
            modifier = Modifier
                .offset(x = 100.dp, y = 60.dp)
                .size(160.dp)
                .background(Color.White.copy(alpha = 0.05f), CircleShape)
        )
        
        Column(
            modifier = Modifier.fillMaxSize().padding(32.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text("Winter is coming.", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.White, modifier = Modifier.padding(bottom = 16.dp))
            Text(
                "Get first access to our limited winter drop.",
                fontSize = 14.sp,
                color = Color(0xFFB3B3BF),
                modifier = Modifier.width(200.dp).padding(bottom = 24.dp)
            )
            
            Row(modifier = Modifier.fillMaxWidth().height(48.dp)) {
                TextField(
                    value = email,
                    onValueChange = { email = it },
                    placeholder = { Text("Email", color = Color.White.copy(alpha = 0.5f), fontSize = 14.sp) },
                    modifier = Modifier.weight(1f).fillMaxHeight(),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.White.copy(alpha = 0.1f),
                        unfocusedContainerColor = Color.White.copy(alpha = 0.1f),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent
                    ),
                    shape = RoundedCornerShape(topStart = 12.dp, bottomStart = 12.dp)
                )
                
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    shape = RoundedCornerShape(topEnd = 12.dp, bottomEnd = 12.dp),
                    modifier = Modifier.fillMaxHeight()
                ) {
                    Text("Join", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = darkColor, modifier = Modifier.padding(horizontal = 4.dp))
                }
            }
        }
    }
}
