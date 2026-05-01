package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun SpecialDealNewStyleView(onNavigateBack: () -> Unit = {}) {
    val bgLightGray = Color(0xFFF7F7F7)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgLightGray)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            SpecialDealHeader(onNavigateBack)

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                SpecialDealHero()
                SpecialDealCategories()
                SpecialDealProductGrid()
                Spacer(modifier = Modifier.height(120.dp))
            }
        }
    }
}

@Composable
private fun SpecialDealHeader(onNavigateBack: () -> Unit) {
    val yellowBgColor = Color(0xFFFAC024)

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(yellowBgColor)
            .padding(horizontal = 20.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onNavigateBack) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.Black, modifier = Modifier.size(24.dp))
        }

        Text(
            "Special Deal",
            fontSize = 16.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.Black
        )

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconButton(onClick = {}) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = Color.Black, modifier = Modifier.size(24.dp))
            }
            IconButton(onClick = {}) {
                Box(contentAlignment = Alignment.TopEnd) {
                    Icon(Icons.Default.ShoppingCart, contentDescription = "Cart", tint = Color.Black, modifier = Modifier.size(24.dp))
                    Box(modifier = Modifier.size(14.dp).offset(x = 6.dp, y = (-6).dp).background(Color.Red, CircleShape), contentAlignment = Alignment.Center) {
                        Text("3", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }
    }
}

@Composable
private fun SpecialDealHero() {
    val yellowBgColor = Color(0xFFFAC024)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(280.dp)
            .padding(16.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(yellowBgColor),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuDiudnkGGS8iv8yHHsfCe0T_jPjoBJB-BKtT-G1-O_2qL8l_riR9fE0gVO_g4grD4H9KihNXY3FzuTU4Pzj0Fk7_UVTxCS50ORa8MqJf9Z39zq0rB3vdLyxiVWXfJrGLsx_9JkGVltu2EtEQAj0OeDDf2o5uqIQc2dz4sblUiW5F_GOtlQtTr_uBzTG22UYIJsSVqDfwt-vyHHxPTW76FOKS5Gh0yvkNENaeUnoaKklygpcRkXNZwqpGL8Ltkzwn9POSgL0k-Jle7CL",
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.width(120.dp).height(200.dp).offset(x = (-30).dp).align(Alignment.CenterVertically),
                colorFilter = ColorFilter.tint(Color.White, BlendMode.Multiply)
            )

            AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuCYbSFDGkRQ39hB1urhej9EeN6fynAc1PnGTp0f7f-mqinpAq9p4TIL2DVUx7KlsuMy5qCAkYpYk4uqAC5QCcfJZursg1wr80ShbqNtSOqWCt3UfcvLhKydIv_6VB40uJoaBuQ9x7cN7sS-qIr9r2iBtbUlwp7vPwnRyS4-fbP0k7Ad_a5JOp4NvDBM6Etf6nOsRzMlg_VNa9wnYMy9QQCL3c3-rmvP_da9PJs7pKgcSWtv9KXQCCMLWG8A1ZMNaQGMn4fHtm8aAA2q",
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.width(120.dp).height(200.dp).offset(x = 30.dp).align(Alignment.CenterVertically),
                colorFilter = ColorFilter.tint(Color.White, BlendMode.Multiply)
            )
        }

        Box(
            modifier = Modifier
                .rotate(-2f)
                .shadow(8.dp, RoundedCornerShape(12.dp), spotColor = Color.Black.copy(alpha = 0.1f))
                .background(Color.White, RoundedCornerShape(12.dp))
                .padding(horizontal = 40.dp, vertical = 30.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("SPECIAL DEAL", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 4.sp, color = Color(0xFF333333))
                Text("NEW STYLE", fontSize = 36.sp, fontWeight = FontWeight.Black, letterSpacing = 2.sp, color = Color.Black)
                
                Box(
                    modifier = Modifier
                        .padding(top = 8.dp)
                        .width(140.dp)
                        .height(40.dp)
                        .rotate(-6f)
                        .background(Color(0xFFFA7317)), // Orange
                    contentAlignment = Alignment.Center
                ) {
                    Text("60% OFF", fontSize = 20.sp, fontWeight = FontWeight.Bold, fontStyle = FontStyle.Italic, color = Color.White)
                }
            }
        }
    }
}

@Composable
private fun SpecialDealCategories() {
    var selectedCategory by remember { mutableStateOf("All Items") }
    val categories = listOf("All Items", "Sneakers", "Jackets", "Accessories")

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp)
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        categories.forEach { category ->
            Box(
                modifier = Modifier
                    .clickable { selectedCategory = category }
                    .background(if (selectedCategory == category) Color.Black else Color.White)
                    .border(1.dp, if (selectedCategory == category) Color.Transparent else Color(0xFFE6E6E6))
                    .padding(horizontal = 20.dp, vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    category.uppercase(),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.sp,
                    color = if (selectedCategory == category) Color.White else Color.Black
                )
            }
        }
    }
}

