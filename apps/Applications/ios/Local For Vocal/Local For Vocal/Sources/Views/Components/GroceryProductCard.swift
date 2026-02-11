import SwiftUI

struct GroceryProductCard: View {
    let product: Product
    @EnvironmentObject var basketManager: BasketManager

    var quantity: Int {
        basketManager.getItemCount(productId: product.id)
    }

    var discountPercent: Int {
        if let mrp = product.mrp, mrp > product.price {
            return Int(((mrp - product.price) / mrp) * 100)
        }
        return product.discountPercentage ?? 0
    }

    var weightText: String {
        // Use subtitle if available (often contains weight info), otherwise default
        if let subtitle = product.subtitle, !subtitle.isEmpty {
            return subtitle
        }
        return "1 unit"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // ── Image Area ──
            ZStack {
                // Product Image (white bg)
                if let mainImage = product.images.first, let url = URL(string: mainImage) {
                    AsyncImage(url: url) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .padding(8)
                        } else if phase.error != nil {
                            Image(systemName: "photo")
                                .font(.system(size: 30))
                                .foregroundColor(Color(hex: "#D1D5DB"))
                        } else {
                            ProgressView()
                        }
                    }
                } else {
                    Image(systemName: "photo")
                        .font(.system(size: 30))
                        .foregroundColor(Color(hex: "#D1D5DB"))
                }

                // ── Discount Badge (Top-Left) ──
                if discountPercent > 0 {
                    VStack {
                        HStack {
                            HStack(spacing: 1) {
                                Image(systemName: "arrow.down")
                                    .font(.system(size: 8, weight: .heavy))
                                Text("\(discountPercent)%")
                                    .font(.system(size: 10, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(Color(hex: "#16A34A"))
                            .cornerRadius(4)

                            Spacer()
                        }
                        .padding(.leading, 4)
                        .padding(.top, 4)

                        Spacer()
                    }
                }

                // ── Rating (Bottom-Left) ──
                VStack {
                    Spacer()
                    HStack {
                        HStack(spacing: 2) {
                            Text(String(format: "%.1f", product.rating ?? 4.5))
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "#111827"))
                            Image(systemName: "star.fill")
                                .font(.system(size: 7))
                                .foregroundColor(Color(hex: "#F59E0B"))
                        }
                        .padding(.horizontal, 5)
                        .padding(.vertical, 2)
                        .background(Color.white.opacity(0.95))
                        .cornerRadius(4)
                        .shadow(color: Color.black.opacity(0.08), radius: 1, x: 0, y: 1)

                        Spacer()
                    }
                    .padding(.leading, 6)
                    .padding(.bottom, 6)
                }

                // ── Add Button (Bottom-Right, ABSOLUTE POSITION) ──
                VStack {
                    Spacer()
                    HStack {
                        Spacer()

                        // Add Button Container
                        Group {
                            if quantity > 0 {
                                // Stepper Control [ - Qty + ]
                                HStack(spacing: 0) {
                                    // Decrement Button
                                    Button(action: {
                                        withAnimation(.spring(response: 0.3)) {
                                            basketManager.addToBasket(
                                                product: product, quantity: -1)
                                        }
                                    }) {
                                        Image(systemName: "minus")
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.white)
                                            .frame(width: 24, height: 28)
                                    }

                                    // Quantity Text
                                    Text("\(quantity)")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.white)
                                        .frame(width: 20, height: 28)

                                    // Increment Button
                                    Button(action: {
                                        withAnimation(.spring(response: 0.3)) {
                                            basketManager.addToBasket(product: product, quantity: 1)
                                        }
                                    }) {
                                        Image(systemName: "plus")
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.white)
                                            .frame(width: 24, height: 28)
                                    }
                                }
                                .background(Color(hex: "#16A34A"))
                                .cornerRadius(14)  // Capsule shape
                                .shadow(
                                    color: Color(hex: "#16A34A").opacity(0.3), radius: 3, x: 0, y: 2
                                )
                            } else {
                                // Initial "ADD" Button
                                Button(action: {
                                    withAnimation(.spring(response: 0.3)) {
                                        basketManager.addToBasket(product: product, quantity: 1)
                                    }
                                }) {
                                    Image(systemName: "plus")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(Color(hex: "#16A34A"))  // Green Icon
                                        .frame(width: 32, height: 32)
                                        .background(Color.white)
                                        .clipShape(Circle())
                                        .shadow(
                                            color: Color.black.opacity(0.1), radius: 2, x: 0, y: 1
                                        )
                                        .overlay(
                                            Circle()
                                                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                                        )
                                }
                            }
                        }
                        .padding(.trailing, 8)
                        .padding(.bottom, 8)
                    }
                }
            }
            .frame(height: 130)
            .background(Color.white)

            // ── Weight / Quantity Row ──
            Text(weightText)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "#6B7280"))
                .padding(.horizontal, 8)
                .padding(.top, 6)

            // ── Product Name ──
            Text(product.name)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "#1F2937"))
                .lineLimit(2)
                .multilineTextAlignment(.leading)
                .frame(height: 32, alignment: .topLeading)
                .padding(.horizontal, 8)
                .padding(.top, 2)

            // ── Price Row ──
            HStack(spacing: 6) {
                HStack(spacing: 0) {
                    Text("₹\(Int(product.price))")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))
                }

                if let mrp = product.mrp, mrp > product.price {
                    Text("₹\(Int(mrp))")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .strikethrough()
                }

                Spacer()
            }
            .padding(.horizontal, 8)
            .padding(.top, 4)
            .padding(.bottom, 10)
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.06), radius: 4, x: 0, y: 2)
    }
}
