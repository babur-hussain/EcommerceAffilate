import SwiftUI

// MARK: - Wishlist View
struct WishlistView: View {
    @Environment(\.presentationMode) var presentationMode
    private var wishlistManager: WishlistManager { WishlistManager.shared }
    private var authManager: AuthManager { AuthManager.shared }

    @State private var selectedProduct: Product? = nil

    // Brand Colors
    private let primaryBlue = Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255)
    private let pageBg = Color(red: 248 / 255, green: 249 / 255, blue: 250 / 255)
    private let darkText = Color(red: 31 / 255, green: 41 / 255, blue: 55 / 255)
    private let grayText = Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255)
    private let dangerRed = Color(red: 239 / 255, green: 68 / 255, blue: 68 / 255)

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header
            header

            // Content
            if wishlistManager.isLoading && wishlistManager.wishlistItems.isEmpty {
                Spacer()
                ProgressView()
                    .scaleEffect(1.2)
                Spacer()
            } else if wishlistManager.wishlistItems.isEmpty {
                emptyView
            } else {
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(wishlistManager.wishlistItems) { product in
                            WishlistItemCard(
                                product: product,
                                onRemove: {
                                    Task {
                                        await wishlistManager.removeFromWishlist(
                                            productId: product.id)
                                    }
                                },
                                onTap: {
                                    selectedProduct = product
                                }
                            )
                        }
                    }
                    .padding(12)
                }
                .refreshable {
                    await wishlistManager.fetchWishlist()
                }
            }
        }
        .background(pageBg)
        .navigationBarHidden(true)
        .onAppear {
            Task {
                await wishlistManager.fetchWishlist()
            }
        }
        .fullScreenCover(item: $selectedProduct) { product in
            ProductDetailView(productId: product.id)
        }
    }

    // MARK: - Header
    private var header: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "arrow.left")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(darkText)
            }

            Spacer()

            Text("My Wishlist (\(wishlistManager.wishlistItems.count))")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(darkText)

            Spacer()

            // Placeholder for symmetry
            Color.clear
                .frame(width: 24, height: 24)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
        .overlay(
            Rectangle()
                .fill(Color(red: 229 / 255, green: 231 / 255, blue: 235 / 255))
                .frame(height: 1),
            alignment: .bottom
        )
    }

    // MARK: - Empty View
    private var emptyView: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "heart")
                .font(.system(size: 64))
                .foregroundColor(Color(red: 209 / 255, green: 213 / 255, blue: 219 / 255))

            Text("Your wishlist is empty")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(darkText)

            Text("Save items you love to view them here later")
                .font(.system(size: 14))
                .foregroundColor(grayText)
                .multilineTextAlignment(.center)

            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Text("Start Shopping")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(primaryBlue)
                    .cornerRadius(8)
            }
            .padding(.top, 8)

            Spacer()
        }
        .padding(32)
    }
}

// MARK: - Wishlist Item Card
struct WishlistItemCard: View {
    let product: Product
    let onRemove: () -> Void
    let onTap: () -> Void

    private let dangerRed = Color(red: 239 / 255, green: 68 / 255, blue: 68 / 255)

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                // Image Container
                ZStack(alignment: .topTrailing) {
                    if let imageUrl = product.images.first,
                        let url = URL(string: imageUrl)
                    {
                        AsyncImage(url: url) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            case .failure:
                                Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)
                            case .empty:
                                ProgressView()
                            @unknown default:
                                Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)
                            }
                        }
                        .frame(height: 160)
                        .clipped()
                    } else {
                        Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255)
                            .frame(height: 160)
                    }

                    // Remove Button
                    Button(action: onRemove) {
                        Image(systemName: "trash")
                            .font(.system(size: 14))
                            .foregroundColor(dangerRed)
                            .padding(6)
                            .background(Color.white)
                            .clipShape(Circle())
                            .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: 1)
                    }
                    .padding(8)
                }

                // Details
                VStack(alignment: .leading, spacing: 4) {
                    Text(product.name)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(red: 55 / 255, green: 65 / 255, blue: 81 / 255))
                        .lineLimit(2)
                        .frame(height: 36, alignment: .top)

                    Text("₹\(Int(product.price))")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(red: 17 / 255, green: 24 / 255, blue: 39 / 255))
                }
                .padding(10)
            }
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview
struct WishlistView_Previews: PreviewProvider {
    static var previews: some View {
        WishlistView()
    }
}
