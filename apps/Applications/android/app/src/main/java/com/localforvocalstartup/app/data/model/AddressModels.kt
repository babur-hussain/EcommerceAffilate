package com.localforvocalstartup.app.data.model

import com.google.gson.annotations.SerializedName
import java.util.UUID

data class Address(
    @SerializedName("_id") val _id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val name: String,
    val phone: String,
    val addressLine1: String,
    val addressLine2: String? = null,
    val city: String,
    val state: String,
    val pincode: String,
    val country: String = "India",
    val isDefault: Boolean = false
) {
    val id: String get() = _id
}
