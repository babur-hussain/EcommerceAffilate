import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

// MARK: - Theme Colors
extension Color {
    static let shopPrimary = Color(red: 189 / 255, green: 15 / 255, blue: 88 / 255)  // #bd0f58
    static let shopPrimaryDark = Color(red: 144 / 255, green: 11 / 255, blue: 66 / 255)  // #900b42
    static let shopBackground = Color(red: 253 / 255, green: 251 / 255, blue: 249 / 255)  // #fdfbf9
    static let shopSurface = Color.white
    static let shopTextMain = Color(red: 24 / 255, green: 17 / 255, blue: 20 / 255)  // #181114
    static let shopTextSecondary = Color(red: 137 / 255, green: 97 / 255, blue: 114 / 255)  // #896172
}

// MARK: - Product Detail for Display
struct ShopProductDetail: Identifiable {
    let id: String
    let name: String
    let imageUrl: String?
    let price: Double?
    let mrp: Double?
    let sellerName: String?

    init(from product: Product) {
        self.id = product.id
        self.name = product.name
        self.imageUrl = product.images.first  // images is [String], not optional
        self.price = product.price
        self.mrp = product.mrp
        self.sellerName = product.sellerName
    }

    init(from affiliateLink: AffiliateLink) {
        self.id = affiliateLink.productId
        self.name = affiliateLink.productName
        self.imageUrl = nil
        self.price = nil
        self.mrp = nil
        self.sellerName = nil
    }
}

