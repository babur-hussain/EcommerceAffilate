package com.localforvocalstartup.app.data.manager

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.localforvocalstartup.app.data.model.RegisterRequest
import com.localforvocalstartup.app.data.model.User
import com.localforvocalstartup.app.data.remote.NetworkClient
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
                NetworkClient.tempToken = token
                AddressManager.init()
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
            val user = authResponse.user ?: throw Exception(authResponse.message ?: "Failed to fetch user profile")
            saveUserSession(user, token)
            user
        }
    }

    suspend fun register(name: String, email: String, phone: String, password: String): User {
        return withContext(Dispatchers.IO) {
            val result = com.google.android.gms.tasks.Tasks.await(auth.createUserWithEmailAndPassword(email, password))
            val firebaseUser = result.user ?: throw Exception("Firebase User is null")
            
            // Set display name in Firebase (optional but good practice)
            val profileUpdates = com.google.firebase.auth.UserProfileChangeRequest.Builder()
                .setDisplayName(name)
                .build()
            com.google.android.gms.tasks.Tasks.await(firebaseUser.updateProfile(profileUpdates))
            
            val token = com.google.android.gms.tasks.Tasks.await(firebaseUser.getIdToken(true)).token ?: ""
            NetworkClient.tempToken = token
            
            // Create the user in backend
            val request = RegisterRequest(
                email = email,
                name = name,
                firebaseUid = firebaseUser.uid,
                phone = phone,
                password = password 
            )
            val authResponse = NetworkClient.apiService.registerUser(request)
            val user = authResponse.user ?: throw Exception(authResponse.message ?: "Registration failed on server")
            
            saveUserSession(user, token)
            user
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
                phone = null,
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
            
            val user = response.user ?: throw Exception(response.message ?: "Failed to sync user with backend")
            Log.d("AuthManager", "Backend sync successful, saving user: ${user.email}")
            saveUserSession(user, token)
            return user
            
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
        
        // Load addresses for the user
        AddressManager.init()
    }

    fun updateUserSession(user: User) {
        prefs.edit().putString(KEY_USER, gson.toJson(user)).apply()
        _userState.value = user
    }

    fun logout() {
        auth.signOut()
        prefs.edit().clear().apply()
        _userState.value = null
        AddressManager.clear()
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun updateToken(newToken: String) {
        prefs.edit().putString(KEY_TOKEN, newToken).apply()
        NetworkClient.tempToken = newToken
    }
    
    fun isLoggedIn(): Boolean {
        return _userState.value != null
    }

    @Suppress("UNUSED_PARAMETER")
    suspend fun registerInfluencer(
        name: String,
        email: String,
        phone: String,
        platform: String,
        handle: String,
        niche: String,
        bio: String
    ): Result<Unit> {
        return withContext(Dispatchers.IO) {
            try {
                // Mocking backend network delay
                kotlinx.coroutines.delay(1500)
                Log.d("AuthManager", "Successfully mocked registering influencer: $email on $platform")
                Result.success(Unit)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
