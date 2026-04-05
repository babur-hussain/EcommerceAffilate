package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.NavigationManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlusMembershipView() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Premium Membership", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937)) },
                navigationIcon = {
                    IconButton(onClick = { NavigationManager.goBack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = Color.White
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(Icons.Default.Star, contentDescription = null, modifier = Modifier.size(64.dp), tint = Color(0xFFFFD700)) // Yellow Star
            Spacer(modifier = Modifier.height(16.dp))
            Text("Premium Membership Details", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF333333))
            Spacer(modifier = Modifier.height(8.dp))
            Text("Coming Soon", fontSize = 16.sp, color = Color.Gray)
        }
    }
}
