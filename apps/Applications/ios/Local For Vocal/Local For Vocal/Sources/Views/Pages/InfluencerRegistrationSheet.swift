import SwiftUI

// MARK: - Constants
private let headerAccentColor = Color(hex: "#E94057")

struct InfluencerRegistrationSheet: View {
    @Environment(\.presentationMode) var presentationMode

    // Form Data
    @State private var fullName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var socialPlatform = "Instagram"
    @State private var socialHandle = ""
    @State private var audienceSize = ""
    @State private var niche = ""
    @State private var bio = ""

    @State private var isLoading = false
    @State private var showSuccessAlert = false

    let platforms = ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "Blog"]
    let audienceSizes = ["1k - 10k", "10k - 50k", "50k - 500k", "500k+"]

    var body: some View {
        NavigationView {
            Form {
                // Header Section
                Section {
                    VStack(alignment: .center, spacing: 8) {
                        Image(systemName: "star.circle.fill")
                            .font(.system(size: 40))
                            .foregroundColor(headerAccentColor)
                            .frame(maxWidth: .infinity)

                        Text("Join Creator's Squad")
                            .font(.headline)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)

                        Text("Partner with us, share products you love, and earn commissions.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)
                            .padding(.bottom, 8)
                    }
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())
                }

                // Personal Info
                Section(header: Text("Personal Details")) {
                    TextField("Full Name", text: $fullName)
                        .textContentType(.name)

                    TextField("Email Address", text: $email)
                        .keyboardType(.emailAddress)
                        .textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)

                    TextField("Phone Number", text: $phone)
                        .keyboardType(.phonePad)
                        .textContentType(.telephoneNumber)
                }

                // Social Info
                Section(header: Text("Social Profile")) {
                    Picker("Primary Platform", selection: $socialPlatform) {
                        ForEach(platforms, id: \.self) { platform in
                            Text(platform).tag(platform)
                        }
                    }

                    TextField("Social Handle (@username)", text: $socialHandle)
                        .textInputAutocapitalization(.never)
                        .disableAutocorrection(true)

                    Picker("Audience Size", selection: $audienceSize) {
                        Text("Select Range").tag("")
                        ForEach(audienceSizes, id: \.self) { size in
                            Text(size).tag(size)
                        }
                    }

                    TextField("Niche / Category", text: $niche)
                }

                // Bio
                Section(header: Text("About You")) {
                    TextEditor(text: $bio)
                        .frame(height: 80)
                }

                // Submit Action
                Section {
                    Button(action: submitForm) {
                        if isLoading {
                            HStack {
                                Spacer()
                                ProgressView()
                                Spacer()
                            }
                        } else {
                            Text("Submit Application")
                                .bold()
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .listRowBackground(
                        LinearGradient(
                            colors: [Color(hex: "#8A2387"), Color(hex: "#E94057")],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .disabled(isLoading || fullName.isEmpty || email.isEmpty)
                }
            }
            .navigationBarTitle("Apply", displayMode: .inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { presentationMode.wrappedValue.dismiss() }
                }
            }
            .alert("Success", isPresented: $showSuccessAlert) {
                Button("OK") { presentationMode.wrappedValue.dismiss() }
            } message: {
                Text("Your application has been submitted successfully!")
            }
        }
    }

    private func submitForm() {
        isLoading = true

        Task {
            do {
                try await AuthManager.shared.registerInfluencer(
                    name: fullName,
                    email: email,
                    phone: phone,
                    platform: socialPlatform,
                    handle: socialHandle,
                    niche: niche,
                    bio: bio
                )

                await MainActor.run {
                    isLoading = false
                    showSuccessAlert = true
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    // TODO: Show error alert (reusing success alert var for now or add error alert)
                    AppLogger.error("Registration error: \(error.localizedDescription)")
                }
            }
        }
    }
}
