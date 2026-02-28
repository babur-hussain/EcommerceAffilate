import SwiftUI

struct GroceryTopPicksView: View {
    @State private var products: [Product] = []
    @State private var isLoading = true
    @State private var errorMessage: String?
    @Environment(\.presentationMode) var presentationMode

    // Grid layout
    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    // Custom Colors
    private let primaryColor = Color(red: 15 / 255, green: 189 / 255, blue: 73 / 255)  // #0fbd49
    private let backgroundLight = Color(red: 246 / 255, green: 248 / 255, blue: 246 / 255)  // #f6f8f6
    private let textDark = Color(red: 16 / 255, green: 34 / 255, blue: 22 / 255)  // #102216

    @EnvironmentObject var locationManager: LocationManager

    var body: some View {
        ZStack {
            // Background Color
            backgroundLight.ignoresSafeArea()

            // Status Bar Background (Solid Light Green to avoid overlap darkening)
            VStack {
                Color(red: 231 / 255, green: 248 / 255, blue: 237 / 255)
                    .frame(height: 100)  // Height for status bar + header top
                    .ignoresSafeArea()
                Spacer()
            }
            .zIndex(0)

            // Background Gradients
            GeometryReader { proxy in
                ZStack {
                    Circle()
                        .fill(primaryColor.opacity(0.05))
                        .frame(width: 256, height: 256)
                        .blur(radius: 80)
                        .position(x: proxy.size.width, y: 0)

                    Circle()
                        .fill(primaryColor.opacity(0.05))
                        .frame(width: 192, height: 192)
                        .blur(radius: 60)
                        .position(x: 0, y: proxy.size.height - 160)
                }
            }
            .ignoresSafeArea()
            .zIndex(0)

            // Main Content
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    // Location Bar
                    locationHeader
                        .padding(.bottom, 8)
                        .background(Color.white)
                        .zIndex(10)

                    // Header
                    headerSection

                    VStack(spacing: 20) {
                        // Editor's Choice Filter
                        editorsChoiceSection

                        // Product Grid
                        if isLoading {
                            loadingGrid
                        } else if let error = errorMessage {
                            errorView(message: error)
                        } else {
                            productGrid
                        }
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 100)
                }
            }
            .zIndex(1)

        }
        .navigationBarHidden(true)
        .onAppear {
            if products.isEmpty {
                loadProducts()
            }
            // Sync location
            locationManager.startUpdating()
        }
    }

    // MARK: - Header
    private var headerSection: some View {
        ZStack(alignment: .bottom) {
            VStack(alignment: .leading, spacing: 24) {
                // Top Bar: Back & Notification
                HStack {
                    Spacer()

                    NavigationLink(destination: GroceryGlobalSearchView()) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(red: 51 / 255, green: 65 / 255, blue: 85 / 255))
                            .frame(width: 40, height: 40)
                            .background(Color.white)
                            .clipShape(Circle())
                            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                    }
                }
                .padding(.top, 10)  // Just a bit of top padding inside scroll view

                // Title & Subtitle
                VStack(alignment: .leading, spacing: 8) {
                    Text("TOP ")
                        .font(.system(size: 36, weight: .black))  // Approx 4xl extrabold
                        .foregroundColor(textDark)
                        + Text("PICKS")
                        .font(.system(size: 36, weight: .black))
                        .foregroundColor(primaryColor)

                    Text("Curated daily by our experts for your premium lifestyle.")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#64748B"))  // Slate-500
                        .fixedSize(horizontal: false, vertical: true)
                        .frame(maxWidth: 220, alignment: .leading)
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 48)
            .background(
                BottomRoundedRectangle(radius: 40)
                    .fill(Color(red: 231 / 255, green: 248 / 255, blue: 237 / 255))
            )

            // 3D Basket Illustration (Placeholder)
            HStack {
                Spacer()
                ZStack {
                    Image(systemName: "basket.fill")  // Fallback/Placeholder
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 120, height: 120)  // Reduced size from 176
                        .foregroundColor(primaryColor.opacity(0.8))

                    // Badge
                    Image(systemName: "wand.and.stars")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                        .padding(8)
                        .background(primaryColor)
                        .clipShape(Circle())
                        .shadow(radius: 4)
                        .offset(x: -50, y: -50)
                }
                .offset(x: 0, y: -16)  // Reset to standard position, tweak later if needed
            }
        }
    }

    // MARK: - Editor's Choice
    private var editorsChoiceSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Editor's Choice")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(textDark)
                Spacer()
                Button("View All") {}
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(primaryColor)
            }
            .padding(.horizontal, 24)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    filterChip(title: "All Items", isSelected: true)
                    filterChip(title: "Fresh Fruits", isSelected: false)
                    filterChip(title: "Organic Dairy", isSelected: false)
                    filterChip(title: "Gourmet Snacks", isSelected: false)
                }
                .padding(.horizontal, 24)
            }
        }
    }

    private func filterChip(title: String, isSelected: Bool) -> some View {
        Text(title)
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(
                isSelected ? .white : Color(red: 71 / 255, green: 85 / 255, blue: 105 / 255)
            )  // Slate-600
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(isSelected ? primaryColor : Color(hex: "#F1F5F9"))  // Slate-100
            .clipShape(Capsule())
            .shadow(color: isSelected ? primaryColor.opacity(0.2) : .clear, radius: 4, x: 0, y: 2)
    }

    // MARK: - Product Grid
    private var productGrid: some View {
        LazyVGrid(columns: columns, spacing: 16) {
            ForEach(products) { product in
                NavigationLink(destination: GroceryProductDetailView(product: product)) {
                    TopPickProductCard(product: product)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 24)
    }

    private var loadingGrid: some View {
        LazyVGrid(columns: columns, spacing: 16) {
            ForEach(0..<6, id: \.self) { _ in
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
                    .frame(height: 260)
            }
        }
        .padding(.horizontal, 24)
    }

    private func errorView(message: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.largeTitle)
                .foregroundColor(.orange)
            Text(message)
                .font(.system(size: 16))
                .foregroundColor(.secondary)
            Button("Try Again") {
                loadProducts()
            }
            .padding(.top, 8)
        }
        .padding()
    }

    // MARK: - Data Fetching
    private func loadProducts() {
        isLoading = true
        errorMessage = nil

        Task {
            do {
                let fetchedProducts = try await APIService.shared.fetchGroceryProducts(limit: 50)
                await MainActor.run {
                    self.products = fetchedProducts
                    self.isLoading = false
                }
            } catch {
                AppLogger.debug("❌ [GroceryTopPicksView] Error: \(error)")
                await MainActor.run {
                    self.errorMessage = "Unable to load products."
                    self.isLoading = false
                }
            }
        }
    }

    // MARK: - Location Header
    private var locationHeader: some View {
        Button(action: {
            withAnimation {
                locationManager.showAddressSelector = true
            }
        }) {
            HStack(spacing: 8) {
                Image(systemName: "house.fill")
                    .foregroundColor(Color(red: 139 / 255, green: 105 / 255, blue: 20 / 255))  // #8B6914
                    .font(.system(size: 16))

                Text("HOME")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Color(red: 139 / 255, green: 105 / 255, blue: 20 / 255))  // #8B6914

                Text(
                    locationManager.address.isEmpty
                        ? "Select your location" : locationManager.address
                )
                .font(.system(size: 12))
                .foregroundColor(Color(red: 107 / 255, green: 87 / 255, blue: 32 / 255))  // #6B5720
                .lineLimit(1)

                Image(systemName: "chevron.right")
                    .foregroundColor(Color(red: 139 / 255, green: 105 / 255, blue: 20 / 255))  // #8B6914
                    .font(.system(size: 14))

                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color(red: 255 / 255, green: 248 / 255, blue: 231 / 255))  // #FFF8E7
        }
        .buttonStyle(.plain)
    }
}

