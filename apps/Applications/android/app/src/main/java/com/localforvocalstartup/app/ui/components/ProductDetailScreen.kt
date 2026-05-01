package com.localforvocalstartup.app.ui.components

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.manager.CartManager
import com.localforvocalstartup.app.data.manager.ReviewManager
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.model.Address
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.model.ProductOffer
import com.localforvocalstartup.app.data.model.TrustBadge
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.data.remote.AffiliateLinkRequest
import com.localforvocalstartup.app.data.manager.WishlistManager
import com.localforvocalstartup.app.ui.pages.AddReviewView
import kotlinx.coroutines.delay
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
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val wishlistIds by WishlistManager.wishlistIds.collectAsState()
    var product by remember { mutableStateOf(initialProduct) }
    var isLoading by remember { mutableStateOf(initialProduct == null) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    // UI States
    var showLastChancePopup by remember { mutableStateOf(false) }
    var showAddressSelector by remember { mutableStateOf(false) }
    var showAddReviewSheet by remember { mutableStateOf(false) }
    
    // Address State
    var savedAddresses by remember { mutableStateOf<List<Address>>(emptyList()) }
    var selectedUserAddressId by remember { mutableStateOf<String?>(null) }
    val currentUserAddress = savedAddresses.firstOrNull { it.id == selectedUserAddressId } ?: savedAddresses.firstOrNull()

    // Fetch product details
    LaunchedEffect(productId) {
        if (productId == "not_found") {
            isLoading = false
            errorMessage = "Product not found"
            return@LaunchedEffect
        }
        
        if (product == null) {
            try {
                isLoading = true
                product = NetworkClient.apiService.getProductById(productId)
            } catch (e: Exception) {
                android.util.Log.e("ProductDetail", "Exception fetching product: ${e.message}", e)
                errorMessage = "Product not found"
            } finally {
                isLoading = false
            }
        }
        
        // Fetch reviews
        ReviewManager.fetchReviews(productId)
        
        // Fetch Addresses if logged in
        if (AuthManager.isLoggedIn()) {
            try {
                val fetchedAddresses = NetworkClient.apiService.getAddresses()
                savedAddresses = fetchedAddresses
                if (selectedUserAddressId == null && savedAddresses.isNotEmpty()) {
                    val defaultAddr = savedAddresses.firstOrNull { it.isDefault }
                    selectedUserAddressId = defaultAddr?.id ?: savedAddresses.first().id
                }
            } catch (e: Exception) {
                android.util.Log.e("ProductDetail", "Failed to fetch addresses: ${e.message}")
            }
        }
    }

    Scaffold(
        topBar = {
            ProductDetailHeader(
                onBackClick = onBackClick,
                onShareClick = {
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, "Check out this amazing product: ${product?.name ?: ""} on Local For Vocal!")
                    }
                    context.startActivity(Intent.createChooser(shareIntent, "Share Product"))
                },
                isWishlisted = product?.id?.let { wishlistIds.contains(it) } == true,
                onWishlistClick = {
                    product?.id?.let { pid ->
                        scope.launch { WishlistManager.toggleWishlist(pid) }
                    }
                },
                onCartClick = onCartClick,
                cartCount = CartManager.cartCount
            )
        },
        bottomBar = {
            product?.let {
                BottomActionBarView(
                    price = it.price,
                    onAddToCart = {
                        scope.launch { CartManager.addToCart(it, 1) }
                    },
                    onBuyNow = {
                        val offers = it.lastChanceOffers ?: emptyList()
                        if (offers.isNotEmpty()) {
                            showLastChancePopup = true
                        } else {
                            // Redirect to checkout
                            NavigationManager.navigate("cart")
                        }
                    },
                    onOpenCart = onCartClick
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
                    ProductDetailContent(
                        product = product!!,
                        currentUserAddress = currentUserAddress,
                        onChangeAddressClick = { showAddressSelector = true },
                        onRateProductClick = { showAddReviewSheet = true }
                    )
                }
            }
        }
    }
    
    // Modal Sheets
    UserAddressSelectorView(
        isVisible = showAddressSelector,
        savedUserAddresses = savedAddresses,
        selectedUserAddressId = selectedUserAddressId,
        onSelectUserAddress = { selectedUserAddressId = it.id; showAddressSelector = false },
        onUseCurrentLocation = { showAddressSelector = false },
        onAddNewUserAddress = { showAddressSelector = false },
        onDismiss = { showAddressSelector = false }
    )
    
    if (showLastChancePopup) {
        LastChancePopupView(
            isVisible = showLastChancePopup,
            offers = product?.lastChanceOffers ?: emptyList(),
            onDismiss = { 
                showLastChancePopup = false
                NavigationManager.navigate("cart") 
            }
        )
    }
    
    if (showAddReviewSheet) {
        Dialog(
            onDismissRequest = { showAddReviewSheet = false },
            properties = DialogProperties(usePlatformDefaultWidth = false)
        ) {
            AddReviewView(productId = productId)
        }
    }
}

