import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct ProductDetailView: View {
    let productId: String
    // Optional: Pass full product if available, else fetch
    @State var productFragment: Product?

    // Environment
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var cartManager: CartManager
    @ObservedObject private var wishlistManager = WishlistManager.shared
    @ObservedObject private var reviewManager = ReviewManager.shared

    // State
    @State private var product: Product?
    @State private var isLoading = true
    @State private var isReviewModalVisible = false
    @State private var showAddReviewSheet = false

    // Buy Now Flow State
    @State private var showLastChancePopup = false
    @State private var navigateToCheckout = false
    @State private var selectedLastChanceOfferIds: [String] = []

    // Referral
    @State private var showReferralAlert = false
    @State private var generatedLink = ""

    // UserAddress State
    @State private var isUserAddressSelectorVisible = false
    @State private var selectedUserAddressId: String? = nil
    @State private var savedUserAddresses: [UserAddress] = []

    var currentUserAddress: UserAddress? {
        savedUserAddresses.first { $0.id == selectedUserAddressId } ?? savedUserAddresses.first
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: {
                        presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(AppTheme.Colors.textPrimary)
                    }
                    Spacer()

                    Button(action: {
                        // Share logic
                    }) {
                        Image(systemName: "square.and.arrow.up")
                            .font(.system(size: 20))
                            .foregroundColor(AppTheme.Colors.textPrimary)
                    }

                    // Wishlist Button
                    Button(action: {
                        Task {
                            await wishlistManager.toggleWishlist(productId: productId)
                        }
                    }) {
                        Image(
                            systemName: wishlistManager.isInWishlist(productId: productId)
                                ? "heart.fill" : "heart"
                        )
                        .font(.system(size: 20))
                        .foregroundColor(
                            wishlistManager.isInWishlist(productId: productId)
                                ? AppTheme.Colors.error : AppTheme.Colors.textPrimary)
                    }
                    .padding(.leading, 12)

                    Button(action: {
                        // Cart logic
                    }) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: "cart")
                                .font(.system(size: 20))
                                .foregroundColor(AppTheme.Colors.textPrimary)
                            if cartManager.cartCount > 0 {
                                Text("\(cartManager.cartCount)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(width: 16, height: 16)
                                    .background(Color.red)
                                    .clipShape(Circle())
                                    .offset(x: 6, y: -6)
                            }
                        }
                    }
                    .padding(.leading, 12)
                }
                .padding()
                .background(Color.white)

                if isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let product = product {
                    ScrollView {
                        VStack(spacing: 0) {
                            // 1. Timer
                            if let endDate = product.saleEndDate {
                                ProductTimerView(targetDate: endDate)
                            }

                            // 2. Carousel
                            let _ = AppLogger.debug(
                                "ProductDetailView product.images: \(product.images)")
                            ProductImageCarouselView(images: product.images)

                            // 3. Price & Title
                            PriceAndTitleView(
                                brand: product.category,
                                name: product.name,
                                shortDescription: product.shortDescription ?? product.description,
                                price: product.price,
                                mrp: product.mrp,
                                discount: product.discountPercentage.map { "\($0)% off" },
                                protectPromiseFee: product.protectPromiseFee
                            )

                            // 3.5 Highlights / Description (Replaces hardcoded text)
                            // If no highlights, it shows description as a single spec item, effectively replacing the old text description
                            ProductHighlightsView(
                                highlights: product.highlights ?? [],
                                description: product.description
                            )

                            // 3.8 UserAddress Bar
                            Rectangle().fill(AppTheme.Colors.background).frame(height: 8)
                            UserAddressBarView(currentUserAddress: currentUserAddress) {
                                withAnimation { isUserAddressSelectorVisible = true }
                            }

                            // 5. Bank Offers
                            Rectangle().fill(AppTheme.Colors.background).frame(height: 8)
                            BankOffersView(offers: product.offers)

                            // 9. Delivery
                            Rectangle().fill(AppTheme.Colors.background).frame(height: 8)
                            DeliveryInfoView(
                                sellerName: product.sellerName,
                                trustBadges: product.trustBadges,
                                productId: productId
                            )

                            // 10. Reviews Section
                            Rectangle().fill(AppTheme.Colors.background).frame(height: 8)
                            VStack(alignment: .leading, spacing: 16) {
                                HStack {
                                    Text("Ratings & Reviews")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(AppTheme.Colors.textPrimary)
                                    Spacer()
                                    Button(action: {
                                        if AuthManager.shared.isLoggedIn {
                                            showAddReviewSheet = true
                                        } else {
                                            // Ideally show login
                                        }
                                    }) {
                                        Text("Rate Product")
                                            .font(.system(size: 14, weight: .medium))
                                            .foregroundColor(AppTheme.Colors.primary)
                                    }
                                }

                                if reviewManager.isLoading {
                                    ProgressView().frame(maxWidth: .infinity, alignment: .center)
                                } else if reviewManager.reviews.isEmpty {
                                    Text("No reviews yet. Be the first to review!")
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                        .padding(.vertical, 8)
                                } else {
                                    ForEach(reviewManager.reviews) { review in
                                        ReviewRowView(review: review)
                                        Divider()
                                    }
                                }
                            }
                            .padding(16)
                            .background(Color.white)

                            // Spacer
                            AppTheme.Colors.background.frame(height: 20)
                        }
                    }

                    // Bottom Action Bar
                    BottomActionBarView(
                        price: product.price,
                        onAddToCart: {
                            cartManager.addToCart(product: product, quantity: 1)
                        },
                        onBuyNow: {
                            // Show LastChancePopup if offers exist, otherwise go to checkout
                            let offers = product.lastChanceOffers ?? []
                            if !offers.isEmpty {
                                withAnimation { showLastChancePopup = true }
                            } else {
                                navigateToCheckout = true
                            }
                        },
                        onOpenCart: {
                            // Open cart
                        }
                    )

                    // Influencer Referral Link Button
                    if let user = AuthManager.shared.currentUser, user.role == "INFLUENCER",
                        let code = user.referralCode
                    {
                        Button(action: {
                            let link = "https://localforvocal.com/product/\(productId)?ref=\(code)"
                            generatedLink = link
                            showReferralAlert = true
                            #if canImport(UIKit)
                                UIPasteboard.general.string = link
                            #endif
                        }) {
                            HStack {
                                Image(systemName: "link")
                                Text("Generate Referral Link")
                            }
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 8)
                    }

                    // Hidden NavigationLink for checkout
                    NavigationLink(
                        destination: CheckoutView(
                            product: product,
                            quantity: 1,
                            selectedOfferIds: selectedLastChanceOfferIds
                        ),
                        isActive: $navigateToCheckout
                    ) { EmptyView() }
                } else {
                    VStack(spacing: 16) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 50))
                            .foregroundColor(.gray)
                        Text("Product not found")
                            .font(.title2)
                            .fontWeight(.semibold)
                        Text("The product you are looking for does not exist or has been removed.")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }

            // Address Selector Modal Overlay
            UserAddressSelectorView(
                isVisible: $isUserAddressSelectorVisible,
                savedUserAddresses: savedUserAddresses,
                selectedUserAddressId: $selectedUserAddressId,
                onSelectUserAddress: { addr in
                    selectedUserAddressId = addr.id
                },
                onUseCurrentLocation: {
                    // Mock location logic
                },
                onAddNewUserAddress: {
                    // Mock add new
                }
            )

            // Last Chance Popup Overlay
            LastChancePopupView(
                isVisible: $showLastChancePopup,
                offers: product?.lastChanceOffers ?? [],
                onGoToCheckout: {
                    navigateToCheckout = true
                },
                onContinue: { selectedOffers in
                    selectedLastChanceOfferIds = selectedOffers
                    navigateToCheckout = true
                }
            )
            .sheet(isPresented: $showAddReviewSheet) {
                AddReviewView(productId: productId) {
                    Task {
                        await reviewManager.fetchReviews(productId: productId)
                    }
                }
            }
        }
        .background(AppTheme.Colors.background)

        .alert("Referral Link Generated", isPresented: $showReferralAlert) {
            Button("Copy", role: .cancel) {
                #if canImport(UIKit)
                    UIPasteboard.general.string = generatedLink
                #endif
            }
        } message: {
            Text("Link copied to clipboard:\n\(generatedLink)")
        }
        .navigationBarHidden(true)
        .onAppear {
            loadAllData()
        }
    }

    private func loadAllData() {
        // 1. Initial State from Fragment
        if let p = productFragment {
            self.product = p
        }

        // 2. Load Full Details
        loadProduct()

        // 3. Load Side Effects (Reviews, etc)
        Task {
            await reviewManager.fetchReviews(productId: productId)
        }
    }

    private func loadProduct() {
        Task {
            isLoading = product == nil  // Only show loading if no fragment
            do {
                if let fetched = try await APIService.shared.fetchProductDetails(id: productId) {
                    AppLogger.info("🎯 Fetched product: \(fetched.name), images: \(fetched.images)")
                    self.product = fetched
                }
            } catch {
                AppLogger.error("Error fetching product: \(error)")
            }
            isLoading = false
        }
    }
}
