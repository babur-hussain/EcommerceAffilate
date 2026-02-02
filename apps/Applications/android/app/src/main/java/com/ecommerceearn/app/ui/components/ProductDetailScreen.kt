package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.CartManager
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.ProductOffer
import com.ecommerceearn.app.data.model.TrustBadge
import com.ecommerceearn.app.data.remote.NetworkClient
import kotlinx.coroutines.launch

// Colors
private val PrimaryBlue = Color(0xFF2874F0)
private val OrangeAccent = Color(0xFFFB641B)
private val GreenSuccess = Color(0xFF388E3C)
private val DarkText = Color(0xFF111827)
private val GrayText = Color(0xFF6B7280)
private val LightGray = Color(0xFFF3F4F6)
private val BorderGray = Color(0xFFE5E7EB)

@OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    productId: String,
    initialProduct: Product? = null,
    onBackClick: () -> Unit,
    onCartClick: () -> Unit = {}
) {
    val scope = rememberCoroutineScope()
    var product by remember { mutableStateOf(initialProduct) }
    var isLoading by remember { mutableStateOf(initialProduct == null) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Fetch product details
    LaunchedEffect(productId) {
        if (product == null) {
            try {
                isLoading = true
                product = NetworkClient.apiService.getProductById(productId)
            } catch (e: Exception) {
                errorMessage = "Failed to load product"
                android.util.Log.e("ProductDetail", "Error", e)
            } finally {
                isLoading = false
            }
        }
    }

    Scaffold(
        topBar = {
            ProductDetailHeader(
                onBackClick = onBackClick,
                onShareClick = { /* TODO */ },
                onWishlistClick = { /* TODO */ },
                onCartClick = onCartClick,
                cartCount = CartManager.getCount()
            )
        },
        bottomBar = {
            product?.let {
                BottomActionBar(
                    price = it.price,
                    onAddToCart = {
                        scope.launch {
                            CartManager.addToCart(it, 1)
                        }
                    },
                    onBuyNow = {
                        scope.launch {
                            CartManager.addToCart(it, 1)
                            onCartClick()
                        }
                    }
                )
            }
        },
        containerColor = LightGray
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                isLoading -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                errorMessage != null -> {
                    Column(
                        modifier = Modifier.align(Alignment.Center),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(errorMessage!!, color = GrayText)
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = onBackClick) { Text("Go Back") }
                    }
                }
                product != null -> {
                    ProductDetailContent(product = product!!)
                }
            }
        }
    }
}

@Composable
private fun ProductDetailHeader(
    onBackClick: () -> Unit,
    onShareClick: () -> Unit,
    onWishlistClick: () -> Unit,
    onCartClick: () -> Unit,
    cartCount: Int
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onBackClick) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = DarkText)
        }
        
        Spacer(modifier = Modifier.weight(1f))
        
        IconButton(onClick = onShareClick) {
            Icon(Icons.Default.Share, contentDescription = "Share", tint = DarkText)
        }
        
        IconButton(onClick = onWishlistClick) {
            Icon(Icons.Outlined.FavoriteBorder, contentDescription = "Wishlist", tint = DarkText)
        }
        
        Box {
            IconButton(onClick = onCartClick) {
                Icon(Icons.Outlined.ShoppingCart, contentDescription = "Cart", tint = DarkText)
            }
            if (cartCount > 0) {
                Badge(
                    modifier = Modifier.align(Alignment.TopEnd).offset(x = (-4).dp, y = 4.dp),
                    containerColor = Color.Red
                ) {
                    Text("$cartCount", color = Color.White, fontSize = 10.sp)
                }
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun ProductDetailContent(product: Product) {
    LazyColumn(
        modifier = Modifier.fillMaxSize()
    ) {
        // Image Carousel
        item {
            ProductImageCarousel(images = product.images)
        }

        // Price & Title Section
        item {
            PriceAndTitleSection(product = product)
        }

        // Highlights
        if (!product.highlights.isNullOrEmpty()) {
            item {
                Spacer(modifier = Modifier.height(8.dp).background(LightGray))
                HighlightsSection(highlights = product.highlights!!)
            }
        }

        // Seller & Delivery Info
        item {
            Spacer(modifier = Modifier.height(8.dp).background(LightGray))
            DeliveryInfoSection(
                sellerName = product.sellerName,
                trustBadges = product.trustBadges
            )
        }

        // Bank Offers
        if (!product.offers.isNullOrEmpty()) {
            item {
                Spacer(modifier = Modifier.height(8.dp).background(LightGray))
                BankOffersSection(offers = product.offers!!)
            }
        }

        // Description
        if (!product.description.isNullOrBlank()) {
            item {
                Spacer(modifier = Modifier.height(8.dp).background(LightGray))
                DescriptionSection(description = product.description!!)
            }
        }

        // Bottom spacing
        item {
            Spacer(modifier = Modifier.height(100.dp))
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun ProductImageCarousel(images: List<String>) {
    val pagerState = rememberPagerState(pageCount = { images.size.coerceAtLeast(1) })

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {
        if (images.isNotEmpty()) {
            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
            ) { page ->
                AsyncImage(
                    model = images[page],
                    contentDescription = "Product image ${page + 1}",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize().padding(16.dp)
                )
            }

            // Page Indicator
            Row(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                repeat(images.size) { index ->
                    Box(
                        modifier = Modifier
                            .size(if (pagerState.currentPage == index) 10.dp else 8.dp)
                            .clip(CircleShape)
                            .background(
                                if (pagerState.currentPage == index) PrimaryBlue
                                else Color(0xFFD1D5DB)
                            )
                    )
                }
            }
        } else {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .background(Color(0xFFE5E7EB)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Image,
                    contentDescription = null,
                    modifier = Modifier.size(60.dp),
                    tint = GrayText
                )
            }
        }
    }
}

@Composable
private fun PriceAndTitleSection(product: Product) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
    ) {
        // Brand (using category as placeholder)
        product.category?.let {
            Text(
                text = it,
                fontSize = 12.sp,
                color = GrayText,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(4.dp))
        }

        // Title
        Text(
            text = product.displayName,
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = DarkText,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )

        // Short Description
        product.shortDescription?.let {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = it,
                fontSize = 14.sp,
                color = GrayText,
                maxLines = 2
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Rating
        product.rating?.let { rating ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = GreenSuccess,
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = String.format("%.1f", rating),
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.width(2.dp))
                        Icon(
                            Icons.Default.Star,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(12.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${product.reviewCount ?: 0} Reviews",
                    fontSize = 12.sp,
                    color = GrayText
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Price Row
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "₹${product.price.toInt()}",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = DarkText
            )

            product.mrp?.let { mrp ->
                if (mrp > product.price) {
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "₹${mrp.toInt()}",
                        fontSize = 16.sp,
                        color = GrayText,
                        textDecoration = TextDecoration.LineThrough
                    )
                }
            }

            product.discountPercentage?.let { discount ->
                if (discount > 0) {
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "$discount% off",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = GreenSuccess
                    )
                }
            }
        }

        // Protect Promise
        product.protectPromiseFee?.let { fee ->
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, BorderGray, RoundedCornerShape(8.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.Shield,
                    contentDescription = null,
                    tint = PrimaryBlue,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Protect Promise",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = DarkText
                    )
                    Text(
                        text = "Extended warranty for ₹${fee.toInt()}",
                        fontSize = 12.sp,
                        color = GrayText
                    )
                }
            }
        }
    }
}

