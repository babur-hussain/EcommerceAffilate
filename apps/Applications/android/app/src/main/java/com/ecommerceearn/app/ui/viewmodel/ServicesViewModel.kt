package com.ecommerceearn.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ecommerceearn.app.data.model.ServiceCategoryModel
import com.ecommerceearn.app.data.model.ServiceSubCategoryModel
import com.ecommerceearn.app.data.model.ServiceProviderModel
import com.ecommerceearn.app.data.model.ServiceReviewModel
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ServicesViewModel : ViewModel() {

    private val _categories = MutableStateFlow<List<ServiceCategoryModel>>(emptyList())
    val categories: StateFlow<List<ServiceCategoryModel>> = _categories.asStateFlow()

    private val _categoriesLoading = MutableStateFlow(false)
    val categoriesLoading: StateFlow<Boolean> = _categoriesLoading.asStateFlow()

    private val _subCategories = MutableStateFlow<List<ServiceSubCategoryModel>>(emptyList())
    val subCategories: StateFlow<List<ServiceSubCategoryModel>> = _subCategories.asStateFlow()

    private val _subCategoriesLoading = MutableStateFlow(false)
    val subCategoriesLoading: StateFlow<Boolean> = _subCategoriesLoading.asStateFlow()

    private val _providers = MutableStateFlow<List<ServiceProviderModel>>(emptyList())
    val providers: StateFlow<List<ServiceProviderModel>> = _providers.asStateFlow()

    private val _providersLoading = MutableStateFlow(false)
    val providersLoading: StateFlow<Boolean> = _providersLoading.asStateFlow()

    private val _selectedProvider = MutableStateFlow<ServiceProviderModel?>(null)
    val selectedProvider: StateFlow<ServiceProviderModel?> = _selectedProvider.asStateFlow()

    private val _providerReviews = MutableStateFlow<List<ServiceReviewModel>>(emptyList())
    val providerReviews: StateFlow<List<ServiceReviewModel>> = _providerReviews.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    fun fetchCategories() {
        viewModelScope.launch {
            _categoriesLoading.value = true
            _errorMessage.value = null
            try {
                // val result = NetworkClient.apiService.fetchServiceCategories()
                // _categories.value = result
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
                AppLogger.error("Failed to fetch service categories: ${e.message}")
            } finally {
                _categoriesLoading.value = false
            }
        }
    }

    fun fetchSubCategories(categoryId: String) {
        viewModelScope.launch {
            _subCategoriesLoading.value = true
            _errorMessage.value = null
            try {
                // val result = NetworkClient.apiService.fetchServiceSubCategories(categoryId)
                // _subCategories.value = result
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
                AppLogger.error("Failed to fetch sub-categories: ${e.message}")
            } finally {
                _subCategoriesLoading.value = false
            }
        }
    }

    fun fetchProviders(subCategoryId: String) {
        viewModelScope.launch {
            _providersLoading.value = true
            _errorMessage.value = null
            try {
                // val result = NetworkClient.apiService.fetchServiceProviders(subCategoryId)
                // _providers.value = result
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
                AppLogger.error("Failed to fetch providers: ${e.message}")
            } finally {
                _providersLoading.value = false
            }
        }
    }

    fun fetchProviderDetail(id: String) {
        viewModelScope.launch {
            try {
                // _selectedProvider.value = NetworkClient.apiService.fetchServiceProviderDetail(id)
            } catch (e: Exception) {
                AppLogger.error("Failed to fetch provider detail: ${e.message}")
            }
        }
    }

    fun fetchProviderReviews(providerId: String) {
        viewModelScope.launch {
            try {
                // _providerReviews.value = NetworkClient.apiService.fetchServiceProviderReviews(providerId)
            } catch (e: Exception) {
                AppLogger.error("Failed to fetch provider reviews: ${e.message}")
            }
        }
    }
}