struct InfluencerShopView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject private var authManager = AuthManager.shared
    @State private var productDetails: [String: ShopProductDetail] = [:]
    @State private var isLoading = false
    @State private var stories: [Story] = []
    @State private var showStoryPlayer = false

    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        ZStack(alignment: .top) {
            Color.shopBackground
                .edgesIgnoringSafeArea(.all)

            ScrollView {
                VStack(spacing: 0) {
                    // Profile Section
                    profileSection

                    // Collections Carousel
                    if !uniqueCategories.isEmpty {
                        collectionsSection
                    }

                    // Product Feed Header
                    productHeader

                    // Product Grid
                    productGrid

                    Spacer(minLength: 100)
                }
            }

            // Sticky Header
            headerView
        }
        .navigationBarHidden(true)
        .toolbar(.hidden, for: .tabBar)  // Hide tab bar
        .task {
            await loadProductDetails()
            await loadStories()
        }
        .fullScreenCover(isPresented: $showStoryPlayer) {
            StoryPlayerWrapper(stories: stories, isPresented: $showStoryPlayer)
        }
    }

    // MARK: - Load Stories
    private func loadStories() async {
        do {
            let fetchedStories = try await APIService.shared.fetchMyStories()
            // Filter only active stories just in case
            await MainActor.run {
                self.stories = fetchedStories.filter { $0.isActive }
            }
        } catch {
            print("Failed to fetch stories: \(error)")  // Silent fail for UI
        }
    }

    // MARK: - Load Product Details
    private func loadProductDetails() async {
        guard !affiliateProducts.isEmpty else { return }
        isLoading = true

        for link in affiliateProducts {
            do {
                if let product = try await APIService.shared.fetchProductDetails(id: link.productId)
                {
                    await MainActor.run {
                        productDetails[link.productId] = ShopProductDetail(from: product)
                    }
                }
            } catch {
                // Use affiliate link data as fallback
                await MainActor.run {
                    if productDetails[link.productId] == nil {
                        productDetails[link.productId] = ShopProductDetail(from: link)
                    }
                }
            }
        }

        isLoading = false
    }

    // MARK: - Header
    private var headerView: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.shopTextMain)
                        .frame(width: 40, height: 40)
                        .background(Color.white.opacity(0.9))
                        .clipShape(Circle())
                }

                Spacer()

                // Profile image + Shop name
                HStack(spacing: 8) {
                    // Profile image circle
                    if let imageUrl = authManager.currentUser?.profileImage,
                        !imageUrl.isEmpty,
                        let url = URL(string: imageUrl)
                    {
                        CachedAsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Image(systemName: "person.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.shopTextSecondary)
                        }
                        .frame(width: 28, height: 28)
                        .clipShape(Circle())
                        .overlay(
                            Circle()
                                .stroke(Color.shopPrimary, lineWidth: 1.5)
                        )
                    } else {
                        Image(systemName: "person.fill")
                            .font(.system(size: 12))
                            .foregroundColor(.shopTextSecondary)
                            .frame(width: 28, height: 28)
                            .background(Color.gray.opacity(0.1))
                            .clipShape(Circle())
                    }

                    Text("\(authManager.currentUser?.name ?? "My")'s Shop")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.shopTextMain)
                }

                Spacer()

                Button(action: {
                    shareInfluencerPage()
                }) {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.shopTextMain)
                        .frame(width: 40, height: 40)
                        .background(Color.white.opacity(0.9))
                        .clipShape(Circle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                Color.shopBackground.opacity(0.95)
                    .background(.ultraThinMaterial)
            )

            Divider()
                .opacity(0.5)
        }
    }

    // MARK: - Profile Section
    private var profileSection: some View {
        VStack(spacing: 0) {
            Spacer().frame(height: 70)  // Space for header

            VStack(spacing: 16) {
                // Avatar with gradient border
                ZStack {
                    // Gradient Ring
                    if !stories.isEmpty {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [.shopPrimary, .orange],
                                    startPoint: .topTrailing,
                                    endPoint: .bottomLeading
                                )
                            )
                            .frame(width: 96, height: 96)
                    } else {
                        // Gray ring if no stories, or maybe just hidden?
                        // Keeping it for consistency but maybe lighter
                        Circle()
                            .stroke(Color.gray.opacity(0.2), lineWidth: 2)
                            .frame(width: 96, height: 96)
                    }

                    Circle()
                        .fill(Color.shopBackground)
                        .frame(width: 90, height: 90)

                    if let imageUrl = authManager.currentUser?.profileImage,
                        !imageUrl.isEmpty,
                        let url = URL(string: imageUrl)
                    {
                        CachedAsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Image(systemName: "person.fill")
                                .font(.system(size: 40))
                                .foregroundColor(.shopTextSecondary)
                        }
                        .frame(width: 84, height: 84)
                        .clipShape(Circle())
                    } else {
                        Image(systemName: "person.fill")
                            .font(.system(size: 40))
                            .foregroundColor(.shopTextSecondary)
                    }

                    // Verified badge
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.shopPrimary)
                        .background(Circle().fill(Color.white).padding(2))
                        .offset(x: 32, y: 32)
                }
                .onTapGesture {
                    if !stories.isEmpty {
                        showStoryPlayer = true
                    }
                }

                // Name
                Text("\(authManager.currentUser?.name ?? "Influencer")'s Boutique")
                    .font(.system(size: 24, weight: .heavy))
                    .foregroundColor(.shopTextMain)

                // Bio
                Text("Sharing my favorite product recommendations ✨")
                    .font(.system(size: 14))
                    .foregroundColor(.shopTextSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)

                // Product count badge
                HStack(spacing: 4) {
                    Image(systemName: "bag.fill")
                        .font(.system(size: 12))
                    Text("\(affiliateProducts.count) Products")
                        .font(.system(size: 13, weight: .semibold))
                }
                .foregroundColor(.shopPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(Color.shopPrimary.opacity(0.1))
                )
            }
            .padding(.vertical, 24)
        }
    }

    // MARK: - Collections Section
    private var collectionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("COLLECTIONS")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.shopTextSecondary)
                .tracking(0.5)
                .padding(.horizontal, 24)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(uniqueCategories, id: \.self) { category in
                        collectionItem(title: category)
                    }
                }
                .padding(.horizontal, 24)
            }
        }
        .padding(.bottom, 24)
    }

    private func collectionItem(title: String) -> some View {
        VStack(spacing: 8) {
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color.shopPrimary.opacity(0.8), Color.shopPrimary.opacity(0.4),
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 64, height: 64)

                Image(systemName: categoryIcon(for: title))
                    .font(.system(size: 24))
                    .foregroundColor(.white)
            }

            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.shopTextMain)
                .lineLimit(1)
        }
    }

    private func categoryIcon(for category: String) -> String {
        let lower = category.lowercased()
        if lower.contains("cloth") || lower.contains("fashion") || lower.contains("dress") {
            return "tshirt.fill"
        } else if lower.contains("beauty") || lower.contains("skin") || lower.contains("makeup") {
            return "sparkles"
        } else if lower.contains("shoe") || lower.contains("kick") {
            return "shoe.fill"
        } else if lower.contains("bag") || lower.contains("access") {
            return "bag.fill"
        } else if lower.contains("electr") || lower.contains("tech") {
            return "iphone"
        } else {
            return "tag.fill"
        }
    }

    // MARK: - Product Header
    private var productHeader: some View {
        HStack {
            Text("My Picks")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.shopTextMain)

            Spacer()

            Text("\(affiliateProducts.count) items")
                .font(.system(size: 14))
                .foregroundColor(.shopTextSecondary)
        }
        .padding(.horizontal, 24)
        .padding(.bottom, 16)
    }

    // MARK: - Product Grid
    private var productGrid: some View {
        LazyVGrid(columns: columns, spacing: 16) {
            ForEach(affiliateProducts, id: \.productId) { link in
                NavigationLink(destination: ProductDetailView(productId: link.productId)) {
                    productCard(link: link)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding(.horizontal, 16)
    }

    private func productCard(link: AffiliateLink) -> some View {
        let detail = productDetails[link.productId]
        let imageUrl = detail?.imageUrl
        let price = detail?.price
        let sellerName = detail?.sellerName

        return VStack(alignment: .leading, spacing: 0) {
            // Product Image
            // Product Image
            Color.white
                .aspectRatio(1, contentMode: .fit)
                .overlay(
                    ZStack(alignment: .bottomLeading) {
                        if let urlString = imageUrl, let url = URL(string: urlString) {
                            CachedAsyncImage(url: url) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            } placeholder: {
                                Rectangle()
                                    .fill(Color.gray.opacity(0.1))
                                    .overlay(
                                        ProgressView()
                                            .progressViewStyle(
                                                CircularProgressViewStyle(tint: .shopPrimary))
                                    )
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .clipped()
                        } else {
                            Rectangle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color.gray.opacity(0.1), Color.gray.opacity(0.2)],
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .overlay(
                                    Image(systemName: "photo")
                                        .font(.system(size: 30))
                                        .foregroundColor(.gray.opacity(0.4))
                                )
                        }

                        // Curated badge
                        let curatorName =
                            (authManager.currentUser?.name ?? "Me").split(separator: " ").first.map(
                                String.init) ?? "Me"
                        Text("Curated by \(curatorName)")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(.white)
                            .textCase(.uppercase)
                            .tracking(0.3)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(4)
                            .padding(8)
                    }
                )
                .clipped()

            // Details
            VStack(alignment: .leading, spacing: 4) {
                // Seller Name (Fixed Height)
                Text(sellerName ?? " ")
                    .font(.system(size: 11))
                    .foregroundColor(.shopTextSecondary)
                    .lineLimit(1)
                    .frame(height: 14, alignment: .leading)

                // Product Name (Fixed Height for 2 lines)
                Text(link.productName)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.shopTextMain)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                    .frame(height: 32, alignment: .topLeading)  // Approx 2 lines + spacing line height

                HStack {
                    if let price = price {
                        Text("₹\(Int(price))")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.shopPrimary)
                    } else {
                        Text("View Details")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.shopPrimary)
                    }

                    Spacer()

                    Image(systemName: "arrow.right.circle.fill")
                        .font(.system(size: 18))
                        .foregroundColor(.shopPrimary)
                }
                .frame(height: 20)  // Fixed height for price row
            }
            .padding(10)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
    }

    // MARK: - Helpers
    private var affiliateProducts: [AffiliateLink] {
        authManager.currentUser?.affiliateLinks ?? []
    }

    private var uniqueCategories: [String] {
        // Extract unique categories from product names (simple heuristic)
        var categories: Set<String> = []
        for product in affiliateProducts {
            let name = product.productName.lowercased()
            if name.contains("dress") || name.contains("shirt") || name.contains("pant")
                || name.contains("lehenga") || name.contains("kurta") || name.contains("saree")
            {
                categories.insert("Fashion")
            } else if name.contains("bag") {
                categories.insert("Bags")
            } else if name.contains("shoe") || name.contains("sneaker") {
                categories.insert("Footwear")
            } else if name.contains("watch") || name.contains("jewelry") {
                categories.insert("Accessories")
            } else {
                categories.insert("All")
            }
        }
        return Array(categories).sorted()
    }

    private func shareInfluencerPage() {
        guard let user = authManager.currentUser,
            let referralCode = user.referralCode
        else { return }

        let shareText =
            "Check out my curated shop on Local For Vocal! 🛍️\nhttps://localforvocalstartup.com/shop/\(referralCode)"

        #if canImport(UIKit)
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                let rootViewController = windowScene.windows.first?.rootViewController
            else { return }

            var topController = rootViewController
            while let presented = topController.presentedViewController {
                topController = presented
            }

            let activityVC = UIActivityViewController(
                activityItems: [shareText], applicationActivities: nil)

            if let popover = activityVC.popoverPresentationController {
                popover.sourceView = topController.view
                popover.sourceRect = CGRect(
                    x: topController.view.bounds.midX, y: topController.view.bounds.midY, width: 0,
                    height: 0)
                popover.permittedArrowDirections = []
            }

            topController.present(activityVC, animated: true)
        #endif
    }
}

struct StoryPlayerWrapper: View {
    let stories: [Story]
    @Binding var isPresented: Bool
    @State private var currentIndex = 0

    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            if !stories.isEmpty && currentIndex < stories.count {
                StoryView(story: stories[currentIndex]) {
                    // On Complete
                    if currentIndex < stories.count - 1 {
                        withAnimation {
                            currentIndex += 1
                        }
                    } else {
                        isPresented = false
                    }
                }
                .id(stories[currentIndex].id)  // Force recreate for fresh state
                .transition(.opacity)
            } else {
                // Fallback or end
                Color.black.onAppear {
                    isPresented = false
                }
            }
        }
    }
}

#Preview {
    InfluencerShopView()
}
