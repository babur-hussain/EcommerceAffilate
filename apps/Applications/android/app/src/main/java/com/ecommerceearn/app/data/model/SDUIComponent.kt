package com.ecommerceearn.app.data.model

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.annotations.SerializedName
import com.google.gson.reflect.TypeToken
import java.util.UUID

data class SDUIComponent(
    @SerializedName("id")
    val originalId: String,
    val _id: String? = null,
    @SerializedName("type")
    val rawType: String? = null,
    val props: JsonObject? = null,
    val dataSource: JsonObject? = null,
    val style: JsonObject? = null,
    val children: List<SDUIComponent>? = null,
    val isHidden: Boolean? = null
) {
    // Map rawType string -> ComponentType enum for legacy callers
    val type: ComponentType
        get() = rawType?.let { raw ->
            ComponentType.values().find { it.value == raw }
        } ?: ComponentType.UNKNOWN
    // Unique identifier for Jetpack Compose LazyColumn mapping, replacing Swift's Identifiable UUID
    @Transient 
    val uniqueId: String = UUID.randomUUID().toString()

    companion object {
        internal val gson = Gson()
    }

    /**
     * Helper to decode an array of items from a specific JsonObject key inside `props`
     * Replicates Swift's `decodeItems<T>` logic
     */
    fun <T> decodeItems(key: String, clazz: Class<T>): List<T> {
        return try {
            val element = props?.get(key) ?: return emptyList()
            if (element.isJsonArray) {
                val listType = TypeToken.getParameterized(List::class.java, clazz).type
                Companion.gson.fromJson(element, listType)
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun <T> prop(key: String, clazz: Class<T>): T? {
        return try {
            val element = props?.get(key) ?: return null
            Companion.gson.fromJson(element, clazz)
        } catch (e: Exception) {
            null
        }
    }
    
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is SDUIComponent) return false
        return uniqueId == other.uniqueId
    }

    override fun hashCode(): Int {
        return uniqueId.hashCode()
    }
}

enum class ComponentType(val value: String) {
    @SerializedName("Container") CONTAINER("Container"),
    @SerializedName("Text") TEXT("Text"),
    @SerializedName("Image") IMAGE("Image"),
    @SerializedName("Button") BUTTON("Button"),
    @SerializedName("Gradient") GRADIENT("Gradient"),
    @SerializedName("ScrollView") SCROLL_VIEW("ScrollView"),
    @SerializedName("ProductGrid") PRODUCT_GRID("ProductGrid"),
    @SerializedName("category_circles") CATEGORY_CIRCLES("category_circles"),
    @SerializedName("banner") BANNER("banner"),
    @SerializedName("grid") GRID("grid"),
    @SerializedName("horizontal_list") HORIZONTAL_LIST("horizontal_list"),
    @SerializedName("product_list") PRODUCT_LIST("product_list"),
    @SerializedName("product_list_horizontal") PRODUCT_LIST_HORIZONTAL("product_list_horizontal"),
    @SerializedName("hero_carousel") HERO_CAROUSEL("hero_carousel"),
    @SerializedName("curated_collections") CURATED_COLLECTIONS("curated_collections"),
    @SerializedName("fifty_percent_off") FIFTY_PERCENT_OFF_ZONE("fifty_percent_off"),
    @SerializedName("grand_kitchen") GRAND_KITCHEN_SALE("grand_kitchen"),
    @SerializedName("lightning_deals") LIGHTNING_DEALS("lightning_deals"),
    @SerializedName("recent_history") RECENT_HISTORY("recent_history"),
    @SerializedName("grocery_row") GROCERY_ROW("grocery_row"),
    @SerializedName("active_orders") ACTIVE_ORDERS("active_orders"),
    @SerializedName("sub_category_slider") SUB_CATEGORY_SLIDER("sub_category_slider"),
    @SerializedName("shopping_for_others_hub") SHOPPING_FOR_OTHERS_HUB("shopping_for_others_hub"),
    @SerializedName("beautiful_image_slider") BEAUTIFUL_IMAGE_SLIDER("beautiful_image_slider"),
    @SerializedName("eid_celebration_deals") EID_CELEBRATION_DEALS("eid_celebration_deals"),

    // --- For You Custom Sections ---
    @SerializedName("for_you_bento_grid") FOR_YOU_BENTO_GRID("for_you_bento_grid"),
    @SerializedName("powered_by_row") POWERED_BY_ROW("powered_by_row"),
    @SerializedName("spoil_yourself_title") SPOIL_YOURSELF_TITLE("spoil_yourself_title"),
    @SerializedName("header_background") HEADER_BACKGROUND("header_background"),

    @SerializedName("early_bird_deals") EARLY_BIRD_DEALS("early_bird_deals"),
    @SerializedName("sankranti_festival") SANKRANTI_FESTIVAL("sankranti_festival"),
    @SerializedName("shoe_steal_fest") SHOE_STEAL_FEST("shoe_steal_fest"),
    @SerializedName("winter_clearance") WINTER_CLEARANCE("winter_clearance"),
    @SerializedName("deals_of_the_day") DEALS_OF_THE_DAY("deals_of_the_day"),
    @SerializedName("budget_buys") BUDGET_BUYS("budget_buys"),
    @SerializedName("fashion_forecast") FASHION_FORECAST("fashion_forecast"),
    @SerializedName("winter_collection") WINTER_COLLECTION("winter_collection"),
    @SerializedName("promo_poster") PROMO_POSTER("promo_poster"),
    @SerializedName("glow_for_harvest") GLOW_FOR_HARVEST("glow_for_harvest"),
    @SerializedName("consultation_banner") CONSULTATION_BANNER("consultation_banner"),
    @SerializedName("globally_loved_alisters") GLOBALLY_LOVED_ALISTERS("globally_loved_alisters"),
    @SerializedName("beauty_launch_party") BEAUTY_LAUNCH_PARTY("beauty_launch_party"),
    @SerializedName("beauty_trend_more") BEAUTY_TREND_MORE("beauty_trend_more"),
    @SerializedName("internet_famed_brands") INTERNET_FAMED_BRANDS("internet_famed_brands"),
    @SerializedName("beauty_k_beauty") BEAUTY_K_BEAUTY("beauty_k_beauty"),
    @SerializedName("beauty_glam_budget") BEAUTY_GLAM_BUDGET("beauty_glam_budget"),
    @SerializedName("sport_cricket_season") SPORT_CRICKET_SEASON("sport_cricket_season"),
    @SerializedName("sport_winner_brands") SPORT_WINNER_BRANDS("sport_winner_brands"),
    @SerializedName("sport_support_goals") SPORT_SUPPORT_GOALS("sport_support_goals"),
    @SerializedName("sport_gym_accessories") SPORT_GYM_ACCESSORIES("sport_gym_accessories"),
    @SerializedName("sport_combos") SPORT_COMBOS("sport_combos"),
    @SerializedName("sport_savings") SPORT_SAVINGS("sport_savings"),
    @SerializedName("sport_wishlist") SPORT_WISHLIST("sport_wishlist"),
    @SerializedName("furniture_deal_of_day") FURNITURE_DEAL_OF_DAY("furniture_deal_of_day"),
    @SerializedName("furniture_top_brands") FURNITURE_TOP_BRANDS("furniture_top_brands"),
    @SerializedName("furniture_sponsorship_banner") FURNITURE_SPONSORSHIP_BANNER("furniture_sponsorship_banner"),
    @SerializedName("furniture_grab_or_gone") FURNITURE_GRAB_OR_GONE("furniture_grab_or_gone"),
    @SerializedName("furniture_shop_by_room") FURNITURE_SHOP_BY_ROOM("furniture_shop_by_room"),
    @SerializedName("furniture_samarth_store") FURNITURE_SAMARTH_STORE("furniture_samarth_store"),
    @SerializedName("furniture_emi_offers") FURNITURE_EMI_OFFERS("furniture_emi_offers"),
    @SerializedName("furniture_top_furniture_brands") FURNITURE_TOP_FURNITURE_BRANDS("furniture_top_furniture_brands"),
    @SerializedName("furniture_shop_by_material") FURNITURE_SHOP_BY_MATERIAL("furniture_shop_by_material"),
    @SerializedName("furniture_trending_now") FURNITURE_TRENDING_NOW("furniture_trending_now"),
    @SerializedName("furniture_wishlist") FURNITURE_WISHLIST("furniture_wishlist"),
    @SerializedName("furniture_customer_reviews") FURNITURE_CUSTOMER_REVIEWS("furniture_customer_reviews"),
    @SerializedName("furniture_everybody_list") FURNITURE_EVERYBODY_LIST("furniture_everybody_list"),
    @SerializedName("furniture_rare_finds") FURNITURE_RARE_FINDS("furniture_rare_finds"),
    @SerializedName("furniture_statement_pieces") FURNITURE_STATEMENT_PIECES("furniture_statement_pieces"),

    // --- 50 Percent Off Components ---
    @SerializedName("lumiere_header") LUMIERE_HEADER("lumiere_header"),
    @SerializedName("lumiere_section") LUMIERE_SECTION("lumiere_section"),
    @SerializedName("lumiere_newsletter") LUMIERE_NEWSLETTER("lumiere_newsletter"),
    @SerializedName("lumiere_bottom_nav") LUMIERE_BOTTOM_NAV("lumiere_bottom_nav"),

    // --- Luminous Page Components ---
    @SerializedName("luminous_section") LUMINOUS_SECTION("luminous_section"),
    @SerializedName("luminous_newsletter") LUMINOUS_NEWSLETTER("luminous_newsletter"),

    // --- Back to School 1 Components ---
    @SerializedName("back_to_school_header") BACK_TO_SCHOOL_HEADER("back_to_school_header"),
    @SerializedName("back_to_school_banner") BACK_TO_SCHOOL_BANNER("back_to_school_banner"),
    @SerializedName("back_to_school_categories") BACK_TO_SCHOOL_CATEGORIES("back_to_school_categories"),
    @SerializedName("back_to_school_grid") BACK_TO_SCHOOL_GRID("back_to_school_grid"),
    @SerializedName("back_to_school_footer") BACK_TO_SCHOOL_FOOTER("back_to_school_footer"),

    // --- Back to School 2 Components ---
    @SerializedName("school_two_header") SCHOOL_TWO_HEADER("school_two_header"),
    @SerializedName("school_two_banner") SCHOOL_TWO_BANNER("school_two_banner"),
    @SerializedName("school_two_categories") SCHOOL_TWO_CATEGORIES("school_two_categories"),
    @SerializedName("school_two_deals") SCHOOL_TWO_DEALS("school_two_deals"),
    @SerializedName("school_two_grid") SCHOOL_TWO_GRID("school_two_grid"),
    @SerializedName("school_two_footer") SCHOOL_TWO_FOOTER("school_two_footer"),

    // --- Back to School 3 Components ---
    @SerializedName("school_three_header") SCHOOL_THREE_HEADER("school_three_header"),
    @SerializedName("school_three_banner") SCHOOL_THREE_BANNER("school_three_banner"),
    @SerializedName("school_three_categories") SCHOOL_THREE_CATEGORIES("school_three_categories"),
    @SerializedName("school_three_essentials") SCHOOL_THREE_ESSENTIALS("school_three_essentials"),
    @SerializedName("school_three_grid") SCHOOL_THREE_GRID("school_three_grid"),
    @SerializedName("school_three_footer") SCHOOL_THREE_FOOTER("school_three_footer"),

    // --- Back to School 4 Components ---
    @SerializedName("school_four_header") SCHOOL_FOUR_HEADER("school_four_header"),
    @SerializedName("school_four_categories") SCHOOL_FOUR_CATEGORIES("school_four_categories"),
    @SerializedName("school_four_grid") SCHOOL_FOUR_GRID("school_four_grid"),
    @SerializedName("school_four_footer") SCHOOL_FOUR_FOOTER("school_four_footer"),

    // --- Back to School 5 Components ---
    @SerializedName("school_five_header") SCHOOL_FIVE_HEADER("school_five_header"),
    @SerializedName("school_five_categories") SCHOOL_FIVE_CATEGORIES("school_five_categories"),
    @SerializedName("school_five_grid") SCHOOL_FIVE_GRID("school_five_grid"),
    @SerializedName("school_five_footer") SCHOOL_FIVE_FOOTER("school_five_footer"),

    // --- Service Hub Components ---
    @SerializedName("service_header") SERVICE_HEADER("service_header"),
    @SerializedName("service_hero_section") SERVICE_HERO_SECTION("service_hero_section"),
    @SerializedName("service_category_section") SERVICE_CATEGORY_SECTION("service_category_section"),
    @SerializedName("service_bottom_nav") SERVICE_BOTTOM_NAV("service_bottom_nav"),

    // --- Shopping Page Components ---
    @SerializedName("brand_spotlight") BRAND_SPOTLIGHT("brand_spotlight"),
    @SerializedName("collection_grid") COLLECTION_GRID("collection_grid"),
    @SerializedName("featured_products") FEATURED_PRODUCTS("featured_products"),
    @SerializedName("seasonal_showcase") SEASONAL_SHOWCASE("seasonal_showcase"),

    // --- Banner Pages (Generic) ---
    @SerializedName("banner_page_header") BANNER_PAGE_HEADER("banner_page_header"),
    @SerializedName("banner_page_grid") BANNER_PAGE_GRID("banner_page_grid"),
    @SerializedName("banner_page_footer") BANNER_PAGE_FOOTER("banner_page_footer"),

    // --- Fashion Page ---
    @SerializedName("fashion_header") FASHION_HEADER("fashion_header"),
    @SerializedName("fashion_collections") FASHION_COLLECTIONS("fashion_collections"),
    @SerializedName("fashion_trending") FASHION_TRENDING("fashion_trending"),

    // --- Electronics Page ---
    @SerializedName("electronics_header") ELECTRONICS_HEADER("electronics_header"),
    @SerializedName("electronics_deals") ELECTRONICS_DEALS("electronics_deals"),
    @SerializedName("electronics_categories") ELECTRONICS_CATEGORIES("electronics_categories"),

    // --- Beauty Page (Old/Generic) ---
    @SerializedName("beauty_header") BEAUTY_HEADER("beauty_header"),
    @SerializedName("beauty_top_picks") BEAUTY_TOP_PICKS("beauty_top_picks"),
    @SerializedName("beauty_new_arrivals") BEAUTY_NEW_ARRIVALS("beauty_new_arrivals"),

    // --- Beauty Page (New/Specific) ---
    @SerializedName("beauty_premium_pick") BEAUTY_PREMIUM_PICK("beauty_premium_pick"),
    @SerializedName("beauty_luxe_lane") BEAUTY_LUXE_LANE("beauty_luxe_lane"),
    @SerializedName("beauty_editor_pick") BEAUTY_EDITOR_PICK("beauty_editor_pick"),
    @SerializedName("beauty_glam_top") BEAUTY_GLAM_TOP("beauty_glam_top"),
    @SerializedName("beauty_fragrance_luxe") BEAUTY_FRAGRANCE_LUXE("beauty_fragrance_luxe"),
    @SerializedName("beauty_makeup_mania") BEAUTY_MAKEUP_MANIA("beauty_makeup_mania"),
    @SerializedName("beauty_skin_care_sanctuary") BEAUTY_SKIN_CARE_SANCTUARY("beauty_skin_care_sanctuary"),
    @SerializedName("beauty_hair_care_haven") BEAUTY_HAIR_CARE_HAVEN("beauty_hair_care_haven"),
    @SerializedName("beauty_bath_body_bliss") BEAUTY_BATH_BODY_BLISS("beauty_bath_body_bliss"),
    @SerializedName("beauty_wellness_wonders") BEAUTY_WELLNESS_WONDERS("beauty_wellness_wonders"),
    @SerializedName("beauty_grooming_gurus") BEAUTY_GROOMING_GURUS("beauty_grooming_gurus"),
    @SerializedName("beauty_brands_we_love") BEAUTY_BRANDS_WE_LOVE("beauty_brands_we_love"),

    // --- Home & Kitchen ---
    @SerializedName("home_header") HOME_HEADER("home_header"),
    @SerializedName("home_decor") HOME_DECOR("home_decor"),
    @SerializedName("kitchen_essentials") KITCHEN_ESSENTIALS("kitchen_essentials"),

    // --- Sports & Fitness (Old/Generic) ---
    @SerializedName("sports_header") SPORTS_HEADER("sports_header"),
    @SerializedName("sports_gear") SPORTS_GEAR("sports_gear"),
    @SerializedName("fitness_equipment") FITNESS_EQUIPMENT("fitness_equipment"),

    // --- Toys & Baby ---
    @SerializedName("toys_header") TOYS_HEADER("toys_header"),
    @SerializedName("toys_trending") TOYS_TRENDING("toys_trending"),
    @SerializedName("baby_care") BABY_CARE("baby_care"),

    // --- Books & Stationery ---
    @SerializedName("books_header") BOOKS_HEADER("books_header"),
    @SerializedName("best_sellers") BEST_SELLERS("best_sellers"),
    @SerializedName("stationery_supplies") STATIONERY_SUPPLIES("stationery_supplies"),

    // --- Beauty & Perfume (Luminous) Components ---
    @SerializedName("luminous_header") LUMINOUS_HEADER("luminous_header"),
    @SerializedName("luminous_categories") LUMINOUS_CATEGORIES("luminous_categories"),
    @SerializedName("luminous_grid") LUMINOUS_GRID("luminous_grid"),
    @SerializedName("luminous_sale") LUMINOUS_SALE("luminous_sale"),
    @SerializedName("luminous_bottom_nav") LUMINOUS_BOTTOM_NAV("luminous_bottom_nav"),

    // --- Shoes Sales Components ---
    @SerializedName("shoes_sales_header") SHOES_SALES_HEADER("shoes_sales_header"),
    @SerializedName("shoes_sales_featured") SHOES_SALES_FEATURED("shoes_sales_featured"),
    @SerializedName("shoes_sales_grid") SHOES_SALES_GRID("shoes_sales_grid"),
    @SerializedName("text_block") TEXT_BLOCK("text_block"),
    @SerializedName("flash_sale_grid") FLASH_SALE_GRID("flash_sale_grid"),
    @SerializedName("featured_carousel") FEATURED_CAROUSEL("featured_carousel"),
    @SerializedName("best_quality") BEST_QUALITY("best_quality"),
    @SerializedName("grocery_listing") GROCERY_LISTING("grocery_listing"),
    @SerializedName("smart_basket") SMART_BASKET("smart_basket"),

    @SerializedName("grocery_top_picks") GROCERY_TOP_PICKS("grocery_top_picks"),
    @SerializedName("grocery_deals") GROCERY_DEALS("grocery_deals"),
    @SerializedName("grocery_promo_cards") GROCERY_PROMO_CARDS("grocery_promo_cards"),
    @SerializedName("grocery_events") GROCERY_EVENTS("grocery_events"),
    @SerializedName("grocery_shop_by_category") GROCERY_SHOP_BY_CATEGORY("grocery_shop_by_category"),
    @SerializedName("grocery_special_picks") GROCERY_SPECIAL_PICKS("grocery_special_picks"),
    @SerializedName("grocery_wholesale_text") GROCERY_WHOLESALE_TEXT("grocery_wholesale_text"),
    @SerializedName("spacer") SPACER("spacer"),
    
    // Fallback
    @SerializedName("unknown") UNKNOWN("unknown");
}
