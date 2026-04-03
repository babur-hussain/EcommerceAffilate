package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.data.manager.NavigationManager
import com.google.gson.Gson

@Composable
fun GrocerySpecialPicksComponent(component: SDUIComponent) {
    val props = component.props
    val title = props?.getString("title") ?: "Special picks for you"
    
    data class SpecialPickItem(val id: String?, val image: String?, val imageUrl: String?, val actionUrl: String?, val title: String?, val subtitle: String?)
    
    val itemsArr = props?.getArray("items")
    val items = itemsArr?.mapNotNull { jsonRaw ->
        try { Gson().fromJson(jsonRaw, SpecialPickItem::class.java) } catch(e:Exception){ null }
    } ?: emptyList()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 24.dp, bottom = 16.dp)
    ) {
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp,
            color = Color(0xFF111827),
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items) { item ->
                val imgUrl = item.image ?: item.imageUrl ?: ""
                Card(
                    modifier = Modifier
                        .width(280.dp)
                        .height(160.dp)
                        .clickable { item.actionUrl?.let { NavigationManager.navigate(it) } },
                    shape = RoundedCornerShape(16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    AsyncImage(
                        model = imgUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }
}
