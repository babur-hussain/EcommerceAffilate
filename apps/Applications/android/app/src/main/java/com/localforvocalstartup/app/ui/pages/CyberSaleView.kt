package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun CyberSaleView(onNavigateBack: () -> Unit = {}) {
    val bgLight = Color(0xFFF3F4F6)
    val cyberBlue = Color(0xFF3478C2)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgLight)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // Standard Navigation Header
            com.localforvocalstartup.app.ui.components.StandardNavigationHeader(
                title = "Cyber Sale",
                onNavigateBack = onNavigateBack,
                bgColor = cyberBlue,
                textColor = Color.White,
                iconBgColor = Color.White.copy(alpha = 0.2f),
                iconTintColor = Color.White
            )
            
            // Header Area (Including pseudo status bar since it's edge-to-edge in iOS)
            CyberSaleHeader()
            
            // Main Content Area overlapping the header
            Column(
                modifier = Modifier
                    .offset(y = (-24).dp)
                    .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                    .background(bgLight)
                    .padding(top = 32.dp, start = 16.dp, end = 16.dp)
            ) {
                CyberSaleCategories()
                Spacer(modifier = Modifier.height(24.dp))
                CyberSaleFlashDeals()
                Spacer(modifier = Modifier.height(24.dp))
                CyberSaleSecretDealsBanner()
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun CyberSaleHeader() {
    val primaryYellow = Color(0xFFFFD646)
    val cyberBlue = Color(0xFF3478C2)
    val cyberPink = Color(0xFFFF528F)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(480.dp)
            .background(cyberBlue)
    ) {
        // Pseudo Halftone pattern (just some decorative circles for Android approximation)
        for (i in 0..10) {
            Box(
                modifier = Modifier
                    .offset(x = (i * 30).dp, y = (i * 40).dp)
                    .size(4.dp)
                    .background(Color.Black.copy(alpha = 0.05f), CircleShape)
            )
        }
        
        // Action Lines
        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
            Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                Box(modifier = Modifier.width(40.dp).height(400.dp).rotate(15f).background(primaryYellow.copy(alpha = 0.15f)))
                Box(modifier = Modifier.width(60.dp).height(400.dp).rotate(15f).background(primaryYellow.copy(alpha = 0.15f)))
            }
        }

        // Left Sticker
        AsyncImage(
            model = "https://lh3.googleusercontent.com/aida-public/AB6AXuAMxshYMr8JAzwDltL6x0IOeuUXLyRX3D0iqnOQFwnumDpzQtrczPhI14tUq53TGrvy4349EfonUt3HbiuDu5ZtaFSP6AelBUm0dbnczgA8lV9EFkKNJLg-Kg8Fgxp4Iy9SsLWKUMT6CGCgiYFidbtlYYrWiNMQjhh-kXDzlrKX6fOJ4ernCkp8CNe89NRXW_UmOQSxhpEcV-ZHwxfHhNhYERGnQXuOKsf-46cQbpY1yE7dxnk4nmMIm0o26-LLq-ZFwPFHRpzRcicS",
            contentDescription = null,
            modifier = Modifier
                .offset(x = 20.dp, y = 50.dp)
                .size(80.dp)
                .rotate(-15f)
                .shadow(4.dp, RoundedCornerShape(12.dp))
                .background(Color.White, RoundedCornerShape(12.dp))
                .border(4.dp, Color.White, RoundedCornerShape(12.dp))
        )

        // Right Sticker
        AsyncImage(
            model = "https://lh3.googleusercontent.com/aida-public/AB6AXuAakzBYMcihd0rTGWjFIqPVHdHiLxdYM0HvEqLqaau4i1m-02lQ3Jw8b_ihyVZ7sR4j8p1jjiPEqssEIaqmll7YTBIfH-78Y11vPYDmsSZjKWH4xs8sZog31hI5iTzZ2FQeP8-jokq6V3sTi77XRa83AlJ3zpduqnmMoaUtH8j2bPBVKGS-xbzRPONybwbrlqrfFOhPCagRD2oYVtK9fDAwNZhK1yO9m1E1RfEw-Q7OVAsU_Frh1D0PtMPz58JiLmj-fUbnWsdxznyF",
            contentDescription = null,
            modifier = Modifier
                .align(Alignment.TopEnd)
                .offset(x = (-20).dp, y = 80.dp)
                .size(100.dp)
                .rotate(20f)
                .shadow(4.dp, RoundedCornerShape(12.dp))
                .background(Color.White, RoundedCornerShape(12.dp))
                .border(4.dp, Color.White, RoundedCornerShape(12.dp))
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 60.dp, bottom = 80.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text("SPECIAL OFFER", fontSize = 14.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp, color = Color.White)
            Text("CYBER", fontSize = 64.sp, fontWeight = FontWeight.Black, fontStyle = FontStyle.Italic, color = Color.White)
            Text(
                "MONDAY",
                fontSize = 48.sp,
                fontWeight = FontWeight.Black,
                fontStyle = FontStyle.Italic,
                color = Color.White,
                modifier = Modifier
                    .padding(vertical = 4.dp, horizontal = 16.dp)
                    .border(2.dp, Color.White, RoundedCornerShape(8.dp))
                    .padding(bottom = 16.dp)
            )

            Box(
                modifier = Modifier
                    .padding(bottom = 16.dp)
                    .rotate(-2f)
                    .shadow(4.dp, CircleShape)
                    .background(cyberPink, CircleShape)
                    .border(2.dp, Color.White, CircleShape)
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Text("UP TO 70% OFF", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
            }

            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = primaryYellow),
                shape = CircleShape,
                contentPadding = PaddingValues(horizontal = 32.dp, vertical = 14.dp),
                modifier = Modifier.shadow(4.dp, CircleShape, ambientColor = Color.Yellow, spotColor = Color.Yellow)
            ) {
                Text("SHOP NOW", fontSize = 16.sp, fontWeight = FontWeight.Black, color = Color.Black)
            }
        }
        
        // Bottom border
        Box(modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().height(4.dp).background(Color.Black))
    }
}

