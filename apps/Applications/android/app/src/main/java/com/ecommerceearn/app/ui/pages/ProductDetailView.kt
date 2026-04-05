package com.ecommerceearn.app.ui.pages

import androidx.compose.runtime.Composable
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.ui.components.ProductDetailScreen
import com.ecommerceearn.app.data.manager.NavigationManager

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
