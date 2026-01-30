import SwiftUI

struct NotificationsView: View {
    @Environment(\.presentationMode) var presentationMode

    @State private var pushEnabled = true
    @State private var emailEnabled = true
    @State private var smsEnabled = false
    @State private var offerAlerts = true

    // Brand Colors
    private let primaryBlue = Color(red: 37 / 255, green: 99 / 255, blue: 235 / 255)

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "#111827"))
                }

                Spacer()

                Text("Notifications")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                Spacer()

                // Placeholder for symmetry
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
                VStack(alignment: .leading, spacing: 24) {

                    // Section 1: General
                    VStack(alignment: .leading, spacing: 0) {
                        Text("General Preferences")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#6B7280"))
                            .padding(.bottom, 8)
                            .padding(.horizontal, 16)

                        VStack(spacing: 0) {
                            toggleRow(
                                title: "Push Notifications",
                                subtitle: "Receive alerts on this device", isOn: $pushEnabled,
                                isLast: false)
                            toggleRow(
                                title: "Email Notifications", subtitle: "Receive updates via email",
                                isOn: $emailEnabled, isLast: false)
                            toggleRow(
                                title: "SMS Notifications", subtitle: "Receive updates via SMS",
                                isOn: $smsEnabled, isLast: true)
                        }
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                        )
                    }

                    // Section 2: Types
                    VStack(alignment: .leading, spacing: 0) {
                        Text("Alert Types")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#6B7280"))
                            .padding(.bottom, 8)
                            .padding(.horizontal, 16)

                        VStack(spacing: 0) {
                            toggleRow(
                                title: "Offer & Sale Alerts",
                                subtitle: "Get notified about discounts", isOn: $offerAlerts,
                                isLast: true)
                        }
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                        )
                    }

                    Text("Note: These settings are stored locally for this session.")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .padding(.horizontal, 16)
                }
                .padding(16)
            }
        }
        .background(Color(hex: "#F9FAFB"))
        .navigationBarHidden(true)
    }

    private func toggleRow(title: String, subtitle: String, isOn: Binding<Bool>, isLast: Bool)
        -> some View
    {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(Color(hex: "#111827"))
                    Text(subtitle)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "#6B7280"))
                }

                Spacer()

                Toggle("", isOn: isOn)
                    .labelsHidden()
                    .toggleStyle(SwitchToggleStyle(tint: primaryBlue))
            }
            .padding(16)

            if !isLast {
                Divider()
                    .padding(.leading, 16)
            }
        }
    }
}
