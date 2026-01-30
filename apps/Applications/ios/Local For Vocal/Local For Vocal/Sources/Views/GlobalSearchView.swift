import SwiftUI

struct GlobalSearchView: View {
    @StateObject private var viewModel = SearchViewModel()
    @Environment(\.presentationMode) var presentationMode
    @FocusState private var isFocused: Bool

    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header / Search Bar
                HStack(spacing: 12) {
                    Button(action: {
                        presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(.black)
                    }

                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)

                        TextField("Search products...", text: $viewModel.query)
                            .foregroundColor(.black)
                            .disableAutocorrection(true)
                            .focused($isFocused)

                        if !viewModel.query.isEmpty {
                            Button(action: { viewModel.query = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(12)
                    .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
                }
                .padding()
                .background(Color(white: 0.98))

                // Content
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {

                        if viewModel.query.isEmpty {
                            // Trending Section (Only when empty)
                            if !viewModel.trendingTerms.isEmpty {
                                VStack(alignment: .leading, spacing: 12) {
                                    Text("Trending Searches")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(.black)

                                    FlowLayout(spacing: 8) {
                                        ForEach(viewModel.trendingTerms, id: \.self) { term in
                                            Button(action: { viewModel.query = term }) {
                                                Text(term)
                                                    .font(.system(size: 14, weight: .medium))
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 8)
                                                    .background(Color.white)
                                                    .cornerRadius(20)
                                                    .overlay(
                                                        RoundedRectangle(cornerRadius: 20)
                                                            .stroke(
                                                                Color.gray.opacity(0.2),
                                                                lineWidth: 1)
                                                    )
                                                    .foregroundColor(.black)
                                            }
                                        }
                                    }
                                }
                                .padding(.horizontal)
                            }
                        } else {
                            // Search Results State
                            switch viewModel.searchState {
                            case .loading:
                                HStack {
                                    Spacer()
                                    ProgressView()
                                        .scaleEffect(1.2)
                                        .padding(.top, 40)
                                    Spacer()
                                }

                            case .error(let msg):
                                Text("Error: \(msg)")
                                    .foregroundColor(.red)
                                    .padding()

                            case .results:
                                if let results = viewModel.globalResults {
                                    if !results.products.isEmpty {
                                        LazyVGrid(columns: columns, spacing: 16) {
                                            ForEach(results.products) { product in
                                                NavigationLink(
                                                    destination: ProductDetailView(
                                                        productId: product.id,
                                                        productFragment: mapToProduct(product)
                                                    )
                                                ) {
                                                    BeautifulProductCard(product: product)
                                                }
                                            }
                                        }
                                        .padding(16)
                                    } else {
                                        VStack(spacing: 12) {
                                            Image(systemName: "magnifyingglass")
                                                .font(.system(size: 40))
                                                .foregroundColor(.gray.opacity(0.5))
                                            Text("No products found for '\(viewModel.query)'")
                                                .foregroundColor(.gray)
                                                .font(.system(size: 16))
                                        }
                                        .frame(maxWidth: .infinity)
                                        .padding(.top, 60)
                                    }
                                }
                            case .idle:
                                EmptyView()
                            }
                        }
                    }
                    .padding(.bottom, 20)
                }
            }
            .background(Color(white: 0.98).ignoresSafeArea())
            .navigationBarHidden(true)
            .onAppear {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                    isFocused = true
                }
            }
        }
        .navigationViewStyle(.stack)
    }

    // Helper to map lightweight search result to partial Product object
    private func mapToProduct(_ item: SearchResultItem) -> Product {
        // Create a minimal product object.
        // NOTE: Product struct requires many fields, we fill defaults.
        // Ideally we fetch full details in DetailView using ID.
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

struct BeautifulProductCard: View {
    let product: SearchResultItem

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background Image
            if let img = product.image, let url = URL(string: img) {
                AsyncImage(url: url) { phase in
                    if let image = phase.image {
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } else {
                        Color.gray.opacity(0.1)
                    }
                }
            } else {
                Color.gray.opacity(0.1)
                    .overlay(
                        Image(systemName: "photo")
                            .foregroundColor(.gray)
                    )
            }
        }
        .frame(height: 220)
        .frame(maxWidth: .infinity)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
        // Overlay Content
        .overlay(
            VStack {
                Spacer()
                LinearGradient(
                    gradient: Gradient(colors: [.clear, .black.opacity(0.7)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 80)
                .cornerRadius(16, corners: [.bottomLeft, .bottomRight])
                .overlay(
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(product.displayName)
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)

                            if let price = product.price {
                                Text("₹\(Int(price))")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))
                            }
                        }
                        Spacer()
                    }
                    .padding(12), alignment: .bottom
                )
            }
        )
    }
}

// Simple FlowLayout implementation for Trending Tags
struct FlowLayout: Layout {
    var spacing: CGFloat

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? UIScreen.main.bounds.width
        var height: CGFloat = 0
        var x: CGFloat = 0
        var y: CGFloat = 0
        var maxHeight: CGFloat = 0

        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > width {
                x = 0
                y += maxHeight + spacing
                maxHeight = 0
            }
            maxHeight = max(maxHeight, size.height)
            x += size.width + spacing
        }
        return CGSize(width: width, height: y + maxHeight)
    }

    func placeSubviews(
        in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()
    ) {
        var x = bounds.minX
        var y = bounds.minY
        var maxHeight: CGFloat = 0

        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > bounds.width + bounds.minX {
                x = bounds.minX
                y += maxHeight + spacing
                maxHeight = 0
            }
            view.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            maxHeight = max(maxHeight, size.height)
            x += size.width + spacing
        }
    }
}
