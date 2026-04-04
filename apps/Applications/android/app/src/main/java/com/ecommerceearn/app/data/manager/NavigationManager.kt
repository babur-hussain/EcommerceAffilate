package com.ecommerceearn.app.data.manager

import androidx.compose.ui.graphics.Color
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.net.URLDecoder
import java.nio.charset.StandardCharsets

data class CategoryNavigationParams(
    val categoryId: String? = null,
    val categoryName: String? = null,
    val subCategoryId: String? = null,
    val filters: Map<String, String> = emptyMap(),
    val layoutType: String? = null
)

enum class TabType(val id: String, val iconName: String, val colorHex: String) {
    SHOPPING("Shopping", "bag.fill", "#2563EB"),
    SERVICES("Services", "building.2.fill", "#7C3AED"),
    GROCERY("Grocery", "basket.fill", "#10B981"),
    INFLUENCERS("Influencers", "person.3.fill", "#EC4899");
}

enum class OverlayDestination(val id: String) {
    BEAUTY("beauty"),
    SPECIAL_DEAL("specialDeal"),
    BRAND_NEW_ARRIVAL("brandNewArrival"),
    MEN_FASHION("menFashion"),
    GRAND_MOBILES("grandMobiles"),
    SHOES_SALES("shoesSales"),
    CYBER_SALE("cyberSale"),
    CATEGORY_PAGE("categoryPage")
}

enum class MainTab {
    HOME, CATEGORIES, CART, ACCOUNT
}

object NavigationManager {
    private val _selectedCategory = MutableStateFlow("For You")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _activeTab = MutableStateFlow(MainTab.HOME)
    val activeTab: StateFlow<MainTab> = _activeTab.asStateFlow()

    private val _activeOverlay = MutableStateFlow<OverlayDestination?>(null)
    val activeOverlay: StateFlow<OverlayDestination?> = _activeOverlay.asStateFlow()

    private val _categoryNavigation = MutableStateFlow<CategoryNavigationParams?>(null)
    val categoryNavigation: StateFlow<CategoryNavigationParams?> = _categoryNavigation.asStateFlow()

    private val _groceryProductId = MutableStateFlow<String?>(null)
    val groceryProductId: StateFlow<String?> = _groceryProductId.asStateFlow()

    private val _isGroceryTabActive = MutableStateFlow(false)
    val isGroceryTabActive: StateFlow<Boolean> = _isGroceryTabActive.asStateFlow()

    private val _isServicesTabActive = MutableStateFlow(false)
    val isServicesTabActive: StateFlow<Boolean> = _isServicesTabActive.asStateFlow()

    private val _isInfluencersTabActive = MutableStateFlow(false)
    val isInfluencersTabActive: StateFlow<Boolean> = _isInfluencersTabActive.asStateFlow()

    fun setGroceryTabActive(active: Boolean) {
        _isGroceryTabActive.value = active
    }

    fun setServicesTabActive(active: Boolean) {
        _isServicesTabActive.value = active
    }

    fun setInfluencersTabActive(active: Boolean) {
        _isInfluencersTabActive.value = active
    }

    fun openGroceryProduct(id: String) {
        _groceryProductId.value = id
    }

    fun dismissGroceryProduct() {
        _groceryProductId.value = null
    }

    // Helper visibility states based on overlay
    val showBeautyPage: Boolean get() = _activeOverlay.value == OverlayDestination.BEAUTY
    val showSpecialDealPage: Boolean get() = _activeOverlay.value == OverlayDestination.SPECIAL_DEAL
    val showBrandNewArrivalPage: Boolean get() = _activeOverlay.value == OverlayDestination.BRAND_NEW_ARRIVAL
    val showMenFashionPage: Boolean get() = _activeOverlay.value == OverlayDestination.MEN_FASHION
    val showGrandMobilesPage: Boolean get() = _activeOverlay.value == OverlayDestination.GRAND_MOBILES
    val showShoesSalesPage: Boolean get() = _activeOverlay.value == OverlayDestination.SHOES_SALES
    val showCyberSalePage: Boolean get() = _activeOverlay.value == OverlayDestination.CYBER_SALE
    val showCategoryPage: Boolean get() = _activeOverlay.value == OverlayDestination.CATEGORY_PAGE

