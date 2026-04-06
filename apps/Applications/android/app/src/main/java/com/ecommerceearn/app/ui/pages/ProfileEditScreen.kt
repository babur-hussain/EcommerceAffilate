package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.AuthManager
import kotlinx.coroutines.launch

@Composable
fun ProfileEditScreen(onNavigateBack: () -> Unit) {
    val user = AuthManager.userState.value
    var name by remember { mutableStateOf(user?.name ?: "") }
    var phone by remember { mutableStateOf(user?.phone ?: "") }
    var bio by remember { mutableStateOf("") } // Bio is not in User.kt yet
    var isLoading by remember { mutableStateOf(false) }
    var alertMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    if (alertMessage != null) {
        AlertDialog(
            onDismissRequest = { alertMessage = null },
            title = { Text("Notice") },
            text = { Text(alertMessage!!) },
            confirmButton = {
                TextButton(onClick = { 
                    alertMessage = null
                    if (alertMessage?.contains("successfully") == true) onNavigateBack()
                }) { Text("OK") }
            }
        )
    }

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Cancel", 
                color = Color(0xFF6B7280), 
                fontSize = 16.sp, 
                modifier = Modifier.clickable { onNavigateBack() }.padding(8.dp)
            )
            Spacer(modifier = Modifier.weight(1f))
            Text("Edit Profile", fontSize = 17.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color(0xFF2563EB), strokeWidth = 2.dp)
            } else {
                Text(
                    "Save", 
                    color = Color(0xFF2563EB), 
                    fontWeight = FontWeight.SemiBold, 
                    fontSize = 16.sp, 
                    modifier = Modifier.clickable {
                        scope.launch {
                            try {
                                isLoading = true
                                com.ecommerceearn.app.data.remote.NetworkClient.apiService.updateProfile(
                                    com.ecommerceearn.app.data.remote.UpdateProfileRequest(
                                        name = name,
                                        phone = phone.takeIf { it.isNotBlank() },
                                        bio = bio.takeIf { it.isNotBlank() }
                                    )
                                )
                                isLoading = false
                                alertMessage = "Profile updated successfully"
                            } catch (e: Exception) {
                                isLoading = false
                                alertMessage = "Failed to update profile: ${e.message}"
                            }
                        }
                    }.padding(8.dp)
                )
            }
        }
        Divider(color = Color(0xFFF3F4F6))

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(32.dp)
        ) {
            // Profile Image Section
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Box(contentAlignment = Alignment.BottomEnd) {
                    if (user?.profileImage != null) {
                        AsyncImage(
                            model = user.profileImage,
                            contentDescription = null,
                            modifier = Modifier.size(100.dp).clip(CircleShape),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(100.dp).background(Color(0xFFF3F4F6), CircleShape)) {
                            Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(40.dp), tint = Color(0xFF9CA3AF))
                        }
                    }
                    Box(modifier = Modifier.size(32.dp).background(Color(0xFF2563EB), CircleShape).border(3.dp, Color.White, CircleShape).clickable { }, contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.CameraAlt, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                    }
                }
                Text("Change Profile Photo", fontSize = 15.sp, fontWeight = FontWeight.Medium, color = Color(0xFF2563EB))
            }

            // Form Fields
            Column(verticalArrangement = Arrangement.spacedBy(20.dp), modifier = Modifier.fillMaxWidth()) {
                FormGroup("Full Name") {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Enter your name", color = Color.Gray) },
                        colors = OutlinedTextFieldDefaults.colors(
                            unfocusedBorderColor = Color(0xFFE5E7EB),
                            focusedBorderColor = Color(0xFF2563EB)
                        ),
                        singleLine = true
                    )
                }

                FormGroup("Email Address") {
                    Column(
                        modifier = Modifier.fillMaxWidth().background(Color(0xFFF9FAFB), RoundedCornerShape(8.dp)).border(1.dp, Color(0xFFF3F4F6), RoundedCornerShape(8.dp)).padding(horizontal = 12.dp, vertical = 10.dp)
                    ) {
                        Text(user?.email ?: "", fontSize = 16.sp, color = Color(0xFF9CA3AF))
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Email cannot be changed", fontSize = 12.sp, color = Color(0xFF9CA3AF))
                    }
                }

                FormGroup("Phone Number") {
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Enter phone number", color = Color.Gray) },
                        colors = OutlinedTextFieldDefaults.colors(
                            unfocusedBorderColor = Color(0xFFE5E7EB),
                            focusedBorderColor = Color(0xFF2563EB)
                        ),
                        singleLine = true
                    )
                }

                FormGroup("Bio") {
                    OutlinedTextField(
                        value = bio,
                        onValueChange = { bio = it },
                        modifier = Modifier.fillMaxWidth().height(100.dp),
                        placeholder = { Text("Tell something about yourself", color = Color.Gray) },
                        colors = OutlinedTextFieldDefaults.colors(
                            unfocusedBorderColor = Color(0xFFE5E7EB),
                            focusedBorderColor = Color(0xFF2563EB)
                        )
                    )
                }
            }
        }
    }
}

@Composable
fun FormGroup(label: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        Text(label, fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF374151))
        content()
    }
}
