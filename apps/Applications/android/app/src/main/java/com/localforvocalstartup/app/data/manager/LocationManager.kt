package com.localforvocalstartup.app.data.manager

import android.app.Application
import android.content.Context
import android.location.Address
import android.location.Geocoder
import android.os.Looper
import com.localforvocalstartup.app.utils.AppLogger
import com.google.android.gms.location.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import java.util.Locale

object LocationManager {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var geocoder: Geocoder

    private val _location = MutableStateFlow<android.location.Location?>(null)
    val location: StateFlow<android.location.Location?> = _location.asStateFlow()

    private val _address = MutableStateFlow("Locating...")
    val address: StateFlow<String> = _address.asStateFlow()

    private val _city = MutableStateFlow("Select Location")
    val city: StateFlow<String> = _city.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    fun init(context: Context) {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
        geocoder = Geocoder(context, Locale.getDefault())
    }

    fun startUpdating(context: Context) {
        try {
            val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000)
                .setMinUpdateDistanceMeters(10f)
                .build()

            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            _errorMessage.value = "Location access denied. Please enable it in Settings."
            _address.value = "Location Denied"
        }
    }

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            for (location in locationResult.locations) {
                _location.value = location
                reverseGeocode(location)
                fusedLocationClient.removeLocationUpdates(this) // Stop after 1 successful read
                break
            }
        }
    }

    private fun reverseGeocode(location: android.location.Location) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(location.latitude, location.longitude, 1)
                
                withContext(Dispatchers.Main) {
                    if (!addresses.isNullOrEmpty()) {
                        val placemark = addresses[0]
                        val subLocality = placemark.subLocality ?: ""
                        val locality = placemark.locality ?: ""
                        val adminArea = placemark.adminArea ?: ""
                        val thoroughfare = placemark.thoroughfare ?: ""

                        if (subLocality.isNotEmpty()) {
                            _address.value = "$subLocality, $locality"
                            _city.value = subLocality.uppercase()
                        } else if (thoroughfare.isNotEmpty()) {
                            _address.value = "$thoroughfare, $locality"
                            _city.value = locality.uppercase()
                        } else {
                            _address.value = "$locality, $adminArea"
                            _city.value = locality.uppercase()
                        }
                    } else {
                        _address.value = "Address not found"
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    _address.value = "Address not found"
                }
            }
        }
    }
}
