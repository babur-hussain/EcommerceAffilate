package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun FashionHeaderView(
    categories: List<String> = listOf("Western", "Ethnic", "Luxe", "Accessories", "Activewear"),
    selectedCategoryIndex: Int = 0,
    onCategorySelected: (Int) -> Unit = {},
    onMenuClick: () -> Unit = {},
    onSearchClick: () -> Unit = {},
    onNotificationClick: () -> Unit = {}
) {
    val primaryColor = Color(0xFF376F7C)
    val secondaryColor = Color(0xFFD8B08C)
    val backgroundLight = Color(0xFFFAF7F2)
    val surfaceLight = Color(0xFFF2EDE5)
    val textMain = Color(0xFF22252A)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(backgroundLight.copy(alpha = 0.95f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .padding(top = 8.dp, bottom = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .shadow(2.dp, CircleShape, spotColor = Color.Black.copy(alpha = 0.05f))
                    .background(Color.White, CircleShape)
                    .clickable(onClick = onMenuClick),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Menu, contentDescription = "Menu", tint = textMain)
            }

            Row(
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .shadow(20.dp, RoundedCornerShape(24.dp), spotColor = primaryColor.copy(alpha = 0.05f))
                    .background(Color.White, RoundedCornerShape(24.dp))
                    .clickable(onClick = onSearchClick)
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = primaryColor, modifier = Modifier.size(20.dp))
                Text("Search designers, styles...", fontSize = 16.sp, fontWeight = FontWeight.Medium, color = Color(0xFF6C7C7F))
            }

            Box(
                modifier = Modifier
                    .size(40.dp)
                    .shadow(2.dp, CircleShape, spotColor = Color.Black.copy(alpha = 0.05f))
                    .background(Color.White, CircleShape)
                    .clickable(onClick = onNotificationClick),
                contentAlignment = Alignment.Center
            ) {
                Box(contentAlignment = Alignment.TopEnd) {
                    Icon(Icons.Default.Notifications, contentDescription = "Notifications", tint = textMain, modifier = Modifier.size(24.dp))
                    Box(
                        modifier = Modifier
                            .offset(x = 2.dp, y = (-2).dp)
                            .size(8.dp)
                            .background(secondaryColor, CircleShape)
                            .border(1.dp, Color.White, CircleShape)
                    )
                }
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 4.dp)
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            categories.forEachIndexed { index, category ->
                val isSelected = index == selectedCategoryIndex
                Box(
                    modifier = Modifier
                        .height(36.dp)
                        .background(if (isSelected) primaryColor else surfaceLight, RoundedCornerShape(18.dp))
                        .clip(RoundedCornerShape(18.dp))
                        .clickable { onCategorySelected(index) }
                        .padding(horizontal = 20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = category,
                        fontSize = 14.sp,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                        letterSpacing = if (isSelected) 0.5.sp else 0.sp,
                        color = if (isSelected) Color.White else textMain
                    )
                }
            }
        }
    }
}
