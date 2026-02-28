import SwiftUI

struct FurnitureTrendingNowView: View {
    struct TrendingItem: Decodable, Identifiable {
        let id: String
        let titleLine1: String
        let titleLine2: String?
        let icon: String  // SF Symbol name
        let iconColor: String
        let backgroundColor: String
        let actionUrl: String?
    }

    let title: String
    let headerActionUrl: String?
    let items: [TrendingItem]

    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                if let action = headerActionUrl {
                    Spacer()
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Image(systemName: "chevron.right")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Grid
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(items) { item in
                    FurnitureTrendingCard(item: item)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}

struct FurnitureTrendingCard: View {
    let item: FurnitureTrendingNowView.TrendingItem

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            VStack(alignment: .leading, spacing: 12) {
                // Icon
                ZStack {
                    if item.titleLine1 == "Betul's" {  // Specific styling for Exclusive
                        Circle()
                            .fill(Color.white.opacity(0.8))
                            .frame(width: 50, height: 50)
                    } else {
                        Circle()
                            .fill(Color.white.opacity(0.8))
                            .frame(width: 60, height: 60)
                    }

                    Image(systemName: item.icon)
                        .font(.system(size: item.titleLine1 == "Betul's" ? 24 : 32))
                        .foregroundColor(Color(hex: item.iconColor))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 8)

                // Text
                VStack(alignment: .leading, spacing: 0) {
                    Text(item.titleLine1)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    if let line2 = item.titleLine2 {
                        Text(line2)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }
            }
            .padding(16)
            .frame(height: 140)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(hex: item.backgroundColor))
            .cornerRadius(16)
        }
    }
}
