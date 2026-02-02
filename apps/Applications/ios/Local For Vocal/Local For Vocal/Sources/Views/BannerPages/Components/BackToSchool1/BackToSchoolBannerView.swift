import SwiftUI

struct BackToSchoolBannerView: View {
    let component: SDUIComponent

    var body: some View {
        VStack {
            HStack {
                VStack(alignment: .leading, spacing: 12) {
                    Text("LIMITED TIME")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color.white.opacity(0.8))
                        .tracking(1)

                    Text("Buy 2 Get 1\nFree on Books!")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)

                    Button(action: {}) {
                        Text("View Offer")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "6B9EE6"))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 6)
                            .background(Color.white)
                            .cornerRadius(8)
                    }
                }
                Spacer()

                Image(systemName: "book.fill")  // auto-stories replacement
                    .font(.system(size: 100))
                    .foregroundColor(Color.white.opacity(0.3))
                    .rotationEffect(.degrees(12))
                    .offset(x: 20, y: 20)
            }
            .padding(20)
            .background(Color(hex: "6B9EE6"))
            .cornerRadius(16)
            .clipped()
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 32)
    }
}
