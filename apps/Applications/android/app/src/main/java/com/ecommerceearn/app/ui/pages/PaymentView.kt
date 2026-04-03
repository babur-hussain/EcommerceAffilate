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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import com.ecommerceearn.app.ui.viewmodel.CheckoutViewModel

@Composable
fun PaymentView(viewModel: CheckoutViewModel, onBack: () -> Unit) {
    val totalAmount = viewModel.totalAmount
    val discount = viewModel.discount
    val isProcessing by viewModel.isProcessingPayment.collectAsState()
    
    var expandedSection by remember { mutableStateOf<String?>("cod") }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6))) {
        Column(modifier = Modifier.fillMaxSize().statusBarsPadding()) {
            
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = Color(0xFF1F2937),
                    modifier = Modifier.size(24.dp).clickable { onBack() }.padding(4.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("Step 3 of 3", fontSize = 12.sp, color = Color(0xFF6B7280))
                    Text("Payments", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                }
                Spacer(modifier = Modifier.weight(1f))
                Row(
                    modifier = Modifier.background(Color(0xFFF3F4F6), RoundedCornerShape(4.dp)).padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFF4B5563), modifier = Modifier.size(10.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("100% Secure", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF4B5563))
                }
            }
            Divider(color = Color(0xFFE5E7EB))

            Column(modifier = Modifier.weight(1f).verticalScroll(rememberScrollState())) {
                TotalAmountCard(totalAmount = totalAmount, discount = discount)

                if (discount > 0) {
                    DiscountBanner()
                }

                Text(
                    "Payment Options",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF374151),
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
                )

                // Pay Online
                PayOnlineCard(
                    isLoading = isProcessing,
                    onPay = { viewModel.processPayment("RAZORPAY") }
                )

                // Saved Cards Accordion
                PaymentAccordionView(
                    id = "saved",
                    icon = Icons.Default.CreditCard,
                    title = "Saved Payment Options",
                    isExpanded = expandedSection == "saved",
                    onToggle = { expandedSection = if (expandedSection == "saved") null else "saved" },
                    content = {
                        Text("No saved cards found.", fontSize = 13.sp, color = Color(0xFF9CA3AF))
                    }
                )

                // COD Accordion
                PaymentAccordionView(
                    id = "cod",
                    icon = Icons.Default.Money,
                    title = "Cash on Delivery",
                    isExpanded = expandedSection == "cod",
                    onToggle = { expandedSection = if (expandedSection == "cod") null else "cod" },
                    content = {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(44.dp)
                                .background(Color(0xFF2563EB), RoundedCornerShape(6.dp))
                                .clickable {
                                    if (!isProcessing) {
                                        viewModel.processPayment("COD")
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            if (isProcessing) {
                                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                            } else {
                                Text("Place Order", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                )

                Spacer(modifier = Modifier.height(40.dp))
            }
        }
        
        // Render Success/Failed Modals mapped to local composition
        val showSuccess by viewModel.showPaymentSuccess.collectAsState()
        val showFailed by viewModel.showPaymentFailed.collectAsState()
        val showCancelled by viewModel.showPaymentCancelled.collectAsState()
        
        val showRazorpay by viewModel.showRazorpay.collectAsState()
        val context = LocalContext.current

        LaunchedEffect(showRazorpay) {
            if (showRazorpay) {
                com.ecommerceearn.app.data.services.RazorpayService.openRazorpayCheckout(
                    activity = context as android.app.Activity,
                    orderId = viewModel.createdOrderId.value ?: "",
                    amount = viewModel.totalAmount.toInt(),
                    name = null,
                    description = null,
                    prefillEmail = null,
                    prefillPhone = null,
                    prefillName = null
                )
            }
        }
        
        if (showSuccess) {
            PaymentSuccessView(onOrderTrack = { /* nav logic */ })
        }
        if (showFailed) {
            PaymentFailedView(onRetry = { viewModel.setPaymentFailed(false) })
        }
        if (showCancelled) {
            PaymentCancelledView(onClose = { viewModel.setIsPaymentViewVisible(false) })
        }
    }
}

@Composable
fun TotalAmountCard(totalAmount: Double, discount: Double) {
    var isExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 16.dp)
            .background(Color(0xFFEFF6FF), RoundedCornerShape(8.dp))
            .border(1.dp, Color(0xFFDBEAFE), RoundedCornerShape(8.dp))
            .clickable { isExpanded = !isExpanded }
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Total Amount", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF2563EB))
            Spacer(modifier = Modifier.width(6.dp))
            Icon(if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown, contentDescription = null, tint = Color(0xFF2563EB), modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${totalAmount.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2563EB))
        }

        if (isExpanded) {
            Divider(color = Color(0xFFBFDBFE), modifier = Modifier.padding(top = 12.dp, bottom = 8.dp))
            Row {
                Text("Price", fontSize = 14.sp, color = Color(0xFF4B5563))
                Spacer(modifier = Modifier.weight(1f))
                Text("₹${(totalAmount + discount).toInt()}", fontSize = 14.sp, color = Color(0xFF1F2937))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row {
                Text("Discount", fontSize = 14.sp, color = Color(0xFF4B5563))
                Spacer(modifier = Modifier.weight(1f))
                Text("- ₹${discount.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF059669))
            }
        }
    }
}

@Composable
fun DiscountBanner() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
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
            Icon(Icons.Default.LocalOffer, contentDescription = null, tint = Color(0xFF047857), modifier = Modifier.size(12.dp))
        }
    }
}

