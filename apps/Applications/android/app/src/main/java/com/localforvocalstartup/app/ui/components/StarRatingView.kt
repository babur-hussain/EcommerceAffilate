package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarOutline
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun StarRatingView(
    rating: Int,
    maxRating: Int = 5,
    size: Dp = 16.dp,
    interactive: Boolean = false,
    onRatingChanged: ((Int) -> Unit)? = null
) {
    Row {
        for (i in 1..maxRating) {
            Icon(
                imageVector = if (i <= rating) Icons.Default.Star else Icons.Outlined.StarOutline,
                contentDescription = null,
                tint = if (i <= rating) Color(0xFFFFC107) else Color.Gray.copy(alpha = 0.3f),
                modifier = Modifier
                    .size(size)
                    .then(
                        if (interactive) Modifier.clickable { onRatingChanged?.invoke(i) }
                        else Modifier
                    )
            )
        }
    }
}
