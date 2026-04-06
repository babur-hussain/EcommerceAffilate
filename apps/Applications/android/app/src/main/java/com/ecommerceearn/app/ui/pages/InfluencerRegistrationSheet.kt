package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InfluencerRegistrationSheet(onDismiss: () -> Unit) {
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var socialPlatform by remember { mutableStateOf("Instagram") }
    var socialHandle by remember { mutableStateOf("") }
    var audienceSize by remember { mutableStateOf("") }
    var niche by remember { mutableStateOf("") }
    var bio by remember { mutableStateOf("") }
    
    var isLoading by remember { mutableStateOf(false) }
    var showSuccess by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()
    
    var platformExpanded by remember { mutableStateOf(false) }
    var audienceExpanded by remember { mutableStateOf(false) }

    val platforms = listOf("Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "Blog")
    val audienceSizes = listOf("1k - 10k", "10k - 50k", "50k - 500k", "500k+")

    if (showSuccess) {
        AlertDialog(
            onDismissRequest = { showSuccess = false },
            title = { Text("Success") },
            text = { Text("Your application has been submitted successfully!") },
            confirmButton = {
                TextButton(onClick = { showSuccess = false; onDismiss() }) { Text("OK") }
            }
        )
    }

    if (errorMessage != null) {
        AlertDialog(
            onDismissRequest = { errorMessage = null },
            title = { Text("Error") },
            text = { Text(errorMessage!!) },
            confirmButton = { TextButton(onClick = { errorMessage = null }) { Text("OK") } }
        )
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6))) {
        // Appbar
        TopAppBar(
            title = { Text("Apply", fontWeight = FontWeight.Medium) },
            navigationIcon = {
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "Close")
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF3F4F6))
        )

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            // Header
            Column(
                modifier = Modifier.fillMaxWidth().padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.Stars, contentDescription = null, tint = Color(0xFFE94057), modifier = Modifier.size(40.dp))
                Text("Join Creator's Squad", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("Partner with us, share products you love, and earn commissions.", fontSize = 12.sp, color = Color.Gray, textAlign = TextAlign.Center)
            }

            // Cards section
            Card(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Personal Details", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    OutlinedTextField(value = fullName, onValueChange = { fullName = it }, label = { Text("Full Name") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email Address") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Phone Number") }, modifier = Modifier.fillMaxWidth())
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Social Profile", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    
                    ExposedDropdownMenuBox(expanded = platformExpanded, onExpandedChange = { platformExpanded = it }) {
                        OutlinedTextField(
                            value = socialPlatform,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Primary Platform") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = platformExpanded) },
                            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
                            modifier = Modifier.menuAnchor().fillMaxWidth()
                        )
                        ExposedDropdownMenu(expanded = platformExpanded, onDismissRequest = { platformExpanded = false }) {
                            platforms.forEach { selectionOption ->
                                DropdownMenuItem(
                                    text = { Text(selectionOption) },
                                    onClick = { socialPlatform = selectionOption; platformExpanded = false }
                                )
                            }
                        }
                    }

                    OutlinedTextField(value = socialHandle, onValueChange = { socialHandle = it }, label = { Text("Social Handle (@username)") }, modifier = Modifier.fillMaxWidth())

                    ExposedDropdownMenuBox(expanded = audienceExpanded, onExpandedChange = { audienceExpanded = it }) {
                        OutlinedTextField(
                            value = audienceSize,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Audience Size") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = audienceExpanded) },
                            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
                            modifier = Modifier.menuAnchor().fillMaxWidth()
                        )
                        ExposedDropdownMenu(expanded = audienceExpanded, onDismissRequest = { audienceExpanded = false }) {
                            audienceSizes.forEach { selectionOption ->
                                DropdownMenuItem(
                                    text = { Text(selectionOption) },
                                    onClick = { audienceSize = selectionOption; audienceExpanded = false }
                                )
                            }
                        }
                    }

                    OutlinedTextField(value = niche, onValueChange = { niche = it }, label = { Text("Niche / Category") }, modifier = Modifier.fillMaxWidth())
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("About You", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    OutlinedTextField(value = bio, onValueChange = { bio = it }, modifier = Modifier.fillMaxWidth().height(100.dp))
                }
            }

            Box(modifier = Modifier.padding(16.dp).fillMaxWidth().padding(bottom = 32.dp)) {
                Button(
                    onClick = {
                        scope.launch {
                            try {
                                isLoading = true
                                com.ecommerceearn.app.data.remote.NetworkClient.apiService.applyCreator(
                                    com.ecommerceearn.app.data.remote.CreatorApplicationRequest(
                                        fullName = fullName,
                                        email = email,
                                        phone = phone,
                                        socialPlatform = socialPlatform,
                                        socialHandle = socialHandle,
                                        audienceSize = audienceSize,
                                        niche = niche,
                                        bio = bio
                                    )
                                )
                                isLoading = false
                                showSuccess = true
                            } catch (e: Exception) {
                                isLoading = false
                                errorMessage = "Failed to submit application: ${e.message}"
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    enabled = !isLoading && fullName.isNotEmpty() && email.isNotEmpty(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    contentPadding = PaddingValues()
                ) {
                    Box(modifier = Modifier.fillMaxSize().background(
                        Brush.horizontalGradient(listOf(Color(0xFF8A2387), Color(0xFFE94057))),
                        RoundedCornerShape(25.dp)
                    ), contentAlignment = Alignment.Center) {
                        if (isLoading) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                        } else {
                            Text("Submit Application", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