@Composable
private fun SpecialDealProductGrid() {
    // Mock Product Data
    val products = listOf(
        SpecialDealProduct("Urban Runner Sneakers", 120f, 200f, 40, "https://lh3.googleusercontent.com/aida-public/AB6AXuCYbSFDGkRQ39hB1urhej9EeN6fynAc1PnGTp0f7f-mqinpAq9p4TIL2DVUx7KlsuMy5qCAkYpYk4uqAC5QCcfJZursg1wr80ShbqNtSOqWCt3UfcvLhKydIv_6VB40uJoaBuQ9x7cN7sS-qIr9r2iBtbUlwp7vPwnRyS4-fbP0k7Ad_a5JOp4NvDBM6Etf6nOsRzMlg_VNa9wnYMy9QQCL3c3-rmvP_da9PJs7pKgcSWtv9KXQCCMLWG8A1ZMNaQGMn4fHtm8aAA2q"),
        SpecialDealProduct("Streetwear Jacket", 85f, 150f, 43, "https://lh3.googleusercontent.com/aida-public/AB6AXuDiudnkGGS8iv8yHHsfCe0T_jPjoBJB-BKtT-G1-O_2qL8l_riR9fE0gVO_g4grD4H9KihNXY3FzuTU4Pzj0Fk7_UVTxCS50ORa8MqJf9Z39zq0rB3vdLyxiVWXfJrGLsx_9JkGVltu2EtEQAj0OeDDf2o5uqIQc2dz4sblUiW5F_GOtlQtTr_uBzTG22UYIJsSVqDfwt-vyHHxPTW76FOKS5Gh0yvkNENaeUnoaKklygpcRkXNZwqpGL8Ltkzwn9POSgL0k-Jle7CL"),
        SpecialDealProduct("Midnight Run Cap", 25f, 45f, 44, "https://lh3.googleusercontent.com/aida-public/AB6AXuCYbSFDGkRQ39hB1urhej9EeN6fynAc1PnGTp0f7f-mqinpAq9p4TIL2DVUx7KlsuMy5qCAkYpYk4uqAC5QCcfJZursg1wr80ShbqNtSOqWCt3UfcvLhKydIv_6VB40uJoaBuQ9x7cN7sS-qIr9r2iBtbUlwp7vPwnRyS4-fbP0k7Ad_a5JOp4NvDBM6Etf6nOsRzMlg_VNa9wnYMy9QQCL3c3-rmvP_da9PJs7pKgcSWtv9KXQCCMLWG8A1ZMNaQGMn4fHtm8aAA2q"),
        SpecialDealProduct("Classic High Tops", 90f, 180f, 50, "https://lh3.googleusercontent.com/aida-public/AB6AXuDiudnkGGS8iv8yHHsfCe0T_jPjoBJB-BKtT-G1-O_2qL8l_riR9fE0gVO_g4grD4H9KihNXY3FzuTU4Pzj0Fk7_UVTxCS50ORa8MqJf9Z39zq0rB3vdLyxiVWXfJrGLsx_9JkGVltu2EtEQAj0OeDDf2o5uqIQc2dz4sblUiW5F_GOtlQtTr_uBzTG22UYIJsSVqDfwt-vyHHxPTW76FOKS5Gh0yvkNENaeUnoaKklygpcRkXNZwqpGL8Ltkzwn9POSgL0k-Jle7CL")
    )

    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        for (i in products.indices step 2) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Box(modifier = Modifier.weight(1f)) {
                    SpecialDealProductCard(products[i])
                }
                Box(modifier = Modifier.weight(1f)) {
                    if (i + 1 < products.size) {
                        SpecialDealProductCard(products[i + 1])
                    }
                }
            }
        }
    }
}

data class SpecialDealProduct(val name: String, val price: Float, val mrp: Float, val discount: Int, val imageUrl: String)

@Composable
private fun SpecialDealProductCard(product: SpecialDealProduct) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .border(1.dp, Color(0xFFF2F2F2))
    ) {
        Box(modifier = Modifier.fillMaxWidth().height(200.dp)) {
            AsyncImage(
                model = product.imageUrl,
                contentDescription = product.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize().background(Color.Gray.copy(alpha = 0.1f))
            )

            if (product.discount > 0) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .background(Color.Red, RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text("${product.discount}% OFF", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
        }

        Column(modifier = Modifier.padding(16.dp).padding(bottom = 8.dp)) {
            Text(product.name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Black, maxLines = 1, modifier = Modifier.padding(top = 4.dp))
            
            Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("₹${product.price.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color.Black)
                if (product.mrp > product.price) {
                    Text("₹${product.mrp.toInt()}", fontSize = 12.sp, color = Color.Gray, textDecoration = TextDecoration.LineThrough)
                }
            }
        }

        Button(
            onClick = {},
            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 16.dp).border(1.5.dp, Color.Black),
            shape = RoundedCornerShape(0.dp) // Square button in iOS
        ) {
            Text("ADD TO CART", fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp, color = Color.Black)
        }
    }
}
