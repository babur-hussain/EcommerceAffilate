import SwiftUI

struct InfluencersPageView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    @State private var selectedCategory: String = "All"

    // Mock Data
    let categories = ["All", "Fashion", "Tech", "Beauty", "Fitness", "Lifestyle", "Gaming"]

    let trending: [Influencer] = [
        Influencer(
            id: "1", name: "Alisha Keys", handle: "@alishastyle",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
            category: "Fashion"),
        Influencer(
            id: "2", name: "David Miller", handle: "@techdavid",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
            category: "Tech"),
        Influencer(
            id: "3", name: "Sarah Jones", handle: "@sarahglam",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
            category: "Beauty"),
    ]

    let featured: [FeaturedContent] = [
        FeaturedContent(
            id: "1", title: "Summer Essentials", influencer: "Alisha Keys", influencerInitial: "A",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            likes: "12K"),
        FeaturedContent(
            id: "2", title: "Tech Review 2024", influencer: "David Miller", influencerInitial: "D",
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
            likes: "8.5K"),
        FeaturedContent(
            id: "3", title: "Morning Routine", influencer: "Sarah Jones", influencerInitial: "S",
            image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
            likes: "22K"),
    ]

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .top) {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 0) {
                        // Space for fixed header
                        Color.clear.frame(height: 220)

                        // Categories
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                ForEach(categories, id: \.self) { category in
                                    Button(action: {
                                        selectedCategory = category
                                    }) {
                                        Text(category)
                                            .font(
                                                .system(
                                                    size: 14,
                                                    weight: selectedCategory == category
                                                        ? .bold : .semibold)
                                            )
                                            .foregroundColor(
                                                selectedCategory == category
                                                    ? .black : Color(hex: "#888888")
                                            )
                                            .padding(.horizontal, 20)
                                            .padding(.vertical, 10)
                                            .background(
                                                selectedCategory == category
                                                    ? Color(hex: "#CCFF00") : Color(hex: "#1A1A1A")
                                            )
                                            .cornerRadius(100)
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 100)
                                                    .stroke(
                                                        selectedCategory == category
                                                            ? Color(hex: "#CCFF00")
                                                            : Color(hex: "#333333"), lineWidth: 1)
                                            )
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        .padding(.top, 70)
                        .padding(.bottom, 30)

                        // Trending Section
                        VStack(alignment: .leading, spacing: 16) {
                            HStack {
                                Text("TRENDING NOW")
                                    .font(.system(size: 18, weight: .heavy))
                                    .foregroundColor(.white)
                                    .tracking(1)
                                Spacer()
                                Button("See All") {}
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(Color(hex: "#666666"))
                            }
                            .padding(.horizontal, 20)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    ForEach(trending) { item in
                                        InfluencerTrendingCard(item: item)
                                    }
                                }
                                .padding(.horizontal, 20)
                            }
                        }
                        .padding(.bottom, 30)

                        // Featured Section
                        VStack(alignment: .leading, spacing: 20) {
                            Text("FRESH DROPS")
                                .font(.system(size: 18, weight: .heavy))
                                .foregroundColor(.white)
                                .tracking(1)
                                .padding(.horizontal, 20)

                            ForEach(featured) { item in
                                InfluencerFeaturedCard(item: item)
                            }
                        }
                        .padding(.bottom, 100)
                    }
                    .frame(width: geometry.size.width)
                }
                .frame(width: geometry.size.width)

                // Fixed Header
                InfluencersHeader()
                    .frame(width: geometry.size.width)
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
        }
        .ignoresSafeArea()
    }
}

// MARK: - Components

struct InfluencersHeader: View {

