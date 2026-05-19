package com.localforvocalstartup.app.ui.components

import com.localforvocalstartup.app.data.manager.NavigationManager

/**
 * Central handler for all SDUI actionUrl strings.
 *
 * Routing rules (priority order):
 *  1. Empty / blank → no-op
 *  2. "product/{id}" → open product detail overlay
 *  3. "category://{name}?categoryId=...&subCategoryId=..." → category page
 *  4. "/grocery/category/{ids}" → grocery category
 *  5. Named slugs (beauty-product, grand-mobiles-sale, etc.) → overlay
 *  6. Anything else → NavigationManager.navigate() as fallback
 */
fun handleActionUrl(actionUrl: String?) {
    if (actionUrl.isNullOrBlank()) return
    NavigationManager.navigate(actionUrl)
}
