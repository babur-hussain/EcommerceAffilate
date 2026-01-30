import SwiftUI

struct StarRatingView: View {
    let rating: Int
    let maxRating: Int = 5
    var size: CGFloat = 16
    var interactive: Bool = false
    var onRatingChanged: ((Int) -> Void)? = nil

    var body: some View {
        HStack(spacing: 2) {
            ForEach(1...maxRating, id: \.self) { star in
                Image(systemName: star <= rating ? "star.fill" : "star")
                    .resizable()
                    .scaledToFit()
                    .frame(width: size, height: size)
                    .foregroundColor(star <= rating ? .yellow : .gray.opacity(0.3))
                    .onTapGesture {
                        if interactive {
                            onRatingChanged?(star)
                        }
                    }
            }
        }
    }
}
