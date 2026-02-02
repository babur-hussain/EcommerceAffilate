package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.AuthManager
import com.ecommerceearn.app.data.model.Order
import com.ecommerceearn.app.data.remote.NetworkClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import androidx.compose.material3.ExperimentalMaterial3Api
import java.text.SimpleDateFormat
import java.util.*
import retrofit2.HttpException
import java.net.UnknownHostException
import java.net.SocketTimeoutException

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyOrdersScreen(onBackClick: () -> Unit) {
    val scope = rememberCoroutineScope()
    var orders by remember { mutableStateOf<List<Order>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Helper function to get user-friendly error message
    fun getErrorMessage(e: Exception): String {
        return when (e) {
            is HttpException -> {
                when (e.code()) {
                    401, 403 -> "Session expired. Please login again."
                    404 -> "Orders not found."
                    500, 502, 503, 504 -> "Server is temporarily unavailable. Please try again later."
                    else -> "Server error (${e.code()}). Please try again."
                }
            }
            is UnknownHostException -> "No internet connection. Please check your network."
            is SocketTimeoutException -> "Connection timed out. Please try again."
            else -> "Something went wrong. Please try again."
        }
    }

    // Fetch Orders with retry logic
    suspend fun fetchOrdersWithRetry(maxRetries: Int = 3): List<Order> {
        var lastException: Exception? = null
        repeat(maxRetries) { attempt ->
            try {
                return NetworkClient.apiService.getOrders()
            } catch (e: HttpException) {
                // Don't retry on client errors (4xx) except 408 (timeout)
                if (e.code() in 400..499 && e.code() != 408) {
                    throw e
                }
                lastException = e
                if (attempt < maxRetries - 1) {
                    delay(1000L * (attempt + 1)) // Exponential backoff
                }
            } catch (e: Exception) {
                lastException = e
                if (attempt < maxRetries - 1) {
                    delay(1000L * (attempt + 1))
                }
            }
        }
        throw lastException ?: Exception("Failed after $maxRetries retries")
    }

    // Fetch Orders logic
    LaunchedEffect(Unit) {
        if (!AuthManager.isLoggedIn()) {
            errorMessage = "Please login to view orders"
            isLoading = false
            return@LaunchedEffect
        }
        
        try {
            isLoading = true
            errorMessage = null
            orders = fetchOrdersWithRetry()
        } catch (e: Exception) {
            android.util.Log.e("MyOrdersScreen", "Failed to fetch orders", e)
            errorMessage = getErrorMessage(e)
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            SmallTopAppBar(
                title = { Text("My Orders", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = Color.Black,
                    navigationIconContentColor = Color.Black
                )
            )
        },
        containerColor = Color(0xFFF3F4F6) // Page Background
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                isLoading -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                errorMessage != null -> {
                    ErrorView(message = errorMessage!!, onRetry = {
                         scope.launch {
                             isLoading = true
                             errorMessage = null
                             try {
                                 orders = fetchOrdersWithRetry()
                             } catch (e: Exception) {
                                  errorMessage = getErrorMessage(e)
                             } finally {
                                 isLoading = false
                             }
                         }
                    })
                }
                orders.isEmpty() -> {
                    EmptyOrdersView()
                }
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(orders) { order ->
                            OrderCard(order = order)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OrderCard(order: Order) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: ID + Date + Status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Order #${order.id.takeLast(8).uppercase()}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF111827)
                    )
                    order.createdAt?.let {
                        Text(
                            text = formatDate(it),
                            fontSize = 12.sp,
                            color = Color(0xFF6B7280)
                        )
                    }
                }
                StatusBadge(status = order.status)
            }

            Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(vertical = 12.dp))

            // Items
            order.items.forEach { item ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Image
                    AsyncImage(
                        model = item.productId.images?.firstOrNull(),
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(50.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFFE5E7EB))
                    )
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Column {
                        Text(
                            text = item.productId.title ?: "Product",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF111827),
                            maxLines = 1
                        )
                        Text(
                            text = "Qty: ${item.quantity} × ₹${item.price.toInt()}",
                            fontSize = 12.sp,
                            color = Color(0xFF6B7280)
                        )
                    }
                }
            }

            Divider(color = Color(0xFFE5E7EB), modifier = Modifier.padding(vertical = 12.dp))

            // Footer: Address & Total
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                   order.shippingAddress?.let { addr ->
                       Text(
                           text = "${addr.city}, ${addr.state}",
                           fontSize = 12.sp,
                           color = Color(0xFF6B7280)
                       )
                   }
                }
                Text(
                    text = "₹${(order.payableAmount ?: order.totalAmount).toInt()}",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
            }
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (bgColor, textColor) = when(status.uppercase()) {
        "PAID", "DELIVERED" -> Color(0xFF22C55E) to Color.White
        "PROCESSING", "SHIPPED" -> Color(0xFF3B82F6) to Color.White
        "CREATED", "PENDING" -> Color(0xFFF59E0B) to Color.White
        "CANCELLED", "FAILED", "REFUNDED" -> Color(0xFFEF4444) to Color.White
        else -> Color(0xFF6B7280) to Color.White
    }
    
    Surface(
        color = bgColor,
        shape = RoundedCornerShape(4.dp)
    ) {
        Text(
            text = status,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun EmptyOrdersView() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.Inbox, // Using Inbox as simplified Box icon
            contentDescription = null,
            modifier = Modifier.size(60.dp),
            tint = Color(0xFFD1D5DB)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text("No orders yet", fontSize = 18.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
        Text("Start shopping to see your orders here", fontSize = 14.sp, color = Color(0xFF6B7280))
    }
}

@Composable
fun ErrorView(message: String, onRetry: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.Warning,
            contentDescription = null,
            modifier = Modifier.size(50.dp),
            tint = Color(0xFFF59E0B)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(message, fontSize = 14.sp, color = Color(0xFF6B7280), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2874F0))) {
            Text("Retry", color = Color.White)
        }
    }
}

private fun formatDate(dateString: String): String {
    return try {
        // Assume ISO 8601 format like "2023-10-27T10:00:00.000Z"
        val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val date = parser.parse(dateString)
        val formatter = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())
        date?.let { formatter.format(it) } ?: dateString
    } catch (e: Exception) {
        dateString
    }
}
