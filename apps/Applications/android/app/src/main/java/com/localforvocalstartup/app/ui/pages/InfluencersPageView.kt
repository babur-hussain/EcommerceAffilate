package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.ui.home.TabType
import com.localforvocalstartup.app.ui.home.TopCategoryBoxesView

data class Influencer(
    val id: String,
    val name: String,
    val handle: String,
    val image: String,
    val category: String
)

data class FeaturedContent(
    val id: String,
    val title: String,
    val influencer: String,
    val influencerInitial: String,
    val image: String,
    val likes: String
)

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun InfluencersPageView(onOuterTabSelected: ((TabType) -> Unit)? = null) {
    var selectedCategory by remember { mutableStateOf("All") }
    var showRegistrationSheet by remember { mutableStateOf(false) }

    val categories = listOf("All", "Fashion", "Tech", "Beauty", "Fitness", "Lifestyle", "Gaming")

    val trending = listOf(
        Influencer(
            id = "1", name = "Alisha Keys", handle = "@alishastyle",
            image = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
            category = "Fashion"
        ),
        Influencer(
            id = "2", name = "David Miller", handle = "@techdavid",
            image = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
            category = "Tech"
        ),
        Influencer(
            id = "3", name = "Sarah Jones", handle = "@sarahglam",
            image = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
            category = "Beauty"
        )
    )

    val featured = listOf(
        FeaturedContent(
            id = "1", title = "Summer Essentials", influencer = "Alisha Keys", influencerInitial = "A",
            image = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            likes = "12K"
        ),
        FeaturedContent(
            id = "2", title = "Tech Review 2024", influencer = "David Miller", influencerInitial = "D",
            image = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
            likes = "8.5K"
        ),
        FeaturedContent(
            id = "3", title = "Morning Routine", influencer = "Sarah Jones", influencerInitial = "S",
            image = "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
            likes = "22K"
        )
    )

    val user by AuthManager.userState.collectAsState(initial = null)
    val isInfluencer = user?.role == "INFLUENCER"

    Box(modifier = Modifier.fillMaxSize().background(Color.Black)) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 100.dp)
        ) {
            item {
                Column(modifier = Modifier.statusBarsPadding().fillMaxWidth()) {
                    TopCategoryBoxesView(
                    activeTab = TabType.Influencers,
                    onTabSelected = { tab ->
                        if (onOuterTabSelected != null) {
                            onOuterTabSelected(tab)
                        } else {
                            NavigationManager.navigate(tab.name.lowercase())
                        }
                    }
                )
                }
            }
            
            if (!isInfluencer) {
                item {
                    JoinCreatorSquadBanner {
                        showRegistrationSheet = true
                    }
                }
            }

            // Search Bar (Sticky)
            stickyHeader {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Black)
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.White.copy(alpha = 0.1f))
                            .padding(horizontal = 14.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search",
                                tint = Color(0xFF9CA3AF),
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Search creators...",
                                color = Color(0xFF9CA3AF),
                                fontSize = 15.sp
                            )
                        }
                    }
                }
            }

            // Categories
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 30.dp)
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Spacer(modifier = Modifier.width(10.dp))
                    categories.forEach { category ->
                        val isSelected = selectedCategory == category
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(50))
                                .background(if (isSelected) Color(0xFFCCFF00) else Color(0xFF1A1A1A))
                                .clickable { selectedCategory = category }
                                .padding(horizontal = 20.dp, vertical = 10.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = category,
                                color = if (isSelected) Color.Black else Color(0xFF888888),
                                fontSize = 14.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                }
            }

            // Trending Section
            item {
                Column(modifier = Modifier.padding(bottom = 30.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("TRENDING NOW", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Black, letterSpacing = 1.sp)
                        Text("See All", color = Color(0xFF666666), fontSize = 14.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable { })
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 20.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(trending) { item ->
                            InfluencerTrendingCard(item)
                        }
                    }
                }
            }

            // Featured Drops
            item {
                Column(modifier = Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
                    Text("FRESH DROPS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Black, letterSpacing = 1.sp)
                    featured.forEach { item ->
                        InfluencerFeaturedCard(item)
                    }
                }
            }
        }
    }

    if (showRegistrationSheet) {
        ModalBottomSheet(
            onDismissRequest = { showRegistrationSheet = false },
            containerColor = Color.White,
            dragHandle = { BottomSheetDefaults.DragHandle() }
        ) {
            InfluencerRegistrationSheet(onDismiss = { showRegistrationSheet = false })
        }
    }
}

@Composable
fun InfluencerTrendingCard(item: Influencer) {
    Box(
        modifier = Modifier
            .width(160.dp)
            .height(220.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Color(0xFF1E1E1E))
            .clickable { NavigationManager.navigate("influencer/${item.id}") }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f), Color.Black),
                        startY = 100f
                    )
                )
        )
        Column(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            Text(item.name, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(item.handle, color = Color(0xFFAAAAAA), fontSize = 12.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color.White.copy(alpha = 0.2f))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(item.category, color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun InfluencerFeaturedCard(item: FeaturedContent) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(400.dp)
            .clip(RoundedCornerShape(30.dp))
            .background(Color(0xFF1A1A1A))
            .clickable { NavigationManager.navigate("influencer/${item.id}") }
    ) {
        AsyncImage(
            model = item.image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.6f), Color.Black.copy(alpha = 0.9f))
                    )
                )
        )
        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier.size(32.dp).clip(CircleShape).background(Color(0xFFCCFF00)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(item.influencerInitial, color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(item.influencer, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                }
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .background(Color.Black.copy(alpha = 0.5f))
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.Favorite, contentDescription = null, tint = Color(0xFFFF4B4B), modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(item.likes, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(item.title, color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Black, fontStyle = FontStyle.Italic)
            Spacer(modifier = Modifier.height(16.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.White)
                    .clickable { NavigationManager.navigate("influencer/${item.id}") }
                    .padding(vertical = 14.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("SHOP COLLECTION", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Black, letterSpacing = 1.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(imageVector = Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = Color.Black, modifier = Modifier.size(14.dp))
                }
            }
        }
    }
}

@Composable
fun JoinCreatorSquadBanner(onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .background(Brush.horizontalGradient(listOf(Color(0xFFFF416C), Color(0xFFFF4B2B))))
            .padding(16.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Join the Creator's Squad", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Text("High referral commission & earnings on every order.", color = Color.White.copy(alpha = 0.9f), fontSize = 11.sp)
            }
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color.White)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("Join", color = Color(0xFFE94057), fontSize = 14.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
