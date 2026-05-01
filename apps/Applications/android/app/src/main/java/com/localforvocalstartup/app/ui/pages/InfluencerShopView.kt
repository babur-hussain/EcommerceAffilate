package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.model.AffiliateLink
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.model.Story
import com.localforvocalstartup.app.data.remote.NetworkClient

val ShopPrimary = Color(0xFFBD0F58)
val ShopPrimaryDark = Color(0xFF900B42)
val ShopBackground = Color(0xFFFDFBF9)
val ShopSurface = Color.White
val ShopTextMain = Color(0xFF181114)
val ShopTextSecondary = Color(0xFF896172)

data class ShopProductDetail(
    val id: String,
    val name: String,
    val imageUrl: String?,
    val price: Double?,
    val mrp: Double?,
    val sellerName: String?
) {
    constructor(product: Product) : this(
        id = product.id,
        name = product.name ?: product.title ?: "Unknown",
        imageUrl = product.images.firstOrNull(),
        price = product.price,
        mrp = product.mrp,
        sellerName = product.sellerName
    )
    constructor(link: AffiliateLink) : this(
        id = link.productId,
        name = link.productName,
        imageUrl = null,
        price = null,
        mrp = null,
        sellerName = null
    )
}

@Composable
fun InfluencerShopView() {
    val user = AuthManager.userState.collectAsState().value
    val affiliateProducts = user?.affiliateLinks ?: emptyList()
    
    var productDetails by remember { mutableStateOf<Map<String, ShopProductDetail>>(emptyMap()) }
    var isLoading by remember { mutableStateOf(false) }
    var stories by remember { mutableStateOf<List<Story>>(emptyList()) }
    var showStoryPlayer by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        if (affiliateProducts.isNotEmpty()) {
            isLoading = true
            val updatedDetails = mutableMapOf<String, ShopProductDetail>()
            for (link in affiliateProducts) {
                try {
                    val product = NetworkClient.apiService.getProductById(link.productId)
                    updatedDetails[link.productId] = ShopProductDetail(product)
                } catch (e: Exception) {
                    updatedDetails[link.productId] = ShopProductDetail(link)
                }
            }
            productDetails = updatedDetails
            isLoading = false
        }
        
        try {
            val fetchedStories = NetworkClient.apiService.fetchMyStories()
            stories = fetchedStories.filter { it.isActive }
        } catch (e: Exception) {
            // Ignore for visual consistency mock if network fails
        }
    }

    val uniqueCategories = remember(affiliateProducts) {
        val categories = mutableSetOf<String>()
        for (prod in affiliateProducts) {
            val name = prod.productName.lowercase()
            if (name.contains("dress") || name.contains("shirt") || name.contains("pant") || 
                name.contains("lehenga") || name.contains("kurta") || name.contains("saree")) {
                categories.add("Fashion")
            } else if (name.contains("bag")) {
                categories.add("Bags")
            } else if (name.contains("shoe") || name.contains("sneaker")) {
                categories.add("Footwear")
            } else if (name.contains("watch") || name.contains("jewelry")) {
                categories.add("Accessories")
            } else {
                categories.add("All")
            }
        }
        categories.toList().sorted()
    }

    Box(modifier = Modifier.fillMaxSize().background(ShopBackground)) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(top = 80.dp, bottom = 100.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Profile Section
            item(span = { GridItemSpan(2) }) {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier.clickable { 
                            if (stories.isNotEmpty()) showStoryPlayer = true 
                        },
                        contentAlignment = Alignment.Center
                    ) {
                        if (stories.isNotEmpty()) {
                            Box(
                                modifier = Modifier.size(96.dp).clip(CircleShape).background(
                                    Brush.linearGradient(listOf(ShopPrimary, Color(0xFFFFA500)))
                                )
                            )
                        } else {
                            Box(modifier = Modifier.size(96.dp).clip(CircleShape).background(Color.Gray.copy(alpha = 0.2f)))
                        }
                        
                        Box(modifier = Modifier.size(90.dp).clip(CircleShape).background(ShopBackground), contentAlignment = Alignment.Center) {
                            if (!user?.profileImage.isNullOrEmpty()) {
                                AsyncImage(
                                    model = user?.profileImage,
                                    contentDescription = "Avatar",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.size(84.dp).clip(CircleShape)
                                )
                            } else {
                                Icon(Icons.Default.Person, contentDescription = null, tint = ShopTextSecondary, modifier = Modifier.size(40.dp))
                            }
                        }
                        
                        Box(modifier = Modifier.size(96.dp), contentAlignment = Alignment.BottomEnd) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = ShopPrimary, modifier = Modifier.size(24.dp).background(Color.White, CircleShape).padding(2.dp))
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("${user?.name ?: "Influencer"}'s Boutique", fontWeight = FontWeight.ExtraBold, fontSize = 24.sp, color = ShopTextMain)
                    Text("Sharing my favorite product recommendations ✨", fontSize = 14.sp, color = ShopTextSecondary, modifier = Modifier.padding(horizontal = 40.dp), textAlign = TextAlign.Center)
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier
                            .background(ShopPrimary.copy(alpha = 0.1f), RoundedCornerShape(50))
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.ShoppingBag, contentDescription = null, tint = ShopPrimary, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("${affiliateProducts.size} Products", color = ShopPrimary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            // Collections
            if (uniqueCategories.isNotEmpty()) {
                item(span = { GridItemSpan(2) }) {
                    Column(modifier = Modifier.padding(bottom = 24.dp)) {
                        Text("COLLECTIONS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = ShopTextSecondary, modifier = Modifier.padding(horizontal = 24.dp), letterSpacing = 0.5.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        LazyRow(contentPadding = PaddingValues(horizontal = 24.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            items(uniqueCategories) { category ->
                                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Box(
                                        modifier = Modifier.size(64.dp).clip(RoundedCornerShape(16.dp)).background(
                                            Brush.linearGradient(listOf(ShopPrimary.copy(alpha = 0.8f), ShopPrimary.copy(alpha = 0.4f)))
                                        ),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        val icon = when {
                                            category.contains("Fashion") -> Icons.Default.Checkroom
                                            category.contains("Beauty") -> Icons.Default.AutoAwesome
                                            category.contains("Footwear") -> Icons.Default.DirectionsWalk
                                            category.contains("Bags") -> Icons.Default.ShoppingBag
                                            category.contains("Tech") -> Icons.Default.Smartphone
                                            else -> Icons.Default.LocalOffer
                                        }
                                        Icon(icon, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                                    }
                                    Text(category, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = ShopTextMain, maxLines = 1)
                                }
                            }
                        }
                    }
                }
            }

            item(span = { GridItemSpan(2) }) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Text("My Picks", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = ShopTextMain)
                    Text("${affiliateProducts.size} items", fontSize = 14.sp, color = ShopTextSecondary)
                }
            }

            // Product Grid
            items(affiliateProducts) { link ->
                val detail = productDetails[link.productId]
                val curatorName = user?.name?.split(" ")?.firstOrNull() ?: "Me"
                
                Column(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .shadow(4.dp, RoundedCornerShape(16.dp))
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color.White)
                        .clickable { NavigationManager.navigate("product/${link.productId}") }
                ) {
                    Box(modifier = Modifier.fillMaxWidth().aspectRatio(1f).background(Color.White)) {
                        if (!detail?.imageUrl.isNullOrEmpty()) {
                            AsyncImage(
                                model = detail?.imageUrl,
                                contentDescription = null,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        } else {
                            Box(modifier = Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Gray.copy(alpha = 0.1f), Color.Gray.copy(alpha = 0.2f)))), contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.Image, contentDescription = null, tint = Color.Gray.copy(alpha = 0.4f), modifier = Modifier.size(30.dp))
                            }
                        }
                        
                        Box(contentAlignment = Alignment.BottomStart, modifier = Modifier.fillMaxSize().padding(8.dp)) {
                            Text("CURATED BY ${curatorName.uppercase()}", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.White, modifier = Modifier.background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 3.dp), letterSpacing = 0.3.sp)
                        }
                    }
                    
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(detail?.sellerName ?: " ", fontSize = 11.sp, color = ShopTextSecondary, maxLines = 1, modifier = Modifier.height(14.dp))
                        Text(link.productName, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ShopTextMain, maxLines = 2, overflow = TextOverflow.Ellipsis, modifier = Modifier.height(32.dp))
                        Row(modifier = Modifier.height(20.dp).fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            if (detail?.price != null) {
                                Text("₹${detail.price.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = ShopPrimary)
                            } else {
                                Text("View Details", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = ShopPrimary)
                            }
                            Icon(Icons.Default.ArrowCircleRight, contentDescription = null, tint = ShopPrimary, modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }

        // Header view matching iOS
        Column(modifier = Modifier.fillMaxWidth().background(ShopBackground.copy(alpha = 0.95f))) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = { NavigationManager.navigate("home") }, modifier = Modifier.size(40.dp).background(Color.White.copy(alpha = 0.9f), CircleShape)) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = ShopTextMain, modifier = Modifier.size(20.dp))
                }
                
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (!user?.profileImage.isNullOrEmpty()) {
                        AsyncImage(model = user?.profileImage, contentDescription = null, contentScale = ContentScale.Crop, modifier = Modifier.size(28.dp).clip(CircleShape))
                    } else {
                        Box(modifier = Modifier.size(28.dp).clip(CircleShape).background(Color.Gray.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Person, contentDescription = null, tint = ShopTextSecondary, modifier = Modifier.size(12.dp))
                        }
                    }
                    Text("${user?.name ?: "My"}'s Shop", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = ShopTextMain)
                }

                IconButton(onClick = { /* Share */ }, modifier = Modifier.size(40.dp).background(Color.White.copy(alpha = 0.9f), CircleShape)) {
                    Icon(Icons.Default.Share, contentDescription = "Share", tint = ShopTextMain, modifier = Modifier.size(20.dp))
                }
            }
            HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f))
        }
    }
}
