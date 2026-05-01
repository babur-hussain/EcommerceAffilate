package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.localforvocalstartup.app.data.manager.Review
import java.text.SimpleDateFormat
import java.util.Locale

@Composable
fun ReviewRowView(review: Review) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            // User Avatar
            if (!review.userId.profileImage.isNullOrEmpty()) {
                AsyncImage(
                    model = review.userId.profileImage,
                    contentDescription = "User Avatar",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.Gray.copy(alpha = 0.3f))
                )
            } else {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = "Default Avatar",
                    tint = Color.Gray.copy(alpha = 0.5f),
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.LightGray.copy(alpha = 0.3f))
                        .padding(4.dp)
                )
            }

            // User Info & Rating
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = review.userId.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF1F2937)
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    StarRatingView(rating = review.rating, size = 12.dp)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = formatDate(review.createdAt),
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }
        }

        // Comment
        Text(
            text = review.comment,
            fontSize = 14.sp,
            color = Color(0xFF4B5563)
        )
    }
}

private fun formatDate(dateString: String): String {
    return try {
        // Attempt full ISO8601
        val parserFull = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.getDefault())
        val dateFull = parserFull.parse(dateString)
        val formatter = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())
        if (dateFull != null) return formatter.format(dateFull)
        
        // Attempt basic ISO8601
        val parserBasic = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX", Locale.getDefault())
        val dateBasic = parserBasic.parse(dateString)
        if (dateBasic != null) return formatter.format(dateBasic)
        
        dateString // fallback
    } catch (e: Exception) {
        dateString
    }
}
