import Lottie
import SwiftUI

/// Full-screen splash screen with lottie animation.
/// Shown during app launch while layouts load from disk cache or network.
struct SplashScreenView: View {
    @State private var dotLottieFile: DotLottieFile?

    var body: some View {
        ZStack {
            // Background — clean white
            Color.white
                .ignoresSafeArea()

            VStack(spacing: 24) {
                Spacer()

                // Lottie animation
                if let dotLottieFile = dotLottieFile {
                    LottieView(dotLottieFile: dotLottieFile)
                        .configuration(LottieConfiguration(renderingEngine: .coreAnimation))
                        .looping()
                        .animationSpeed(1.0)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 220, height: 220)
                } else {
                    // Fallback while lottie loads
                    ProgressView()
                        .scaleEffect(1.5)
                        .frame(width: 220, height: 220)
                }

                // App name
                Text("Local For Vocal")
                    .font(.system(size: 26, weight: .bold, design: .rounded))
                    .foregroundColor(Color(hex: "#2874F0"))

                Text("Loading your experience...")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.gray)

                Spacer()

                // Bottom branding
                Text("Made in India 🇮🇳")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.gray.opacity(0.6))
                    .padding(.bottom, 40)
            }
        }
        .task {
            do {
                let file = try await DotLottieFile.named("fast delivery")
                await MainActor.run {
                    self.dotLottieFile = file
                }
            } catch {
                print("[SplashScreen] Failed to load lottie: \(error)")
            }
        }
    }
}
