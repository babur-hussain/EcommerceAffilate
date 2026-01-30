import SwiftUI

// MARK: - Color Hex Extension (Local Fallback)

public struct PaymentView: View {
    let totalAmount: Double
    let discount: Double
    let itemCount: Int
    let onBack: () -> Void
    let onPaymentSelect: (String) -> Void
    @Binding var isLoading: Bool

    @State private var expandedSection: String? = nil
    @State private var isTotalExpanded = false

    public var body: some View {
        VStack(spacing: 0) {
            // Header
            paymentHeader

            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    // Total Amount Summary Card
                    totalAmountCard

                    // Discount Banner (if applicable)
                    if discount > 0 {
                        discountBanner
                    }

                    // Payment Options Title
                    HStack {
                        Text("Payment Options")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#374151"))
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)

                    // Pay Online Card (Recommended)
                    payOnlineCard

                    // Saved Payment Options
                    PaymentAccordionView(
                        id: "saved",
                        icon: "clock",
                        title: "Saved Payment Options",
                        expandedSection: $expandedSection,
                        content: {
                            Text("No saved cards found.")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "#9CA3AF"))
                                .italic()
                        }
                    )

                    // Cash on Delivery
                    PaymentAccordionView(
                        id: "cod",
                        icon: "banknote",
                        title: "Cash on Delivery",
                        expandedSection: $expandedSection,
                        content: {
                            Button(action: {
                                onPaymentSelect("COD")
                            }) {
                                Text("Place Order")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 44)
                                    .background(Color(hex: "#2563EB"))
                                    .cornerRadius(6)
                            }
                        }
                    )

                    Spacer().frame(height: 40)
                }
            }
        }
        .background(Color(hex: "#F3F4F6"))
        .navigationBarHidden(true)
    }

    // MARK: - Header
    private var paymentHeader: some View {
        HStack {
            HStack(spacing: 12) {
                Button(action: onBack) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "#1F2937"))
                        .padding(4)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text("Step 3 of 3")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
                    Text("Payments")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
            }

            Spacer()

            // Secure Badge
            HStack(spacing: 4) {
                Image(systemName: "lock.fill")
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#4B5563"))
                Text("100% Secure")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(hex: "#4B5563"))
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color(hex: "#F3F4F6"))
            .cornerRadius(4)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
        .overlay(
            Rectangle()
                .fill(Color(hex: "#E5E7EB"))
                .frame(height: 1),
            alignment: .bottom
        )
    }

    // MARK: - Total Amount Card
    private var totalAmountCard: some View {
        Button(action: {
            withAnimation(.easeInOut(duration: 0.25)) {
                isTotalExpanded.toggle()
            }
        }) {
            VStack(spacing: 0) {
                HStack {
                    HStack(spacing: 6) {
                        Text("Total Amount")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#2563EB"))
                        Image(systemName: isTotalExpanded ? "chevron.up" : "chevron.down")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#2563EB"))
                    }

                    Spacer()

                    Text("₹\(formatPrice(totalAmount))")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#2563EB"))
                }

                if isTotalExpanded {
                    VStack(spacing: 6) {
                        Divider()
                            .background(Color(hex: "#BFDBFE"))
                            .padding(.top, 12)

                        HStack {
                            Text("Price")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#4B5563"))
                            Spacer()
                            Text("₹\(formatPrice(totalAmount + discount))")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#1F2937"))
                        }
                        .padding(.top, 8)

                        HStack {
                            Text("Discount")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#4B5563"))
                            Spacer()
                            Text("- ₹\(formatPrice(discount))")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Color(hex: "#059669"))
                        }
                    }
                }
            }
            .padding(16)
            .background(Color(hex: "#EFF6FF"))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(hex: "#DBEAFE"), lineWidth: 1)
            )
            .cornerRadius(8)
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.horizontal, 16)
        .padding(.top, 16)
        .padding(.bottom, 8)
    }

    // MARK: - Discount Banner
    private var discountBanner: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Instant Discount")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#065F46"))
                Text("Claim now with payment offers")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "#047857"))
            }

            Spacer()

            ZStack {
                Circle()
                    .fill(Color.white)
                    .frame(width: 24, height: 24)
                    .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
                Image(systemName: "tag.fill")
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#047857"))
            }
        }
        .padding(16)
        .background(Color(hex: "#ECFDF5"))
        .cornerRadius(8)
        .padding(.horizontal, 16)
        .padding(.bottom, 16)
    }

    // MARK: - Pay Online Card
    private var payOnlineCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                // Shield Icon
                Image(systemName: "shield.checkered")
                    .font(.system(size: 24))
                    .foregroundColor(Color(hex: "#002E6E"))

                VStack(alignment: .leading, spacing: 2) {
                    Text("Pay Online")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Text("UPI, Cards, Wallet, NetBanking")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
                }

                Spacer()

                // Recommended Badge
                Text("Recommended")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color(hex: "#BE123C"))
                    .cornerRadius(4)
            }

            Button(action: {
                if !isLoading {
                    onPaymentSelect("RAZORPAY")
                }
            }) {
                if isLoading {
                    HStack(spacing: 8) {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.9)
                        Text("Processing...")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(Color(hex: "#93C5FD"))
                    .cornerRadius(6)
                } else {
                    Text("Pay Now")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color(hex: "#2563EB"))
                        .cornerRadius(6)
                }
            }
            .disabled(isLoading)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(8)
        .shadow(color: .black.opacity(0.05), radius: 2, y: 1)
        .padding(.horizontal, 16)
        .padding(.bottom, 12)
    }

    private func formatPrice(_ price: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: price)) ?? "\(Int(price))"
    }
}

// MARK: - Payment Accordion View
public struct PaymentAccordionView<Content: View>: View {
    let id: String
    let icon: String
    let title: String
    let subtitle: String?
    let offerText: String?
    @Binding var expandedSection: String?
    @ViewBuilder let content: () -> Content

    init(
        id: String,
        icon: String,
        title: String,
        subtitle: String? = nil,
        offerText: String? = nil,
        expandedSection: Binding<String?>,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.id = id
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.offerText = offerText
        self._expandedSection = expandedSection
        self.content = content
    }

    var isExpanded: Bool {
        expandedSection == id
    }

    public var body: some View {
        VStack(spacing: 0) {
            // Header
            Button(action: {
                withAnimation(.easeInOut(duration: 0.25)) {
                    expandedSection = isExpanded ? nil : id
                }
            }) {
                HStack(alignment: .top) {
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: icon)
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "#374151"))
                            .frame(width: 24)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(title)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(Color(hex: "#111827"))

                            if let subtitle = subtitle {
                                Text(subtitle)
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "#6B7280"))
                            }

                            if let offerText = offerText {
                                Text(offerText)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(Color(hex: "#16A34A"))
                            }
                        }
                    }

                    Spacer()

                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#6B7280"))
                }
                .padding(16)
                .background(isExpanded ? Color(hex: "#F9FAFB") : Color.white)
            }
            .buttonStyle(PlainButtonStyle())

            // Content
            if isExpanded {
                VStack {
                    content()
                }
                .padding(.horizontal, 16)
                .padding(.leading, 36)
                .padding(.bottom, 16)
                .padding(.top, 4)
                .background(Color.white)
            }
        }
        .background(Color.white)
    }
}

// MARK: - Preview
struct PaymentView_Previews: PreviewProvider {
    static var previews: some View {
        PaymentView(
            totalAmount: 1499,
            discount: 200,
            itemCount: 1,
            onBack: {},
            onPaymentSelect: { _ in },
            isLoading: .constant(false)
        )
    }
}
