package com.localforvocalstartup.app.data.model

data class LuminousProductItem(
    val id: String? = null,
    val title: String = "",
    val subtitle: String = "",
    val price: String = "",
    val image_url: String = "",
    val badge: String? = null
)

data class LuminousCategoryItem(
    val id: String? = null,
    val name: String = "",
    val image: String? = null
)
