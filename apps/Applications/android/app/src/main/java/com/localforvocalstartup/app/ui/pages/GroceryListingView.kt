package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroceryListingView(onNavigateBack: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
    ) {
        // Mock Location Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF8A2387))
                .padding(top = 44.dp, bottom = 16.dp, start = 16.dp, end = 16.dp)
        ) {
            Text("Location Bar Stub", color = Color.White, fontWeight = FontWeight.SemiBold)
        }
        
        // Mock Search Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(onClick = onNavigateBack, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            OutlinedTextField(
                value = "",
                onValueChange = {},
                placeholder = { Text("Search for products...", color = Color.Black) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier.height(48.dp).weight(1f),
                colors = TextFieldDefaults.outlinedTextFieldColors(
                    focusedBorderColor = Color.Transparent,
                    unfocusedBorderColor = Color.Transparent,
                    containerColor = Color(0xFFF5F5F5)
                )
            )
        }
        
        // Empty State
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            CircularProgressIndicator(color = Color(0xFF8A2387))
            Spacer(modifier = Modifier.height(16.dp))
            Text("Loading groceries...", color = Color.Gray, fontSize = 14.sp)
        }
    }
}
