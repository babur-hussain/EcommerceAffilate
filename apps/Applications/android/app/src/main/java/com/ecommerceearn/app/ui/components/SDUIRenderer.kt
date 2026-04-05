package com.ecommerceearn.app.ui.components

import android.graphics.Color as AndroidColor
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.model.Product
import com.ecommerceearn.app.data.model.SDUIComponent
import com.ecommerceearn.app.ui.components.RecentHistoryView
import com.ecommerceearn.app.ui.components.GroceryRowView
import com.ecommerceearn.app.ui.components.TrendingNearYouView
import com.ecommerceearn.app.ui.components.GrandKitchenSaleView
import com.ecommerceearn.app.ui.components.FiftyPercentOffZoneView
import com.ecommerceearn.app.ui.components.HeroBannerView
import com.ecommerceearn.app.ui.components.CuratedCollectionsView
import com.ecommerceearn.app.ui.components.LightningDealsView
import com.ecommerceearn.app.ui.components.ProductCardView
import com.ecommerceearn.app.ui.components.bannerPages.*

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

@Composable
fun SDUIRenderer(
    component: SDUIComponent,
    onProductClick: (Product) -> Unit = {}
) {
    when (component.rawType) {
        // Skip header_background — handled directly by HomeHeader gradient/lottie logic
        "header_background" -> { /* no-op */ }
        // Spacer from JSON: { "type":"spacer", "props": { "height": 330 } }
        "spacer" -> {
            val h = component.props?.get("height")?.asDouble ?: 16.0
            Spacer(modifier = Modifier.fillMaxWidth().height(h.dp))
        }
        // For You bento grid  
        "for_you_bento_grid" -> RenderForYouBentoGrid(component)
        "Container" -> RenderContainer(component, onProductClick)
        "Gradient" -> RenderGradient(component, onProductClick)
        "Text" -> RenderText(component)
        "Image" -> RenderImage(component)
        "hero_carousel" -> RenderHeroCarousel(component)
        "top_deals" -> com.ecommerceearn.app.ui.components.TopDealsView(component)
        "upcoming_launches" -> com.ecommerceearn.app.ui.components.UpcomingLaunchesView(component)
        "shop_by_price" -> com.ecommerceearn.app.ui.components.ShopByPriceView(component)
        "curated_collections" -> RenderCuratedCollections(component)
        "lightning_deals" -> RenderLightningDeals(component, onProductClick)
        "ProductGrid", "product_grid" -> RenderProductGrid(component, onProductClick)
        "recent_history" -> RecentHistoryView()
        "grocery_row" -> GroceryRowView()
        "smart_basket" -> SmartBasketComponent(component)
        "grocery_top_picks" -> GroceryTopPicksSection(component, onProductClick)
        "grocery_promo_cards" -> GroceryPromoCardsComponent(component)
        "grocery_shop_by_category" -> GroceryShopByCategoryComponent(component)
        "grocery_special_picks" -> GrocerySpecialPicksComponent(component)
        "grocery_wholesale_text" -> GroceryWholesaleTextComponent(component)
        "product_list_horizontal", "trending_near_you" -> TrendingNearYouView(onProductClick = onProductClick)
        "grand_kitchen" -> GrandKitchenSaleView()
        "fifty_percent_off" -> FiftyPercentOffZoneView()
        "fashion_forecast" -> RenderFashionForecast(component)
        "winter_collection" -> RenderWinterCollection(component)
        "promo_poster" -> RenderPromoPoster(component)
        "deals_of_the_day" -> RenderDealsOfTheDay(component)
        "budget_buys" -> RenderBudgetBuys(component)
        "sub_category_slider" -> RenderSubCategorySlider(component)
        "shopping_for_others_hub" -> RenderShoppingForOthersHub(component)
        "early_bird_deals" -> RenderEarlyBirdDeals(component)
        "sankranti_festival" -> RenderSankrantiFestival(component)
        "shoe_steal_fest" -> RenderShoeStealFest(component)
        "winter_clearance" -> RenderWinterClearance(component)
        "k_beauty", "beauty_k_beauty" -> RenderKBeauty(component)
        "trend_more", "beauty_trend_more" -> RenderTrendMore(component)
        "launch_party", "beauty_launch_party" -> RenderLaunchParty(component)
        "internet_famed", "beauty_internet_famed" -> RenderInternetFamed(component)
        "glam_budget", "beauty_glam_budget" -> RenderGlamBudget(component)
        "glow_for_harvest", "glow_harvest" -> RenderGlowForHarvest(component)
        "dermatologist_consultant", "free_dermatologist" -> RenderDermatologistConsultant(component)
        "globally_loved_alisters", "a_listers" -> RenderGloballyLovedAlisters(component)
        "internet_famed_brands" -> RenderInternetFamedBrands(component)
        "sport_savings", "savings" -> RenderSportSavings(component)
        "sport_support_goals", "support_goals" -> RenderSportSupportGoals(component)
        "sport_gym_accessories", "gym_accessories" -> RenderSportGymAccessories(component)
        "sport_combos", "combos" -> RenderSportCombos(component)
        "sport_cricket_season", "cricket_season" -> RenderSportCricketSeason(component)
        "sport_winner_brands", "winner_brands" -> RenderSportWinnerBrands(component)
        "sport_wishlist", "wishlist" -> RenderSportWishlist(component)
        "books_bestsellers", "bestsellers" -> RenderBooksBestsellers(component)
        "books_genre", "shop_by_genre" -> RenderBooksGenre(component)
        "books_authors", "featured_authors" -> RenderBooksAuthors(component)
        "books_deals", "book_deals" -> RenderBooksDeals(component)
        "books_new_arrivals", "new_arrivals" -> RenderBooksNewArrivals(component)
        "books_stationery", "stationery" -> RenderBooksStationery(component)
        "books_banner", "book_banner" -> RenderBooksBanner(component)
        "books_reading_lists", "reading_lists" -> RenderBooksReadingLists(component)
        "luminous_header" -> LuminousHeaderView(component)
        "luminous_grid" -> LuminousGridView(component)
        "luminous_categories" -> LuminousCategoriesView(component)
        "luminous_sale" -> LuminousSaleView(component)
        "bts_header", "back_to_school_header" -> BackToSchoolHeaderView(component)
        "bts_grid", "back_to_school_grid" -> BackToSchoolGridView(component)
        "bts_banner", "back_to_school_banner" -> BackToSchoolBannerView(component)
        "bts_categories", "back_to_school_categories" -> BackToSchoolCategoriesView(component)
        "bts_footer", "back_to_school_footer" -> BackToSchoolFooterView()
        "school_two_header" -> SchoolTwoHeaderView(component)
        "school_two_grid" -> SchoolTwoGridView(component)
        "school_two_banner" -> SchoolTwoBannerView(component)
        "school_two_categories" -> SchoolTwoCategoriesView(component)
        "school_two_deals" -> SchoolTwoDealsView(component)
        "school_two_footer" -> SchoolTwoFooterView()
        "school_three_header" -> SchoolThreeHeaderView(component)
        "school_three_grid" -> SchoolThreeGridView(component)
        "school_three_banner" -> SchoolThreeBannerView(component)
        "school_three_categories" -> SchoolThreeCategoriesView(component)
        "school_three_essentials" -> SchoolThreeEssentialsView(component)
        "school_three_footer" -> SchoolThreeFooterView()
        "school_four_header" -> SchoolFourHeaderView(component)
        "school_four_grid" -> SchoolFourGridView(component)
        "school_four_categories" -> SchoolFourCategoriesView(component)
        "school_four_footer" -> SchoolFourFooterView()
        "school_five_header" -> SchoolFiveHeaderView(component)
        "school_five_grid" -> SchoolFiveGridView(component)
        "school_five_categories" -> SchoolFiveCategoriesView(component)
        "school_five_footer" -> SchoolFiveFooterView()
        "lumiere_header", "percent_off_header" -> LumiereHeaderView(component)
        "lumiere_section", "percent_off_section" -> LumiereSectionView(component)
        "lumiere_newsletter", "percent_off_newsletter" -> LumiereNewsletterView(component)
        "lumiere_bottom_nav", "percent_off_nav" -> LumiereBottomNavView()
        "powered_by_row" -> com.ecommerceearn.app.ui.components.PoweredByRowSDUI(component)
        "spoil_yourself_title" -> com.ecommerceearn.app.ui.components.SpoilYourselfTitleSDUI(component)
        "beautiful_image_slider" -> RenderBeautifulImageSlider(component)
        "eid_celebration_deals" -> RenderEidCelebrationDeals(component)
        "consultation_banner" -> RenderConsultationBanner(component)
        "furniture_deal_of_day" -> RenderFurnitureDealOfDay(component)
        "furniture_top_brands" -> RenderFurnitureTopBrands(component)
        "furniture_sponsorship_banner" -> RenderFurnitureSponsorshipBanner(component)
        "furniture_grab_or_gone" -> RenderFurnitureGrabOrGone(component)
        "furniture_shop_by_room" -> RenderFurnitureShopByRoom(component)
        "furniture_samarth_store" -> RenderFurnitureSamarthStore(component)
        "furniture_emi_offers" -> RenderFurnitureEmiOffers(component)
        "furniture_top_furniture_brands" -> RenderFurnitureTopFurnitureBrands(component)
        "furniture_shop_by_material" -> RenderFurnitureShopByMaterial(component)
        "furniture_trending_now" -> RenderFurnitureTrendingNow(component)
        "furniture_wishlist" -> RenderFurnitureWishlist(component)
        "furniture_customer_reviews" -> RenderFurnitureCustomerReviews(component)
        "furniture_everybody_list" -> RenderFurnitureEverybodyList(component)
        "furniture_rare_finds" -> RenderFurnitureRareFinds(component)
        "furniture_statement_pieces" -> RenderFurnitureStatementPieces(component)
        else -> {
            if (component.children?.isNotEmpty() == true) {
                RenderContainer(component, onProductClick)
            } else {
                RenderNotAvailable(component.rawType ?: component.type.name, component)
            }
        }
    }
}

