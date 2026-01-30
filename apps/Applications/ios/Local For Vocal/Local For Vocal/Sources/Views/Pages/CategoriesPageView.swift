import SwiftUI

struct CategoriesPageView: View {
    @State private var categories: [CategoryModel] = []
    @State private var isLoading = true
    @State private var selectedCategoryId: String = "for-you-special-id"
    @State private var expandedGroups: [String: Bool] = [:]

    // Sidebar Width
    private let sidebarWidth: CGFloat = 90
    private let FOR_YOU_ID = "for-you-special-id"

    // Computed Properties
    private var sidebarCategories: [CategoryModel] {
        categories.filter { $0.parentCategory == nil }
    }

    private var subCategories: [CategoryModel] {
        categories.filter { $0.parentCategory == selectedCategoryId }
    }

    var body: some View {
        HStack(spacing: 0) {
            // Left Sidebar
            sidebarView

            // Right Content Area
            contentAreaView
        }
        .onAppear {
            loadCategories()
        }
    }

    private func loadCategories() {
        Task {
            do {
                self.categories = try await APIService.shared.fetchCategories()
                self.isLoading = false
            } catch {
                print("Failed to load categories: \(error)")
                self.isLoading = false
            }
        }
    }

    // MARK: - Sidebar
    private var sidebarView: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 0) {
                // For You Item
                sidebarItem(
                    id: FOR_YOU_ID,
                    name: "For You",
                    icon: "tag.fill",  // SF Symbol alternative to local-offer
                    isCustom: true
                )

                // Category Items
                ForEach(sidebarCategories) { category in
                    sidebarItem(
                        id: category.id,
                        name: category.name,
                        imageUrl: category.image,
                        icon: category.icon,
                        fallbackChar: String(category.name.prefix(1))
                    )
                }
            }
            .padding(.bottom, 20)
        }
        .frame(width: sidebarWidth)
        .background(Color(hex: "#F0F2F5"))
        .overlay(
            Rectangle()
                .frame(width: 1)
                .foregroundColor(Color(hex: "#E5E7EB")),
            alignment: .trailing
        )
    }

    private func sidebarItem(
        id: String, name: String, imageUrl: String? = nil, icon: String? = nil,
        fallbackChar: String? = nil, isCustom: Bool = false
    ) -> some View {
        let isSelected = selectedCategoryId == id

        return Button(action: {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedCategoryId = id
                // Reset expansions when switching
                expandedGroups = [:]
            }
        }) {
            ZStack(alignment: .leading) {
                // Background
                if isSelected {
                    Color.white
                }

                // Content
                VStack(spacing: 6) {
                    // Icon/Image Circle
                    ZStack {
                        // Priority 1: Image URL
                        // Priority 2: Icon URL
                        // Priority 3: Icon SF Symbol (if not URL)
                        // Priority 4: Fallback Char

                        let displayImageUrl: String? = {
                            if let img = imageUrl, !img.isEmpty { return img }
                            if let ico = icon, !ico.isEmpty,
                                ico.hasPrefix("http") || ico.hasPrefix("/")
                            {
                                return ico
                            }
                            return nil
                        }()

                        if let validImage = displayImageUrl {
                            let validUrlString: String = {
                                if validImage.hasPrefix("http") {
                                    return validImage
                                } else {
                                    return "\(APIService.shared.imageHost)\(validImage)"
                                }
                            }()

                            if let url = URL(string: validUrlString) {
                                AsyncImage(url: url) { phase in
                                    if let image = phase.image {
                                        image.resizable().aspectRatio(contentMode: .fill)
                                    } else {
                                        // Placeholder / Loading
                                        Color.gray.opacity(0.1)
                                    }
                                }
                            }
                        } else if let icon = icon, !icon.isEmpty {
                            // Valid icon string but not a URL -> assume SF Symbol
                            Image(systemName: icon)
                                .font(.system(size: 20))
                                .foregroundColor(Color(hex: "#0284C7"))
                        } else {
                            // Fallback Char
                            Text(fallbackChar ?? "?")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                        }
                    }
                    .frame(width: 50, height: 50)
                    .background(
                        isCustom ? Color(hex: "#E0F2FE") : Color(hex: "#F3F4F6")
                    )
                    .clipShape(Circle())

                    // Text
                    Text(name)
                        .font(.system(size: 11, weight: isSelected ? .bold : .regular))
                        .foregroundColor(isSelected ? Color(hex: "#2874F0") : Color(hex: "#4B5563"))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .padding(.horizontal, 2)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)

                // Selection Indicator Bar
                if isSelected {
                    Rectangle()
                        .fill(Color(hex: "#2874F0"))
                        .frame(width: 4)
                        .cornerRadius(2, corners: [.topRight, .bottomRight])
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Content Area
    private var contentAreaView: some View {
        ZStack {
            Color.white.ignoresSafeArea()

            if selectedCategoryId == FOR_YOU_ID {
                ForYouContentView()
            } else {
                CategoryRightPaneView(
                    categoryId: selectedCategoryId,
                    categoryName: categories.first(where: { $0.id == selectedCategoryId })?.name,
                    subCategoriesFromParent: subCategories
                )
                .id(selectedCategoryId)  // Force recreate on category change
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Content Components

struct ForYouContentView: View {
    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 24) {

                // Popular Store
                VStack(alignment: .leading, spacing: 16) {
                    Text("Popular Store")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    LazyVGrid(
                        columns: [
                            GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()),
                        ], spacing: 20
                    ) {
                        GridItemView(
                            title: "Coming soon!",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/2f85489d81944f0e.png?q=100"
                        )
                        GridItemView(
                            title: "Live now",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/43666d678be8c599.png?q=100"
                        )
                        GridItemView(
                            title: "Harvest deals",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/f18d2d6452292026.png?q=100"
                        )
                        GridItemView(
                            title: "Sale is Live",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/d96859345c292019.png?q=100"
                        )
                    }
                }

                // Recently Viewed
                VStack(alignment: .leading, spacing: 16) {
                    Text("Recently Viewed Stores")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            StoreCardView(
                                title: "Mobiles",
                                image:
                                    "https://rukminim1.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imaghx9qygjjg8hz.jpeg?q=70"
                            )
                            StoreCardView(
                                title: "Men's Clothing",
                                image:
                                    "https://rukminim1.flixcart.com/image/612/612/xif0q/shoe/7/z/r/8-white-leaf-8-urbanbox-white-original-imagvgf4cuzs2hrw.jpeg?q=70"
                            )
                            StoreCardView(
                                title: "Blankets",
                                image:
                                    "https://rukminim1.flixcart.com/image/612/612/kc54b0w0/blanket/q/d/a/ultra-soft-warm-single-bed-mink-blanket-for-winter-brown-original-imaftc6gh9z3z3gz.jpeg?q=70"
                            )
                        }
                    }
                }

                // Have you tried
                VStack(alignment: .leading, spacing: 16) {
                    Text("Have you tried?")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    LazyVGrid(
                        columns: [
                            GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()),
                        ], spacing: 20
                    ) {
                        GridItemView(
                            title: "Flipkart UPI",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/4890d7945d81b835.png?q=100",
                            isRound: true)
                        GridItemView(
                            title: "SuperCoin",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/913e9a786d149090.png?q=100",
                            isRound: true)
                        GridItemView(
                            title: "Plus Zone",
                            image:
                                "https://rukminim1.flixcart.com/fk-p-flap/100/100/image/21a5ebeb69248446.png?q=100",
                            isRound: true)
                    }
                }

                Spacer().frame(height: 100)
            }
            .padding(16)
        }
    }
}

