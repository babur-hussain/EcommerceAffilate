package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocalMall
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.localforvocalstartup.app.data.manager.NavigationManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsView() {
    Scaffold(
        topBar = {
            SmallTopAppBar(
                title = { Text("Notifications", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { NavigationManager.navigate("account") }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    TextButton(onClick = { /* Mark all read */ }) {
                        Text("Mark All Read")
                    }
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = Color(0xFFF3F4F6)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                NotificationRow(
                    title = "Order Shipped!",
                    message = "Your order #890123 has been shipped and is out for delivery today.",
                    time = "10 mins ago",
                    icon = Icons.Default.LocalMall,
                    iconColor = Color(0xFF4CAF50),
                    isUnread = true
                )
            }
            item {
                NotificationRow(
                    title = "Flash Sale Alert ⚡️",
                    message = "Hurry up! Up to 80% off on winter fashion. Deal ends in 4 hours.",
                    time = "2 hours ago",
                    icon = Icons.Default.LocalOffer,
                    iconColor = Color(0xFFF44336),
                    isUnread = true
                )
            }
            item {
                NotificationRow(
                    title = "Cashback Credited",
                    message = "₹50 has been successfully added to your Local For Vocal wallet.",
                    time = "Yesterday",
                    icon = Icons.Default.NotificationsActive,
                    iconColor = Color(0xFF2874F0),
                    isUnread = false
                )
            }
        }
    }
}

@Composable
fun NotificationRow(title: String, message: String, time: String, icon: ImageVector, iconColor: Color, isUnread: Boolean) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = if (isUnread) Color(0xFFF4F8FF) else Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = if (isUnread) 2.dp else 0.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(iconColor.copy(alpha = 0.1f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, modifier = Modifier.size(24.dp), tint = iconColor)
            }
            
            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = message, fontSize = 14.sp, color = Color(0xFF4B5563), maxLines = 2, overflow = TextOverflow.Ellipsis)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = time, fontSize = 12.sp, color = Color(0xFF9CA3AF))
            }

            if (isUnread) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(Color(0xFF2874F0), CircleShape)
                )
            }
        }
    }
}
