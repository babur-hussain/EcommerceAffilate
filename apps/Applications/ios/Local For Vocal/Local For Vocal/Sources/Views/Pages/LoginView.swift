import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

// MARK: - Keyboard Helper
extension View {
    func hideKeyboard() {
        #if canImport(UIKit)
            UIApplication.shared.sendAction(
                #selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        #endif
    }
}
struct LoginView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var showSignup = false

    var body: some View {
        // Fix #8: Removed unused GeometryReader
        ZStack {
            // Blue background - tappable to dismiss keyboard
            Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255)
                .ignoresSafeArea()
                .contentShape(Rectangle())
                .onTapGesture {
                    hideKeyboard()
                }

            VStack(spacing: 0) {
                // Header
                headerView

                // Content
                formContent
            }
        }
        .alert("Login Failed", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
        .sheet(isPresented: $showSignup) {
            SignupView()
        }
    }

    // MARK: - Header
    private var headerView: some View {
        HStack {
            Button(action: { dismiss() }) {
                Image(systemName: "xmark")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
            }

            Spacer()

            Text("Local For Vocal")
                .font(.system(size: 18, weight: .bold))
                .italic()
                .foregroundColor(.white)

            Spacer()

            Color.clear.frame(width: 44, height: 44)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 12)
    }

    // MARK: - Form Content
    private var formContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Title
                VStack(alignment: .leading, spacing: 8) {
                    Text("Log in for the best experience")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.black)

                    Text("Enter your details to continue")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                .padding(.bottom, 12)

                // Email Field
                VStack(alignment: .leading, spacing: 6) {
                    Text("Email Address")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))

                    TextField("Enter your email", text: $email)
                        .textContentType(.emailAddress)
                        //                        .keyboardType(.emailAddress)
                        //                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .padding(12)
                        .background(Color.white)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.3)))
                }

                // Password Field
                VStack(alignment: .leading, spacing: 6) {
                    Text("Password")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))

                    HStack {
                        if showPassword {
                            TextField("Enter password", text: $password)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled()
                        } else {
                            SecureField("Enter password", text: $password)
                                .textInputAutocapitalization(.never)
                        }

                        Button(showPassword ? "Hide" : "Show") {
                            showPassword.toggle()
                        }
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))
                    }
                    .padding(12)
                    .background(Color.white)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.3)))
                }

                // Terms
                Text("By continuing, you agree to our Terms of Use and Privacy Policy.")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                    .padding(.vertical, 8)

                // Continue Button
                Button(action: handleLogin) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color(red: 251 / 255, green: 100 / 255, blue: 27 / 255))

                        if isLoading {
                            ProgressView().tint(.white)
                        } else {
                            Text("Continue")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    .frame(height: 48)
                }
                .disabled(isLoading || email.isEmpty || password.isEmpty)

                // Divider
                HStack {
                    Rectangle().frame(height: 1).foregroundColor(Color.gray.opacity(0.3))
                    Text("Or continue with").font(.system(size: 12)).foregroundColor(.gray)
                    Rectangle().frame(height: 1).foregroundColor(Color.gray.opacity(0.3))
                }
                .padding(.vertical, 16)

                // Google Button
                Button(action: handleGoogleLogin) {
                    HStack(spacing: 12) {
                        Image(systemName: "g.circle.fill")  // Placeholder if asset not available, or use text
                            .font(.system(size: 20))
                            .foregroundColor(.red)
                        Text("Sign in with Google")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.black)
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    )
                }

                // Sign Up
                HStack {
                    Spacer()
                    Button("New here? Sign Up") {
                        showSignup = true
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))
                    Spacer()
                }
                .padding(.top, 16)

                Spacer(minLength: 100)
            }
            .padding(24)
        }
        .frame(maxHeight: .infinity)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .ignoresSafeArea(edges: .bottom)
    }

    // MARK: - Login Handler
    private func handleLogin() {
        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Please fill in all fields"
            showError = true
            return
        }

        isLoading = true

        Task {
            do {
                try await AuthManager.shared.login(email: email, password: password)
                await MainActor.run {
                    isLoading = false
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = "Invalid email or password"
                    showError = true
                }
            }
        }
    }

    private func handleGoogleLogin() {
        isLoading = true
        Task {
            do {
                try await AuthManager.shared.signInWithGoogle()
                await MainActor.run {
                    isLoading = false
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = error.localizedDescription
                    showError = true
                }
            }
        }
    }
}

