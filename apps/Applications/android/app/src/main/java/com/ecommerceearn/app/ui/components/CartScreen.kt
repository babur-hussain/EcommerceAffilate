package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.BasketManager
import com.ecommerceearn.app.data.manager.CartItem
import com.ecommerceearn.app.data.manager.CartManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(onBackClick: () -> Unit) {
    var selectedTab by remember { mutableStateOf("Shopping") }
    val cartItems by CartManager.items.collectAsState()
    val basketItems by BasketManager.items.collectAsState()

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // --- Header ---
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick, modifier = Modifier.size(24.dp).padding(end = 8.dp)) {
                Icon(Icons.Default.KeyboardArrowLeft, contentDescription = "Back", tint = Color.Black)
            }
            Text(
                text = if (selectedTab == "Shopping") "My Cart" else "My Basket (${BasketManager.basketCount} Items)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF212121)
            )
        }

        // --- Tabs ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .shadow(elevation = 2.dp, shape = RoundedCornerShape(0.dp))
        ) {
            // Shopping Tab
            Column(
                modifier = Modifier
                    .weight(1f)
                    .clickable { selectedTab = "Shopping" },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Shopping (${CartManager.cartCount})",
                    fontSize = 14.sp,
                    fontWeight = if (selectedTab == "Shopping") FontWeight.SemiBold else FontWeight.Medium,
                    color = if (selectedTab == "Shopping") Color(0xFF2874F0) else Color(0xFF212121),
                    modifier = Modifier.padding(vertical = 12.dp)
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.dp)
                        .background(if (selectedTab == "Shopping") Color(0xFF2874F0) else Color.Transparent)
                )
            }

            // Grocery Tab
            Column(
                modifier = Modifier
                    .weight(1f)
                    .clickable { selectedTab = "Grocery" },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Grocery",
                    fontSize = 14.sp,
                    fontWeight = if (selectedTab == "Grocery") FontWeight.SemiBold else FontWeight.Medium,
                    color = if (selectedTab == "Grocery") Color(0xFF2874F0) else Color(0xFF212121),
                    modifier = Modifier.padding(vertical = 12.dp)
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.dp)
                        .background(if (selectedTab == "Grocery") Color(0xFF2874F0) else Color.Transparent)
                )
            }
        }

        // --- Content ---
        if (selectedTab == "Shopping") {
            ShoppingView(cartItems, CartManager.cartTotal, CartManager.cartCount)
        } else {
            GroceryView(basketItems, BasketManager.basketTotal, BasketManager.basketSavings)
        }
    }
}

// MARK: - Shopping View
@Composable
fun ShoppingView(cartItems: List<CartItem>, cartTotal: Double, cartCount: Int) {
    if (cartItems.isEmpty()) {
        EmptyStandardCartView()
    } else {
        Column(modifier = Modifier.fillMaxSize()) {
            // Address Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(12.dp),
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Deliver to: ", fontSize = 14.sp, color = Color.Black)
                        Text("Main Address", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.Black)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            "HOME",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF666666),
                            modifier = Modifier
                                .background(Color(0xFFF0F0F0), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Select your location to see delivery options", fontSize = 13.sp, color = Color(0xFF878787))
                }
                
                Button(
                    onClick = { /* Change Address */ },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.border(1.dp, Color(0xFFE0E0E0), RoundedCornerShape(4.dp))
                ) {
                    Text("Change", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF2874F0))
                }
            }

            Spacer(modifier = Modifier.height(8.dp).fillMaxWidth().background(Color(0xFFF1F3F6)))

            LazyColumn(modifier = Modifier.weight(1f).background(Color(0xFFF1F3F6))) {
                items(cartItems) { item ->
                    StandardCartItemView(item)
                    Spacer(modifier = Modifier.height(8.dp))
                }
                item {
                    PriceDetailsView(cartTotal, cartCount)
                    Spacer(modifier = Modifier.height(100.dp))
                }
            }

            // Bottom Bar
            Surface(shadowElevation = 8.dp, color = Color.White) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.padding(start = 10.dp)) {
                        if (cartTotal < 10000) {
                            Text(
                                "₹${(cartTotal * 1.1).toInt()}",
                                fontSize = 12.sp,
                                color = Color(0xFF878787),
                                textDecoration = TextDecoration.LineThrough
                            )
                        }
                        Text("₹${cartTotal.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF212121))
                    }
                    
                    Button(
                        onClick = { /* checkout */ },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFB641B)),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.width(160.dp).height(48.dp)
                    ) {
                        Text("Place Order", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                    }
                }
            }
        }
    }
}

