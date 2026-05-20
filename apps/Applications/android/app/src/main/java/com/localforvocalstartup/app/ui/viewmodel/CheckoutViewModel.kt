package com.localforvocalstartup.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.localforvocalstartup.app.data.manager.LocationManager
import com.localforvocalstartup.app.data.manager.AuthManager
import com.localforvocalstartup.app.data.model.Product
import com.localforvocalstartup.app.data.model.UserAddress
import com.localforvocalstartup.app.data.services.OrderService
import com.localforvocalstartup.app.data.services.RazorpayOrderResponse
import com.localforvocalstartup.app.data.services.RazorpayService
import com.localforvocalstartup.app.data.services.RazorpayResultListener
import com.localforvocalstartup.app.data.services.AddressPayload
import com.localforvocalstartup.app.data.services.OrderItem
import com.localforvocalstartup.app.data.services.LastChanceOfferPayload
import com.localforvocalstartup.app.utils.AppLogger
import com.razorpay.PaymentData
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

data class CheckoutItem(
    val id: String = UUID.randomUUID().toString(),
    val product: Product,
    val quantity: Int,
    val selectedOfferIds: List<String>
)

class CheckoutViewModel(
    val items: List<CheckoutItem>
) : ViewModel(), RazorpayResultListener {

    // Properties converted to StateFlows for Jetpack Compose
    
    val firstProduct: Product? get() = items.firstOrNull()?.product

    private val _locationManager = LocationManager
    val locationManager = _locationManager

    private val _currentStep = MutableStateFlow(2)
    val currentStep: StateFlow<Int> = _currentStep.asStateFlow()

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

    private val _isLocationPickerVisible = MutableStateFlow(false)
    val isLocationPickerVisible: StateFlow<Boolean> = _isLocationPickerVisible.asStateFlow()

    private val _selectedDonation = MutableStateFlow<Int?>(null)
    val selectedDonation: StateFlow<Int?> = _selectedDonation.asStateFlow()

    private val _isPriceDetailsVisible = MutableStateFlow(false)
    val isPriceDetailsVisible: StateFlow<Boolean> = _isPriceDetailsVisible.asStateFlow()

    private val _isPaymentViewVisible = MutableStateFlow(false)
    val isPaymentViewVisible: StateFlow<Boolean> = _isPaymentViewVisible.asStateFlow()

    private val _showPaymentSuccess = MutableStateFlow(false)
    val showPaymentSuccess: StateFlow<Boolean> = _showPaymentSuccess.asStateFlow()

    private val _showPaymentFailed = MutableStateFlow(false)
    val showPaymentFailed: StateFlow<Boolean> = _showPaymentFailed.asStateFlow()

    private val _showPaymentCancelled = MutableStateFlow(false)
    val showPaymentCancelled: StateFlow<Boolean> = _showPaymentCancelled.asStateFlow()

    private val _showMyOrders = MutableStateFlow(false)
    val showMyOrders: StateFlow<Boolean> = _showMyOrders.asStateFlow()

    private val _createdOrderId = MutableStateFlow<String?>(null)
    val createdOrderId: StateFlow<String?> = _createdOrderId.asStateFlow()

    private val _razorpayOrderId = MutableStateFlow<String?>(null)
    val razorpayOrderId: StateFlow<String?> = _razorpayOrderId.asStateFlow()

    private val _createdOrderNumber = MutableStateFlow<String?>(null)
    val createdOrderNumber: StateFlow<String?> = _createdOrderNumber.asStateFlow()

    private val _isProcessingPayment = MutableStateFlow(false)
    val isProcessingPayment: StateFlow<Boolean> = _isProcessingPayment.asStateFlow()

    private val _showPaymentLoading = MutableStateFlow(false)
    val showPaymentLoading: StateFlow<Boolean> = _showPaymentLoading.asStateFlow()

    private val _showLoginPrompt = MutableStateFlow(false)
    val showLoginPrompt: StateFlow<Boolean> = _showLoginPrompt.asStateFlow()

    private val _showLoginView = MutableStateFlow(false)
    val showLoginView: StateFlow<Boolean> = _showLoginView.asStateFlow()

    private val _selectedUpsells = MutableStateFlow<Set<String>>(emptySet())
    val selectedUpsells: StateFlow<Set<String>> = _selectedUpsells.asStateFlow()

    private val _showRazorpay = MutableStateFlow(false)
    val showRazorpay: StateFlow<Boolean> = _showRazorpay.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    init {
        _selectedUpsells.value = items.flatMap { it.selectedOfferIds }.toSet()
        RazorpayService.activeListener = this
        fetchAddresses()
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
    
    val protectFee: Double get() = items.sumOf { it.product.protectPromiseFee ?: 0.0 }
    
    val shippingFee: Double get() = items.sumOf { it.product.shippingCharges ?: 0.0 }

    val discount: Double get() = mrpTotal - itemTotal

    val discountPercent: Int get() {
        if (mrpTotal <= 0) return 0
        return (((mrpTotal - itemTotal) / mrpTotal) * 100).toInt()
    }

    val totalQuantity: Int get() = items.sumOf { it.quantity }

    val selectedOffersTotal: Double get() {
        var total = 0.0
        for (item in items) {
            val offers = item.product.lastChanceOffers ?: continue
            for ((index, offer) in offers.withIndex()) {
                val offerId = offer.tempId(index)
                if (_selectedUpsells.value.contains(offerId)) {
                    total += offer.offerPrice
                }
            }
        }
        return total
    }

    val totalAmount: Double get() = itemTotal + shippingFee + protectFee + selectedOffersTotal + (_selectedDonation.value?.toDouble() ?: 0.0)

    val totalFees: Double get() = protectFee + shippingFee

    // Setter helpers for Compose UI event binding
    fun setCurrentStep(step: Int) { _currentStep.value = step }
    fun setIsUserAddressSelectorVisible(vis: Boolean) { _isUserAddressSelectorVisible.value = vis }
    fun setUseCurrentLocation(use: Boolean) { _useCurrentLocation.value = use }
    fun setDonation(don: Int?) { _selectedDonation.value = don }
    fun setIsPriceDetailsVisible(vis: Boolean) { _isPriceDetailsVisible.value = vis }
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

            // Check if already saved on server (has a real 24-char MongoDB ObjectId)
            val isServerAddress = newAddress.id.length == 24 && newAddress.id.all { it.isLetterOrDigit() }
            val existingMatch = _savedUserAddresses.value.firstOrNull {
                it.id == newAddress.id || (it.name == addressName && it.phone == addressPhone)
            }
            if (existingMatch != null && isServerAddress) {
                // Already on server — just select it
                _selectedUserAddressId.value = existingMatch.id
                return@launch
            }

            // Save to backend using proper DTO (no local UUID sent)
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
                AppLogger.debug("Address saved to backend with real ID: ${saved.id}")
                // Refresh the full list from backend to get all real server IDs
                fetchAddresses()
            } catch (e: Exception) {
                AppLogger.error("Error saving address to backend: ${e.message}")
                // Fall back to local selection so checkout can still proceed
                _selectedUserAddressId.value = newAddress.id
            }
        }
    }

    fun processPayment(method: String) {
        if (_isProcessingPayment.value) return
        val token = AuthManager.getToken()
            ?: com.localforvocalstartup.app.data.remote.NetworkClient.tempToken?.takeIf { it.isNotBlank() }
            ?: run {
                AppLogger.error("processPayment: no auth token, showing login")
                _showLoginPrompt.value = true
                return
            }

        val address = currentUserAddress ?: return run {
            _errorMessage.value = "Please select a delivery address to proceed."
            return
        }
        
        if (address.addressLine1.isBlank() || address.city.isBlank() || address.pincode.isBlank()) {
            _errorMessage.value = "Please ensure your delivery address is complete (Line 1, City, and Pincode)."
            return
        }

        _isProcessingPayment.value = true

        viewModelScope.launch {
            // Try backend order creation
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

                val selectedOffers = mutableListOf<LastChanceOfferPayload>()
                for (item in items) {
                    val offers = item.product.lastChanceOffers ?: continue
                    for ((index, offer) in offers.withIndex()) {
                        val offerId = offer.tempId(index)
                        if (_selectedUpsells.value.contains(offerId)) {
                            selectedOffers.add(LastChanceOfferPayload(
                                id = offer._id ?: offer.id ?: "",
                                name = offer.title ?: "",
                                price = offer.offerPrice
                            ))
                        }
                    }
                }

                // Only send a real MongoDB ObjectId (24 hex chars) as addressId.
                // For GPS/unsaved addresses, we rely entirely on the inline addrPayload.
                val isRealMongoId = address.id.length == 24 && address.id.all { it.isLetterOrDigit() }
                val validAddressId = if (isRealMongoId) address.id else null

                val response = OrderService.createOrder(
                    items = orderItems,
                    address = addrPayload,
                    addressId = validAddressId,
                    paymentMethod = method,
                    authToken = token,
                    donation = _selectedDonation.value?.toDouble(),
                    protectPromiseFee = protectFee,
                    shippingFee = shippingFee,
                    lastChanceOffers = selectedOffers.takeIf { it.isNotEmpty() }
                )

                _createdOrderId.value = response._id
                _createdOrderNumber.value = response._id
                AppLogger.debug("Order created: ${response._id}")
            } catch (e: Exception) {
                var errorMsg = e.message
                if (e is retrofit2.HttpException) {
                    try {
                        val errorBody = e.response()?.errorBody()?.string()
                        if (errorBody != null) {
                            val jsonObject = org.json.JSONObject(errorBody)
                            if (jsonObject.has("error")) {
                                errorMsg = jsonObject.getString("error")
                            } else {
                                errorMsg = errorBody
                            }
                        }
                    } catch (ex: Exception) {
                        // ignore parsing error
                    }
                }
                AppLogger.error("Order creation failed: $errorMsg")
                _errorMessage.value = "Failed to create order: $errorMsg"
                _isProcessingPayment.value = false
                return@launch
            }

            // Keep PaymentView visible while creating Razorpay order to show loading animation
            if (method == "RAZORPAY") {
                _showPaymentLoading.value = true
                try {
                    val orderId = _createdOrderId.value
                    if (orderId != null) {
                        val razorpayOrder = RazorpayService.createRazorpayOrder(orderId)
                        _razorpayOrderId.value = razorpayOrder.paymentOrderId
                        _showPaymentLoading.value = false
                        _showRazorpay.value = true
                    } else {
                        throw Exception("Order ID is null")
                    }
                } catch (e: Exception) {
                    AppLogger.error("Failed to create Razorpay order: ${e.message}")
                    _showPaymentLoading.value = false
                    _showPaymentFailed.value = true
                }
            } else {
                delay(300)
                _showPaymentSuccess.value = true
            }

            _isProcessingPayment.value = false
        }
    }

    fun handleRazorpaySuccess(paymentId: String, orderId: String, signature: String) {
        _showRazorpay.value = false
        viewModelScope.launch {
            try {
                val isValid = RazorpayService.verifyPayment(
                    _orderId = _createdOrderId.value ?: "",
                    razorpayOrderId = orderId,
                    razorpayPaymentId = paymentId,
                    razorpaySignature = signature
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

    fun handleRazorpayFailure(error: String) {
        _showRazorpay.value = false
        viewModelScope.launch {
            delay(500)
            _showPaymentFailed.value = true
        }
    }

    fun handleRazorpayCancelled() {
        _showRazorpay.value = false
        viewModelScope.launch {
            delay(500)
            _showPaymentCancelled.value = true
        }
    }

    override fun onPaymentSuccess(razorpayPaymentID: String?, paymentData: PaymentData?) {
        val orderId = paymentData?.orderId ?: _createdOrderId.value ?: ""
        val signature = paymentData?.signature ?: ""
        handleRazorpaySuccess(razorpayPaymentID ?: "", orderId, signature)
    }

    override fun onPaymentError(code: Int, response: String?, paymentData: PaymentData?) {
        if (code == com.razorpay.Checkout.PAYMENT_CANCELED) {
            handleRazorpayCancelled()
        } else {
            handleRazorpayFailure(response ?: "Payment Error")
        }
    }
}
