package com.ecommerceearn.app.ui.pages

import androidx.compose.runtime.Composable
import com.ecommerceearn.app.ui.components.LoginScreen

@Composable
fun LoginView(onDismiss: () -> Unit = {}) {
    LoginScreen(onDismiss = onDismiss)
}
