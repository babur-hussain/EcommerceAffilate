import SwiftUI

struct SellOnPlatformView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "#1F2937"))
                }

                Spacer()

                Text("Sell on Platform")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))

                Spacer()

                Color.clear.frame(width: 20, height: 20)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color.white)
            .overlay(
                Rectangle()
                    .fill(Color(hex: "#E5E7EB"))
                    .frame(height: 1),
                alignment: .bottom
            )

            VStack(spacing: 16) {
                Image(systemName: "storefront.fill")
                    .font(.system(size: 64))
                    .foregroundColor(.blue)
                    .padding(.bottom, 16)

                Text("Become a Seller Today!")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#333333"))

                Text("Registration coming soon")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.white)
        }
        .navigationBarHidden(true)
    }
}
