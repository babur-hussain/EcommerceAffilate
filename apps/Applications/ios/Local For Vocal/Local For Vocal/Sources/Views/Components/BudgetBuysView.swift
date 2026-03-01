import SwiftUI

struct BudgetBuysView: View {
    // Props
    var title: String = "Budget Buys"
    var headerActionUrl: String?
    var items: [BudgetItem] = []

    struct BudgetItem: Identifiable, Decodable {
        let id: String
        let image: String
        let price: String
        let actionUrl: String?

        var safeId: String { id }
    }

    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    AppLogger.debug("Navigate to: \(action)")
                }
            }) {
                HStack(spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#000000"))
                    Text("›")
                        .font(.system(size: 18, weight: .bold))  // Match title weight
                        .foregroundColor(Color(hex: "#000000"))
                }
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.horizontal, 16)

            // Grid
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(items) { item in
                    BudgetBuysCard(item: item)
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.vertical, 16)
        .background(Color.white)
    }
}

struct BudgetBuysCard: View {
    let item: BudgetBuysView.BudgetItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            ZStack {
                // Background Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#F0F0F0")
                    }
                } else {
                    Color(hex: "#F0F0F0")
                }

                // Overlay
                VStack(spacing: -4) {
                    Text("UNDER")
                        .font(.custom("Didot", size: 18))  // Native uses Didot on iOS
                        .fontWeight(.medium)
                        .tracking(2)  // letterSpacing
                        .foregroundColor(.white)

                    Text("₹\(item.price)")
                        .font(.custom("Didot", size: 42))  // Native uses Didot
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
            }
            .aspectRatio(1, contentMode: .fit)
            .background(Color(hex: "#F0F0F0"))
            .cornerRadius(12)
            .clipped()
        }
    }
}
