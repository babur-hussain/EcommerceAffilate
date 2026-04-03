package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.SDUIComponent
import com.google.gson.Gson

@Composable
fun GroceryPromoCardsComponent(component: SDUIComponent, onPromoClick: (String) -> Unit = {}) {
    val props = component.props
    val backgroundImage = props?.getString("backgroundImage")
    val title = props?.getString("title")
    val itemsArr = props?.getArray("items")

    data class PromoCard(val title: String?, val imageUrl: String, val actionUrl: String?)
    val items = itemsArr?.mapNotNull {
        try {
            Gson().fromJson(it, PromoCard::class.java)
        } catch(e:Exception) { null }
    } ?: emptyList()

    if (backgroundImage != null) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .height(300.dp)
                .clip(RoundedCornerShape(16.dp))
        ) {
            // Background Image
            AsyncImage(
                model = backgroundImage,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Overlay Content
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                if (title != null) {
                    Spacer(modifier = Modifier.height(40.dp))
                    Text(
                        text = title,
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        style = androidx.compose.ui.text.TextStyle(
                            shadow = androidx.compose.ui.graphics.Shadow(
                                color = Color.Black.copy(alpha=0.3f),
                                offset = androidx.compose.ui.geometry.Offset(0f, 2f),
                                blurRadius = 2f
                            )
                        )
                    )
                }

                Spacer(modifier = Modifier.weight(1f))

                // Cards Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 10.dp)
                        .padding(bottom = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items.take(3).forEach { item ->
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color.White)
                                .clickable { item.actionUrl?.let { onPromoClick(it) } }
                        ) {
                            Column(modifier = Modifier.fillMaxWidth()) {
                                AsyncImage(
                                    model = item.imageUrl,
                                    contentDescription = null,
                                    contentScale = ContentScale.Fit,
                                    modifier = Modifier.fillMaxWidth().height(120.dp)
                                )
                                if (item.title != null) {
                                    Text(
                                        text = item.title,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.Black,
                                        maxLines = 1,
                                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 6.dp).fillMaxWidth(),
                                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
