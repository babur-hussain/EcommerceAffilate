package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.localforvocalstartup.app.ui.sdui.SDUIComponentView
import com.localforvocalstartup.app.ui.viewmodel.SDUIPageViewModel

@Composable
fun SDUIPage(slug: String) {
    val viewModel: SDUIPageViewModel = viewModel(key = "sdui_$slug",
        factory = SDUIPageViewModel.Factory(slug))

    val components by viewModel.components.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val showSkeleton by viewModel.showSkeleton.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    LaunchedEffect(slug) {
        viewModel.loadLayout()
    }

    Box(modifier = Modifier.fillMaxSize()) {
        when {
            showSkeleton -> {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Loading $slug...", color = Color.Gray)
                }
            }
            errorMessage != null && components.isEmpty() -> {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(errorMessage ?: "Error", color = Color.Red)
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(onClick = { viewModel.forceRefresh() }) {
                        Text("Retry")
                    }
                }
            }
            components.isNotEmpty() -> {
                Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                    components.forEach { component ->
                        if (component.isHidden != true) {
                            SDUIComponentView(component = component)
                        }
                    }
                }
            }
            else -> {
                Text("No content found", modifier = Modifier.align(Alignment.Center))
            }
        }
    }
}