@Composable
fun RenderNotAvailable(type: String, component: SDUIComponent? = null) {
    val title = component?.props?.get("title") as? String
    val name = component?.props?.get("name") as? String
    val displayName = title ?: name ?: type
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .background(Color(0xFFFEF3C7), RoundedCornerShape(12.dp))
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "📦 $displayName",
                color = Color(0xFF92400E),
                fontSize = 16.sp,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
            )
            Text(
                text = "Component: $type",
                color = Color(0xFFB45309),
                fontSize = 12.sp
            )
        }
    }
}

@Composable
fun RenderContainer(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    val style = component.style
    val paddingHorizontal = style.getDouble("paddingHorizontal") ?: 0.0
    val paddingVertical = style.getDouble("paddingVertical") ?: 0.0
    val marginBottom = style.getDouble("marginBottom") ?: 0.0
    val backgroundColorHex = style.getString("backgroundColor")
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = marginBottom.dp)
            .background(if (backgroundColorHex != null) safeParseColor(backgroundColorHex) else Color.Transparent)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    start = paddingHorizontal.dp,
                    end = paddingHorizontal.dp,
                    top = paddingVertical.dp,
                    bottom = paddingVertical.dp
                )
        ) {
            component.children?.forEach { child ->
                SDUIRenderer(child, onProductClick)
            }
        }
    }
}

