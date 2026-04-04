package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.AuthManager
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
    var showSuccessAlert by remember { mutableStateOf(false) }
    
    val platforms = listOf("Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "Blog")
    val audienceSizes = listOf("1k - 10k", "10k - 50k", "50k - 500k", "500k+")

    val coroutineScope = rememberCoroutineScope()

    if (showSuccessAlert) {
        AlertDialog(
            onDismissRequest = { 
                showSuccessAlert = false
                onDismiss()
            },
            title = { Text("Success") },
            text = { Text("Your application has been submitted successfully!") },
            confirmButton = {
                TextButton(onClick = { 
                    showSuccessAlert = false
                    onDismiss()
                }) {
                    Text("OK")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Apply", fontSize = 18.sp, fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    TextButton(onClick = onDismiss) {
                        Text("Close", color = Color.Black)
                    }
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF2F2F7)),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Section
            item {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        tint = Color(0xFFE94057),
                        modifier = Modifier.size(40.dp)
                    )
                    Text("Join Creator's Squad", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Text(
                        "Partner with us, share products you love, and earn commissions.",
                        fontSize = 14.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Personal Info
            item {
                Text("Personal Details", fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(bottom = 8.dp, start = 8.dp), color = Color.DarkGray)
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(12.dp)) {
                    Column {
                        OutlinedTextField(
                            value = fullName, onValueChange = { fullName = it },
                            placeholder = { Text("Full Name") },
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(unfocusedBorderColor = Color.Transparent, focusedBorderColor = Color.Transparent)
                        )
                        HorizontalDivider()
                        OutlinedTextField(
                            value = email, onValueChange = { email = it },
                            placeholder = { Text("Email Address") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(unfocusedBorderColor = Color.Transparent, focusedBorderColor = Color.Transparent)
                        )
                        HorizontalDivider()
                        OutlinedTextField(
                            value = phone, onValueChange = { phone = it },
                            placeholder = { Text("Phone Number") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(unfocusedBorderColor = Color.Transparent, focusedBorderColor = Color.Transparent)
                        )
                    }
                }
            }

            // Social Info
            item {
                Text("Social Profile", fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 8.dp, bottom = 8.dp, start = 8.dp), color = Color.DarkGray)
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(12.dp)) {
                    Column {
                        var platformExpanded by remember { mutableStateOf(false) }
                        Box(modifier = Modifier.fillMaxWidth().clickable { platformExpanded = true }.padding(16.dp)) {
                            Text("Primary Platform: $socialPlatform", color = if (socialPlatform.isEmpty()) Color.Gray else Color.Black)
                            DropdownMenu(expanded = platformExpanded, onDismissRequest = { platformExpanded = false }) {
                                platforms.forEach { plat ->
                                    DropdownMenuItem(text = { Text(plat) }, onClick = { socialPlatform = plat; platformExpanded = false })
                                }
                            }
                        }
                        HorizontalDivider()
                        OutlinedTextField(
                            value = socialHandle, onValueChange = { socialHandle = it },
                            placeholder = { Text("Social Handle (@username)") },
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(unfocusedBorderColor = Color.Transparent, focusedBorderColor = Color.Transparent)
                        )
                        HorizontalDivider()
                        
                        var sizeExpanded by remember { mutableStateOf(false) }
                        Box(modifier = Modifier.fillMaxWidth().clickable { sizeExpanded = true }.padding(16.dp)) {
                            Text("Audience Size: ${if(audienceSize.isEmpty()) "Select Range" else audienceSize}", color = if (audienceSize.isEmpty()) Color.Gray else Color.Black)
                            DropdownMenu(expanded = sizeExpanded, onDismissRequest = { sizeExpanded = false }) {
                                audienceSizes.forEach { size ->
                                    DropdownMenuItem(text = { Text(size) }, onClick = { audienceSize = size; sizeExpanded = false })
                                }
                            }
                        }
                        HorizontalDivider()
                        OutlinedTextField(
                            value = niche, onValueChange = { niche = it },
                            placeholder = { Text("Niche / Category") },
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(unfocusedBorderColor = Color.Transparent, focusedBorderColor = Color.Transparent)
                        )
                    }
                }
            }

            // Bio
            item {
                Text("About You", fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 8.dp, bottom = 8.dp, start = 8.dp), color = Color.DarkGray)
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(12.dp)) {
                    OutlinedTextField(
                        value = bio, onValueChange = { bio = it },
                        placeholder = { Text("Tell us a bit about yourself...") },
                        modifier = Modifier.fillMaxWidth().height(100.dp).padding(horizontal = 16.dp, vertical = 8.dp),
                        colors = TextFieldDefaults.outlinedTextFieldColors(unfocusedBorderColor = Color.Transparent, focusedBorderColor = Color.Transparent)
                    )
                }
            }

            // Submit Button
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        isLoading = true
                        coroutineScope.launch {
                            val result = AuthManager.registerInfluencer(
                                name = fullName,
                                email = email,
                                phone = phone,
                                platform = socialPlatform,
                                handle = socialHandle,
                                niche = niche,
                                bio = bio
                            )
                            isLoading = false
                            if (result.isSuccess) {
                                showSuccessAlert = true
                            } else {
                                // optional error handling
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(50.dp).clip(RoundedCornerShape(12.dp)),
                    enabled = !isLoading && fullName.isNotEmpty() && email.isNotEmpty(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent, disabledContainerColor = Color.LightGray),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                if (!isLoading && fullName.isNotEmpty() && email.isNotEmpty()) {
                                    Brush.horizontalGradient(listOf(Color(0xFF8A2387), Color(0xFFE94057)))
                                } else {
                                    Brush.horizontalGradient(listOf(Color.LightGray, Color.LightGray))
                                }
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                        } else {
                            Text("Submit Application", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
