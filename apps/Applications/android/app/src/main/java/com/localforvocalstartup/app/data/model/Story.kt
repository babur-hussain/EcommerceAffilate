package com.localforvocalstartup.app.data.model

import java.util.Date

data class Story(
    val _id: String,
    val userId: String,
    val userName: String,
    val userProfileImage: String?,
    val mediaUrl: String,
    val mediaType: StoryMediaType,
    val duration: Double?,
    val thumbnailUrl: String?,
    val views: Int,
    val viewedBy: List<String>?,
    val isActive: Boolean,
    val createdAt: String,
    val expiresAt: String
)

enum class StoryMediaType {
    image,
    video
}
