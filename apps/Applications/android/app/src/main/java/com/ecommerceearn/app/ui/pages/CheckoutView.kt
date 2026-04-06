package com.ecommerceearn.app.ui.pages

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.LastChanceOffer
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.UserAddress
import com.ecommerceearn.app.ui.viewmodel.CheckoutItem
import com.ecommerceearn.app.ui.viewmodel.CheckoutViewModel

@Composable
fun CheckoutView(viewModel: CheckoutViewModel, onBack: () -> Unit) {
    val currentStep by viewModel.currentStep.collectAsState()
    val isUserAddressSelectorVisible by viewModel.isUserAddressSelectorVisible.collectAsState()
    val isPriceDetailsVisible by viewModel.isPriceDetailsVisible.collectAsState()
    val isPaymentViewVisible by viewModel.isPaymentViewVisible.collectAsState()

    // Assuming we have PaymentView and Modals defined elsewhere or inside this file.
    // We will build the Order Summary exactly resembling iOS.
    
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
                Text("Order Summary", fontSize = 18.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(28.dp))
            }
            Divider(color = Color(0xFFE5E7EB))

            ProgressStepperView(currentStep)

            LazyColumn(
                modifier = Modifier.weight(1f).background(Color(0xFFF3F4F6)),
                contentPadding = PaddingValues(bottom = 100.dp) // space for bottom bar
            ) {
                item {
                    val address = viewModel.currentUserAddress
                    DeliverToSection(
                        address = address,
                        onChangeAddress = { viewModel.setIsUserAddressSelectorVisible(true) }
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }

                items(viewModel.items) { item ->
                    val discountPercent = if ((item.product.mrp ?: 0.0) > 0.0) {
                        (((item.product.mrp!! - item.product.price) / item.product.mrp!!) * 100).toInt()
                    } else 0

                    ProductOrderCard(
                        product = item.product,
                        quantity = item.quantity,
                        discountPercent = discountPercent
                    )

                    val offers = item.product.lastChanceOffers
                    if (!offers.isNullOrEmpty()) {
                        val selectedUpsells by viewModel.selectedUpsells.collectAsState()
                        ProtectionPlansSection(
                            offers = offers,
                            selectedOffers = selectedUpsells,
                            onToggleOffer = { /* viewModel.toggleUpsell(it) */ }
                        )
                    }
                    Divider(color = Color(0xFFE5E7EB))
                    Spacer(modifier = Modifier.height(8.dp))
                }

                item {
                    DeliveryInfoRow(deliveryDate = "May 24, Wed") // Mock format
                    Spacer(modifier = Modifier.height(8.dp))
                }

                item {
                    RestAssuredSection(productImageUrl = viewModel.firstProduct?.images?.firstOrNull())
                    Spacer(modifier = Modifier.height(8.dp))
                }

                item {
                    val donation by viewModel.selectedDonation.collectAsState()
                    DonationSection(
                        selectedDonation = donation,
                        onSelectDonation = { viewModel.setDonation(it) }
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }

                item {
                    PriceBreakdownSection(
                        mrp = viewModel.mrpTotal,
                        fees = viewModel.totalFees,
                        discount = viewModel.discount,
                        total = viewModel.totalAmount
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }

                item {
                    TermsSection()
                }
            }
        }

        // Bottom Bar
        Box(modifier = Modifier.align(Alignment.BottomCenter)) {
            OrderSummaryBottomBar(
                mrp = viewModel.mrpTotal,
                total = viewModel.totalAmount,
                onViewDetails = { viewModel.setIsPriceDetailsVisible(true) },
                onContinue = { viewModel.setIsPaymentViewVisible(true) }
            )
        }

        if (isPriceDetailsVisible) {
            val donation by viewModel.selectedDonation.collectAsState()
            PriceDetailsModal(
                itemTotal = viewModel.itemTotal,
                itemCount = viewModel.totalQuantity,
                deliveryCharges = viewModel.shippingFee,
                protectFee = viewModel.protectFee,
                selectedOffersTotal = viewModel.selectedOffersTotal,
                discount = viewModel.discount,
                donation = donation?.toDouble() ?: 0.0,
                total = viewModel.totalAmount,
                onDismiss = { viewModel.setIsPriceDetailsVisible(false) }
            )
        }
        if (isPaymentViewVisible) {
            Box(modifier = Modifier.fillMaxSize().zIndex(100f)) {
                PaymentView(
                    totalAmount = viewModel.totalAmount,
                    discount = viewModel.discount,
                    _itemCount = viewModel.totalQuantity,
                    onPaymentSelect = { method ->
                        // Stub for payment initiation via CheckoutViewModel
                    },
                    isLoading = false,
                    onBack = { viewModel.setIsPaymentViewVisible(false) }
                )
            }
        }
    }
}

