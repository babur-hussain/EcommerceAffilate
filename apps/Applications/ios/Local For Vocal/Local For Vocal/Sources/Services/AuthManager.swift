import Combine
import Foundation
import GoogleSignIn
import SwiftUI

// MARK: - User Model
public struct User: Codable, Identifiable {
    public let _id: String
    public let name: String
    public let email: String
    public let phone: String?
    public var role: String?  // Changed to var to allow local update
    public let profileImage: String?
    public let referralCode: String?

    public var id: String { _id }
}

// MARK: - Auth Response
public struct AuthResponse: Codable {
    public let token: String
    public let user: User
}

// MARK: - Auth Manager
public class AuthManager: ObservableObject {
    public static let shared = AuthManager()

    @Published public var isLoggedIn: Bool = false
    @Published public var currentUser: User? = nil
    @Published public var authToken: String? = nil

    private let tokenKey = "authToken"
    private let userKey = "currentUser"

    private init() {
        loadFromStorage()
    }

    // MARK: - Check Login Status
    public var isAuthenticated: Bool {
        return authToken != nil && currentUser != nil
    }

    // MARK: - Load from Keychain/UserDefaults
    private func loadFromStorage() {
        // Try Keychain first (new secure storage)
        if let token = KeychainManager.shared.authToken {
            self.authToken = token
        } else if let token = UserDefaults.standard.string(forKey: tokenKey) {
            // Migration: Move token from UserDefaults to Keychain
            self.authToken = token
            KeychainManager.shared.authToken = token
            UserDefaults.standard.removeObject(forKey: tokenKey)
        }

        // User data still in UserDefaults (non-sensitive)
        if authToken != nil,
            let userData = UserDefaults.standard.data(forKey: userKey),
            let user = try? JSONDecoder().decode(User.self, from: userData)
        {
            self.currentUser = user
            self.isLoggedIn = true
        }
    }

    // MARK: - Save to Storage
    private func saveToStorage() {
        // Save token securely in Keychain
        KeychainManager.shared.authToken = authToken

        // User data (non-sensitive) can stay in UserDefaults
        if let user = currentUser,
            let userData = try? JSONEncoder().encode(user)
        {
            UserDefaults.standard.set(userData, forKey: userKey)
        }
    }

    // MARK: - Login
    public func login(email: String, password: String) async throws {
        guard let url = URL(string: "\(APIService.shared.baseURL)/auth/login") else {
            throw APIService.APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw AuthError.loginFailed
        }

        let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)

        await MainActor.run {
            self.authToken = authResponse.token
            self.currentUser = authResponse.user
            self.isLoggedIn = true
            saveToStorage()
        }
    }

    // MARK: - Register
    public func register(name: String, email: String, phone: String, password: String)
        async throws
    {
        guard let url = URL(string: "\(APIService.shared.baseURL)/auth/register") else {
            throw APIService.APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "name": name,
            "email": email,
            "phone": phone,
            "password": password,
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw AuthError.registrationFailed
        }

        let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)

        await MainActor.run {
            self.authToken = authResponse.token
            self.currentUser = authResponse.user
            self.isLoggedIn = true
            saveToStorage()
        }
    }

    // MARK: - Register Influencer
    public func registerInfluencer(
        name: String,
        email: String,
        phone: String,
        platform: String,
        handle: String,
        socialLink: String = "",
        niche: String,
        bio: String
    ) async throws {
        guard let token = authToken else { throw AuthError.notAuthenticated }

        // Ensure URLs
        guard let url = URL(string: "\(APIService.shared.baseURL)/influencer/register") else {
            throw APIService.APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        // Construct robust payload required by Business Model
        // but simplified for Influencer flow
        let payload: [String: Any] = [
            "accountType": "new",
            "businessIdentity": [
                "legalBusinessName": name,
                "tradeName": handle,  // Use handle as business name
                "businessType": "Influencer",
                "natureOfBusiness": "Influencer",
                "yearOfEstablishment": 2024,
            ],
            "ownerDetails": [
                "fullName": name,
                "email": email,
                "mobileNumber": phone,
                "designation": "Content Creator",
                "governmentIdType": "PAN",
                "governmentIdNumber": "NA",
            ],
            "storeProfile": [
                "description": bio,
                "brandOwnership": "Influencer",
                "categories": [niche],
                "socialMediaLinks": [
                    platform.lowercased(): socialLink.isEmpty ? handle : socialLink
                ],
            ],
            "addresses": [
                "registered": [
                    "addressLine1": "NA",
                    "city": "NA",
                    "state": "NA",
                    "country": "India",
                    "pincode": "000000",
                ]
            ],
            // Dummy compliance and tax/bank (will be allowed by relaxed schema)
            "compliance": [
                "sellerAgreementAccepted": true,
                "platformPoliciesAccepted": true,
                "taxResponsibilityAccepted": true,
            ],
            "taxLegal": [
                "gstinNumber": "NA",  // Optional now
                "panNumber": "NA",
            ],
            "bankDetails": [
                "accountHolderName": name
            ],
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: payload)

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw AuthError.registrationFailed  // Reuse generic error
        }

        // On success, update local user role
        await MainActor.run {
            self.currentUser?.role = "INFLUENCER"
            saveToStorage()
        }
    }

    // MARK: - Google Login
    @MainActor
    public func signInWithGoogle() async throws {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let rootViewController = windowScene.windows.first?.rootViewController
        else {
            throw AuthError.googleLoginFailed  // Fixed: Was silent failure
        }

        let result = try await GIDSignIn.sharedInstance.signIn(withPresenting: rootViewController)
        let user = result.user

        // Send ID token to backend to verify and get local JWT
        guard let idToken = user.idToken?.tokenString else {
            throw AuthError.googleLoginFailed
        }

        // Call backend
        guard let url = URL(string: "\(APIService.shared.baseURL)/auth/google") else {
            throw APIService.APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["token": idToken]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            // If backend fails, you might want to logout from Google SDK too
            GIDSignIn.sharedInstance.signOut()
            throw AuthError.googleLoginFailed
        }

        let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)

        // Already on MainActor, no need for MainActor.run
        self.authToken = authResponse.token
        self.currentUser = authResponse.user
        self.isLoggedIn = true
        saveToStorage()
    }

    // MARK: - Logout
    public func logout() {
        authToken = nil
        currentUser = nil
        isLoggedIn = false

        UserDefaults.standard.removeObject(forKey: tokenKey)
        UserDefaults.standard.removeObject(forKey: userKey)
    }

    // MARK: - Get Auth Header
    public func getAuthHeader() -> [String: String] {
        guard let token = authToken else { return [:] }
        return ["Authorization": "Bearer \(token)"]
    }

    // MARK: - Auth Error
    public enum AuthError: Error, LocalizedError {
        case loginFailed
        case registrationFailed
        case notAuthenticated
        case googleLoginFailed

        public var errorDescription: String? {
            switch self {
            case .loginFailed:
                return "Login failed. Please check your credentials."
            case .registrationFailed:
                return "Registration failed. Please try again."
            case .notAuthenticated:
                return "Please log in to continue."
            case .googleLoginFailed:
                return "Google Sign-In failed."
            }
        }
    }
}
