package com.ecommerceearn.app.ui.pages

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.NumberFormat
import java.util.*

@Composable
fun PaymentView(
    totalAmount: Double,
    discount: Double,
    _itemCount: Int,
    onBack: () -> Unit,
    onPaymentSelect: (String) -> Unit,
    isLoading: Boolean
) {
    var isTotalExpanded by remember { mutableStateOf(false) }
    var expandedSection by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.size(32.dp)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text("Step 3 of 3", fontSize = 12.sp, color = Color(0xFF6B7280))
                Text("Payments", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            }
            Spacer(modifier = Modifier.weight(1f))
            Row(
                modifier = Modifier
                    .background(Color(0xFFF3F4F6), RoundedCornerShape(4.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Lock, contentDescription = "Secure", tint = Color(0xFF4B5563), modifier = Modifier.size(10.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("100% Secure", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF4B5563))
            }
        }
        HorizontalDivider(color = Color(0xFFE5E7EB))

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // Total Amount Card
            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 16.dp)
                    .background(Color(0xFFEFF6FF), RoundedCornerShape(8.dp))
                    .border(1.dp, Color(0xFFDBEAFE), RoundedCornerShape(8.dp))
                    .clickable { isTotalExpanded = !isTotalExpanded }
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Total Amount", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF2563EB))
                    Icon(
                        imageVector = if (isTotalExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = null,
                        tint = Color(0xFF2563EB),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Text("₹${formatPrice(totalAmount)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2563EB))
                }

                AnimatedVisibility(visible = isTotalExpanded, enter = expandVertically(), exit = shrinkVertically()) {
                    Column(modifier = Modifier.padding(top = 12.dp)) {
                        HorizontalDivider(color = Color(0xFFBFDBFE))
                        Row(modifier = Modifier.padding(top = 8.dp)) {
                            Text("Price", fontSize = 14.sp, color = Color(0xFF4B5563))
                            Spacer(modifier = Modifier.weight(1f))
                            Text("₹${formatPrice(totalAmount + discount)}", fontSize = 14.sp, color = Color(0xFF1F2937))
                        }
                        Row(modifier = Modifier.padding(top = 4.dp)) {
                            Text("Discount", fontSize = 14.sp, color = Color(0xFF4B5563))
                            Spacer(modifier = Modifier.weight(1f))
                            Text("- ₹${formatPrice(discount)}", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF059669))
                        }
                    }
                }
            }

            if (discount > 0) {
                Row(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .padding(bottom = 16.dp)
                        .background(Color(0xFFECFDF5), RoundedCornerShape(8.dp))
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Instant Discount", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF065F46))
                        Text("Claim now with payment offers", fontSize = 12.sp, color = Color(0xFF047857))
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    Box(modifier = Modifier.size(24.dp).background(Color.White, CircleShape).shadow(1.dp, CircleShape), contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Sell, contentDescription = null, tint = Color(0xFF047857), modifier = Modifier.size(12.dp))
                    }
                }
            }

            Text(
                "Payment Options",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151),
                modifier = Modifier.padding(horizontal = 16.dp).padding(bottom = 12.dp)
            )

            // Pay Online Card
            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp).padding(bottom = 12.dp)
                    .background(Color.White, RoundedCornerShape(8.dp))
                    .shadow(2.dp, RoundedCornerShape(8.dp))
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(bottom = 16.dp)) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFF002E6E), modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Pay Online", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                        Text("UPI, Cards, Wallet, NetBanking", fontSize = 12.sp, color = Color(0xFF6B7280))
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        "Recommended",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.background(Color(0xFFBE123C), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }

                Button(
                    onClick = { if (!isLoading) onPaymentSelect("RAZORPAY") },
                    enabled = !isLoading,
                    modifier = Modifier.fillMaxWidth().height(44.dp),
                    shape = RoundedCornerShape(6.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = if (isLoading) Color(0xFF93C5FD) else Color(0xFF2563EB))
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Processing...")
                    } else {
                        Text("Pay Now")
                    }
                }
            }

            // Saved Payment Options
            PaymentAccordionView(
                id = "saved",
                icon = Icons.Default.Schedule,
                title = "Saved Payment Options",
                expandedSection = expandedSection,
                onToggle = { expandedSection = if (expandedSection == "saved") null else "saved" }
            ) {
                Text("No saved cards found.", fontSize = 13.sp, color = Color(0xFF9CA3AF))
            }

            // Cash on Delivery
            PaymentAccordionView(
                id = "cod",
                icon = Icons.Default.LocalAtm,
                title = "Cash on Delivery",
                expandedSection = expandedSection,
                onToggle = { expandedSection = if (expandedSection == "cod") null else "cod" }
            ) {
                Button(
                    onClick = { onPaymentSelect("COD") },
                    modifier = Modifier.fillMaxWidth().height(44.dp),
                    shape = RoundedCornerShape(6.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                ) {
                    Text("Place Order", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
            
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Composable
fun PaymentAccordionView(
    id: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String? = null,
    offerText: String? = null,
    expandedSection: String?,
    onToggle: () -> Unit,
    content: @Composable () -> Unit
) {
    val isExpanded = expandedSection == id
    Column(modifier = Modifier.background(Color.White)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(if (isExpanded) Color(0xFFF9FAFB) else Color.White)
                .clickable { onToggle() }
                .padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF374151), modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(title, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                subtitle?.let { Text(it, fontSize = 12.sp, color = Color(0xFF6B7280)) }
                offerText?.let { Text(it, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Color(0xFF16A34A)) }
            }
            Spacer(modifier = Modifier.weight(1f))
            Icon(
                imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                contentDescription = null,
                tint = Color(0xFF6B7280),
                modifier = Modifier.size(14.dp)
            )
        }

        AnimatedVisibility(visible = isExpanded, enter = expandVertically(), exit = shrinkVertically()) {
            Box(modifier = Modifier.background(Color.White).padding(start = 48.dp, end = 16.dp, bottom = 16.dp, top = 4.dp)) {
                content()
            }
        }
    }
}

private fun formatPrice(price: Double): String {
    val format = NumberFormat.getNumberInstance(Locale("en", "IN"))
    format.maximumFractionDigits = 0
    return format.format(price)
}
