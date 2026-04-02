package com.ecommerceearn.app.ui.home

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.animateDpAsState // Added
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets // Added
import androidx.compose.foundation.layout.asPaddingValues // Added
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars // Added
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.requiredHeight
import androidx.compose.ui.layout.layout
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.derivedStateOf
import com.ecommerceearn.app.ui.components.SDUIRenderer
import com.ecommerceearn.app.ui.components.SDUIPage
import com.ecommerceearn.app.ui.home.LocationViewModel
import com.ecommerceearn.app.ui.home.ForYouViewModel
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import com.ecommerceearn.app.ui.components.SDUIHeaderViewModel
import com.ecommerceearn.app.ui.components.safeParseColor
import com.ecommerceearn.app.ui.components.GlobalLottieLayer
import com.ecommerceearn.app.ui.components.LottieLayerConfig
import com.ecommerceearn.app.data.model.ComponentType

// Tab accent colors used by TopCategoryBoxesView (these are UI chrome, not header bg)
val iOSBlue   = Color(0xFF2563EB)
val iOSViolet = Color(0xFF7C3AED)
val iOSGreen  = Color(0xFF10B981)
val iOSPink   = Color(0xFFEC4899)
val iOSActiveBg = Color(0xFFFFD700)


// MARK: - Type
enum class TabType(val id: String, val icon: String, val color: Color) {
    Shopping("Shopping", "bag.fill", iOSBlue),
    Services("Services", "building.2.fill", iOSViolet),
    Grocery("Grocery", "basket.fill", iOSGreen),
    Influencers("Influencers", "person.3.fill", iOSPink);
}

data class CategoryItem(
    val id: String,
    val name: String,
    val icon: ImageVector
)

// MARK: - TopCategoryBoxesView
@Composable
fun TopCategoryBoxesView(
    activeTab: TabType,
    onTabSelected: (TabType) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp, horizontal = 16.dp), // Increased padding
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        TabType.values().forEach { tab ->
            val isActive = activeTab == tab
            
            // Background Animation
            val backgroundColor by animateColorAsState(
                targetValue = if (isActive) iOSActiveBg else Color.White.copy(alpha = 0.2f),
                animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
                label = "bgColorAnim"
            )

            // Text Color
            val textColor = if (isActive) Color(0xFF111827) else Color.White

            Box(
                modifier = Modifier
                    .weight(5f)
                    .height(50.dp)
                    .shadow(
                        elevation = if (isActive) 4.dp else 0.dp,
                        shape = RoundedCornerShape(10.dp),
                        spotColor = Color.Black.copy(alpha = 0.1f)
                    )
                    .background(backgroundColor, RoundedCornerShape(10.dp))
                    .clickable { onTabSelected(tab) }
                    .padding(vertical = 2.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    // Compose doesn't have SF Symbols, using basic placeholder logic or Material Icons mapping
                    val iconVector = when (tab) {
                        TabType.Shopping -> Icons.Default.ShoppingCart
                        TabType.Services -> Icons.Default.Build
                        TabType.Grocery -> Icons.Default.ShoppingCart
                        TabType.Influencers -> Icons.Default.Person
                    }

                    Icon(
                        imageVector = iconVector,
                        contentDescription = tab.id,
                        tint = if (isActive) Color.Black else tab.color,
                        modifier = Modifier.size(25.dp)
                    )

                    Text(
                        text = tab.id,
                        fontSize = 9.sp, // Small font
                        fontWeight = FontWeight.Bold,
                        color = textColor,
                        maxLines = 1,
                        overflow = TextOverflow.Clip
                    )
                }
            }
        }
    }
}

// MARK: - LocationBarView
@Composable
fun LocationBarView(
    locationState: LocationState,
    onRequestLocation: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .background(Color.Black.copy(alpha = 0.2f), RoundedCornerShape(10.dp))
            .clickable { onRequestLocation() }
            .padding(horizontal = 12.dp, vertical = 6.dp), // Reduced vertical padding
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Location Pin (Angled) - Using Send for "Paper Plane" look
        Icon(
            imageVector = Icons.Default.Send,
            contentDescription = "Location",
            tint = Color.White,
            modifier = Modifier
                .size(16.dp)
                .rotate(-45f) // Rotate to point up-right like navigation arrow
        )

        Spacer(modifier = Modifier.width(10.dp))

        // Text Column
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            // AREA NAME (Yellow)
            Text(
                text = locationState.areaName,
                fontSize = 11.sp,
                fontWeight = FontWeight.Black, // Heavy bold
                color = iOSActiveBg, // Gold
                letterSpacing = 0.5.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            
            // Full Address (White) + Arrow
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = locationState.fullAddress,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f, fill = false)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            }
        }

        // Points Badge
        Row(
            modifier = Modifier
                .background(Color.White.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Star,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(14.dp)
            )
            Text(
                text = "0",
                fontSize = 14.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )
        }
    }
}

