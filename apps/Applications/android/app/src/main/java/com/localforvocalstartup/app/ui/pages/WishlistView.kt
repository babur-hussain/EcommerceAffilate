package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.manager.WishlistManager
import com.localforvocalstartup.app.ui.components.ProductCardView

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WishlistView(onDismiss: (() -> Unit)? = null) {
    val wishlistItems by WishlistManager.wishlistItems.collectAsState()
    val isLoading by WishlistManager.isLoading.collectAsState()
    val error by WishlistManager.error.collectAsState()

    LaunchedEffect(Unit) {
        WishlistManager.fetchWishlist()
    }

    Scaffold(
        topBar = {
            SmallTopAppBar(
                title = { Text("My Wishlist", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { 
                        if (onDismiss != null) onDismiss() else NavigationManager.navigate("account") 
                    }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = Color(0xFFF3F4F6)
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            when {
                isLoading && wishlistItems.isEmpty() -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                error != null && wishlistItems.isEmpty() -> {
                    Text(text = error!!, color = Color.Red, modifier = Modifier.align(Alignment.Center))
                }
                wishlistItems.isEmpty() -> {
                    Text(
                        text = "Your Wishlist is Empty",
                        color = Color.Gray,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                else -> {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        contentPadding = PaddingValues(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(wishlistItems) { product ->
                            ProductCardView(
                                product = product,
                                onClick = { NavigationManager.openGroceryProduct(product.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}
