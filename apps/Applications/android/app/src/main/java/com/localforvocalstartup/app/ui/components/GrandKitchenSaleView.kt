package com.localforvocalstartup.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class PromoItem(
    val id: String,
    val title: String,
    val image: String,
    val offer: String,
    val isIllustration: Bool = false
)

typealias Bool = Boolean

@Composable
fun GrandKitchenSaleView() {
    val promoItems = listOf(
        PromoItem("dining", "Dining &\nDrinkware", "https://images.unsplash.com/photo-1577934214051-94285f25e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", "Up to 80% off"),
        PromoItem("cookware", "Cookware\n& Tools", "https://images.unsplash.com/photo-1584990347449-a0c92335e953?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", "Up to 70% off"),
        PromoItem("storage", "Kitchen\nStorage", "https://images.unsplash.com/photo-1517056463774-4b830d1de725?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", "Up to 80% off"),
        PromoItem("deals", "Limited time\nDeals", "https://cdn-icons-png.flaticon.com/512/2972/2972531.png", "Starting from ₹45", true),
        PromoItem("pressure-cooker", "Pressure\nCooker", "https://images.unsplash.com/photo-1593922712952-b8f36c56c257?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", "Up to 60% off"),
        PromoItem("winter", "Winter\nEssentials", "https://images.unsplash.com/photo-1544026230-01d2f838bc35?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", "Starting @ ₹99")
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(safeParseColor("#FFF8F3"), safeParseColor("#FDEEE4"))
                    )
                )
        ) {
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier
                        .padding(start = 16.dp)
                        .weight(1f)
                ) {
                    Text(
                        text = "GRAND",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        color = safeParseColor("#6F5C4C"),
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "KITCHEN",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        color = safeParseColor("#0F3443"),
                        letterSpacing = (-1).sp
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "SALE",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = safeParseColor("#0F3443"),
                            letterSpacing = (-1).sp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "UP TO 80% OFF",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            modifier = Modifier
                                .background(safeParseColor("#5D4037"), RoundedCornerShape(2.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                AsyncImage(
                    model = "https://images.unsplash.com/photo-1556910602-38f53e68e15d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .width(160.dp)
                        .height(140.dp)
                        .offset(x = 10.dp, y = 10.dp)
                )
            }
        }

        // Grid Items
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            val columns = 3
            val rows = (promoItems.size + columns - 1) / columns
            
            for (i in 0 until rows) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    for (j in 0 until columns) {
                        val index = i * columns + j
                        if (index < promoItems.size) {
                            PromoCard(promoItems[index], Modifier.weight(1f))
                        } else {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
        
        // Bank Offer
        BankOfferBanner()
    }
}

@Composable
fun PromoCard(item: PromoItem, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .shadow(2.dp, RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .clickable { }
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
           Column(
               horizontalAlignment = Alignment.CenterHorizontally,
               modifier = Modifier.height(130.dp)
           ) {
               Text(
                   text = item.title,
                   fontSize = 12.sp,
                   fontWeight = FontWeight.SemiBold,
                   color = safeParseColor("#4B5563"),
                   textAlign = TextAlign.Center,
                   modifier = Modifier
                       .padding(top = 12.dp)
                       .height(32.dp)
               )

               AsyncImage(
                   model = item.image,
                   contentDescription = null,
                   contentScale = ContentScale.Fit,
                   modifier = Modifier
                       .height(70.dp)
                       .fillMaxWidth()
                       .padding(vertical = 4.dp)
               )
           }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(30.dp)
                    .background(safeParseColor("#0F3443")),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = item.offer,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}

@Composable
fun BankOfferBanner() {
    Box(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 0.dp)
            .padding(bottom = 24.dp)
            .fillMaxWidth()
            .border(1.dp, safeParseColor("#E5E7EB"), RoundedCornerShape(8.dp))
            .clip(RoundedCornerShape(8.dp))
            .background(Color.White)
            .padding(12.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png",
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.width(80.dp).height(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Box(
                    modifier = Modifier
                        .width(1.dp)
                        .height(16.dp)
                        .background(safeParseColor("#D1D5DB"))
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "Flat ₹100 off on orders above ₹999",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = safeParseColor("#1F2937")
                )
            }
            Text(
                text = "with HSBC Bank Credit Cards",
                fontSize = 10.sp,
                color = safeParseColor("#6B7280"),
                modifier = Modifier
                    .align(Alignment.End)
                    .padding(top = 4.dp)
            )
        }
    }
}
