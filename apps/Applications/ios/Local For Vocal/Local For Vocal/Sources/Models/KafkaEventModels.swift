import Foundation
import UIKit

// MARK: - Kafka Event Models

/// Represents a real-time event received from the backend via SSE
public struct KafkaEvent: Codable, Identifiable {
    public let id: String
    public let eventType: String
    public let payload: [String: AnyCodableValue]
    public let timestamp: String?

    public init(eventType: String, payload: [String: AnyCodableValue], timestamp: String? = nil) {
        self.id = UUID().uuidString
        self.eventType = eventType
        self.payload = payload
        self.timestamp = timestamp
    }
}

// MARK: - Event Types

/// All Kafka event types matching the backend topic structure
public enum KafkaEventType: String, CaseIterable {
    // Order events
    case orderCreated = "order.created"
    case orderStatusChanged = "order.status-changed"
    case orderCancelled = "order.cancelled"

    // Payment events
    case paymentSuccess = "payment.success"
    case paymentFailed = "payment.failed"

    // Cart events
    case cartUpdated = "cart.updated"
    case cartAbandoned = "cart.abandoned"

    // User events
    case userRegistered = "user.registered"
    case userLogin = "user.login"

    // Product events
    case productViewed = "product.viewed"
    case productClicked = "product.clicked"
    case productSearched = "product.searched"

    // Notification events
    case notificationSent = "notification.sent"

    // Influencer events
    case influencerClick = "influencer.click"
    case influencerConversion = "influencer.conversion"

    // App tracking events
    case screenView = "app.screen_view"
    case buttonClick = "app.button_click"
    case appOpen = "app.open"
    case appBackground = "app.background"
}

// MARK: - Tracking Event (for sending to backend)

/// A tracking event to be batched and sent to the backend
public struct TrackingEvent: Codable {
    public let eventType: String
    public let properties: [String: AnyCodableValue]?
    public let timestamp: String

    // Fix: Static cached formatter — avoids allocation per event
    private static let isoFormatter = ISO8601DateFormatter()

    public init(eventType: String, properties: [String: AnyCodableValue]? = nil) {
        self.eventType = eventType
        self.properties = properties
        self.timestamp = Self.isoFormatter.string(from: Date())
    }
}

/// Device information sent with tracking events
public struct DeviceInfo: Codable {
    public let platform: String
    public let version: String
    public let os: String

    public static var current: DeviceInfo {
        DeviceInfo(
            platform: "iOS",
            version: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
                ?? "unknown",
            os: "\(UIDevice.current.systemName) \(UIDevice.current.systemVersion)"
        )
    }
}

// MARK: - AnyCodable Value (for flexible JSON payloads)

/// A flexible Codable value that can hold String, Int, Double, Bool, or null
public enum AnyCodableValue: Codable, Hashable {
    case string(String)
    case int(Int)
    case double(Double)
    case bool(Bool)
    case null

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let value = try? container.decode(String.self) {
            self = .string(value)
        } else if let value = try? container.decode(Int.self) {
            self = .int(value)
        } else if let value = try? container.decode(Double.self) {
            self = .double(value)
        } else if let value = try? container.decode(Bool.self) {
            self = .bool(value)
        } else {
            self = .null
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let value): try container.encode(value)
        case .int(let value): try container.encode(value)
        case .double(let value): try container.encode(value)
        case .bool(let value): try container.encode(value)
        case .null: try container.encodeNil()
        }
    }

    /// Convenience: create from any common type
    public static func from(_ value: Any?) -> AnyCodableValue {
        guard let value = value else { return .null }
        if let s = value as? String { return .string(s) }
        if let i = value as? Int { return .int(i) }
        if let d = value as? Double { return .double(d) }
        if let b = value as? Bool { return .bool(b) }
        return .string(String(describing: value))
    }

    public var stringValue: String? {
        if case .string(let v) = self { return v }
        return nil
    }

    public var intValue: Int? {
        if case .int(let v) = self { return v }
        return nil
    }

    public var doubleValue: Double? {
        if case .double(let v) = self { return v }
        return nil
    }
}
