package com.localforvocalstartup.app.ui.pages

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
import androidx.compose.ui.zIndex
import com.localforvocalstartup.app.data.manager.NavigationManager
import com.localforvocalstartup.app.data.manager.OverlayDestination
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.manager.MainTab
import com.localforvocalstartup.app.utils.AppTheme
import com.localforvocalstartup.app.ui.home.HomeHeaderWithContent
import com.localforvocalstartup.app.ui.pages.BrandNewArrivalView
import com.localforvocalstartup.app.ui.pages.CyberSaleView
import com.localforvocalstartup.app.ui.pages.SpecialDealNewStyleView
import com.localforvocalstartup.app.ui.pages.MenFashionView
import com.localforvocalstartup.app.ui.pages.GrandMobilesView
import com.localforvocalstartup.app.ui.pages.PlusMembershipView
import com.localforvocalstartup.app.ui.pages.PaymentView
import com.localforvocalstartup.app.ui.pages.ProfileEditScreen
import com.localforvocalstartup.app.ui.pages.InfluencerRegistrationSheet
import com.localforvocalstartup.app.ui.components.SDUIPage

@Composable
fun ContentView() {
    val currentTab by NavigationManager.activeTab.collectAsState()
    val activeOverlay by NavigationManager.activeOverlay.collectAsState()
    val isGroceryTabActive by NavigationManager.isGroceryTabActive.collectAsState()
    val isServicesTabActive by NavigationManager.isServicesTabActive.collectAsState()
    val isInfluencersTabActive by NavigationManager.isInfluencersTabActive.collectAsState()
    val productId by NavigationManager.productId.collectAsState()
    val groceryProductId by NavigationManager.groceryProductId.collectAsState()

    val canGoBack = productId != null || 
                    groceryProductId != null || 
                    activeOverlay != null || 
                    currentTab != MainTab.HOME

    androidx.activity.compose.BackHandler(enabled = canGoBack) {
        when {
            productId != null -> NavigationManager.dismissProduct()
            groceryProductId != null -> NavigationManager.dismissGroceryProduct()
            activeOverlay != null -> NavigationManager.goBack()
            currentTab != MainTab.HOME -> NavigationManager.navigate("home")
        }
    }

    Scaffold(
        contentWindowInsets = WindowInsets(0.dp),
        containerColor = Color.White,
        bottomBar = {
            if (activeOverlay == null && productId == null && groceryProductId == null && 
                !(currentTab == MainTab.HOME && (isGroceryTabActive || isServicesTabActive || isInfluencersTabActive))) {
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
        val isShoppingTab = currentTab == MainTab.HOME && 
            !isGroceryTabActive && 
            !isServicesTabActive && 
            !isInfluencersTabActive
            
        val shouldDrawBehindStatusBar = (isShoppingTab && activeOverlay == null && productId == null && groceryProductId == null) || activeOverlay == OverlayDestination.CATEGORY_PAGE
        
        val baseModifier = Modifier
            .fillMaxSize()
            .padding(bottom = paddingValues.calculateBottomPadding())

        val containerModifier = if (shouldDrawBehindStatusBar) {
            baseModifier
        } else {
            baseModifier.statusBarsPadding()
        }

        Box(
            modifier = containerModifier
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFF3F4F6))
            ) {
                when (currentTab) {
                    MainTab.HOME -> HomeTabContent(
                        onProductClick = { product: Product ->
                            val safeId = if (product.id.isNullOrBlank()) "not_found" else product.id
                            NavigationManager.navigate("product/$safeId")
                        }
                    )
                    MainTab.CATEGORIES -> CategoriesPageView(
                        onProductClick = { product: Product ->
                            val safeId = if (product.id.isNullOrBlank()) "not_found" else product.id
                            NavigationManager.navigate("product/$safeId")
                        }
                    )
                    MainTab.CART -> CartPageView()
                    MainTab.ACCOUNT -> AccountView()
                }
            }

            if (activeOverlay != null) {
                OverlayRouterView(destination = activeOverlay!!)
            }
            
            productId?.let { id ->
                ProductDetailView(
                    productId = id,
                    onBackClick = { NavigationManager.dismissProduct() }
                )
            }

            groceryProductId?.let { id ->
                com.localforvocalstartup.app.ui.pages.GroceryProductDetailView(
                    productId = id,
                    onBack = { NavigationManager.dismissGroceryProduct() }
                )
            }
        }
    }
}

@Composable
fun HomeTabContent(onProductClick: (Product) -> Unit = {}) {
    HomeHeaderWithContent(onProductClick = onProductClick)
}

@Composable
fun OverlayRouterView(destination: OverlayDestination) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        when (destination) {
            OverlayDestination.BEAUTY -> BeautyProductView()
            OverlayDestination.SPECIAL_DEAL -> SpecialDealNewStyleView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.BRAND_NEW_ARRIVAL -> BrandNewArrivalView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.MEN_FASHION -> MenFashionView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.GRAND_MOBILES -> GrandMobilesView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.CYBER_SALE -> CyberSaleView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.SHOES_SALES -> ShoesSalesView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.CATEGORY_PAGE -> {
                val navParams by NavigationManager.categoryNavigation.collectAsState()
                com.localforvocalstartup.app.ui.pages.CategoryProductsListView(
                    categoryId = navParams?.categoryId,
                    subCategoryIds = navParams?.subCategoryId?.let { listOf(it) } ?: emptyList(),
                    isGrocery = navParams?.layoutType == "grocery",
                    title = navParams?.categoryName ?: "Products"
                )
            }
            OverlayDestination.LOCATION_PICKER -> LocationPickerView()
            OverlayDestination.PLUS_MEMBERSHIP -> PlusMembershipView(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.PAYMENT -> PaymentView(
                totalAmount = 999.0,
                discount = 100.0,
                _itemCount = 2,
                onBack = { NavigationManager.goBack() },
                onPaymentSelect = { NavigationManager.goBack() },
                isLoading = false
            )
            OverlayDestination.CHECKOUT -> {
                val cartItems by com.localforvocalstartup.app.data.manager.CartManager.items.collectAsState()
                val checkoutItems = cartItems.map {
                    com.localforvocalstartup.app.ui.viewmodel.CheckoutItem(
                        product = it.product,
                        quantity = it.quantity,
                        selectedOfferIds = emptyList()
                    )
                }
                val checkoutViewModel = remember { com.localforvocalstartup.app.ui.viewmodel.CheckoutViewModel(checkoutItems) }
                Box(modifier = Modifier.fillMaxSize().zIndex(10f)) {
                    com.localforvocalstartup.app.ui.pages.CheckoutView(
                        viewModel = checkoutViewModel,
                        onBack = { NavigationManager.goBack() }
                    )
                }
            }
            OverlayDestination.GROCERY_CHECKOUT -> {
                val basketItems by com.localforvocalstartup.app.data.manager.BasketManager.items.collectAsState()
                val checkoutViewModel = remember { com.localforvocalstartup.app.ui.viewmodel.GroceryCheckoutViewModel(basketItems) }
                Box(modifier = Modifier.fillMaxSize().zIndex(10f)) {
                    com.localforvocalstartup.app.ui.pages.GroceryCheckoutView(
                        viewModel = checkoutViewModel,
                        onBack = { NavigationManager.goBack() }
                    )
                }
            }
            OverlayDestination.PROFILE_EDIT -> ProfileEditScreen(onNavigateBack = { NavigationManager.goBack() })
            OverlayDestination.INFLUENCER_REGISTRATION -> InfluencerRegistrationSheet(onDismiss = { NavigationManager.goBack() })

        }
    }
}
