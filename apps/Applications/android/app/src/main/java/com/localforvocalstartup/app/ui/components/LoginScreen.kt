package com.localforvocalstartup.app.ui.components

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.localforvocalstartup.app.data.manager.AuthManager
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class, ExperimentalComposeUiApi::class)
@Composable
fun LoginScreen(onDismiss: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val keyboardController = LocalSoftwareKeyboardController.current
    
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var showSignup by remember { mutableStateOf(false) }
    var loginInfoMessage by remember { mutableStateOf<String?>(null) }

    // Google Sign In Launcher
    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account.idToken
                if (idToken != null) {
                    isLoading = true
                    errorMessage = null
                    scope.launch {
                        try {
                            AuthManager.firebaseAuthWithGoogle(idToken)
                            isLoading = false
                            onDismiss() // Close Login Screen on Success
                        } catch (e: Exception) {
                            isLoading = false
                            errorMessage = getBeautifulErrorMessage(e, "Google Sign-In Failed")
                        }
                    }
                } else {
                    errorMessage = "Error: ID Token is null."
                }
            } catch (e: ApiException) {
                errorMessage = "Google Sign In Error: Code ${e.statusCode}"
            }
        } else if (result.resultCode == Activity.RESULT_CANCELED) {
            errorMessage = "Sign in was cancelled"
        } else {
            errorMessage = "Sign in failed with code: ${result.resultCode}"
        }
    }

    // Wrap the entire screen content in a box to capture clicks outside text fields (to dismiss keyboard)
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF2874F0))
            .clickable(
                interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() },
                indication = null
            ) {
                keyboardController?.hide()
            }
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
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
                    modifier = Modifier.padding(bottom = if (loginInfoMessage != null) 16.dp else 32.dp)
                )

                // Account exists info banner
                if (loginInfoMessage != null) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFFFF3E0),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFF9800))
                    ) {
                        Text(
                            text = loginInfoMessage!!,
                            fontSize = 13.sp,
                            color = Color(0xFFE65100),
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }

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
                                     errorMessage = getBeautifulErrorMessage(e, "Login Failed")
                                 }
                             }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF26422)), 
                    shape = RoundedCornerShape(6.dp),
                    enabled = !isLoading && email.isNotBlank() && password.isNotBlank()
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                    } else {
                        Text("Continue", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Divider(modifier = Modifier.weight(1f), color = Color.Gray.copy(alpha = 0.3f))
                    Text(" Or continue with ", color = Color.Gray, fontSize = 12.sp)
                    Divider(modifier = Modifier.weight(1f), color = Color.Gray.copy(alpha = 0.3f))
                }
                
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
                        text = "New here? ",
                        fontSize = 14.sp,
                        color = Color.Black
                    )
                    Text(
                        text = "Sign up",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF2874F0),
                        modifier = Modifier.clickable {
                            showSignup = true
                        }
                    )
                }
                
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }

    if (showSignup) {
        Dialog(
            onDismissRequest = { showSignup = false },
            properties = DialogProperties(usePlatformDefaultWidth = false, decorFitsSystemWindows = false)
        ) {
            SignupScreen(
                onDismiss = { showSignup = false },
                onRegistrationSuccess = onDismiss,
                onAccountExists = { existingEmail ->
                    showSignup = false
                    email = existingEmail
                    loginInfoMessage = "Account already exists with this email. Please login."
                }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalComposeUiApi::class)
@Composable
fun SignupScreen(onDismiss: () -> Unit, onRegistrationSuccess: () -> Unit, onAccountExists: (email: String) -> Unit = {}) {
    val scope = rememberCoroutineScope()
    val keyboardController = LocalSoftwareKeyboardController.current

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    
    var showPassword by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val isFormValid = name.isNotBlank() && email.isNotBlank() && phone.isNotBlank() && 
                      password.isNotBlank() && password == confirmPassword && password.length >= 6

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF2874F0))
            .clickable(
                interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() },
                indication = null
            ) {
                keyboardController?.hide()
            }
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Header
            Box(modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)) {
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.align(Alignment.TopStart)
                ) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
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
                    "Create your account",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    "Fill in your details to get started",
                    fontSize = 14.sp,
                    color = Color(0xFF888888),
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                FormField("Full Name", "Enter your name", name, { name = it }, KeyboardType.Text)
                FormField("Email Address", "Enter your email", email, { email = it }, KeyboardType.Email)
                FormField("Phone Number", "Enter phone", phone, { phone = it }, KeyboardType.Phone)

                // Password
                Text("Password", color = Color(0xFF2874F0), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    placeholder = { Text("Enter password", color = Color(0xFF6B7280)) },
                    singleLine = true,
                    visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        val image = if (showPassword) Icons.Filled.Visibility else Icons.Filled.VisibilityOff
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(image, contentDescription = "Toggle hidden", tint = Color(0xFF4B5563))
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

                // Confirm Password
                Text("Confirm Password", color = Color(0xFF2874F0), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    placeholder = { Text("Confirm password", color = Color(0xFF6B7280)) },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedBorderColor = if (password == confirmPassword || confirmPassword.isEmpty()) Color(0xFFD1D5DB) else Color.Red,
                        focusedBorderColor = if (password == confirmPassword || confirmPassword.isEmpty()) Color(0xFF2874F0) else Color.Red,
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White
                    ),
                    shape = RoundedCornerShape(6.dp)
                )

                Text(
                    "By signing up, you agree to our Terms of Use and Privacy Policy.",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(vertical = 12.dp)
                )

                if (errorMessage != null) {
                    Text(
                        errorMessage!!,
                        color = Color.Red,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                }

                // Sign Up Button
                Button(
                    onClick = {
                        isLoading = true
                        errorMessage = null
                        scope.launch {
                            try {
                                AuthManager.register(name, email, phone, password)
                                isLoading = false
                                onRegistrationSuccess()
                            } catch (e: Exception) {
                                isLoading = false
                                val msg = getBeautifulErrorMessage(e, "Registration Failed")
                                if (msg.contains("already exists", ignoreCase = true) || msg.contains("already registered", ignoreCase = true)) {
                                    onAccountExists(email)
                                } else {
                                    errorMessage = msg
                                }
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF26422)),
                    shape = RoundedCornerShape(6.dp),
                    enabled = !isLoading && isFormValid
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                    } else {
                        Text("Sign Up", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Already have an account? ", fontSize = 14.sp, color = Color.Gray)
                    Text(
                        "Log In",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF2874F0),
                        modifier = Modifier.clickable { onDismiss() }
                    )
                }
                
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FormField(label: String, placeholder: String, value: String, onValueChange: (String) -> Unit, keyboardType: KeyboardType) {
    Text(label, color = Color(0xFF2874F0), fontSize = 13.sp, fontWeight = FontWeight.Bold)
    Spacer(modifier = Modifier.height(6.dp))
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 16.dp),
        placeholder = { Text(placeholder, color = Color(0xFF6B7280)) },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        colors = OutlinedTextFieldDefaults.colors(
            unfocusedBorderColor = Color(0xFFD1D5DB),
            focusedBorderColor = Color(0xFF2874F0),
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White
        ),
        shape = RoundedCornerShape(6.dp)
    )
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

private fun getBeautifulErrorMessage(e: Exception, defaultMessage: String): String {
    // First: try to extract error from Retrofit HttpException body
    if (e is retrofit2.HttpException) {
        try {
            val errorBody = e.response()?.errorBody()?.string()
            if (errorBody != null) {
                val json = org.json.JSONObject(errorBody)
                val serverError = json.optString("error", "")
                if (serverError.isNotBlank()) return serverError
                val serverMessage = json.optString("message", "")
                if (serverMessage.isNotBlank()) return serverMessage
            }
        } catch (_: Exception) { /* ignore parse errors */ }
    }

    val rawMessage = e.message ?: return defaultMessage
    return when {
        rawMessage.contains("email address is already in use") -> "Account already exists with this email. Please login instead."
        rawMessage.contains("INVALID_LOGIN_CREDENTIALS") || rawMessage.contains("invalid password") || rawMessage.contains("invalid-credential") || rawMessage.contains("InvalidCredentials") -> "Incorrect email or password."
        rawMessage.contains("weak password") || rawMessage.contains("WeakPassword") -> "Password is too weak. Please use a stronger password."
        rawMessage.contains("no user record") || rawMessage.contains("InvalidUser") -> "No account found with this email."
        rawMessage.contains("network") || rawMessage.contains("resolve host") || rawMessage.contains("timeout") -> "Please check your internet connection."
        rawMessage.contains("Registration failed on server") -> "Account already exists with this email. Please login instead."
        rawMessage.contains("HTTP") || rawMessage.contains("HttpException") -> "Server Error. Please try again."
        rawMessage.contains("com.google.") || rawMessage.contains("java.") || rawMessage.contains("Exception") -> defaultMessage
        else -> rawMessage
    }
}
