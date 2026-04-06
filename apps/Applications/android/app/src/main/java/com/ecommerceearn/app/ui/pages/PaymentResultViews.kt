package com.ecommerceearn.app.ui.pages

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun PaymentSuccessView(
    orderNumber: String?,
    amount: Double,
    onContinueShopping: () -> Unit,
    onViewOrder: () -> Unit
) {
    var showContent by remember { mutableStateOf(false) }
    var showButtons by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(800)
        showContent = true
        delay(400)
        showButtons = true
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFFF0FDF4), Color.White, Color.White)
                )
            )
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.weight(1f))

            // Animated icon section
            val infiniteTransition = rememberInfiniteTransition()
            val scale by infiniteTransition.animateFloat(
                initialValue = 1f, targetValue = 1.1f,
                animationSpec = infiniteRepeatable(tween(1000, easing = LinearEasing), repeatMode = RepeatMode.Reverse)
            )

            Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(bottom = 16.dp)) {
                Box(modifier = Modifier.size(240.dp).scale(scale).background(Color(0x1F22C55E), CircleShape))
                Icon(Icons.Default.CheckCircle, contentDescription = "Success", tint = Color(0xFF22C55E), modifier = Modifier.size(120.dp))
            }

            if (showContent) {
                Text("Payment Successful!", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827), modifier = Modifier.padding(bottom = 6.dp))
                Text("Your order has been placed successfully", fontSize = 15.sp, color = Color(0xFF6B7280), modifier = Modifier.padding(bottom = 24.dp))

                Column(
                    modifier = Modifier
                        .padding(horizontal = 24.dp, vertical = 8.dp)
                        .background(Color(0xFFF9FAFB), RoundedCornerShape(14.dp))
                        .shadow(4.dp, RoundedCornerShape(14.dp))
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    orderNumber?.let {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Numbers, contentDescription = null, tint = Color(0xFF9CA3AF), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Order ID", fontSize = 14.sp, color = Color(0xFF6B7280))
                            Spacer(modifier = Modifier.weight(1f))
                            Text("#${it.takeLast(8).uppercase()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, color = Color(0xFF111827))
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.CurrencyRupee, contentDescription = null, tint = Color(0xFF22C55E), modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Amount Paid", fontSize = 14.sp, color = Color(0xFF6B7280))
                        Spacer(modifier = Modifier.weight(1f))
                        Text("₹${String.format("%.2f", amount)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF22C55E))
                    }

                    Divider(color = Color(0xFFE5E7EB))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocalShipping, contentDescription = null, tint = Color(0xFF3B82F6), modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Estimated delivery: 3-5 business days", fontSize = 13.sp, color = Color(0xFF6B7280))
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            if (showButtons) {
                Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 40.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = onViewOrder,
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF22C55E))
                    ) {
                        Text("View Order", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    Button(
                        onClick = onContinueShopping,
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF3F4F6))
                    ) {
                        Text("Continue Shopping", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF374151))
                    }
                }
            }
        }
    }
}

