package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage // Ensure Coil is available or use standard Image
import com.ecommerceearn.app.data.manager.CartManager
import com.ecommerceearn.app.data.model.CartItem
import com.ecommerceearn.app.data.model.Product

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(onBackClick: () -> Unit) {
    val cart by CartManager.cartState.collectAsState()
    val cartItems = cart.items

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF1F3F6))) {
        // --- Header ---
        SmallTopAppBar(
            title = { Text("My Cart (${CartManager.getCount()})", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(Icons.Default.KeyboardArrowLeft, contentDescription = "Back")
                }
            },
            colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color.White)
        )

        if (cartItems.isEmpty()) {
            EmptyCartView()
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                items(cartItems) { item ->
                    CartItemView(item)
                }
                
                item {
                    PriceDetailsView(cartItems)
                }
                
                item {
                    SafePaymentBanner()
                }
            }
            
            BottomCheckoutBar(totalAmount = cart.totalAmount)
        }
    }
}

@Composable
fun EmptyCartView() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            Icons.Outlined.ShoppingCart,
            contentDescription = null,
            modifier = Modifier.size(100.dp),
            tint = Color(0xFFE0E0E0)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text("Your cart is empty!", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Add items to it now.", color = Color.Gray)
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = { /* Navigate Home */ },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0))
        ) {
            Text("Shop Now")
        }
    }
}

@Composable
fun CartItemView(item: CartItem) {
    val product = item.productId
    
    // Calculate Discount (Mock logic matching RN if MRP usually missing in model but present in UI logic)
    // Assuming Product model has MRP. If not, fallback same as Price
    val mrp = product.mrp ?: (product.price * 1.2) // Mock 20% markup if missing for visuals
    val discountPercent = if (mrp > product.price) ((mrp - product.price) / mrp * 100).toInt() else 0
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 8.dp)
            .background(Color.White)
    ) {
        Row(modifier = Modifier.padding(12.dp)) {
            // Image
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .padding(4.dp)
            ) {
                 AsyncImage(
                    model = product.images.firstOrNull(),
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }
            
            Spacer(modifier = Modifier.width(12.dp))
            
            // Details
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = product.displayName,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    fontSize = 14.sp,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(4.dp))
                
                // Rating Row (Mock)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "4.5 ★",
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .background(Color(0xFF388E3C), RoundedCornerShape(2.dp))
                            .padding(horizontal = 4.dp, vertical = 2.dp)
                    )
                    Text(" (125)", color = Color.Gray, fontSize = 12.sp, modifier = Modifier.padding(start = 4.dp))
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Price Row
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "₹${product.price.toInt()}",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "₹${mrp.toInt()}",
                        fontSize = 12.sp,
                        color = Color.Gray,
                        textDecoration = TextDecoration.LineThrough
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    if (discountPercent > 0) {
                         Text(
                            text = "$discountPercent% off",
                            fontSize = 12.sp,
                            color = Color(0xFF388E3C),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
        
        Divider(color = Color(0xFFF0F0F0))
        
        // Actions Row
        Row(
            modifier = Modifier.fillMaxWidth().height(48.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Quantity Control
            Row(
                 modifier = Modifier.weight(1f),
                 horizontalArrangement = Arrangement.Center,
                 verticalAlignment = Alignment.CenterVertically
            ) {
                // Decrease / Rmove
                IconButton(
                    onClick = { 
                        if (item.quantity > 1) CartManager.updateQuantity(product.id, item.quantity - 1)
                        else CartManager.removeFromCart(product.id)
                    },
                    modifier = Modifier.size(30.dp).border(1.dp, Color(0xFFE0E0E0), RoundedCornerShape(15.dp))
                ) {
                    Text("-", fontWeight = FontWeight.Bold, color = Color.Black)
                }
                
                Text(
                    text = "${item.quantity}",
                    modifier = Modifier.padding(horizontal = 16.dp),
                    fontWeight = FontWeight.Bold
                )
                
                IconButton(
                    onClick = { CartManager.addToCart(product, 1) }, 
                    modifier = Modifier.size(30.dp).border(1.dp, Color(0xFFE0E0E0), RoundedCornerShape(15.dp))
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                }
            }
            
            Divider(modifier = Modifier.width(1.dp).fillMaxHeight().padding(vertical = 8.dp), color = Color(0xFFF0F0F0))
            
            // Remove Button
             Box(
                 modifier = Modifier.weight(1f).clickable { CartManager.removeFromCart(product.id) },
                 contentAlignment = Alignment.Center
             ) {
                 Row(verticalAlignment = Alignment.CenterVertically) {
                     Icon(Icons.Default.Delete, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(18.dp))
                     Spacer(modifier = Modifier.width(4.dp))
                     Text("Check Later", color = Color.Gray, fontSize = 14.sp) // Matching "Save for later" or Remove
                 }
             }
        }
    }
}

@Composable
fun PriceDetailsView(cartItems: List<CartItem>) {
    val totalOriginal = cartItems.sumOf { (it.productId.mrp ?: (it.productId.price * 1.2)) * it.quantity }
    val totalPrice = cartItems.sumOf { it.productId.price * it.quantity }
    val discount = totalOriginal - totalPrice
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text("PRICE DETAILS", fontSize = 14.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))
        
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
             Text("Price (${cartItems.size} items)", fontSize = 14.sp)
             Text("₹${totalOriginal.toInt()}", fontSize = 14.sp)
        }
        Spacer(modifier = Modifier.height(12.dp))
        
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
             Text("Discount", fontSize = 14.sp)
             Text("-₹${discount.toInt()}", fontSize = 14.sp, color = Color(0xFF388E3C))
        }
        Spacer(modifier = Modifier.height(12.dp))
        
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
             Text("Delivery Charges", fontSize = 14.sp)
             Text("FREE", fontSize = 14.sp, color = Color(0xFF388E3C))
        }
        
        Divider(Modifier.padding(vertical = 16.dp))
        
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
             Text("Total Amount", fontSize = 18.sp, fontWeight = FontWeight.Bold)
             Text("₹${totalPrice.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        Text("You will save ₹${discount.toInt()} on this order", color = Color(0xFF388E3C), fontSize = 12.sp, fontWeight = FontWeight.Bold)
    }
}


@Composable
fun SafePaymentBanner() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Outlined.ShoppingCart, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(20.dp)) // Shield icon usually
        Spacer(modifier = Modifier.width(8.dp))
        Text("Safe and Secure payments. 100% Authentic products.", color = Color.Gray, fontSize = 12.sp)
    }
}

@Composable
fun BottomCheckoutBar(totalAmount: Double) {
    Surface(
        shadowElevation = 16.dp,
        color = Color.White
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text("₹${totalAmount.toInt()}", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text("View Detailed Bill", fontSize = 12.sp, color = Color(0xFF2874F0), fontWeight = FontWeight.Bold)
            }
            
            Button(
                onClick = { /* Check out */ },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFB641B)), // Orange Color
                shape = RoundedCornerShape(4.dp),
                modifier = Modifier.width(150.dp).height(45.dp)
            ) {
                Text("Place Order", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}
