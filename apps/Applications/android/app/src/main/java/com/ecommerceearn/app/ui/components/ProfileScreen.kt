package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.AuthManager
import com.ecommerceearn.app.data.model.AccountLayout
import com.ecommerceearn.app.data.model.LayoutItem
import com.ecommerceearn.app.data.model.LayoutSection
import com.ecommerceearn.app.data.remote.NetworkClient
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen() {
    val user by AuthManager.userState.collectAsState()
    val scope = rememberCoroutineScope()
    var accountLayout by remember { mutableStateOf<AccountLayout?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var showLogin by remember { mutableStateOf(false) }
    var showOrders by remember { mutableStateOf(false) }
    
    // Log on recomposition
    android.util.Log.d("ProfileScreen", "Recomposing. user: ${user?.email}, showLogin: $showLogin")

    // Fetch dynamic layout when user is logged in
    LaunchedEffect(user) {
        if (user != null) {
            isLoading = true
            try {
               accountLayout = NetworkClient.apiService.getAccountLayout()
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        }
    }

    if (showOrders) {
        MyOrdersScreen(onBackClick = { showOrders = false })
    } else if (showLogin) {
        LoginScreen(onDismiss = { showLogin = false })
    } else {
        if (user == null) {
            GuestProfileView(onLoginClick = { showLogin = true })
        } else {
            UserProfileView(
                user = user!!,
                layout = accountLayout,
                onLogout = { AuthManager.logout() },
                onOrdersClick = { showOrders = true }
            )
        }
    }
}

@Composable
fun GuestProfileView(onLoginClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6)),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.AccountCircle,
            contentDescription = null,
            modifier = Modifier.size(80.dp),
            tint = Color(0xFFD1D5DB)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "You are not signed in",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1F2937)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = onLoginClick,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Sign In / Sign Up", color = Color.White)
        }
    }
}

@Composable
fun UserProfileView(
    user: com.ecommerceearn.app.data.model.User,
    layout: AccountLayout?,
    onLogout: () -> Unit,
    onOrdersClick: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
    ) {
        // Header
        item {
            ProfileHeader(user)
        }

        // Quick Links Grid
        item {
            QuickLinksGrid(onOrdersClick = onOrdersClick)
        }

        // Dynamic Sections
        if (layout != null) {
            items(layout.sections) { section ->
                LayoutSectionView(section)
            }
        }

        // Logout Button
        item {
            Box(modifier = Modifier.padding(16.dp)) {
                Button(
                    onClick = onLogout,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Log Out", color = Color(0xFFEF4444), fontWeight = FontWeight.Bold)
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun ProfileHeader(user: com.ecommerceearn.app.data.model.User) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
            .padding(top = 24.dp) // Status bar padding
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = user.email, // Or Name
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Explore ", fontSize = 14.sp, color = Color(0xFF4B5563))
                    Text(
                        text = user.membershipStatus ?: "Plus",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.ExtraBold,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        color = Color(0xFF4B5563)
                    )
                    Icon(Icons.Default.ChevronRight, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color(0xFF6B7280))
                }
            }

            Surface(
                shape = RoundedCornerShape(20.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                color = Color.White
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Outlined.Bolt, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color(0xFFF59E0B)) // Flash/Coin icon
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${user.coins}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                }
            }
        }
    }
}

@Composable
fun QuickLinksGrid(onOrdersClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        QuickLinkItem(
            icon = Icons.Outlined.Inventory2, // Cube/Orders
            label = "Orders",
            modifier = Modifier.weight(1f).clickable { onOrdersClick() }
        )
        QuickLinkItem(
            icon = Icons.Outlined.FavoriteBorder, // Heart/Wishlist
            label = "Wishlist",
            modifier = Modifier.weight(1f)
        )
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        QuickLinkItem(
            icon = Icons.Outlined.AccountBalanceWallet, // Wallet
            label = "Wallet",
            modifier = Modifier.weight(1f)
        )
        QuickLinkItem(
            icon = Icons.Outlined.HeadsetMic, // Help
            label = "Help Center",
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
fun QuickLinkItem(icon: ImageVector, label: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.height(60.dp),
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
        color = Color.White
    ) {
        Row(
            modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF2874F0), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(label, fontSize = 15.sp, fontWeight = FontWeight.Medium, color = Color(0xFF1F2937))
        }
    }
}

@Composable
fun LayoutSectionView(section: LayoutSection) {
    Column(
        modifier = Modifier
            .padding(top = 8.dp)
            .background(Color.White)
            .fillMaxWidth()
    ) {
        Text(
            text = section.title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
        )
        Divider(color = Color(0xFFF3F4F6))
        
        section.items.forEachIndexed { index, item ->
            LayoutItemView(item, isLast = index == section.items.lastIndex)
        }
    }
}

@Composable
fun LayoutItemView(item: LayoutItem, isLast: Boolean) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* Handle DeepLink */ }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Icon (Using a generic icon for now, ideally map item.icon string to vector)
        Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF2874F0), modifier = Modifier.size(24.dp))
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(item.title, fontSize = 15.sp, fontWeight = FontWeight.Medium, color = Color(0xFF111827))
             if (!item.subtitle.isNullOrBlank()) {
                 Text(item.subtitle, fontSize = 12.sp, color = Color(0xFF6B7280))
             }
        }
        
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF9CA3AF), modifier = Modifier.size(20.dp))
    }
    
    if (!isLast) {
        Divider(color = Color(0xFFF3F4F6), modifier = Modifier.padding(start = 16.dp))
    }
}
