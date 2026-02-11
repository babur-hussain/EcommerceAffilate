import SwiftUI

struct GroceryPageView: View {
    @Binding var activeTab: TabType
    @State private var searchText = ""
    @EnvironmentObject var basketManager: BasketManager

    // For typing animation
    @State private var typingText = ""
    private let fullText = "Lowest price..."
    @State private var isDeleting = false

    @State private var isSearching = false
    @State private var scrollOffset: CGFloat = 0
    @State private var refreshID = UUID()

    var body: some View {
        ZStack(alignment: .top) {
            // ── Yellow-to-White Gradient Background ──
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(hex: "#FFF8E7"),  // Warm yellow top
                    Color(hex: "#FFFDF5"),  // Light transition
                    Color.white,  // White bottom
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            ScrollView {
                LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                    // ── Scrollable Header (tabs + location) ──
                    // This scrolls away with content
                    GroceryStaticHeader(activeTab: $activeTab)

                    Section(
                        header:
                            VStack(spacing: 0) {
                                GroceryStickyHeader(
                                    text: $searchText,
                                    onSearchTap: {
                                        isSearching = true
                                    }
                                )
                            }
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: "#FFF8E7"))
                            .ignoresSafeArea(edges: .top)
                            .zIndex(100)
                            .shadow(color: Color.black.opacity(0.05), radius: 3, x: 0, y: 2)
                    ) {
                        // Main Content Driven by SDUI
                        VStack(spacing: 0) {
                            SDUIPage(slug: "grocery")
                                .id(refreshID)  // Force recreation on refresh
                        }
                        .padding(.top, 16)
                        .padding(.bottom, 100)
                        .zIndex(-1)
                    }
                }
            }
            .refreshable {
                // Hard refresh: Clear cache and force reload
                await SDUICacheManager.shared.invalidate(slug: "grocery")
                try? await Task.sleep(nanoseconds: 500_000_000)  // Small delay for UX
                await MainActor.run {
                    refreshID = UUID()
                }
            }

            // ── Fixed Status Bar Background ──
            Color(hex: "#FFF8E7")
                .ignoresSafeArea(edges: .top)
                .frame(height: 0)  // Allows it to extend only into the safe area
                .zIndex(200)
        }
        .onAppear {
            startTypingAnimation()
        }
        .fullScreenCover(isPresented: $isSearching) {
            GroceryGlobalSearchView()
        }
    }

    func startTypingAnimation() {
        Timer.scheduledTimer(withTimeInterval: 0.15, repeats: true) { timer in
            if !isDeleting {
                if typingText.count < fullText.count {
                    let index = fullText.index(fullText.startIndex, offsetBy: typingText.count)
                    typingText.append(fullText[index])
                } else {
                    // Wait before deleting
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        isDeleting = true
                    }
                }
            } else {
                if !typingText.isEmpty {
                    typingText.removeLast()
                } else {
                    isDeleting = false
                }
            }
        }
    }
}

// MARK: - Subcomponents

struct GroceryStaticHeader: View {
    @Binding var activeTab: TabType

    var body: some View {
        VStack(spacing: 0) {
            // Top Tab Switcher
            TopCategoryBoxesView(activeTab: $activeTab)

            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "house.fill")
                        .foregroundColor(Color(hex: "#8B6914"))
                        .font(.system(size: 16))

                    Text("WORK")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "#8B6914"))

                    Text("Select your location")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B5720"))
                        .lineLimit(1)

                    Image(systemName: "chevron.right")
                        .foregroundColor(Color(hex: "#8B6914"))
                        .font(.system(size: 14))
                }

                Spacer()

                HStack(spacing: 4) {
                    Text("\(Date().formatted(.dateTime.day()))")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                    Text(Date().formatted(.dateTime.month()))
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                    Text(Date().formatted(.dateTime.weekday()))
                        .font(.system(size: 9))
                        .foregroundColor(.white.opacity(0.9))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color(hex: "#FF9800"))
                .cornerRadius(8)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(hex: "#FFF8E7"))
        }
    }
}

