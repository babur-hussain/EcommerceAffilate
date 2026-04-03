package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.AuthManager

@Composable
fun ProfileScreen() {
    val user by AuthManager.userState.collectAsState()
    var showLogin by remember { mutableStateOf(false) }

    if (showLogin) {
        LoginScreen(onDismiss = { showLogin = false })
    } else {
        if (user == null) {
            LoggedOutView(onLoginClick = { showLogin = true })
        } else {
            LoggedInView(user = user!!, onLogout = { AuthManager.logout() })
        }
    }
}

@Composable
fun LoggedOutView(onLoginClick: () -> Unit) {
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
            modifier = Modifier.size(64.dp),
            tint = Color(0xFFD1D5DB)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = "You're not signed in",
            fontSize = 20.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF111827)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = onLoginClick,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
            shape = RoundedCornerShape(8.dp),
            contentPadding = PaddingValues(horizontal = 32.dp, vertical = 12.dp)
        ) {
            Text("Sign In", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun LoggedInView(user: com.ecommerceearn.app.data.model.User, onLogout: () -> Unit) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
    ) {
        item {
            HeaderSection(user)
        }
        item {
            QuickLinksGrid()
            Spacer(modifier = Modifier.height(8.dp))
        }
        item {
            AccountSettingsSection()
        }
        item {
            SettingsSection()
        }
        item {
            SupportSection()
        }
        item {
            Box(modifier = Modifier.padding(horizontal = 16.dp).padding(top = 20.dp, bottom = 40.dp)) {
                Button(
                    onClick = onLogout,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Log Out", color = Color(0xFFEF4444), fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Composable
fun HeaderSection(user: com.ecommerceearn.app.data.model.User) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF0F5FF))
            .padding(16.dp)
            .padding(top = 24.dp)
    ) {
        Row(
            verticalAlignment = Alignment.Top,
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(Color.White),
                contentAlignment = Alignment.Center
            ) {
                if (!user.profileImage.isNullOrEmpty()) {
                    AsyncImage(
                        model = user.profileImage,
                        contentDescription = null,
                        modifier = Modifier.size(56.dp).clip(CircleShape)
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = user.name.ifEmpty { "User" },
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Explore ", fontSize = 14.sp, color = Color(0xFF4B5563))
                    Text(
                        text = "Plus",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.ExtraBold,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        color = Color(0xFF4B5563)
                    )
                    Icon(
                        Icons.Default.ChevronRight,
                        contentDescription = null,
                        modifier = Modifier.size(12.dp),
                        tint = Color(0xFF6B7280)
                    )
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
                    Icon(Icons.Outlined.Bolt, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color(0xFFF59E0B))
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
fun QuickLinksGrid() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            QuickLinkButton("Orders", Icons.Outlined.Inventory2, Color(0xFF2874F0), Modifier.weight(1f)) {}
            QuickLinkButton("Wishlist", Icons.Outlined.FavoriteBorder, Color(0xFF2874F0), Modifier.weight(1f)) {}
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            QuickLinkButton("Wallet", Icons.Outlined.AccountBalanceWallet, Color(0xFF2874F0), Modifier.weight(1f)) {}
            QuickLinkButton("Returns", Icons.Outlined.AssignmentReturn, Color(0xFF2874F0), Modifier.weight(1f)) {}
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            QuickLinkButton("Smart Basket", Icons.Outlined.ShoppingBasket, Color(0xFFF97316), Modifier.weight(1f)) {}
            Spacer(modifier = Modifier.weight(1f))
        }
    }
}

@Composable
fun QuickLinkButton(title: String, icon: ImageVector, iconTint: Color, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
        color = Color.White
    ) {
        Row(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(title, fontSize = 15.sp, fontWeight = FontWeight.Medium, color = Color(0xFF1F2937))
        }
    }
}

@Composable
fun AccountSettingsSection() {
    Column(modifier = Modifier.padding(top = 8.dp).fillMaxWidth().background(Color.White)) {
        SectionTitle("Account Settings")
        SettingsRow("Edit Profile", "Update your personal information", Icons.Outlined.Person) {}
        SettingsRow("Saved Addresses", "Manage delivery addresses", Icons.Outlined.LocationOn) {}
        SettingsRow("Payment Methods", "Cards, UPI, Wallets", Icons.Outlined.CreditCard) {}
        SettingsRow("Notifications", "Manage notification preferences", Icons.Outlined.Notifications, isLast = true) {}
    }
}

@Composable
fun SettingsSection() {
    Column(modifier = Modifier.padding(top = 8.dp).fillMaxWidth().background(Color.White)) {
        SectionTitle("Settings")
        SettingsRow("Language", "English", Icons.Outlined.Language) {}
        SettingsRow("Dark Mode", "Coming soon", Icons.Outlined.DarkMode) {}
        SettingsRow("Sell on Platform", "Become a seller", Icons.Outlined.Storefront) {}
        SettingsRow("Privacy Center", "Manage your data", Icons.Outlined.Shield, isLast = true) {}
    }
}

@Composable
fun SupportSection() {
    Column(modifier = Modifier.padding(top = 8.dp).fillMaxWidth().background(Color.White)) {
        SectionTitle("Support")
        SettingsRow("Help Center", "FAQs and support", Icons.Outlined.HelpOutline) {}
        SettingsRow("Terms & Conditions", null, Icons.Outlined.Description) {}
        SettingsRow("Privacy Policy", null, Icons.Outlined.PanTool, isLast = true) {}
    }
}

@Composable
fun SectionTitle(title: String) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
        )
        HorizontalDivider(color = Color(0xFFF3F4F6), thickness = 1.dp)
    }
}

@Composable
fun SettingsRow(title: String, subtitle: String?, icon: ImageVector, isLast: Boolean = false, onClick: () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().clickable { onClick() }.background(Color.White)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF2874F0), modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontSize = 15.sp, fontWeight = FontWeight.Medium, color = Color(0xFF111827))
                if (subtitle != null) {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(subtitle, fontSize = 12.sp, color = Color(0xFF6B7280))
                }
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF9CA3AF), modifier = Modifier.size(16.dp))
        }
        if (!isLast) {
            HorizontalDivider(color = Color(0xFFF3F4F6), thickness = 1.dp, modifier = Modifier.padding(start = 52.dp))
        }
    }
}
