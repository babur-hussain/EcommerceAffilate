package com.ecommerceearn.app.data.model

import com.ecommerceearn.app.data.model.Product

data class GlobalSearchResponse(
    val products: List<Product> = emptyList(),
    val categories: List<Category> = emptyList(),
    val suggestions: List<String> = emptyList(),
    val totalCount: Int = 0
)