// MARK: - SearchBarView
@Composable
fun SearchBarView() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Main Search Bar
        Row(
            modifier = Modifier
                .weight(1f)
                .height(46.dp)
                .background(Color.White, RoundedCornerShape(10.dp))
                .padding(horizontal = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = Color(0xFF9CA3AF),
                modifier = Modifier.size(18.dp)
            )
            Text(
                text = "Search products...",
                fontSize = 15.sp,
                color = Color(0xFF9CA3AF)
            )
        }

        // Scan/QR Button
        Box(
            modifier = Modifier
                .size(46.dp)
                .background(Color.White, RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Add, // Replaced QrCodeScanner
                contentDescription = "Scan",
                tint = Color(0xFFFF6B00), // Orange
                modifier = Modifier.size(22.dp)
            )
        }
    }
}

// MARK: - CategoriesSliderView
@Composable
fun CategoriesSliderView(
    selectedCategory: String,
    showIcons: Boolean = true,
    onCategoryResult: (String) -> Unit
) {
    val categories = listOf(
        CategoryItem("1", "For You", Icons.Default.Star), // Replaced Tag
        CategoryItem("2", "Fashion", Icons.Default.ShoppingCart), // Replaced Checkroom
        CategoryItem("3", "Mobiles", Icons.Default.Phone), // Replaced PhoneIphone
        CategoryItem("4", "Beauty", Icons.Default.Person), // Replaced Face
        CategoryItem("5", "Electronics", Icons.Default.Email), // Replaced Computer
        CategoryItem("6", "Home", Icons.Default.Home),
        CategoryItem("7", "Appliances", Icons.Default.Build), // Replaced LocalLaundryService
        CategoryItem("8", "Toys", Icons.Default.Star), // Replaced VideogameAsset
        CategoryItem("9", "Food & Health", Icons.Default.ShoppingCart), // Replaced Restaurant
        CategoryItem("10", "Auto", Icons.Default.Settings), // Replaced CarRepair
        CategoryItem("11", "Sports", Icons.Default.PlayArrow), // Replaced SportsSoccer
        CategoryItem("12", "Books", Icons.Default.Info), // Replaced Book
        CategoryItem("13", "Furniture", Icons.Default.Home), // Duplicate symbol
    )

    LazyRow(
        contentPadding = PaddingValues(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(24.dp),
        modifier = Modifier.padding(bottom = 4.dp)
    ) {
        items(categories) { category ->
            val isSelected = selectedCategory == category.name
            
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .clickable { onCategoryResult(category.name) }
                    .padding(bottom = 12.dp)
            ) {
                // Icon Container
                AnimatedVisibility(
                    visible = showIcons,
                    enter = fadeIn() + expandVertically(),
                    exit = fadeOut() + shrinkVertically()
                ) {
                    Box(modifier = Modifier.height(30.dp), contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = category.icon,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                Text(
                    text = category.name,
                    fontSize = 14.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                    color = if (isSelected) Color.White else Color.White.copy(alpha = 0.8f)
                )

                // Selection Indicator
                if (isSelected) {
                    Box(
                        modifier = Modifier
                            .width(20.dp) // Approximate sizing
                            .height(3.dp)
                            .background(Color.White)
                    )
                }
            }
        }
    }
}


// MARK: - Main Home Header Component
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun HomeHeaderWithContent(
    locationViewModel: LocationViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    forYouViewModel: ForYouViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    headerViewModel: SDUIHeaderViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    onProductClick: (com.ecommerceearn.app.data.model.Product) -> Unit = {}
) {
    var activeTab by remember { mutableStateOf(TabType.Shopping) }
    var selectedCategory by remember { mutableStateOf("For You") }
    val locationState by locationViewModel.locationState.collectAsState()
    val forYouState by forYouViewModel.state.collectAsState()
    val headerState by headerViewModel.state.collectAsState()
    
    val listState = rememberLazyListState()
    val showIcons by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex == 0
        }
    }

    // Calculate dynamic top padding for sticky header
    val statusBarHeight = WindowInsets.statusBars.asPaddingValues().calculateTopPadding()
    val stickyTopPadding by animateDpAsState(
        targetValue = if (showIcons) 0.dp else statusBarHeight,
        label = "stickyPadding"
    )

    // Trigger location fetch on start
    androidx.compose.runtime.LaunchedEffect(Unit) {
        locationViewModel.fetchCurrentLocation()
    }
    
    // Build header slug from active tab + category
    val headerSlug = if (activeTab == TabType.Shopping) {
        val cat = selectedCategory.lowercase().replace(" ", "-").replace("&", "and")
        "$cat-header-theme"
    } else {
        "${activeTab.id.lowercase()}-header-theme"
    }

    androidx.compose.runtime.LaunchedEffect(headerSlug) {
        headerViewModel.fetchLayout(headerSlug)
    }

    // Extract gradient + lottie layers purely from SDUI
    val headerBackgroundComponent = headerState.components.find { it.type == ComponentType.HEADER_BACKGROUND }
    val gradientColorsHex = headerBackgroundComponent?.decodeItems("gradientColors", String::class.java) ?: emptyList()
    val lottieLayers = headerBackgroundComponent?.decodeItems("lottieLayers", LottieLayerConfig::class.java) ?: emptyList()

    // Use SDUI colors; semi-transparent dark while loading
    val parsedGradient: List<Color> = if (gradientColorsHex.isNotEmpty()) {
        gradientColorsHex.map { safeParseColor(it) }
    } else {
        listOf(Color(0xFF2874F0), Color(0xFF2874F0)) // Default Flipkart-style blue while loading
    }

    // iOS: resolvedGradientColors.last used for the fade below header
    val lastGradientColor = parsedGradient.lastOrNull() ?: Color(0xFF2874F0)
    val pageBgColor = Color(0xFFF9FAFB)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(pageBgColor)
    ) {
        androidx.compose.foundation.lazy.LazyColumn(
            state = listState,
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 100.dp) // iOS: .padding(.bottom, 100)
        ) {
            // ── 1. Scrollable Top Header (Tabs + Location + Lottie) ──
            item {
                Box(modifier = Modifier.fillMaxWidth()) {
                    // Gradient background
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .background(Brush.verticalGradient(colors = parsedGradient))
                    )

                    // Lottie animations — matchParentSize doesn't expand parent,
                    // graphicsLayer(clip=false) allows overflow, requiredHeight forces 450dp
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .graphicsLayer { clip = false }
                    ) {
                        lottieLayers.forEach { layer ->
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .statusBarsPadding()
                                    .requiredHeight(450.dp)
                                    .align(Alignment.TopStart)
                            ) {
                                GlobalLottieLayer(layer = layer)
                            }
                        }
                    }

                    // UI content
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .statusBarsPadding()
                    ) {
                        TopCategoryBoxesView(
                            activeTab = activeTab,
                            onTabSelected = { activeTab = it }
                        )
                        LocationBarView(
                            locationState = locationState,
                            onRequestLocation = { locationViewModel.fetchCurrentLocation() }
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }

            // ── 2. Sticky Header (Search + Categories) — right below location bar ──
            stickyHeader {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(lastGradientColor)
                        .padding(top = stickyTopPadding)
                ) {
                    SearchBarView()
                    CategoriesSliderView(
                        selectedCategory = selectedCategory,
                        showIcons = showIcons,
                        onCategoryResult = { selectedCategory = it }
                    )
                }
            }

            // ── 3. SDUI Header Components (Spacer + Bento Grid) on gradient ──
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(lastGradientColor)
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        val otherHeaderComponents = headerState.components.filter {
                            it.type != ComponentType.HEADER_BACKGROUND
                        }
                        otherHeaderComponents.forEach { component ->
                            SDUIRenderer(component, onProductClick = onProductClick)
                        }
                    }
                }
            }

            // ── 3. Fading gradient transition (header → page background) ──
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp)
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    lastGradientColor,
                                    lastGradientColor.copy(alpha = 0.4f),
                                    pageBgColor
                                )
                            )
                        )
                )
            }

            // ── 5. Page content (iOS: SDUIPage(slug: pageSlug)) ──
            if (activeTab == TabType.Shopping && selectedCategory == "For You") {
                // For You uses the dedicated ForYouViewModel (pre-loaded)
                if (forYouState.isLoading) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().height(300.dp), contentAlignment = Alignment.Center) {
                            androidx.compose.material3.CircularProgressIndicator(
                                color = lastGradientColor
                            )
                        }
                    }
                } else if (forYouState.error != null) {
                    item {
                        Column(
                            modifier = Modifier.fillMaxWidth().padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("Could not load content", fontWeight = FontWeight.Medium, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(forYouState.error ?: "", color = Color.Gray, fontSize = 12.sp)
                        }
                    }
                } else {
                    items(forYouState.components) { component ->
                        SDUIRenderer(component, onProductClick = onProductClick)
                    }
                }
            } else if (activeTab == TabType.Shopping) {
                // All other shopping categories — generic SDUIPage by slug (same as iOS)
                val categorySlug = selectedCategory.lowercase().replace(" ", "-").replace("&", "and")
                item {
                    SDUIPage(slug = categorySlug, onProductClick = onProductClick)
                }
            } else {
                // Non-shopping tabs (Services, Grocery, Influencers)
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth().height(400.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "Coming soon — ${activeTab.id}",
                            color = Color.Gray,
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }
    }
}

