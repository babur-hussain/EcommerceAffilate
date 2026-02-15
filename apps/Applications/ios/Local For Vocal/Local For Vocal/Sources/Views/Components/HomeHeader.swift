import SwiftUI
import UIKit

// MARK: - Types

// Helper for Color to avoid init conflicts
// Moved to Extensions.swift

// TabType moved to Models/AppTypes.swift

struct CategoryItem: Identifiable {
    let id: String
    let name: String
    let icon: String
}

// MARK: - TopCategoryBoxesView

struct TopCategoryBoxesView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    var activeBgColor: Color = Color(hex: "#FFD700")
    var inactiveBgColor: Color = Color.white
    var activeTextColor: Color = Color(hex: "#111827")
    var inactiveTextColor: Color = Color(hex: "#111827")

    // Icon customization
    var useTabColorForIcon: Bool = true
    var activeIconColor: Color = .black
    var inactiveIconColor: Color = .gray

    // Layout customization
    var forceEqualWidth: Bool = false

    private var activeTab: TabType { navigationManager.activeTab }

    var body: some View {
        GeometryReader { geometry in
            let horizontalPadding: CGFloat = 16
            let spacing: CGFloat = 8
            let availableWidth = geometry.size.width - (horizontalPadding * 2)
            // 4 items, 3 spaces of 8px = 24px total spacing
            // itemWidth = (availableWidth - 24) / 4
            let itemWidth = (availableWidth - (spacing * 3)) / 4

            HStack(spacing: spacing) {
                ForEach(TabType.allCases) { tab in
                    Button(action: {
                        HapticManager.shared.selection()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            // Use route-based navigation
                            navigationManager.navigate(to: tab.rawValue.lowercased())
                        }
                    }) {
                        ZStack {
                            RealAppleGlass(cornerRadius: 12)
                                .shadow(color: .black.opacity(0.1), radius: 3, y: 2)

                            VStack(spacing: 4) {
                                Image(systemName: tab.iconName)
                                    .font(.system(size: 20, weight: .semibold))
                                    .foregroundColor(.white)
                                    .symbolEffect(.bounce, value: activeTab == tab)  // iOS 17+ symbol effect

                                Text(tab.rawValue)
                                    .font(.system(size: 10, weight: .bold))  // Slightly larger text
                                    .foregroundColor(.white)
                                    .lineLimit(1)
                                    .minimumScaleFactor(0.8)
                            }
                            .padding(.vertical, 6)
                        }
                        .frame(width: itemWidth, height: 60)  // Fixed height, slightly taller
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(ScaleButtonStyle())  // Add scale effect on press
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.top, 10)
            .padding(.bottom, 2)
            .padding(.horizontal, horizontalPadding)
        }
        .frame(height: 72)  // Adjusted height
    }
}

// Button Style for press animation
struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - SearchBarView

struct SearchBarView: View {
    @State private var isSearching = false

    var body: some View {
        HStack(spacing: 12) {
            // Main Search Input
            Button(action: {
                isSearching = true
            }) {
                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(.white)
                    Text("Search products...")
                        .font(.system(size: 15))
                        .foregroundColor(.white)
                    Spacer()

                    // Voice Search Separator & Icon
                    Rectangle()
                        .fill(Color.white.opacity(0.3))
                        .frame(width: 1, height: 24)

                    Image(systemName: "mic.fill")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 14)
                .frame(height: 46)
                .background(
                    RealAppleGlass(style: .systemChromeMaterial, cornerRadius: 23)
                )
            }
            .buttonStyle(PlainButtonStyle())
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .fullScreenCover(isPresented: $isSearching) {
            GlobalSearchView()
        }
    }
}

// MARK: - CategoriesSliderView