@Composable
fun RenderGradient(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    val props = component.props
    val style = component.style
    val colors = props.getStringList("colors")
    val marginBottom = style.getDouble("marginBottom") ?: 0.0
    val paddingVertical = style.getDouble("paddingVertical") ?: 0.0

    val brush = if (colors.isNotEmpty()) {
        Brush.linearGradient(
            colors = colors.map { safeParseColor(it) }
        )
    } else {
        Brush.linearGradient(listOf(Color.White, Color.White))
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = marginBottom.dp)
            .background(brush)
            .padding(vertical = paddingVertical.dp)
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            component.children?.forEach { child ->
                SDUIRenderer(child, onProductClick)
            }
        }
    }
}

@Composable
fun RenderImage(component: SDUIComponent) {
    val props = component.props
    val style = component.style
    val source = props.getString("source") ?: ""

    // Style props
    val width = style.getDouble("width") ?: 100.0
    val height = style.getDouble("height") ?: 100.0
    val position = style.getString("position")
    val top = style.getDouble("top") ?: 0.0
    val right = style.getDouble("right") ?: 0.0
    val opacity = style.getDouble("opacity") ?: 1.0
    val tintColor = style.getString("tintColor")

    // Transforms – fallback to 0 rotation if no transform array
    val rotateDeg = style.getObj("transform")?.getString("rotate")
        ?.replace("deg", "")?.toFloatOrNull() ?: 0f

    val baseModifier = Modifier
        .width(width.dp)
        .height(height.dp)
        .alpha(opacity.toFloat())
        .rotate(rotateDeg)

    if (position == "absolute") {
        // Wrap in Box to provide BoxScope for alignment
        // This assumes the parent allows this Box to expand or be placed freely.
        // For the "Lightning Deals" use case (inside a Gradient Box), this works perfectly.
        Box(modifier = Modifier.fillMaxWidth()) {
            AsyncImage(
                model = source,
                contentDescription = null,
                modifier = baseModifier
                    .align(Alignment.TopEnd)
                    .offset(x = right.dp, y = top.dp),
                contentScale = ContentScale.Fit,
                colorFilter = if (tintColor != null) ColorFilter.tint(safeParseColor(tintColor)) else null
            )
        }
    } else {
        AsyncImage(
            model = source,
            contentDescription = null,
            modifier = baseModifier,
            contentScale = ContentScale.Fit,
            colorFilter = if (tintColor != null) ColorFilter.tint(safeParseColor(tintColor)) else null
        )
    }
}

