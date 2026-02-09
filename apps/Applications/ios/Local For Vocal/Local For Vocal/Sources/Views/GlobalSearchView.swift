import SwiftUI

// MARK: - Theme Colors
extension Color {
    static let searchPrimary = Color(hex: "#144bb8")
    static let searchBackground = Color(hex: "#f6f6f8")
    static let searchTextDark = Color(hex: "#111318")
    static let searchTextGrey = Color(hex: "#636f88")
}

struct GlobalSearchView: View {
    @StateObject private var viewModel = SearchViewModel()
    @Environment(\.presentationMode) var presentationMode
    @FocusState private var isFocused: Bool

    // UI States for filters (Visual only for now)
    let filters = ["Brand", "Size", "Color", "Price", "Rating"]
    @State private var selectedFilter = "Brand"

    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    // Explicit width relative to screen to match ProductCardView logic
    private let itemWidth = (UIScreen.main.bounds.width - 48) / 2

    var body: some View {
        NavigationView {
            ZStack {
                // Background
                Color.searchBackground.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Custom Header
                    headerView

                    // Main Content
                    ScrollView {
                        VStack(spacing: 24) {

                            // Search Bar Container
                            searchBarSection

                            if viewModel.query.isEmpty && viewModel.globalResults == nil {
                                // Live Suggestions / Trending
                                liveSuggestionsSection
                            } else {
                                // Results View
                                if case .loading = viewModel.searchState {
                                    loadingView
                                } else if case .error(let msg) = viewModel.searchState {
                                    errorView(msg: msg)
                                } else if let results = viewModel.globalResults,
                                    !results.products.isEmpty
                                {
                                    resultsContent(results: results)
                                } else if viewModel.globalResults != nil {  // No results found
                                    emptyResultsView
                                }
                            }
                        }
                        .padding(.bottom, 20)
                    }
                    .scrollDismissesKeyboard(.interactively)
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    isFocused = true
                }
            }
        }
        .navigationViewStyle(.stack)
    }

    // MARK: - Subviews

    var headerView: some View {
        HStack(alignment: .center) {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "arrow.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.searchTextDark)
                    .frame(width: 48, height: 48)
            }

            Spacer()

            Text("Search")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.searchTextDark)

            Spacer()

            Button(action: {}) {
                Image(systemName: "bag")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.searchTextDark)
                    .frame(width: 48, height: 48)
            }
        }
        .padding(.horizontal, 4)
        .background(Color.searchBackground)
    }

    var searchBarSection: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                // Search Icon
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18))
                    .foregroundColor(.searchTextGrey)
                    .frame(width: 48, height: 48)

                // Input
                TextField("Oversized", text: $viewModel.query)
                    .font(.system(size: 16))
                    .foregroundColor(.searchTextDark)
                    .focused($isFocused)
                    .disableAutocorrection(true)

                // Clear Button
                if !viewModel.query.isEmpty {
                    Button(action: {
                        viewModel.query = ""
                        HapticManager.shared.impact(style: .medium)
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 18))
                            .foregroundColor(.searchTextGrey)
                            .frame(width: 48, height: 48)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        }
        .padding(.horizontal, 16)
    }

    var liveSuggestionsSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("LIVE SUGGESTIONS")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.searchTextGrey)
                .tracking(0.5)
                .padding(.horizontal, 20)
                .padding(.bottom, 4)

            let suggestions =
                viewModel.trendingTerms.isEmpty
                ? ["Oversized Hoodie", "Oversized T-shirt", "Oversized Blazer"]
                : viewModel.trendingTerms

            ForEach(suggestions, id: \.self) { term in
                Button(action: {
                    viewModel.query = term
                }) {
                    HStack(spacing: 16) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                                .background(Color.white)
                                .frame(width: 40, height: 40)

                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 18))
                                .foregroundColor(.searchTextDark)
                        }

                        Text(term)
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.searchTextDark)

                        Spacer()

                        Image(systemName: "arrow.up.left")
                            .font(.system(size: 16))
                            .foregroundColor(.searchTextGrey)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                }
            }
        }
    }

    var loadingView: some View {
        LazyVGrid(columns: columns, spacing: 16) {
            ForEach(0..<4, id: \.self) { _ in
                ProductCardSkeleton()
            }
        }
        .padding(16)
    }

    var emptyResultsView: some View {
        VStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 40))
                .foregroundColor(.gray.opacity(0.5))
            Text("No results found")
                .foregroundColor(.searchTextGrey)
        }
        .padding(.top, 60)
    }

    func errorView(msg: String) -> some View {
        Text("Error: \(msg)")
            .foregroundColor(.red)
            .padding()
    }

    func resultsContent(results: GlobalSearchResponse) -> some View {
        VStack(spacing: 16) {
            // Quick Filters
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(filters, id: \.self) { filter in
                        Button(action: {
                            selectedFilter = filter
                        }) {
                            Text(filter)
                                .font(.system(size: 13, weight: .bold))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(
                                    selectedFilter == filter ? Color.searchPrimary : Color.white
                                )
                                .foregroundColor(
                                    selectedFilter == filter ? .white : .searchTextDark
                                )
                                .cornerRadius(20)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20)
                                        .stroke(
                                            Color.gray.opacity(0.2),
                                            lineWidth: selectedFilter == filter ? 0 : 1)
                                )
                                .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                        }
                    }
                }
                .padding(.horizontal, 16)
            }

            // Product Grid Headers
            HStack {
                Text("Product Results")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.searchTextDark)
                Spacer()
                Text("\(results.products.count) items found")
                    .font(.system(size: 14))
                    .foregroundColor(.searchTextGrey)
            }
            .padding(.horizontal, 16)

            // Grid
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(results.products) { product in
                    NavigationLink(
                        destination: ProductDetailView(
                            productId: product.id, productFragment: mapToProduct(product))
                    ) {
                        ModernProductCard(product: product, width: itemWidth)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .simultaneousGesture(
                        TapGesture().onEnded {
                            // Dismiss keyboard before navigation to prevent visual glitch
                            UIApplication.shared.sendAction(
                                #selector(UIResponder.resignFirstResponder), to: nil, from: nil,
                                for: nil)
                        })
                }
            }
            .padding(.horizontal, 16)
        }
    }

    // Helper to map lightweight search result to partial Product object
    private func mapToProduct(_ item: SearchResultItem) -> Product {
        return Product(
            _id: item.id,
            name: item.displayName,
            price: item.price ?? 0.0,
            images: item.image != nil ? [item.image!] : [],
            category: "General",
            rating: item.rating,
            reviewCount: 0,
            stock: 10,
            mrp: nil,
            discountPercentage: nil,
            subtitle: nil,
            description: nil,
            shortDescription: nil,
            saleEndDate: nil,
            protectPromiseFee: nil,
            sellerName: nil,
            offers: nil,
            trustBadges: nil,
            lastChanceOffers: nil
        )
    }
}

