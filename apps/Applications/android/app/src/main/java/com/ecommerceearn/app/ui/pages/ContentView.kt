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
import androidx.compose.ui.unit.dp
import com.ecommerceearn.app.data.manager.NavigationManager
import com.ecommerceearn.app.data.manager.OverlayDestination
import com.ecommerceearn.app.data.manager.MainTab
import com.ecommerceearn.app.utils.AppTheme
import com.ecommerceearn.app.ui.home.HomeHeaderWithContent
import com.ecommerceearn.app.ui.pages.BrandNewArrivalView
import com.ecommerceearn.app.ui.pages.CyberSaleView
import com.ecommerceearn.app.ui.pages.SpecialDealNewStyleView
import com.ecommerceearn.app.ui.pages.MenFashionView
import com.ecommerceearn.app.ui.pages.GrandMobilesView
import com.ecommerceearn.app.ui.pages.PlusMembershipView
import com.ecommerceearn.app.ui.pages.PaymentView
import com.ecommerceearn.app.ui.pages.ProfileEditScreen
import com.ecommerceearn.app.ui.pages.InfluencerRegistrationSheet
import com.ecommerceearn.app.ui.components.SDUIPage

@Composable
fun ContentView() {
    val currentTab by NavigationManager.activeTab.collectAsState()
    val activeOverlay by NavigationManager.activeOverlay.collectAsState()
    val isGroceryTabActive by NavigationManager.isGroceryTabActive.collectAsState()
    val isServicesTabActive by NavigationManager.isServicesTabActive.collectAsState()
    val isInfluencersTabActive by NavigationManager.isInfluencersTabActive.collectAsState()

    Scaffold(
        bottomBar = {
            if (!(currentTab == MainTab.HOME && (isGroceryTabActive || isServicesTabActive || isInfluencersTabActive))) {
                NavigationBar(
                    modifier = Modifier.height(65.dp),
                    windowInsets = WindowInsets(0, 0, 0, 0),
                    containerColor = Color.White.copy(alpha = 0.9f),
                    contentColor = AppTheme.Colors.primary
                ) {
                    NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    selected = currentTab == MainTab.HOME,
                    onClick = { NavigationManager.navigate("home") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = AppTheme.Colors.primary,
                        unselectedIconColor = Color.Gray,
                        selectedTextColor = AppTheme.Colors.primary,
                        unselectedTextColor = Color.Gray,
                        indicatorColor = Color.Transparent
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Window, contentDescription = "Categories") },
                    label = { Text("Categories") },
                    selected = currentTab == MainTab.CATEGORIES,
                    onClick = { NavigationManager.navigate("categories") },
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
                    selected = currentTab == MainTab.CART,
                    onClick = { NavigationManager.navigate("cart") },
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
                    selected = currentTab == MainTab.ACCOUNT,
                    onClick = { NavigationManager.navigate("account") },
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
                MainTab.HOME -> HomeTabContent()
                MainTab.CATEGORIES -> CategoriesPageView()
                MainTab.CART -> CartPageView()
                MainTab.ACCOUNT -> AccountView()
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
            OverlayDestination.BEAUTY -> SDUIPage(slug = "beauty-page", onProductClick = { NavigationManager.navigate("product/${it.id}") })
            OverlayDestination.SPECIAL_DEAL -> SpecialDealNewStyleView()
            OverlayDestination.BRAND_NEW_ARRIVAL -> BrandNewArrivalView()
            OverlayDestination.MEN_FASHION -> MenFashionView()
            OverlayDestination.GRAND_MOBILES -> GrandMobilesView()
            OverlayDestination.CYBER_SALE -> CyberSaleView()
            OverlayDestination.SHOES_SALES -> SDUIPage(slug = "footwear-collection", onProductClick = { NavigationManager.navigate("product/${it.id}") })
            OverlayDestination.CATEGORY_PAGE -> Text("Category Route Overlay")
            OverlayDestination.LOCATION_PICKER -> LocationPickerView()
            OverlayDestination.PLUS_MEMBERSHIP -> PlusMembershipView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.PAYMENT -> PaymentView(
                totalAmount = 999.0,
                discount = 100.0,
                itemCount = 2,
                onBack = { NavigationManager.goBack() },
                onPaymentSelect = { NavigationManager.goBack() },
                isLoading = false
            )
            OverlayDestination.PROFILE_EDIT -> ProfileEditScreen(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.INFLUENCER_REGISTRATION -> InfluencerRegistrationSheet(onDismiss = { NavigationManager.goBack() })
            else -> Text("Other Routing Overlay")
        }
    }
}
