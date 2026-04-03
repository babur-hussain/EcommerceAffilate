package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ecommerceearn.app.ui.viewmodel.SearchState
import com.ecommerceearn.app.ui.viewmodel.SearchViewModel
import com.ecommerceearn.app.utils.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GlobalSearchView(
    onDismiss: () -> Unit = {},
    categoryId: String? = null
) {
    val viewModel: SearchViewModel = viewModel()
    val query by viewModel.query.collectAsState()
    val searchState by viewModel.searchState.collectAsState()
    val globalResults by viewModel.globalResults.collectAsState()
    val trendingTerms by viewModel.trendingTerms.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // Search Bar Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onDismiss) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF212121))
            }

            OutlinedTextField(
                value = query,
                onValueChange = { viewModel.setQuery(it) },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Search products, brands...", fontSize = 14.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = Color.Gray) },
                trailingIcon = {
                    if (query.isNotEmpty()) {
                        IconButton(onClick = { viewModel.setQuery("") }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", tint = Color.Gray)
                        }
                    }
                },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AppTheme.Colors.primary,
                    unfocusedBorderColor = Color(0xFFE0E0E0)
                )
            )
        }

        Divider(color = Color(0xFFE0E0E0))

        // Content
        when (searchState) {
            is SearchState.Idle -> {
                // Show trending
                if (trendingTerms.isNotEmpty()) {
                    Text(
                        "Trending Searches",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp,
                        color = Color(0xFF878787),
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
                    )
                    LazyColumn {
                        items(trendingTerms) { term ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { viewModel.setQuery(term) }
                                    .padding(horizontal = 16.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(term, fontSize = 14.sp, color = Color(0xFF212121))
                            }
                        }
                    }
                } else {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("Start typing to search...", color = Color.Gray)
                    }
                }
            }
            is SearchState.Loading -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = AppTheme.Colors.primary)
                }
            }
            is SearchState.Results -> {
                val products = globalResults?.products ?: emptyList()
                val suggestions = globalResults?.suggestions ?: emptyList()
                
                if (products.isEmpty() && suggestions.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No results found for \"$query\"", color = Color.Gray)
                    }
                } else {
                    LazyColumn {
                        // Live Suggestions first
                        if (suggestions.isNotEmpty()) {
                            item {
                                Text(
                                    "Recommendations",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF878787),
                                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
                                )
                            }
                            items(suggestions) { suggestion ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { viewModel.setQuery(suggestion) }
                                        .padding(horizontal = 16.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Default.Search, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Text(suggestion, fontSize = 14.sp, color = Color(0xFF212121))
                                }
                            }
                            item {
                                Divider(color = Color(0xFFE0E0E0), modifier = Modifier.padding(horizontal = 16.dp))
                            }
                        }

                        // Products
                        if (products.isNotEmpty()) {
                            item {
                                Text(
                                    "Products",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF878787),
                                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
                                )
                            }
                            items(products) { product ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { 
                                            // Optional: Handle product click
                                            // NavigationManager.openGroceryProduct(product.id)
                                        }
                                        .padding(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(modifier = Modifier.size(48.dp).background(Color(0xFFF3F4F6)))
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(product.name ?: "Unknown", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                                        Text("₹${product.price}", color = AppTheme.Colors.primary, fontWeight = FontWeight.Bold)
                                    }
                                }
                                Divider(color = Color(0xFFF0F0F0))
                            }
                        }
                    }
                }
            }
            is SearchState.Error -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Search error. Please try again.", color = Color.Red)
                }
            }
        }
    }
}
