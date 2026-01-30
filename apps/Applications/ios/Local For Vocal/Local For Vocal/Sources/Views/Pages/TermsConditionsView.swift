import SwiftUI

struct TermsConditionsView: View {
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

                Text("Terms & Conditions")
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

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Last Updated: January 2026")
                        .font(.caption)
                        .foregroundColor(.gray)

                    Text("1. Introduction")
                        .font(.headline)
                    Text(
                        "Welcome to Local For Vocal. By using our app, you agree to these terms..."
                    )
                    .font(.body)
                    .foregroundColor(Color(hex: "#4B5563"))

                    Text("2. User Accounts")
                        .font(.headline)
                    Text(
                        "You are responsible for maintaining the confidentiality of your account..."
                    )
                    .font(.body)
                    .foregroundColor(Color(hex: "#4B5563"))

                    Text("3. Orders & Payments")
                        .font(.headline)
                    Text(
                        "All orders are subject to availability. Payments must be made via approved methods..."
                    )
                    .font(.body)
                    .foregroundColor(Color(hex: "#4B5563"))

                    Text("4. Returns & Refunds")
                        .font(.headline)
                    Text("Please refer to our Return Policy for details on returns and refunds...")
                        .font(.body)
                        .foregroundColor(Color(hex: "#4B5563"))

                    Text("5. Limitation of Liability")
                        .font(.headline)
                    Text(
                        "Local For Vocal shall not be liable for any indirect, incidental, or consequential damages..."
                    )
                    .font(.body)
                    .foregroundColor(Color(hex: "#4B5563"))
                }
                .padding(16)
            }
            .background(Color.white)
        }
        .navigationBarHidden(true)
    }
}
