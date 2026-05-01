package com.localforvocalstartup.app.ui.pages

import androidx.compose.runtime.Composable
import com.localforvocalstartup.app.ui.components.MyOrdersScreen
import com.localforvocalstartup.app.data.manager.NavigationManager

@Composable
fun MyOrdersView() {
    MyOrdersScreen(onBackClick = { NavigationManager.navigate("account") })
}