@Composable
fun ProgressStepperView(currentStep: Int) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            StepItem(number = 1, label = "Address", isCompleted = currentStep > 1, isActive = currentStep == 1)
            StepLine(isCompleted = currentStep > 1)
            StepItem(number = 2, label = "Order Summary", isCompleted = currentStep > 2, isActive = currentStep == 2)
            StepLine(isCompleted = currentStep > 2)
            StepItem(number = 3, label = "Payment", isCompleted = currentStep > 3, isActive = currentStep == 3)
        }
        Divider(color = Color(0xFFE5E7EB))
    }
}

@Composable
fun StepItem(number: Int, label: String, isCompleted: Boolean, isActive: Boolean) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(80.dp)) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .background(if (isCompleted || isActive) Color(0xFF2563EB) else Color(0xFFE5E7EB), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            if (isCompleted) {
                Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            } else {
                Text("$number", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = if (isActive) Color.White else Color(0xFF9CA3AF))
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(label, fontSize = 12.sp, fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal, color = if (isActive) Color(0xFF111827) else Color(0xFF4B5563))
    }
}

@Composable
fun RowScope.StepLine(isCompleted: Boolean) {
    Box(
        modifier = Modifier
            .weight(1f)
            .padding(horizontal = 8.dp)
            .padding(bottom = 20.dp)
            .height(2.dp)
            .background(if (isCompleted) Color(0xFF2563EB) else Color(0xFFE5E7EB))
    )
}

@Composable
fun DeliverToSection(address: UserAddress?, onChangeAddress: () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Deliver to:", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            Text(if (address != null) "Change" else "Add Address", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF2563EB), modifier = Modifier.clickable { onChangeAddress() })
        }
        if (address != null) {
            Spacer(modifier = Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(address.name ?: "", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                Spacer(modifier = Modifier.width(8.dp))
                Box(modifier = Modifier.background(Color(0xFFF3F4F6), RoundedCornerShape(4.dp)).padding(horizontal = 8.dp, vertical = 2.dp)) {
                    Text("HOME", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF4B5563))
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text("${address.addressLine1 ?: ""}, ${address.city ?: ""}, ${address.state ?: ""} - ${address.pincode ?: ""}", fontSize = 14.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.height(6.dp))
            Text(address.phone ?: "", fontSize = 14.sp, color = Color(0xFF4B5563))
        } else {
            Spacer(modifier = Modifier.height(12.dp))
            Text("No address selected. Please add one.", fontSize = 14.sp, color = Color(0xFF4B5563))
        }
    }
}

