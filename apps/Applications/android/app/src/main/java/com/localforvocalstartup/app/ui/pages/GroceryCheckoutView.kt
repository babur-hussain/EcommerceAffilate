package com.localforvocalstartup.app.ui.pages

import android.app.Activity
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.DirectionsBike
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.manager.CartItem
import com.localforvocalstartup.app.data.model.UserAddress
import com.localforvocalstartup.app.data.services.RazorpayService
import com.localforvocalstartup.app.ui.viewmodel.GroceryCheckoutViewModel

@Composable
fun GroceryCheckoutView(viewModel: GroceryCheckoutViewModel, onBack: () -> Unit) {
    val context = LocalContext.current
    val isUserAddressSelectorVisible by viewModel.isUserAddressSelectorVisible.collectAsState()
    val isPaymentViewVisible by viewModel.isPaymentViewVisible.collectAsState()
    val isProcessingPayment by viewModel.isProcessingPayment.collectAsState()
    val showRazorpay by viewModel.showRazorpay.collectAsState()
    val user by AuthManager.userState.collectAsState()
    val deliveryEta by viewModel.deliveryEtaMinutes.collectAsState()
    val deliveryStatus by viewModel.deliveryPartnerStatus.collectAsState()
    
    val showPaymentSuccess by viewModel.showPaymentSuccess.collectAsState()
    val showPaymentFailed by viewModel.showPaymentFailed.collectAsState()
    val showPaymentCancelled by viewModel.showPaymentCancelled.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    if (errorMessage != null) {
        AlertDialog(
            onDismissRequest = { viewModel.clearError() },
            title = { Text("Checkout Error", fontWeight = FontWeight.Bold) },
            text = { Text(errorMessage ?: "") },
            confirmButton = {
                TextButton(onClick = { viewModel.clearError() }) {
                    Text("OK", color = Color(0xFF15803D))
                }
            },
            containerColor = Color.White
        )
    }

    if (showPaymentSuccess) {
        val orderNumber by viewModel.createdOrderNumber.collectAsState()
        PaymentSuccessView(
            orderNumber = orderNumber,
            amount = viewModel.totalAmount,
            onContinueShopping = onBack,
            onViewOrder = onBack
        )
        return
    }

    if (showPaymentFailed) {
        val orderNumber by viewModel.createdOrderNumber.collectAsState()
        PaymentFailedView(
            orderId = orderNumber,
            amount = viewModel.totalAmount,
            onRetry = { viewModel.setPaymentFailed(false) },
            onCancel = onBack
        )
        return
    }

    if (showPaymentCancelled) {
        val orderNumber by viewModel.createdOrderNumber.collectAsState()
        PaymentCancelledView(
            orderId = orderNumber,
            amount = viewModel.totalAmount,
            onRetry = { viewModel.setPaymentCancelled(false) },
            onGoBack = onBack
        )
        return
    }

    LaunchedEffect(showRazorpay) {
        if (showRazorpay) {
            var currentContext = context
            while (currentContext is android.content.ContextWrapper) {
                if (currentContext is Activity) break
                currentContext = currentContext.baseContext
            }
            val activity = currentContext as? Activity
            if (activity != null) {
                val orderId = viewModel.razorpayOrderId.value ?: ""
                val amountPaise = (viewModel.totalAmount * 100).toInt()
                RazorpayService.openRazorpayCheckout(
                    activity = activity,
                    orderId = orderId,
                    amount = amountPaise,
                    name = "Local For Vocal",
                    description = "Grocery Checkout",
                    prefillEmail = user?.email,
                    prefillPhone = user?.phone,
                    _prefillName = user?.name
                )
            }
        }
    }

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
                    tint = Color(0xFF111827),
                    modifier = Modifier.size(24.dp).clickable { onBack() }.padding(4.dp)
                )
                Spacer(modifier = Modifier.weight(1f))
                Text("Checkout", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(28.dp))
            }
            Divider(color = Color(0xFFE5E7EB))

            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                // Live Delivery Estimation Component
                item {
                    LiveDeliveryEstimation(eta = deliveryEta, status = deliveryStatus)
                }

                // Delivery Address
                item {
                    val address = viewModel.currentUserAddress
                    QuickDeliveryAddress(address = address, onChange = { viewModel.setIsUserAddressSelectorVisible(true) })
                    Spacer(modifier = Modifier.height(8.dp))
                }

                // Order Items
                item {
                    Column(modifier = Modifier.background(Color.White).padding(16.dp)) {
                        Text("Order Items", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827), modifier = Modifier.padding(bottom = 12.dp))
                        viewModel.items.forEachIndexed { index, item ->
                            QuickOrderItemRow(item)
                            if (index < viewModel.items.size - 1) {
                                Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(vertical = 12.dp))
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                }

                // Bill Details
                item {
                    QuickBillDetails(viewModel)
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }

        // Quick Pay Bottom Bar
        Box(modifier = Modifier.align(Alignment.BottomCenter)) {
            QuickPayBottomBar(
                totalAmount = viewModel.totalAmount,
                onPay = { viewModel.setIsPaymentViewVisible(true) }
            )
        }

        // Modals
        if (isUserAddressSelectorVisible) {
            val savedAddresses by viewModel.savedUserAddresses.collectAsState()
            val selectedAddressId by viewModel.selectedUserAddressId.collectAsState()

            AddressSelectorBottomSheet(
                savedAddresses = savedAddresses,
                selectedAddressId = selectedAddressId,
                onDismiss = { viewModel.setIsUserAddressSelectorVisible(false) },
                onSelectAddress = { addr ->
                    viewModel.handleAddressSelection(addr)
                    viewModel.setIsUserAddressSelectorVisible(false)
                },
                onUseCurrentLocation = {
                    viewModel.setUseCurrentLocation(true)
                    viewModel.setIsUserAddressSelectorVisible(false)
                },
                onSaveNewAddress = { name, phone, line1, city, state, pincode ->
                    val newAddress = com.localforvocalstartup.app.data.model.UserAddress(
                        _id = java.util.UUID.randomUUID().toString(),
                        userId = "",
                        name = name,
                        phone = phone,
                        addressLine1 = line1,
                        city = city,
                        state = state,
                        pincode = pincode,
                        isDefault = true
                    )
                    viewModel.handleAddressSelection(newAddress)
                    viewModel.setIsUserAddressSelectorVisible(false)
                }
            )
        }

        if (isPaymentViewVisible) {
            Box(modifier = Modifier.fillMaxSize().zIndex(100f)) {
                PaymentView(
                    totalAmount = viewModel.totalAmount,
                    discount = viewModel.discount,
                    _itemCount = viewModel.items.size,
                    onPaymentSelect = { method ->
                        viewModel.processPayment(method)
                    },
                    isLoading = isProcessingPayment,
                    onBack = { viewModel.setIsPaymentViewVisible(false) }
                )
            }
        }
    }
}

