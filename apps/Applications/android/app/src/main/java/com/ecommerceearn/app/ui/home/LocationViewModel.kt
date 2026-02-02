package com.ecommerceearn.app.ui.home

import android.annotation.SuppressLint
import android.app.Application
import android.content.Context
import android.location.Geocoder
import android.location.Location
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import java.util.Locale

data class LocationState(
    val areaName: String = "Locating...",
    val fullAddress: String = "Fetching address...",
    val isLoading: Boolean = false,
    val error: String? = null
)

class LocationViewModel(application: Application) : AndroidViewModel(application) {

    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(application)
    private val geocoder = Geocoder(application, Locale.getDefault())

    private val _locationState = MutableStateFlow(LocationState())
    val locationState: StateFlow<LocationState> = _locationState.asStateFlow()

    @SuppressLint("MissingPermission")
    fun fetchCurrentLocation() {
        viewModelScope.launch(Dispatchers.IO) {
            _locationState.value = _locationState.value.copy(isLoading = true)
            try {
                // User requested 100% accuracy, so we skip lastLocation (which might be stale)
                // and request a fresh high-accuracy location immediately.
                val location: Location? = fusedLocationClient.getCurrentLocation(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    null
                ).await()

                if (location != null) {
                    reverseGeocode(location)
                } else {
                    _locationState.value = LocationState(
                        areaName = "Unknown",
                        fullAddress = "Location not found",
                        isLoading = false,
                        error = "Unable to determine location"
                    )
                }
            } catch (e: Exception) {
                _locationState.value = LocationState(
                    areaName = "Error",
                    fullAddress = "Permission/Signal Issue", // Generic failure message
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    private fun reverseGeocode(location: Location) {
        try {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                geocoder.getFromLocation(location.latitude, location.longitude, 1) { addresses ->
                    val address = addresses.firstOrNull()
                    val area = address?.subLocality ?: address?.locality ?: address?.subAdminArea ?: "Unknown Area"
                    val full = address?.getAddressLine(0) ?: "Unknown Address"
                    
                    _locationState.value = LocationState(
                        areaName = area.uppercase(),
                        fullAddress = full,
                        isLoading = false
                    )
                }
            } else {
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(location.latitude, location.longitude, 1)
                val address = addresses?.firstOrNull()
                val area = address?.subLocality ?: address?.locality ?: address?.subAdminArea ?: "Unknown Area"
                val full = address?.getAddressLine(0) ?: "Unknown Address"

                _locationState.value = LocationState(
                    areaName = area.uppercase(),
                    fullAddress = full,
                    isLoading = false
                )
            }
        } catch (e: Exception) {
            _locationState.value = LocationState(
                areaName = "Location Found",
                fullAddress = "${location.latitude}, ${location.longitude}",
                isLoading = false,
                error = "Geocoding failed"
            )
        }
    }
}
