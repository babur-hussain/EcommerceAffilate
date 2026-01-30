import SwiftUI

// MARK: - Profile Edit View
struct ProfileEditView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject private var authManager = AuthManager.shared

    @State private var name: String = ""
    @State private var phone: String = ""
    @State private var bio: String = ""
    @State private var isLoading = false
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var alertSuccess = false

    // Brand Colors
    private let primaryBlue = Color(red: 37 / 255, green: 99 / 255, blue: 235 / 255)
    private let darkText = Color(red: 17 / 255, green: 24 / 255, blue: 39 / 255)
    private let grayText = Color(red: 107 / 255, green: 114 / 255, blue: 128 / 255)
    private let lightGray = Color(red: 156 / 255, green: 163 / 255, blue: 175 / 255)
    private let borderColor = Color(red: 229 / 255, green: 231 / 255, blue: 235 / 255)
    private let bgGray = Color(red: 249 / 255, green: 250 / 255, blue: 251 / 255)

    var body: some View {
        VStack(spacing: 0) {
            // Header
            header

            // Content
            ScrollView {
                VStack(spacing: 32) {
                    // Profile Image Section
                    profileImageSection

                    // Form Fields
                    formFields
                }
                .padding(24)
            }
        }
        .background(Color.white)
        .toolbar(.hidden, for: .navigationBar)
        .onAppear {
            loadCurrentUserData()
        }
        .alert(alertSuccess ? "Success" : "Error", isPresented: $showAlert) {
            Button("OK") {
                if alertSuccess {
                    presentationMode.wrappedValue.dismiss()
                }
            }
        } message: {
            Text(alertMessage)
        }
    }

    // MARK: - Header
    private var header: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Text("Cancel")
                    .font(.system(size: 16))
                    .foregroundColor(grayText)
            }

            Spacer()

            Text("Edit Profile")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(darkText)

            Spacer()

            Button(action: saveProfile) {
                if isLoading {
                    ProgressView()
                        .scaleEffect(0.8)
                } else {
                    Text("Save")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(primaryBlue)
                }
            }
            .disabled(isLoading)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .overlay(
            Rectangle()
                .fill(Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255))
                .frame(height: 1),
            alignment: .bottom
        )
    }

    // MARK: - Profile Image Section
    private var profileImageSection: some View {
        VStack(spacing: 12) {
            ZStack(alignment: .bottomTrailing) {
                // Profile Image
                if let profileImage = authManager.currentUser?.profileImage,
                    let url = URL(string: profileImage)
                {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        default:
                            Circle()
                                .fill(Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255))
                                .overlay(
                                    Image(systemName: "person.fill")
                                        .font(.system(size: 40))
                                        .foregroundColor(lightGray)
                                )
                        }
                    }
                    .frame(width: 100, height: 100)
                    .clipShape(Circle())
                } else {
                    Circle()
                        .fill(Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255))
                        .frame(width: 100, height: 100)
                        .overlay(
                            Image(systemName: "person.fill")
                                .font(.system(size: 40))
                                .foregroundColor(lightGray)
                        )
                }

                // Camera Button
                Button(action: {
                    // Photo picker to be implemented later
                }) {
                    Image(systemName: "camera.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                        .padding(8)
                        .background(primaryBlue)
                        .clipShape(Circle())
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 3)
                        )
                }
            }

            Text("Change Profile Photo")
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(primaryBlue)
        }
    }

    // MARK: - Form Fields
    private var formFields: some View {
        VStack(spacing: 20) {
            // Name Field
            formGroup(label: "Full Name") {
                TextField("Enter your name", text: $name)
                    .font(.system(size: 16))
                    .foregroundColor(darkText)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(borderColor, lineWidth: 1)
                    )
            }

            // Email Field (disabled)
            formGroup(label: "Email Address") {
                VStack(alignment: .leading, spacing: 4) {
                    Text(authManager.currentUser?.email ?? "")
                        .font(.system(size: 16))
                        .foregroundColor(lightGray)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(bgGray)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(
                                    Color(red: 243 / 255, green: 244 / 255, blue: 246 / 255),
                                    lineWidth: 1)
                        )

                    Text("Email cannot be changed")
                        .font(.system(size: 12))
                        .foregroundColor(lightGray)
                }
            }

            // Phone Field
            formGroup(label: "Phone Number") {
                TextField("Enter phone number", text: $phone)
                    .font(.system(size: 16))
                    .foregroundColor(darkText)
                    .keyboardType(.phonePad)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(borderColor, lineWidth: 1)
                    )
            }

            // Bio Field
            formGroup(label: "Bio") {
                TextEditor(text: $bio)
                    .font(.system(size: 16))
                    .foregroundColor(darkText)
                    .frame(minHeight: 100)
                    .padding(8)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(borderColor, lineWidth: 1)
                    )
                    .overlay(
                        Group {
                            if bio.isEmpty {
                                Text("Tell something about yourself")
                                    .font(.system(size: 16))
                                    .foregroundColor(
                                        Color(red: 156 / 255, green: 163 / 255, blue: 175 / 255)
                                    )
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 16)
                            }
                        },
                        alignment: .topLeading
                    )
            }
        }
    }

    private func formGroup<Content: View>(label: String, @ViewBuilder content: () -> Content)
        -> some View
    {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(red: 55 / 255, green: 65 / 255, blue: 81 / 255))

            content()
        }
    }

    // MARK: - Load Current User Data
    private func loadCurrentUserData() {
        name = authManager.currentUser?.name ?? ""
        phone = authManager.currentUser?.phone ?? ""
        // bio would come from user object if available
    }

    // MARK: - Save Profile
    private func saveProfile() {
        guard !isLoading else { return }
        isLoading = true

        guard let token = authManager.authToken else {
            alertMessage = "Please login to update profile"
            alertSuccess = false
            showAlert = true
            isLoading = false
            return
        }

        guard let url = URL(string: "\(APIService.shared.baseURL)/me") else {
            alertMessage = "Invalid URL"
            alertSuccess = false
            showAlert = true
            isLoading = false
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "name": name,
            "phoneNumber": phone,
            "bio": bio,
        ]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            alertMessage = "Failed to prepare request"
            alertSuccess = false
            showAlert = true
            isLoading = false
            return
        }

        Task {
            do {
                let (_, response) = try await URLSession.shared.data(for: request)

                guard let httpResponse = response as? HTTPURLResponse,
                    (200...299).contains(httpResponse.statusCode)
                else {
                    await MainActor.run {
                        alertMessage = "Failed to update profile"
                        alertSuccess = false
                        showAlert = true
                        isLoading = false
                    }
                    return
                }

                // Refresh user data would be ideal here if AuthManager supports it
                await MainActor.run {
                    alertMessage = "Profile updated successfully"
                    alertSuccess = true
                    showAlert = true
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    alertMessage = "Failed to update profile"
                    alertSuccess = false
                    showAlert = true
                    isLoading = false
                }
                print("Profile update error: \(error)")
            }
        }
    }
}

// MARK: - Preview
struct ProfileEditView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileEditView()
    }
}