@Composable
fun ProductOrderCard(product: Product, quantity: Int, discountPercent: Int) {
    Row(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .background(Color(0xFFF9FAFB), RoundedCornerShape(8.dp))
                .clip(RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            val image = product.images.firstOrNull() ?: ""
            val urlString = if (image.startsWith("http")) image else "https://api.lfvs.in$image"
            AsyncImage(model = urlString, contentDescription = null, contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize().padding(4.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(product.name ?: "", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF111827), maxLines = 2)
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("${product.rating ?: 4.7} ★", fontSize = 11.sp, color = Color(0xFF059669))
                Spacer(modifier = Modifier.width(4.dp))
                Text("(${product.reviewCount ?: 0})", fontSize = 11.sp, color = Color(0xFF4B5563))
                Spacer(modifier = Modifier.width(8.dp))
                Text("✓ Assured", fontSize = 11.sp, fontWeight = FontWeight.Medium, color = Color(0xFF2563EB))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("↓$discountPercent%", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF059669))
                Spacer(modifier = Modifier.width(6.dp))
                if (product.mrp != null) {
                    Text("₹${product.mrp.toInt()}", fontSize = 12.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                    Spacer(modifier = Modifier.width(6.dp))
                }
                Text("₹${product.price.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text("Qty: $quantity", fontSize = 12.sp, color = Color(0xFF4B5563))
        }
    }
}

@Composable
fun ProtectionPlansSection(offers: List<LastChanceOffer>, selectedOffers: Set<String>, onToggleOffer: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White)) {
        offers.forEachIndexed { index, offer ->
            val offerId = offer.tempId(index)
            val isSelected = selectedOffers.contains(offerId)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(if (isSelected) Color(0xFFEFF6FF) else Color.White)
                    .clickable { onToggleOffer(offerId) }
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = Color(0xFF4B5563), modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(offer.title ?: "", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF111827))
                    Spacer(modifier = Modifier.weight(1f))
                    if (isSelected) {
                        Icon(Icons.Default.Close, contentDescription = null, tint = Color(0xFF9CA3AF), modifier = Modifier.size(16.dp))
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.padding(start = 30.dp), verticalAlignment = Alignment.CenterVertically) {
                    if (offer.originalPrice != null) {
                        Text("₹${offer.originalPrice.toInt()}", fontSize = 13.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    Text("₹${offer.offerPrice.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                    Spacer(modifier = Modifier.width(8.dp))
                    if (offer.discount != null) {
                        Text("${offer.discount.toInt()}% off", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF059669))
                    }
                }
            }
            if (index < offers.size - 1) {
                Divider(color = Color(0xFFE5E7EB))
            }
        }
    }
}

@Composable
fun DeliveryInfoRow(deliveryDate: String) {
    Row(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Text("Delivery by $deliveryDate", fontSize = 14.sp, color = Color(0xFF4B5563))
    }
}

@Composable
fun RestAssuredSection(productImageUrl: String?) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.ViewInAr, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text("Rest assured with Open Box Delivery", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
        }
        if (productImageUrl != null) {
            Spacer(modifier = Modifier.height(12.dp))
            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                val urlString = if (productImageUrl.startsWith("http")) productImageUrl else "https://api.lfvs.in$productImageUrl"
                AsyncImage(model = urlString, contentDescription = null, contentScale = ContentScale.Fit, modifier = Modifier.size(80.dp, 60.dp))
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            "Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery.",
            fontSize = 12.sp, color = Color(0xFF4B5563)
        )
    }
}

@Composable
fun DonationSection(selectedDonation: Int?, onSelectDonation: (Int?) -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Text("Donate to Support Education", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        Text("Support transformative social work in India", fontSize = 12.sp, color = Color(0xFF4B5563))
        Spacer(modifier = Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            listOf(10, 20, 50, 100).forEach { amount ->
                val isSelected = selectedDonation == amount
                Box(
                    modifier = Modifier
                        .background(if (isSelected) Color(0xFF2563EB) else Color.White, RoundedCornerShape(6.dp))
                        .clickable { onSelectDonation(if (isSelected) null else amount) }
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text("₹$amount", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = if (isSelected) Color.White else Color(0xFF374151))
                }
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Text("Note: 100% of the donation goes to the cause", fontSize = 11.sp, color = Color(0xFF9CA3AF))
    }
}

@Composable
fun PriceBreakdownSection(mrp: Double, fees: Double, discount: Double, total: Double) {
    Column(modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)) {
        Row {
            Text("MRP(incl. of all taxes)", fontSize = 14.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${mrp.toInt()}", fontSize = 14.sp, color = Color(0xFF111827))
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row {
            Text("Fees", fontSize = 14.sp, color = Color(0xFF4B5563))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${fees.toInt()}", fontSize = 14.sp, color = Color(0xFF111827))
        }
        if (discount > 0) {
            Spacer(modifier = Modifier.height(12.dp))
            Row {
                Text("Discounts", fontSize = 14.sp, color = Color(0xFF4B5563))
                Spacer(modifier = Modifier.weight(1f))
                Text("-₹${discount.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF059669))
            }
        }
        Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(vertical = 12.dp))
        Row {
            Text("Total Amount", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.weight(1f))
            Text("₹${total.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        }
        if (discount > 0) {
            Spacer(modifier = Modifier.height(12.dp))
            Box(modifier = Modifier.fillMaxWidth().background(Color(0xFFECFDF5), RoundedCornerShape(6.dp)).padding(10.dp), contentAlignment = Alignment.Center) {
                Text("You will save ₹${discount.toInt()} on this order", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF047857))
            }
        }
    }
}

@Composable
fun TermsSection() {
    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 20.dp)) {
        Text("By continuing with the order, you confirm that you are above 18 years of age, and you agree to our Terms of Use and Privacy Policy", fontSize = 11.sp, color = Color(0xFF9CA3AF))
    }
}

@Composable
fun OrderSummaryBottomBar(mrp: Double, total: Double, onViewDetails: () -> Unit, onContinue: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 16.dp)
            .background(Color.White)
            .navigationBarsPadding()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text("₹${mrp.toInt()}", fontSize = 12.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
            Text("₹${total.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Text("View price details", fontSize = 12.sp, color = Color(0xFF2563EB), modifier = Modifier.clickable { onViewDetails() }.padding(vertical = 4.dp))
        }
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFFFFD700))
                .clickable { onContinue() }
                .padding(horizontal = 32.dp, vertical = 14.dp),
            contentAlignment = Alignment.Center
        ) {
            Text("Continue", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        }
    }
}