@Composable
fun RenderText(component: SDUIComponent) {
    val props = component.props
    val style = component.style
    val text = props.getString("text") ?: ""
    val fontSize = style.getDouble("fontSize") ?: 14.0
    val fontWeightString = style.getString("fontWeight")
    val fontWeight = when(fontWeightString) {
        "bold", "800", "700", "600" -> FontWeight.Bold
        "500", "medium" -> FontWeight.Medium
        else -> FontWeight.Normal
    }
    val color = style.getString("color") ?: "#000000"
    val marginBottom = style.getDouble("marginBottom") ?: 0.0
    val paddingHorizontal = style.getDouble("paddingHorizontal") ?: 0.0

    Text(
        text = text,
        fontSize = fontSize.sp,
        fontWeight = fontWeight,
        color = safeParseColor(color),
        modifier = Modifier
            .padding(bottom = marginBottom.dp)
            .padding(horizontal = paddingHorizontal.dp)
    )
}

@Composable
fun RenderHeroCarousel(component: SDUIComponent) {
    val content = component.props
    val bannersArr = content?.getArray("banners") ?: content?.getArray("content")
    val banners: List<Map<String, String>> = if (bannersArr != null) {
        bannersArr.mapNotNull { el ->
            if (el.isJsonObject) {
                val obj = el.asJsonObject
                val map = mutableMapOf<String, String>()
                obj.keySet().forEach { k -> obj.getString(k)?.let { map[k] = it } }
                map as Map<String, String>
            } else null
        }
    } else emptyList()

    HeroBannerView(banners)
}

@Composable
fun RenderCuratedCollections(component: SDUIComponent) {
    val collectionsArr = component.props?.getArray("collections")
    val collections: List<Map<String, Any>> = if (collectionsArr != null) {
        collectionsArr.mapNotNull { el ->
            if (el.isJsonObject) {
                val obj = el.asJsonObject
                val map = mutableMapOf<String, Any>()
                obj.keySet().forEach { k -> obj.get(k)?.takeIf { !it.isJsonNull }?.let { map[k] = it } }
                map as Map<String, Any>
            } else null
        }
    } else emptyList()
    CuratedCollectionsView(collections)
}

@Composable
fun RenderLightningDeals(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Lightning deals"
    val subtitle = props.getString("subtitle") ?: ""
    val products = parseProducts(props.getArray("products"))

    LightningDealsView(title, subtitle, products, onProductClick)
}

