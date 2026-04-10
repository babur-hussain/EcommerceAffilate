package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Category
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.launch

data class CategoryGroup(
    val name: String,
    val categories: List<Category>
)

@Composable
fun GroceryCategoryPageView() {
    val GROCERY_PARENT_ID = "697095953758a7d8f76fa88c"
    var categoryGroups by remember { mutableStateOf<List<CategoryGroup>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val allCategories = com.ecommerceearn.app.data.repository.CategoryRepository.getCategories()
                
                // 1. Find the parent Grocery category to get the group order
                val parentCategory = allCategories.find { it._id == GROCERY_PARENT_ID }
                val groupOrder = parentCategory?.subCategoryGroupOrder ?: emptyList()

                // 2. Filter for subcategories of Grocery
                val grocerySubcategories = allCategories.filter { it.parentCategory == GROCERY_PARENT_ID }

                // 3. Group by 'group' property
                val grouped = grocerySubcategories.groupBy { it.group ?: "Other" }

                // 4. Sort groups based on groupOrder
                val sortedGroups = mutableListOf<CategoryGroup>()

                for (groupName in groupOrder) {
                    grouped[groupName]?.let { cats ->
                        sortedGroups.add(CategoryGroup(name = groupName, categories = cats))
                    }
                }

                val remainingKeys = grouped.keys.filter { !groupOrder.contains(it) }.sorted()
                for (groupName in remainingKeys) {
                    grouped[groupName]?.let { cats ->
                        sortedGroups.add(CategoryGroup(name = groupName, categories = cats))
                    }
                }

                categoryGroups = sortedGroups
            } catch (e: Exception) {
                AppLogger.error("Failed to load grocery categories: ${e.message}")
            } finally {
                isLoading = false
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // Fixed Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .zIndex(1f)
                .shadow(elevation = 2.dp)
                .background(Color(0xFFFFF8E7))
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp) // adjusted for Android
        ) {
            Text(
                text = "All Categories",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF374151)
            )
        }

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(color = Color(0xFF2874F0))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Loading categories...", fontSize = 14.sp, color = Color.Gray)
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 20.dp, bottom = 120.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                categoryGroups.forEach { group ->
                    item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(maxLineSpan) }) {
                        Text(
                            text = group.name,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF111827),
                            modifier = Modifier.padding(top = 12.dp, bottom = 8.dp)
                        )
                    }

                    items(group.categories) { category ->
                        CategoryGridItem(category = category)
                    }
                }
            }
        }
    }
}

@Composable
fun CategoryGridItem(category: Category) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable {
                // Future navigation logic mapping to List Page
            },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .background(Color(0xFFF3F4F6), RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            if (!category.image.isNullOrEmpty()) {
                val imageUrl = if (category.image.startsWith("http")) category.image else "https://api.lfvs.in/${category.image.removePrefix("/")}"
                AsyncImage(
                    model = imageUrl,
                    contentDescription = category.name,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(8.dp)
                )
            } else {
                Text(
                    text = category.icon ?: "📂",
                    fontSize = 24.sp,
                    color = Color.Gray
                )
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = category.name,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF374151),
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
    }
}
