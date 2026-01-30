import SwiftUI

struct HelpCenterView: View {
    @Environment(\.presentationMode) var presentationMode

    struct FAQItem: Identifiable {
        let id = UUID()
        let question: String
        let answer: String
    }

    let faqs = [
        FAQItem(
            question: "How do I track my order?",
            answer: "You can track your order status in the 'My Orders' section of your account."),
        FAQItem(
            question: "What is the return policy?",
            answer:
                "We accept returns within 7 days of delivery for most items. Please check the product page for specific return details."
        ),
        FAQItem(
            question: "How can I contact customer support?",
            answer: "You can reach us at support@localforvocal.com or call our helpline."),
        FAQItem(
            question: "Do you offer international shipping?",
            answer: "Currently, we only ship within India."),
        FAQItem(
            question: "How do I change my password?",
            answer: "Go to Account Settings > Edit Profile to update your password."),
    ]

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

                Text("Help Center")
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
                VStack(spacing: 16) {
                    ForEach(faqs) { faq in
                        DisclosureGroup(faq.question) {
                            Text(faq.answer)
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                                .padding(.top, 4)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .accentColor(.black)
                        .padding()
                        .background(Color.white)
                        .cornerRadius(8)
                        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                    }
                }
                .padding(16)
            }
            .background(Color(hex: "#F3F4F6"))
        }
        .navigationBarHidden(true)
    }
}
