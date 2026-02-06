import Foundation
import os.log

/// Structured logging utility for the Local For Vocal app
/// Replaces scattered `print()` statements with consistent, level-based logging
/// that can be filtered in production builds
public enum AppLogger {

    // MARK: - Log Levels

    private static let subsystem = Bundle.main.bundleIdentifier ?? "com.localforvocal"

    private static let debugLog = OSLog(subsystem: subsystem, category: "Debug")
    private static let infoLog = OSLog(subsystem: subsystem, category: "Info")
    private static let errorLog = OSLog(subsystem: subsystem, category: "Error")
    private static let networkLog = OSLog(subsystem: subsystem, category: "Network")

    // MARK: - Public API

    /// Debug-level logging - verbose output for development
    /// Not visible in release builds by default
    @discardableResult
    public static func debug(_ message: String, file: String = #file, line: Int = #line) -> Bool {
        #if DEBUG
            let filename = (file as NSString).lastPathComponent
            os_log(
                .debug, log: debugLog, "[%{public}@:%{public}d] %{public}@", filename, line, message
            )
        #endif
        return true
    }

    /// Info-level logging - general informational messages
    public static func info(_ message: String, file: String = #file, line: Int = #line) {
        let filename = (file as NSString).lastPathComponent
        os_log(.info, log: infoLog, "[%{public}@:%{public}d] %{public}@", filename, line, message)
    }

    /// Error-level logging - something went wrong
    public static func error(_ message: String, file: String = #file, line: Int = #line) {
        let filename = (file as NSString).lastPathComponent
        os_log(
            .error, log: errorLog, "❌ [%{public}@:%{public}d] %{public}@", filename, line, message)
    }

    /// Network-level logging - API requests and responses
    public static func network(_ message: String, file: String = #file, line: Int = #line) {
        #if DEBUG
            let filename = (file as NSString).lastPathComponent
            os_log(
                .debug, log: networkLog, "🌐 [%{public}@:%{public}d] %{public}@", filename, line,
                message)
        #endif
    }

    /// Warning-level logging - potential issues
    public static func warning(_ message: String, file: String = #file, line: Int = #line) {
        let filename = (file as NSString).lastPathComponent
        os_log(
            .default, log: infoLog, "⚠️ [%{public}@:%{public}d] %{public}@", filename, line, message)
    }
}
