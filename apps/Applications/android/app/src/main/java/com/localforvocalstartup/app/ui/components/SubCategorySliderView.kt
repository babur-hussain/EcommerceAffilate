package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class SubCategory(
    val id: String,
    val name: String,
    val image: String?
)

@Composable
fun SubCategorySliderView(
    parentCategoryId: String = "",
    subCategories: List<SubCategory> = emptyList(),
    onNavigate: (String) -> Unit = {}
) {
    if (subCategories.isNotEmpty()) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Using chunked to create 2 rows
                val chunkedItems = subCategories.chunked(2)
                for (columnItems in chunkedItems) {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        for (sub in columnItems) {
                            SubCategoryCell(
                                sub = sub,
                                parentCategoryId = parentCategoryId,
                                onClick = { onNavigate("category://${sub.name}?categoryId=$parentCategoryId&subCategoryId=${sub.id}") }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SubCategoryCell(
    sub: SubCategory,
    parentCategoryId: String,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .clickable(onClick = onClick)
            .width(80.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Box(
            modifier = Modifier
                .size(70.dp)
                .background(Color.White, RoundedCornerShape(12.dp))
                .border(1.dp, Color.Gray.copy(alpha = 0.1f), RoundedCornerShape(12.dp))
                .clip(RoundedCornerShape(12.dp))
        ) {
            if (!sub.image.isNullOrEmpty()) {
                AsyncImage(
                    model = sub.image,
                    contentDescription = sub.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Box(modifier = Modifier.fillMaxSize().background(Color.Gray.copy(alpha = 0.1f)))
            }
        }

        Text(
            text = sub.name,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF374151),
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
    }
}
