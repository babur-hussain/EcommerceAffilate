import Foundation

/// Centralized environment configuration for production/development switching
/// Named AppEnvironment to avoid conflict with SwiftUI's Environment property wrapper
public enum AppEnvironment {
    case development
    case staging
    case production

    /// Current environment based on build configuration
    public static var current: AppEnvironment {
        #if DEBUG
            return .development
        #else
            return .production
        #endif
    }

    /// Base URL for API requests
    public var apiBaseURL: String {
        switch self {
        case .development:
            // Use production API for development (change to localhost when running local server)
            return "https://api.lfvs.in/api"
        case .staging:
            return "https://staging.lfvs.in/api"
        case .production:
            return "https://api.lfvs.in/api"
        }
    }

    /// Host for image URLs
    public var imageHost: String {
        switch self {
        case .development:
            // Use production host for development (change to localhost when running local server)
            return "https://api.lfvs.in"
        case .staging:
            return "https://staging.lfvs.in"
        case .production:
            return "https://api.lfvs.in"
        }
    }

    /// Whether debug logging is enabled
    public var isDebugLoggingEnabled: Bool {
        switch self {
        case .development, .staging:
            return true
        case .production:
            return false
        }
    }
}
