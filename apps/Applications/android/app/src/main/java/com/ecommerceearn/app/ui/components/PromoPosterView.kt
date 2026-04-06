package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

@Composable
fun PromoPosterView(
    image: String,
    actionUrl: String? = null,
    onNavigate: (String) -> Unit = {}
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(top = 4.dp, bottom = 20.dp)
            .height(120.dp)
            .background(Color(0xFFF0F0F0), RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .clickable(enabled = actionUrl != null) {
                actionUrl?.let { onNavigate(it) }
            }
    ) {
        AsyncImage(
            model = image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
    }
}
