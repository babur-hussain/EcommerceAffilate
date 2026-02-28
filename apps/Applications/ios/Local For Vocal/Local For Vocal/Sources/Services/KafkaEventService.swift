import Combine
import Foundation

// MARK: - Kafka Event Service (SSE Client)

/// Connects to the backend SSE endpoint to receive real-time Kafka events.
/// Usage:
///   KafkaEventService.shared.connect(token: authToken)
///   KafkaEventService.shared.on(.orderStatusChanged) { event in ... }
@MainActor
public class KafkaEventService: ObservableObject {
    public static let shared = KafkaEventService()

    // MARK: - Published State
    @Published public var isConnected = false
    @Published public var lastEvent: KafkaEvent? = nil

    // MARK: - Event Publishers
    /// Global event stream — publishes ALL events
    public let eventStream = PassthroughSubject<KafkaEvent, Never>()

    // Per-type event publishers for targeted subscriptions
    private var typePublishers: [String: PassthroughSubject<KafkaEvent, Never>] = [:]

    // MARK: - Private State
    private var task: URLSessionDataTask? = nil
    private var urlSession: URLSession?
    private var authToken: String?
    private var retryCount = 0
    private let maxRetries = 5
    private var retryTimer: Timer?
    private var cancellables = Set<AnyCancellable>()

    private init() {}

    // MARK: - Connect

    /// Connect to the SSE endpoint. Call after login.
    public func connect(token: String) {
        self.authToken = token
        self.retryCount = 0
        startConnection()
    }

    /// Disconnect from SSE. Call on logout or app background.
    public func disconnect() {
        retryTimer?.invalidate()
        retryTimer = nil
        task?.cancel()
        task = nil
        urlSession?.invalidateAndCancel()
        urlSession = nil
        isConnected = false
        AppLogger.info("📡 KafkaEventService disconnected")
    }

    // MARK: - Event Subscriptions

    /// Subscribe to a specific event type
    public func on(_ type: KafkaEventType, handler: @escaping (KafkaEvent) -> Void)
        -> AnyCancellable
    {
        let key = type.rawValue
        if typePublishers[key] == nil {
            typePublishers[key] = PassthroughSubject<KafkaEvent, Never>()
        }
        return typePublishers[key]!
            .receive(on: DispatchQueue.main)
            .sink(receiveValue: handler)
    }

    /// Subscribe to multiple event types
    public func on(_ types: [KafkaEventType], handler: @escaping (KafkaEvent) -> Void)
        -> [AnyCancellable]
    {
        return types.map { on($0, handler: handler) }
    }

    // MARK: - Private: SSE Connection

    private func startConnection() {
        guard let token = authToken else {
            AppLogger.error("❌ KafkaEventService: No auth token")
            return
        }

        let sseURL = URL(string: "\(AppEnvironment.current.sseEndpoint)")!
        var request = URLRequest(url: sseURL)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("text/event-stream", forHTTPHeaderField: "Accept")
        request.timeoutInterval = TimeInterval.infinity  // SSE connections are long-lived

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = TimeInterval.infinity
        config.timeoutIntervalForResource = TimeInterval.infinity

        let session = URLSession(
            configuration: config, delegate: SSEDelegate(service: self), delegateQueue: nil)
        self.urlSession = session

        let dataTask = session.dataTask(with: request)
        self.task = dataTask
        dataTask.resume()

        AppLogger.info("📡 KafkaEventService connecting to SSE...")
    }

    // Called by the delegate when data arrives
    fileprivate func handleSSEData(_ data: Data) {
        guard let text = String(data: data, encoding: .utf8) else { return }

        // SSE format: "data: {json}\n\n" or "event: type\ndata: {json}\n\n"
        let lines = text.components(separatedBy: "\n")
        var currentData: String?

        for line in lines {
            if line.hasPrefix("data: ") {
                currentData = String(line.dropFirst(6))
            } else if line.isEmpty, let jsonString = currentData {
                // End of SSE event — parse it
                processEvent(jsonString)
                currentData = nil
            }
        }
    }

    private func processEvent(_ jsonString: String) {
        guard let data = jsonString.data(using: .utf8) else { return }

        do {
            let event = try JSONDecoder().decode(KafkaEvent.self, from: data)

            Task { @MainActor in
                self.lastEvent = event
                self.isConnected = true
                self.retryCount = 0
            }

            // Publish to global stream
            eventStream.send(event)

            // Publish to type-specific stream
            if let publisher = typePublishers[event.eventType] {
                publisher.send(event)
            }

            AppLogger.debug("📡 SSE event: \(event.eventType)")
        } catch {
            AppLogger.error("📡 Failed to decode SSE event: \(error)")
        }
    }

    fileprivate func handleConnectionError(_ error: Error) {
        Task { @MainActor in
            self.isConnected = false
        }

        // Don't retry if explicitly cancelled
        if (error as NSError).code == NSURLErrorCancelled { return }

        retryCount += 1
        if retryCount <= maxRetries {
            let delay = min(Double(retryCount * retryCount) * 2, 60)  // Exponential backoff, max 60s
            AppLogger.warning(
                "📡 SSE reconnecting in \(delay)s (attempt \(retryCount)/\(maxRetries))")

            DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                self?.startConnection()
            }
        } else {
            AppLogger.error("📡 SSE max retries reached. Giving up.")
        }
    }
}

// MARK: - SSE URLSession Delegate

private class SSEDelegate: NSObject, URLSessionDataDelegate {
    weak var service: KafkaEventService?

    init(service: KafkaEventService) {
        self.service = service
    }

    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        Task { @MainActor in
            service?.handleSSEData(data)
        }
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?)
    {
        if let error = error {
            Task { @MainActor in
                service?.handleConnectionError(error)
            }
        }
    }
}