// MARK: - Helper Views

// Keeping GridItemView and StoreCardView as they are used in ForYouContentView
struct GridItemView: View {
    let title: String
    let image: String
    var isRound: Bool = false

    var body: some View {
        VStack(spacing: 8) {
            AsyncImage(url: URL(string: image)) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                Color.gray.opacity(0.1)
            }
            .frame(width: 70, height: 70)
            .background(isRound ? Color(hex: "#F3F4F6") : Color.white)
            .clipShape(isRound ? AnyShape(Circle()) : AnyShape(Rectangle()))
            .cornerRadius(isRound ? 0 : 0)

            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "#1F2937"))
                .multilineTextAlignment(.center)
        }
    }
}

struct StoreCardView: View {
    let title: String
    let image: String

    var body: some View {
        VStack(spacing: 8) {
            AsyncImage(url: URL(string: image)) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                Color.gray.opacity(0.1)
            }
            .frame(width: 100, height: 100)

            Text(title)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "#374151"))
        }
        .padding(8)
        .frame(width: 120)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
        )
    }
}

// Helper for type erasure
struct AnyShape: Shape {
    private let _path: (CGRect) -> Path

    init<S: Shape>(_ wrapped: S) {
        _path = { rect in
            let path = wrapped.path(in: rect)
            return path
        }
    }

    func path(in rect: CGRect) -> Path {
        return _path(rect)
    }
}
