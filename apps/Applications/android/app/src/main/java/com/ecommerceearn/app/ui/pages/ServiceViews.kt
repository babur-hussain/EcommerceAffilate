package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ecommerceearn.app.data.model.*
import com.ecommerceearn.app.ui.viewmodel.ServicesViewModel

// Shared Colors mimicking iOS
val DeepBlue = Color(0xFF1E3A8A)
val SoftBlue = Color(0xFFEFF6FF)
val VividBlue = Color(0xFF3B82F6)
val SlateGray = Color(0xFF64748B)
val LightSlate = Color(0xFF94A3B8)
val DarkGray = Color(0xFF1F2937)
val Amber = Color(0xFFF59E0B)
val AmberLight = Color(0x80FEF3C7)
val TrustGreen = Color(0xFF059669)
val TrustGreenLight = Color(0xFFD1FAE5)

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
fun ServicesHomeView(
    headerContent: @Composable () -> Unit,
    onNavigateToSubCategory: (ServiceCategoryModel) -> Unit
) {
    val viewModel: ServicesViewModel = viewModel()
    val categories by viewModel.categories.collectAsState()
    val loading by viewModel.categoriesLoading.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.fetchCategories()
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF9FAFB))) {
        // Draw the background accents fixed at the top layer
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
                .clip(RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp))
        ) {
            CanvasBackgroundAccent()
        }

        androidx.compose.foundation.lazy.LazyColumn(
            modifier = Modifier.fillMaxSize()
        ) {
            // 1. The Top Tabs and Location Header
            item {
                headerContent()
            }

            // 3. The Sticky Header text
            stickyHeader {
                Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF9FAFB).copy(alpha = 0.95f))
                    .padding(horizontal = 20.dp)
                    .padding(top = 12.dp, bottom = 12.dp)
            ) {
                Text(
                    text = "Find Services",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = DeepBlue,
                    letterSpacing = (-0.5).sp
                )
                Text(
                    text = "Book trusted professionals near you",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    color = SlateGray,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }
        }

        if (loading) {
            item {
                Box(modifier = Modifier.fillMaxWidth().height(300.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = DeepBlue)
                }
            }
        } else if (categories.isEmpty()) {
            item {
                Box(modifier = Modifier.fillMaxWidth().height(300.dp), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Build,
                            contentDescription = "No Services",
                            modifier = Modifier.size(48.dp),
                            tint = Color(0xFFD1D5DB)
                        )
                        Text(
                            text = "No services available yet",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF9CA3AF),
                            modifier = Modifier.padding(top = 12.dp)
                        )
                    }
                }
            }
        } else {
            // 4. Grid Items manually chunked for LazyColumn
            val chunkedCategories = categories.chunked(3)
            items(chunkedCategories.size) { rowIndex ->
                val rowCategories = chunkedCategories[rowIndex]
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    for (category in rowCategories) {
                        Box(modifier = Modifier.weight(1f)) {
                            ServiceCategoryCard(category = category) {
                                onNavigateToSubCategory(category)
                            }
                        }
                    }
                    val emptySpots = 3 - rowCategories.size
                    for (i in 0 until emptySpots) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
            
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
    }
}


@Composable
fun CanvasBackgroundAccent() {
    Box(modifier = Modifier.fillMaxWidth().height(120.dp)) {
        Box(
            modifier = Modifier
                .size(200.dp)
                .offset(x = (-40).dp, y = (-80).dp)
                .blur(20.dp)
                .background(
                    Brush.linearGradient(
                        colors = listOf(Color(0xFFEFF6FF), Color.White.copy(alpha = 0.1f))
                    ), shape = CircleShape
                )
        )
        Box(
            modifier = Modifier
                .size(150.dp)
                .align(Alignment.BottomEnd)
                .offset(x = 40.dp, y = (-20).dp)
                .blur(30.dp)
                .background(
                    Brush.linearGradient(
                        colors = listOf(Color(0x99DBEAFE), Color.White.copy(alpha = 0.1f))
                    ), shape = CircleShape
                )
        )
    }
}

@Composable
fun ServiceCategoryCard(
    category: ServiceCategoryModel,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 8.dp,
                shape = RoundedCornerShape(20.dp),
                spotColor = DeepBlue.copy(alpha = 0.06f)
            )
            .background(Color.White, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(vertical = 16.dp, horizontal = 10.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box(
            modifier = Modifier
                .size(58.dp)
                .background(SoftBlue, RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (category.icon.isEmpty()) "📦" else category.icon,
                fontSize = 28.sp
            )
        }

        Text(
            text = category.name,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = DeepBlue,
            textAlign = TextAlign.Center,
            maxLines = 2,
            modifier = Modifier.height(36.dp),
            lineHeight = 16.sp
        )
    }
}