@Composable
private fun CyberSaleCategories() {
    val cyberBlue = Color(0xFF3478C2)
    val cyberPink = Color(0xFFFF528F)

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("CATEGORIES", fontSize = 20.sp, fontWeight = FontWeight.Black, color = cyberBlue)
            Text("SWIPE FOR MORE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
        }

        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 8.dp)
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            CyberSaleCategoryItem(Icons.Default.Computer, "Tech", cyberBlue)
            CyberSaleCategoryItem(Icons.Default.Face, "Style", cyberPink) // using generic available icons
            CyberSaleCategoryItem(Icons.Default.PlayArrow, "Gaming", Color.Green)
            CyberSaleCategoryItem(Icons.Default.DirectionsWalk, "Active", Color.Magenta)
            CyberSaleCategoryItem(Icons.Default.Home, "Home", Color.Cyan)
        }
    }
}

@Composable
private fun CyberSaleCategoryItem(icon: ImageVector, name: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .size(64.dp)
                .shadow(4.dp, RoundedCornerShape(16.dp), spotColor = Color.Black)
                .background(Color.White, RoundedCornerShape(16.dp))
                .border(2.dp, Color.Black, RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = icon, contentDescription = name, tint = color, modifier = Modifier.size(28.dp))
        }
        Text(name, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
    }
}

