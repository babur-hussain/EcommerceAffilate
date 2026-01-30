import SwiftUI

struct PrivacyPolicyView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var showDeleteAlert = false
    @State private var showDeactivateAlert = false

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

                Text("Privacy Center")
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
                VStack(spacing: 0) {
                    Group {
                        menuItem(title: "Privacy Policy", icon: "doc.text.fill")
                        Divider().padding(.leading, 16)
                        menuItem(title: "Request My Data", icon: "arrow.down.doc.fill")
                        Divider().padding(.leading, 16)
                        menuItem(title: "Consent Management", icon: "checkmark.shield.fill")
                        Divider().padding(.leading, 16)
                        menuItem(title: "Grievance Redressal", icon: "exclamationmark.bubble.fill")
                    }
                    .background(Color.white)

                    Spacer().frame(height: 24)

                    VStack(spacing: 0) {
                        Button(action: { showDeactivateAlert = true }) {
                            HStack {
                                Text("Deactivate Account")
                                    .foregroundColor(.blue)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.gray)
                                    .font(.system(size: 14))
                            }
                            .padding()
                            .background(Color.white)
                        }

                        Divider().padding(.leading, 16)

                        Button(action: { showDeleteAlert = true }) {
                            HStack {
                                Text("Delete Account")
                                    .foregroundColor(.red)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.gray)
                                    .font(.system(size: 14))
                            }
                            .padding()
                            .background(Color.white)
                        }
                    }
                    .background(Color.white)
                    .cornerRadius(8)
                    .padding(.horizontal, 0)  // Full width group
                }
                .padding(.vertical, 16)
            }
            .background(Color(hex: "#F3F4F6"))
        }
        .navigationBarHidden(true)
        .alert("Deactivate Account", isPresented: $showDeactivateAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Deactivate", role: .destructive) {
                // Handle deactivation
            }
        } message: {
            Text("Are you sure you want to deactivate your account? This is temporary.")
        }
        .alert("Delete Account", isPresented: $showDeleteAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Delete", role: .destructive) {
                // Handle deletion
            }
        } message: {
            Text("Are you sure you want to delete your account? This action cannot be undone.")
        }
    }

    private func menuItem(title: String, icon: String) -> some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(Color(hex: "#6B7280"))
                .frame(width: 24)
            Text(title)
                .foregroundColor(Color(hex: "#374151"))
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.gray)
                .font(.system(size: 14))
        }
        .padding()
        .background(Color.white)
    }
}
