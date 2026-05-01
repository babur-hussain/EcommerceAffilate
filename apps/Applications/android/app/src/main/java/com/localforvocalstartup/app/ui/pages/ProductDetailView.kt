package com.localforvocalstartup.app.ui.pages

import androidx.compose.runtime.Composable
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.ui.components.ProductDetailScreen
import com.localforvocalstartup.app.data.manager.NavigationManager

@Composable
fun ProductDetailView(
    productId: String,
    productFragment: Product? = null,
    onBackClick: () -> Unit = { NavigationManager.navigate("home") }
) {
    ProductDetailScreen(
        productId = productId,
        initialProduct = productFragment,
        onBackClick = onBackClick,
        onCartClick = { NavigationManager.navigate("cart") }
    )
}
