import Combine
import SwiftUI

// MARK: - Account View
struct AccountView: View {
    @ObservedObject private var authManager = AuthManager.shared
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
                                icon: "doc.text.fill", title: "Terms & Conditions", subtitle: nil),
                            isLast: false
                        )
                    }
                    .buttonStyle(PlainButtonStyle())

                    Button(action: { showPrivacy = true }) {
                        settingsRowContent(
                            item: SettingsItem(
                                icon: "hand.raised.fill", title: "Privacy Policy", subtitle: nil),
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
        .background(pageBg)
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
            SmartBasketView()
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
    }

    // MARK: - Header Section
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(authManager.currentUser?.name ?? "User")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(darkText)

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
        .background(headerBg)
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
                // Placeholder or another future link
                Spacer().frame(maxWidth: .infinity)
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
