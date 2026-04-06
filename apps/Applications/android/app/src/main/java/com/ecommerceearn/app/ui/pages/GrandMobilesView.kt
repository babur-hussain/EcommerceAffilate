package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun GrandMobilesView(onNavigateBack: () -> Unit = {}) {
    val bgLight = Color(0xFFF8FAFC)
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgLight)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            GrandMobilesHeader(onNavigateBack)
            GrandMobilesHero()
            GrandMobilesShopByBrand()
            GrandMobilesTrendingNow()
            Spacer(modifier = Modifier.height(120.dp))
        }
        
        GrandMobilesBottomNav(modifier = Modifier.align(Alignment.BottomCenter))
    }
}

@Composable
private fun GrandMobilesHeader(onNavigateBack: () -> Unit) {
    val navyColor = Color(0xFF001B44)
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(
            onClick = onNavigateBack,
            modifier = Modifier.background(Color.White.copy(alpha = 0.2f), CircleShape).size(40.dp)
        ) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = navyColor)
        }
        
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            IconButton(
                onClick = {},
                modifier = Modifier.background(Color.White.copy(alpha = 0.2f), CircleShape).size(40.dp)
            ) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = navyColor)
            }
            IconButton(
                onClick = {},
                modifier = Modifier.background(Color.White.copy(alpha = 0.2f), CircleShape).size(40.dp)
            ) {
                Icon(Icons.Default.ShoppingCart, contentDescription = "Cart", tint = navyColor)
            }
        }
    }
}

@Composable
private fun GrandMobilesHero() {
    val navyColor = Color(0xFF001B44)
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(520.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(32.dp))
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF4FB0AE),
                        Color(0xFFD4E2D4),
                        Color(0xFFFFD670),
                        Color(0xFFFF9248)
                    )
                )
            )
    ) {
        // Overlay mimic
        Box(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.05f)))
        
        // Sparkles (positioned manually)
        Icon(Icons.Default.Star, contentDescription = null, tint = navyColor, modifier = Modifier.offset(x = 40.dp, y = 48.dp).size(24.dp))
        Icon(Icons.Default.Star, contentDescription = null, tint = navyColor.copy(alpha = 0.4f), modifier = Modifier.align(Alignment.TopEnd).offset(x = (-48).dp, y = 128.dp).size(24.dp))
        Icon(Icons.Default.Star, contentDescription = null, tint = navyColor, modifier = Modifier.align(Alignment.BottomStart).offset(x = 64.dp, y = (-160).dp).size(24.dp))

        Column(
            modifier = Modifier.fillMaxSize().padding(top = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Betul's Exclusive", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = navyColor, letterSpacing = (-0.5).sp, modifier = Modifier.padding(bottom = 8.dp))
            Text("GRAND MOBILES\nSALE", fontSize = 42.sp, fontWeight = FontWeight.Black, color = navyColor, textAlign = androidx.compose.ui.text.style.TextAlign.Center, lineHeight = 38.sp, modifier = Modifier.padding(bottom = 32.dp))
            
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                contentPadding = PaddingValues(horizontal = 40.dp, vertical = 14.dp),
                modifier = Modifier.border(2.dp, navyColor, RoundedCornerShape(0.dp)).padding(bottom = 48.dp)
            ) {
                Text("GRAB NOW", fontSize = 18.sp, fontWeight = FontWeight.Black, letterSpacing = 2.sp, color = navyColor)
            }
            
            Spacer(modifier = Modifier.weight(1f))

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                GrandMobilesPhoneImage(
                    url = "https://lh3.googleusercontent.com/aida-public/AB6AXuAxDDaHdTrwru2LB1m_bJMDHJJXXNMH6lz9-9S8rddKmEqEWunUOUFNIbDEZPU2d-YJNwhSmwIpL5fO0epqwuAxkKHsryedI3kKY1upVgvUY8zIeQO-cDyHSq6-D05NQA0G6nx_pJudqZF6b3iWA1wThCbVLqJxo19m7Zr0YUMv3dwjt7Sy6J4CKABFbQYaor4Ku67YWhfhByHnwYFOTfjsu2ML2U_ovNFWJfYxos7yBMXhlZSbcKqy41LlXGZAyT3a7GN-2zDoKY5S",
                    height = 128, yOffset = 16, modifier = Modifier.weight(1f)
                )
                GrandMobilesPhoneImage(
                    url = "https://lh3.googleusercontent.com/aida-public/AB6AXuCksjqMHl_Le2OSvtMgyqEeMo6F3kf3fFLKon7RNfxaxt4-VznnUV60f8NxHfim6HzcFbPp8g1xan7gXkkXG7QTymUM5a914tPRdFunL5GAdNouDtxDqqI6FpYeDg6JV-k3vMn3Vv59V5b21elRNYMVaMKilZnTQRoZyFd8qQTod4AQNKx_50Hsy9Guqv8as_l56QtYgg078rgL15j1EsNxw-sR6S-PfuyZuHLEfjxyMvpmJXWCuVnkuVWnVFPiHYLR7HYRSG6lytlr",
                    height = 160, yOffset = 8, modifier = Modifier.weight(1f)
                )
                GrandMobilesPhoneImage(
                    url = "https://lh3.googleusercontent.com/aida-public/AB6AXuC4DwQQFVyxxqGSPaN4wzRr5wT8_Pxg_2e8k2v_Yl0MZKth5yEZ0-GNsJqwmF9RPLRiCD-rjf7we_aMQjZpHUtp1TvWjCLfelyn9fmQDv_cr3EY2QCHDdBw5TOaVRYb7CGmoppynojkVeRqDBe1jHlv9sYjOsyksxwT0JUxoEZLW1iynywhXwMOwAhvGzCBClt3kmUAm235KTz1Glg888FK2PVzSY1u6qtSsTcDUUCJ3_o2LUICviukV1fUqd9t1EzP_V_4lO9Jx4CR",
                    height = 176, yOffset = 0, modifier = Modifier.weight(1f)
                )
                GrandMobilesPhoneImage(
                    url = "https://lh3.googleusercontent.com/aida-public/AB6AXuCg091i4f0WJO63g9R2MYlHnNsNj9ietAEt0alu3p_Gv7kC4JT_nSxqhB08EWp9OfAHdy7Rj0ruLnoXD-Rmr0Muiah_EoZme97POGFxEGjiqiRa3Blqk3gIhtA5VPFEP3ZPHyGxDbZOXUtZBATJcBrA5WG5tHRQND8hCBgx_07XkBH8mt4EFGDg6BlK3VOVh76jMkYj_lW5N-htmvzStxbHJxr1T3FEhfS97iw9UYThYNevDnjbBAAUYkl977CRmQtpRVAHTzkGSi7-",
                    height = 144, yOffset = 12, modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun GrandMobilesPhoneImage(url: String, height: Int, yOffset: Int, modifier: Modifier) {
    AsyncImage(
        model = url,
        contentDescription = null,
        contentScale = ContentScale.Crop,
        modifier = modifier
            .offset(y = yOffset.dp)
            .height(height.dp)
            .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
            .background(Color.Gray.copy(alpha = 0.3f))
    )
}

@Composable
private fun GrandMobilesShopByBrand() {
    val navyColor = Color(0xFF001B44)
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .padding(top = 32.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Shop by Brand", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = navyColor)
            Text("See All", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = navyColor)
        }
        
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            GrandMobilesBrandItem(Icons.Default.PhoneIphone, "Apple")
            GrandMobilesBrandItem(Icons.Default.Smartphone, "Samsung")
            GrandMobilesBrandItem(Icons.Default.AccountCircle, "Google")
            GrandMobilesBrandItem(Icons.Default.MoreHoriz, "Others")
        }
    }
}

