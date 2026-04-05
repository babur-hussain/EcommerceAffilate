package com.ecommerceearn.app.data.model

import com.google.gson.annotations.SerializedName

data class PresignedUrlResponse(
    val uploadUrl: String,
    val fileUrl: String,
    val key: String
)

data class PresignedUrlAPIResponse(
    val success: Boolean,
    val data: PresignedUrlResponse
)

data class CreateStoryRequest(
    val mediaUrl: String,
    val mediaType: String
)
