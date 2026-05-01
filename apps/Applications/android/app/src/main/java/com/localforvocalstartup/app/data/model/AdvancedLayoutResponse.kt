package com.localforvocalstartup.app.data.model

data class AdvancedLayoutResponse(
    val _id: String = "",
    val name: String = "",
    val slug: String = "",
    val isActive: Boolean = true,
    val version: Int? = null,
    val components: List<SDUIComponent> = emptyList()
)
