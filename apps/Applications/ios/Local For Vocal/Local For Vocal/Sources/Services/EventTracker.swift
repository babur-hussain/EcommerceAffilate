import Foundation
import UIKit

// MARK: - Event Tracker

/// Batched event tracking service that sends user behavior events to the backend.
/// Events are queued locally and flushed periodically or when the batch is full.
///
/// Usage:
///   EventTracker.shared.track(.screenView, properties: ["screen": "home"])
///   EventTracker.shared.track(.buttonClick, properties: ["button": "add_to_cart", "productId": "abc123"])
@MainActor
public class EventTracker {
    public static let shared = EventTracker()

    // MARK: - Configuration
    private let maxBatchSize = 10
    private let flushIntervalSeconds: TimeInterval = 30
    private let maxQueueSize = 100

    // MARK: - State
    private var eventQueue: [TrackingEvent] = []
    private var flushTimer: Timer?
    private var sessionId: String
    private var isFlushing = false

    private init() {
        self.sessionId = UUID().uuidString
        startFlushTimer()

        // Flush on app going to background + stop timer
        NotificationCenter.default.addObserver(
            forName: UIApplication.willResignActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            Task { @MainActor in
                self?.flush()
                // Fix #18: Stop timer when backgrounded
                self?.flushTimer?.invalidate()
                self?.flushTimer = nil
            }
        }

        // Fix #18: Restart timer when foregrounded
        NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            Task { @MainActor in
                self?.startFlushTimer()
            }
        }

        // Track app open
        track(.appOpen)

        AppLogger.info("📊 EventTracker initialized (session: \(sessionId))")
    }

    // MARK: - Public API

    /// Track an event with optional properties
    public func track(_ type: KafkaEventType, properties: [String: Any]? = nil) {
        // Convert properties to AnyCodableValue
        var codableProps: [String: AnyCodableValue]? = nil
        if let props = properties {
            codableProps = props.mapValues { AnyCodableValue.from($0) }
        }

        let event = TrackingEvent(eventType: type.rawValue, properties: codableProps)
        eventQueue.append(event)

        AppLogger.debug("📊 Event queued: \(type.rawValue) (queue: \(eventQueue.count))")

        // Flush if batch is full
        if eventQueue.count >= maxBatchSize {
            flush()
        }

        // Cap queue size to prevent memory issues
        if eventQueue.count > maxQueueSize {
            eventQueue.removeFirst(eventQueue.count - maxQueueSize)
        }
    }

    /// Track a screen view
    public func trackScreen(_ screenName: String) {
        track(.screenView, properties: ["screen": screenName])
    }

    /// Track a product view
    public func trackProductView(productId: String, productName: String? = nil) {
        var props: [String: Any] = ["productId": productId]
        if let name = productName { props["productName"] = name }
        track(.productViewed, properties: props)
    }

    /// Track a search
    public func trackSearch(query: String, resultsCount: Int) {
        track(
            .productSearched,
            properties: [
                "query": query,
                "resultsCount": resultsCount,
            ])
    }

    /// Track a button click
    public func trackButtonClick(button: String, context: [String: Any]? = nil) {
        var props: [String: Any] = ["button": button]
        if let ctx = context {
            ctx.forEach { props[$0.key] = $0.value }
        }
        track(.buttonClick, properties: props)
    }

    /// Generate a new session (e.g., on app foregrounding after long background)
    public func newSession() {
        sessionId = UUID().uuidString
        track(.appOpen)
        AppLogger.info("📊 New tracking session: \(sessionId)")
    }

    // MARK: - Flush

    /// Send queued events to the backend
    public func flush() {
        guard !eventQueue.isEmpty, !isFlushing else { return }

        let eventsToSend = Array(eventQueue)
        eventQueue.removeAll()
        isFlushing = true

        Task {
            await sendEvents(eventsToSend)
            await MainActor.run {
                self.isFlushing = false
            }
        }
    }

    // MARK: - Private

    private func startFlushTimer() {
        flushTimer?.invalidate()
        flushTimer = Timer.scheduledTimer(withTimeInterval: flushIntervalSeconds, repeats: true) {
            [weak self] _ in
            Task { @MainActor in
                self?.flush()
            }
        }
    }

    private func sendEvents(_ events: [TrackingEvent]) async {
        guard let url = URL(string: "\(APIService.shared.baseURL)/events/track") else {
            AppLogger.error("📊 Invalid tracking URL")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add auth token if available
        if let token = AuthManager.shared.authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        struct TrackingPayload: Codable {
            let events: [TrackingEvent]
            let device: DeviceInfo
            let sessionId: String
        }

        let payload = TrackingPayload(
            events: events,
            device: DeviceInfo.current,
            sessionId: sessionId
        )

        do {
            let body = try JSONEncoder().encode(payload)
            request.httpBody = body

            let (_, response) = try await APIService.shared.session.data(for: request)

            if let httpResponse = response as? HTTPURLResponse,
                (200...299).contains(httpResponse.statusCode)
            {
                AppLogger.debug("📊 Flushed \(events.count) tracking events")
            } else {
                AppLogger.warning("📊 Tracking flush returned non-200")
            }
        } catch {
            AppLogger.error("📊 Failed to flush events: \(error)")
            // Re-queue failed events (at front, capped)
            await MainActor.run {
                self.eventQueue.insert(contentsOf: events, at: 0)
                if self.eventQueue.count > self.maxQueueSize {
                    self.eventQueue = Array(self.eventQueue.prefix(self.maxQueueSize))
                }
            }
        }
    }

    deinit {
        flushTimer?.invalidate()
    }
}
