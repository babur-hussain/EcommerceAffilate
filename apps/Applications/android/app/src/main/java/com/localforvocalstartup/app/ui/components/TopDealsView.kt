package com.localforvocalstartup.app.ui.components

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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.model.SDUIComponent
import com.localforvocalstartup.app.utils.fromHex
import com.google.gson.JsonObject

@Composable
fun TopDealsView(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Top Deals"
    val items = component.decodeItems("items", JsonObject::class.java)
    val headerActionUrl = component.props?.get("headerActionUrl")?.asString

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 16.dp)
    ) {
        // Header
        Text(
            text = title,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable {
                    headerActionUrl?.let {
                        // Navigate logic can go here
                    }
                }
        )

        Spacer(modifier = Modifier.height(16.dp))

        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            // Top Row (2 Items)
            if (items.size >= 2) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    TopDealsCard(item = items[0], isLarge = true, modifier = Modifier.weight(1f))
                    TopDealsCard(item = items[1], isLarge = true, modifier = Modifier.weight(1f))
                }
            }

            // Bottom Row (3 Items)
            if (items.size >= 5) {
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    TopDealsCard(item = items[2], isLarge = false, modifier = Modifier.weight(1f))
                    TopDealsCard(item = items[3], isLarge = false, modifier = Modifier.weight(1f))
                    TopDealsCard(item = items[4], isLarge = false, modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun TopDealsCard(item: JsonObject, isLarge: Boolean, modifier: Modifier = Modifier) {
    val title = item.get("title")?.asString ?: ""
    val price = item.get("price")?.asString ?: ""
    val image = item.get("image")?.asString ?: ""
    val bgColorHex = item.get("bgColor")?.asString ?: "#EADEFF"
    val barColorHex = item.get("barColor")?.asString ?: "#A55CFF"
    val actionUrl = item.get("actionUrl")?.asString

    val bgColor = try { Color.fromHex(bgColorHex) } catch (e: Exception) { Color(0xFFEADEFF) }
    val barColor = try { Color.fromHex(barColorHex) } catch (e: Exception) { Color(0xFFA55CFF) }

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .clickable {
                actionUrl?.let {
                }
            }
    ) {
        // Image Area
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(if (isLarge) 150.dp else 120.dp)
                .background(bgColor),
            contentAlignment = Alignment.Center
        ) {
            AsyncImage(
                model = image,
                contentDescription = title,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(if (isLarge) 120.dp else 90.dp)
            )
        }

        // Bottom Info
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(bgColor),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                fontSize = if (isLarge) 14.sp else 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(barColor)
                    .padding(horizontal = 4.dp, vertical = 6.dp)
            )

            Text(
                text = price,
                fontSize = if (isLarge) 14.sp else 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black,
                modifier = Modifier.padding(bottom = 8.dp, top = 4.dp)
            )
        }
    }
}
