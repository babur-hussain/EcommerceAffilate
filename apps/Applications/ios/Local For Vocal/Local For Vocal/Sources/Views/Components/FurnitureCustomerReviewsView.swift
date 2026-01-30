import SwiftUI

struct FurnitureCustomerReviewsView: View {
    let component: SDUIComponent

    var body: some View {
        let title = component.props?["title"]?.value as? String ?? "Reviews by customers"
        let headerActionUrl = component.props?["headerActionUrl"]?.value as? String

        // Parse items from props
        let items: [ReviewItem] = {
            if let itemsList = component.props?["items"]?.value as? [[String: Any]] {
                return itemsList.map { dict in
                    ReviewItem(
                        product: dict["product"] as? String ?? "",
                        rating: dict["rating"] as? Int ?? 5,
                        review: dict["review"] as? String ?? "",
                        user: dict["user"] as? String ?? "",
                        image: dict["image"] as? String ?? "",
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            if let arrayAny = component.props?["items"]?.value as? [Any] {
                return arrayAny.compactMap { item -> ReviewItem? in
                    guard let dict = item as? [String: Any] else { return nil }
                    return ReviewItem(
                        product: dict["product"] as? String ?? "",
                        rating: dict["rating"] as? Int ?? 5,
                        review: dict["review"] as? String ?? "",
                        user: dict["user"] as? String ?? "",
                        image: dict["image"] as? String ?? "",
                        actionUrl: dict["actionUrl"] as? String
                    )
                }
            }
            return []
        }()

        if !items.isEmpty {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                HStack {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.black)
                    Spacer()
                    if let action = headerActionUrl {
                        Button(action: { print("Navigate to \(action)") }) {
                            Image(systemName: "chevron.right")
                                .foregroundColor(.black)
                        }
                    }
                }
                .padding(.horizontal, 16)

                // ScrollView
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(items) { item in
                            ReviewCard(item: item)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
            .padding(.bottom, 24)
        }
    }
}

struct ReviewCard: View {
    let item: ReviewItem

    var body: some View {
        ZStack {
            // Background
            Color(hex: "9575CD")  // Purple background

            VStack(spacing: 0) {
                // Top Section: Product Title & Stars
                VStack(alignment: .leading, spacing: 4) {
                    Text(item.product)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)

                    HStack(spacing: 2) {
                        ForEach(0..<5) { i in
                            Image(systemName: "star.fill")
                                .font(.system(size: 12))
                                .foregroundColor(
                                    i < item.rating ? Color(hex: "FFEB3B") : Color.gray.opacity(0.5)
                                )
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .zIndex(2)

                // Spacer to push content apart (SpaceBetween behavior)
                Spacer()

                // Bottom Overlay: Review Text & User
                VStack(alignment: .leading, spacing: 4) {
                    Text(item.review)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.black)
                        .lineLimit(3)

                    Text(item.user)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(12)
                .background(Color.white.opacity(0.6))
                .cornerRadius(12)
                // Remove fixed top padding, let spacer handle it, or keep if design needs specific offset
                .padding(.top, 40)
            }
            .padding(16)

            // Floating Image
            GeometryReader { geo in
                AsyncImage(url: URL(string: item.image)) { phase in
                    if let image = phase.image {
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                    } else {
                        Color.clear
                    }
                }
                .frame(width: geo.size.width - 32, height: 120)  // Adjust size as needed
                .position(x: geo.size.width / 2, y: geo.size.height * 0.45)  // Position roughly in middle-ish
            }
        }
        .frame(width: 250, height: 280)
        .cornerRadius(16)
        .clipped()
    }
}

// Changed to internal (default) to match ReviewCard usage access
struct ReviewItem: Identifiable {
    let id = UUID()
    let product: String
    let rating: Int
    let review: String
    let user: String
    let image: String
    let actionUrl: String?
}
