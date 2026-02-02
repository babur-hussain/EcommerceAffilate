import SwiftUI

struct LuminousSaleView: View {
    let tag: String
    let title: String
    let linkText: String
    let imageUrl: String

    var body: some View {
        ZStack {
            // Dark Background
            Color(red: 0.06, green: 0.09, blue: 0.16)

            // Content
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Member Exclusive")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)

                    Text("Get 20% off on all\nBetul's Organic line")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.7))
                        .lineSpacing(2)
                        .padding(.bottom, 16)

                    Button(action: {}) {
                        Text("Unlock Deal")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(Color(red: 0.91, green: 0.64, blue: 0.66))
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.3), radius: 8, y: 4)
                    }
                }
                .padding(24)

                Spacer()
            }

            // Decorative Icon
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Image(systemName: "gift.fill")
                        .font(.system(size: 120))
                        .foregroundColor(.white.opacity(0.08))
                        .rotationEffect(.degrees(12))
                        .offset(x: 20, y: 20)
                }
            }
        }
        .frame(height: 180)
        .cornerRadius(24)
        .padding(.horizontal, 16)
        .padding(.top, 40)
        .clipped()
    }
}
