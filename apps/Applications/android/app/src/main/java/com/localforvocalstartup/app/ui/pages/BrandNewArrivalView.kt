package com.localforvocalstartup.app.ui.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun BrandNewArrivalView(onNavigateBack: () -> Unit = {}) {
    val bgColor = Color(0xFFFDFCF9) // 0.99, 0.99, 0.98
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgColor)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            BrandNewArrivalHeader(onNavigateBack)
            
            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(bottom = 120.dp)
            ) {
                item { BrandNewArrivalHero() }
                item { BrandNewArrivalCollectionHeader() }
                item { BrandNewArrivalProductGrid() }
                item { BrandNewArrivalNewsletter() }
            }
        }
        
        BrandNewArrivalBottomNav(
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Composable
private fun BrandNewArrivalHeader(onNavigateBack: () -> Unit) {
    val iconColor = Color(0xFF595959)
    val beigeColor = Color(0xFFD1B58C)
    
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFFDFCF9).copy(alpha = 0.8f))
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(
                    imageVector = Icons.Default.Menu,
                    contentDescription = "Menu",
                    tint = iconColor
                )
            }
            
            Text(
                text = "LUXE",
                fontFamily = FontFamily.Serif,
                fontSize = 24.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 6.sp,
                color = Color(0xFF403833) // 0.25, 0.22, 0.20
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                IconButton(onClick = { }) {
                    Icon(
                        imageVector = Icons.Outlined.Search,
                        contentDescription = "Search",
                        tint = iconColor
                    )
                }
                
                IconButton(onClick = { }) {
                    Box(contentAlignment = Alignment.TopEnd) {
                        Icon(
                            imageVector = Icons.Outlined.ShoppingBag,
                            contentDescription = "Cart",
                            tint = iconColor,
                            modifier = Modifier.padding(4.dp)
                        )
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .offset(x = (-4).dp, y = 4.dp)
                                .background(beigeColor, CircleShape)
                        )
                    }
                }
            }
        }
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(Color(0xFFE6E6E6))
        )
    }
}

@Composable
private fun BrandNewArrivalHero() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(400.dp)
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuC4KtvNZTORM6BF7WAkUzAbaKl09ue0n4XSt6ZFhmQe3gYh8m0SZ1NHKJpTPfOxwuigPNHzhS9nRMrZfuAifbfaOG2zAQhjMU8qyKLeE9E2FDRN16v6_q702FUuJ-dutxAr76KivmUVGWmxBloUtjNpkx3WsZHfaTu4yXMKKWl3Cm5UyAnbhWIKHDMVjsL1g7vLGSmR6IkIyzmIdhYsttn8wy3nfWcF5Ou02J7IG3KQ932ShCE66qif0Z_MuSEqgcVQJ9m7hn_kdvt4",
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .weight(0.25f)
                    .fillMaxHeight()
                    .background(Color(0xFFF5F2ED))
            )
            AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuB7B_ORgrzMVAzn-htq7okk_sV2-zubknWmdeCPC5YyBnXTFB5-pEnGxLUhgJS8Mu8XcxoQ4ZH-GWTOBoMRWWLiCwGeadprCA_F4hbA3mnFIrAz3H6LkFUhsdiy6i8ZePH_hwqskMNFV6h0Pm9nQR17ekhVxDiTJCxg4odCD6G7M6XslfmWhVk34wim09gnQyTba1G3OiA5Eggl0yNDeUCmBtbJpu5tNfmMgHgLrVeoYInN_UrtTrhxc8Yb-k_CBwHaDPgfxcOGR3Yl",
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight()
                    .background(Color(0xFFF5F2ED))
            )
            AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuARyivEa4K73CagAaakss47BJek7ZbxTuZmMDySdKenheUK0E5wI9GdoxgvndWMAu3aWVcx5MaTIn4sPfu-er5gAon0bx1R7wlUbfrvIhljRNRFKnOHU7lcOSMDldYtWAQKtDTjyZlzchXiJZraBlxKKszDrHjbaLlS9Qj6ETxwU40H3bIc-2MoMfgPeypyV8Y8PYX6LJm9rSZVP9E8YEkyjgWxt6iiNcYvUsXIl9rl6qK5BrCc9MX7WOqRfby7L7OAtaEEB-XhNLCP",
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .weight(0.25f)
                    .fillMaxHeight()
                    .background(Color(0xFFF5F2ED))
            )
        }
        
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0.0f to Color.Black.copy(alpha = 0.2f),
                        0.4f to Color.Transparent,
                        1.0f to Color.Black.copy(alpha = 0.4f)
                    )
                )
        )
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 32.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "PREMIUM JEWELRY",
                fontSize = 10.sp,
                letterSpacing = 4.sp,
                color = Color.White.copy(alpha = 0.9f),
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            Text(
                text = "Brand New Arrival",
                fontFamily = FontFamily.Serif,
                fontStyle = FontStyle.Italic,
                fontSize = 42.sp,
                color = Color.White,
                modifier = Modifier.padding(bottom = 32.dp)
            )
            
            Button(
                onClick = { },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD1B58C)),
                shape = RoundedCornerShape(0.dp),
                contentPadding = PaddingValues(horizontal = 40.dp, vertical = 14.dp)
            ) {
                Text(
                    text = "SHOP NOW",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 3.sp,
                    color = Color(0xFF403833)
                )
            }
        }
    }
}

