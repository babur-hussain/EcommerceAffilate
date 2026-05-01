package com.localforvocalstartup.app.ui.sdui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.localforvocalstartup.app.data.model.ComponentType
import com.localforvocalstartup.app.data.model.SDUIComponent
import com.localforvocalstartup.app.utils.fromHex

import com.google.gson.JsonObject

@Composable
fun Modifier.sduiStyle(style: JsonObject?): Modifier {
    if (style == null) return this
    var modifier = this

    // Background Color
    val hex = style.get("backgroundColor")?.asString
    if (hex != null) {
        modifier = modifier.background(Color.fromHex(hex))
    }

    // Corner Radius
    val radius = style.get("cornerRadius")?.asFloat
    if (radius != null && radius > 0f) {
        modifier = modifier.clip(RoundedCornerShape(radius.dp))
    }

    // Padding
    val paddingObj = style.getAsJsonObject("padding")
    if (paddingObj != null) {
        val top = paddingObj.get("top")?.asFloat ?: 0f
        val bottom = paddingObj.get("bottom")?.asFloat ?: 0f
        val start = paddingObj.get("leading")?.asFloat ?: 0f
        val end = paddingObj.get("trailing")?.asFloat ?: 0f
        modifier = modifier.padding(start.dp, top.dp, end.dp, bottom.dp)
    }

    return modifier
}

