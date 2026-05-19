package com.localforvocalstartup.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Represents a server-persisted address from MongoDB.
 * _id is populated by Gson from the server response — never generated locally.
 */
data class Address(
    @SerializedName("_id") val _id: String = "",
    val userId: String = "",
    val name: String = "",
    val phone: String = "",
    val addressLine1: String = "",
    val addressLine2: String? = null,
    val city: String = "",
    val state: String = "",
    val pincode: String = "",
    val country: String = "India",
    val isDefault: Boolean = false
) {
    /** Convenience accessor — always the MongoDB ObjectId string from the server. */
    val id: String get() = _id
}
