package com.localforvocalstartup.app.ui.pages

import androidx.compose.runtime.Composable
import com.localforvocalstartup.app.ui.components.LoginScreen

@Composable
fun LoginView(onDismiss: () -> Unit = {}) {
    LoginScreen(onDismiss = onDismiss)
}
