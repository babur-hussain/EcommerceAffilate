package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.unit.Constraints
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.rememberLottieComposition
import androidx.compose.ui.graphics.graphicsLayer


/**
 * Matches iOS LottieLayerConfig exactly (field names are identical for Gson deserialization).
 * Coordinates x/y/width/height are percentages 0-100 of the parent container.
 */
data class LottieLayerConfig(
    val animationName: String,
    val frame: LottieFrame,
    val loop: Boolean = true,
    val speed: Double = 1.0,
    val contentMode: String? = "fit",
    val opacity: Double? = 1.0,
    val rotation: Double? = 0.0
) {
    data class LottieFrame(
        val x: Double,
        val y: Double,
        val width: Double,
        val height: Double
    )
}

/**
 * Renders a Lottie layer absolutely positioned within its parent Box,
 * matching the iOS GlobalLottieLayer positioning math exactly:
 *   position x = parentWidth  * (x/100) + parentWidth  * (width/100) / 2  (center)
 *   position y = parentHeight * (y/100) + parentHeight * (height/100) / 2  (center)
 *
 * Must be called inside a BoxScope so it can overlay the background.
 */
@Composable
fun BoxScope.GlobalLottieLayer(layer: LottieLayerConfig) {
    val assetName = if (layer.animationName.endsWith(".lottie") || layer.animationName.endsWith(".json")) {
        layer.animationName
    } else {
        "${layer.animationName}.lottie"
    }

    val composition by rememberLottieComposition(LottieCompositionSpec.Asset(assetName))

    // We need to position absolutely using a fractional-coordinate layout.
    // Using a custom Layout so we can measure the parent and place the child at the exact pixel offset.
    Layout(
        modifier = Modifier
            .fillMaxSize()
            .alpha(layer.opacity?.toFloat() ?: 1f),
        content = {
            LottieAnimation(
                composition = composition,
                iterations = if (layer.loop) LottieConstants.IterateForever else 1,
                speed = layer.speed.toFloat(),
                clipToCompositionBounds = false,
                renderMode = com.airbnb.lottie.RenderMode.SOFTWARE,
                contentScale = androidx.compose.ui.layout.ContentScale.Fit,
                modifier = Modifier
                    .rotate(layer.rotation?.toFloat() ?: 0f)
                    .graphicsLayer { 
                        clip = false
                    }
            )
        }
    ) { measurables, constraints ->
        val parentW = constraints.maxWidth
        val parentH = constraints.maxHeight

        // Percentage → pixel conversions (iOS uses /100.0 normalisation)
        val nX = layer.frame.x  / 100.0
        val nY = layer.frame.y  / 100.0
        val nW = layer.frame.width  / 100.0
        val nH = layer.frame.height / 100.0

        val itemW = (parentW * nW).toInt().coerceAtLeast(1)
        val itemH = (parentH * nH).toInt().coerceAtLeast(1)

        // Mirror iOS: position() sets the centre of the view
        val centerX = (parentW * nX + parentW * nW / 2).toInt()
        val centerY = (parentH * nY + parentH * nH / 2).toInt()

        val placeable = measurables.first().measure(
            Constraints.fixed(itemW, itemH)
        )

        layout(parentW, parentH) {
            // top-left from centre
            placeable.placeRelative(
                x = centerX - itemW / 2,
                y = centerY - itemH / 2
            )
        }
    }
}
