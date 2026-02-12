import SwiftUI

struct GroceryGlobalSearchView: View {
    @StateObject private var viewModel = SearchViewModel(categoryId: "grocery")  // Pass category logic/ID
    @Environment(\.presentationMode) var presentationMode
    @FocusState private var isFocused: Bool

    // Grocery-specific filters
    let filters = ["Snacks", "Beverages", "Staples", "Dairy", "Fruits & Veg"]
    @State private var selectedFilter = "All"

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

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

            Text("Grocery Search")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.searchTextDark)

            Spacer()

            // Placeholder for balance
            Color.clear.frame(width: 48, height: 48)
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
                TextField("Search grocery items...", text: $viewModel.query)
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
            Text("TRENDING IN GROCERY")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.searchTextGrey)
                .tracking(0.5)
                .padding(.horizontal, 20)
                .padding(.bottom, 4)

            let suggestions =
                viewModel.trendingTerms.isEmpty
                ? ["Rice", "Oil", "Sugar", "Milk", "Biscuits"]  // Fallback grocery terms
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
                // Reusing existing skeleton or a simpler one
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .frame(height: 180)
            }
        }
        .padding(16)
    }

    var emptyResultsView: some View {
        VStack(spacing: 12) {
            Image(systemName: "carrot.fill")  // Grocery specific icon
                .font(.system(size: 40))
                .foregroundColor(.gray.opacity(0.5))
            Text("No groceries found")
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
            // Check for Top Matching Terms in results
            if !results.suggestions.isEmpty {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Top Matching Terms")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.searchTextGrey)
                        .padding(.horizontal, 16)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(results.suggestions) { suggestion in
                                Button(action: {
                                    viewModel.query = suggestion.text
                                }) {
                                    Text(suggestion.text)
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundColor(.searchTextDark)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(Color.white)
                                        .cornerRadius(20)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 20)
                                                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                                        )
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                }
                .padding(.top, 8)
            }

            // Quick Filters (Grocery Categories)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    Button(action: { selectedFilter = "All" }) {
                        filterChip(text: "All", isSelected: selectedFilter == "All")
                    }

                    ForEach(filters, id: \.self) { filter in
                        Button(action: {
                            selectedFilter = filter
                        }) {
                            filterChip(text: filter, isSelected: selectedFilter == filter)
                        }
                    }
                }
                .padding(.horizontal, 16)
            }

            // Grid
            LazyVGrid(columns: columns, spacing: 12) {
                // Filter logic would happen here if we had local filtering
                // For now, show all results
                ForEach(results.products) { product in
                    // Using GroceryProductCard if available, otherwise fallback
                    // Since GroceryProductCard requires a Product model, we map it
                    let domainProduct = mapToProduct(product)

                    GroceryProductCard(product: domainProduct)
                        .frame(height: 280)  // Fixed height to avoid layout shift
                }
            }
            .padding(.horizontal, 16)
        }
    }

    // Helper view for filter chip
    func filterChip(text: String, isSelected: Bool) -> some View {
        Text(text)
            .font(.system(size: 13, weight: .bold))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(isSelected ? Color.green : Color.white)  // Green for grocery
            .foregroundColor(isSelected ? .white : .searchTextDark)
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Color.gray.opacity(0.2), lineWidth: isSelected ? 0 : 1)
            )
            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
    }

    // Helper to map lightweight search result to partial Product object
    private func mapToProduct(_ item: SearchResultItem) -> Product {
        return Product(
            _id: item.id,
            name: item.displayName,
            price: item.price ?? 0.0,
            images: item.image != nil ? [item.image!] : [],
            category: "Grocery",  // Force grocery category context
            rating: item.rating,
            reviewCount: 0,
            stock: 10,
            mrp: nil,  // Search result might not have MRP
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