@Composable
fun RenderProductGrid(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    val props = component.props
    val cardStyle = props.getString("cardStyle") ?: "vertical"
    val products = parseProducts(props?.getArray("products"))

    if (products.isEmpty()) return

    if (cardStyle == "horizontal" || cardStyle == "lightning") {
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Max)
        ) {
            items(products) { product ->
                ProductCardView(
                    product = product,
                    modifier = Modifier.width(160.dp),
                    onClick = { onProductClick(product) }
                )
            }
        }
    } else {
        val columns = 2
        val rows = (products.size + columns - 1) / columns
        
        Column(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            for (i in 0 until rows) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    for (j in 0 until columns) {
                        val index = i * columns + j
                        if (index < products.size) {
                             ProductCardView(
                                 product = products[index],
                                 modifier = Modifier.weight(1f),
                                 onClick = { onProductClick(products[index]) }
                             )
                        } else {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

// Helpers
fun parseProducts(data: com.google.gson.JsonElement?): List<Product> {
    if (data == null || data.isJsonNull) return emptyList()
    return try {
        val gson = Gson()
        val type = object : TypeToken<List<Product>>() {}.type
        gson.fromJson(data, type)
    } catch (e: Exception) {
        emptyList()
    }
}



@Composable
fun RenderFashionForecast(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "FASHION FORECAST"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<FashionForecastItem>(props.getArray("items"))
    
    FashionForecastView(title, headerActionUrl, items)
}

@Composable
fun RenderWinterCollection(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Winter collection"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<WinterCollectionItem>(props.getArray("items"))
    
    WinterCollectionView(title, headerActionUrl, items)
}

@Composable
fun RenderPromoPoster(component: SDUIComponent) {
    val props = component.props ?: return
    val image = props.getString("image") ?: ""
    val actionUrl = props.getString("actionUrl")
    
    PromoPosterView(image, actionUrl)
}

@Composable
fun RenderDealsOfTheDay(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Deals of the Day"
    val subtitle = props.getString("subtitle") ?: "Clock is ticking!"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<DealItem>(props.getArray("items"))

    DealsOfTheDayView(title, subtitle, headerActionUrl, items)
}

@Composable
fun RenderBudgetBuys(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Budget Buys"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<BudgetItem>(props.getArray("items"))

    BudgetBuysView(title, headerActionUrl, items)
}

inline fun <reified T> parseItems(data: com.google.gson.JsonElement?): List<T> {
    if (data == null || data.isJsonNull) return emptyList()
    return try {
        val gson = Gson()
        val type = object : TypeToken<List<T>>() {}.type
        gson.fromJson(data, type)
    } catch (e: Exception) {
        e.printStackTrace()
        emptyList()
    }
}

// ============= New Component Renderers =============

@Composable
fun RenderSubCategorySlider(component: SDUIComponent) {
    val props = component.props ?: return
    val parentCategoryId = props.getString("parentCategoryId") ?: return
    SubCategorySliderView(parentCategoryId = parentCategoryId)
}

@Composable
fun RenderShoppingForOthersHub(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Shopping for others?"
    val subtitle = props.getString("subtitle") ?: "Choose a category to start exploring"
    val items = parseItems<ShoppingForOthersCategoryItem>(props.getArray("items"))
    ShoppingForOthersHubView(title, subtitle, items)
}

@Composable
fun RenderEarlyBirdDeals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Early Bird Deals!"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<EarlyBirdDealItem>(props.getArray("items"))
    EarlyBirdDealsView(title, headerActionUrl, items)
}

@Composable
fun RenderSankrantiFestival(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Shine bright this Sankranti"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<SankrantiFestiveItem>(props.getArray("items"))
    SankrantiFestivalView(title, headerActionUrl, items)
}

@Composable
fun RenderShoeStealFest(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Shoe's Steal Fest"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<ShoeStealItem>(props.getArray("items"))
    ShoeStealFestView(title, headerActionUrl, items)
}

@Composable
fun RenderWinterClearance(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Winter Clearance Sale"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<WinterClearanceItem>(props.getArray("items"))
    WinterClearanceSaleView(title, headerActionUrl, items)
}

// ============= Beauty Component Renderers =============

@Composable
fun RenderKBeauty(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "K-Beauty"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<KBeautyItem>(props.getArray("items"))
    KBeautyView(title, headerActionUrl, items)
}

@Composable
fun RenderTrendMore(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Trend More"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<TrendMoreItem>(props.getArray("items"))
    BeautyTrendMoreView(title, headerActionUrl, items)
}

@Composable
fun RenderLaunchParty(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "New Launches"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<LaunchPartyItem>(props.getArray("items"))
    BeautyLaunchPartyView(title, headerActionUrl, items)
}

@Composable
fun RenderInternetFamed(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Internet Famed"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<InternetFamedItem>(props.getArray("items"))
    BeautyInternetFamedView(title, headerActionUrl, items)
}

@Composable
fun RenderGlamBudget(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Glam on a Budget"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<GlamBudgetItem>(props.getArray("items"))
    BeautyGlamBudgetView(title, headerActionUrl, items)
}

@Composable
fun RenderGlowForHarvest(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Glow for the harvest"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<HarvestItem>(props.getArray("items"))
    GlowForHarvestView(title, headerActionUrl, items)
}

@Composable
fun RenderDermatologistConsultant(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Free dermatologist's consultant"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<ConsultantBannerItem>(props.getArray("items"))
    DermatologistConsultantView(title, headerActionUrl, items)
}

@Composable
fun RenderGloballyLovedAlisters(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Globally loved A-listers"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<AlisterItem>(props.getArray("items"))
    GloballyLovedAlistersView(title, headerActionUrl, items)
}

@Composable
fun RenderInternetFamedBrands(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Internet-famed brands"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<InternetBrandItem>(props.getArray("items"))
    InternetFamedBrandsView(title, headerActionUrl, items)
}

// ============= Sports Render Functions =============

@Composable
fun RenderSportSavings(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Sport Savings"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<SavingsItem>(props.getArray("items"))
    SportSavingsView(title, headerActionUrl, items)
}

@Composable
fun RenderSportSupportGoals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Support Your Goals"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<GoalItem>(props.getArray("items"))
    SportSupportGoalsView(title, headerActionUrl, items)
}

@Composable
fun RenderSportGymAccessories(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Gym Accessories"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<AccessoryItem>(props.getArray("items"))
    SportGymAccessoriesView(title, headerActionUrl, items)
}

@Composable
fun RenderSportCombos(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Value Combos"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<ComboItem>(props.getArray("items"))
    SportCombosView(title, headerActionUrl, items)
}

@Composable
fun RenderSportCricketSeason(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Cricket Season"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<CricketItem>(props.getArray("items"))
    SportCricketSeasonView(title, headerActionUrl, items)
}

@Composable
fun RenderSportWinnerBrands(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Winner Brands"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<WinnerBrandItem>(props.getArray("items"))
    SportWinnerBrandsView(title, headerActionUrl, items)
}

@Composable
fun RenderSportWishlist(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Add to your wishlist"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<WishlistItem>(props.getArray("items"))
    SportWishlistView(title, headerActionUrl, items)
}

// ============= Books Render Functions =============

@Composable
fun RenderBooksBestsellers(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Bestsellers"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<BestsellerItem>(props.getArray("items"))
    BooksBestsellersView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksGenre(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Shop by Genre"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<GenreItem>(props.getArray("items"))
    BooksGenreView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksAuthors(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Featured Authors"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<AuthorItem>(props.getArray("items"))
    BooksAuthorsView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksDeals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Book Deals"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<BookDealItem>(props.getArray("items"))
    BooksDealsView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksNewArrivals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "New Arrivals"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<NewArrivalItem>(props.getArray("items"))
    BooksNewArrivalsView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksStationery(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Stationery & Supplies"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<StationeryItem>(props.getArray("items"))
    BooksStationeryView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksBanner(component: SDUIComponent) {
    val props = component.props ?: return
    val items = parseItems<BookBannerItem>(props.getArray("items"))
    BooksBannerView(items)
}

@Composable
fun RenderBooksReadingLists(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title") ?: "Curated Reading Lists"
    val headerActionUrl = props.getString("headerActionUrl")
    val items = parseItems<ReadingListItem>(props.getArray("items"))
    BooksReadingListsView(title, headerActionUrl, items)
}

// ============= For You Bento Grid =============

@Composable
fun RenderForYouBentoGrid(component: SDUIComponent) {
    com.ecommerceearn.app.ui.pages.ForYouBentoGridSDUI(component)
}

// ============= Festive & Seasonal =============

@Composable
fun RenderBeautifulImageSlider(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title")
    // Support either "items" or "banners" based on iOS logic
    val bannersArray = props.getArray("items") ?: props.getArray("banners")
    val banners = parseItems<BeautifulBannerData>(bannersArray)
    BeautifulImageSliderView(title, banners)
}

@Composable
fun RenderEidCelebrationDeals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props.getString("title")
    val backgroundImage = props.getString("backgroundImage")
    val lanternsImage = props.getString("lanternsImage")
    val items = parseItems<EidDealItem>(props.getArray("items"))
    EidCelebrationDealsView(title, backgroundImage, lanternsImage, items)
}

@Composable
fun RenderConsultationBanner(component: SDUIComponent) {
    val props = component.props ?: return
    val actionUrl = props.getString("actionUrl")
    val title = props.getString("title") ?: ""
    val callText = props.getString("callText") ?: ""
    val phoneNumber = props.getString("phoneNumber") ?: ""
    val poweredByText = props.getString("poweredByText") ?: ""
    val providerName = props.getString("providerName") ?: ""
    val doctorImage = props.getString("doctorImage") ?: ""

    ConsultationBannerView(
        actionUrl = actionUrl,
        title = title,
        callText = callText,
        phoneNumber = phoneNumber,
        poweredByText = poweredByText,
        providerName = providerName,
        doctorImage = doctorImage
    )
}

@Composable
fun RenderFurnitureDealOfDay(component: SDUIComponent) {
    FurnitureDealOfDayView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureDealItem::class.java)
    )
}

@Composable
fun RenderFurnitureTopBrands(component: SDUIComponent) {
    FurnitureTopBrandsView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FBrandItem::class.java)
    )
}

@Composable
fun RenderFurnitureSponsorshipBanner(component: SDUIComponent) {
    FurnitureSponsorshipBannerView(
        items = component.decodeItems("items", FurnitureBannerItem::class.java)
    )
}

@Composable
fun RenderFurnitureGrabOrGone(component: SDUIComponent) {
    FurnitureGrabOrGoneView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureGrabItem::class.java)
    )
}

