import SwiftUI

struct BottomActionBarView: View {
    let price: Double
    var onAddToCart: () -> Void
    var onBuyNow: () -> Void
    var onOpenCart: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // 1. Cart Icon Button (Square outline)
            Button(action: {
                HapticManager.shared.selection()
                onOpenCart()
            }) {
                Image(systemName: "cart")
                    .font(.system(size: 20))  // Slightly larger icon
                    .foregroundColor(Color(hex: "#111827"))
                    .frame(width: 50, height: 50)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                    )
            }

            // 2. Add to Cart Button (Outline)
            Button(action: {
                HapticManager.shared.impact(style: .heavy)
                onAddToCart()
            }) {
                Text("Add to Cart")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                    )
            }

            // 3. Buy Now Button (Yellow, with price)
            Button(action: {
                HapticManager.shared.impact(style: .heavy)
                onBuyNow()
            }) {
                VStack(spacing: 0) {
                    Text("Buy now")
                        .font(.system(size: 15, weight: .black))
                        .foregroundColor(Color(hex: "#111827"))
                    Text("at ₹\(Int(price))")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))
                }
                .frame(maxWidth: .infinity)
                .frame(height: 50)
                .background(Color(hex: "#FACC15"))  // Gold/Yellow
                .cornerRadius(8)
            }
        }
        .padding(12)
        .background(Color.white)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: -2)
    }
}
