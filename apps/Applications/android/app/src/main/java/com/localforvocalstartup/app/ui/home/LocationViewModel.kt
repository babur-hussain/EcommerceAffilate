package com.localforvocalstartup.app.ui.home

import android.annotation.SuppressLint
import android.app.Application
import android.location.Geocoder
import android.location.Location
import android.os.Looper
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.location.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import java.util.Locale

data class LocationState(
    val areaName: String = "SELECT LOCATION",
    val fullAddress: String = "Tap to set your location",
    val isLoading: Boolean = false,
    val error: String? = null
)

class LocationViewModel(application: Application) : AndroidViewModel(application) {

    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(application)
    private val geocoder = Geocoder(application, Locale.getDefault())

    private val _locationState = MutableStateFlow(LocationState())
    val locationState: StateFlow<LocationState> = _locationState.asStateFlow()

    private fun hasPermission(): Boolean {
        val context = getApplication<Application>()
        return androidx.core.content.ContextCompat.checkSelfPermission(
            context, android.Manifest.permission.ACCESS_FINE_LOCATION
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED ||
        androidx.core.content.ContextCompat.checkSelfPermission(
            context, android.Manifest.permission.ACCESS_COARSE_LOCATION
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED
    }

    @SuppressLint("MissingPermission")
    fun fetchCurrentLocation() {
        if (!hasPermission()) {
            _locationState.value = LocationState()
            return
        }

        _locationState.value = _locationState.value.copy(
            isLoading = true,
            areaName = "Locating...",
            fullAddress = "Getting your location..."
        )

        viewModelScope.launch(Dispatchers.IO) {
            try {
                // Step 1: Try last known location (instant, no GPS needed)
                val lastLocation = fusedLocationClient.lastLocation.await()
                if (lastLocation != null) {
                    reverseGeocode(lastLocation)
                    return@launch
                }

                // Step 2: No cached location → request a fresh one via callback
                requestFreshLocation()

            } catch (e: SecurityException) {
                _locationState.value = LocationState()
            } catch (e: Exception) {
                _locationState.value = LocationState()
            }
        }
    }

    @SuppressLint("MissingPermission")
    private fun requestFreshLocation() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 5000)
            .setMaxUpdates(1)
            .setWaitForAccurateLocation(false)
            .build()

        val callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                fusedLocationClient.removeLocationUpdates(this)
                val location = result.locations.firstOrNull()
                if (location != null) {
                    viewModelScope.launch(Dispatchers.IO) {
                        reverseGeocode(location)
                    }
                } else {
                    _locationState.value = LocationState()
                }
            }

            override fun onLocationAvailability(availability: LocationAvailability) {
                if (!availability.isLocationAvailable) {
                    fusedLocationClient.removeLocationUpdates(this)
                    _locationState.value = LocationState()
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                callback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            _locationState.value = LocationState()
        }
    }

    private fun reverseGeocode(location: Location) {
        try {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                geocoder.getFromLocation(location.latitude, location.longitude, 1) { addresses ->
                    val address = addresses.firstOrNull()
                    val area = address?.subLocality ?: address?.locality ?: address?.subAdminArea ?: "Unknown Area"
                    val full = address?.getAddressLine(0) ?: "${location.latitude}, ${location.longitude}"
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
                val full = address?.getAddressLine(0) ?: "${location.latitude}, ${location.longitude}"
                _locationState.value = LocationState(
                    areaName = area.uppercase(),
                    fullAddress = full,
                    isLoading = false
                )
            }
        } catch (e: Exception) {
            // Geocoding failed but we have coordinates — show them
            _locationState.value = LocationState(
                areaName = "LOCATION FOUND",
                fullAddress = "${location.latitude}, ${location.longitude}",
                isLoading = false
            )
        }
    }
}