// MARK: - Grocery View
@Composable
fun GroceryView(basketItems: List<CartItem>, basketTotal: Double, basketSavings: Double) {
    if (basketItems.isEmpty()) {
        BasketEmptyStateView()
    } else {
        Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
            LazyColumn(modifier = Modifier.weight(1f)) {
                // Delivery Banner Placeholder
                item {
                    Box(modifier = Modifier.padding(16.dp).fillMaxWidth().background(Color(0xFFE8F5E9), RoundedCornerShape(8.dp)).padding(16.dp)) {
                        Text("Delivery in 10 mins", color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                    }
                }
                
                items(basketItems) { item ->
                    BasketItemCell(item)
                    HorizontalDivider()
                }

                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                        BillDetailsViewGrocery(basketTotal)
                    }
                }

                if (basketSavings > 0) {
                    item {
                        Box(modifier = Modifier.padding(16.dp).fillMaxWidth().background(Color(0xFFE8F5E9), RoundedCornerShape(8.dp)).padding(16.dp)) {
                            Text("You saved ₹${basketSavings.toInt()} on this order!", color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                        }
                    }
                }
                
                item { Spacer(modifier = Modifier.height(80.dp)) }
            }

            // Checkout Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Total", fontSize = 12.sp, color = Color(0xFF6B7280))
                    Text("₹${(basketTotal + 2).toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                }

                Button(
                    onClick = { /* proceed */ },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF15803D)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Proceed to Pay", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.White)
                    }
                }
            }
        }
    }
}

// MARK: - Supporting Components

@Composable
fun EmptyStandardCartView() {
    Column(
        modifier = Modifier.fillMaxSize().background(Color.White),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(Icons.Outlined.ShoppingCart, contentDescription = null, modifier = Modifier.size(60.dp), tint = Color(0xFFC2C2C2))
        Spacer(modifier = Modifier.height(24.dp))
        Text("Your Cart is empty", fontSize = 18.sp, fontWeight = FontWeight.Medium, color = Color(0xFF212121))
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = { /* Shop Now */ },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
            shape = RoundedCornerShape(4.dp),
            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 10.dp)
        ) {
            Text("Shop now", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color.White)
        }
    }
}

@Composable
fun BasketEmptyStateView() {
    Column(
        modifier = Modifier.fillMaxSize().background(Color.White),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(Icons.Outlined.ShoppingCart, contentDescription = null, modifier = Modifier.size(60.dp), tint = Color(0xFFC2C2C2))
        Spacer(modifier = Modifier.height(24.dp))
        Text("Your Basket is empty", fontSize = 18.sp, fontWeight = FontWeight.Medium, color = Color(0xFF212121))
    }
}

