package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Window
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.ecommerceearn.app.data.manager.NavigationManager
import com.ecommerceearn.app.data.manager.OverlayDestination
import com.ecommerceearn.app.data.manager.TabType
import com.ecommerceearn.app.utils.AppTheme
import com.ecommerceearn.app.ui.home.HomeHeaderWithContent

@Composable
fun ContentView() {
    val currentTab by NavigationManager.activeTab.collectAsState()
    val activeOverlay by NavigationManager.activeOverlay.collectAsState()

    Scaffold(
        bottomBar = {
            if (currentTab != TabType.GROCERY) {
                NavigationBar(
                    containerColor = Color.White.copy(alpha = 0.9f),
                    contentColor = AppTheme.Colors.primary
                ) {
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                        label = { Text("Home") },
                        selected = currentTab == TabType.SHOPPING,
                        onClick = { NavigationManager.navigate("shopping") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = AppTheme.Colors.primary,
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = AppTheme.Colors.primary,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color.Transparent
                        )
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Window, contentDescription = "Services") },
                        label = { Text("Services") },
                        selected = currentTab == TabType.SERVICES,
                        onClick = { NavigationManager.navigate("services") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = AppTheme.Colors.primary,
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = AppTheme.Colors.primary,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color.Transparent
                        )
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.ShoppingCart, contentDescription = "Cart") },
                        label = { Text("Cart") },
                        selected = false,
                        onClick = { },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = AppTheme.Colors.primary,
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = AppTheme.Colors.primary,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color.Transparent
                        )
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Person, contentDescription = "Account") },
                        label = { Text("Account") },
                        selected = false,
                        onClick = { },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = AppTheme.Colors.primary,
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = AppTheme.Colors.primary,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color.Transparent
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF3F4F6))
        ) {
            when (currentTab) {
                TabType.SHOPPING -> HomeTabContent()
                TabType.SERVICES -> Text("Services Page")
                TabType.GROCERY -> Text("Grocery Page")
                TabType.INFLUENCERS -> Text("Influencers Page")
            }
        }

        if (activeOverlay != null) {
            OverlayRouterView(destination = activeOverlay!!)
        }
    }
}

@Composable
fun HomeTabContent() {
    HomeHeaderWithContent()
}

@Composable
fun OverlayRouterView(destination: OverlayDestination) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        when (destination) {
            OverlayDestination.BEAUTY -> Text("Beauty Overlay")
            OverlayDestination.SPECIAL_DEAL -> Text("Special Deal Overlay")
            OverlayDestination.SHOES_SALES -> Text("Shoes Sales Overlay")
            OverlayDestination.CATEGORY_PAGE -> Text("Category Route Overlay")
            else -> Text("Other Routing Overlay")
        }
    }
}
