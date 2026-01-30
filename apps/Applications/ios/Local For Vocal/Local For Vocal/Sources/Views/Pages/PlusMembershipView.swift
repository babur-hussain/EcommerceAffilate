import SwiftUI

struct PlusMembershipView: View {
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

                Text("Premium Membership")
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
                Image(systemName: "crown.fill")
                    .font(.system(size: 64))
                    .foregroundColor(.yellow)
                    .padding(.bottom, 16)

                Text("Premium Membership Details")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#333333"))

                Text("Coming Soon")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.white)
        }
        .navigationBarHidden(true)
    }
}
