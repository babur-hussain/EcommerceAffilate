package com.ecommerceearn.app.data.manager

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

enum class ConnectionType {
    WIFI, CELLULAR, WIRED_ETHERNET, UNKNOWN
}

object NetworkMonitor {
    private val _isConnected = MutableStateFlow(true)
    val isConnected: StateFlow<Boolean> = _isConnected.asStateFlow()

    private val _connectionType = MutableStateFlow(ConnectionType.UNKNOWN)
    val connectionType: StateFlow<ConnectionType> = _connectionType.asStateFlow()

    private lateinit var connectivityManager: ConnectivityManager
    
    fun init(context: Context) {
        connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        
        // Initial state
        val activeNetwork = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork)
        updateState(capabilities)

        val networkRequest = NetworkRequest.Builder().build()
        connectivityManager.registerNetworkCallback(networkRequest, object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                _isConnected.value = true
                val newCapabilities = connectivityManager.getNetworkCapabilities(network)
                updateState(newCapabilities)
                AppLogger.debug("[Network] Status: Connected (${_connectionType.value})")
            }

            override fun onLost(network: Network) {
                _isConnected.value = false
                _connectionType.value = ConnectionType.UNKNOWN
                AppLogger.debug("[Network] Status: Disconnected")
            }

            override fun onCapabilitiesChanged(network: Network, networkCapabilities: NetworkCapabilities) {
                updateState(networkCapabilities)
            }
        })
    }
    
    private fun updateState(capabilities: NetworkCapabilities?) {
        if (capabilities == null) {
            _connectionType.value = ConnectionType.UNKNOWN
            return
        }
        
        when {
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> {
                _connectionType.value = ConnectionType.WIFI
            }
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> {
                _connectionType.value = ConnectionType.CELLULAR
            }
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> {
                _connectionType.value = ConnectionType.WIRED_ETHERNET
            }
            else -> {
                _connectionType.value = ConnectionType.UNKNOWN
            }
        }
    }
}
