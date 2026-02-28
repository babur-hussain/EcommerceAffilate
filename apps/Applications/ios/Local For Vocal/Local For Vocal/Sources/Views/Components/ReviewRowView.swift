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

    private static let isoFormatterFull: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    private static let isoFormatterBasic: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()
    private static let displayFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "MMM d, yyyy"
        return f
    }()

    private func formatDate(_ dateString: String) -> String {
        if let date = Self.isoFormatterFull.date(from: dateString) {
            return Self.displayFormatter.string(from: date)
        }
        if let date = Self.isoFormatterBasic.date(from: dateString) {
            return Self.displayFormatter.string(from: date)
        }
        return ""
    }
}
