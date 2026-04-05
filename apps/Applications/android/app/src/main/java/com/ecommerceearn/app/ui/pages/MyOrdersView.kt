package com.ecommerceearn.app.ui.pages

import androidx.compose.runtime.Composable
import com.ecommerceearn.app.ui.components.MyOrdersScreen
import com.ecommerceearn.app.data.manager.NavigationManager

@Composable
fun MyOrdersView() {
    MyOrdersScreen(onBackClick = { NavigationManager.navigate("account") })
}
