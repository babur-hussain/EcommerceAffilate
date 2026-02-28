import FirebaseCore
import GoogleSignIn
import SwiftUI

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        FirebaseApp.configure()

        // Explicitly set the Client ID to avoid "No active configuration" crash
        let clientID = "295518104458-0ghbp0jo9034601k7ih49cufvo0mf493.apps.googleusercontent.com"
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)

        // Force-init SDUILayoutStore to synchronously load all cached layouts from disk into RAM.
        _ = SDUILayoutStore.shared

        return true
    }

}

// MARK: - App Root View (Splash → Content transition)

/// Manages the splash screen → content transition.
/// - First launch: shows splash while ALL headers + pages download from network
/// - Subsequent launches: shows splash briefly while disk cache loads into RAM, then transitions
struct AppRootView: View {
    @ObservedObject private var store = SDUILayoutStore.shared
    @State private var showSplash = true
    @State private var hasStartedLoading = false

    var body: some View {
        ZStack {
            // Main content (always present underneath, renders during splash)
            ContentView()
                .opacity(showSplash ? 0 : 1)

            // Splash overlay
            if showSplash {
                SplashScreenView()
                    .transition(.opacity)
                    .zIndex(1)
            }
        }
        .animation(.easeInOut(duration: 0.4), value: showSplash)
        .task {
            guard !hasStartedLoading else { return }
            hasStartedLoading = true

            if LayoutPreloader.shared.isFirstLaunch {
                // First launch — fetch everything from network
                AppLogger.debug("[AppRootView] First launch — downloading all layouts...")
                await LayoutPreloader.shared.prefetchAll()
                // Brief pause for SwiftUI to render with fresh data
                try? await Task.sleep(nanoseconds: 300_000_000)  // 300ms
            } else {
                // Subsequent launch — disk cache loaded in SDUILayoutStore.init.
                // Wait until layouts are ready instead of hardcoding delay.
                let startTime = CFAbsoluteTimeGetCurrent()
                let maxWait: Double = 3.0  // max 3s fallback
                let minWait: Double = 0.3  // min 300ms for rendering

                // Poll until layouts populated or timeout
                while store.layouts.isEmpty {
                    let elapsed = CFAbsoluteTimeGetCurrent() - startTime
                    if elapsed >= maxWait { break }
                    try? await Task.sleep(nanoseconds: 50_000_000)  // check every 50ms
                }

                // Ensure minimum wait for smooth rendering
                let elapsed = CFAbsoluteTimeGetCurrent() - startTime
                if elapsed < minWait {
                    let remaining = UInt64((minWait - elapsed) * 1_000_000_000)
                    try? await Task.sleep(nanoseconds: remaining)
                }

                LayoutPreloader.shared.refreshStaleInBackground()
            }

            // Dismiss splash
            await MainActor.run {
                store.isPreloaded = true
                showSplash = false
            }

            // Preload keyboard AFTER splash dismissed to avoid blocking launch
            await MainActor.run {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    let lagFreeField = UITextField()
                    if let windowScene = UIApplication.shared.connectedScenes.first
                        as? UIWindowScene,
                        let window = windowScene.windows.first
                    {
                        window.addSubview(lagFreeField)
                        lagFreeField.becomeFirstResponder()
                        lagFreeField.resignFirstResponder()
                        lagFreeField.removeFromSuperview()
                    }
                }
            }
        }
    }
}

@main
struct LocalForVocalApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            AppRootView()
                .onOpenURL { url in
                    GIDSignIn.sharedInstance.handle(url)
                }
                .onAppear {
                    // Initialize EventTracker (auto-tracks app.open)
                    _ = EventTracker.shared

                    // Connect SSE if user is already logged in
                    if let token = AuthManager.shared.authToken {
                        KafkaEventService.shared.connect(token: token)
                    }
                }
                .onReceive(AuthManager.shared.$authToken) { token in
                    // Auto-connect/disconnect SSE on auth state changes
                    if let token = token, !token.isEmpty {
                        KafkaEventService.shared.connect(token: token)
                    } else {
                        KafkaEventService.shared.disconnect()
                    }
                }
        }
    }
}
