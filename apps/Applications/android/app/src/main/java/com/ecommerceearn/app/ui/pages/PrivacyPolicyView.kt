package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.NavigationManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrivacyPolicyView() {
    var showDeactivateAlert by remember { mutableStateOf(false) }
    var showDeleteAlert by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Privacy Center", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937)) },
                navigationIcon = {
                    IconButton(onClick = { NavigationManager.goBack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = Color(0xFFF3F4F6)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // White group
            Column(modifier = Modifier.background(Color.White).fillMaxWidth()) {
                PrivacyMenuItem("Privacy Policy", Icons.Default.Description)
                Divider(modifier = Modifier.padding(start = 16.dp))
                PrivacyMenuItem("Request My Data", Icons.Default.FileDownload)
                Divider(modifier = Modifier.padding(start = 16.dp))
                PrivacyMenuItem("Consent Management", Icons.Default.Shield)
                Divider(modifier = Modifier.padding(start = 16.dp))
                PrivacyMenuItem("Grievance Redressal", Icons.Default.Warning)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Danger group
            Column(modifier = Modifier.background(Color.White).fillMaxWidth()) {
                Row(
                    modifier = Modifier
                        .clickable { showDeactivateAlert = true }
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Deactivate Account", color = Color.Blue, fontSize = 16.sp)
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray)
                }

                Divider(modifier = Modifier.padding(start = 16.dp))

                Row(
                    modifier = Modifier
                        .clickable { showDeleteAlert = true }
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Delete Account", color = Color.Red, fontSize = 16.sp)
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray)
                }
            }
        }

        if (showDeactivateAlert) {
            AlertDialog(
                onDismissRequest = { showDeactivateAlert = false },
                title = { Text("Deactivate Account") },
                text = { Text("Are you sure you want to deactivate your account? This is temporary.") },
                confirmButton = {
                    TextButton(onClick = { showDeactivateAlert = false }) { Text("Deactivate", color = Color.Red) }
                },
                dismissButton = {
                    TextButton(onClick = { showDeactivateAlert = false }) { Text("Cancel") }
                }
            )
        }

        if (showDeleteAlert) {
            AlertDialog(
                onDismissRequest = { showDeleteAlert = false },
                title = { Text("Delete Account") },
                text = { Text("Are you sure you want to delete your account? This action cannot be undone.") },
                confirmButton = {
                    TextButton(onClick = { showDeleteAlert = false }) { Text("Delete", color = Color.Red) }
                },
                dismissButton = {
                    TextButton(onClick = { showDeleteAlert = false }) { Text("Cancel") }
                }
            )
        }
    }
}

@Composable
fun PrivacyMenuItem(title: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .clickable { /* no-op in stub */ }
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = Color(0xFF6B7280), modifier = Modifier.size(24.dp))
        Spacer(modifier = Modifier.width(16.dp))
        Text(title, color = Color(0xFF374151), fontSize = 16.sp, modifier = Modifier.weight(1f))
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray)
    }
}
