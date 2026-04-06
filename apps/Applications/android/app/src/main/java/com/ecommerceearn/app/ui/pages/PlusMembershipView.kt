package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PlusMembershipView(onNavigateBack: () -> Unit = {}) {
    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onNavigateBack, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
            }
            Spacer(modifier = Modifier.weight(1f))
            Text("Premium Membership", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            Spacer(modifier = Modifier.weight(1f))
            Spacer(modifier = Modifier.width(24.dp))
        }

        Divider(color = Color(0xFFE5E7EB))

        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Stars,
                contentDescription = null,
                tint = Color(0xFFFFD700),
                modifier = Modifier.size(64.dp).padding(bottom = 16.dp)
            )

            Text("Premium Membership Details", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF333333))
            Text("Coming Soon", fontSize = 16.sp, color = Color.Gray)
        }
    }
}
