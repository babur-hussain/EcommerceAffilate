package com.localforvocalstartup.app.ui.components

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

import com.localforvocalstartup.app.data.model.LastChanceOffer

@Composable
fun LastChancePopupView(
    isVisible: Boolean,
    offers: List<LastChanceOffer>,
    onDismiss: () -> Unit
) {
    if (!isVisible || offers.isEmpty()) return

    var selectedOfferIds by remember { mutableStateOf(setOf<String>()) }
    val savings = offers.filter { it.id?.let { id -> selectedOfferIds.contains(id) } == true }
        .sumOf { ((it.originalPrice ?: 0.0) - (it.offerPrice ?: 0.0)) }

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
                        itemsIndexed(offers) { _, offer ->
                            val offerId = offer.id ?: offer._id ?: ""
                            OfferCard(
                                offer = offer,
                                isSelected = selectedOfferIds.contains(offerId),
                                onTap = {
                                    val newSet = selectedOfferIds.toMutableSet()
                                    if (!newSet.add(offerId)) newSet.remove(offerId)
                                    selectedOfferIds = newSet
                                },
                                onRemove = {
                                    val newSet = selectedOfferIds.toMutableSet()
                                    newSet.remove(offerId)
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
            
            Text(text = offer.title ?: "", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937), maxLines = 2, modifier = Modifier.padding(bottom = 4.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.padding(bottom = 4.dp)) {
                offer.discount?.let {
                    Text("↓ ${it.toInt()}%", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF16A34A))
                }
                offer.originalPrice?.let {
                    Text("₹${it.toInt()}", fontSize = 12.sp, color = Color(0xFF9CA3AF), textDecoration = TextDecoration.LineThrough)
                }
                offer.offerPrice?.let {
                    Text("₹${it.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                }
            }
            
            offer.description?.let {
                Text(text = it, fontSize = 11.sp, color = Color(0xFF6B7280), maxLines = 2, modifier = Modifier.padding(bottom = 8.dp))
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
