package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.data.manager.NavigationManager
import com.ecommerceearn.app.data.remote.NetworkClient

@Composable
fun SmartBasketComponent(component: SDUIComponent) {
    var isLoading by remember { mutableStateOf(true) }
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }

    val props = component.props
    val title = props?.getString("title") ?: "YOUR SMART BASKET"
    val saveAmount = props?.getString("saveAmount") ?: "300"
    val backgroundColorHex = props?.getString("backgroundColor") ?: "#FFF9C4"
    val bgColor = safeParseColor(backgroundColorHex)

    val productIds = props?.getArray("productIds")?.map { it.asString } ?: emptyList()

    LaunchedEffect(productIds) {
        if (productIds.isNotEmpty()) {
            isLoading = true
            try {
                val fetchedProducts = mutableListOf<Product>()
                productIds.take(5).forEach { id -> 
                    try {
                        val p = NetworkClient.apiService.getProductById(id)
                        fetchedProducts.add(p)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                products = fetchedProducts
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        } else {
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            shape = RoundedCornerShape(16.dp),
            color = bgColor
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 20.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("YOUR", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF111827))
                        Text(
                            "SMART",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Color.White,
                            modifier = Modifier
                                .background(Color(0xFF111827), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                        Text("BASKET", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF111827))
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text("Save minimum", fontWeight = FontWeight.Medium, fontSize = 10.sp, color = Color(0xFF111827))
                        Text(
                            "₹$saveAmount",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = Color(0xFF111827),
                            modifier = Modifier
                                .background(Color(0xFFFFD700), CircleShape)
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (isLoading) {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(3) {
                            Box(modifier = Modifier.width(140.dp).height(200.dp).background(Color.White.copy(alpha=0.5f), RoundedCornerShape(12.dp)))
                        }
                    }
                } else if (products.isNotEmpty()) {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(products) { product ->
                            GroceryProductCard(product, onClick = {
                                NavigationManager.openGroceryProduct(product.id)
                            })
                        }
                    }
                } else {
                    Text("Your basket is empty", color = Color.Gray, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 16.dp))
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        val subCategoryIds = props?.getArray("subCategoryIds")?.map { it.asString }?.joinToString(",") ?: ""
                        if (subCategoryIds.isNotEmpty()) {
                            NavigationManager.navigate("category://Smart%20Basket?subCategoryId=$subCategoryIds&layout=grocery")
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                        .height(44.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color(0xFF111827))
                ) {
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("View All", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
    }
}
