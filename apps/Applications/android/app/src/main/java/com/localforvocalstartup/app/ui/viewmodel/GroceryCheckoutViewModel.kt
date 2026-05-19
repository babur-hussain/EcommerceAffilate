package com.localforvocalstartup.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.localforvocalstartup.app.data.manager.LocationManager
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.model.UserAddress
import com.localforvocalstartup.app.data.services.OrderService
import com.localforvocalstartup.app.data.services.RazorpayService
import com.localforvocalstartup.app.data.services.RazorpayResultListener
import com.localforvocalstartup.app.data.services.AddressPayload
import com.localforvocalstartup.app.data.services.OrderItem
import com.localforvocalstartup.app.data.services.KafkaEventService
import com.localforvocalstartup.app.data.manager.CartItem
import com.localforvocalstartup.app.utils.AppLogger
import com.razorpay.PaymentData
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.collectLatest

class GroceryCheckoutViewModel(
    val items: List<CartItem>
) : ViewModel(), RazorpayResultListener {

    private val _locationManager = LocationManager
    val locationManager = _locationManager

    // Delivery tracking states
    private val _deliveryEtaMinutes = MutableStateFlow(10) // default 10 mins
    val deliveryEtaMinutes: StateFlow<Int> = _deliveryEtaMinutes.asStateFlow()

    private val _deliveryPartnerStatus = MutableStateFlow("Finding nearest partner...")
    val deliveryPartnerStatus: StateFlow<String> = _deliveryPartnerStatus.asStateFlow()

    private val _isUserAddressSelectorVisible = MutableStateFlow(false)
    val isUserAddressSelectorVisible: StateFlow<Boolean> = _isUserAddressSelectorVisible.asStateFlow()

    private val _selectedUserAddressId = MutableStateFlow<String?>(null)
    val selectedUserAddressId: StateFlow<String?> = _selectedUserAddressId.asStateFlow()

    private val _savedUserAddresses = MutableStateFlow<List<UserAddress>>(emptyList())
    val savedUserAddresses: StateFlow<List<UserAddress>> = _savedUserAddresses.asStateFlow()

    private val _isLoadingUserAddresses = MutableStateFlow(true)
    val isLoadingUserAddresses: StateFlow<Boolean> = _isLoadingUserAddresses.asStateFlow()

    private val _useCurrentLocation = MutableStateFlow(false)
    val useCurrentLocation: StateFlow<Boolean> = _useCurrentLocation.asStateFlow()

    private val _isPaymentViewVisible = MutableStateFlow(false)
    val isPaymentViewVisible: StateFlow<Boolean> = _isPaymentViewVisible.asStateFlow()

    private val _showPaymentSuccess = MutableStateFlow(false)
    val showPaymentSuccess: StateFlow<Boolean> = _showPaymentSuccess.asStateFlow()

    private val _showPaymentFailed = MutableStateFlow(false)
    val showPaymentFailed: StateFlow<Boolean> = _showPaymentFailed.asStateFlow()

    private val _showPaymentCancelled = MutableStateFlow(false)
    val showPaymentCancelled: StateFlow<Boolean> = _showPaymentCancelled.asStateFlow()

    private val _createdOrderId = MutableStateFlow<String?>(null)
    val createdOrderId: StateFlow<String?> = _createdOrderId.asStateFlow()

    private val _razorpayOrderId = MutableStateFlow<String?>(null)
    val razorpayOrderId: StateFlow<String?> = _razorpayOrderId.asStateFlow()

    private val _createdOrderNumber = MutableStateFlow<String?>(null)
    val createdOrderNumber: StateFlow<String?> = _createdOrderNumber.asStateFlow()

    private val _isProcessingPayment = MutableStateFlow(false)
    val isProcessingPayment: StateFlow<Boolean> = _isProcessingPayment.asStateFlow()

    private val _showRazorpay = MutableStateFlow(false)
    val showRazorpay: StateFlow<Boolean> = _showRazorpay.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    init {
        RazorpayService.activeListener = this
        fetchAddresses()
        listenToDeliveryEvents()
    }

    private fun listenToDeliveryEvents() {
        // Connect to Kafka/SSE to receive live partner data
        val token = AuthManager.getToken() ?: com.localforvocalstartup.app.data.remote.NetworkClient.tempToken
        if (token != null) {
            KafkaEventService.connect(token)
            viewModelScope.launch {
                KafkaEventService.eventStream.collectLatest { event ->
                    // Example logic: parsing SSE event updates about delivery partners
                    if (event.eventType == "PARTNER_STATUS_UPDATE" || event.eventType == "LOCATION_UPDATE") {
                        val isOnline = event.payload?.get("isOnline") as? Boolean ?: false
                        if (isOnline) {
                            _deliveryPartnerStatus.value = "Delivery partner assigned! Heading your way."
                            _deliveryEtaMinutes.value = 8 // decrease ETA dynamically
                        } else {
                            _deliveryPartnerStatus.value = "Finding nearest partner..."
                        }
                    }
                }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        KafkaEventService.disconnect()
    }

    val currentUserAddress: UserAddress?
        get() {
            val locationName = _locationManager.address.value
            if (_useCurrentLocation.value && locationName != "Locating...") {
                return UserAddress(
                    _id = "current-location",
                    userId = "",
                    name = "Current Location",
                    phone = "",
                    addressLine1 = locationName,
                    city = locationName,
                    state = "",
                    pincode = "",
                    isDefault = false
                )
            }
            return _savedUserAddresses.value.firstOrNull { it.id == _selectedUserAddressId.value }
                ?: _savedUserAddresses.value.firstOrNull()
        }

    val itemTotal: Double get() = items.sumOf { it.product.price * it.quantity }
    val mrpTotal: Double get() = items.sumOf { (it.product.mrp ?: it.product.price) * it.quantity }
    val shippingFee: Double get() = 0.0 // Free grocery delivery
    val handlingFee: Double get() = 2.0 // Fixed handling fee for groceries
    
    val discount: Double get() = mrpTotal - itemTotal
    val totalAmount: Double get() = itemTotal + shippingFee + handlingFee

    fun setIsUserAddressSelectorVisible(vis: Boolean) { _isUserAddressSelectorVisible.value = vis }
    fun setUseCurrentLocation(use: Boolean) { _useCurrentLocation.value = use }
    fun setIsPaymentViewVisible(vis: Boolean) { _isPaymentViewVisible.value = vis }
    fun setPaymentSuccess(vis: Boolean) { _showPaymentSuccess.value = vis }
    fun setPaymentFailed(vis: Boolean) { _showPaymentFailed.value = vis }
    fun setPaymentCancelled(vis: Boolean) { _showPaymentCancelled.value = vis }
    fun setShowRazorpay(vis: Boolean) { _showRazorpay.value = vis }
    fun clearError() { _errorMessage.value = null }

    fun fetchAddresses() {
        viewModelScope.launch {
            _isLoadingUserAddresses.value = true
            try {
                val addresses = com.localforvocalstartup.app.data.remote.NetworkClient.apiService.getAddresses()
                _savedUserAddresses.value = addresses
                _isLoadingUserAddresses.value = false
                
                if (_selectedUserAddressId.value == null) {
                    val defaultAddr = _savedUserAddresses.value.firstOrNull { it.isDefault }
                    _selectedUserAddressId.value = defaultAddr?.id ?: _savedUserAddresses.value.firstOrNull()?.id
                }
            } catch (e: Exception) {
                AppLogger.error("Error fetching addresses: ${e.message}")
                _isLoadingUserAddresses.value = false
            }
        }
    }

    fun handleAddressSelection(newAddress: UserAddress) {
        val addressName = newAddress.name
        val addressPhone = newAddress.phone

        viewModelScope.launch {
            _useCurrentLocation.value = false
            val isServerAddress = newAddress.id.length == 24 && newAddress.id.all { it.isLetterOrDigit() }
            val existingMatch = _savedUserAddresses.value.firstOrNull {
                it.id == newAddress.id || (it.name == addressName && it.phone == addressPhone)
            }
            if (existingMatch != null && isServerAddress) {
                _selectedUserAddressId.value = existingMatch.id
                return@launch
            }

            try {
                val request = com.localforvocalstartup.app.data.remote.SaveAddressRequest(
                    name = newAddress.name,
                    phone = newAddress.phone,
                    addressLine1 = newAddress.addressLine1,
                    addressLine2 = newAddress.addressLine2,
                    city = newAddress.city,
                    state = newAddress.state.ifEmpty { newAddress.city },
                    pincode = newAddress.pincode,
                    country = newAddress.country.ifEmpty { "India" },
                    isDefault = newAddress.isDefault
                )
                val saved = com.localforvocalstartup.app.data.remote.NetworkClient.apiService.saveAddress(request)
                _selectedUserAddressId.value = saved.id
                fetchAddresses()
            } catch (e: Exception) {
                _selectedUserAddressId.value = newAddress.id
            }
        }
    }

    fun processPayment(method: String) {
        if (_isProcessingPayment.value) return
        val token = AuthManager.getToken()
            ?: com.localforvocalstartup.app.data.remote.NetworkClient.tempToken?.takeIf { it.isNotBlank() }
            ?: run {
                _errorMessage.value = "Please login to continue."
                return
            }

        val address = currentUserAddress ?: return run {
            _errorMessage.value = "Please select a delivery address."
        }

        _isProcessingPayment.value = true

        viewModelScope.launch {
            try {
                val orderItems = items.map { item ->
                    OrderItem(
                        productId = item.product.id,
                        quantity = item.quantity,
                        price = item.product.price,
                        name = item.product.name,
                        image = item.product.images?.firstOrNull()
                    )
                }

                val addrPayload = AddressPayload(
                    name = address.name,
                    phone = address.phone,
                    addressLine1 = address.addressLine1,
                    addressLine2 = address.addressLine2,
                    city = address.city,
                    state = address.state,
                    pincode = address.pincode,
                    country = address.country
                )

                val response = OrderService.createOrder(
                    items = orderItems,
                    address = addrPayload,
                    addressId = address.id,
                    paymentMethod = method,
                    authToken = token,
                    donation = 0.0,
                    protectPromiseFee = 0.0,
                    shippingFee = shippingFee,
                    lastChanceOffers = emptyList()
                )

                _createdOrderId.value = response._id
                _createdOrderNumber.value = response._id
            } catch (e: Exception) {
                _errorMessage.value = "Failed to create order: ${e.message}"
                _isProcessingPayment.value = false
                return@launch
            }

            if (method == "RAZORPAY") {
                try {
                    val orderId = _createdOrderId.value
                    if (orderId != null) {
                        val razorpayOrder = RazorpayService.createRazorpayOrder(orderId)
                        _razorpayOrderId.value = razorpayOrder.paymentOrderId
                        _showRazorpay.value = true
                    } else {
                        throw Exception("Order ID is null")
                    }
                } catch (e: Exception) {
                    _showPaymentFailed.value = true
                }
            } else {
                delay(300)
                _showPaymentSuccess.value = true
            }

            _isProcessingPayment.value = false
        }
    }

    override fun onPaymentSuccess(razorpayPaymentID: String?, paymentData: PaymentData?) {
        _showRazorpay.value = false
        viewModelScope.launch {
            try {
                val orderId = paymentData?.orderId ?: _createdOrderId.value ?: ""
                val isValid = RazorpayService.verifyPayment(
                    _orderId = _createdOrderId.value ?: "",
                    razorpayOrderId = orderId,
                    razorpayPaymentId = razorpayPaymentID ?: "",
                    razorpaySignature = paymentData?.signature ?: ""
                )
                if (isValid) {
                    _showPaymentSuccess.value = true
                } else {
                    _showPaymentFailed.value = true
                }
            } catch (e: Exception) {
                _showPaymentFailed.value = true
            }
        }
    }

    override fun onPaymentError(code: Int, response: String?, paymentData: PaymentData?) {
        _showRazorpay.value = false
        if (code == com.razorpay.Checkout.PAYMENT_CANCELED) {
            _showPaymentCancelled.value = true
        } else {
            _showPaymentFailed.value = true
        }
    }
}
