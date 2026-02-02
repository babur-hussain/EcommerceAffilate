package com.ecommerceearn.app.ui.components

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ecommerceearn.app.data.manager.AuthManager
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onDismiss: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Google Sign In Launcher
    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        android.util.Log.d("LoginScreen", "Google Sign In Result: ${result.resultCode}")
        if (result.resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account.idToken
                android.util.Log.d("LoginScreen", "Got account: ${account.email}, idToken null: ${idToken == null}")
                if (idToken != null) {
                    isLoading = true
                    errorMessage = null
                    scope.launch {
                        try {
                            val user = AuthManager.firebaseAuthWithGoogle(idToken)
                            android.util.Log.d("LoginScreen", "Login successful! User: ${user.email}, userState now: ${AuthManager.userState.value?.email}")
                            isLoading = false
                            onDismiss() // Close Login Screen on Success
                        } catch (e: Exception) {
                            isLoading = false
                            errorMessage = "Firebase Auth Failed: ${e.message}"
                            android.util.Log.e("LoginScreen", "Firebase Auth Error", e)
                        }
                    }
                } else {
                    // idToken is null - this is the problem!
                    errorMessage = "Error: ID Token is null. Check Web Client ID in Firebase Console."
                    android.util.Log.e("LoginScreen", "idToken is null for account: ${account.email}")
                }
            } catch (e: ApiException) {
                errorMessage = "Google Sign In Error: Code ${e.statusCode}"
                android.util.Log.e("LoginScreen", "ApiException: ${e.statusCode}", e)
            }
        } else if (result.resultCode == Activity.RESULT_CANCELED) {
            errorMessage = "Sign in was cancelled"
        } else {
            errorMessage = "Sign in failed with code: ${result.resultCode}"
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF2874F0)) // Blue Header Background
    ) {
        // Header
        Box(modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)) {
            IconButton(
                onClick = onDismiss,
                modifier = Modifier.align(Alignment.TopStart)
            ) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
            }
            Text(
                "Local For Vocal",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.align(Alignment.Center)
            )
        }

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White, RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                .padding(24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                "Log in for the best experience",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Text(
                "Enter your details to continue",
                fontSize = 14.sp,
                color = Color.Gray,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            // Email Field
            Text("Email Address", color = Color(0xFF2874F0), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                placeholder = { Text("Enter your email") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )

            // Password Field
            Text("Password", color = Color(0xFF2874F0), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp),
                placeholder = { Text("Enter password") },
                singleLine = true,
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                trailingIcon = {
                    val image = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(image, contentDescription = null)
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )

            if (errorMessage != null) {
                Text(
                    text = errorMessage!!,
                    color = Color.Red,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            // Continue Button
            Button(
                onClick = {
                    if (email.isNotBlank() && password.isNotBlank()) {
                         isLoading = true
                         errorMessage = null
                         scope.launch {
                             try {
                                 AuthManager.signInWithEmail(email, password)
                                 isLoading = false
                                 onDismiss()
                             } catch (e: Exception) {
                                 isLoading = false
                                 errorMessage = e.message ?: "Login Failed"
                             }
                         }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFB641B)),
                shape = RoundedCornerShape(4.dp),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Continue", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                "Or", 
                modifier = Modifier.align(Alignment.CenterHorizontally), 
                color = Color.Gray
            )
            
            Spacer(modifier = Modifier.height(24.dp))

            // Google Sign In Button
            Button(
                onClick = {
                    if (!isLoading) {
                        errorMessage = null
                        initiateGoogleLogin(context, googleSignInLauncher)
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.Gray),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text("Sign in with Google", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}

private fun initiateGoogleLogin(
    context: Context,
    launcher: androidx.activity.result.ActivityResultLauncher<Intent>
) {
    val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestIdToken("295518104458-86keht46qa5n1pa37ffvoe0trn55mfu4.apps.googleusercontent.com")
        .requestEmail()
        .build()

    val googleSignInClient = GoogleSignIn.getClient(context, gso)
    launcher.launch(googleSignInClient.signInIntent)
}
