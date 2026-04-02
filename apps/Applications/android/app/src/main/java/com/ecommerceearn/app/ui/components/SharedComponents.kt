package com.ecommerceearn.app.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.composed

// Extension for Shimmer Effect
fun Modifier.shimmerEffect(): Modifier = composed {
    var isLoaded = false
    val infiniteTransition = rememberInfiniteTransition()
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.8f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    this.then(
        Modifier.background(
            Brush.linearGradient(
                colors = listOf(
                    Color.LightGray.copy(alpha = alpha),
                    Color.White.copy(alpha = alpha),
                    Color.LightGray.copy(alpha = alpha)
                ),
                start = Offset.Zero,
                end = Offset(1000f, 1000f)
            )
        )
    )
}

@Composable
fun ProductCardSkeleton(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .background(Color.White, shape = RoundedCornerShape(12.dp))
            .padding(bottom = 8.dp)
            .clip(RoundedCornerShape(12.dp))
    ) {
        // Image Placeholder
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.8f)
                .shimmerEffect()
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Text Placeholders
        Column(modifier = Modifier.padding(horizontal = 4.dp)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(14.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .shimmerEffect()
            )

            Spacer(modifier = Modifier.height(6.dp))

            Box(
                modifier = Modifier
                    .width(60.dp)
                    .height(12.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .shimmerEffect()
            )
        }
    }
}