// Custom Shape for Bottom Rounded Corners (No UIKit dependency)
struct BottomRoundedRectangle: Shape {
    var radius: CGFloat

    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - radius))
        path.addArc(
            center: CGPoint(x: rect.maxX - radius, y: rect.maxY - radius),
            radius: radius,
            startAngle: Angle(degrees: 0),
            endAngle: Angle(degrees: 90),
            clockwise: false)
        path.addLine(to: CGPoint(x: rect.minX + radius, y: rect.maxY))
        path.addArc(
            center: CGPoint(x: rect.minX + radius, y: rect.maxY - radius),
            radius: radius,
            startAngle: Angle(degrees: 90),
            endAngle: Angle(degrees: 180),
            clockwise: false)
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        return path
    }
}

// MARK: - TopPickProductCard
struct TopPickProductCard: View {
    let product: Product
    @EnvironmentObject var basketManager: BasketManager

    private let primaryColor = Color(hex: "#0fbd49")

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Container
            ZStack(alignment: .topLeading) {
                Color(hex: "#F8FAFC")  // Slate-50 background for image

                if let mainImage = product.images.first, let url = URL(string: mainImage) {
                    CachedAsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        ProgressView()
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                    .padding(8)
                } else {
                    Image(systemName: "photo")
                        .font(.system(size: 30))
                        .foregroundColor(Color.gray.opacity(0.3))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }

                // Badge
                Text("FRESHLY PICKED")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(primaryColor.opacity(0.9))
                    .cornerRadius(100)  // Capsule like
                    .padding(8)
            }
            .frame(height: 160)  // Aspect square approx for typical mobile width ~160-170
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(12)  // Inner padding of card

            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#1E293B"))  // Slate-800
                    .lineLimit(1)

                Text(product.subtitle ?? "1 unit")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#94A3B8"))  // Slate-400
                    .lineLimit(1)

                HStack {
                    Text("₹\(Int(product.price))")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(primaryColor)

                    Spacer()

                    Button(action: {
                        withAnimation(.spring(response: 0.3)) {
                            basketManager.addToBasket(product: product, quantity: 1)
                        }
                    }) {
                        Image(systemName: "plus")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 32, height: 32)
                            .background(primaryColor)
                            .cornerRadius(8)
                            .shadow(color: primaryColor.opacity(0.3), radius: 4, x: 0, y: 2)
                    }
                }
                .padding(.top, 4)
            }
            .padding(.horizontal, 12)
            .padding(.bottom, 12)
        }
        .background(Color.white)
        .cornerRadius(16)  // rounded-xl
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(hex: "#F1F5F9"), lineWidth: 1)  // Slate-100 border
        )
        .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)
    }
}
