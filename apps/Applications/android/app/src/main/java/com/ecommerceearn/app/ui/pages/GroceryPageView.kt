package com.ecommerceearn.app.ui.pages

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.ecommerceearn.app.ui.components.SDUIPage
import com.ecommerceearn.app.ui.home.TopCategoryBoxesView
import com.ecommerceearn.app.ui.home.TabType
import com.ecommerceearn.app.ui.home.LocationViewModel
import com.ecommerceearn.app.data.manager.NavigationManager
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlinx.coroutines.delay

@androidx.compose.foundation.ExperimentalFoundationApi
@Composable
fun GroceryPageView(
    onTabSelected: (TabType) -> Unit = {}
) {
    var searchText by remember { mutableStateOf("") }
    var isSearching by remember { mutableStateOf(false) }
    var typingText by remember { mutableStateOf("") }
    val fullText = "Lowest price..."
    var isDeleting by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        while (true) {
            if (!isDeleting) {
                if (typingText.length < fullText.length) {
                    typingText = fullText.substring(0, typingText.length + 1)
                    delay(150)
                } else {
                    delay(1500)
                    isDeleting = true
                }
            } else {
                if (typingText.isNotEmpty()) {
                    typingText = typingText.substring(0, typingText.length - 1)
                    delay(100)
                } else {
                    isDeleting = false
                    delay(500)
                }
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        // Gradient Background
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFFFFF8E7),
                            Color(0xFFFFFDF5),
                            Color.White
                        )
                    )
                )
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 100.dp)
        ) {
            item {
                GroceryStaticHeader(onTabSelected = onTabSelected)
            }

            stickyHeader {
                GroceryStickyHeader(
                    text = searchText,
                    onSearchTap = { isSearching = true }
                )
            }

            // Hero Banner with typing animation
            item {
                GroceryHeroBanner(typingText = typingText)
            }

            // SDUI Content
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp)
                ) {
                    SDUIPage(slug = "grocery")
                }
            }
        }

        // Fixed Top padding for status bar matching iOS approach
        Box(modifier = Modifier.fillMaxWidth().statusBarsPadding().background(Color(0xFFFFF8E7)))

        // Grocery Product Detail Overlay
        val groceryProductId by NavigationManager.groceryProductId.collectAsState()
        groceryProductId?.let { productId ->
            GroceryProductDetailView(
                productId = productId,
                onBack = { NavigationManager.dismissGroceryProduct() }
            )
        }

        if (isSearching) {
            com.ecommerceearn.app.ui.pages.GlobalSearchView(
                onDismiss = { isSearching = false },
                categoryId = null
            )
        }
    }
}

@Composable
fun GroceryStaticHeader(
    locationViewModel: LocationViewModel = viewModel(),
    onTabSelected: (TabType) -> Unit
) {
    val locationState by locationViewModel.locationState.collectAsState()
    val sdfDay = SimpleDateFormat("d", Locale.getDefault())
    val sdfMonth = SimpleDateFormat("MMM", Locale.getDefault())
    val sdfDayName = SimpleDateFormat("EEEE", Locale.getDefault())
    val now = Date()

    Column(modifier = Modifier.fillMaxWidth().statusBarsPadding()) {
        TopCategoryBoxesView(
            activeTab = TabType.Grocery,
            onTabSelected = onTabSelected
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp)
                .background(Color(0xFFFFF8E7)),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier
                    .weight(1f)
                    .clickable { NavigationManager.navigate("locationPicker") },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Home, contentDescription = null, tint = Color(0xFF8B6914), modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    "HOME",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF8B6914)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    if (locationState.fullAddress.isEmpty()) "Select your location" else locationState.areaName,
                    fontSize = 12.sp,
                    color = Color(0xFF6B5720),
                    maxLines = 1,
                    modifier = Modifier.weight(1f, fill = false)
                )
                Icon(Icons.Default.KeyboardArrowRight, contentDescription = null, tint = Color(0xFF8B6914), modifier = Modifier.size(14.dp))
            }

            Row(
                modifier = Modifier
                    .background(Color(0xFFFF9800), RoundedCornerShape(8.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(sdfDay.format(now), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Spacer(modifier = Modifier.width(2.dp))
                Text(sdfMonth.format(now), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Spacer(modifier = Modifier.width(4.dp))
                Text(sdfDayName.format(now), fontSize = 9.sp, color = Color.White.copy(alpha = 0.9f))
            }
        }
    }
}

@Composable
fun GroceryStickyHeader(text: String, onSearchTap: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFFFF8E7))
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier
                .weight(1f)
                .background(Color.White, RoundedCornerShape(10.dp))
                .clickable { onSearchTap() }
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF9CA3AF), modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Search for atta, dal, oil...", fontSize = 14.sp, color = Color(0xFF6B7280))
        }

        Box(
            modifier = Modifier
                .size(46.dp)
                .background(Color.White, RoundedCornerShape(10.dp))
                .clickable { onSearchTap() },
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Mic, contentDescription = null, tint = Color(0xFFFF9800))
        }
    }
}

@Composable
fun GroceryHeroBanner(typingText: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .height(260.dp)
            .clip(RoundedCornerShape(16.dp))
    ) {
        // Background Image
        AsyncImage(
            model = "https://res.cloudinary.com/deljcbcvu/image/upload/v1768337045/Grocery_Offer_Backgroung_krgtp0.jpg",
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Darker overlay for text readability
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.15f))
        )

        Column(
            modifier = Modifier.fillMaxSize().padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Typing animation text
            Box(
                modifier = Modifier.height(60.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "$typingText|",
                    fontSize = 34.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    style = androidx.compose.ui.text.TextStyle(
                        shadow = androidx.compose.ui.graphics.Shadow(
                            color = Color.Black.copy(alpha = 0.4f),
                            offset = androidx.compose.ui.geometry.Offset(1f, 1f),
                            blurRadius = 4f
                        )
                    )
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            // Subcategory Cards Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                GrocerySubCategoryCard(
                    title = "Winter Essential",
                    discount = "Up to 70% off",
                    color = Color(0xFF1B5E20),
                    iconUrl = "https://res.cloudinary.com/deljcbcvu/image/upload/v1768339003/products/z9nxbc93hgfkkogpflbk.png",
                    modifier = Modifier.weight(1f)
                )
                GrocerySubCategoryCard(
                    title = "Snack & Sip",
                    discount = "Up to 50% off",
                    color = Color(0xFF1B5E20),
                    iconUrl = "https://res.cloudinary.com/deljcbcvu/image/upload/v1768339123/products/nn8po2g34ud2irlriuxl.png",
                    modifier = Modifier.weight(1f)
                )
                GrocerySubCategoryCard(
                    title = "Cooking Corner",
                    discount = "Up to 40% off",
                    color = Color(0xFF1B5E20),
                    iconUrl = "https://res.cloudinary.com/deljcbcvu/image/upload/v1768339216/products/kxl5ejlw3jyuxicbdimo.png",
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
fun GrocerySubCategoryCard(
    title: String,
    discount: String,
    color: Color,
    iconUrl: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(10.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .background(color, RoundedCornerShape(4.dp))
                .padding(horizontal = 8.dp, vertical = 3.dp)
        ) {
            Text(discount, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = title,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF333333),
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            maxLines = 2
        )

        Spacer(modifier = Modifier.height(6.dp))

        AsyncImage(
            model = iconUrl,
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier.size(50.dp)
        )
    }
}

