package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.BasketManager
import com.localforvocalstartup.app.data.manager.CartItem
import com.localforvocalstartup.app.ui.viewmodel.CheckoutItem
import com.localforvocalstartup.app.ui.viewmodel.CheckoutViewModel
import androidx.compose.ui.zIndex

@Composable
fun BasketPageView(onDismiss: () -> Unit) {
    // Only items is a StateFlow; count/total/savings are plain computed properties
    val basketItems by BasketManager.items.collectAsState()
    // Derive scalar values reactively by reading from the singleton after items recompose
    val basketCount = basketItems.size
    val basketTotal = BasketManager.basketTotal
    val basketSavings = BasketManager.basketSavings

    var showGlobalSearch by remember { mutableStateOf(false) }
    var showCheckoutFlow by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6))) {
        Column(modifier = Modifier.fillMaxSize().statusBarsPadding()) {
            
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .shadow(elevation = 2.dp, shape = RoundedCornerShape(0.dp))
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack, 
                    contentDescription = "Back",
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(24.dp).clickable { onDismiss() }
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "My Basket ($basketCount Items)",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF111827)
                )
                Spacer(modifier = Modifier.weight(1f))
                Icon(
                    imageVector = Icons.Default.Search, 
                    contentDescription = "Search",
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(24.dp).clickable { showGlobalSearch = true }
                )
            }

            if (basketItems.isEmpty()) {
                BasketEmptyStateView()
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(bottom = 100.dp) // Leave space for bottom bar
                ) {
                    item {
                        Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 16.dp)) {
                            DeliveryBannerView()
                        }
                    }

                    item {
                        Column(modifier = Modifier.background(Color.White).padding(bottom = 16.dp)) {
                            basketItems.forEachIndexed { index, item ->
                                BasketItemCell(item)
                                if (index < basketItems.size - 1) {
                                    Divider(color = Color(0xFFE5E7EB))
                                }
                            }
                        }
                    }

                    item {
                        Box(modifier = Modifier.padding(16.dp)) {
                            BillDetailsView(total = basketTotal)
                        }
                    }

                    if (basketSavings > 0) {
                        item {
                            Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                                SavingsBannerView(savings = basketSavings)
                            }
                        }
                    }
                }

                // Checkout Bar
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(16.dp)
                        .navigationBarsPadding()
                ) {
                    Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(bottom = 16.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Total", fontSize = 12.sp, color = Color(0xFF6B7280))
                            Text("₹${(basketTotal + 2).toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        }
                        Spacer(modifier = Modifier.weight(1f))
                        Row(
                            modifier = Modifier
                                .background(Color(0xFF15803D), RoundedCornerShape(8.dp))
                                .clickable { showCheckoutFlow = true }
                                .padding(horizontal = 24.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text("Proceed to Pay", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            // Missing arrow.right equivalent for specific material sizing, using simple unicode or similar if desired.
                        }
                    }
                }
            }
        }
        
        if (showCheckoutFlow) {
            val checkoutItems = basketItems.map { item ->
                CheckoutItem(
                    product = item.product,
                    quantity = item.quantity,
                    selectedOfferIds = emptyList() // Fetch if needed or leave default empty
                )
            }
            val checkoutViewModel = remember { CheckoutViewModel(checkoutItems) }
            
            Box(modifier = Modifier.fillMaxSize().zIndex(10f)) {
                com.localforvocalstartup.app.ui.pages.CheckoutView(
                    viewModel = checkoutViewModel,
                    onBack = { showCheckoutFlow = false }
                )
            }
        }

        if (showGlobalSearch) {
            com.localforvocalstartup.app.ui.pages.GlobalSearchView(onDismiss = { showGlobalSearch = false })
        }
    }
}

@Composable
fun BasketEmptyStateView() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 30.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        AsyncImage(
            model = "https://cdn-icons-png.flaticon.com/512/11329/11329060.png",
            contentDescription = "Empty Basket",
            contentScale = ContentScale.Fit,
            modifier = Modifier.size(150.dp)
        )
        Text("Your basket is empty!", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        Box(
            modifier = Modifier
                .background(Color(0xFF2563EB), RoundedCornerShape(4.dp))
                .clickable { /* Shop Now */ }
                .padding(horizontal = 48.dp, vertical = 12.dp)
        ) {
            Text("Shop now", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
        }
    }
}

@Composable
fun BasketItemCell(item: CartItem) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp, horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        // Image
        Box(
            modifier = Modifier
                .size(60.dp)
                .background(Color(0xFFF9FAFB), RoundedCornerShape(8.dp))
                .clip(RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            val firstImage = item.product.images?.firstOrNull()
            if (firstImage != null) {
                val urlString = if (firstImage.startsWith("http")) firstImage else "https://api.lfvs.in$firstImage"
                AsyncImage(
                    model = urlString,
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize().padding(4.dp)
                )
            }
        }

        // Details
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = item.product.name ?: "",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF1F2937),
                maxLines = 2
            )
            Text(
                text = item.product.subtitle ?: "1 pc",
                fontSize = 12.sp,
                color = Color(0xFF6B7280)
            )
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("₹${item.product.price.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                val mrp = item.product.mrp ?: 0.0
                if (mrp > item.product.price) {
                    Text(
                        "₹${mrp.toInt()}",
                        fontSize = 12.sp,
                        color = Color(0xFF9CA3AF),
                        textDecoration = TextDecoration.LineThrough
                    )
                }
            }
        }

        // Stepper
        Row(
            modifier = Modifier
                .background(Color(0xFF15803D), RoundedCornerShape(6.dp)),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier.size(28.dp, 32.dp).clickable { BasketManager.updateQuantity(item.productId, item.quantity - 1) },
                contentAlignment = Alignment.Center
            ) {
                Text("-", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
            Text("${item.quantity}", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
            Box(
                modifier = Modifier.size(28.dp, 32.dp).clickable { BasketManager.updateQuantity(item.productId, item.quantity + 1) },
                contentAlignment = Alignment.Center
            ) {
                Text("+", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

@Composable
fun DeliveryBannerView() {
    val address = "Home - 418" // Placeholder, integrate LocationManager later
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFDCFCE7), RoundedCornerShape(8.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF15803D), modifier = Modifier.size(16.dp))
        Spacer(modifier = Modifier.width(6.dp))
        Text("Delivery to ", fontSize = 14.sp, color = Color(0xFF374151))
        Text(address, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827), maxLines = 1, modifier = Modifier.weight(1f))
        Text("Change", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF15803D), modifier = Modifier.clickable { /* logic */ })
    }
}

@Composable
fun BillDetailsView(total: Double) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White, RoundedCornerShape(8.dp))
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Bill Details", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF374151))
        
        Row {
            Text("Item Total", fontSize = 12.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${total.toInt()}", fontSize = 12.sp, color = Color(0xFF111827))
        }
        Row {
            Text("Delivery Fee", fontSize = 12.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Row {
                Text("₹25", fontSize = 12.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                Text(" Free", fontSize = 12.sp, color = Color(0xFF15803D))
            }
        }
        Row {
            Text("Handling Charge", fontSize = 12.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹2", fontSize = 12.sp, color = Color(0xFF111827))
        }
        Divider(color = Color(0xFFE5E7EB))
        Row {
            Text("To Pay", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${(total + 2).toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        }
    }
}

@Composable
fun SavingsBannerView(savings: Double) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF0FDF4), RoundedCornerShape(8.dp))
            .padding(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Tag icon using location or similar, skipping specific tag icon here if missing
        Text("You saved ₹${savings.toInt()} on this order", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF14532D))
    }
}
