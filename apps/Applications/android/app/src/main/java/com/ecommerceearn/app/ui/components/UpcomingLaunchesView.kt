package com.ecommerceearn.app.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.SDUIComponent
import com.google.gson.JsonObject

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun UpcomingLaunchesView(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Upcoming Launches"
    val headerActionUrl = component.props?.get("headerActionUrl")?.asString
    val items = component.decodeItems("items", JsonObject::class.java)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(top = 32.dp, bottom = 16.dp)
    ) {
        // Header
        Text(
            text = title,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable {
                    headerActionUrl?.let {
                        // Navigate
                    }
                }
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (items.isNotEmpty()) {
            val pagerState = rememberPagerState(pageCount = { items.size })

            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                HorizontalPager(
                    state = pagerState,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                ) { page ->
                    val item = items[page]
                    val image = item.get("image")?.asString ?: ""
                    val actionUrl = item.get("actionUrl")?.asString

                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .clickable {
                                actionUrl?.let {
                                }
                            }
                    ) {
                        AsyncImage(
                            model = image,
                            contentDescription = null,
                            contentScale = ContentScale.FillWidth,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Custom Paging Dots
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    repeat(items.size) { iteration ->
                        if (pagerState.currentPage == iteration) {
                            Box(
                                modifier = Modifier
                                    .size(width = 24.dp, height = 4.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(Color.Black)
                            )
                        } else {
                            Box(
                                modifier = Modifier
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(Color.Gray.copy(alpha = 0.4f))
                            )
                        }
                    }
                }
            }
        }
    }
}
