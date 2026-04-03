package com.ecommerceearn.app.ui.pages

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
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
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.BasketManager
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.ui.home.LocationViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import kotlin.math.roundToInt

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun GroceryProductDetailView(
    productId: String,
    onBack: () -> Unit = {},
    locationViewModel: LocationViewModel = viewModel()
) {
    var product by remember { mutableStateOf<Product?>(null) }
    var isLoading by remember { mutableStateOf(true) }

    val quantityIndex by BasketManager.quantityIndex.collectAsState()
    val quantity = quantityIndex[productId] ?: 0

    val basketItems by BasketManager.items.collectAsState()
    val basketCount = basketItems.sumOf { it.quantity }
    val locationState by locationViewModel.locationState.collectAsState()

    var addedAnimation by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(if (addedAnimation) 1.05f else 1f, animationSpec = spring(), label = "scale")
    var showGlobalSearch by remember { mutableStateOf(false) }
    var showBasket by remember { mutableStateOf(false) }

    LaunchedEffect(productId) {
        isLoading = true
        try {
            product = NetworkClient.apiService.getProductById(productId)
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color(0xFFFFF9E6), Color(0xFFFFFFFF))
                        )
                    )
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(Color.White, CircleShape)
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937), modifier = Modifier.size(18.dp))
                }

                Row(
                    modifier = Modifier
                        .weight(1f)
                        .background(Color.White, RoundedCornerShape(20.dp))
                        .clickable { showGlobalSearch = true }
                        .padding(horizontal = 12.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(imageVector = Icons.Default.Search, contentDescription = "Search", tint = Color(0xFF9CA3AF), modifier = Modifier.size(14.dp))
                    Text(text = "Search for products", color = Color(0xFF9CA3AF), fontSize = 14.sp)
                }

                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(Color.White, CircleShape)
                        .clickable { 
                            showBasket = true
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.ShoppingBasket, contentDescription = "Basket", tint = Color(0xFF1F2937), modifier = Modifier.size(18.dp))
                    if (basketCount > 0) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .offset(x = 4.dp, y = (-4).dp)
                                .size(16.dp)
                                .background(Color(0xFFEF4444), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "$basketCount", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        },
        bottomBar = {
            if (product != null) {
                val p = product!!
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(8.dp)
                        .background(Color.White)
                        .padding(horizontal = 20.dp, vertical = 12.dp)
                        .navigationBarsPadding()
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            if ((p.mrp ?: 0.0) > p.price) {
                                Text(
                                    text = "₹${p.mrp!!.roundToInt()}",
                                    fontSize = 12.sp,
                                    color = Color(0xFF9CA3AF),
                                    textDecoration = TextDecoration.LineThrough
                                )
                            }
                            Text(
                                text = "₹${p.price.roundToInt()}",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF111827)
                            )
                        }

                        Spacer(modifier = Modifier.weight(1f))

                        if (quantity > 0) {
                            Row(
                                modifier = Modifier
                                    .shadow(6.dp, RoundedCornerShape(12.dp))
                                    .background(Color(0xFF16A34A), RoundedCornerShape(12.dp)),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier.size(width = 40.dp, height = 44.dp).clickable { BasketManager.updateQuantity(p.id, quantity - 1) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("-", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                                Text(
                                    text = "$quantity",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier.widthIn(min = 36.dp),
                                    textAlign = TextAlign.Center
                                )
                                Box(
                                    modifier = Modifier.size(width = 40.dp, height = 44.dp).clickable { BasketManager.updateQuantity(p.id, quantity + 1) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("+", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        } else {
                            val scope = rememberCoroutineScope()
                            Row(
                                modifier = Modifier
                                    .size(width = 140.dp, height = 44.dp)
                                    .scale(scale)
                                    .shadow(6.dp, RoundedCornerShape(12.dp))
                                    .background(Color(0xFF16A34A), RoundedCornerShape(12.dp))
                                    .clickable {
                                        BasketManager.addToBasket(p, 1)
                                        scope.launch {
                                            addedAnimation = true
                                            delay(500)
                                            addedAnimation = false
                                        }
                                    },
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Icon(Icons.Default.ShoppingBasket, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Add", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFF16A34A))
            }
        } else if (product != null) {
            val p = product!!
            val discountPercent = if ((p.mrp ?: 0.0) > p.price) {
                (((p.mrp!! - p.price) / p.mrp!!) * 100).roundToInt()
            } else (p.discountPercentage ?: 0)

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFF3F4F6))
                    .padding(paddingValues)
                    .verticalScroll(rememberScrollState())
            ) {
                // 1. Image Carousel
                Column(modifier = Modifier.fillMaxWidth().background(Color.White)) {
                    val pageCount = if (p.images.isEmpty()) 1 else p.images.size
                    val pagerState = rememberPagerState(pageCount = { pageCount })
                    HorizontalPager(
                        state = pagerState,
                        modifier = Modifier.fillMaxWidth().height(320.dp)
                    ) { page ->
                        if (p.images.isEmpty()) {
                            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                    Icon(Icons.Default.Image, contentDescription = null, tint = Color(0xFFD1D5DB), modifier = Modifier.size(50.dp))
                                    Text("No image available", fontSize = 13.sp, color = Color(0xFF9CA3AF))
                                }
                            }
                        } else {
                            AsyncImage(
                                model = p.images[page],
                                contentDescription = null,
                                contentScale = ContentScale.Fit,
                                modifier = Modifier.fillMaxSize().padding(20.dp)
                            )
                        }
                    }
                    if (p.images.size > 1) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            for (i in p.images.indices) {
                                val selected = pagerState.currentPage == i
                                Box(
                                    modifier = Modifier
                                        .padding(horizontal = 3.dp)
                                        .size(if (selected) 8.dp else 6.dp)
                                        .background(if (selected) Color(0xFF1F2937) else Color(0xFFD1D5DB), CircleShape)
                                )
                            }
                        }
                    }
                }

                // 2. Product Info Card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 2.dp)
                        .background(Color.White)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = p.displayName,
                        fontSize = 16.sp, // Made slightly bigger like iOS
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF1F2937)
                    )
                    Text(
                        text = if (!p.subtitle.isNullOrEmpty()) p.subtitle!! else "1 unit",
                        fontSize = 13.sp,
                        color = Color(0xFF6B7280)
                    )
                    if (discountPercent > 0) {
                        Text(
                            text = "$discountPercent% off",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF16A34A)
                        )
                    }
                    Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "₹${p.price.roundToInt()}",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF111827)
                        )
                        if ((p.mrp ?: 0.0) > p.price) {
                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
                                Text("MRP", fontSize = 12.sp, color = Color(0xFF9CA3AF), modifier = Modifier.padding(bottom = 2.dp))
                                Text(
                                    text = "₹${p.mrp!!.roundToInt()}",
                                    fontSize = 14.sp,
                                    color = Color(0xFF9CA3AF),
                                    textDecoration = TextDecoration.LineThrough,
                                    modifier = Modifier.padding(bottom = 2.dp)
                                )
                            }
                        }
                    }
                    if (p.rating != null) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Row(
                                modifier = Modifier
                                    .background(Color(0xFF16A34A), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(3.dp)
                            ) {
                                Text(text = String.format(Locale.US, "%.1f", p.rating), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Icon(Icons.Default.Star, contentDescription = null, tint = Color.White, modifier = Modifier.size(10.dp))
                            }
                            if (p.reviewCount != null && p.reviewCount > 0) {
                                Text("${p.reviewCount} ratings", fontSize = 13.sp, color = Color(0xFF6B7280))
                            }
                        }
                    }
                }

                // 3. Offers
                if (!p.offers.isNullOrEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                            .background(Color.White)
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.LocalOffer, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(13.dp))
                            Text("Available Offers", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                        }
                        p.offers.take(3).forEach { offer ->
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
                                Icon(Icons.Default.Percent, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(16.dp).padding(top = 2.dp))
                                Text(
                                    text = offer.description ?: offer.title,
                                    fontSize = 13.sp,
                                    color = Color(0xFF374151),
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }

                // 4. Description
                if (!p.description.isNullOrEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                            .background(Color.White)
                            .padding(horizontal = 20.dp, vertical = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text("Product Description", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                        Text(
                            text = p.description,
                            fontSize = 13.sp,
                            color = Color(0xFF4B5563),
                            lineHeight = 20.sp
                        )
                    }
                }

                // 5. Deliver To
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                        .background(Color.White)
                        .padding(16.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Deliver to: ", fontSize = 14.sp, color = Color(0xFF374151))
                                Text(if (locationState.areaName.isEmpty()) "Select Location" else locationState.areaName, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("HOME", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF6B7280), modifier = Modifier.background(Color(0xFFF3F4F6), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp))
                            }
                            Text(if (locationState.fullAddress.isEmpty()) "Locating..." else locationState.fullAddress, fontSize = 13.sp, color = Color(0xFF6B7280), maxLines = 1, overflow = TextOverflow.Ellipsis)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(4.dp))
                                .clickable { }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("Change", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF2563EB))
                        }
                    }
                }

                // 6. Seller Details
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                        .background(Color.White)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Sold by", fontSize = 14.sp, color = Color(0xFF374151))
                        Text(p.sellerName ?: "Local Seller", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF2563EB))
                        Row(
                            modifier = Modifier.background(Color(0xFF2563EB), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            Text(text = String.format(Locale.US, "%.1f", p.rating ?: 4.5), fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Icon(Icons.Default.Star, contentDescription = null, tint = Color.White, modifier = Modifier.size(8.dp))
                        }
                    }

                    // Delivery Date
                    val calendar = Calendar.getInstance()
                    calendar.add(Calendar.DAY_OF_YEAR, 2)
                    val dateFormat = SimpleDateFormat("d MMM, EEEE", Locale.US)
                    val deliveryDateStr = dateFormat.format(calendar.time)

                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("Delivery by", fontSize = 14.sp, color = Color(0xFF374151))
                        Text(deliveryDateStr, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Box(modifier = Modifier.size(3.dp).background(Color(0xFF6B7280), CircleShape))
                            Text("Cash on Delivery", fontSize = 13.sp, color = Color(0xFF374151))
                        }
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Box(modifier = Modifier.size(3.dp).background(Color(0xFF6B7280), CircleShape))
                            Text("Easy Doorstep Return", fontSize = 13.sp, color = Color(0xFF374151))
                        }
                    }

                    Text("View Details", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF2563EB), modifier = Modifier.clickable {})
                }

                // 7. Highlights
                if (!p.highlights.isNullOrEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                            .background(Color.White)
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("Highlights", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            p.highlights.forEach { highlight ->
                                Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Box(modifier = Modifier.padding(top = 6.dp).size(6.dp).background(Color(0xFF16A34A), CircleShape))
                                    Text(highlight, fontSize = 13.sp, color = Color(0xFF374151))
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showGlobalSearch) {
        com.ecommerceearn.app.ui.pages.GlobalSearchView(onDismiss = { showGlobalSearch = false })
    }

    if (showBasket) {
        com.ecommerceearn.app.ui.pages.BasketPageView(onDismiss = { showBasket = false })
    }
}