@Composable
private fun BrandNewArrivalCollectionHeader() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .padding(top = 48.dp, bottom = 24.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = "NEW COLLECTION",
                fontSize = 10.sp,
                letterSpacing = 2.sp,
                color = Color(0xFF999999)
            )
            Text(
                text = "The Pearl Series",
                fontFamily = FontFamily.Serif,
                fontStyle = FontStyle.Italic,
                fontSize = 28.sp,
                color = Color(0xFF403833)
            )
        }
        
        Text(
            text = "FILTER",
            fontSize = 11.sp,
            letterSpacing = 2.sp,
            color = Color(0xFF808080),
            modifier = Modifier
                .clickable { }
                .drawBehindUnderline(Color(0xFFD9D9D9))
                .padding(bottom = 4.dp)
        )
    }
}

private fun Modifier.drawBehindUnderline(color: Color) = this.drawBehind { /* custom underline logic if wanted, or ignore */ }

data class JewelryProduct(val title: String, val price: String, val imageUrl: String, val isFavorite: Boolean)

@Composable
private fun BrandNewArrivalProductGrid() {
    val products = listOf(
        JewelryProduct("Aurore Pearl Necklace", "$1,250", "https://lh3.googleusercontent.com/aida-public/AB6AXuAuiwcpPXDmhUygmvYubKksiP0Y8_fj1rSL6_1zIgbogTimzcnHsd9kRCuLF2y2kSMIlqYBW3lCCgIbr-mFaiIBQR-mLA5WYSwJM4iDLKS-8ryQVxtWguCra9krVFW5nzG2MFo_WHCtwpIvzIX9nc-1u5oXPU6DphALjEuSIUj10ighhbc7M6eP60Qz2wSfumpFoUw6sUBXC-F5HpiyZOxfzp04tbezIWTirkVs7XiN3Aje-Oz6pmvOIzDIlyMC0_TF6oFpl_v40NIQ", false),
        JewelryProduct("Elysian Gold Ring", "$890", "https://lh3.googleusercontent.com/aida-public/AB6AXuDT9tTc_dXcx5eu9-bm1kUAADeIUancDxc_QuPsXmIVMRKZL-wHGNrhjpXQ71JaXkOuTWFV-d64SeW-_eDwtT6SqcFkvKzB7wCQiLy5v825lEOWYyPlmYYtLIW1YuMSgVI8T961NXBTxivHktd_x5n1hqfuPDY5FAv7jkRzBzy-e9R5QF9nmDw5kzxrrvKKwlWJgg_yqaAAcHo3Ra45trZC0vCT0Fd3aHCdKBLTLN0FfAHqX7Q4HiYacCLURemnI4ykmRDWMo_Xva6f", false),
        JewelryProduct("Celeste Diamond Studs", "$2,100", "https://lh3.googleusercontent.com/aida-public/AB6AXuAs4RmqiRYhlEQQMR9z2KzonHOC2qzQnAn62H9Y44suSlUUqz6z3mhsb5da8nqXBctZ9EZUSY-h9znQup4MlSVPd6RsD8rby3ZyiKGjGx9QLx1jXt224-0R-xg8maF0ntudWhlrXpmKQaGpiPnq_yWa9WvgR9PYnL8vHWZz7sbzdzsIzXhOjQb6s0WFydalPa3VP5yMWv-cipSPZZFR6-BUr1dMt36rSpvwGzBmlBlvxLgFZJYcdOe6YoeiUtwRkSYUiXBr4MVqzb-y", false),
        JewelryProduct("Luna Silk Choker", "$450", "https://lh3.googleusercontent.com/aida-public/AB6AXuDB0fLr9vnjQkrCGfijCA7DWL213iYlcjb-9MkxwFhEOwsAouPTuIu7WmoVMv4yxrqitG7lHuERwdGAgqDvw1j2MINPnAQejmBxxV7smJ5_eERyqfhSpR9GWJKcwNYoSDNhLU6AVP9F7ikFLzgRqjoHnFIIDfpM9mcd3t7pbUwvHnZyCC--fGlLK4dnVlqV-Revfi0ND9Vs4h4bApEbLA3elOh_UdswtAOKTAR9tCtiaAJL7eJHY-71fcMfF_71ufWl96xSV8mm6NlP", true)
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        for (i in products.indices step 2) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(modifier = Modifier.weight(1f)) {
                    BrandNewArrivalProductCard(products[i])
                }
                Box(modifier = Modifier.weight(1f)) {
                    if (i + 1 < products.size) {
                        BrandNewArrivalProductCard(products[i + 1])
                    }
                }
            }
        }
    }
}

