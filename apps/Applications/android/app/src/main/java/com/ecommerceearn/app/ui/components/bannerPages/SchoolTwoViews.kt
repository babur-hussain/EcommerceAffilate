package com.ecommerceearn.app.ui.components.bannerPages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.BTSProduct
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.safeParseColor
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

// Theme Colors
private val primaryYellow = Color(0xFFFACC15)
private val primaryGreen = Color(0xFF155E48)

// ============= SchoolTwo Header View =============

@Composable
fun SchoolTwoHeaderView(
    component: SDUIComponent
) {
    Column(
        modifier = Modifier.padding(bottom = 24.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(256.dp)
                .clip(RoundedCornerShape(24.dp))
        ) {
            // Header Image
            AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuAalVn-6jNXwxbl_nzvbQ21tHvnvozO9MeNdXHP0GXaTNmzbOwNWIHLfZ38ACLgPQiQsTM2f4JM8cTDBMMnwAKgXnOIgO-7cL_Xt3FNwWrTeQt7I3kKBCg3U6YBo4fhQkZYBOtYEWjnrqgC5D-l5J2Erl-fuLp8WcHtHYPf1onJaZGOaIXj_LnJxU1WKFvIfoFFhxvkw8UxqvRP2PIvbdPsZqsIMdjJaaKl5HVyTv0HOVRYn4ThOGKzNpH3BU7MvrNMQQC3RQ3wGP9u",
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )

            // Gradient overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Black.copy(alpha = 0.6f), Color.Transparent)
                        )
                    )
            )

            // Navbar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 48.dp, start = 16.dp, end = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Menu button
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White.copy(alpha = 0.1f), CircleShape)
                        .border(1.dp, Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Menu",
                        tint = Color.White
                    )
                }

                // Title
                Text(
                    text = "The School Shop",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                // Cart button with badge
                Box {
                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color.White.copy(alpha = 0.1f), CircleShape)
                            .border(1.dp, Color.White.copy(alpha = 0.2f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingCart,
                            contentDescription = "Cart",
                            tint = Color.White
                        )
                    }
                    // Badge
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .offset(x = 4.dp, y = (-4).dp)
                            .size(16.dp)
                            .background(primaryYellow, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "3",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                    }
                }
            }
        }

        // Search Bar with dashed border
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .offset(y = (-32).dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 2.dp,
                        color = Color(0xFFD1D5DB),
                        shape = RoundedCornerShape(16.dp)
                    )
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = Color(0xFF9CA3AF)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Search for books, pencils...",
                    fontSize = 14.sp,
                    color = Color(0xFF9CA3AF),
                    modifier = Modifier.weight(1f)
                )
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .size(32.dp)
                        .background(primaryYellow, RoundedCornerShape(8.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Filter",
                        tint = Color.Black,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

// ============= SchoolTwo Grid View =============

@Composable
fun SchoolTwoGridView(
    component: SDUIComponent
) {
    val products = listOf(
        BTSProduct(
            id = "1", title = "Premium Sketchbook Set", subtitle = "Art & Design",
            price = "$12.99", badge = "BEST SELLER", badgeColor = "#FACC15",
            image = "https://lh3.googleusercontent.com/aida-public/AB6AXuDMKjBvZ7lHkjDIHdFD_Oymj0ODzClyEHIIVCEtjZYwky5PRHJU43KfKpmxSOTEZvn74J2jplEhOR65Zr-roVA_EqCCW0zk31YTgr1A49Bb7Mfd7Qtw7p5OkcFO1tXwrNKUqMm6jUpAC2aK12EOPAdya9B5xf4iXZB9m2QCWjWwCM0QhdXzuRtUVTjWhioNdeNrCZQbScDN9dFGlG3b3m2L_fZn635T3_u6oEHA9L-xWdshi90_FgLCQ7djJxlyTfNTpwGflbXiwdOs"
        ),
        BTSProduct(
            id = "2", title = "Fineliner Pen Pack", subtitle = "Writing Tools",
            price = "$11.99", badge = "-20%", badgeColor = "#EF4444",
            image = "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcvAJiC6aMGAZ6-Z3rF0ipX2k9f-CUrcig3VnI6M8soGm9E1M4gYxgcF444jtlCqaaoeSej-kEiORfKyA_wUjSGahJ4AsMPOM1X34i5MIjRnBxp850CLR3o5PPILzzeJZl_8VMxJ-CA4aZ0Tnz3lWtboC0EDwGvBwakh7klA026drDqjoIGNwMfDGyJ5vHDj7KPlmU6z4iwukBSIlSpun0mPlI1vLB55Z4PktijMBD0RnjFIp96hEhRUr7k8j4higJfkcIgX1yPB_"
        ),
        BTSProduct(
            id = "3", title = "Classic Canvas Bag", subtitle = "Accessories",
            price = "$24.50",
            image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCOVksraPr3tJaRnP1uz6GLJjAg575bnfNLFm25WspTdhn2VCnAneWHAyvlZitf-VbCVC33aFyj5DbBYS8wK-i6AqQqO8-YfElctvhJ2xLkXWf7UoERin6aicIGT-s-2u7l3Ov_jErMWcqOSWkuUPaufv72X4J23325wVtpo3UA1gNWpMvIDj_0XvIv82OC-q4XagJwieobEpr5vlkuStogIpAYGwe4xXa4BqJmGrpLPyWxrEh4ssFcpIIERqMKRm9koxNDjVnUZSCN"
        ),
        BTSProduct(
            id = "4", title = "Science Textbook", subtitle = "Education",
            price = "$45.00",
            image = "https://lh3.googleusercontent.com/aida-public/AB6AXuAlKGILC8YgeYkEwG4NJNnb-WOlsreGSkaKOKu0yQnmFL7PpZDQorUjkTEmSdfo8uFOzYEzszGMhpsjE6RUNWqzwNV2nNjmbXAl6FVDaATYfHF2mWDIouVYbBMekLTnY-xvKbfLJdzLmsJJUjA7f3R5S_1nRnBf4RZP88nrG2hOLzuVJ0yP6Jk07EGXFePaVMWrvkyDUzGek2Y_-TV7wjdqFs7k3h5TWxYRXAtS9naBq1XUL1GBGCyBd26nH9R3QJpRt_5cq6B0cu8u"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(primaryGreen)
            .padding(top = 24.dp, bottom = 24.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Top Picks",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Spacer(modifier = Modifier.width(8.dp))
            Icon(
                imageVector = Icons.Default.Star,
                contentDescription = null,
                tint = primaryYellow
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Grid
        val rows = products.chunked(2)
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            rows.forEach { rowItems ->
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    rowItems.forEach { item ->
                        SchoolTwoProductCard(
                            item = item,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    if (rowItems.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
fun SchoolTwoProductCard(
    item: BTSProduct,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .shadow(8.dp, RoundedCornerShape(12.dp)),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column {
            // Image Area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(128.dp)
                    .padding(12.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFF3F4F6))
            ) {
                AsyncImage(
                    model = item.image,
                    contentDescription = item.title,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                // Badge
                item.badge?.let { badge ->
                    val isYellow = item.badgeColor == "#FACC15"
                    Text(
                        text = badge,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isYellow) Color.Black else Color.White,
                        modifier = Modifier
                            .padding(8.dp)
                            .background(
                                safeParseColor(item.badgeColor ?: "#000000"),
                                RoundedCornerShape(4.dp)
                            )
                            .rotate(-3f)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }

                // Favorite
                IconButton(
                    onClick = { },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .size(28.dp)
                        .background(Color.White, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "Favorite",
                        tint = Color(0xFF9CA3AF),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            // Content
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                Text(
                    text = item.title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Text(
                    text = item.subtitle,
                    fontSize = 12.sp,
                    color = Color(0xFF9CA3AF)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Stars
                Row(
                    horizontalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    repeat(5) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = primaryYellow,
                            modifier = Modifier.size(12.dp)
                        )
                    }
                    Text(
                        text = "(42)",
                        fontSize = 10.sp,
                        color = Color(0xFF9CA3AF)
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.price,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = primaryGreen
                    )

                    IconButton(
                        onClick = { },
                        modifier = Modifier
                            .size(28.dp)
                            .background(Color.Black, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}

// ============= SchoolTwo Banner View =============

@Composable
fun SchoolTwoBannerView(
    component: SDUIComponent
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .height(140.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(primaryYellow, Color(0xFFFDE047))
                )
            )
            .shadow(8.dp, RoundedCornerShape(16.dp))
    ) {
        // Dashed border effect
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(4.dp)
                .border(
                    width = 2.dp,
                    color = Color.White,
                    shape = RoundedCornerShape(12.dp)
                )
        )

        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Back To School",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = primaryGreen
                )

                Text(
                    text = "Get 50% OFF on all bundles",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = primaryGreen
                )

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = { },
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = primaryGreen
                    )
                ) {
                    Text(
                        text = "SHOP NOW",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }

            // Graduation Cap Icon
            Text(
                text = "🎓",
                fontSize = 64.sp,
                modifier = Modifier.padding(end = 16.dp)
            )
        }
    }
}

// ============= SchoolTwo Categories View =============

@Composable
fun SchoolTwoCategoriesView(
    component: SDUIComponent
) {
    // Similar to BackToSchoolCategoriesView but with SchoolTwo theme
    BackToSchoolCategoriesView(component)
}

// ============= SchoolTwo Deals View =============

@Composable
fun SchoolTwoDealsView(
    component: SDUIComponent
) {
    val props = component.props ?: emptyMap()
    val title = props["title"] as? String ?: "Today's Deals"

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            TextButton(onClick = { }) {
                Text(
                    text = "See All",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = primaryGreen
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(4) { index ->
                Card(
                    modifier = Modifier.width(150.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(100.dp)
                                .background(Color(0xFFF3F4F6))
                        ) {
                            // Deal badge
                            Text(
                                text = "${(index + 1) * 10}% OFF",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier
                                    .padding(8.dp)
                                    .background(Color(0xFFEF4444), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }

                        Column(
                            modifier = Modifier.padding(8.dp)
                        ) {
                            Text(
                                text = "Deal Item ${index + 1}",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = "$${(index + 1) * 12}.99",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = primaryGreen
                            )
                        }
                    }
                }
            }
        }
    }
}

// ============= SchoolTwo Footer View =============

@Composable
fun SchoolTwoFooterView() {
    BackToSchoolFooterView()
}
