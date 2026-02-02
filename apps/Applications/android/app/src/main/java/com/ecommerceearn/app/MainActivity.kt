package com.ecommerceearn.app

import android.Manifest
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.ecommerceearn.app.ui.components.BottomNavigationBar
import com.ecommerceearn.app.ui.components.MainTab
import com.ecommerceearn.app.ui.home.HomeHeaderWithContent
import com.ecommerceearn.app.ui.components.CategoriesScreen
import com.ecommerceearn.app.ui.components.CartScreen
import com.ecommerceearn.app.ui.components.ProfileScreen
import com.ecommerceearn.app.ui.components.ProductDetailScreen
import com.ecommerceearn.app.data.manager.CartManager
import com.ecommerceearn.app.data.model.Product

// App-level navigation state holder
object AppNavigation {
    var selectedProductId: String? = null
    var selectedProduct: Product? = null
    
    fun navigateToProduct(productId: String, product: Product? = null) {
        selectedProductId = productId
        selectedProduct = product
    }
    
    fun clearProductDetail() {
        selectedProductId = null
        selectedProduct = null
    }
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                // Runtime Permission Request
                val locationPermissionLauncher = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.RequestMultiplePermissions()
                ) { permissions ->
                    // Permissions handled (accepted or denied)
                }

                SideEffect {
                    locationPermissionLauncher.launch(
                        arrayOf(
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        )
                    )
                }

                // Main Content with Bottom Navigation
                var currentTab by remember { mutableStateOf(MainTab.Home) }
                var showProductDetail by remember { mutableStateOf(false) }
                var selectedProductId by remember { mutableStateOf<String?>(null) }
                var selectedProduct by remember { mutableStateOf<Product?>(null) }

                val cartState by CartManager.cartState.collectAsState()

                // Check if we should show product detail
                if (showProductDetail && selectedProductId != null) {
                    ProductDetailScreen(
                        productId = selectedProductId!!,
                        initialProduct = selectedProduct,
                        onBackClick = {
                            showProductDetail = false
                            selectedProductId = null
                            selectedProduct = null
                        },
                        onCartClick = {
                            showProductDetail = false
                            currentTab = MainTab.Cart
                        }
                    )
                } else {
                    Scaffold(
                        modifier = Modifier.fillMaxSize(),
                        bottomBar = {
                            BottomNavigationBar(
                                currentTab = currentTab,
                                onTabSelected = { currentTab = it },
                                cartCount = CartManager.getCount()
                            )
                        },
                        containerColor = MaterialTheme.colorScheme.background
                    ) { innerPadding ->
                        val contentPadding = if (currentTab == MainTab.Home) {
                            innerPadding.calculateBottomPadding()
                            androidx.compose.foundation.layout.PaddingValues(bottom = innerPadding.calculateBottomPadding())
                        } else {
                            innerPadding
                        }

                        Box(modifier = Modifier.padding(contentPadding)) {
                            when (currentTab) {
                                MainTab.Home -> HomeHeaderWithContent(
                                    onProductClick = { product ->
                                        selectedProductId = product.id
                                        selectedProduct = product
                                        showProductDetail = true
                                    }
                                )
                                MainTab.Categories -> CategoriesScreen(
                                    onProductClick = { product ->
                                        selectedProductId = product.id
                                        selectedProduct = product
                                        showProductDetail = true
                                    }
                                )
                                MainTab.Cart -> CartScreen(onBackClick = { currentTab = MainTab.Home })
                                MainTab.Account -> ProfileScreen()
                                else -> {
                                    Box(
                                        modifier = Modifier.fillMaxSize(),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("Content for ${currentTab.title}")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