struct GroceryStickyHeader: View {
    @Binding var text: String
    var onSearchTap: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onSearchTap) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(Color(hex: "#9CA3AF"))
                    Text("Search for atta, dal, oil...")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#6B7280"))  // Placeholder gray
                    Spacer()
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .background(Color.white)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                )
                .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
            }
            .buttonStyle(PlainButtonStyle())

            Button(action: onSearchTap) {  // Mic also triggers search
                Image(systemName: "mic.fill")
                    .foregroundColor(Color(hex: "#FF9800"))
                    .frame(width: 46, height: 46)
                    .background(Color.white)
                    .cornerRadius(10)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                    )
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Color(hex: "#FFF8E7"))
    }
}

struct GroceryHeroBanner: View {
    let typingText: String

    var body: some View {
        ZStack {
            // Background Image/Color
            AsyncImage(
                url: URL(
                    string:
                        "https://res.cloudinary.com/deljcbcvu/image/upload/v1768337045/Grocery_Offer_Backgroung_krgtp0.jpg"
                )
            ) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Color(hex: "#FF9800")
            }
            .frame(minHeight: 280)
            .cornerRadius(16)
            .clipped()

            VStack(spacing: 20) {
                // Typing Text
                VStack(spacing: 0) {
                    Text(typingText + "|")
                        .font(.custom("Snell Roundhand", size: 38))  // Or system serif/cursive
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .shadow(color: Color.black.opacity(0.4), radius: 4, x: 1, y: 1)
                }
                .frame(height: 55)

                // Categories
                HStack(spacing: 12) {
                    GrocerySubCategoryCard(
                        title: "Winter Essential",
                        discount: "Up to 70% off",
                        color: "#1B5E20",
                        iconUrl:
                            "https://res.cloudinary.com/deljcbcvu/image/upload/v1768339003/products/z9nxbc93hgfkkogpflbk.png"
                    )
                    GrocerySubCategoryCard(
                        title: "Snack & Sip",
                        discount: "Up to 50% off",
                        color: "#1B5E20",
                        iconUrl:
                            "https://res.cloudinary.com/deljcbcvu/image/upload/v1768339123/products/nn8po2g34ud2irlriuxl.png"
                    )
                    GrocerySubCategoryCard(
                        title: "Cooking Corner",
                        discount: "Up to 40% off",
                        color: "#1B5E20",
                        iconUrl:
                            "https://res.cloudinary.com/deljcbcvu/image/upload/v1768339216/products/kxl5ejlw3jyuxicbdimo.png"
                    )
                }
            }
            .padding(20)
        }
    }
}

struct GrocerySubCategoryCard: View {
    let title: String
    let discount: String
    let color: String
    let iconUrl: String

    var body: some View {
        VStack(spacing: 8) {
            Text(discount)
                .font(.system(size: 9, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color(hex: color))
                .cornerRadius(4)

            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Color(hex: "#333"))
                .multilineTextAlignment(.center)

            // Icon
            AsyncImage(url: URL(string: iconUrl)) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                Circle()
                    .fill(Color(hex: "#F3F4F6"))
            }
            .frame(width: 50, height: 50)
        }
        .padding(10)
        .background(Color.white)
        .cornerRadius(12)
        .frame(maxWidth: .infinity)
        .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
}

struct GrocerySectionPlaceholder: View {
    let title: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "#111827"))
                .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(0..<4) { _ in
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.white)
                            .frame(width: 140, height: 180)
                            .overlay(
                                VStack {
                                    Rectangle().fill(color.opacity(0.1)).frame(height: 100)
                                    Spacer()
                                    Text("Product")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundColor(Color(hex: "#1F2937"))
                                    Text("₹99")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(Color(hex: "#111827"))
                                    Spacer()
                                }
                                .cornerRadius(12)
                            )
                            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
    }
}