@Composable
private fun GrandMobilesBrandItem(icon: ImageVector, name: String) {
    val navyColor = Color(0xFF001B44)
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .shadow(4.dp, CircleShape, spotColor = Color.Black.copy(alpha = 0.05f))
                .background(Color.White, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = name, tint = navyColor, modifier = Modifier.size(24.dp))
        }
        Text(name, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = navyColor)
    }
}

@Composable
private fun GrandMobilesTrendingNow() {
    val navyColor = Color(0xFF001B44)
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Trending Now", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = navyColor, modifier = Modifier.padding(horizontal = 24.dp))
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0xFFFFEBEB)) // #FFEBEB
        ) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.padding(start = 24.dp, top = 24.dp, bottom = 24.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("NEW ARRIVAL", fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp, color = Color.Red, modifier = Modifier.padding(bottom = 4.dp))
                    Text("iPhone 15\nSeries", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = navyColor, lineHeight = 28.sp)
                    Text("Save up to 20% today", fontSize = 14.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 12.dp))
                    
                    Button(
                        onClick = {},
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(containerColor = navyColor),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Text("Explore", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
                
                AsyncImage(
                    model = "https://lh3.googleusercontent.com/aida-public/AB6AXuBVV4YQT7IkJity6Ll4xYYghfXwEIIkTuqN-tN8iFCCYUakCOEcQuw4-oimostQWNU6COhUpptI2X5yR4gsFmNKmN8HYJE5iGnMX0pOgHBKx7pxq7PrYjzbc9zK6FoXhCSp8f3sDye0IOeWnTK_bmys5g1watgJWkCIXOdrZMmY6d_JI_X4jzVYILVz0XFQOXUBBTMxbANODeO84DENHZ3mg6nFH0Ll7feupW-r1PKtePcnKh1ZhPOaSdy_h0yz5LdEyff6-IbvM7sO",
                    contentDescription = null,
                    modifier = Modifier.size(128.dp).padding(end = 16.dp),
                    contentScale = ContentScale.Fit
                )
            }
        }
    }
}

@Composable
private fun GrandMobilesBottomNav(modifier: Modifier = Modifier) {
    val navyColor = Color(0xFF001B44)
    val inactiveColor = Color(0xFF94A3B8) // slate-400 equivalent
    
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {
        Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Color(0xFFF1F5F9)))
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 32.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            GrandMobilesNavItem(Icons.Default.Home, "Home", true, navyColor, inactiveColor)
            GrandMobilesNavItem(Icons.Default.Dashboard, "Shop", false, navyColor, inactiveColor)
            GrandMobilesNavItem(Icons.Default.Favorite, "Wishlist", false, navyColor, inactiveColor)
            GrandMobilesNavItem(Icons.Default.Person, "Profile", false, navyColor, inactiveColor)
        }
        
        Box(
            modifier = Modifier.fillMaxWidth().padding(top = 4.dp, bottom = 8.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(modifier = Modifier.width(128.dp).height(4.dp).background(Color(0xFFCCCCCC), RoundedCornerShape(3.dp)))
        }
    }
}

@Composable
private fun GrandMobilesNavItem(icon: ImageVector, title: String, isActive: Boolean, activeColor: Color, inactiveColor: Color) {
    val color = if (isActive) activeColor else inactiveColor
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Icon(icon, contentDescription = title, tint = color, modifier = Modifier.size(24.dp))
        Text(title, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = color)
    }
}