@Composable
fun StandardCartItemView(item: CartItem) {
    val mrp = item.product.mrp ?: (item.product.price * 1.2)
    val discountPercent = if (mrp > item.product.price) ((mrp - item.product.price) / mrp * 100).toInt() else 0

    Column(modifier = Modifier.fillMaxWidth().background(Color.White)) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.Top) {
            // Image + Qty Selector
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(100.dp)) {
                AsyncImage(
                    model = item.product.images.firstOrNull(),
                    contentDescription = null,
                    modifier = Modifier.size(80.dp).padding(bottom = 8.dp),
                    contentScale = ContentScale.Fit
                )
                Row(
                    modifier = Modifier.border(1.dp, Color(0xFFE0E0E0)).padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Qty: ${item.quantity}", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF212121))
                    // Down Arrow icon missing natively without wrapping, just text is fine
                }
            }

            // Details
            Column(modifier = Modifier.padding(start = 12.dp)) {
                Text(item.product.displayName, fontSize = 14.sp, color = Color(0xFF212121), maxLines = 2, overflow = TextOverflow.Ellipsis)
                
                Spacer(modifier = Modifier.height(6.dp))

                // Rating
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Row(
                        modifier = Modifier.background(Color(0xFF388E3C), RoundedCornerShape(3.dp)).padding(horizontal = 6.dp, vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("4.5", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text(" ★", fontSize = 8.sp, color = Color.White)
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("(120)", fontSize = 12.sp, color = Color(0xFF878787))
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (discountPercent > 0) {
                        Text("$discountPercent% off", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF388E3C))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("₹${mrp.toInt()}", fontSize = 13.sp, color = Color(0xFF878787), textDecoration = TextDecoration.LineThrough)
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    Text("₹${item.product.price.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF212121))
                }

                if (mrp > item.product.price) {
                    Text("Best Price Applied", fontSize = 12.sp, color = Color(0xFF2874F0))
                }

                Spacer(modifier = Modifier.height(6.dp))
                Row {
                    Text("Standard Delivery", fontSize = 12.sp, color = Color(0xFF212121))
                    Text(" | ", fontSize = 12.sp, color = Color(0xFFE0E0E0))
                    Text("Free", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF388E3C))
                }
            }
        }

        Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Color(0xFFF0F0F0)))

        Row(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            Button(
                onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent), modifier = Modifier.weight(1f)
            ) {
                Text("Save", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF878787))
            }
            Box(modifier = Modifier.width(1.dp).height(30.dp).background(Color(0xFFF0F0F0)))
            Button(
                onClick = { CartManager.removeFromCart(item.productId) }, colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent), modifier = Modifier.weight(1f)
            ) {
                Text("Remove", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF878787))
            }
            Box(modifier = Modifier.width(1.dp).height(30.dp).background(Color(0xFFF0F0F0)))
            Row(modifier = Modifier.weight(1f), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(28.dp).border(1.dp, Color(0xFFE0E0E0), CircleShape).clickable { CartManager.updateQuantity(item.productId, item.quantity - 1) }, contentAlignment = Alignment.Center) {
                    Text("-", color = Color(0xFF212121))
                }
                Spacer(modifier = Modifier.width(16.dp))
                Box(modifier = Modifier.size(28.dp).border(1.dp, Color(0xFFE0E0E0), CircleShape).clickable { CartManager.updateQuantity(item.productId, item.quantity + 1) }, contentAlignment = Alignment.Center) {
                    Text("+", color = Color(0xFF212121))
                }
            }
        }
    }
}

@Composable
fun BasketItemCell(item: CartItem) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp, horizontal = 16.dp), verticalAlignment = Alignment.CenterVertically) {
        AsyncImage(
            model = item.product.images.firstOrNull(),
            contentDescription = null,
            modifier = Modifier.size(60.dp),
            contentScale = ContentScale.Fit
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(item.product.displayName, fontSize = 14.sp, color = Color(0xFF111827))
            Spacer(modifier = Modifier.height(4.dp))
            Text("₹${item.product.price.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.background(Color(0xFF15803D), RoundedCornerShape(4.dp))) {
            IconButton(onClick = { BasketManager.updateQuantity(item.productId, item.quantity - 1)}, modifier = Modifier.size(30.dp)) { Text("-", color = Color.White) }
            Text("${item.quantity}", color = Color.White)
            IconButton(onClick = { BasketManager.updateQuantity(item.productId, item.quantity + 1)}, modifier = Modifier.size(30.dp)) { Text("+", color = Color.White) }
        }
    }
}

@Composable
fun PriceDetailsView(totalPrice: Double, count: Int) {
    Column(modifier = Modifier.fillMaxWidth().padding(top = 8.dp).background(Color.White)) {
        Box(modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFFF0F0F0)).padding(16.dp)) {
            Text("Price Details", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF878787))
        }
        Column(modifier = Modifier.padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Price ($count items)", fontSize = 14.sp, color = Color(0xFF212121))
                Text("₹${totalPrice.toInt()}", fontSize = 14.sp, color = Color(0xFF212121))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Delivery Charges", fontSize = 14.sp, color = Color(0xFF212121))
                Text("FREE", fontSize = 14.sp, color = Color(0xFF388E3C))
            }
            Box(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp).height(1.dp).background(Color(0xFFF0F0F0)))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Total Amount", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF212121))
                Text("₹${totalPrice.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF212121))
            }
        }
    }
}

@Composable
fun BillDetailsViewGrocery(totalPrice: Double) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White, RoundedCornerShape(8.dp)).border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(8.dp)).padding(16.dp)) {
        Text("Bill details", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        Spacer(modifier = Modifier.height(12.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Item total", fontSize = 14.sp, color = Color(0xFF4B5563))
            Text("₹${totalPrice.toInt()}", fontSize = 14.sp, color = Color(0xFF111827))
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Handling fee", fontSize = 14.sp, color = Color(0xFF4B5563))
            Text("₹2", fontSize = 14.sp, color = Color(0xFF111827))
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Delivery", fontSize = 14.sp, color = Color(0xFF4B5563))
            Text("FREE", fontSize = 14.sp, color = Color(0xFF15803D), fontWeight = FontWeight.Medium)
        }
    }
}
