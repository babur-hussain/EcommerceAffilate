package com.ecommerceearn.app.ui.pages

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.NavigationManager

data class Language(val code: String, val name: String, val nativeName: String, val subtext: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LanguageView() {
    var selectedLanguage by remember { mutableStateOf("en") }

    val languages = listOf(
        Language("en", "English", "English", "Default"),
        Language("hi", "Hindi", "हिंदी", "हिंदी में देखें")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Select Language", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827)) },
                navigationIcon = {
                    IconButton(onClick = { NavigationManager.goBack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF111827))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        bottomBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(20.dp)
            ) {
                Divider() // acts as the top border from the iOS layout
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { NavigationManager.goBack() },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(30.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                ) {
                    Text("Continue", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        },
        containerColor = Color.White
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text("Choose your preferred language", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
            Spacer(modifier = Modifier.height(4.dp))
            Text("You can change this anytime from settings", fontSize = 14.sp, color = Color(0xFF6B7280))
            Spacer(modifier = Modifier.height(16.dp))

            languages.forEach { lang ->
                LanguageCard(language = lang, isSelected = selectedLanguage == lang.code) {
                    selectedLanguage = lang.code
                }
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

@Composable
fun LanguageCard(language: Language, isSelected: Boolean, action: () -> Unit) {
    val bgColor = if (isSelected) Color(0xFFEFF6FF) else Color(0xFFF9FAFB)
    val borderColor = if (isSelected) Color(0xFF2563EB) else Color.Transparent

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { action() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor),
        border = BorderStroke(2.dp, borderColor)
    ) {
        Row(
            modifier = Modifier.padding(20.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = language.nativeName,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isSelected) Color(0xFF1E40AF) else Color(0xFF111827)
                )
                Text(
                    text = language.name,
                    fontSize = 14.sp,
                    color = if (isSelected) Color(0xFF3B82F6) else Color(0xFF4B5563)
                )
                Text(
                    text = language.subtext,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Light,
                    fontStyle = FontStyle.Italic,
                    color = if (isSelected) Color(0xFF3B82F6) else Color(0xFF6B7280)
                )
            }

            Box(
                modifier = Modifier
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(Color.Transparent)
                    .border(2.dp, if (isSelected) Color(0xFF2563EB) else Color(0xFFD1D5DB), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                if (isSelected) {
                    Box(modifier = Modifier.size(12.dp).clip(CircleShape).background(Color(0xFF2563EB)))
                }
            }
        }
    }
}
