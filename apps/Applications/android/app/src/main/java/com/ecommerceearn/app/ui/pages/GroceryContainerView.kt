package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.ShoppingBasket
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.BasketManager
import com.ecommerceearn.app.ui.home.TabType

enum class InnerGroceryTab {
    HOME,
    CATEGORIES,
    TOP_PICKS,
    BASKET
}

@Composable
fun GroceryContainerView(onOuterTabSelected: (TabType) -> Unit) {
    var selectedTab by remember { mutableStateOf(InnerGroceryTab.HOME) }
    val basketItems by BasketManager.items.collectAsState()
    val basketCount = basketItems.sumOf { it.quantity }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            GroceryBottomNavigationBar(
                currentTab = selectedTab,
                onTabSelected = { selectedTab = it },
                cartCount = basketCount
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                InnerGroceryTab.HOME -> {
                    com.ecommerceearn.app.ui.pages.GroceryPageView(onTabSelected = onOuterTabSelected)
                }
                InnerGroceryTab.CATEGORIES -> {
                    GroceryCategoryPageView()
                }
                InnerGroceryTab.TOP_PICKS -> {
                    GroceryTopPicksView()
                }
                InnerGroceryTab.BASKET -> {
                    // Inline Basket! Passing onDismiss mapping to HOME to mimic native behavior without popping app completely
                    BasketPageView(onDismiss = { selectedTab = InnerGroceryTab.HOME })
                }
            }
        }
    }
}

@Composable
fun GroceryBottomNavigationBar(currentTab: InnerGroceryTab, onTabSelected: (InnerGroceryTab) -> Unit, cartCount: Int) {
    Surface(
        color = Color.White,
        shadowElevation = 8.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding() // Ensures safe inset mapping at bottom
                .height(60.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            GroceryNavItem("Grocery", Icons.Default.Home, currentTab == InnerGroceryTab.HOME) {
                onTabSelected(InnerGroceryTab.HOME)
            }
            GroceryNavItem("Categories", Icons.Default.GridView, currentTab == InnerGroceryTab.CATEGORIES) {
                onTabSelected(InnerGroceryTab.CATEGORIES)
            }
            GroceryNavItem("Top Picks", Icons.Default.Star, currentTab == InnerGroceryTab.TOP_PICKS) {
                onTabSelected(InnerGroceryTab.TOP_PICKS)
            }
            GroceryNavItem("Basket", Icons.Default.ShoppingBasket, currentTab == InnerGroceryTab.BASKET, badgeCount = cartCount) {
                onTabSelected(InnerGroceryTab.BASKET)
            }
        }
    }
}

@Composable
private fun GroceryNavItem(
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    badgeCount: Int = 0,
    onClick: () -> Unit
) {
    val color = if (isSelected) Color(0xFF2874F0) else Color(0xFF9CA3AF)

    Column(
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp, horizontal = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
            if (badgeCount > 0) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 8.dp, y = (-4).dp)
                        .background(Color.Red, CircleShape)
                        .defaultMinSize(minWidth = 14.dp, minHeight = 14.dp)
                        .padding(horizontal = 2.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = badgeCount.toString(),
                        color = Color.White,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = title,
            color = color,
            fontSize = 11.sp,
            fontWeight = if (isSelected) FontWeight.Medium else FontWeight.Normal
        )
    }
}
