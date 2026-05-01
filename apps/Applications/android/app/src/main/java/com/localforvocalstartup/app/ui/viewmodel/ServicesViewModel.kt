package com.localforvocalstartup.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.localforvocalstartup.app.data.model.ServiceCategoryModel
import com.localforvocalstartup.app.data.model.ServiceProviderModel
import com.localforvocalstartup.app.data.model.ServiceReviewModel
import com.localforvocalstartup.app.data.model.ServiceSubCategoryModel
import com.localforvocalstartup.app.data.remote.NetworkClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ServicesViewModel : ViewModel() {
    private val api = NetworkClient.apiService

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
                _categories.value = api.getServiceCategories()
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
                e.printStackTrace()
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
                _subCategories.value = api.getServiceSubCategories(categoryId)
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
                e.printStackTrace()
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
                val response = api.getServiceProviders(subCategoryId = subCategoryId)
                _providers.value = response.data
            } catch (e: Exception) {
                _errorMessage.value = e.localizedMessage
                e.printStackTrace()
            } finally {
                _providersLoading.value = false
            }
        }
    }

    fun fetchProviderDetail(id: String) {
        viewModelScope.launch {
            try {
                _selectedProvider.value = api.getServiceProviderDetail(id)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun fetchProviderReviews(providerId: String) {
        viewModelScope.launch {
            try {
                val response = api.getServiceReviews(providerId)
                _providerReviews.value = response.data
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
