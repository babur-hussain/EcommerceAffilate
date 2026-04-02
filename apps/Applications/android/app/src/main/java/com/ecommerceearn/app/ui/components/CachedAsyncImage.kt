package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Image
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import coil.compose.SubcomposeAsyncImage

@Composable
fun CachedAsyncImage(
    url: String,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    placeholderColor: Color = Color(0xFFF3F4F6)
) {
    SubcomposeAsyncImage(
        model = url,
        contentDescription = contentDescription,
        modifier = modifier,
        loading = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(placeholderColor)
            )
        },
        error = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(placeholderColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Image,
                    contentDescription = "Error Loading Image",
                    tint = Color(0xFF9CA3AF)
                )
            }
        }
    )
}
