package com.ecommerceearn.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.ecommerceearn.app.ui.pages.ContentView
import com.ecommerceearn.app.ui.pages.SplashScreenView
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Very simple root mounting mimicking ContentView/Splash lifecycle
            var showSplash by remember { mutableStateOf(true) }
            
            if (showSplash) {
                SplashScreenView(onSplashComplete = { showSplash = false })
            } else {
                ContentView()
            }
        }
    }
}
