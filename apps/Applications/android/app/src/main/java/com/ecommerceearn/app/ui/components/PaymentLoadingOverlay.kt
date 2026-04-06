package com.ecommerceearn.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PaymentLoadingOverlay() {
    val infiniteTransition = rememberInfiniteTransition()
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.5f)),
        contentAlignment = Alignment.Center
    ) {
        Surface(
            color = Color(0x99000000), // Semi-transparent dark material equivalent
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier
                .padding(horizontal = 32.dp)
                .shadow(30.dp, ambientColor = Color(0xFF2563EB).copy(alpha = 0.15f))
        ) {
            Column(
                modifier = Modifier
                    .padding(40.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(28.dp)
            ) {
                // Loader Animation mapping
                Box(contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier
                            .size(200.dp)
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(
                                        Color(0xFF2563EB).copy(alpha = 0.15f),
                                        Color.Transparent
                                    )
                                ),
                                shape = CircleShape
                            )
                    )

                    // Lottie view placeholder (uses indeterminate circular progress for now if Lottie json is absent)
                    CircularProgressIndicator(
                        modifier = Modifier.size(80.dp),
                        color = Color(0xFF2563EB),
                        strokeWidth = 6.dp
                    )
                }

                // Text Section
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "Preparing your payment...",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.alpha(pulseAlpha)
                    )

                    Text(
                        text = "Please wait while we set things up",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.White.copy(alpha = 0.65f)
                    )
                }

                // Secure payment indicator
                Row(
                    modifier = Modifier
                        .background(Color.White.copy(alpha = 0.1f), RoundedCornerShape(20.dp))
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Secure",
                        tint = Color(0xFF34D399),
                        modifier = Modifier.size(12.dp)
                    )
                    Text(
                        text = "100% Secure Payment",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF34D399)
                    )
                }
            }
        }
    }
}
