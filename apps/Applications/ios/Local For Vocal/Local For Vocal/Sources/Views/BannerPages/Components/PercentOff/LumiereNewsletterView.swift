import SwiftUI

struct LumiereNewsletterView: View {
    @State private var email: String = ""

    var body: some View {
        VStack(spacing: 0) {
            Text("Join the Club")
                .font(.custom("PlayfairDisplay-SemiBold", size: 20))
                .foregroundColor(Color(hex: "111827"))
                .padding(.bottom, 8)

            Text("Get exclusive offers and early access to new drops.")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)
                .padding(.bottom, 24)

            HStack(spacing: 8) {
                TextField("Your email", text: $email)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "111827"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Color(hex: "F3F4F6"))
                    .cornerRadius(12)

                Button(action: {
                    // Subscribe action
                }) {
                    Image(systemName: "arrow.right")
                        .font(.system(size: 20))
                        .foregroundColor(.white)
                        .frame(width: 44, height: 44)
                        .background(Color(hex: "6D28D9"))
                        .cornerRadius(12)
                        .shadow(color: Color(hex: "6D28D9").opacity(0.3), radius: 8, x: 0, y: 4)
                }
            }
        }
        .padding(.horizontal, 24)
        .padding(.top, 24)
        .padding(.bottom, 48)
    }
}
