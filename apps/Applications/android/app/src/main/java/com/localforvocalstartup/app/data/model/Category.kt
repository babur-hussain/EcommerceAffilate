package com.localforvocalstartup.app.data.model

data class Category(
    val _id: String,
    val name: String,
    val slug: String,
    val image: String? = null,
    val icon: String? = null, // Deprecated in favor of image usually, but keeping for compatibility
    val parentCategory: String? = null,
    val group: String? = null,
    val subCategoryGroupOrder: List<String>? = null
)
