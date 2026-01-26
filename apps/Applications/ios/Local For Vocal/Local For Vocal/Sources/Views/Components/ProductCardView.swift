import SwiftUI

struct ProductCardView: View {
    let product: Product
    let width: CGFloat
    var onAdd: (() -> Void)?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Container
            ZStack(alignment: .topTrailing) {
                Color(hex: "#F3F4F6") // Placeholder background
                
                if let imageUrl = product.images.first, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        ProgressView()
                    }
                    .frame(width: width, height: 160)
                    .clipped()
                } else {
                    Image(systemName: "photo")
                        .font(.system(size: 40))
                        .foregroundColor(.gray)
                        .frame(width: width, height: 160)
                }
                
                // Wishlist Button
                Button(action: {
                    // Wishlist action
                }) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 32, height: 32)
                        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
                        .overlay(
                            Image(systemName: "heart")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "#4F46E5"))
                        )
                }
                .padding(8)
                
                // Discount Badge
                if let discount = product.discountPercentage, discount > 0 {
                    Text("-\(discount)%")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "#EF4444"))
                        .cornerRadius(4)
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .topLeading)
                }
            }
            .frame(height: 160)
            
            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(product.category.uppercased())
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(Color(hex: "#6B7280"))
                
                Text(product.name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "#111827"))
                    .lineLimit(2)
                    .frame(height: 40, alignment: .topLeading)
                
                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("₹\(Int(product.price))")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#4F46E5"))
                        
                        if let mrp = product.mrp, mrp > product.price {
                            Text("₹\(Int(mrp))")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                                .strikethrough()
                        }
                    }
                    
                    Spacer()
                    
                    // Rating
                    if let rating = product.rating {
                        HStack(spacing: 2) {
                            Image(systemName: "star.fill")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "#F59E0B"))
                            Text(String(format: "%.1f", rating))
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Color(hex: "#B45309"))
                        }
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "#FFFBEB"))
                        .cornerRadius(4)
                    }
                }
                .padding(.top, 4)
            }
            .padding(12)
        }
        .frame(width: width)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
