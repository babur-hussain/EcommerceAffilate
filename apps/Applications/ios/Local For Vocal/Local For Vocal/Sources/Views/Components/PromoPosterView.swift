import SwiftUI

struct PromoPosterView: View {
    let image: String
    let actionUrl: String?

    var body: some View {
        Button(action: {
            if let action = actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }) {
            if let url = URL(string: image) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color(hex: "#F0F0F0")
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "#F0F0F0"))
                .cornerRadius(12)
                .clipped()
            }
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.horizontal, 16)
        .padding(.bottom, 20)
        .padding(.top, 4)
    }
}
