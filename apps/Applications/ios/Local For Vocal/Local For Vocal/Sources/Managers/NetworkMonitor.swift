import Combine
import Foundation
import Network

/// Lightweight network reachability monitor
/// Uses NWPathMonitor to track connectivity state
/// Published property can be observed from SwiftUI views
// Fix #11: @MainActor formalizes main-thread contract for @Published properties
@MainActor
class NetworkMonitor: ObservableObject {
    static let shared = NetworkMonitor()

    @Published private(set) var isConnected: Bool = true
    @Published private(set) var connectionType: ConnectionType = .unknown

    enum ConnectionType {
        case wifi
        case cellular
        case wiredEthernet
        case unknown
    }

    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor", qos: .utility)

    private init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isConnected = (path.status == .satisfied)

                if path.usesInterfaceType(.wifi) {
                    self?.connectionType = .wifi
                } else if path.usesInterfaceType(.cellular) {
                    self?.connectionType = .cellular
                } else if path.usesInterfaceType(.wiredEthernet) {
                    self?.connectionType = .wiredEthernet
                } else {
                    self?.connectionType = .unknown
                }

                #if DEBUG
                    AppLogger.debug(
                        "[Network] Status: \(path.status == .satisfied ? "Connected" : "Disconnected") (\(String(describing: self?.connectionType)))"
                    )
                #endif
            }
        }
        monitor.start(queue: queue)
    }

    deinit {
        monitor.cancel()
    }
}
