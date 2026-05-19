package com.localforvocalstartup.app.data.manager

import android.util.Log
import com.localforvocalstartup.app.data.model.Address
import com.localforvocalstartup.app.data.remote.NetworkClient
import com.localforvocalstartup.app.data.remote.SaveAddressRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

object AddressManager {
    private val _savedAddresses = MutableStateFlow<List<Address>>(emptyList())
    val savedAddresses: StateFlow<List<Address>> = _savedAddresses.asStateFlow()

    private val _selectedAddress = MutableStateFlow<Address?>(null)
    val selectedAddress: StateFlow<Address?> = _selectedAddress.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val coroutineScope = CoroutineScope(Dispatchers.IO)

    fun init() {
        if (AuthManager.isLoggedIn()) {
            fetchAddresses()
        }
    }

    fun fetchAddresses() {
        coroutineScope.launch {
            _isLoading.value = true
            try {
                val addresses = NetworkClient.apiService.getAddresses()
                _savedAddresses.value = addresses
                autoSelectBestAddress(addresses)
            } catch (e: Exception) {
                Log.e("AddressManager", "Failed to fetch addresses", e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    /**
     * Auto-selects the best address:
     * 1. If currently selected address is still in the list → keep it (with updated data)
     * 2. Else prefer isDefault=true
     * 3. Else fall back to first address
     */
    private fun autoSelectBestAddress(addresses: List<Address>) {
        if (addresses.isEmpty()) {
            _selectedAddress.value = null
            return
        }
        val currentId = _selectedAddress.value?.id
        val refreshed = if (currentId != null) addresses.find { it.id == currentId } else null
        _selectedAddress.value = refreshed
            ?: addresses.find { it.isDefault }
            ?: addresses.first()
    }

    fun saveAddress(
        name: String,
        phone: String,
        addressLine1: String,
        addressLine2: String?,
        city: String,
        state: String,
        pincode: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        if (!AuthManager.isLoggedIn()) {
            coroutineScope.launch { withContext(Dispatchers.Main) { onError("You must be logged in to save an address.") } }
            return
        }

        coroutineScope.launch {
            try {
                val isFirstAddress = _savedAddresses.value.isEmpty()

                // Use proper DTO — never sends local UUID to the server
                val request = SaveAddressRequest(
                    name = name.trim(),
                    phone = phone.trim(),
                    addressLine1 = addressLine1.trim(),
                    addressLine2 = addressLine2?.trim()?.takeIf { it.isNotEmpty() },
                    city = city.trim(),
                    state = state.trim().ifEmpty { city.trim() },
                    pincode = pincode.trim(),
                    country = "India",
                    isDefault = isFirstAddress   // first address is always default
                )

                val savedAddress = NetworkClient.apiService.saveAddress(request)
                Log.d("AddressManager", "Address saved to server: ${savedAddress.id}")

                // Re-fetch the full list from server to get accurate server-side IDs & isDefault flags
                val freshAddresses = NetworkClient.apiService.getAddresses()
                _savedAddresses.value = freshAddresses

                // Auto-select the newly saved address if it's default or no address was selected
                if (savedAddress.isDefault || _selectedAddress.value == null) {
                    // Find the server-returned version in the fresh list to ensure we have the real _id
                    _selectedAddress.value = freshAddresses.find { it.id == savedAddress.id } ?: savedAddress
                } else {
                    autoSelectBestAddress(freshAddresses)
                }

                withContext(Dispatchers.Main) { onSuccess() }
            } catch (e: Exception) {
                Log.e("AddressManager", "Failed to save address", e)
                withContext(Dispatchers.Main) { onError(e.message ?: "Failed to save address") }
            }
        }
    }

    fun deleteAddress(
        addressId: String,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        coroutineScope.launch {
            try {
                NetworkClient.apiService.deleteAddress(addressId)
                // Remove locally and re-select best
                val updated = _savedAddresses.value.filter { it.id != addressId }
                _savedAddresses.value = updated
                // If we deleted the selected address, pick next best
                if (_selectedAddress.value?.id == addressId) {
                    autoSelectBestAddress(updated)
                }
                withContext(Dispatchers.Main) { onSuccess() }
            } catch (e: Exception) {
                Log.e("AddressManager", "Failed to delete address", e)
                withContext(Dispatchers.Main) { onError(e.message ?: "Failed to delete address") }
            }
        }
    }

    fun setDefaultAddress(
        addressId: String,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        coroutineScope.launch {
            try {
                val updated = NetworkClient.apiService.setDefaultAddress(addressId)
                // Update local list — clear isDefault on all, then set on this one
                val refreshed = _savedAddresses.value.map { addr ->
                    when (addr.id) {
                        addressId -> updated
                        else -> addr.copy(isDefault = false)
                    }
                }
                _savedAddresses.value = refreshed
                _selectedAddress.value = updated
                withContext(Dispatchers.Main) { onSuccess() }
            } catch (e: Exception) {
                Log.e("AddressManager", "Failed to set default address", e)
                withContext(Dispatchers.Main) { onError(e.message ?: "Failed to set default address") }
            }
        }
    }

    fun selectAddress(address: Address) {
        _selectedAddress.value = address
    }

    fun clear() {
        _savedAddresses.value = emptyList()
        _selectedAddress.value = null
    }
}
