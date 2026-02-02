package com.ecommerceearn.app.ui.components

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.AdvancedLayoutResponse
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.remote.NetworkClient

private const val TAG = "SDUIPage"

/**
 * SDUIPage that fetches and renders an advanced layout by slug.
 * Note: When used inside a LazyColumn, do NOT wrap in a scrollable container.
 * The parent LazyColumn will handle scrolling.
 */
@Composable
fun SDUIPage(
    slug: String,
    onProductClick: (Product) -> Unit = {}
) {
    var layout by remember { mutableStateOf<AdvancedLayoutResponse?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(slug) {
        isLoading = true
        errorMessage = null
        Log.d(TAG, "Fetching layout for slug: $slug")
        try {
            val response = NetworkClient.apiService.getLayoutBySlug(slug)
            Log.d(TAG, "Received layout: ${response.name}, components: ${response.components.size}")
            response.components.forEach { comp ->
                Log.d(TAG, "  Component: type=${comp.type}, id=${comp.id}")
            }
            layout = response
        } catch (e: Exception) {
            errorMessage = "${e.javaClass.simpleName}: ${e.message ?: "Failed to load page"}"
            Log.e(TAG, "Error loading layout for $slug", e)
        } finally {
            isLoading = false
        }
    }

    // Since this is usually placed inside a LazyColumn item, we should NOT use fillMaxSize or verticalScroll.
    // Instead, render components directly in a Column and let parent handle scrolling.
    
    if (isLoading) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
    } else if (errorMessage != null) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Error loading '$slug'",
                    color = Color.Red,
                    fontSize = 16.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = errorMessage ?: "Unknown error",
                    color = Color.Gray,
                    fontSize = 12.sp
                )
            }
        }
    } else if (layout == null || layout?.components.isNullOrEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No content available for '$slug'",
                color = Color.Gray,
                fontSize = 14.sp
            )
        }
    } else {
        // Render all components inline (parent handles scroll)
        Column(modifier = Modifier.fillMaxWidth()) {
            layout!!.components.forEach { component ->
                SDUIRenderer(component, onProductClick)
            }
        }
    }
}
