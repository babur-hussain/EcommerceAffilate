package com.ecommerceearn.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.model.Address

@Composable
fun UserAddressBarView(
    currentUserAddress: Address?,
    onTap: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .clickable { onTap() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.Place,
            contentDescription = "Location",
            tint = Color(0xFF2563EB),
            modifier = Modifier.padding(end = 12.dp)
        )
        
        Column(modifier = Modifier.weight(1f)) {
            if (currentUserAddress != null) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Deliver to ${currentUserAddress.name} - ${currentUserAddress.pincode}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF111827),
                        maxLines = 1
                    )
                    if (currentUserAddress.isDefault) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Box(
                            modifier = Modifier
                                .background(Color(0xFFF3F4F6), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text("HOME", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4B5563))
                        }
                    }
                }
                Text(
                    text = "${currentUserAddress.addressLine1}, ${currentUserAddress.city}",
                    fontSize = 13.sp,
                    color = Color(0xFF6B7280),
                    maxLines = 1
                )
            } else {
                Text("Select delivery address", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF111827))
                Text("Login to see your saved addresses", fontSize = 13.sp, color = Color(0xFF6B7280))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserAddressSelectorView(
    isVisible: Boolean,
    savedUserAddresses: List<Address>,
    selectedUserAddressId: String?,
    onSelectUserAddress: (Address) -> Unit,
    onUseCurrentLocation: () -> Unit,
    onAddNewUserAddress: () -> Unit,
    onDismiss: () -> Unit,
    title: String = "Select delivery address"
) {
    if (isVisible) {
        ModalBottomSheet(
            onDismissRequest = onDismiss,
            containerColor = Color.White,
            shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxHeight(0.8f)
                    .fillMaxWidth()
            ) {
                // Header
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF111827), modifier = Modifier.weight(1f))
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Color(0xFF1F2937))
                    }
                }
                
                // Search Bar
                var searchText by remember { mutableStateOf("") }
                OutlinedTextField(
                    value = searchText,
                    onValueChange = { searchText = it },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = Color(0xFF9CA3AF)) },
                    placeholder = { Text("Search by area, street name, pin code", fontSize = 14.sp) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )
                
                // Current Location Button
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onUseCurrentLocation() }
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.LocationOn, contentDescription = "Current Location", tint = Color(0xFF2563EB))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("Use my current location", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = Color(0xFF2563EB))
                }
                
                Divider()
                
                // Saved Addresses Header
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Saved addresses", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF374151), modifier = Modifier.weight(1f))
                    Text("+ Add New", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = Color(0xFF2563EB), modifier = Modifier.clickable { onAddNewUserAddress() })
                }
                
                // Address List
                LazyColumn {
                    items(savedUserAddresses) { address ->
                        UserAddressRow(
                            address = address,
                            isSelected = selectedUserAddressId == address.id,
                            onSelect = { onSelectUserAddress(address) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun UserAddressRow(
    address: Address,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onSelect() }
            .background(if (isSelected) Color(0xFFF9FAFB) else Color.White)
            .padding(16.dp),
        verticalAlignment = Alignment.Top
    ) {
        // Radio logic omitted for layout brevity, standard indicator mapping
        Column(modifier = Modifier.weight(1f)) {
            Row {
                Text(address.name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF111827))
                if (address.isDefault) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Box(
                        modifier = Modifier
                            .background(Color(0xFFEFF6FF), RoundedCornerShape(4.dp))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text("DEFAULT", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2563EB))
                    }
                }
            }
            Text(address.addressLine1, fontSize = 14.sp, color = Color(0xFF4B5563))
            Text("${address.city}, ${address.state} - ${address.pincode}", fontSize = 14.sp, color = Color(0xFF4B5563))
            Text(address.country, fontSize = 14.sp, color = Color(0xFF4B5563))
            
            Text("Phone: ${address.phone}", fontWeight = FontWeight.Medium, fontSize = 13.sp, color = Color(0xFF6B7280), modifier = Modifier.padding(top = 4.dp))
        }
        
        IconButton(onClick = { /* Edit */ }) {
            Icon(Icons.Default.MoreVert, contentDescription = "Edit", tint = Color(0xFF9CA3AF))
        }
    }
}
