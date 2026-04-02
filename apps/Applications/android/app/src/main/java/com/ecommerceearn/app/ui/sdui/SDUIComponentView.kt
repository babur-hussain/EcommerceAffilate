package com.ecommerceearn.app.ui.sdui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.ecommerceearn.app.data.model.ComponentType
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.utils.fromHex

import com.google.gson.JsonObject

@Composable
fun Modifier.sduiStyle(style: JsonObject?): Modifier {
    if (style == null) return this
    var modifier = this

    // Background Color
    val hex = style.get("backgroundColor")?.asString
    if (hex != null) {
        modifier = modifier.background(Color.fromHex(hex))
    }

    // Corner Radius
    val radius = style.get("cornerRadius")?.asFloat
    if (radius != null && radius > 0f) {
        modifier = modifier.clip(RoundedCornerShape(radius.dp))
    }

    // Padding
    val paddingObj = style.getAsJsonObject("padding")
    if (paddingObj != null) {
        val top = paddingObj.get("top")?.asFloat ?: 0f
        val bottom = paddingObj.get("bottom")?.asFloat ?: 0f
        val start = paddingObj.get("leading")?.asFloat ?: 0f
        val end = paddingObj.get("trailing")?.asFloat ?: 0f
        modifier = modifier.padding(start.dp, top.dp, end.dp, bottom.dp)
    }

    return modifier
}

@Composable
fun SDUIComponentView(component: SDUIComponent) {
    Box(modifier = Modifier.sduiStyle(component.style as? JsonObject)) {
        when (component.type) {
            ComponentType.CONTAINER -> {
                Column {
                    component.children?.forEach { child ->
                        SDUIComponentView(component = child)
                    }
                }
            }
            ComponentType.TEXT -> {
                Text(text = component.props?.get("text")?.asString ?: "")
            }
            ComponentType.IMAGE -> {
                // val imageUrl = component.prop("imageUrl") as? String
                // AsyncImage(model = imageUrl, ...)
            }
            ComponentType.BUTTON -> {
                Text(text = component.props?.get("text")?.asString ?: "Button", modifier = Modifier.clickable { })
            }
            ComponentType.SCROLL_VIEW -> {
                Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                    component.children?.forEach { child ->
                        SDUIComponentView(component = child)
                    }
                }
            }
            ComponentType.SPACER -> Spacer(modifier = Modifier.padding(8.dp))
            ComponentType.UNKNOWN -> {
                Text(
                    text = "Unknown: ${component.type.name}",
                    color = Color.White,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Red, RoundedCornerShape(8.dp))
                        .padding(8.dp)
                )
            }
            ComponentType.HERO_CAROUSEL -> RenderCarousel(component)
            ComponentType.CATEGORY_CIRCLES -> RenderCategoryCircles(component)
            ComponentType.BANNER -> RenderBanner(component)
            ComponentType.GRID -> RenderGrid(component)
            ComponentType.HORIZONTAL_LIST -> RenderHorizontalList(component)
            ComponentType.PRODUCT_LIST -> RenderProductList(component)
            ComponentType.PRODUCT_LIST_HORIZONTAL -> RenderProductListHorizontal(component)
            // Add all other routing logic passing to sub-render files hereafter
            else -> {
                // Pass to specialized router or show unhandled
                Text(
                    text = "Unhandled Type: ${component.type.name}",
                    modifier = Modifier
                        .background(Color.Red.copy(alpha = 0.1f))
                        .padding(16.dp)
                )
            }
        }
    }
}
