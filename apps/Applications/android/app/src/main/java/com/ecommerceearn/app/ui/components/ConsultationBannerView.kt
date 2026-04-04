package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.NavigationManager

@Composable
fun ConsultationBannerView(
    actionUrl: String?,
    title: String,
    callText: String,
    phoneNumber: String,
    poweredByText: String,
    providerName: String,
    doctorImage: String
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .padding(bottom = 24.dp)
            .height(140.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFD1E7FC))
            .clickable {
                if (!actionUrl.isNullOrEmpty()) {
                    NavigationManager.navigate(actionUrl)
                }
            }
    ) {
        // Doctor Image positioned bottom trailing
        if (doctorImage.isNotEmpty()) {
            AsyncImage(
                model = doctorImage,
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .size(width = 120.dp, height = 130.dp)
                    .align(Alignment.BottomEnd)
                    .offset(x = 0.dp, y = 10.dp)
            )
        }

        // Decorative Bubbles
        Box(
            modifier = Modifier
                .size(20.dp)
                .align(Alignment.TopCenter)
                .offset(x = 80.dp, y = (-10).dp)
                .background(Color.White.copy(alpha = 0.5f), CircleShape)
        )
        Box(
            modifier = Modifier
                .size(10.dp)
                .align(Alignment.Center)
                .offset(x = 60.dp, y = 30.dp)
                .background(Color.White.copy(alpha = 0.3f), CircleShape)
        )

        // Left Content
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .padding(start = 16.dp, top = 16.dp, bottom = 16.dp)
                    .zIndex(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Title Row
                Row(
                    verticalAlignment = Alignment.Top,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "🩺",
                        fontSize = 24.sp
                    )
                    Text(
                        text = title,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D47A1),
                        maxLines = 3,
                        lineHeight = 18.sp
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    // Divider
                    Box(
                        modifier = Modifier
                            .width(1.dp)
                            .height(30.dp)
                            .background(Color(0xFF90CAF9))
                    )

                    // Call Info
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(
                            text = callText,
                            fontSize = 10.sp,
                            color = Color(0xFF1565C0)
                        )
                        Text(
                            text = phoneNumber,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0D47A1)
                        )
                    }
                }

                // Powered By Badge
                Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
                    Text(
                        text = poweredByText,
                        fontSize = 9.sp,
                        color = Color(0xFF555555)
                    )
                    Text(
                        text = providerName,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontStyle = FontStyle.Italic,
                        color = Color(0xFF0056D2)
                    )
                }
            }
            Spacer(modifier = Modifier.weight(1f))
        }
    }
}