@Composable
private fun ProductDetailHeader(
    onBackClick: () -> Unit,
    onShareClick: () -> Unit,
    isWishlisted: Boolean,
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
            if (isWishlisted) {
                Icon(Icons.Default.Favorite, contentDescription = "Wishlist", tint = Color.Red)
            } else {
                Icon(Icons.Outlined.FavoriteBorder, contentDescription = "Wishlist", tint = DarkText)
            }
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
private fun ProductDetailContent(
    product: Product,
    currentUserAddress: Address?,
    onChangeAddressClick: () -> Unit,
    onRateProductClick: () -> Unit
) {
    val reviews by ReviewManager.reviews.collectAsState()
    
    LazyColumn(modifier = Modifier.fillMaxSize()) {
        // Image Carousel
        item {
            ProductImageCarousel(images = product.images)
        }

        // Price & Title Section
        item {
            PriceAndTitleSection(product = product)
        }
        
        // Affiliate Section
        item { AffiliateSection(product = product) }

        // Highlights
        if (!product.highlights.isNullOrEmpty()) {
            item {
                Spacer(modifier = Modifier.height(8.dp).background(LightGray))
                HighlightsSection(highlights = product.highlights!!)
            }
        }

        // UserAddress Bar
        item {
            Spacer(modifier = Modifier.height(8.dp).background(LightGray))
            UserAddressBarView(currentUserAddress = currentUserAddress, onTap = onChangeAddressClick)
        }

        // Bank Offers
        if (!product.offers.isNullOrEmpty()) {
            item {
                Spacer(modifier = Modifier.height(8.dp).background(LightGray))
                BankOffersSection(offers = product.offers!!)
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

        // Description
        if (!product.description.isNullOrBlank()) {
            item {
                Spacer(modifier = Modifier.height(8.dp).background(LightGray))
                DescriptionSection(description = product.description!!)
            }
        }
        
        // Reviews Section
        item {
            Spacer(modifier = Modifier.height(8.dp).background(LightGray))
            Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                    Text("Ratings & Reviews", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.weight(1f))
                    // Only display rate product if logged in (parity)
                    if (AuthManager.isLoggedIn()) {
                        Text(
                            text = "Rate Product", 
                            fontSize = 14.sp, 
                            fontWeight = FontWeight.Medium, 
                            color = PrimaryBlue,
                            modifier = Modifier.clickable { onRateProductClick() }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                if (reviews.isEmpty()) {
                    Text("No reviews yet. Be the first to review!", fontSize = 14.sp, color = GrayText, modifier = Modifier.padding(vertical = 8.dp))
                } else {
                    reviews.forEach { r ->
                        ReviewRowView(review = r)
                        HorizontalDivider()
                    }
                }
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
fun AffiliateSection(product: Product) {
    val user by AuthManager.userState.collectAsState()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    
    // Condition mapping iOS (user role INFLUENCER)
    if (user != null && user?.role == "INFLUENCER" && user?.referralCode != null) {
        var isGeneratingLink by remember { mutableStateOf(false) }
        var generatedLink by remember { mutableStateOf("") }
        var linkCopied by remember { mutableStateOf(false) }
        
        Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(horizontal = 16.dp, vertical = 8.dp)) {
            Text("Affiliate Link", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = GrayText)
            Spacer(modifier = Modifier.height(8.dp))
            
            if (generatedLink.isEmpty()) {
                Button(
                    onClick = {
                        isGeneratingLink = true
                        scope.launch {
                            try {
                                val request = AffiliateLinkRequest(product.id ?: "", product.name ?: "")
                                val response = NetworkClient.apiService.generateAffiliateLink(request)
                                generatedLink = response.link
                            } catch (e: Exception) {
                                android.util.Log.e("Affiliate", "Failed to generate link", e)
                                // Fallback or handle error here if needed
                            } finally {
                                isGeneratingLink = false
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    if (isGeneratingLink) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                    } else {
                        Icon(Icons.Default.Link, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Generate Affiliate Link", color = Color.White, fontWeight = FontWeight.SemiBold)
                    }
                }
            } else {
                Column(modifier = Modifier.fillMaxWidth().background(Color(0xFFEFF6FF), RoundedCornerShape(10.dp)).padding(12.dp)) {
                    Text(generatedLink, color = PrimaryBlue, fontSize = 12.sp, maxLines = 2)
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = {
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                clipboard.setPrimaryClip(ClipData.newPlainText("Affiliate Link", generatedLink))
                                linkCopied = true
                                scope.launch { delay(2000); linkCopied = false }
                            },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = if (linkCopied) GreenSuccess else PrimaryBlue),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(if (linkCopied) Icons.Default.Check else Icons.Outlined.FileCopy, contentDescription = null)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(if (linkCopied) "Copied!" else "Copy")
                        }
                        
                        Button(
                            onClick = {
                                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                    type = "text/plain"
                                    putExtra(Intent.EXTRA_TEXT, "Check out this amazing product: ${product.name}\n$generatedLink")
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "Share Affiliate Link"))
                            },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = OrangeAccent),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.Share, contentDescription = null)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Share")
                        }
                    }
                }
            }
            
            val commPercent = product.influencerCommission ?: 0.0
            if (commPercent > 0) {
                Spacer(modifier = Modifier.height(8.dp))
                Text("Earn ₹${String.format("%.2f", (product.price * commPercent) / 100)} commission on this product", color = GreenSuccess, fontSize = 14.sp, fontWeight = FontWeight.Medium)
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
                            text = badge.name,
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
            HorizontalDivider(color = BorderGray)
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
