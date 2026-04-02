package com.ecommerceearn.app.data.manager

import com.ecommerceearn.app.data.model.Category
import com.ecommerceearn.app.data.remote.NetworkClient
import com.ecommerceearn.app.utils.AppLogger
import kotlinx.coroutines.launch
import java.util.UUID

class SpecialDealManager : BasePageManager() {
    override val parentCategoryId: String
        get() = "695f88c75f463eeb3c42e765"

    override fun fetchInitialData() {
        scope.launch {
            _isLoading.value = true
            
            try {
                val layout = NetworkClient.apiService.getLayoutBySlug("special-deal-new-style")
                val catComponent = layout.components.firstOrNull { it.originalId == "special-categories" }
                
                if (catComponent != null && catComponent.props != null) {
                    val itemsNode = catComponent.props.get("items")
                    if (itemsNode != null && itemsNode.isJsonArray) {
                        val itemsArray = itemsNode.asJsonArray
                        val parsedCategories = itemsArray.mapNotNull { element ->
                            try {
                                val obj = element.asJsonObject
                                val name = obj.get("name")?.asString ?: return@mapNotNull null
                                val id = obj.get("id")?.asString ?: UUID.randomUUID().toString()
                                val image = obj.get("image_url")?.asString
                                
                                Category(
                                    _id = id,
                                    name = name,
                                    slug = "",
                                    image = image,
                                    icon = null,
                                    parentCategory = null,
                                    group = null,
                                    subCategoryGroupOrder = null
                                )
                            } catch (e: Exception) {
                                null
                            }
                        }
                        
                        _subCategories.value = parsedCategories
                    }
                }
            } catch (e: Exception) {
                AppLogger.debug("Error loading Special Deal layout: ${e.message}")
            }
            
            // fetchProducts function from BasePageManager handles the rest
            selectCategory(null) // triggers fetchProducts internally
            _isLoading.value = false
        }
    }
}
