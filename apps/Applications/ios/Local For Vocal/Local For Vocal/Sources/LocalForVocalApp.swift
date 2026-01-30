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

@main
struct LocalForVocalApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    GIDSignIn.sharedInstance.handle(url)
                }
        }
    }
}