// MARK: - Signup View
struct SignupView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var showPassword = false
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""

    private var isFormValid: Bool {
        !name.isEmpty && !email.isEmpty && !phone.isEmpty && !password.isEmpty
            && password == confirmPassword && password.count >= 6
    }

    var body: some View {
        // Fix #8: Removed unused GeometryReader
        ZStack {
            Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255)
                .ignoresSafeArea()
                .contentShape(Rectangle())
                .onTapGesture {
                    hideKeyboard()
                }

            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20, weight: .medium))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                    }

                    Spacer()

                    Text("Local For Vocal")
                        .font(.system(size: 18, weight: .bold))
                        .italic()
                        .foregroundColor(.white)

                    Spacer()

                    Color.clear.frame(width: 44, height: 44)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 12)

                // Form
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Create your account")
                            .font(.system(size: 18, weight: .bold))
                        Text("Fill in your details to get started")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                            .padding(.bottom, 16)

                        formField("Full Name", placeholder: "Enter your name", text: $name)
                        formField(
                            "Email Address", placeholder: "Enter your email", text: $email,
                            keyboard: .emailAddress)
                        formField(
                            "Phone Number", placeholder: "Enter phone", text: $phone,
                            keyboard: .phonePad)

                        // Password
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Password")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(
                                    Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))

                            HStack {
                                if showPassword {
                                    TextField("Enter password", text: $password)
                                        .textInputAutocapitalization(.never)
                                } else {
                                    SecureField("Enter password", text: $password)
                                }

                                Button(showPassword ? "Hide" : "Show") {
                                    showPassword.toggle()
                                }
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(
                                    Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))
                            }
                            .padding(12)
                            .background(Color.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8).stroke(
                                    Color.gray.opacity(0.3)))
                        }

                        // Confirm Password
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Confirm Password")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(
                                    Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))

                            SecureField("Confirm password", text: $confirmPassword)
                                .textInputAutocapitalization(.never)
                                .padding(12)
                                .background(Color.white)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8).stroke(
                                        password == confirmPassword || confirmPassword.isEmpty
                                            ? Color.gray.opacity(0.3) : Color.red))
                        }

                        Text("By signing up, you agree to our Terms of Use and Privacy Policy.")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                            .padding(.vertical, 8)

                        Button(action: handleSignup) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(
                                        Color(red: 251 / 255, green: 100 / 255, blue: 27 / 255)
                                            .opacity(isFormValid ? 1 : 0.5))

                                if isLoading {
                                    ProgressView().tint(.white)
                                } else {
                                    Text("Sign Up")
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(.white)
                                }
                            }
                            .frame(height: 48)
                        }
                        .disabled(isLoading || !isFormValid)

                        HStack {
                            Spacer()
                            Button("Already have an account? Log In") { dismiss() }
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(
                                    Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))
                            Spacer()
                        }
                        .padding(.top, 16)
                    }
                    .padding(24)
                }
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .ignoresSafeArea(edges: .bottom)
            }
        }
        .alert("Registration Failed", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
    }

    private func formField(
        _ title: String, placeholder: String, text: Binding<String>,
        keyboard: UIKeyboardType = .default
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(red: 40 / 255, green: 116 / 255, blue: 240 / 255))

            TextField(placeholder, text: text)
                .keyboardType(keyboard)
                .textInputAutocapitalization(keyboard == .emailAddress ? .never : .words)
                .autocorrectionDisabled()
                .padding(12)
                .background(Color.white)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.3)))
        }
    }

    private func handleSignup() {
        isLoading = true
        Task {
            do {
                try await AuthManager.shared.register(
                    name: name, email: email, phone: phone, password: password)
                await MainActor.run {
                    isLoading = false
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = "Registration failed"
                    showError = true
                }
            }
        }
    }
}

#Preview {
    LoginView()
}
