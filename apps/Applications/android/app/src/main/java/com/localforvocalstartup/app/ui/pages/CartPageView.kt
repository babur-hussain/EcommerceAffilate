package com.localforvocalstartup.app.ui.pages

import androidx.compose.runtime.Composable
import com.localforvocalstartup.app.ui.components.CartScreen
import com.localforvocalstartup.app.data.manager.NavigationManager

@Composable
fun CartPageView() {
    CartScreen(onBackClick = { NavigationManager.navigate("home") })
}