struct ModernProductCard: View {
    let product: SearchResultItem
    let width: CGFloat

    var body: some View {
        let _ = AppLogger.debug(
            "🎨 ModernProductCard Rendering: \(product.displayName), Image: \(product.image ?? "NIL")"
        )
        VStack(alignment: .leading, spacing: 8) {
            // Image Container
            ZStack(alignment: .topTrailing) {
                // Image Logic (Synced with ProductCardView)
                let imageUrl = product.image ?? ""
                let cleanPath = imageUrl.replacingOccurrences(of: "\\", with: "/")
                let fullUrl =
                    cleanPath.hasPrefix("http")
                    ? cleanPath
                    : "\(APIService.shared.imageHost)/\(cleanPath.hasPrefix("/") ? String(cleanPath.dropFirst()) : cleanPath)"

                if !imageUrl.isEmpty, let url = URL(string: fullUrl) {
                    let _ = AppLogger.debug(
                        "🔍 Search Result Image: \(url.absoluteString) for \(product.displayName)")
                    CachedAsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#F3F4F6")
                    }
                    .frame(width: width, height: 160)
                    .clipped()
                    .cornerRadius(8)
                } else {
                    Color(hex: "#F3F4F6")
                        .frame(width: width, height: 160)
                        .overlay(Image(systemName: "photo").foregroundColor(.gray))
                        .cornerRadius(8)
                }

                // Favorite Button
                Button(action: {}) {
                    Image(systemName: "heart")
                        .font(.system(size: 14))
                        .foregroundColor(.searchTextDark)
                        .padding(8)
                        .background(.ultraThinMaterial)
                        .clipShape(Circle())
                }
                .padding(8)
            }
            .background(Color.gray.opacity(0.05))
            .cornerRadius(12)
            .frame(width: width)

            // Details
            VStack(alignment: .leading, spacing: 4) {
                Text(product.displayName)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.searchTextDark)
                    .lineLimit(1)

                Text(product.category ?? "Collection")
                    .font(.system(size: 12))
                    .foregroundColor(.searchTextGrey)
                    .lineLimit(1)

                HStack(alignment: .center) {
                    if let price = product.price {
                        Text("₹\(Int(price))")
                            .font(.system(size: 15, weight: .heavy))
                            .foregroundColor(.searchPrimary)
                    }

                    Spacer()

                    HStack(spacing: 2) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundColor(.yellow)
                        Text(String(format: "%.1f", product.rating ?? 0.0))
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.searchTextDark)
                    }
                }
                .padding(.top, 2)
            }
        }
    }

    private func getImageUrl(for img: String) -> URL? {
        let cleanPath = img.replacingOccurrences(of: "\\", with: "/")

        var fullUrlString = cleanPath
        if !cleanPath.hasPrefix("http") {
            // If not absolute, prepend host. Ensure clean join.
            let host = APIService.shared.imageHost
            let path = cleanPath.hasPrefix("/") ? String(cleanPath.dropFirst()) : cleanPath
            fullUrlString = "\(host)/\(path)"
        }

        // 1. Try direct creation (Fast path for valid URLs)
        if let url = URL(string: fullUrlString) {
            return url
        }

        // 2. Handle spaces and other characters if direct creation failed
        if let encoded = fullUrlString.addingPercentEncoding(
            withAllowedCharacters: .urlQueryAllowed),
            let url = URL(string: encoded)
        {
            return url
        }

        return nil
    }
}