@Composable
fun SDUIComponentView(component: SDUIComponent) {
    Box(modifier = Modifier.sduiStyle(component.style as? JsonObject)) {
        when (component.type) {
            ComponentType.CONTAINER -> {
                Column {
                    component.children?.forEach { child ->
                        SDUIComponentView(component = child)
                    }
                }
            }
            ComponentType.TEXT -> {
                Text(text = component.props?.get("text")?.asString ?: "")
            }
            ComponentType.IMAGE -> {
                // val imageUrl = component.prop("imageUrl") as? String
                // AsyncImage(model = imageUrl, ...)
            }
            ComponentType.BUTTON -> {
                Text(text = component.props?.get("text")?.asString ?: "Button", modifier = Modifier.clickable { })
            }
            ComponentType.SCROLL_VIEW -> {
                Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                    component.children?.forEach { child ->
                        SDUIComponentView(component = child)
                    }
                }
            }
            ComponentType.SPACER -> Spacer(modifier = Modifier.padding(8.dp))
            ComponentType.UNKNOWN -> {
                Text(
                    text = "Unknown: ${component.type.name}",
                    color = Color.White,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Red, RoundedCornerShape(8.dp))
                        .padding(8.dp)
                )
            }
            ComponentType.HERO_CAROUSEL -> RenderCarousel(component)
            ComponentType.CATEGORY_CIRCLES -> RenderCategoryCircles(component)
            ComponentType.BANNER -> RenderBanner(component)
            ComponentType.GRID -> RenderGrid(component)
            ComponentType.HORIZONTAL_LIST -> RenderHorizontalList(component)
            ComponentType.PRODUCT_LIST -> RenderProductList(component)
            ComponentType.PRODUCT_LIST_HORIZONTAL -> RenderProductListHorizontal(component)
            ComponentType.TOP_DEALS -> com.localforvocalstartup.app.ui.components.TopDealsView(component)
            ComponentType.UPCOMING_LAUNCHES -> com.localforvocalstartup.app.ui.components.UpcomingLaunchesView(component)
            ComponentType.SHOP_BY_PRICE -> com.localforvocalstartup.app.ui.components.ShopByPriceView(component)

            // Beauty Specialized
            ComponentType.BEAUTY_LAUNCH_PARTY -> RenderBeautyLaunchParty(component)
            ComponentType.BEAUTY_TREND_MORE -> RenderBeautyTrendMore(component)
            ComponentType.BEAUTY_K_BEAUTY -> RenderBeautyKBeauty(component)
            ComponentType.INTERNET_FAMED_BRANDS -> RenderBeautyInternetFamed(component)
            ComponentType.BEAUTY_GLAM_BUDGET -> RenderBeautyGlamBudget(component)
            ComponentType.GLOW_FOR_HARVEST -> RenderGlowForHarvest(component)
            ComponentType.GLOBALLY_LOVED_ALISTERS -> RenderGloballyLovedAlisters(component)

            // Sports Specialized
            ComponentType.SPORT_CRICKET_SEASON -> RenderSportCricketSeason(component)
            ComponentType.SPORT_WINNER_BRANDS -> RenderSportWinnerBrands(component)
            ComponentType.SPORT_SUPPORT_GOALS -> RenderSportSupportGoals(component)
            ComponentType.SPORT_GYM_ACCESSORIES -> RenderSportGymAccessories(component)
            ComponentType.SPORT_COMBOS -> RenderSportCombos(component)
            ComponentType.SPORT_SAVINGS -> RenderSportSavings(component)
            ComponentType.SPORT_WISHLIST -> RenderSportWishlist(component)

            // Furniture Specialized
            ComponentType.FURNITURE_DEAL_OF_DAY -> RenderFurnitureDealOfDay(component)
            ComponentType.FURNITURE_TOP_BRANDS -> RenderFurnitureTopBrands(component)
            ComponentType.FURNITURE_SPONSORSHIP_BANNER -> RenderFurnitureSponsorshipBanner(component)
            ComponentType.FURNITURE_GRAB_OR_GONE -> RenderFurnitureGrabOrGone(component)
            ComponentType.FURNITURE_SHOP_BY_MATERIAL -> RenderFurnitureShopByMaterial(component)
            ComponentType.FURNITURE_TRENDING_NOW -> RenderFurnitureTrendingNow(component)
            ComponentType.FURNITURE_WISHLIST -> RenderFurnitureWishlist(component)
            ComponentType.FURNITURE_CUSTOMER_REVIEWS -> RenderFurnitureCustomerReviews(component)
            ComponentType.FURNITURE_SHOP_BY_ROOM -> RenderFurnitureShopByRoom(component)

            // Image component
            ComponentType.IMAGE -> {
                val imageUrl = component.props?.get("imageUrl")?.asString ?: component.props?.get("image")?.asString
                if (imageUrl != null) {
                    coil.compose.AsyncImage(
                        model = imageUrl,
                        contentDescription = null,
                        modifier = Modifier.fillMaxWidth().sduiStyle(component.style as? JsonObject),
                        contentScale = androidx.compose.ui.layout.ContentScale.FillWidth
                    )
                }
            }

            // All remaining known component types → Generic Section Renderer
            ComponentType.CURATED_COLLECTIONS,
            ComponentType.FIFTY_PERCENT_OFF_ZONE,
            ComponentType.GRAND_KITCHEN_SALE,
            ComponentType.LIGHTNING_DEALS,
            ComponentType.RECENT_HISTORY,
            ComponentType.GROCERY_ROW,
            ComponentType.ACTIVE_ORDERS,
            ComponentType.SUB_CATEGORY_SLIDER,
            ComponentType.SHOPPING_FOR_OTHERS_HUB,
            ComponentType.BEAUTIFUL_IMAGE_SLIDER,
            ComponentType.EID_CELEBRATION_DEALS,
            ComponentType.FOR_YOU_BENTO_GRID,
            ComponentType.POWERED_BY_ROW,
            ComponentType.SPOIL_YOURSELF_TITLE,
            ComponentType.HEADER_BACKGROUND,
            ComponentType.EARLY_BIRD_DEALS,
            ComponentType.SANKRANTI_FESTIVAL,
            ComponentType.SHOE_STEAL_FEST,
            ComponentType.WINTER_CLEARANCE,
            ComponentType.DEALS_OF_THE_DAY,
            ComponentType.BUDGET_BUYS,
            ComponentType.FASHION_FORECAST,
            ComponentType.WINTER_COLLECTION,
            ComponentType.PROMO_POSTER,
            ComponentType.CONSULTATION_BANNER,
            ComponentType.FURNITURE_SAMARTH_STORE,
            ComponentType.FURNITURE_EMI_OFFERS,
            ComponentType.FURNITURE_TOP_FURNITURE_BRANDS,
            ComponentType.FURNITURE_EVERYBODY_LIST,
            ComponentType.FURNITURE_RARE_FINDS,
            ComponentType.FURNITURE_STATEMENT_PIECES,
            ComponentType.LUMIERE_HEADER,
            ComponentType.LUMIERE_SECTION,
            ComponentType.LUMIERE_NEWSLETTER,
            ComponentType.LUMIERE_BOTTOM_NAV,
            ComponentType.LUMINOUS_SECTION,
            ComponentType.LUMINOUS_NEWSLETTER,
            ComponentType.LUMINOUS_HEADER,
            ComponentType.LUMINOUS_CATEGORIES,
            ComponentType.LUMINOUS_GRID,
            ComponentType.LUMINOUS_SALE,
            ComponentType.LUMINOUS_BOTTOM_NAV,
            ComponentType.BACK_TO_SCHOOL_HEADER,
            ComponentType.BACK_TO_SCHOOL_BANNER,
            ComponentType.BACK_TO_SCHOOL_CATEGORIES,
            ComponentType.BACK_TO_SCHOOL_GRID,
            ComponentType.BACK_TO_SCHOOL_FOOTER,
            ComponentType.SCHOOL_TWO_HEADER,
            ComponentType.SCHOOL_TWO_BANNER,
            ComponentType.SCHOOL_TWO_CATEGORIES,
            ComponentType.SCHOOL_TWO_DEALS,
            ComponentType.SCHOOL_TWO_GRID,
            ComponentType.SCHOOL_TWO_FOOTER,
            ComponentType.SCHOOL_THREE_HEADER,
            ComponentType.SCHOOL_THREE_BANNER,
            ComponentType.SCHOOL_THREE_CATEGORIES,
            ComponentType.SCHOOL_THREE_ESSENTIALS,
            ComponentType.SCHOOL_THREE_GRID,
            ComponentType.SCHOOL_THREE_FOOTER,
            ComponentType.SCHOOL_FOUR_HEADER,
            ComponentType.SCHOOL_FOUR_CATEGORIES,
            ComponentType.SCHOOL_FOUR_GRID,
            ComponentType.SCHOOL_FOUR_FOOTER,
            ComponentType.SCHOOL_FIVE_HEADER,
            ComponentType.SCHOOL_FIVE_CATEGORIES,
            ComponentType.SCHOOL_FIVE_GRID,
            ComponentType.SCHOOL_FIVE_FOOTER,
            ComponentType.SERVICE_HEADER,
            ComponentType.SERVICE_HERO_SECTION,
            ComponentType.SERVICE_CATEGORY_SECTION,
            ComponentType.SERVICE_BOTTOM_NAV,
            ComponentType.BRAND_SPOTLIGHT,
            ComponentType.COLLECTION_GRID,
            ComponentType.FEATURED_PRODUCTS,
            ComponentType.SEASONAL_SHOWCASE,
            ComponentType.BANNER_PAGE_HEADER,
            ComponentType.BANNER_PAGE_GRID,
            ComponentType.BANNER_PAGE_FOOTER,
            ComponentType.FASHION_HEADER,
            ComponentType.FASHION_COLLECTIONS,
            ComponentType.FASHION_TRENDING,
            ComponentType.ELECTRONICS_HEADER,
            ComponentType.ELECTRONICS_DEALS,
            ComponentType.ELECTRONICS_CATEGORIES,
            ComponentType.BEAUTY_HEADER,
            ComponentType.BEAUTY_TOP_PICKS,
            ComponentType.BEAUTY_NEW_ARRIVALS,
            ComponentType.BEAUTY_PREMIUM_PICK,
            ComponentType.BEAUTY_LUXE_LANE,
            ComponentType.BEAUTY_EDITOR_PICK,
            ComponentType.BEAUTY_GLAM_TOP,
            ComponentType.BEAUTY_FRAGRANCE_LUXE,
            ComponentType.BEAUTY_MAKEUP_MANIA,
            ComponentType.BEAUTY_SKIN_CARE_SANCTUARY,
            ComponentType.BEAUTY_HAIR_CARE_HAVEN,
            ComponentType.BEAUTY_BATH_BODY_BLISS,
            ComponentType.BEAUTY_WELLNESS_WONDERS,
            ComponentType.BEAUTY_GROOMING_GURUS,
            ComponentType.BEAUTY_BRANDS_WE_LOVE,
            ComponentType.HOME_HEADER,
            ComponentType.HOME_DECOR,
            ComponentType.KITCHEN_ESSENTIALS,
            ComponentType.SPORTS_HEADER,
            ComponentType.SPORTS_GEAR,
            ComponentType.FITNESS_EQUIPMENT,
            ComponentType.TOYS_HEADER,
            ComponentType.TOYS_TRENDING,
            ComponentType.BABY_CARE,
            ComponentType.BOOKS_HEADER,
            ComponentType.BEST_SELLERS,
            ComponentType.STATIONERY_SUPPLIES,
            ComponentType.SHOES_SALES_HEADER,
            ComponentType.SHOES_SALES_FEATURED,
            ComponentType.SHOES_SALES_GRID,
            ComponentType.TEXT_BLOCK,
            ComponentType.FLASH_SALE_GRID,
            ComponentType.FEATURED_CAROUSEL,
            ComponentType.BEST_QUALITY,
            ComponentType.GROCERY_LISTING,
            ComponentType.SMART_BASKET,
            ComponentType.GROCERY_TOP_PICKS,
            ComponentType.GROCERY_DEALS,
            ComponentType.GROCERY_PROMO_CARDS,
            ComponentType.GROCERY_EVENTS,
            ComponentType.GROCERY_SHOP_BY_CATEGORY,
            ComponentType.GROCERY_SPECIAL_PICKS,
            ComponentType.GROCERY_WHOLESALE_TEXT,
            ComponentType.PRODUCT_GRID,
            ComponentType.GRADIENT -> RenderGenericSection(component)

            else -> {
                // Truly unknown — render children if present, otherwise skip silently
                component.children?.forEach { child ->
                    SDUIComponentView(component = child)
                }
            }
        }
    }
}