@Composable
fun LiveDeliveryEstimation(eta: Int, status: String) {
    // Pulse animation for the live radar
    val infiniteTransition = rememberInfiniteTransition()
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.5f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500),
            repeatMode = RepeatMode.Restart
        )
    )
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.5f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500),
            repeatMode = RepeatMode.Restart
        )
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF0FDF4))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.ElectricBolt, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Superfast Delivery", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF16A34A))
        }
        Spacer(modifier = Modifier.height(16.dp))
        
        Box(contentAlignment = Alignment.Center) {
            // Radar pulse
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .scale(scale)
                    .background(Color(0xFF16A34A).copy(alpha = alpha), CircleShape)
            )
            // Center icon
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .background(Color(0xFF16A34A), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text("$eta", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text("MINS", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF15803D))
        
        Spacer(modifier = Modifier.height(12.dp))
        Row(
            modifier = Modifier.background(Color.White, RoundedCornerShape(16.dp)).padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.DirectionsBike, contentDescription = null, tint = Color(0xFF111827), modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(status, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF374151))
        }
    }
}

@Composable
fun QuickDeliveryAddress(address: UserAddress?, onChange: () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Delivering to", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            Text("Change", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF16A34A), modifier = Modifier.clickable { onChange() })
        }
        Spacer(modifier = Modifier.height(12.dp))
        if (address != null) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF9CA3AF), modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(address.name ?: "Home", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(modifier = Modifier.background(Color(0xFFF3F4F6), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp)) {
                            Text("HOME", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4B5563))
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("${address.addressLine1 ?: ""}, ${address.city ?: ""} - ${address.pincode ?: ""}", fontSize = 13.sp, color = Color(0xFF6B7280))
                }
            }
        } else {
            Text("No address selected. Please add one.", fontSize = 14.sp, color = Color(0xFFEF4444))
        }
    }
}

@Composable
fun QuickOrderItemRow(item: CartItem) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(Color(0xFFF9FAFB), RoundedCornerShape(8.dp))
                .clip(RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            val image = item.product.images?.firstOrNull() ?: ""
            val urlString = if (image.startsWith("http")) image else "https://api.lfvs.in$image"
            AsyncImage(model = urlString, contentDescription = null, contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize().padding(4.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(item.product.name ?: "", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF111827), maxLines = 1)
            Spacer(modifier = Modifier.height(2.dp))
            Text(item.product.subtitle ?: "1 pc", fontSize = 12.sp, color = Color(0xFF6B7280))
        }
        Text("x${item.quantity}", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF4B5563))
        Spacer(modifier = Modifier.width(16.dp))
        Text("₹${(item.product.price * item.quantity).toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
    }
}

@Composable
fun QuickBillDetails(viewModel: GroceryCheckoutViewModel) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text("Bill Details", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827), modifier = Modifier.padding(bottom = 16.dp))
        
        Row(modifier = Modifier.padding(bottom = 12.dp)) {
            Text("Item Total", fontSize = 14.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${viewModel.itemTotal.toInt()}", fontSize = 14.sp, color = Color(0xFF111827))
        }
        Row(modifier = Modifier.padding(bottom = 12.dp)) {
            Text("Delivery Fee", fontSize = 14.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("FREE", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF16A34A))
        }
        Row(modifier = Modifier.padding(bottom = 16.dp)) {
            Text("Handling Fee", fontSize = 14.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${viewModel.handlingFee.toInt()}", fontSize = 14.sp, color = Color(0xFF111827))
        }
        Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(bottom = 16.dp))
        Row {
            Text("To Pay", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${viewModel.totalAmount.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        }
    }
}

@Composable
fun QuickPayBottomBar(totalAmount: Double, onPay: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .navigationBarsPadding()
            .padding(16.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFF16A34A))
                .clickable { onPay() }
                .padding(vertical = 16.dp),
            contentAlignment = Alignment.Center
        ) {
            Text("Pay ₹${totalAmount.toInt()} via UPI / Cards", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}
