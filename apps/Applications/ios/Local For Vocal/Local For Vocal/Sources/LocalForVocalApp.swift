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

        // Preload keyboard to prevent lag
        preloadKeyboard()

        return true
    }

    private func preloadKeyboard() {
        DispatchQueue.main.async {
            let lagFreeField = UITextField()
            // Find the key window to add the field to
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
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
                print("[AppRootView] First launch — downloading all layouts...")
                await LayoutPreloader.shared.prefetchAll()
                // After prefetch, give SwiftUI a moment to render views with fresh data
                try? await Task.sleep(nanoseconds: 500_000_000)  // 500ms for rendering
            } else {
                // Subsequent launch — disk cache already loaded in SDUILayoutStore.init.
                // Keep splash visible long enough for SwiftUI to fully render all views
                // with the cached data, so no fallback gradient ever flashes.
                try? await Task.sleep(nanoseconds: 1_500_000_000)  // 1.5s for buttery smooth
                LayoutPreloader.shared.refreshStaleInBackground()
            }

            // Dismiss splash
            await MainActor.run {
                store.isPreloaded = true
                showSplash = false
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
        }
    }
}