@Composable
fun SubServiceListView(
    category: ServiceCategoryModel,
    onNavigateToProviders: (ServiceSubCategoryModel, String) -> Unit
) {
    val viewModel: ServicesViewModel = viewModel()
    val subCategories by viewModel.subCategories.collectAsState()
    val loading by viewModel.subCategoriesLoading.collectAsState()

    LaunchedEffect(category.id) {
        viewModel.fetchSubCategories(category.id)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF9FAFB))
            .verticalScroll(rememberScrollState())
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = category.name,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = DarkGray
            )

            if (category.description.isNotEmpty()) {
                Text(
                    text = category.description,
                    fontSize = 14.sp,
                    color = Color(0xFF6B7280)
                )
            }

            if (loading) {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = DeepBlue)
                }
            } else if (subCategories.isEmpty()) {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.List,
                            contentDescription = "No sub-services",
                            modifier = Modifier.size(40.dp),
                            tint = Color(0xFFD1D5DB)
                        )
                        Text(
                            text = "No sub-services available",
                            color = Color(0xFF9CA3AF),
                            modifier = Modifier.padding(top = 12.dp)
                        )
                    }
                }
            } else {
                subCategories.forEach { subCat ->
                    SubServiceRow(subCat) {
                        onNavigateToProviders(subCat, category.name)
                    }
                }
            }
        }
    }
}

@Composable
fun SubServiceRow(
    subCategory: ServiceSubCategoryModel,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 6.dp,
                shape = RoundedCornerShape(18.dp),
                spotColor = DeepBlue.copy(alpha = 0.06f)
            )
            .background(Color.White, RoundedCornerShape(18.dp))
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(SoftBlue, RoundedCornerShape(14.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (subCategory.icon.isEmpty()) "🔧" else subCategory.icon,
                fontSize = 24.sp
            )
        }

        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = subCategory.name,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = DeepBlue
            )
            if (subCategory.description.isNotEmpty()) {
                Text(
                    text = subCategory.description,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = SlateGray,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = "Go",
            tint = DeepBlue.copy(alpha = 0.5f),
            modifier = Modifier.size(20.dp)
        )
    }
}

@Composable
fun ServiceProviderListView(
    subCategory: ServiceSubCategoryModel,
    categoryName: String,
    onNavigateToDetail: (String) -> Unit
) {
    val viewModel: ServicesViewModel = viewModel()
    val providers by viewModel.providers.collectAsState()
    val loading by viewModel.providersLoading.collectAsState()

    LaunchedEffect(subCategory.id) {
        viewModel.fetchProviders(subCategory.id)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF9FAFB))
            .verticalScroll(rememberScrollState())
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "${subCategory.name} Providers",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = DarkGray
            )

            if (loading) {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = DeepBlue)
                }
            } else if (providers.isEmpty()) {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.PersonSearch,
                            contentDescription = "No providers",
                            modifier = Modifier.size(40.dp),
                            tint = Color(0xFFD1D5DB)
                        )
                        Text(
                            text = "No providers available yet",
                            color = Color(0xFF9CA3AF),
                            modifier = Modifier.padding(top = 12.dp)
                        )
                    }
                }
            } else {
                providers.forEach { provider ->
                    ProviderCard(provider) {
                        onNavigateToDetail(provider.id)
                    }
                }
            }
        }
    }
}

