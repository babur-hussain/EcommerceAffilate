package com.ecommerceearn.app.ui.sdui

import androidx.compose.runtime.Composable
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.*

// Beauty
@Composable fun RenderBeautyLaunchParty(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "New Launches"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", LaunchPartyItem::class.java)
    BeautyLaunchPartyView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderBeautyTrendMore(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Trend More"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", TrendMoreItem::class.java)
    BeautyTrendMoreView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderBeautyKBeauty(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "K-Beauty"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", KBeautyItem::class.java)
    KBeautyView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderBeautyInternetFamed(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Internet Famed"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", InternetFamedItem::class.java)
    BeautyInternetFamedView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderBeautyGlamBudget(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Glam on a Budget"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", GlamBudgetItem::class.java)
    BeautyGlamBudgetView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderGlowForHarvest(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Glow for the harvest"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", HarvestItem::class.java)
    GlowForHarvestView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderGloballyLovedAlisters(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Globally Loved A-Listers"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", AlisterItem::class.java)
    GloballyLovedAlistersView(title = title, headerActionUrl = actionUrl, items = items)
}

// Sports
@Composable fun RenderSportSavings(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Sport Savings"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", SavingsItem::class.java)
    SportSavingsView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderSportSupportGoals(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Support Your Goals"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", GoalItem::class.java)
    SportSupportGoalsView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderSportGymAccessories(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Gym Accessories"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", AccessoryItem::class.java)
    SportGymAccessoriesView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderSportCombos(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Value Combos"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", ComboItem::class.java)
    SportCombosView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderSportCricketSeason(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Cricket Season"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", CricketItem::class.java)
    SportCricketSeasonView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderSportWinnerBrands(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Winner Brands"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", WinnerBrandItem::class.java)
    SportWinnerBrandsView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderSportWishlist(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Add to your wishlist"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", WishlistItem::class.java)
    SportWishlistView(title = title, headerActionUrl = actionUrl, items = items)
}

// Furniture
@Composable fun RenderFurnitureDealOfDay(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Deal of the Day"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FurnitureDealItem::class.java)
    FurnitureDealOfDayView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderFurnitureTopBrands(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Top Brands"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FBrandItem::class.java)
    FurnitureTopBrandsView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderFurnitureSponsorshipBanner(component: SDUIComponent) {
    val items = component.decodeItems("items", FurnitureBannerItem::class.java)
    FurnitureSponsorshipBannerView(items = items)
}

@Composable fun RenderFurnitureGrabOrGone(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Grab or Gone"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FurnitureGrabItem::class.java)
    FurnitureGrabOrGoneView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderFurnitureShopByMaterial(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Shop By Material"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FurnitureMaterialItem::class.java)
    FurnitureShopByMaterialView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderFurnitureTrendingNow(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Trending Now"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FurnitureTrendingItem::class.java)
    FurnitureTrendingNowView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderFurnitureWishlist(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Wishlist"
    val items = component.decodeItems("items", FurnitureWishlistItem::class.java)
    FurnitureWishlistView(title = title, items = items)
}

@Composable fun RenderFurnitureCustomerReviews(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Customer Reviews"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FurnitureReviewItem::class.java)
    FurnitureCustomerReviewsView(title = title, headerActionUrl = actionUrl, items = items)
}

@Composable fun RenderFurnitureShopByRoom(component: SDUIComponent) {
    val title = component.props?.get("title")?.asString ?: "Shop By Room"
    val actionUrl = component.props?.get("actionUrl")?.asString
    val items = component.decodeItems("items", FurnitureRoomItem::class.java)
    FurnitureShopByRoomView(title = title, headerActionUrl = actionUrl, items = items)
}
