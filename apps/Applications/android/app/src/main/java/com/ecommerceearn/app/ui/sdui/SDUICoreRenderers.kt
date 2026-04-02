package com.ecommerceearn.app.ui.sdui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.ecommerceearn.app.data.model.SDUIComponent

@Composable
fun RenderCarousel(component: SDUIComponent) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(240.dp)
            .background(Color.LightGray)
    ) {
        Text("Hero Carousel Placeholder", modifier = Modifier.padding(16.dp))
    }
}

@Composable
fun RenderCategoryCircles(component: SDUIComponent) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .background(Color.White)
    ) {
        Text("Category Circles Placeholder", modifier = Modifier.padding(16.dp))
    }
}

@Composable
fun RenderBanner(component: SDUIComponent) {
    val height = component.props?.get("height")?.asFloat ?: 150f
    val imageUrl = component.props?.get("imageUrl")?.asString

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(height.dp)
            .padding(horizontal = 16.dp)
            .background(Color.LightGray)
    ) {
        Text("Banner: $imageUrl", modifier = Modifier.padding(16.dp))
    }
}

@Composable
fun RenderGrid(component: SDUIComponent) {
    Text("Grid Component Placeholder")
}

@Composable
fun RenderHorizontalList(component: SDUIComponent) {
    Text("Horizontal List Placeholder")
}

@Composable
fun RenderProductList(component: SDUIComponent) {
    Text("Product List Placeholder")
}

@Composable
fun RenderProductListHorizontal(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: ""
    Text("Horizontal Product List: $title")
}