@Composable
fun PaymentFailedView(
    orderId: String?,
    amount: Double,
    onRetry: () -> Unit,
    onCancel: () -> Unit
) {
    var showContent by remember { mutableStateOf(false) }
    var showButtons by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(800)
        showContent = true
        delay(400)
        showButtons = true
    }

    Box(
        modifier = Modifier.fillMaxSize().background(brush = Brush.verticalGradient(colors = listOf(Color(0xFFFEF2F2), Color.White, Color.White)))
    ) {
        Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
            Spacer(modifier = Modifier.weight(1f))

            Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(bottom = 16.dp)) {
                Box(modifier = Modifier.size(240.dp).background(Color(0x19EF4444), CircleShape))
                Icon(Icons.Default.Error, contentDescription = "Failed", tint = Color(0xFFEF4444), modifier = Modifier.size(120.dp))
            }

            if (showContent) {
                Text("Payment Failed", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color(0xFFDC2626), modifier = Modifier.padding(bottom = 6.dp))
                Text("Your payment could not be processed.\nPlease try again.", fontSize = 15.sp, color = Color(0xFF6B7280), textAlign = TextAlign.Center, modifier = Modifier.padding(bottom = 24.dp))

                Column(
                    modifier = Modifier
                        .padding(horizontal = 24.dp, vertical = 8.dp)
                        .background(Color(0xFFFEF2F2), RoundedCornerShape(14.dp))
                        .border(1.dp, Color(0xFFFECACA), RoundedCornerShape(14.dp))
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    orderId?.let {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Order ID", fontSize = 14.sp, color = Color(0xFF6B7280))
                            Spacer(modifier = Modifier.weight(1f))
                            Text("#${it.takeLast(8).uppercase()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, color = Color(0xFF111827))
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Amount", fontSize = 14.sp, color = Color(0xFF6B7280))
                        Spacer(modifier = Modifier.weight(1f))
                        Text("₹${String.format("%.2f", amount)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFFEF4444))
                    }

                    Divider(color = Color(0xFFFECACA))
                    Text("If money was debited, it will be refunded within 5-7 business days", fontSize = 12.sp, color = Color(0xFF6B7280))
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            if (showButtons) {
                Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 40.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = onRetry,
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                    ) {
                        Text("Retry Payment", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    Button(
                        onClick = onCancel,
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFEF2F2))
                    ) {
                        Text("Cancel Order", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFEF4444))
                    }
                }
            }
        }
    }
}

@Composable
fun PaymentCancelledView(
    orderId: String?,
    amount: Double,
    onRetry: () -> Unit,
    onGoBack: () -> Unit
) {
    var showContent by remember { mutableStateOf(false) }
    var showButtons by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(600)
        showContent = true
        delay(400)
        showButtons = true
    }

    Box(
        modifier = Modifier.fillMaxSize().background(brush = Brush.verticalGradient(colors = listOf(Color(0xFFFFFBEB), Color.White, Color.White)))
    ) {
        Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
            Spacer(modifier = Modifier.weight(1f))

            Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(bottom = 20.dp)) {
                Box(modifier = Modifier.size(240.dp).background(Color(0x1EF59E0B), CircleShape))
                Icon(Icons.Default.Warning, contentDescription = "Cancelled", tint = Color(0xFFF59E0B), modifier = Modifier.size(120.dp))
            }

            if (showContent) {
                Text("Payment Cancelled", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color(0xFFB45309), modifier = Modifier.padding(bottom = 6.dp))
                Text("You closed the payment window.\nNo money has been deducted.", fontSize = 15.sp, color = Color(0xFF6B7280), textAlign = TextAlign.Center, modifier = Modifier.padding(bottom = 24.dp))

                Column(
                    modifier = Modifier
                        .padding(horizontal = 24.dp, vertical = 8.dp)
                        .background(Color(0xFFFFFBEB), RoundedCornerShape(14.dp))
                        .border(1.dp, Color(0xFFFDE68A), RoundedCornerShape(14.dp))
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    orderId?.let {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Order ID", fontSize = 14.sp, color = Color(0xFF6B7280))
                            Spacer(modifier = Modifier.weight(1f))
                            Text("#${it.takeLast(8).uppercase()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, color = Color(0xFF111827))
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Amount", fontSize = 14.sp, color = Color(0xFF6B7280))
                        Spacer(modifier = Modifier.weight(1f))
                        Text("₹${String.format("%.2f", amount)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFFB45309))
                    }

                    Divider(color = Color(0xFFFDE68A))
                    Text("Your order is saved. Complete payment to confirm it.", fontSize = 12.sp, color = Color(0xFF6B7280))
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            if (showButtons) {
                Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 40.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = onRetry,
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B))
                    ) {
                        Text("Retry Payment", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    Button(
                        onClick = onGoBack,
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF3F4F6))
                    ) {
                        Text("Go Back", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF374151))
                    }
                }
            }
        }
    }
}
