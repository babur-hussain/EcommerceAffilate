package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.data.manager.NavigationManager

@Composable
fun GroceryRowView() {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val fetched = NetworkClient.apiService.getProductsRaw(6).products
            products = fetched
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .padding(vertical = 16.dp)
            .background(safeParseColor("#F9FAFB"))
    ) {
        // Header
        Row(
            modifier = Modifier
                .padding(horizontal = 12.dp)
                .padding(bottom = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Popular Grocery Products for You",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = safeParseColor("#1F2937"),
                maxLines = 2,
                modifier = Modifier.weight(1f)
            )
            
            Box(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(safeParseColor("#1F2937"))
                    .padding(8.dp)
                    .clickable { }
            ) {
                 Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        // Grid
        if (isLoading) {
            Box(modifier = Modifier.height(200.dp).fillMaxWidth(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            Column(
                modifier = Modifier.padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val columns = 3
                val rows = (products.size + columns - 1) / columns
                
                for (i in 0 until rows) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        for (j in 0 until columns) {
                            val index = i * columns + j
                            if (index < products.size) {
                                Box(modifier = Modifier.weight(1f)) {
                                    GroceryProductCard(products[index], onClick = {
                                        NavigationManager.openGroceryProduct(products[index].id)
                                    })
                                }
                            } else {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }

        // More Button
        Box(
            modifier = Modifier.fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier
                    .padding(top = 16.dp)
                    .background(Color.White, RoundedCornerShape(20.dp))
                    .border(1.dp, safeParseColor("#E5E7EB"), RoundedCornerShape(20.dp))
                    .clickable { }
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Should contain "Arrow Down" icon ideally
                Text(
                    text = "More below",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = safeParseColor("#2563EB")
                )
            }
        }
    }
}