@Composable
fun RenderFurnitureShopByRoom(component: SDUIComponent) {
    FurnitureShopByRoomView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureRoomItem::class.java)
    )
}

@Composable
fun RenderFurnitureSamarthStore(component: SDUIComponent) {
    FurnitureSamarthStoreView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureBannerItem::class.java)
    )
}

@Composable
fun RenderFurnitureEmiOffers(component: SDUIComponent) {
    FurnitureEmiOffersView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureEmiItem::class.java)
    )
}

@Composable
fun RenderFurnitureTopFurnitureBrands(component: SDUIComponent) {
    FurnitureTopFurnitureBrandsView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FBrandGridItem::class.java)
    )
}

@Composable
fun RenderFurnitureShopByMaterial(component: SDUIComponent) {
    FurnitureShopByMaterialView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureMaterialItem::class.java)
    )
}

@Composable
fun RenderFurnitureTrendingNow(component: SDUIComponent) {
    FurnitureTrendingNowView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureTrendingItem::class.java)
    )
}

@Composable
fun RenderFurnitureWishlist(component: SDUIComponent) {
    FurnitureWishlistView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        items = component.decodeItems("items", FurnitureWishlistItem::class.java)
    )
}

@Composable
fun RenderFurnitureCustomerReviews(component: SDUIComponent) {
    FurnitureCustomerReviewsView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureReviewItem::class.java)
    )
}

@Composable
fun RenderFurnitureEverybodyList(component: SDUIComponent) {
    FurnitureEverybodyListView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        items = component.decodeItems("items", FurnitureEverybodyItem::class.java)
    )
}

@Composable
fun RenderFurnitureRareFinds(component: SDUIComponent) {
    FurnitureRareFindsView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureRareFindItem::class.java)
    )
}

@Composable
fun RenderFurnitureStatementPieces(component: SDUIComponent) {
    FurnitureStatementPiecesView(
        title = component.props?.get("title")?.let { if (!it.isJsonNull) it.asString else "" } ?: "",
        headerActionUrl = component.props?.get("headerActionUrl")?.let { if (!it.isJsonNull) it.asString else null },
        items = component.decodeItems("items", FurnitureStatementPieceItem::class.java)
    )
}
