import SwiftUI

// MARK: - Types

enum TabType: String, CaseIterable, Identifiable {
    case shopping = "Shopping"
    case services = "Services"
    case grocery = "Grocery"
    case influencers = "Influencers"
    
    var id: String { rawValue }
    
    var iconName: String {
        switch self {
        case .shopping: return "bag.fill"
        case .services: return "building.2.fill"
        case .grocery: return "basket.fill"
        case .influencers: return "person.3.fill"
        }
    }
    
    var color: Color {
        switch self {
        case .shopping: return Color(hex: "#2563EB")
        case .services: return Color(hex: "#7C3AED")
        case .grocery: return Color(hex: "#10B981")
        case .influencers: return Color(hex: "#EC4899")
        }
    }
}

struct CategoryItem: Identifiable {
    let id: String
    let name: String
    let icon: String // SF Symbol name
}

// MARK: - TopCategoryBoxesView

// MARK: - TopCategoryBoxesView

// MARK: - TopCategoryBoxesView

struct TopCategoryBoxesView: View {
    @Binding var activeTab: TabType
    
    var body: some View {
        HStack(spacing: 0) { // Reduced spacing, using frame to distribute
            ForEach(TabType.allCases) { tab in
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        activeTab = tab
                    }
                }) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(activeTab == tab ? Color(hex: "#FFD700") : Color.white)
                            .shadow(color: .black.opacity(0.1), radius: 3, y: 2)
                        
                        VStack(spacing: 2) {
                            Image(systemName: tab.iconName)
                                .font(.system(size: 24))
                                .foregroundColor(activeTab == tab ? tab.color : tab.color)
                            
                            Text(tab.rawValue)
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "#111827"))
                                .lineLimit(1)
                                .minimumScaleFactor(0.8)
                        }
                        .padding(.vertical, 4)
                    }
                    .frame(height: 50)
                    .padding(.horizontal, 4)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 8)
    }
}

// MARK: - LocationBarView

struct LocationBarView: View {
    var body: some View {
        HStack {
            HStack(spacing: 8) {
                // Pin Icon
                Image(systemName: "location.fill")
                    .foregroundColor(.white)
                    .font(.system(size: 16))
                    .rotationEffect(.degrees(45)) // Angled pin
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("CURRENT LOCATION")
                        .font(.system(size: 9, weight: .heavy))
                        .foregroundColor(Color(hex: "#FFD700"))
                        .tracking(0.5)
                    
                    HStack(spacing: 4) {
                        Text("New York, USA")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                        
                        Image(systemName: "chevron.down")
                            .foregroundColor(.white)
                            .font(.system(size: 12, weight: .bold))
                    }
                }
                
                Spacer()
            }
            
            // Points Badge
            HStack(spacing: 6) {
                Image(systemName: "star.circle.fill")
                    .foregroundColor(Color(hex: "#FFFFFF"))
                    .font(.system(size: 14))
                Text("0")
                    .font(.system(size: 14, weight: .heavy))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Color.white.opacity(0.2))
            .cornerRadius(20) // More rounded pill
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10) // Taller bar
        .background(Color(hex: "#A0522D"))
        .cornerRadius(10) // Slightly more rounded corners
        .padding(.horizontal, 16)
        .padding(.vertical, 4)
    }
}

// MARK: - SearchBarView

struct SearchBarView: View {
    var body: some View {
        HStack(spacing: 12) {
            // Main Search Input
            HStack(spacing: 10) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color(hex: "#9CA3AF"))
                Text("Search products...")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "#9CA3AF"))
                Spacer()
            }
            .padding(.horizontal, 14)
            .frame(height: 46) // Taller search bar
            .background(Color.white)
            .cornerRadius(10)
            
            // Scan Button
            Button(action: {}) {
                Image(systemName: "qrcode.viewfinder")
                    .font(.system(size: 22))
                    .foregroundColor(Color(hex: "#FF6B00"))
                    .frame(width: 46, height: 46)
                    .background(Color.white)
                    .cornerRadius(10)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}

// MARK: - CategoriesSliderView

struct CategoriesSliderView: View {
    @Binding var selectedCategory: String
    
    // Updated icon mapping to look more premium
    let categories: [CategoryItem] = [
        CategoryItem(id: "1", name: "For You", icon: "tag.fill"),
        CategoryItem(id: "2", name: "Fashion", icon: "tshirt.fill"),
        CategoryItem(id: "3", name: "Mobiles", icon: "iphone"),
        CategoryItem(id: "4", name: "Beauty", icon: "face.smiling"),
        CategoryItem(id: "5", name: "Electronics", icon: "laptopcomputer"),
        CategoryItem(id: "6", name: "Home", icon: "house.fill"),
        CategoryItem(id: "7", name: "Appliances", icon: "washer"),
        CategoryItem(id: "8", name: "Toys", icon: "gamecontroller.fill"),
        CategoryItem(id: "9", name: "Food & Health", icon: "fork.knife"),
        CategoryItem(id: "10", name: "Auto", icon: "car.fill"),
        CategoryItem(id: "11", name: "Sports", icon: "sportscourt.fill"),
        CategoryItem(id: "12", name: "Books", icon: "book.fill"),
        CategoryItem(id: "13", name: "Furniture", icon: "sofa.fill")
    ]
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 24) { // Increased spacing between items
                ForEach(categories) { category in
                    Button(action: {
                        withAnimation {
                            selectedCategory = category.name
                        }
                    }) {
                        VStack(spacing: 8) {
                            // Icon Container
                            ZStack {
                                Image(systemName: category.icon)
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                            }
                            .frame(height: 30) // Fixed height for icon area
                            
                            // Text
                            Text(category.name)
                                .font(.system(size: 14, weight: selectedCategory == category.name ? .bold : .medium))
                                .foregroundColor(selectedCategory == category.name ? .white : .white.opacity(0.8))
                        }
                        .padding(.horizontal, 4)
                        .padding(.bottom, 12)
                        .overlay(
                            VStack {
                                Spacer()
                                if selectedCategory == category.name {
                                    Rectangle()
                                        .fill(Color.white)
                                        .frame(height: 3)
                                }
                            }
                        )
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 4)
        }
    }
}

// MARK: - Header Parts

struct HomeTopHeaderView: View {
    @Binding var activeTab: TabType
    
    var body: some View {
        VStack(spacing: 0) {
            // Top Tab Switcher
            TopCategoryBoxesView(activeTab: $activeTab)
                //.padding(.top, 54) // Moved handling to ContentView to avoid double padding logic
            
            // Location Bar
            LocationBarView()
        }
        .background(
           // Use the top part of the gradient or a solid color that matches
           Color(hex: "#c21500")
        )
    }
}

struct HomeStickyHeaderView: View {
    @Binding var selectedCategory: String
    
    var body: some View {
        VStack(spacing: 0) {
            // Search Bar
            SearchBarView()
                .padding(.top, 4)
            
            // Categories Slider
            CategoriesSliderView(selectedCategory: $selectedCategory)
        }
        .padding(.bottom, 8)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(hex: "#c21500"),
                    Color(hex: "#E06D00")
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}

// Legacy wrapper for compatibility if needed elsewhere
struct HomeHeaderView: View {
    @State private var activeTab: TabType = .shopping
    @State private var selectedCategory: String = "For You"
    
    var body: some View {
        VStack(spacing: 0) {
            HomeTopHeaderView(activeTab: $activeTab)
                .padding(.top, 54)
            HomeStickyHeaderView(selectedCategory: $selectedCategory)
        }
    }
}