@Composable
fun PriceDetailsModal(
    itemTotal: Double,
    itemCount: Int,
    deliveryCharges: Double,
    protectFee: Double,
    selectedOffersTotal: Double,
    discount: Double,
    donation: Double,
    total: Double,
    onDismiss: () -> Unit
) {
    // A simple full-screen dark overlay with a bottom sheet styling
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.4f))
            .clickable { onDismiss() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .background(Color.White, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                .clickable(enabled = false) {} // Prevent dismiss on modal click
        ) {
            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 18.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Price Details", fontSize = 18.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                Spacer(modifier = Modifier.weight(1f))
                Icon(Icons.Default.Close, contentDescription = null, tint = Color(0xFF4B5563), modifier = Modifier.size(24.dp).clickable { onDismiss() })
            }
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                PriceDetailRow("Price ($itemCount item${if (itemCount > 1) "s" else ""})", "₹${itemTotal.toInt()}", Color(0xFF111827))
                PriceDetailRow("Delivery Charges", if (deliveryCharges > 0) "₹${deliveryCharges.toInt()}" else "FREE", if (deliveryCharges > 0) Color(0xFF111827) else Color(0xFF059669))
                if (protectFee > 0) PriceDetailRow("Protect Promise Fee", "₹${protectFee.toInt()}", Color(0xFF111827))
                if (selectedOffersTotal > 0) PriceDetailRow("Add-ons", "₹${selectedOffersTotal.toInt()}", Color(0xFF111827))
                if (donation > 0) PriceDetailRow("Donation", "₹${donation.toInt()}", Color(0xFF111827))
                PriceDetailRow("Discount", "-₹${discount.toInt()}", Color(0xFF059669))
                Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(vertical = 16.dp))
                Row(modifier = Modifier.padding(bottom = 16.dp)) {
                    Text("Total Amount", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                    Spacer(modifier = Modifier.weight(1f))
                    Text("₹${total.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                }
                if (discount > 0) {
                    Box(modifier = Modifier.fillMaxWidth().padding(bottom = 20.dp).background(Color(0xFFECFDF5), RoundedCornerShape(8.dp)).padding(vertical = 14.dp), contentAlignment = Alignment.Center) {
                        Text("You will save ₹${discount.toInt()} on this order", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF047857))
                    }
                }
            }
            Spacer(modifier = Modifier.navigationBarsPadding())
        }
    }
}

@Composable
fun PriceDetailRow(label: String, value: String, valueColor: Color) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp)) {
        Text(label, fontSize = 15.sp, color = Color(0xFF4B5563))
        Spacer(modifier = Modifier.weight(1f))
        Text(value, fontSize = 15.sp, fontWeight = FontWeight.Medium, color = valueColor)
    }
}
