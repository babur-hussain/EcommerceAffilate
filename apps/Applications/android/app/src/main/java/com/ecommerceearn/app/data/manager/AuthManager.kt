package com.ecommerceearn.app.data.manager

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.ecommerceearn.app.data.model.RegisterRequest
import com.ecommerceearn.app.data.model.User
import com.ecommerceearn.app.data.remote.NetworkClient
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

object AuthManager {
    private const val PREFS_NAME = "auth_prefs"
    private const val KEY_TOKEN = "auth_token"
    private const val KEY_USER = "auth_user"
    
    private lateinit var prefs: SharedPreferences
    private val gson = Gson()
    private lateinit var auth: FirebaseAuth

    private val _userState = MutableStateFlow<User?>(null)
    val userState: StateFlow<User?> = _userState.asStateFlow()

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        auth = FirebaseAuth.getInstance()
        loadUser()
    }

    private fun loadUser() {
        // Load persisted user/token from Backend
        val json = prefs.getString(KEY_USER, null)
        val token = prefs.getString(KEY_TOKEN, null)
        
        if (json != null && token != null) {
            try {
                _userState.value = gson.fromJson(json, User::class.java)
            } catch (e: Exception) {
                e.printStackTrace()
                _userState.value = null
            }
        }
        
        // Optional: Silent refresh with Firebase/Backend could happen here
    }

    suspend fun signInWithGoogle(idToken: String): Result<User> {
        return try {
            val user = firebaseAuthWithGoogle(idToken)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Helper to wrap Firebase Task in Coroutine
    suspend fun firebaseAuthWithGoogle(idToken: String): User {
        return withContext(Dispatchers.IO) {
             val credential = GoogleAuthProvider.getCredential(idToken, null)
             val result = com.google.android.gms.tasks.Tasks.await(auth.signInWithCredential(credential))
             val firebaseUser = result.user ?: throw Exception("Firebase User is null")
             
             syncUserWithBackend(firebaseUser)
        }
    }

    suspend fun signInWithEmail(email: String, password: String): User {
        return withContext(Dispatchers.IO) {
            val result = com.google.android.gms.tasks.Tasks.await(auth.signInWithEmailAndPassword(email, password))
            val firebaseUser = result.user ?: throw Exception("Firebase User is null")
            
            // Backend Login/Profile Fetch
            // We assume Firebase Auth is truth, so we just get profile from backend
            // Note: We need to pass the Firebase Token to the backend via Interceptor or Header
            // For now, let's assume getMe works or we need to pass token manually.
            val token = com.google.android.gms.tasks.Tasks.await(firebaseUser.getIdToken(true)).token ?: ""
            NetworkClient.tempToken = token // Hack to pass token? Or update NetworkClient
            
            val authResponse = NetworkClient.apiService.getMe()
            saveUserSession(authResponse.user, token)
            authResponse.user
        }
    }

    private suspend fun syncUserWithBackend(firebaseUser: com.google.firebase.auth.FirebaseUser): User {
        Log.d("AuthManager", "syncUserWithBackend started for: ${firebaseUser.email}")
        val token = com.google.android.gms.tasks.Tasks.await(firebaseUser.getIdToken(true)).token ?: ""
        Log.d("AuthManager", "Got Firebase token, length: ${token.length}")
        NetworkClient.tempToken = token // Ensure token is available for the request

        try {
            val request = RegisterRequest(
                email = firebaseUser.email ?: "",
                name = firebaseUser.displayName ?: "User",
                firebaseUid = firebaseUser.uid,
                password = "google_login_${firebaseUser.uid}" 
            )
            
            val response = try {
                 // Try to register
                 NetworkClient.apiService.registerUser(request)
            } catch (e: retrofit2.HttpException) {
                if (e.code() == 409) {
                     // User exists, try to fetch profile
                     NetworkClient.apiService.getMe()
                } else {
                    throw e
                }
            }
            
            Log.d("AuthManager", "Backend sync successful, saving user: ${response.user.email}")
            saveUserSession(response.user, token)
            return response.user
            
        } catch (e: Exception) {
            Log.e("AuthManager", "Backend sync failed", e)
            // Fallback: Create User from Firebase Data if backend fails
            // This mimics RN behavior where it proceeds even if backend sync fails partialy
            val fallbackUser = User(
                _id = firebaseUser.uid, // Use Firebase UID as fallback ID
                name = firebaseUser.displayName ?: "User",
                email = firebaseUser.email ?: "",
                profileImage = firebaseUser.photoUrl?.toString(),
                coins = 0,
                membershipStatus = "Basic"
            )
            saveUserSession(fallbackUser, token)
            return fallbackUser
        }
    }

    private fun saveUserSession(user: User, token: String) {
        Log.d("AuthManager", "saveUserSession called with user: ${user.email}, token length: ${token.length}")
         prefs.edit()
            .putString(KEY_USER, gson.toJson(user))
            .putString(KEY_TOKEN, token)
            .apply()
        _userState.value = user
        Log.d("AuthManager", "userState updated. Current value: ${_userState.value?.email}")
    }

    fun logout() {
        auth.signOut()
        prefs.edit().clear().apply()
        _userState.value = null
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }
    
    fun isLoggedIn(): Boolean {
        return _userState.value != null
    }
}
