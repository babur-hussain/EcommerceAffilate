import Combine
import SwiftUI

// MARK: - Account View
struct AccountView: View {
    private var authManager: AuthManager { AuthManager.shared }
    @State private var showLoginView = false
    @State private var showLogoutAlert = false
    @State private var showMyOrders = false
    @State private var showWishlist = false
    @State private var showWallet = false
    @State private var showReturns = false
    @State private var showProfileEdit = false
    @State private var showNotifications = false
    @State private var showLanguage = false
    @State private var showSmartBasket = false
    @State private var showPlusMembership = false
    @State private var showSellOnPlatform = false
    @State private var showHelpCenter = false
    @State private var showTerms = false
    @State private var showPrivacy = false
    @State private var showInfluencerShop = false
    @State private var showStoryUpload = false
    @State private var isRefreshing = false

    // Brand Colors
    private let primaryBlue = Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255)  // #2874F0
    private let headerBg = Color(red: 240 / 255, green: 245 / 255, blue: 255 / 255)  // #F0F5FF
    private let pageBg = Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)  // #F3F4F6
    private let grayText = Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255)  // #6B7280
    private let darkText = Color(red: 17 / 255, green: 24 / 255, blue: 39 / 255)  // #111827
    private let borderColor = Color(red: 229 / 255, green: 231 / 255, blue: 235 / 255)  // #E5E7EB
    private let amberColor = Color(red: 245 / 255, green: 158 / 255, blue: 11 / 255)  // #F59E0B
    private let redColor = Color(red: 239 / 255, green: 68 / 255, blue: 68 / 255)  // #EF4444

    var body: some View {
        if authManager.isLoggedIn {
            loggedInView
        } else {
            loggedOutView
        }
    }

    // MARK: - Logged Out View
    private var loggedOutView: some View {
        VStack(spacing: 24) {
            Spacer()

            // Profile Icon
            Image(systemName: "person.circle.fill")
                .font(.system(size: 64))
                .foregroundColor(Color(red: 209 / 255, green: 213 / 255, blue: 219 / 255))

            Text("You're not signed in")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(darkText)

            Button(action: {
                showLoginView = true
            }) {
                Text("Sign In")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 12)
                    .background(primaryBlue)
                    .cornerRadius(8)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(pageBg)
        .fullScreenCover(isPresented: $showLoginView) {
            LoginView()
        }
    }

    // MARK: - Logged In View
    private var loggedInView: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background Layer covering Safe Area
                pageBg.edgesIgnoringSafeArea(.all)  // Base background

                Group {
                    // Show influencer styling if role is INFLUENCER AND isActive is true
                    if authManager.currentUser?.role == "INFLUENCER"
                        && authManager.currentUser?.isActive == true
                    {
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(red: 255 / 255, green: 192 / 255, blue: 203 / 255),  // Standard Pink
                                Color.white,
                            ]),
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    } else {
                        headerBg
                    }
                }
                .frame(height: 350)  // Extended to cover more area for smooth transition
                .edgesIgnoringSafeArea(.top)

                ScrollView {
                    VStack(spacing: 0) {
                        // Header
                        headerSection

                        // Quick Links Grid
                        quickLinksGrid
                            .padding(.horizontal, 16)
                            .padding(.vertical, 16)

                        // Account Settings Section
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Account Settings")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(darkText)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.white)
                                .overlay(
                                    Rectangle()
                                        .fill(pageBg)
                                        .frame(height: 1),
                                    alignment: .bottom
                                )

                            // Edit Profile - Tappable
                            Button(action: { showProfileEdit = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "person.fill", title: "Edit Profile",
                                        subtitle: "Update your personal information"),
                                    isLast: false
                                )
                            }
                            .buttonStyle(PlainButtonStyle())

                            settingsRowContent(
                                item: SettingsItem(
                                    icon: "location.fill", title: "Saved Addresses",
                                    subtitle: "Manage delivery addresses"),
                                isLast: false
                            )

                            settingsRowContent(
                                item: SettingsItem(
                                    icon: "creditcard.fill", title: "Payment Methods",
                                    subtitle: "Cards, UPI, Wallets"),
                                isLast: false
                            )

                            // Notifications - Tappable
                            Button(action: { showNotifications = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "bell.fill", title: "Notifications",
                                        subtitle: "Manage notification preferences"),
                                    isLast: true
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                        .background(Color.white)
                        .padding(.top, 8)

                        // Settings Section (Unrolled for actions)
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Settings")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(darkText)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.white)
                                .overlay(
                                    Rectangle()
                                        .fill(pageBg)
                                        .frame(height: 1),
                                    alignment: .bottom
                                )

                            // Language - Tappable
                            Button(action: { showLanguage = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "globe", title: "Language", subtitle: "English"),
                                    isLast: false
                                )
                            }
                            .buttonStyle(PlainButtonStyle())

                            settingsRowContent(
                                item: SettingsItem(
                                    icon: "moon.fill", title: "Dark Mode", subtitle: "Coming soon"),
                                isLast: false
                            )

                            // Sell on Platform
                            Button(action: { showSellOnPlatform = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "bag.fill", title: "Sell on Platform",
                                        subtitle: "Become a seller"),
                                    isLast: false
                                )
                            }
                            .buttonStyle(PlainButtonStyle())

                            settingsRowContent(
                                item: SettingsItem(
                                    icon: "shield.fill", title: "Privacy Center",
                                    subtitle: "Manage your data"),
                                isLast: true
                            )
                        }
                        .background(Color.white)
                        .padding(.top, 8)

                        // Support Section
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Support")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(darkText)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.white)
                                .overlay(
                                    Rectangle()
                                        .fill(pageBg)
                                        .frame(height: 1),
                                    alignment: .bottom
                                )

                            Button(action: { showHelpCenter = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "questionmark.circle.fill", title: "Help Center",
                                        subtitle: "FAQs and support"),
                                    isLast: false
                                )
                            }
                            .buttonStyle(PlainButtonStyle())

                            Button(action: { showTerms = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "doc.text.fill", title: "Terms & Conditions",
                                        subtitle: nil),
                                    isLast: false
                                )
                            }
                            .buttonStyle(PlainButtonStyle())

                            Button(action: { showPrivacy = true }) {
                                settingsRowContent(
                                    item: SettingsItem(
                                        icon: "hand.raised.fill", title: "Privacy Policy",
                                        subtitle: nil
                                    ),
                                    isLast: true
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                        .background(Color.white)
                        .padding(.top, 8)

                        // Logout Button
                        Button(action: {
                            showLogoutAlert = true
                        }) {
                            Text("Log Out")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(redColor)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.white)
                                .cornerRadius(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(borderColor, lineWidth: 1)
                                )
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 20)
                        .padding(.bottom, 40)
                    }
                }
            }
            .task {
                // Refresh user profile to get latest status
                await authManager.refreshUserProfile()
            }
            .alert("Log Out", isPresented: $showLogoutAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Log Out", role: .destructive) {
                    authManager.logout()
                }
            } message: {
                Text("Are you sure you want to log out?")
            }
            .fullScreenCover(isPresented: $showMyOrders) {
                MyOrdersView()
            }
            .fullScreenCover(isPresented: $showWishlist) {
                WishlistView()
            }
            .fullScreenCover(isPresented: $showWallet) {
                WalletView()
            }
            .fullScreenCover(isPresented: $showReturns) {
                ReturnsView()
            }
            .fullScreenCover(isPresented: $showProfileEdit) {
                ProfileEditView()
            }
            .fullScreenCover(isPresented: $showNotifications) {
                NotificationsView()
            }
            .fullScreenCover(isPresented: $showLanguage) {
                LanguageView()
            }
            .fullScreenCover(isPresented: $showSmartBasket) {
                SmartBasketPageView()
            }
            .fullScreenCover(isPresented: $showPlusMembership) {
                PlusMembershipView()
            }
            .fullScreenCover(isPresented: $showSellOnPlatform) {
                SellOnPlatformView()
            }
            .fullScreenCover(isPresented: $showHelpCenter) {
                HelpCenterView()
            }
            .fullScreenCover(isPresented: $showTerms) {
                TermsConditionsView()
            }
            .fullScreenCover(isPresented: $showPrivacy) {
                PrivacyPolicyView()
            }
            .fullScreenCover(isPresented: $showPrivacy) {
                PrivacyPolicyView()
            }
            // Influencer Shop Navigation Link (Hidden)
            // We use background NavigationLink to push while keeping the same state trigger
            .navigationDestination(isPresented: $showInfluencerShop) {
                InfluencerShopView()
            }
            .fullScreenCover(isPresented: $showStoryUpload) {
                StoryUploadView()
            }
        }  // End NavigationStack
    }

    // MARK: - Header Section
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                // Profile Image
                if authManager.currentUser?.role == "INFLUENCER"
                    && authManager.currentUser?.isActive == true
                {
                    // Influencer View: Tappable with Ring and Plus Icon
                    Button(action: {
                        showStoryUpload = true
                    }) {
                        ZStack {
                            // Instagram-like gradient ring
                            Circle()
                                .stroke(
                                    LinearGradient(
                                        colors: [
                                            Color(red: 253 / 255, green: 29 / 255, blue: 29 / 255),
                                            Color(red: 252 / 255, green: 176 / 255, blue: 69 / 255),
                                            Color(red: 131 / 255, green: 58 / 255, blue: 180 / 255),
                                        ],
                                        startPoint: .topTrailing,
                                        endPoint: .bottomLeading
                                    ),
                                    lineWidth: 2.5
                                )
                                .frame(width: 56, height: 56)

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
                                        .font(.system(size: 20))
                                        .foregroundColor(.gray)
                                }
                                .frame(width: 48, height: 48)
                                .clipShape(Circle())
                                .background(Circle().fill(Color.white))
                            } else {
                                Image(systemName: "person.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(.gray)
                                    .frame(width: 48, height: 48)
                                    .background(Color.white)
                                    .clipShape(Circle())
                            }

                            // Plus icon for adding story
                            Image(systemName: "plus.circle.fill")
                                .font(.system(size: 18))
                                .foregroundColor(
                                    Color(red: 131 / 255, green: 58 / 255, blue: 180 / 255)
                                )
                                .background(Circle().fill(Color.white).frame(width: 14, height: 14))
                                .offset(x: 18, y: 18)
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                } else {
                    // Standard User View: Static Image, No Ring, No Plus
                    ZStack {
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
                                    .font(.system(size: 20))
                                    .foregroundColor(.gray)
                            }
                            .frame(width: 56, height: 56)  // Match outer size
                            .clipShape(Circle())
                            .background(Circle().fill(Color.white))
                        } else {
                            Image(systemName: "person.fill")
                                .font(.system(size: 24))
                                .foregroundColor(.gray)
                                .frame(width: 56, height: 56)  // Match outer size
                                .background(Color.white)
                                .clipShape(Circle())
                        }
                    }
                    .padding(.trailing, 4)  // Slight adjustment to align with text
                }

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(authManager.currentUser?.name ?? "User")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(darkText)

                        // Show badge if role is INFLUENCER AND isActive is true
                        if authManager.currentUser?.role == "INFLUENCER"
                            && authManager.currentUser?.isActive == true
                        {
                            Text("Influencer")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            Color(
                                                red: 255 / 255, green: 105 / 255, blue: 180 / 255),  // Hot Pink
                                            Color(
                                                red: 147 / 255, green: 112 / 255, blue: 219 / 255),  // Medium Purple
                                        ]),
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(12)
                        }
                    }

                    Button(action: { showPlusMembership = true }) {
                        HStack(spacing: 2) {
                            Text("Explore ")
                                .font(.system(size: 14))
                                .foregroundColor(
                                    Color(red: 75 / 255, green: 85 / 255, blue: 99 / 255))
                            Text("Plus")
                                .font(.system(size: 14, weight: .heavy))
                                .italic()
                                .foregroundColor(
                                    Color(red: 75 / 255, green: 85 / 255, blue: 99 / 255))
                            Image(systemName: "chevron.right")
                                .font(.system(size: 12))
                                .foregroundColor(grayText)
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                }

                Spacer()

                // Coins Pill
                HStack(spacing: 4) {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 12))
                        .foregroundColor(amberColor)
                    Text("0")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(darkText)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.white)
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(borderColor, lineWidth: 1)
                )
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 16)
        }
        .background(Color.clear)
    }

    // MARK: - Quick Links Grid
    private var quickLinksGrid: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                quickLinkButton(icon: "cube.box.fill", title: "Orders", color: primaryBlue) {
                    showMyOrders = true
                }
                quickLinkButton(icon: "heart", title: "Wishlist", color: primaryBlue) {
                    showWishlist = true
                }
            }
            HStack(spacing: 12) {
                quickLinkButton(icon: "wallet.pass", title: "Wallet", color: primaryBlue) {
                    showWallet = true
                }
                quickLinkButton(
                    icon: "arrow.uturn.left.circle", title: "Returns", color: primaryBlue
                ) {
                    showReturns = true
                }
            }
            HStack(spacing: 12) {
                quickLinkButton(icon: "basket.fill", title: "Smart Basket", color: Color.orange) {
                    showSmartBasket = true
                }
                // Show My Shop for active influencers only
                if authManager.currentUser?.role == "INFLUENCER"
                    && authManager.currentUser?.isActive == true
                {
                    quickLinkButton(
                        icon: "storefront.fill",
                        title: "My Shop",
                        color: Color(red: 189 / 255, green: 15 / 255, blue: 88 / 255)  // Pink
                    ) {
                        showInfluencerShop = true
                    }
                } else {
                    Spacer().frame(maxWidth: .infinity)
                }
            }
        }
    }

    private func quickLinkButton(
        icon: String, title: String, color: Color, action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)
                Text(title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(red: 31 / 255, green: 41 / 255, blue: 55 / 255))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .padding(.horizontal, 16)
            .background(Color.white)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(borderColor, lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private func quickLinkItem(icon: String, title: String, color: Color) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
            Text(title)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(Color(red: 31 / 255, green: 41 / 255, blue: 55 / 255))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
        .background(Color.white)
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(borderColor, lineWidth: 1)
        )
    }

    // MARK: - Settings Section
    private func settingsSection(title: String, items: [SettingsItem]) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(title)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(darkText)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.white)
                .overlay(
                    Rectangle()
                        .fill(pageBg)
                        .frame(height: 1),
                    alignment: .bottom
                )

            ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                settingsRow(item: item, isLast: index == items.count - 1)
            }
        }
        .background(Color.white)
        .padding(.top, 8)
    }

    private func settingsRow(item: SettingsItem, isLast: Bool) -> some View {
        settingsRowContent(item: item, isLast: isLast)
    }

    private func settingsRowContent(item: SettingsItem, isLast: Bool) -> some View {
        HStack(spacing: 16) {
            Image(systemName: item.icon)
                .font(.system(size: 20))
                .foregroundColor(primaryBlue)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(darkText)

                if let subtitle = item.subtitle {
                    Text(subtitle)
                        .font(.system(size: 12))
                        .foregroundColor(grayText)
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(Color(red: 156 / 255, green: 163 / 255, blue: 175 / 255))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
        .background(Color.white)
        .overlay(
            Group {
                if !isLast {
                    Rectangle()
                        .fill(pageBg)
                        .frame(height: 1)
                }
            },
            alignment: .bottom
        )
    }
}

// MARK: - Settings Item Model
struct SettingsItem {
    let icon: String
    let title: String
    let subtitle: String?
}

// MARK: - Preview
struct AccountView_Previews: PreviewProvider {
    static var previews: some View {
        AccountView()
    }
}
