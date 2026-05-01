/**
 * GlobalComponents.kt
 * 
 * This file contains re-exports of commonly used SDUI components
 * that are shared across multiple pages (Fashion, For You, etc.).
 * 
 * Import this file to access:
 * - HeroBannerView (from HeroBannerView.kt)
 * - SubCategorySliderView (from AdditionalSDUIViews.kt)
 * 
 * These components are designed to be reusable and match the iOS app styling.
 */
package com.localforvocalstartup.app.ui.components

// Re-export marker file - actual implementations are in:
// - HeroBannerView.kt: HeroBannerView()
// - AdditionalSDUIViews.kt: SubCategorySliderView(), SubCategoryCell()

/**
 * GLOBAL COMPONENTS LIST:
 * 
 * 1. HeroBannerView - Auto-scrolling carousel with page indicators
 *    Usage: HeroBannerView(banners = listOf(...))
 *    
 * 2. SubCategorySliderView - 2-row horizontal grid of category cells
 *    Usage: SubCategorySliderView(parentCategoryId = "category_id")
 * 
 * 3. SubCategoryCell - Individual category cell with image and name
 *    Usage: SubCategoryCell(sub = SubCategoryItem(...))
 */
