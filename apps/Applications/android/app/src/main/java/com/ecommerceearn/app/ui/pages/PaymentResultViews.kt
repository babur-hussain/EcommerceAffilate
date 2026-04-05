package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.NavigationManager

@Composable
fun PaymentSuccessView(amount: String, orderId: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .background(Color(0xFF4CAF50), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(40.dp))
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text("Payment Successful!", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        Spacer(modifier = Modifier.height(8.dp))
        Text("Your order #$orderId has been placed successfully.", fontSize = 14.sp, color = Color(0xFF6B7280), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Text("Amount Paid", fontSize = 12.sp, color = Color(0xFF6B7280))
        Text("₹$amount", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))

        Spacer(modifier = Modifier.height(48.dp))

        Button(
            onClick = { NavigationManager.navigate("account") },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Track Order", color = Color.White, fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedButton(
            onClick = { NavigationManager.navigate("home") },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Continue Shopping", color = Color(0xFF2874F0), fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun PaymentFailureView(reason: String = "Transaction declined by your bank.") {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .background(Color(0xFFF44336), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Close, contentDescription = null, tint = Color.White, modifier = Modifier.size(40.dp))
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text("Payment Failed", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
        Spacer(modifier = Modifier.height(8.dp))
        Text(reason, fontSize = 14.sp, color = Color(0xFF6B7280), textAlign = androidx.compose.ui.text.style.TextAlign.Center)

        Spacer(modifier = Modifier.height(48.dp))

        Button(
            onClick = {  }, // Navigate back or retry
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Try Again", color = Color.White, fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedButton(
            onClick = { NavigationManager.navigate("home") },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF6B7280))
        ) {
            Text("Cancel", fontWeight = FontWeight.SemiBold)
        }
    }
}
