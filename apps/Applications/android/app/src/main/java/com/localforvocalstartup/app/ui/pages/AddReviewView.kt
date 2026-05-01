package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarOutline
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.manager.ReviewManager
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay

val ButtonBlue = Color(0xFF2563EB)
val TextFieldBg = Color(0xFFF9FAFB)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddReviewView(productId: String = "unknown") {
    var rating by remember { mutableStateOf(5) }
    var reviewText by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            SmallTopAppBar(
                title = { Text("Write a Review", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { NavigationManager.goBack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Cancel")
                    }
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color.White)
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
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Rating section
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Rate this product", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.Gray)
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    for (i in 1..5) {
                        IconButton(onClick = { rating = i }, modifier = Modifier.size(36.dp)) {
                            Icon(
                                imageVector = if (i <= rating) Icons.Default.Star else Icons.Outlined.StarOutline,
                                contentDescription = "Star $i",
                                tint = if (i <= rating) Color(0xFFFFCC00) else Color.Gray,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }
                    Text(
                        text = "$rating/5", 
                        fontWeight = FontWeight.Bold, 
                        fontSize = 18.sp, 
                        color = Color(0xFFFFCC00),
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }

            // Comment section
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Write your review", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.Gray)
                
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .background(TextFieldBg, RoundedCornerShape(8.dp))
                        .border(1.dp, Color.Gray.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
                ) {
                    TextField(
                        value = reviewText,
                        onValueChange = { reviewText = it },
                        modifier = Modifier.fillMaxSize().padding(4.dp),
                        colors = TextFieldDefaults.textFieldColors(
                            containerColor = Color.Transparent,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        )
                    )
                }
            }

            if (errorMessage != null) {
                Text(errorMessage!!, color = Color.Red, fontSize = 12.sp)
            }

            Spacer(modifier = Modifier.weight(1f))

            // Submit Button
            Button(
                onClick = {
                    val trimmed = reviewText.trim()
                    if (trimmed.isEmpty()) return@Button

                    coroutineScope.launch {
                        isSubmitting = true
                        errorMessage = null
                        val success = ReviewManager.submitReview(productId = productId, rating = rating, comment = trimmed)
                        isSubmitting = false
                        
                        if (success) {
                            NavigationManager.goBack() // Discard logic identical to iOS presentationMode.wrappedValue.dismiss()
                        } else {
                            errorMessage = "Failed to submit review. Keep it generic."
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ButtonBlue),
                shape = RoundedCornerShape(8.dp),
                enabled = !isSubmitting && reviewText.isNotBlank()
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Submit Review", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
        }
    }
}
