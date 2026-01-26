import SwiftUI

struct ProductCardGrid: View {
    let products: [Product]
    let title: String?
    
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let title = title, !title.isEmpty {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .padding(.horizontal, 16)
            }
            
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(products) { product in
                    ProductCardView(product: product, width: (UIScreen.main.bounds.width - 48) / 2)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.vertical, 16)
    }
}