    fun setOverlay(destination: OverlayDestination?) {
        _activeOverlay.value = destination
    }

    fun navigate(url: String) {
        if (url.startsWith("/grocery/category/")) {
            val ids = url.replace("/grocery/category/", "")
            _categoryNavigation.value = CategoryNavigationParams(
                categoryName = "Groceries",
                subCategoryId = ids,
                layoutType = "grocery"
            )
            setOverlay(OverlayDestination.CATEGORY_PAGE)
            return
        }

        if (url.startsWith("category://")) {
            parseCategoryURL(url)
            return
        }

        when (url) {
            "shopping", "home" -> {
                _activeTab.value = MainTab.HOME
            }
            "categories" -> _activeTab.value = MainTab.CATEGORIES
            "cart" -> _activeTab.value = MainTab.CART
            "account" -> _activeTab.value = MainTab.ACCOUNT
            
            // Legacy internal routings
            "services" -> AppLogger.debug("Services requested from within Home Tab")
            "grocery" -> AppLogger.debug("Grocery requested from within Home Tab")
            "influencers" -> AppLogger.debug("Influencers requested from within Home Tab")
            
            "beauty-product" -> setOverlay(OverlayDestination.BEAUTY)
            "special-deal-new-style" -> setOverlay(OverlayDestination.SPECIAL_DEAL)
            "brand-new-arrival" -> setOverlay(OverlayDestination.BRAND_NEW_ARRIVAL)
            "men-fashion" -> setOverlay(OverlayDestination.MEN_FASHION)
            "grand-mobiles-sale" -> setOverlay(OverlayDestination.GRAND_MOBILES)
            "footwear-collection", "footwear-sale-collection" -> setOverlay(OverlayDestination.SHOES_SALES)
            "cyber-sale" -> setOverlay(OverlayDestination.CYBER_SALE)
            else -> {
                if (url.startsWith("/collection/")) {
                    AppLogger.debug("Navigate to collection: $url")
                } else {
                    AppLogger.debug("Unhandled navigation: $url")
                }
            }
        }
    }

    private fun parseCategoryURL(url: String) {
        val withoutScheme = url.replace("category://", "")
        val components = withoutScheme.split("?", limit = 2)
        val categoryName = URLDecoder.decode(components.firstOrNull() ?: "Category", StandardCharsets.UTF_8.name())

        var categoryId: String? = null
        var subCategoryId: String? = null
        var layoutType: String? = null
        val filters = mutableMapOf<String, String>()

        if (components.size > 1) {
            val queryString = components[1]
            val params = queryString.split("&")

            for (param in params) {
                val keyValue = param.split("=", limit = 2)
                if (keyValue.size != 2) continue

                val key = keyValue[0]
                val value = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8.name())

                when (key) {
                    "categoryId" -> categoryId = value
                    "subCategoryId" -> subCategoryId = value
                    "layout" -> layoutType = value
                    "filters" -> {
                        val filterPairs = value.split(",")
                        for (pair in filterPairs) {
                            val kv = pair.split(":", limit = 2)
                            if (kv.size == 2) {
                                filters[kv[0]] = kv[1]
                            }
                        }
                    }
                }
            }
        }

        _categoryNavigation.value = CategoryNavigationParams(
            categoryId = categoryId,
            categoryName = categoryName,
            subCategoryId = subCategoryId,
            filters = filters,
            layoutType = layoutType
        )
        setOverlay(OverlayDestination.CATEGORY_PAGE)
    }

    fun dismissCategoryPage() {
        if (_activeOverlay.value == OverlayDestination.CATEGORY_PAGE) {
            setOverlay(null)
        }
        _categoryNavigation.value = null
    }
}
