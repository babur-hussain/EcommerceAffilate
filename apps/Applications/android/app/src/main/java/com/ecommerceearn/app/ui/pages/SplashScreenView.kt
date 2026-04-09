package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.utils.AppTheme
import kotlinx.coroutines.delay
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.rememberLottieComposition

@Composable
fun SplashScreenView(onSplashComplete: () -> Unit = {}) {
    var lottieFinished by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        // Minimum display time for Splash
        delay(2000)
        lottieFinished = true
        onSplashComplete()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(modifier = Modifier.weight(1f))

            val composition by rememberLottieComposition(LottieCompositionSpec.Asset("fast delivery.lottie"))
            LottieAnimation(
                composition = composition,
                iterations = LottieConstants.IterateForever,
                modifier = Modifier.size(220.dp)
            )

            Spacer(modifier = Modifier.size(24.dp))

            Text(
                text = "Local For Vocal",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF2874F0)
            )

            Text(
                text = "Loading your experience...",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Gray,
                modifier = Modifier.padding(top = 8.dp)
            )

            Spacer(modifier = Modifier.weight(1f))

            Text(
                text = "Made in India \uD83C\uDDEE\uD83C\uDDF3",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Gray.copy(alpha = 0.6f),
                modifier = Modifier.padding(bottom = 40.dp)
            )
        }
    }
}
