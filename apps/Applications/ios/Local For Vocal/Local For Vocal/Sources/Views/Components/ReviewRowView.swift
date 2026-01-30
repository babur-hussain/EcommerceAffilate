import SwiftUI

struct ReviewRowView: View {
    let review: Review

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                // User Avatar
                if let imageUrl = review.userId.profileImage, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image.resizable().aspectRatio(contentMode: .fill)
                        default:
                            Color.gray.opacity(0.3)
                        }
                    }
                    .frame(width: 40, height: 40)
                    .clipShape(Circle())
                } else {
                    Image(systemName: "person.circle.fill")
                        .resizable()
                        .frame(width: 40, height: 40)
                        .foregroundColor(.gray.opacity(0.5))
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(review.userId.name)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "#1F2937"))

                    HStack {
                        StarRatingView(rating: review.rating, size: 12)
                        Text(formatDate(review.createdAt))
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    }
                }
            }

            Text(review.comment)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "#4B5563"))
                .lineLimit(nil)
        }
        .padding(.vertical, 8)
    }

    private func formatDate(_ dateString: String) -> String {
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        if let date = isoFormatter.date(from: dateString) {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d, yyyy"
            return formatter.string(from: date)
        }

        // Try without fractional seconds
        isoFormatter.formatOptions = [.withInternetDateTime]
        if let date = isoFormatter.date(from: dateString) {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d, yyyy"
            return formatter.string(from: date)
        }

        return ""
    }
}