@Composable
private fun CyberSaleFlashDeals() {
    val cyberPink = Color(0xFFFF528F)
    
    val deals = listOf(
        FlashDeal("Ultra Bass Headphones", "$89", "$149", "-40%", "https://lh3.googleusercontent.com/aida-public/AB6AXuBynHwbBIbW9WLBg061p80sdh4VbpRXq63bVsPzAlI5S6ajFsZxBWjB2_EK9JZt8upJmTEvikcxo9UauMLnG99HKHXOqJCfrkYKr3XbMwxoHL1SR56r8b7e7riofe9e9u3vQfXFIAhfDSF94TL2f4Vl7d7QkJIbcX_0C8M3U-HyNP1qwvh2RkT6Yk7w2kTT4mdV_FX65MhowFzN6FFJc5nIGSXxN6NzQttnfniSDtDaxhm_6bVMQ0PQrgsALBuansKWBBZ9WMQ6U-cl"),
        FlashDeal("Cyber Smart Watch", "$45", "$150", "-70%", "https://lh3.googleusercontent.com/aida-public/AB6AXuBKyo7oT2qUDEm03WU-n3BlKXSo9C7GFjtwPT1Nzwr4BxtYbRjFz87xQs0X8ZBJRb71qIMNpYkucLB0I10-PmCsQ0OIxh5Qp6Z_3FpVyyjbolxLCkrDxbiCy3zF2EGOkfBkbYiA11w-N9DElIyCPJcUk1FcToOo9X2QYdrOWJAALu8MuD4BzJ5AC-rF0rV1V08-cBeNh82raOpGHnUbm4rK1ee-OqXr5nEoN7HimcbuIkmG5HsIc0P22MMZSY8bDFhZtqgxhK4i4VDW"),
        FlashDeal("Gamer Keyboard RGB", "$120", "$160", "-25%", "https://lh3.googleusercontent.com/aida-public/AB6AXuAIyZ8lR0So1in-fb-UdKU9FWNB_HGZnD9pGnM4C8bVmePUJPw2hUfES0kQrBScFh9Ic8K0lGeF4e_AFFVY6JoWvVAZERWSsynejMCALgsXVJd4LhX_dAVYNEkAvqdGv7Vg_56rQdhee_AHFn0F5n91yZanqofaUvbY7pzdkxk1R2fVLZuK4V-wkVgiMzPYoAR7StFWz_W2yYIQQ4C9n5_ei_5l_CIafzUm912gsxbjAi8AUny-xVj2eITwpmIplzlVptvVyrtYqfS4"),
        FlashDeal("Wireless Gamepad", "$29", "$59", "-50%", "https://lh3.googleusercontent.com/aida-public/AB6AXuBMIbQ61_Ko2patxpNMwXKf6Uk0I5cSqJbw6k-9amZg1q1VVDUiSDoZda_XHLGI__Rt-_Er43XC5SsojqExgHZjrOKiyYFfJXVe1_aNbCegKx8w0TGCplwIH4h6FpovT3jxO4emg5DMCTQW1YsTwff7F3gyWJP37EQbpBGj_wdzj-VeSCGS0jnXP0pjEeXFA0b8Cyhyf_PXlKNNdfAw7y7XCd98ZUOe5640NrUg4Yvksx6HEoBPNevlGLaf9lM45URQERCbs14bt3_Q")
    )

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Bolt, contentDescription = null, tint = cyberPink)
            Text("FLASH DEALS", fontSize = 20.sp, fontWeight = FontWeight.Black, fontStyle = FontStyle.Italic, color = Color.Black)
            Spacer(modifier = Modifier.weight(1f))
            Text(
                "02:45:12",
                fontSize = 12.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                color = Color.White,
                modifier = Modifier.background(Color.Black, RoundedCornerShape(4.dp)).padding(horizontal = 8.dp, vertical = 4.dp)
            )
        }

        // Simulating LazyVGrid
        for (i in deals.indices step 2) {
            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Box(modifier = Modifier.weight(1f)) { CyberSaleFlashDealCard(deals[i]) }
                Box(modifier = Modifier.weight(1f)) { 
                    if (i + 1 < deals.size) { CyberSaleFlashDealCard(deals[i+1]) } 
                }
            }
        }
    }
}

data class FlashDeal(val title: String, val price: String, val oldPrice: String, val discount: String, val image: String)

@Composable
private fun CyberSaleFlashDealCard(deal: FlashDeal) {
    val cyberPink = Color(0xFFFF528F)
    val primaryYellow = Color(0xFFFFD646)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(10.dp, RoundedCornerShape(24.dp), spotColor = Color.Black.copy(alpha = 0.5f)) // To match iOS intense shadows
            .background(Color.White, RoundedCornerShape(24.dp))
            .border(4.dp, Color.White, RoundedCornerShape(24.dp))
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(150.dp)
                .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                .background(Color.Gray.copy(alpha = 0.1f))
        ) {
            AsyncImage(
                model = deal.image,
                contentDescription = deal.title,
                modifier = Modifier.fillMaxSize().padding(16.dp),
                contentScale = ContentScale.Fit
            )

            Box(
                modifier = Modifier
                    .offset(x = 8.dp, y = 8.dp)
                    .rotate(-5f)
                    .background(cyberPink, RoundedCornerShape(4.dp))
                    .border(2.dp, Color.White, RoundedCornerShape(4.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(deal.discount, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }

        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(deal.title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Black, maxLines = 1)
            
            Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(deal.price, fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.Black)
                Text(deal.oldPrice, fontSize = 12.sp, textDecoration = TextDecoration.LineThrough, color = Color.Gray)
            }

            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = primaryYellow),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().shadow(3.dp, RoundedCornerShape(12.dp), spotColor = Color.Yellow)
            ) {
                Text("BUY NOW", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            }
        }
    }
}

@Composable
private fun CyberSaleSecretDealsBanner() {
    val primaryYellow = Color(0xFFFFD646)
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(160.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color.Black)
    ) {
        // pseudo halftone
        for (i in 0..10) {
            Box(
                modifier = Modifier
                    .offset(x = (i * 25).dp, y = (i * 15).dp)
                    .size(4.dp)
                    .background(Color.White.copy(alpha = 0.1f), CircleShape)
            )
        }

        Row(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("UNLOCK\nSECRET DEALS", fontSize = 24.sp, fontWeight = FontWeight.Black, fontStyle = FontStyle.Italic, color = Color.White)
                Text("Limited to first 500 customers", fontSize = 12.sp, color = Color.Gray)
                
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    shape = CircleShape,
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier.padding(top = 8.dp).height(30.dp)
                ) {
                    Text("ENTER CODE: CYBER500", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                }
            }
            Icon(Icons.Default.Star, contentDescription = null, tint = primaryYellow, modifier = Modifier.size(48.dp))
        }
    }
}
