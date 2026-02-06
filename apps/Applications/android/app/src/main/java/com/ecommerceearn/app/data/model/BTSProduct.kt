package com.ecommerceearn.app.data.model

/**
 * Data class for BackToSchool product items used in BTS product grids.
 * Maps to iOS BTSProduct struct used in BackToSchoolGridView.
 */
data class BTSProduct(
    val id: String,
    val title: String,
    val subtitle: String,
    val price: String,
    val originalPrice: String? = null,
    val badge: String? = null,
    val badgeColor: String? = null,
    val image: String
)

/**
 * Data class for Lumiere product items used in PercentOff section.
 * Maps to iOS LumiereProduct struct used in LumiereSectionView.
 */
data class LumiereProduct(
    val id: String,
    val title: String,
    val subtitle: String,
    val price: String,
    val original_price: String? = null,
    val image_url: String,
    val badge: String? = null,
    val price_color: String? = null
)

/**
 * Data class for Luminous product grid items.
 * Maps to iOS LuminousGridView.ProductItem.
 */
data class LuminousProductItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val price: String,
    val original_price: String? = null,
    val image_url: String,
    val badge: String? = null,
    val badge_bg: String? = null
)

/**
 * Data class for Luminous category items.
 */
data class LuminousCategoryItem(
    val name: String,
    val image_url: String
)
