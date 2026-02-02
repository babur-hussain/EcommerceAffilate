package com.ecommerceearn.app.data.model

import com.google.gson.annotations.SerializedName

data class SDUIComponent(
    val id: String,
    val type: String,
    val props: Map<String, Any>?,
    val content: Map<String, Any>?, // Added content field
    val style: Map<String, Any>?,
    val children: List<SDUIComponent>?
)


