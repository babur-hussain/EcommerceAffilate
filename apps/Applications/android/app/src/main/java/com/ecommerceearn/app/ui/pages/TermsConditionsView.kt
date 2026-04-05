package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.NavigationManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TermsConditionsView() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Terms & Conditions", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937)) },
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
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Last Updated: January 2026", fontSize = 12.sp, color = Color.Gray)

            Text("1. Introduction", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            Text("Welcome to Local For Vocal. By using our app, you agree to these terms...", fontSize = 14.sp, color = Color(0xFF4B5563))

            Text("2. User Accounts", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            Text("You are responsible for maintaining the confidentiality of your account...", fontSize = 14.sp, color = Color(0xFF4B5563))

            Text("3. Orders & Payments", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            Text("All orders are subject to availability. Payments must be made via approved methods...", fontSize = 14.sp, color = Color(0xFF4B5563))

            Text("4. Returns & Refunds", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            Text("Please refer to our Return Policy for details on returns and refunds...", fontSize = 14.sp, color = Color(0xFF4B5563))

            Text("5. Limitation of Liability", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            Text("Local For Vocal shall not be liable for any indirect, incidental, or consequential damages...", fontSize = 14.sp, color = Color(0xFF4B5563))
        }
    }
}