@Composable
private fun BrandNewArrivalProductCard(product: JewelryProduct) {
    VStack(spacing = 0.dp) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp)
                .background(Color(0xFFF5F2ED))
                .shadow(elevation = 10.dp, spotColor = Color.Black.copy(alpha = 0.05f))
        ) {
            AsyncImage(
                model = product.imageUrl,
                contentDescription = product.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            
            IconButton(
                onClick = { },
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .size(32.dp)
                    .background(Color.White.copy(alpha = 0.8f), CircleShape)
            ) {
                Icon(
                    imageVector = if (product.isFavorite) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = if (product.isFavorite) Color(0xFFD1B58C) else Color(0xFF666666),
                    modifier = Modifier.size(14.dp)
                )
            }
        }
        
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = product.title,
                fontFamily = FontFamily.Serif,
                fontSize = 16.sp,
                color = Color(0xFF403833),
                textAlign = TextAlign.Center
            )
            Text(
                text = product.price,
                fontSize = 12.sp,
                color = Color(0xFF999999),
                modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
            )
            Button(
                onClick = { },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD1B58C).copy(alpha = 0.15f)),
                shape = RoundedCornerShape(0.dp),
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(vertical = 12.dp)
            ) {
                Text(
                    text = "SHOP NOW",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 2.sp,
                    color = Color(0xFF59524D)
                )
            }
        }
    }
}

@Composable
private fun VStack(spacing: androidx.compose.ui.unit.Dp, content: @Composable ColumnScope.() -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(spacing), content = content)
}

@Composable
private fun BrandNewArrivalNewsletter() {
    var email by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 60.dp)
            .background(Color(0xFFF5F2ED))
            .padding(vertical = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Join the Inner Circle",
            fontFamily = FontFamily.Serif,
            fontSize = 24.sp,
            color = Color(0xFF403833),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "Early access to new arrivals and exclusive boutique events.",
            fontSize = 12.sp,
            color = Color(0xFF808080),
            textAlign = TextAlign.Center,
            modifier = Modifier
                .width(240.dp)
                .padding(bottom = 24.dp)
        )
        
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 40.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                placeholder = { 
                    Text(
                        "Your email address", 
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center,
                        fontSize = 14.sp
                    ) 
                },
                modifier = Modifier.fillMaxWidth(),
                textStyle = LocalTextStyle.current.copy(textAlign = TextAlign.Center, fontSize = 14.sp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFFBFBFBF),
                    focusedBorderColor = Color(0xFF403833)
                )
            )
            
            Button(
                onClick = { },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                shape = RoundedCornerShape(0.dp),
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(vertical = 14.dp)
            ) {
                Text(
                    text = "SUBSCRIBE",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 2.sp,
                    color = Color.White
                )
            }
        }
    }
}

@Composable
private fun BrandNewArrivalBottomNav(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(Color(0xFFE6E6E6))
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White.copy(alpha = 0.95f))
                .padding(horizontal = 32.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            navItem(icon = Icons.Default.Home, title = "HOME", isActive = true)
            navItem(icon = Icons.Default.Star, title = "COLLECTIONS", isActive = false) // Replaced Diamond
            navItem(icon = Icons.Default.Favorite, title = "WISHLIST", isActive = false)
            navItem(icon = Icons.Default.Person, title = "PROFILE", isActive = false)
        }
        
        // Home indicator line
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp, top = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .width(128.dp)
                    .height(4.dp)
                    .background(Color(0xFFCCCCCC), RoundedCornerShape(3.dp))
            )
        }
    }
}

@Composable
private fun navItem(icon: ImageVector, title: String, isActive: Boolean) {
    val tintColor = if (isActive) Color(0xFFD1B58C) else Color(0xFF999999)
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
        modifier = Modifier.clickable { }
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = tintColor,
            modifier = Modifier.size(20.dp)
        )
        Text(
            text = title,
            fontSize = 9.sp,
            fontWeight = FontWeight.Medium,
            letterSpacing = 0.5.sp,
            color = tintColor
        )
    }
}
