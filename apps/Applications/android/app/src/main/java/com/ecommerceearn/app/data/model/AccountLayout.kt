package com.ecommerceearn.app.data.model

data class AccountLayout(
    val sections: List<LayoutSection>
)

data class LayoutSection(
    val id: String,
    val title: String,
    val type: String? = null,
    val items: List<LayoutItem>
)

data class LayoutItem(
    val id: String,
    val title: String,
    val subtitle: String? = null,
    val icon: String, // Ionicons name, need to map to Material Icons or Load dynamically
    val actionUrl: String,
    val isNew: Boolean? = false
)
