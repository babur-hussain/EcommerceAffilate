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
    when (component.type) {
        "Container" -> RenderContainer(component, onProductClick)
        "Gradient" -> RenderGradient(component, onProductClick)
        "Text" -> RenderText(component)
        "Image" -> RenderImage(component)
        "hero_carousel" -> RenderHeroCarousel(component)
        "curated_collections" -> RenderCuratedCollections(component)
        "lightning_deals" -> RenderLightningDeals(component, onProductClick)
        "ProductGrid", "product_grid" -> RenderProductGrid(component, onProductClick)
        "recent_history" -> RecentHistoryView()
        "grocery_row" -> GroceryRowView()
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
        // Beauty Page Components
        "k_beauty", "beauty_k_beauty" -> RenderKBeauty(component)
        "trend_more", "beauty_trend_more" -> RenderTrendMore(component)
        "launch_party", "beauty_launch_party" -> RenderLaunchParty(component)
        "internet_famed", "beauty_internet_famed" -> RenderInternetFamed(component)
        "glam_budget", "beauty_glam_budget" -> RenderGlamBudget(component)
        "glow_for_harvest", "glow_harvest" -> RenderGlowForHarvest(component)
        "dermatologist_consultant", "free_dermatologist" -> RenderDermatologistConsultant(component)
        "globally_loved_alisters", "a_listers" -> RenderGloballyLovedAlisters(component)
        "internet_famed_brands" -> RenderInternetFamedBrands(component)
        // Sports Page Components
        "sport_savings", "savings" -> RenderSportSavings(component)
        "sport_support_goals", "support_goals" -> RenderSportSupportGoals(component)
        "sport_gym_accessories", "gym_accessories" -> RenderSportGymAccessories(component)
        "sport_combos", "combos" -> RenderSportCombos(component)
        "sport_cricket_season", "cricket_season" -> RenderSportCricketSeason(component)
        "sport_winner_brands", "winner_brands" -> RenderSportWinnerBrands(component)
        "sport_wishlist", "wishlist" -> RenderSportWishlist(component)
        // Books Page Components
        "books_bestsellers", "bestsellers" -> RenderBooksBestsellers(component)
        "books_genre", "shop_by_genre" -> RenderBooksGenre(component)
        "books_authors", "featured_authors" -> RenderBooksAuthors(component)
        "books_deals", "book_deals" -> RenderBooksDeals(component)
        "books_new_arrivals", "new_arrivals" -> RenderBooksNewArrivals(component)
        "books_stationery", "stationery" -> RenderBooksStationery(component)
        "books_banner", "book_banner" -> RenderBooksBanner(component)
        "books_reading_lists", "reading_lists" -> RenderBooksReadingLists(component)
        // Luminous Banner Page Components
        "luminous_header" -> LuminousHeaderView(component)
        "luminous_grid" -> LuminousGridView(component)
        "luminous_categories" -> LuminousCategoriesView(component)
        "luminous_sale" -> LuminousSaleView(component)
        // BackToSchool1 Components
        "bts_header", "back_to_school_header" -> BackToSchoolHeaderView(component)
        "bts_grid", "back_to_school_grid" -> BackToSchoolGridView(component)
        "bts_banner", "back_to_school_banner" -> BackToSchoolBannerView(component)
        "bts_categories", "back_to_school_categories" -> BackToSchoolCategoriesView(component)
        "bts_footer", "back_to_school_footer" -> BackToSchoolFooterView()
        // SchoolTwo Components
        "school_two_header" -> SchoolTwoHeaderView(component)
        "school_two_grid" -> SchoolTwoGridView(component)
        "school_two_banner" -> SchoolTwoBannerView(component)
        "school_two_categories" -> SchoolTwoCategoriesView(component)
        "school_two_deals" -> SchoolTwoDealsView(component)
        "school_two_footer" -> SchoolTwoFooterView()
        // SchoolThree Components
        "school_three_header" -> SchoolThreeHeaderView(component)
        "school_three_grid" -> SchoolThreeGridView(component)
        "school_three_banner" -> SchoolThreeBannerView(component)
        "school_three_categories" -> SchoolThreeCategoriesView(component)
        "school_three_essentials" -> SchoolThreeEssentialsView(component)
        "school_three_footer" -> SchoolThreeFooterView()
        // SchoolFour Components
        "school_four_header" -> SchoolFourHeaderView(component)
        "school_four_grid" -> SchoolFourGridView(component)
        "school_four_categories" -> SchoolFourCategoriesView(component)
        "school_four_footer" -> SchoolFourFooterView()
        // SchoolFive Components
        "school_five_header" -> SchoolFiveHeaderView(component)
        "school_five_grid" -> SchoolFiveGridView(component)
        "school_five_categories" -> SchoolFiveCategoriesView(component)
        "school_five_footer" -> SchoolFiveFooterView()
        // Lumiere/PercentOff Components
        "lumiere_header", "percent_off_header" -> LumiereHeaderView(component)
        "lumiere_section", "percent_off_section" -> LumiereSectionView(component)
        "lumiere_newsletter", "percent_off_newsletter" -> LumiereNewsletterView(component)
        "lumiere_bottom_nav", "percent_off_nav" -> LumiereBottomNavView()
        else -> {
            if (component.children?.isNotEmpty() == true) {
                 RenderContainer(component, onProductClick)
            } else {
                RenderNotAvailable(component.type, component)
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
    val paddingHorizontal = (style?.get("paddingHorizontal") as? Number)?.toDouble() ?: 0.0
    val paddingVertical = (style?.get("paddingVertical") as? Number)?.toDouble() ?: 0.0
    val marginBottom = (style?.get("marginBottom") as? Number)?.toDouble() ?: 0.0
    val backgroundColorHex = style?.get("backgroundColor") as? String
    
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
    val colors = (props?.get("colors") as? List<*>)?.mapNotNull { it as? String } ?: emptyList()
    val marginBottom = (style?.get("marginBottom") as? Number)?.toDouble() ?: 0.0
    val paddingVertical = (style?.get("paddingVertical") as? Number)?.toDouble() ?: 0.0

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
    val source = props?.get("source") as? String ?: ""
    
    // Style props
    val width = (style?.get("width") as? Number)?.toDouble() ?: 100.0
    val height = (style?.get("height") as? Number)?.toDouble() ?: 100.0
    val position = style?.get("position") as? String
    val top = (style?.get("top") as? Number)?.toDouble() ?: 0.0
    val right = (style?.get("right") as? Number)?.toDouble() ?: 0.0
    val opacity = (style?.get("opacity") as? Number)?.toDouble() ?: 1.0
    val tintColor = style?.get("tintColor") as? String
    
    // Transforms
    val transform = style?.get("transform") as? List<*>
    val rotateMap = transform?.firstOrNull() as? Map<String, String>
    val rotateDeg = rotateMap?.get("rotate")?.replace("deg", "")?.toFloatOrNull() ?: 0f

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
    val text = props?.get("text") as? String ?: ""
    val fontSize = (style?.get("fontSize") as? Number)?.toDouble() ?: 14.0
    val fontWeightString = style?.get("fontWeight") as? String
    val fontWeight = when(fontWeightString) {
        "bold", "800", "700", "600" -> FontWeight.Bold
        "500", "medium" -> FontWeight.Medium
        else -> FontWeight.Normal
    }
    val color = style?.get("color") as? String ?: "#000000"
    val marginBottom = (style?.get("marginBottom") as? Number)?.toDouble() ?: 0.0
    val paddingHorizontal = (style?.get("paddingHorizontal") as? Number)?.toDouble() ?: 0.0

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
    // Prefer explicitly mapped content, fallback to props
    val contentMap = component.content ?: component.props ?: emptyMap()
    val bannersRaw = (contentMap["banners"] ?: contentMap["content"]) as? List<*>
    val banners = bannersRaw?.mapNotNull { it as? Map<String, String> } ?: emptyList()

    HeroBannerView(banners)
}

@Composable
fun RenderCuratedCollections(component: SDUIComponent) {
    val collectionsRaw = component.props?.get("collections") as? List<*>
    val collections = collectionsRaw?.mapNotNull { it as? Map<String, Any> } ?: emptyList()

    CuratedCollectionsView(collections)
}

@Composable
fun RenderLightningDeals(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Lightning deals"
    val subtitle = props["subtitle"] as? String ?: ""
    val products = parseProducts(props["products"])

    LightningDealsView(title, subtitle, products, onProductClick)
}

@Composable
fun RenderProductGrid(component: SDUIComponent, onProductClick: (Product) -> Unit = {}) {
    val props = component.props ?: emptyMap()
    val cardStyle = props["cardStyle"] as? String ?: "vertical"
    val products = parseProducts(props["products"])

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
fun parseProducts(data: Any?): List<Product> {
    if (data == null) return emptyList()
    return try {
        val gson = Gson()
        val json = gson.toJson(data)
        val type = object : TypeToken<List<Product>>() {}.type
        gson.fromJson(json, type)
    } catch (e: Exception) {
        emptyList()
    }
}



@Composable
fun RenderFashionForecast(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "FASHION FORECAST"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<FashionForecastItem>(props["items"])
    
    FashionForecastView(title, headerActionUrl, items)
}

@Composable
fun RenderWinterCollection(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Winter collection"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<WinterCollectionItem>(props["items"])
    
    WinterCollectionView(title, headerActionUrl, items)
}

@Composable
fun RenderPromoPoster(component: SDUIComponent) {
    val props = component.props ?: return
    val image = props["image"] as? String ?: ""
    val actionUrl = props["actionUrl"] as? String
    
    PromoPosterView(image, actionUrl)
}

@Composable
fun RenderDealsOfTheDay(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Deals of the Day"
    val subtitle = props["subtitle"] as? String ?: "Clock is ticking!"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<DealItem>(props["items"])

    DealsOfTheDayView(title, subtitle, headerActionUrl, items)
}

@Composable
fun RenderBudgetBuys(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Budget Buys"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<BudgetItem>(props["items"])

    BudgetBuysView(title, headerActionUrl, items)
}

inline fun <reified T> parseItems(data: Any?): List<T> {
    if (data == null) return emptyList()
    return try {
        val gson = Gson()
        val json = gson.toJson(data)
        val type = object : TypeToken<List<T>>() {}.type
        gson.fromJson(json, type)
    } catch (e: Exception) {
        e.printStackTrace()
        emptyList()
    }
}

// ============= New Component Renderers =============

@Composable
fun RenderSubCategorySlider(component: SDUIComponent) {
    val props = component.props ?: return
    val parentCategoryId = props["parentCategoryId"] as? String ?: return
    SubCategorySliderView(parentCategoryId = parentCategoryId)
}

@Composable
fun RenderShoppingForOthersHub(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Shopping for others?"
    val subtitle = props["subtitle"] as? String ?: "Choose a category to start exploring"
    val items = parseItems<ShoppingForOthersCategoryItem>(props["items"])
    ShoppingForOthersHubView(title, subtitle, items)
}

@Composable
fun RenderEarlyBirdDeals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Early Bird Deals!"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<EarlyBirdDealItem>(props["items"])
    EarlyBirdDealsView(title, headerActionUrl, items)
}

@Composable
fun RenderSankrantiFestival(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Shine bright this Sankranti"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<SankrantiFestiveItem>(props["items"])
    SankrantiFestivalView(title, headerActionUrl, items)
}

@Composable
fun RenderShoeStealFest(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Shoe's Steal Fest"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<ShoeStealItem>(props["items"])
    ShoeStealFestView(title, headerActionUrl, items)
}

@Composable
fun RenderWinterClearance(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Winter Clearance Sale"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<WinterClearanceItem>(props["items"])
    WinterClearanceSaleView(title, headerActionUrl, items)
}

// ============= Beauty Component Renderers =============

@Composable
fun RenderKBeauty(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "K-Beauty"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<KBeautyItem>(props["items"])
    KBeautyView(title, headerActionUrl, items)
}

@Composable
fun RenderTrendMore(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Trend More"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<TrendMoreItem>(props["items"])
    BeautyTrendMoreView(title, headerActionUrl, items)
}

@Composable
fun RenderLaunchParty(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "New Launches"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<LaunchPartyItem>(props["items"])
    BeautyLaunchPartyView(title, headerActionUrl, items)
}

@Composable
fun RenderInternetFamed(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Internet Famed"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<InternetFamedItem>(props["items"])
    BeautyInternetFamedView(title, headerActionUrl, items)
}

@Composable
fun RenderGlamBudget(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Glam on a Budget"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<GlamBudgetItem>(props["items"])
    BeautyGlamBudgetView(title, headerActionUrl, items)
}

@Composable
fun RenderGlowForHarvest(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Glow for the harvest"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<HarvestItem>(props["items"])
    GlowForHarvestView(title, headerActionUrl, items)
}

@Composable
fun RenderDermatologistConsultant(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Free dermatologist's consultant"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<ConsultantBannerItem>(props["items"])
    DermatologistConsultantView(title, headerActionUrl, items)
}

@Composable
fun RenderGloballyLovedAlisters(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Globally loved A-listers"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<AlisterItem>(props["items"])
    GloballyLovedAlistersView(title, headerActionUrl, items)
}

@Composable
fun RenderInternetFamedBrands(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Internet-famed brands"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<InternetBrandItem>(props["items"])
    InternetFamedBrandsView(title, headerActionUrl, items)
}

// ============= Sports Render Functions =============

@Composable
fun RenderSportSavings(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Sport Savings"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<SavingsItem>(props["items"])
    SportSavingsView(title, headerActionUrl, items)
}

@Composable
fun RenderSportSupportGoals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Support Your Goals"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<GoalItem>(props["items"])
    SportSupportGoalsView(title, headerActionUrl, items)
}

@Composable
fun RenderSportGymAccessories(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Gym Accessories"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<AccessoryItem>(props["items"])
    SportGymAccessoriesView(title, headerActionUrl, items)
}

@Composable
fun RenderSportCombos(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Value Combos"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<ComboItem>(props["items"])
    SportCombosView(title, headerActionUrl, items)
}

@Composable
fun RenderSportCricketSeason(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Cricket Season"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<CricketItem>(props["items"])
    SportCricketSeasonView(title, headerActionUrl, items)
}

@Composable
fun RenderSportWinnerBrands(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Winner Brands"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<WinnerBrandItem>(props["items"])
    SportWinnerBrandsView(title, headerActionUrl, items)
}

@Composable
fun RenderSportWishlist(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Add to your wishlist"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<WishlistItem>(props["items"])
    SportWishlistView(title, headerActionUrl, items)
}

// ============= Books Render Functions =============

@Composable
fun RenderBooksBestsellers(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Bestsellers"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<BestsellerItem>(props["items"])
    BooksBestsellersView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksGenre(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Shop by Genre"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<GenreItem>(props["items"])
    BooksGenreView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksAuthors(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Featured Authors"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<AuthorItem>(props["items"])
    BooksAuthorsView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksDeals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Book Deals"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<BookDealItem>(props["items"])
    BooksDealsView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksNewArrivals(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "New Arrivals"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<NewArrivalItem>(props["items"])
    BooksNewArrivalsView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksStationery(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Stationery & Supplies"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<StationeryItem>(props["items"])
    BooksStationeryView(title, headerActionUrl, items)
}

@Composable
fun RenderBooksBanner(component: SDUIComponent) {
    val props = component.props ?: return
    val items = parseItems<BookBannerItem>(props["items"])
    BooksBannerView(items)
}

@Composable
fun RenderBooksReadingLists(component: SDUIComponent) {
    val props = component.props ?: return
    val title = props["title"] as? String ?: "Curated Reading Lists"
    val headerActionUrl = props["headerActionUrl"] as? String
    val items = parseItems<ReadingListItem>(props["items"])
    BooksReadingListsView(title, headerActionUrl, items)
}