@Composable
private fun HighlightsSection(highlights: List<String>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            text = "Highlights",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = DarkText
        )
        Spacer(modifier = Modifier.height(12.dp))
        
        highlights.forEach { highlight ->
            Row(
                modifier = Modifier.padding(vertical = 4.dp),
                verticalAlignment = Alignment.Top
            ) {
                Box(
                    modifier = Modifier
                        .padding(top = 6.dp)
                        .size(6.dp)
                        .clip(CircleShape)
                        .background(DarkText)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = highlight,
                    fontSize = 14.sp,
                    color = DarkText
                )
            }
        }
    }
}

@Composable
private fun DeliveryInfoSection(
    sellerName: String?,
    trustBadges: List<TrustBadge>?
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            text = "Seller & Delivery",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = DarkText
        )
        
        Spacer(modifier = Modifier.height(12.dp))

        // Seller
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                Icons.Outlined.Storefront,
                contentDescription = null,
                tint = PrimaryBlue,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Sold by: ${sellerName ?: "Local Seller"}",
                fontSize = 14.sp,
                color = DarkText
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Trust Badges
        if (!trustBadges.isNullOrEmpty()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                trustBadges.take(4).forEach { badge ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.width(80.dp)
                    ) {
                        Icon(
                            Icons.Default.Verified,
                            contentDescription = null,
                            tint = GreenSuccess,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = badge.label,
                            fontSize = 11.sp,
                            color = DarkText,
                            maxLines = 2,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else {
            // Default trust badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                listOf(
                    "Free Delivery" to Icons.Outlined.LocalShipping,
                    "7 Day Return" to Icons.Outlined.Replay,
                    "Secure Pay" to Icons.Outlined.Lock,
                    "COD Available" to Icons.Outlined.Payments
                ).forEach { (label, icon) ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.width(80.dp)
                    ) {
                        Icon(
                            icon,
                            contentDescription = null,
                            tint = PrimaryBlue,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = label,
                            fontSize = 11.sp,
                            color = DarkText,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun BankOffersSection(offers: List<ProductOffer>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            text = "Available Offers",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = DarkText
        )
        
        Spacer(modifier = Modifier.height(12.dp))

        offers.forEach { offer ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.Top
            ) {
                Icon(
                    Icons.Default.LocalOffer,
                    contentDescription = null,
                    tint = GreenSuccess,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = offer.title,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = DarkText
                    )
                    offer.description?.let {
                        Text(
                            text = it,
                            fontSize = 12.sp,
                            color = GrayText
                        )
                    }
                }
            }
            Divider(color = BorderGray)
        }
    }
}

@Composable
private fun DescriptionSection(description: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            text = "Description",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = DarkText
        )
        
        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = description,
            fontSize = 14.sp,
            color = DarkText,
            lineHeight = 22.sp
        )
    }
}

@Composable
private fun BottomActionBar(
    price: Double,
    onAddToCart: () -> Unit,
    onBuyNow: () -> Unit
) {
    Surface(
        color = Color.White,
        shadowElevation = 8.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Price
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "₹${price.toInt()}",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = DarkText
                )
            }

            // Add to Cart
            OutlinedButton(
                onClick = onAddToCart,
                modifier = Modifier.height(48.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = PrimaryBlue
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, PrimaryBlue),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.ShoppingCart, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Add to Cart", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Buy Now
            Button(
                onClick = onBuyNow,
                modifier = Modifier.height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = OrangeAccent),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Buy Now", fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}