@Composable
fun ProviderCard(
    provider: ServiceProviderModel,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 8.dp,
                shape = RoundedCornerShape(20.dp),
                spotColor = DeepBlue.copy(alpha = 0.06f)
            )
            .background(Color.White, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(54.dp)
                    .background(SoftBlue, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                val initial = provider.userId?.name?.firstOrNull()?.toString() ?: "?"
                Text(
                    text = initial,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = DeepBlue
                )
            }

            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = provider.businessName,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = DeepBlue
                )
                Text(
                    text = provider.userId?.name ?: "",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = SlateGray
                )
            }

            // Rating Pill
            Row(
                modifier = Modifier
                    .background(AmberLight, RoundedCornerShape(10.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Rating",
                    tint = Amber,
                    modifier = Modifier.size(14.dp)
                )
                Text(
                    text = String.format("%.1f", provider.rating),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = DarkGray
                )
            }
        }

        HorizontalDivider(color = Color(0xFFF1F5F9))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = "Starting at",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = LightSlate
                )
                Text(
                    text = "${provider.currency} ${provider.startingPrice.toInt()}",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = DeepBlue
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "${provider.experienceYears} yrs exp.",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = DeepBlue,
                    modifier = Modifier
                        .background(SoftBlue, RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                )

                if (provider.isVerified) {
                    Row(
                        modifier = Modifier
                            .background(TrustGreenLight, RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "Verified",
                            tint = TrustGreen,
                            modifier = Modifier.size(12.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ServiceProviderDetailView(providerId: String) {
    val viewModel: ServicesViewModel = viewModel()
    val provider by viewModel.selectedProvider.collectAsState()
    val reviews by viewModel.providerReviews.collectAsState()

    LaunchedEffect(providerId) {
        viewModel.fetchProviderDetail(providerId)
        viewModel.fetchProviderReviews(providerId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
            .verticalScroll(rememberScrollState())
    ) {
        if (provider != null) {
            val p = provider!!
            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // Header Card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .background(Color(0xFFE0E7FF), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        val initial = p.userId?.name?.firstOrNull()?.toString() ?: "?"
                        Text(
                            text = initial,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4F46E5)
                        )
                    }

                    Text(
                        text = p.businessName,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = DarkGray
                    )

                    Text(
                        text = p.userId?.name ?: "",
                        fontSize = 15.sp,
                        color = Color(0xFF6B7280)
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(5) { index ->
                            Icon(
                                imageVector = if (index < p.rating.toInt()) Icons.Default.Star else Icons.Default.StarBorder,
                                contentDescription = "Star",
                                tint = Amber,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Text(
                            text = "(${p.reviewCount} reviews)",
                            fontSize = 13.sp,
                            color = Color(0xFF6B7280)
                        )
                    }

                    if (p.isVerified) {
                        Row(
                            modifier = Modifier
                                .background(Color(0xFFEEF2FF), RoundedCornerShape(20.dp))
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = "Verified Provider",
                                tint = Color(0xFF2563EB),
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "Verified Provider",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFF2563EB)
                            )
                        }
                    }
                }

                // Info Section
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text(
                        text = "About",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = DarkGray
                    )

                    if (p.description.isNotEmpty()) {
                        Text(
                            text = p.description,
                            fontSize = 14.sp,
                            color = Color(0xFF4B5563)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        DetailItem(icon = Icons.Default.Work, label = "Experience", value = "${p.experienceYears} years", modifier = Modifier.weight(1f))
                        DetailItem(icon = Icons.Default.Payments, label = "Starting at", value = "${p.currency} ${p.startingPrice.toInt()}", modifier = Modifier.weight(1f))
                        DetailItem(icon = Icons.Default.LocalOffer, label = "Pricing", value = p.pricingModel, modifier = Modifier.weight(1f))
                    }
                }

                // Location
                if (!p.location?.address.isNullOrEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color.White, RoundedCornerShape(16.dp))
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Location",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = DarkGray
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = "Location",
                                tint = Color(0xFF2563EB),
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = p.location!!.address!!,
                                fontSize = 14.sp,
                                color = Color(0xFF4B5563)
                            )
                        }
                    }
                }

                // Reviews
                if (reviews.isNotEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color.White, RoundedCornerShape(16.dp))
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = "Reviews",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = DarkGray
                        )

                        reviews.forEach { review ->
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFFF9FAFB), RoundedCornerShape(10.dp))
                                    .padding(12.dp),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = review.customerId?.name ?: "Customer",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                                        repeat(review.rating) {
                                            Icon(
                                                imageVector = Icons.Default.Star,
                                                contentDescription = "Star",
                                                tint = Amber,
                                                modifier = Modifier.size(10.dp)
                                            )
                                        }
                                    }
                                }
                                if (review.review.isNotEmpty()) {
                                    Text(
                                        text = review.review,
                                        fontSize = 13.sp,
                                        color = Color(0xFF6B7280)
                                    )
                                }
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(80.dp))
            }
        } else {
            Box(modifier = Modifier.fillMaxWidth().height(300.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = DeepBlue)
            }
        }
    }
}

@Composable
fun DetailItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = Color(0xFF4F46E5),
            modifier = Modifier.size(24.dp)
        )
        Text(
            text = label,
            fontSize = 11.sp,
            color = Color(0xFF9CA3AF)
        )
        Text(
            text = value,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF374151),
            textAlign = TextAlign.Center
        )
    }
}