@Composable
fun PayOnlineCard(isLoading: Boolean, onPay: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 12.dp)
            .background(Color.White, RoundedCornerShape(8.dp))
            .shadow(1.dp, RoundedCornerShape(8.dp))
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFF002E6E), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text("Pay Online", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Text("UPI, Cards, Wallet, NetBanking", fontSize = 12.sp, color = Color(0xFF6B7280))
            }
            Spacer(modifier = Modifier.weight(1f))
            Box(modifier = Modifier.background(Color(0xFFBE123C), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp)) {
                Text("Recommended", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(44.dp)
                .background(if (isLoading) Color(0xFF93C5FD) else Color(0xFF2563EB), RoundedCornerShape(6.dp))
                .clickable(enabled = !isLoading) { onPay() },
            contentAlignment = Alignment.Center
        ) {
            if (isLoading) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Processing...", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                }
            } else {
                Text("Pay Now", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
            }
        }
    }
}

@Composable
fun PaymentAccordionView(
    id: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    isExpanded: Boolean,
    onToggle: () -> Unit,
    content: @Composable () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(if (isExpanded) Color(0xFFF9FAFB) else Color.White)
                .clickable { onToggle() }
                .padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF374151), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(title, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            Icon(if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown, contentDescription = null, tint = Color(0xFF6B7280), modifier = Modifier.size(18.dp))
        }
        if (isExpanded) {
            Box(modifier = Modifier.padding(start = 52.dp, end = 16.dp, bottom = 16.dp, top = 4.dp)) {
                content()
            }
        }
    }
}

// Stubs for Payment Status Views 
@Composable
fun PaymentSuccessView(onOrderTrack: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize().background(Color.White), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF22C55E), modifier = Modifier.size(80.dp))
            Spacer(modifier = Modifier.height(20.dp))
            Text("Order Placed Successfully!", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.height(10.dp))
            Button(onClick = onOrderTrack, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))) {
                Text("Track My Order")
            }
        }
    }
}

@Composable
fun PaymentFailedView(onRetry: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize().background(Color.White), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Error, contentDescription = null, tint = Color(0xFFEF4444), modifier = Modifier.size(80.dp))
            Spacer(modifier = Modifier.height(20.dp))
            Text("Payment Failed", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.height(10.dp))
            Button(onClick = onRetry, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))) {
                Text("Retry Payment")
            }
        }
    }
}

@Composable
fun PaymentCancelledView(onClose: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.5f)), contentAlignment = Alignment.Center) {
        Column(
            modifier = Modifier.background(Color.White, RoundedCornerShape(12.dp)).padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Payment Cancelled", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = onClose) {
                Text("Dismiss")
            }
        }
    }
}
