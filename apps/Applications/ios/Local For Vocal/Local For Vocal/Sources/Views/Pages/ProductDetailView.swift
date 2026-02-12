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
    @ObservedObject private var authManager = AuthManager.shared

    // State
    @State private var product: Product?
    @State private var isLoading = true
    @State private var isReviewModalVisible = false
    @State private var showAddReviewSheet = false

    // Buy Now Flow State
    @State private var showLastChancePopup = false
    @State private var navigateToCheckout = false
    @State private var navigateToCart = false
    @State private var selectedLastChanceOfferIds: [String] = []

    // Referral
    @State private var showReferralAlert = false
    @State private var generatedLink = ""
    @State private var isGeneratingLink = false
    @State private var linkCopied = false

    // UserAddress State
    @State private var isUserAddressSelectorVisible = false
    @State private var selectedUserAddressId: String? = nil
    @State private var savedUserAddresses: [UserAddress] = []

    var currentUserAddress: UserAddress? {
        savedUserAddresses.first { $0.id == selectedUserAddressId } ?? savedUserAddresses.first
    }

    // Share Sheet State
    @State private var isShareSheetPresented = false
    @State private var shareItems: [Any] = []

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // ... (Header code) ...
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
                        navigateToCart = true
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

                            // 3.2 Affiliate Link Section (Only for active influencers)
                            if let user = authManager.currentUser,
                                user.role == "INFLUENCER",
                                user.isActive == true,
                                user.referralCode != nil
                            {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Affiliate Link")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(.gray)

                                    if generatedLink.isEmpty {
                                        // Show Generate Button
                                        Button(action: {
                                            generateAffiliateLink()
                                        }) {
                                            HStack {
                                                if isGeneratingLink {
                                                    ProgressView()
                                                        .progressViewStyle(
                                                            CircularProgressViewStyle(tint: .white)
                                                        )
                                                        .scaleEffect(0.8)
                                                } else {
                                                    Image(systemName: "link.badge.plus")
                                                }
                                                Text(
                                                    isGeneratingLink
                                                        ? "Generating..."
                                                        : "Generate Affiliate Link")
                                            }
                                            .font(.system(size: 14, weight: .semibold))
                                            .foregroundColor(.white)
                                            .frame(maxWidth: .infinity)
                                            .padding(.vertical, 12)
                                            .background(Color.blue)
                                            .cornerRadius(10)
                                        }
                                        .disabled(isGeneratingLink)
                                    } else {
                                        // Show Generated Link with Copy and Share buttons
                                        VStack(spacing: 10) {
                                            Text(generatedLink)
                                                .font(.system(size: 12))
                                                .foregroundColor(.blue)
                                                .lineLimit(2)
                                                .frame(maxWidth: .infinity, alignment: .leading)

                                            HStack(spacing: 10) {
                                                // Copy Button
                                                Button(action: {
                                                    UIPasteboard.general.string = generatedLink
                                                    linkCopied = true
                                                    DispatchQueue.main.asyncAfter(
                                                        deadline: .now() + 2
                                                    ) {
                                                        linkCopied = false
                                                    }
                                                }) {
                                                    HStack(spacing: 4) {
                                                        Image(
                                                            systemName: linkCopied
                                                                ? "checkmark" : "doc.on.doc")
                                                        Text(linkCopied ? "Copied!" : "Copy")
                                                    }
                                                    .font(.system(size: 13, weight: .medium))
                                                    .foregroundColor(.white)
                                                    .frame(maxWidth: .infinity)
                                                    .padding(.vertical, 10)
                                                    .background(
                                                        linkCopied ? Color.green : Color.blue
                                                    )
                                                    .cornerRadius(8)
                                                }

                                                // Share Button
                                                Button(action: {
                                                    // Use plain text and present directly via UIKit for faster loading
                                                    let shareText =
                                                        "Check out this amazing product on Local For Vocal: \(product.name)\n\(generatedLink)"
                                                    presentShareSheet(items: [shareText])
                                                }) {
                                                    HStack(spacing: 4) {
                                                        Image(systemName: "square.and.arrow.up")
                                                        Text("Share")
                                                    }
                                                    .font(.system(size: 13, weight: .medium))
                                                    .foregroundColor(.white)
                                                    .frame(maxWidth: .infinity)
                                                    .padding(.vertical, 10)
                                                    .background(Color.orange)
                                                    .cornerRadius(8)
                                                }
                                            }
                                        }
                                        .padding(12)
                                        .background(Color.blue.opacity(0.1))
                                        .cornerRadius(10)
                                    }
                                }
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)

                                // Commission Display
                                if let commissionPercent = product.influencerCommission,
                                    commissionPercent > 0
                                {
                                    let commissionAmount = (product.price * commissionPercent) / 100
                                    Text(
                                        "Earn ₹\(String(format: "%.2f", commissionAmount)) commission on this product"
                                    )
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.green)
                                    .padding(.horizontal, 16)
                                    .padding(.bottom, 8)
                                }
                            }

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
                            navigateToCart = true
                        }
                    )

                    // Hidden NavigationLink for Cart - REPLACE WITH navigationDestination
                    /*
                    NavigationLink(
                        destination: CartPageView(),
                        isActive: $navigateToCart
                    ) { EmptyView() }
                     */
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
        .navigationBarHidden(true)
        .onAppear {
            loadAllData()
            // Refresh user profile to check for status updates (e.g. Influencer approval)
            Task {
                await AuthManager.shared.refreshUserProfile()
            }
        }
    }

    private func loadAllData() {
        // 1. Initial State from Fragment
        if let p = productFragment {
            self.product = p
        }

        // 2. Load Full Details
        loadProduct()

        // 3. Load Side Effects (Reviews, Addresses)
        Task {
            await reviewManager.fetchReviews(productId: productId)
            if AuthManager.shared.isLoggedIn {
                await fetchAddresses()
                checkForExistingAffiliateLink()
            }
        }
    }

    private func checkForExistingAffiliateLink() {
        guard let user = AuthManager.shared.currentUser,
            let links = user.affiliateLinks
        else { return }

        if let existingLink = links.first(where: { $0.productId == productId }) {
            Task { @MainActor in
                self.generatedLink = existingLink.link
            }
        }
    }

    private func fetchAddresses() async {
        do {
            let addresses = try await APIService.shared.fetchAddresses()

            // UI update on main thread
            await MainActor.run {
                self.savedUserAddresses = addresses
                // Default to 'isDefault' or first
                if self.selectedUserAddressId == nil {
                    if let def = addresses.first(where: { $0.isDefault }) {
                        self.selectedUserAddressId = def.id
                    } else {
                        self.selectedUserAddressId = addresses.first?.id
                    }
                }
            }
        } catch {
            AppLogger.error("Error fetching addresses in PDV: \(error)")
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

    private func generateAffiliateLink() {
        guard let product = product else { return }

        isGeneratingLink = true
        Task {
            do {
                let link = try await APIService.shared.generateAffiliateLink(
                    productId: productId,
                    productName: product.name
                )
                await MainActor.run {
                    generatedLink = link
                    isGeneratingLink = false

                    // Persist locally so it's available next time without refresh
                    AuthManager.shared.addAffiliateLink(
                        productId: productId,
                        productName: product.name,
                        link: link
                    )
                }
            } catch {
                await MainActor.run {
                    isGeneratingLink = false
                    AppLogger.error("Failed to generate affiliate link: \(error)")
                }
            }
        }
    }

    private func presentShareSheet(items: [Any]) {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let rootViewController = windowScene.windows.first?.rootViewController
        else {
            return
        }

        // Find the topmost presented view controller
        var topController = rootViewController
        while let presented = topController.presentedViewController {
            topController = presented
        }

        let activityVC = UIActivityViewController(
            activityItems: items,
            applicationActivities: nil
        )

        // For iPad: configure popover presentation
        if let popover = activityVC.popoverPresentationController {
            popover.sourceView = topController.view
            popover.sourceRect = CGRect(
                x: topController.view.bounds.midX,
                y: topController.view.bounds.midY,
                width: 0, height: 0
            )
            popover.permittedArrowDirections = []
        }

        topController.present(activityVC, animated: true)
    }
}
