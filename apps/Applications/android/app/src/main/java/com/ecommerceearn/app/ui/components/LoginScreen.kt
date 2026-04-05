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
import androidx.compose.foundation.clickable
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
                .background(Color.White, RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                .padding(24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                "Log in for the best experience",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Enter your details to continue",
                fontSize = 14.sp,
                color = Color(0xFF888888),
                modifier = Modifier.padding(bottom = 32.dp)
            )

            // Email Field
            Text("Email Address", color = Color(0xFF2874F0), fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 20.dp),
                placeholder = { Text("Enter your email", color = Color(0xFF6B7280)) },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFFD1D5DB),
                    focusedBorderColor = Color(0xFF2874F0),
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                ),
                shape = RoundedCornerShape(6.dp)
            )

            // Password Field
            Text("Password", color = Color(0xFF2874F0), fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp),
                placeholder = { Text("Enter password", color = Color(0xFF6B7280)) },
                singleLine = true,
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                trailingIcon = {
                    val image = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(image, contentDescription = "Toggle password visibility", tint = Color(0xFF4B5563))
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFFD1D5DB),
                    focusedBorderColor = Color(0xFF2874F0),
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                ),
                shape = RoundedCornerShape(6.dp)
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
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF26422)), // Adjusting to the iOS solid orange
                shape = RoundedCornerShape(6.dp),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Continue", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                "Or", 
                modifier = Modifier.align(Alignment.CenterHorizontally), 
                color = Color(0xFF888888),
                fontSize = 14.sp
            )
            
            Spacer(modifier = Modifier.height(32.dp))

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
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFD1D5DB)),
                shape = RoundedCornerShape(6.dp)
            ) {
                Text("Sign in with Google", color = Color.Black, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Sign Up Link
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Don't have an account? ",
                    fontSize = 14.sp,
                    color = Color(0xFF888888)
                )
                Text(
                    text = "Sign up",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF2874F0),
                    modifier = Modifier.clickable {
                        // TODO: Implement SignUp routing
                    }
                )
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
