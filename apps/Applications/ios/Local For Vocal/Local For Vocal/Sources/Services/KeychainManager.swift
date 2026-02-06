import Foundation
import Security

/// A secure wrapper for storing sensitive data in the iOS Keychain
/// Used for storing authentication tokens instead of UserDefaults
public final class KeychainManager {
    public static let shared = KeychainManager()

    private init() {}

    // MARK: - Keychain Keys
    private enum Keys {
        static let authToken = "com.localforvocal.authToken"
        static let refreshToken = "com.localforvocal.refreshToken"
    }

    // MARK: - Public API

    /// Store auth token securely
    public var authToken: String? {
        get { getString(forKey: Keys.authToken) }
        set {
            if let value = newValue {
                setString(value, forKey: Keys.authToken)
            } else {
                deleteItem(forKey: Keys.authToken)
            }
        }
    }

    /// Store refresh token securely
    public var refreshToken: String? {
        get { getString(forKey: Keys.refreshToken) }
        set {
            if let value = newValue {
                setString(value, forKey: Keys.refreshToken)
            } else {
                deleteItem(forKey: Keys.refreshToken)
            }
        }
    }

    /// Clear all stored credentials
    public func clearAll() {
        deleteItem(forKey: Keys.authToken)
        deleteItem(forKey: Keys.refreshToken)
    }

    // MARK: - Private Keychain Operations

    private func setString(_ value: String, forKey key: String) {
        guard let data = value.data(using: .utf8) else { return }

        // Delete existing item first
        deleteItem(forKey: key)

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
        ]

        let status = SecItemAdd(query as CFDictionary, nil)
        if status != errSecSuccess {
            print("[KeychainManager] Failed to save \(key): \(status)")
        }
    }

    private func getString(forKey key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess,
            let data = result as? Data,
            let string = String(data: data, encoding: .utf8)
        else {
            return nil
        }

        return string
    }

    private func deleteItem(forKey key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
        ]

        SecItemDelete(query as CFDictionary)
    }
}
