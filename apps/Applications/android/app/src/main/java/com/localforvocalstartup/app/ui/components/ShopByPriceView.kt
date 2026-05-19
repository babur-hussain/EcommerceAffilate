package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.SDUIComponent
import com.localforvocalstartup.app.ui.components.handleActionUrl
import com.google.gson.JsonObject

@Composable
fun ShopByPriceView(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Shop by Price"
    val headerActionUrl = component.props?.get("headerActionUrl")?.asString
    val items = component.decodeItems("items", JsonObject::class.java)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 16.dp)
    ) {
        // Header
        Text(
            text = title,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF111827),
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable { handleActionUrl(headerActionUrl) }
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (items.isNotEmpty()) {
            val chunkedItems = items.chunked(3)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                chunkedItems.forEach { rowItems ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        rowItems.forEach { item ->
                            val image = item.get("image")?.asString ?: ""
                            val actionUrl = item.get("actionUrl")?.asString

                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(0xFFF3F4F6))
                                    .clickable { handleActionUrl(actionUrl) }
                            ) {
                                AsyncImage(
                                    model = image,
                                    contentDescription = null,
                                    contentScale = ContentScale.Fit,
                                    modifier = Modifier.fillMaxWidth().aspectRatio(1f)
                                )
                            }
                        }

                        // Fill empty spots if not divisible by 3
                        repeat(3 - rowItems.size) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}