    var body: some View {
        VStack(spacing: 0) {
            // Top Tabs (Shopping, Services, Grocery, Influencers)
            TopCategoryBoxesView(
                activeBgColor: Color(hex: "#CCFF00"),
                inactiveBgColor: Color.white.opacity(0.1),
                activeTextColor: .black,
                inactiveTextColor: .white
            )

            // Join Creator's Squad Section (Only for Customers or Guests)
            if AuthManager.shared.currentUser?.role != "INFLUENCER" {
                JoinCreatorSquadBanner()
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)
            }

            // Search Bar
            HStack(spacing: 12) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                    Text("Search creators...")
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                    Spacer()
                }
                .padding(.horizontal, 14)
                .frame(height: 46)
                .background(Color.white.opacity(0.1))
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.white.opacity(0.2), lineWidth: 1)
                )
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 12)
        }
        .padding(.top, 60)  // Safe area padding for status bar
        .background(Color.black.ignoresSafeArea())
    }
}

struct InfluencerTrendingCard: View {
    let item: Influencer

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            AsyncImage(url: URL(string: item.image)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Color(hex: "#1E1E1E")
            }
            .frame(width: 160, height: 220)
            .clipped()

            LinearGradient(
                colors: [.clear, .black.opacity(0.8), .black], startPoint: .top, endPoint: .bottom
            )
            .frame(height: 130)

            VStack(alignment: .leading, spacing: 4) {
                Text(item.name)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                Text(item.handle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#AAAAAA"))

                Text(item.category)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.white.opacity(0.2))
                    .cornerRadius(4)
                    .padding(.top, 4)
            }
            .padding(12)
        }
        .frame(width: 160, height: 220)
        .background(Color(hex: "#1E1E1E"))
        .cornerRadius(20)
    }
}

struct InfluencerFeaturedCard: View {
    let item: FeaturedContent

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            AsyncImage(url: URL(string: item.image)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Color(hex: "#1A1A1A")
            }
            .frame(height: 400)
            .clipped()

            LinearGradient(
                colors: [.clear, .black.opacity(0.6), .black.opacity(0.9)], startPoint: .top,
                endPoint: .bottom)

            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    HStack(spacing: 8) {
                        Text(item.influencerInitial)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.black)
                            .frame(width: 32, height: 32)
                            .background(Color(hex: "#CCFF00"))
                            .clipShape(Circle())

                        Text(item.influencer)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                    }

                    Spacer()

                    HStack(spacing: 4) {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#FF4B4B"))
                        Text(item.likes)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.black.opacity(0.5))
                    .clipShape(Capsule())
                }

                Text(item.title)
                    .font(.system(size: 28, weight: .heavy))
                    .foregroundColor(.white)
                    .italic()

                Button(action: {}) {
                    HStack {
                        Text("SHOP COLLECTION")
                            .font(.system(size: 14, weight: .heavy))
                            .foregroundColor(.black)
                            .tracking(1)
                        Image(systemName: "arrow.right")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.black)
                    }
                    .padding(.vertical, 14)
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
                    .cornerRadius(12)
                }
            }
            .padding(24)
        }
        .frame(height: 400)
        .background(Color(hex: "#1A1A1A"))
        .cornerRadius(30)
        .padding(.horizontal, 20)
    }
}

// MARK: - Models

struct Influencer: Identifiable {
    let id: String
    let name: String
    let handle: String
    let image: String
    let category: String
}

struct FeaturedContent: Identifiable {
    let id: String
    let title: String
    let influencer: String
    let influencerInitial: String
    let image: String
    let likes: String
}

struct JoinCreatorSquadBanner: View {
    @State private var showRegistrationSheet = false

    var body: some View {
        Button(action: { showRegistrationSheet = true }) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Join the Creator's Squad")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)

                    Text("High referral commission & earnings on every order.")
                        .font(.system(size: 11))
                        .foregroundColor(.white.opacity(0.9))
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                }

                Spacer()

                Text("Join")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#E94057"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.white)
                    .cornerRadius(20)
            }
            .padding(16)
            .background(
                LinearGradient(
                    colors: [Color(hex: "#FF416C"), Color(hex: "#FF4B2B")],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(16)
            .shadow(color: Color(hex: "#FF416C").opacity(0.3), radius: 8, x: 0, y: 4)
        }
        .sheet(isPresented: $showRegistrationSheet) {
            InfluencerRegistrationSheet()
        }
    }
}
