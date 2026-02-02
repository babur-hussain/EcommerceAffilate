import SwiftUI

struct SchoolTwoBannerView: View {
    let component: SDUIComponent

    private let primary = Color(hex: "FACC15")
    private let primaryLight = Color(hex: "FDE047")
    private let bgGreen = Color(hex: "155e48")

    var body: some View {
        VStack {
            ZStack {
                LinearGradient(
                    gradient: Gradient(colors: [primary, primaryLight]),
                    startPoint: .leading,
                    endPoint: .trailing
                )

                // Dashed Border
                RoundedRectangle(cornerRadius: 12)
                    .stroke(style: StrokeStyle(lineWidth: 2, dash: [5]))
                    .foregroundColor(.white)
                    .padding(4)

                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Back To School")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(bgGreen)

                        Text("Get 50% OFF on all bundles")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(bgGreen)
                            .padding(.bottom, 8)

                        Button(action: {}) {
                            Text("Shop Now")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                                .textCase(.uppercase)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(bgGreen)
                                .cornerRadius(999)
                        }
                    }
                    Spacer()

                    Image(systemName: "graduationcap.fill")  // school replacement
                        .font(.system(size: 64))
                        .foregroundColor(bgGreen.opacity(0.9))
                        .padding(.trailing, 16)
                }
                .padding(20)
            }
            .frame(height: 140)  // Approx
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.2), radius: 8, x: 0, y: 4)
        }
        .padding(.top, 24)
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }
}
