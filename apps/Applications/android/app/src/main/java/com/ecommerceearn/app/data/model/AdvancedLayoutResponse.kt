package com.ecommerceearn.app.data.model

data class AdvancedLayoutResponse(
    val _id: String,
    val name: String,
    val slug: String,
    val isActive: Boolean,
    val version: Int,
    val components: List<SDUIComponent>
)
