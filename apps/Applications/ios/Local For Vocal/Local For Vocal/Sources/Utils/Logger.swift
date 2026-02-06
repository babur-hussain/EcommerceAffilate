import Foundation

public enum LogLevel: String {
    case info = "ℹ️"
    case warning = "⚠️"
    case error = "❌"
    case debug = "🐞"
}

public class Logger {
    public static let shared = Logger()

    private init() {}

    public func log(
        _ message: String, level: LogLevel = .info, file: String = #file, line: Int = #line
    ) {
        #if DEBUG
            let fileName = (file as NSString).lastPathComponent
            print("\(level.rawValue) [\(fileName):\(line)] - \(message)")
        #endif
    }

    public static func info(_ message: String, file: String = #file, line: Int = #line) {
        shared.log(message, level: .info, file: file, line: line)
    }

    public static func warning(_ message: String, file: String = #file, line: Int = #line) {
        shared.log(message, level: .warning, file: file, line: line)
    }

    public static func error(_ message: String, file: String = #file, line: Int = #line) {
        shared.log(message, level: .error, file: file, line: line)
    }

    public static func debug(_ message: String, file: String = #file, line: Int = #line) {
        shared.log(message, level: .debug, file: file, line: line)
    }
}
