package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun HomeTopHeaderView(
    theme: Any, // Abstracted theme
    safeAreaTop: Float
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(top = safeAreaTop.dp, bottom = 16.dp, start = 16.dp, end = 16.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Column {
            Text("E-Commerce Header Framework", color = Color.Black)
            Text("Dynamic SDUI Layout Controller mapped", color = Color.Gray)
        }
    }
}

@Composable
fun HomeStickyHeaderView(
    showIcons: Boolean,
    theme: Any,
    safeAreaTop: Float,
    headerHeight: Float,
    scrollOffset: Float
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (showIcons) {
            Text("Sticky Component Categories (Icons)")
            Spacer(modifier = Modifier.weight(1f))
            Text("Filters")
        } else {
            Text("Collapsed Sticky State")
        }
    }
}
