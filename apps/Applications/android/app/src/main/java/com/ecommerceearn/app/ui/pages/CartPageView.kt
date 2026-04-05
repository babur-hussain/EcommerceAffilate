package com.ecommerceearn.app.ui.pages

import androidx.compose.runtime.Composable
import com.ecommerceearn.app.ui.components.CartScreen
import com.ecommerceearn.app.data.manager.NavigationManager

@Composable
fun CartPageView() {
    CartScreen(onBackClick = { NavigationManager.navigate("home") })
}
