package com.ecommerceearn.app.ui.pages

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.NavigationManager
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.data.model.CreateStoryRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID

val UploadShopPrimary = Color(0xFFBD0F58)

@Composable
fun StoryUploadView() {
    val context = LocalContext.current
    var selectedMediaUri by remember { mutableStateOf<Uri?>(null) }
    var mimeType by remember { mutableStateOf("") }
    var isUploading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    val pickMedia = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) {
            selectedMediaUri = uri
            mimeType = context.contentResolver.getType(uri) ?: "image/jpeg"
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color.Black)) {
        if (selectedMediaUri == null) {
            // Placeholder
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(UploadShopPrimary, Color(0xFFFFA500))
                            )
                        )
                        .clickable {
                            pickMedia.launch(
                                androidx.activity.result.PickVisualMediaRequest(
                                    ActivityResultContracts.PickVisualMedia.ImageAndVideo
                                )
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Add,
                        contentDescription = "Upload",
                        tint = Color.White,
                        modifier = Modifier.size(32.dp)
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    "Share a Moment",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    "Tap to pick a photo or video",
                    color = Color.LightGray,
                    fontSize = 14.sp
                )
            }
            
            // Back button
            IconButton(
                onClick = { NavigationManager.navigate("account") },
                modifier = Modifier.padding(top = 40.dp, start = 16.dp).background(Color.Black.copy(alpha = 0.5f), CircleShape)
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
        } else {
            // Preview View
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                AsyncImage(
                    model = selectedMediaUri,
                    contentDescription = "Preview",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize()
                )

                // Overlays
                if (isUploading) {
                    Box(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.6f)), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator(color = Color.White)
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("Uploading...", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                } else {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .align(Alignment.BottomCenter)
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Cancel Button
                        IconButton(
                            onClick = { selectedMediaUri = null },
                            modifier = Modifier.size(50.dp).background(Color.DarkGray.copy(alpha=0.8f), CircleShape)
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Cancel", tint=Color.White, modifier=Modifier.size(24.dp))
                        }

                        // Upload Button
                        Button(
                            onClick = {
                                coroutineScope.launch {
                                    isUploading = true
                                    errorMessage = null
                                    try {
                                        val ext = if (mimeType.contains("video")) "mp4" else "jpeg"
                                        val mediaType = if (mimeType.contains("video")) "video" else "image"
                                        val fileName = "story_${UUID.randomUUID()}.$ext"
                                        
                                        // 1. Get Presigned URL
                                        val response = NetworkClient.apiService.getPresignedUrl(fileName, mimeType)
                                        if (response.success) {
                                            // 2. Read bytes
                                            val bytes = withContext(Dispatchers.IO) {
                                                context.contentResolver.openInputStream(selectedMediaUri!!)?.readBytes()
                                            } ?: throw Exception("Could not read file")
                                            
                                            // 3. Upload to S3
                                            withContext(Dispatchers.IO) {
                                                val connection = URL(response.data.uploadUrl).openConnection() as HttpURLConnection
                                                connection.requestMethod = "PUT"
                                                connection.setRequestProperty("Content-Type", mimeType)
                                                connection.doOutput = true
                                                connection.outputStream.use { it.write(bytes) }
                                                
                                                if (connection.responseCode !in 200..299) {
                                                    throw Exception("S3 upload failed: ${connection.responseCode}")
                                                }
                                            }
                                            
                                            // 4. Create Story record
                                            val createReq = CreateStoryRequest(
                                                mediaUrl = response.data.fileUrl,
                                                mediaType = mediaType
                                            )
                                            NetworkClient.apiService.createStoryRecord(createReq)
                                            
                                            NavigationManager.navigate("account")
                                        } else {
                                            errorMessage = "Failed to get upload url"
                                        }
                                    } catch (e: Exception) {
                                        errorMessage = e.message ?: "Upload failed"
                                    } finally {
                                        isUploading = false
                                    }
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = UploadShopPrimary),
                            shape = RoundedCornerShape(25.dp),
                            modifier = Modifier.height(50.dp).padding(start = 16.dp).weight(1f)
                        ) {
                            Text("Share Story", color=Color.White, fontWeight=FontWeight.Bold, fontSize=16.sp)
                        }
                    }

                    if (errorMessage != null) {
                        Text(
                            errorMessage!!,
                            color = Color.Red,
                            modifier = Modifier.align(Alignment.TopCenter).padding(top = 80.dp)
                        )
                    }
                }
            }
        }
    }
}
