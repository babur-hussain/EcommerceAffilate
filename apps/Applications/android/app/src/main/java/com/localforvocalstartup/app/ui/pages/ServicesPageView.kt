package com.localforvocalstartup.app.ui.pages

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.localforvocalstartup.app.data.model.ServiceCategoryModel
import com.localforvocalstartup.app.data.model.ServiceSubCategoryModel
import com.localforvocalstartup.app.ui.home.TabType
import com.localforvocalstartup.app.ui.home.TopCategoryBoxesView
import com.localforvocalstartup.app.ui.home.LocationBarView
import com.localforvocalstartup.app.ui.home.LocationViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.background
import androidx.compose.ui.graphics.Color

enum class ServicesRoute {
    HOME,
    SUB_CATEGORY,
    PROVIDERS,
    PROVIDER_DETAIL
}

@Composable
fun ServicesPageView(
    onOuterTabSelected: (TabType) -> Unit = {}
) {
    var currentRoute by remember { mutableStateOf(ServicesRoute.HOME) }
    
    var selectedCategory by remember { mutableStateOf<ServiceCategoryModel?>(null) }
    var selectedSubCategory by remember { mutableStateOf<ServiceSubCategoryModel?>(null) }
    var selectedCategoryName by remember { mutableStateOf("") }
    var selectedProviderId by remember { mutableStateOf("") }

    val locationViewModel: LocationViewModel = viewModel()
    val locationState by locationViewModel.locationState.collectAsState()
    
    val savedAddresses by com.localforvocalstartup.app.data.manager.AddressManager.savedAddresses.collectAsState()
    val selectedAddress by com.localforvocalstartup.app.data.manager.AddressManager.selectedAddress.collectAsState()
    var showAddressSheet by remember { mutableStateOf(false) }
    val context = androidx.compose.ui.platform.LocalContext.current

    BackHandler(enabled = currentRoute != ServicesRoute.HOME) {
        when (currentRoute) {
            ServicesRoute.SUB_CATEGORY -> currentRoute = ServicesRoute.HOME
            ServicesRoute.PROVIDERS -> currentRoute = ServicesRoute.SUB_CATEGORY
            ServicesRoute.PROVIDER_DETAIL -> currentRoute = ServicesRoute.PROVIDERS
            else -> {}
        }
    }

    val headerContent: @Composable () -> Unit = {
        Column(modifier = Modifier.fillMaxWidth().statusBarsPadding().background(Color(0xFFF9FAFB))) {
            TopCategoryBoxesView(
                activeTab = TabType.Services,
                onTabSelected = onOuterTabSelected
            )
            LocationBarView(
                selectedAddress = selectedAddress,
                locationState = locationState,
                isLightMode = true,
                onRequestLocation = { showAddressSheet = true }
            )
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        when (currentRoute) {
            ServicesRoute.HOME -> {
                ServicesHomeView(
                    headerContent = headerContent,
                    onNavigateToSubCategory = { category ->
                        selectedCategory = category
                        currentRoute = ServicesRoute.SUB_CATEGORY
                    }
                )
            }
            ServicesRoute.SUB_CATEGORY -> {
                Column(modifier = Modifier.fillMaxSize()) {
                    headerContent()
                    selectedCategory?.let { category ->
                        SubServiceListView(
                            category = category,
                            onNavigateToProviders = { subCat, catName ->
                                selectedSubCategory = subCat
                                selectedCategoryName = catName
                                currentRoute = ServicesRoute.PROVIDERS
                            }
                        )
                    }
                }
            }
            ServicesRoute.PROVIDERS -> {
                Column(modifier = Modifier.fillMaxSize()) {
                    headerContent()
                    selectedSubCategory?.let { subCategory ->
                        ServiceProviderListView(
                            subCategory = subCategory,
                            categoryName = selectedCategoryName,
                            onNavigateToDetail = { providerId ->
                                selectedProviderId = providerId
                                currentRoute = ServicesRoute.PROVIDER_DETAIL
                            }
                        )
                    }
                }
            }
            ServicesRoute.PROVIDER_DETAIL -> {
                Column(modifier = Modifier.fillMaxSize()) {
                    headerContent()
                    ServiceProviderDetailView(
                        providerId = selectedProviderId
                    )
                }
            }
        }
    }
    
    if (showAddressSheet) {
        com.localforvocalstartup.app.ui.components.UserAddressSelectorView(
            isVisible = true,
            savedUserAddresses = savedAddresses,
            selectedUserAddressId = selectedAddress?.id,
            onSelectUserAddress = { 
                com.localforvocalstartup.app.data.manager.AddressManager.selectAddress(it)
                showAddressSheet = false 
            },
            onUseCurrentLocation = {
                com.localforvocalstartup.app.data.manager.LocationManager.startUpdating(context)
                showAddressSheet = false
            },
            onAddNewUserAddress = {
                showAddressSheet = false
                com.localforvocalstartup.app.data.manager.NavigationManager.navigate("locationPicker")
            },
            onDismiss = { showAddressSheet = false }
        )
    }
}
