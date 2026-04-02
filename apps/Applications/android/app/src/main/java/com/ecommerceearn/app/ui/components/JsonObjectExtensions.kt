package com.ecommerceearn.app.ui.components

import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject

/**
 * Extension helpers on JsonObject to mimic the old Map<String, Any> API
 * used throughout SDUIRenderer and other component renderers.
 */

fun JsonObject?.getString(key: String): String? = this?.get(key)?.takeIf { !it.isJsonNull }?.asString
fun JsonObject?.getDouble(key: String): Double? = this?.get(key)?.takeIf { !it.isJsonNull }?.asDouble
fun JsonObject?.getFloat(key: String): Float? = this?.get(key)?.takeIf { !it.isJsonNull }?.asFloat
fun JsonObject?.getInt(key: String): Int? = this?.get(key)?.takeIf { !it.isJsonNull }?.asInt
fun JsonObject?.getBool(key: String): Boolean? = this?.get(key)?.takeIf { !it.isJsonNull }?.asBoolean
fun JsonObject?.getArray(key: String): JsonArray? = this?.get(key)?.takeIf { it.isJsonArray }?.asJsonArray
fun JsonObject?.getObj(key: String): JsonObject? = this?.get(key)?.takeIf { it.isJsonObject }?.asJsonObject

/** Get string list for multi-value props like "colors" */
fun JsonObject?.getStringList(key: String): List<String> {
    val arr = this?.get(key) ?: return emptyList()
    if (arr.isJsonArray) {
        return arr.asJsonArray.mapNotNull { el ->
            if (!el.isJsonNull) el.asString else null
        }
    }
    return emptyList()
}