struct CategoriesSliderView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    var showIcons: Bool = true

    let categories: [CategoryItem] = [
        CategoryItem(id: "1", name: "For You", icon: "tag.fill"),
        CategoryItem(id: "2", name: "Ramadan", icon: "moon.stars.fill"),
        CategoryItem(id: "3", name: "Fashion", icon: "tshirt.fill"),
        CategoryItem(id: "4", name: "Mobiles", icon: "iphone"),
        CategoryItem(id: "5", name: "Beauty", icon: "face.smiling"),
        CategoryItem(id: "6", name: "Electronics", icon: "laptopcomputer"),
        CategoryItem(id: "7", name: "Home", icon: "house.fill"),
        CategoryItem(id: "8", name: "Appliances", icon: "washer"),
        CategoryItem(id: "9", name: "Toys", icon: "gamecontroller.fill"),
        CategoryItem(id: "10", name: "Food & Health", icon: "fork.knife"),
        CategoryItem(id: "11", name: "Dry Fruits", icon: "leaf.fill"),
        CategoryItem(id: "12", name: "Auto", icon: "car.fill"),
        CategoryItem(id: "13", name: "Sports", icon: "sportscourt.fill"),
        CategoryItem(id: "14", name: "Books", icon: "book.fill"),
        CategoryItem(id: "15", name: "Furniture", icon: "sofa.fill"),
        CategoryItem(id: "16", name: "Jewellery", icon: "sparkles"),
    ]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 24) {
                ForEach(categories) { category in
                    Button(action: {
                        HapticManager.shared.selection()
                        withAnimation {
                            navigationManager.selectedCategory = category.name
                        }
                    }) {
                        VStack(spacing: 8) {
                            if showIcons {
                                ZStack {
                                    Image(systemName: category.icon)
                                        .font(.system(size: 24))
                                        .foregroundColor(.white)
                                }
                                .frame(height: 30)
                                .transition(.opacity.combined(with: .scale))
                            }

                            Text(category.name)
                                .font(
                                    .system(
                                        size: 14,
                                        weight: navigationManager.selectedCategory == category.name
                                            ? .bold : .medium)
                                )
                                .foregroundColor(
                                    navigationManager.selectedCategory == category.name
                                        ? .white : .white.opacity(0.8)
                                )
                        }
                        .padding(.horizontal, 4)
                        .padding(.bottom, 12)
                        .overlay(
                            VStack {
                                Spacer()
                                if navigationManager.selectedCategory == category.name {
                                    Rectangle()
                                        .fill(Color.white)
                                        .frame(height: 3)
                                }
                            }
                        )
                        .contentShape(Rectangle())
                    }
                    // .skeleton(isLoading: false)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 4)
        }
    }
}

// MARK: - Header Parts

struct HomeTopHeaderView: View {
    var theme: HomeHeaderTheme
    var safeAreaTop: CGFloat = 47
    @EnvironmentObject var locationManager: LocationManager

    var body: some View {
        VStack(spacing: 0) {
            // Transparent background layer for status bar spacing
            Color.clear.frame(height: safeAreaTop)

            TopCategoryBoxesView()

            LocationBarView(onTap: {
                withAnimation {
                    locationManager.showAddressSelector = true
                }
            })
        }
    }
}

struct HomeStickyHeaderView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    @Binding var showIcons: Bool
    var theme: HomeHeaderTheme
    var safeAreaTop: CGFloat = 47
    var headerHeight: CGFloat = 0
    var scrollOffset: CGFloat = 0  // Passed from parent

    var body: some View {
        // Calculate progressive opacity
        // 0 at top (offset 0), 1 at scroll -100 (or adjustable threshold)
        let threshold: CGFloat = 100
        let glassOpacity = min(1.0, max(0.0, -scrollOffset / threshold))

        return VStack(spacing: 0) {
            SearchBarView()
                .padding(.top, 2)

            CategoriesSliderView(showIcons: showIcons)
        }
        .padding(.top, safeAreaTop)
        .background(
            Group {
                RealAppleGlass(style: .systemUltraThinMaterial)
                    .ignoresSafeArea(edges: .top)
                    .frame(height: max(headerHeight, safeAreaTop + 50) + 60)
                    .overlay(
                        Color.white.opacity(0.1)
                            .allowsHitTesting(false)
                    )
                    .opacity(glassOpacity)  // Progressive opacity
            },
            alignment: .bottom
        )
    }
}

struct HomeHeaderView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    @State private var showIcons: Bool = true
    var safeAreaTop: CGFloat = 47

    var body: some View {
        let theme = DefaultHomeHeaderTheme(showIcons: showIcons)
        VStack(spacing: 0) {
            HomeTopHeaderView(theme: theme)
            HomeStickyHeaderView(
                showIcons: $showIcons,
                theme: theme
            )
        }
    }
}
