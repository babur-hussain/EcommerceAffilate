package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

data class LastChanceOffer(
    val id: String,
    val title: String,
    val description: String?,
    val image: String?,
    val originalPrice: Double,
    val offerPrice: Double,
    val discountPercentage: Int?,
    val tag: String?,
    val features: List<String>?
)

@Composable
fun LastChancePopupView(
    isVisible: Boolean,
    onDismiss: () -> Unit
) {
    if (!isVisible) return

    val dummyOffers = listOf(
        LastChanceOffer("1", "Extended Warranty", "1 year damage protection", null, 499.0, 199.0, 60, "Must Have", listOf("Accidental damage", "Liquid damage")),
        LastChanceOffer("2", "Premium Case", "Shockproof protection", null, 999.0, 299.0, 70, "Hot Deal", listOf("Military grade", "Lightweight"))
    )

    var selectedOfferIds by remember { mutableStateOf(setOf<String>()) }
    val savings = dummyOffers.filter { selectedOfferIds.contains(it.id) }.sumOf { (it.originalPrice - it.offerPrice) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.BottomCenter
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                    .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF9FAFB))
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Added to cart", fontSize = 12.sp, color = Color(0xFF6B7280))
                        Text("Product details...", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF1F2937))
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = Color.Black)
                    }
                }

                Column(modifier = Modifier.padding(vertical = 20.dp)) {
                    Text(
                        text = "Last Chance at this Price!",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937),
                        modifier = Modifier.padding(horizontal = 16.dp).padding(bottom = 16.dp)
                    )

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        itemsIndexed(dummyOffers) { _, offer ->
                            OfferCard(
                                offer = offer,
                                isSelected = selectedOfferIds.contains(offer.id),
                                onTap = {
                                    val newSet = selectedOfferIds.toMutableSet()
                                    if (!newSet.add(offer.id)) newSet.remove(offer.id)
                                    selectedOfferIds = newSet
                                },
                                onRemove = {
                                    val newSet = selectedOfferIds.toMutableSet()
                                    newSet.remove(offer.id)
                                    selectedOfferIds = newSet
                                }
                            )
                        }
                    }
                }

                if (savings > 0) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFECFDF5))
                            .padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Additional savings unlocked: ₹${savings.toInt()}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF047857)
                        )
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f).border(1.dp, Color(0xFFD1D5DB), RoundedCornerShape(8.dp))
                    ) {
                        Text("Go to checkout", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF374151))
                    }

                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFD700)),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Continue", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                    }
                }
            }
        }
    }
}

@Composable
fun OfferCard(
    offer: LastChanceOffer,
    isSelected: Boolean,
    onTap: () -> Unit,
    onRemove: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(200.dp)
            .background(if (isSelected) Color(0xFFEFF6FF) else Color.White, RoundedCornerShape(12.dp))
            .border(1.dp, if (isSelected) Color(0xFF2563EB) else Color(0xFFE5E7EB), RoundedCornerShape(12.dp))
            .clickable { onTap() }
            .padding(12.dp)
    ) {
        Column {
            offer.tag?.let {
                Text(
                    text = it,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF065F46),
                    modifier = Modifier
                        .background(Color(0xFFD1FAE5), RoundedCornerShape(topStart = 8.dp, bottomEnd = 8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
            
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .padding(vertical = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                Box(modifier = Modifier.size(60.dp).background(Color(0xFFE5E7EB), RoundedCornerShape(8.dp)))
                
                if (isSelected) {
                    Text(
                        text = "Selected",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .background(Color(0xFF2563EB))
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        textAlign = TextAlign.Center
                    )
                }
            }
            
            Text(text = offer.title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937), maxLines = 2, modifier = Modifier.padding(bottom = 4.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.padding(bottom = 4.dp)) {
                offer.discountPercentage?.let {
                    Text("↓ $it%", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF16A34A))
                }
                Text("₹${offer.originalPrice.toInt()}", fontSize = 12.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                Text("₹${offer.offerPrice.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            }
            
            offer.description?.let {
                Text(text = it, fontSize = 11.sp, color = Color(0xFF6B7280), maxLines = 2, modifier = Modifier.padding(bottom = 8.dp))
            }
            
            offer.features?.take(3)?.forEach { f ->
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color(0xFF4B5563), modifier = Modifier.size(12.dp))
                    Text(text = f, fontSize = 11.sp, color = Color(0xFF4B5563), maxLines = 1, overflow = TextOverflow.Ellipsis)
                }
            }
            
            if (isSelected) {
                HorizontalDivider(modifier = Modifier.padding(top = 8.dp), color = Color(0xFFE5E7EB))
                Text(
                    text = "Remove",
                    fontSize = 12.sp,
                    color = Color(0xFF4B5563),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onRemove() }
                        .padding(top = 8.dp),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
