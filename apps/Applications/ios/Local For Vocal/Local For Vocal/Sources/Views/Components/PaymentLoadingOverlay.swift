import Lottie
import SwiftUI

/// A beautiful full-screen loading overlay displayed while Razorpay payment is being initialized.
/// Shows a Lottie animation with premium styling to keep the user engaged.
struct PaymentLoadingOverlay: View {
    @State private var dotLottieFile: DotLottieFile?
    @State private var pulseOpacity: Double = 0.6

    var body: some View {
        ZStack {
            // Blurred dark background
            Color.black.opacity(0.5)
                .ignoresSafeArea()
                .background(.ultraThinMaterial)

            // Card Container
            VStack(spacing: 28) {
                // Lottie Animation
                ZStack {
                    // Glow ring behind animation
                    Circle()
                        .fill(
                            RadialGradient(
                                gradient: Gradient(colors: [
                                    Color(hex: "#2563EB").opacity(0.15),
                                    Color.clear,
                                ]),
                                center: .center,
                                startRadius: 40,
                                endRadius: 100
                            )
                        )
                        .frame(width: 200, height: 200)

                    if let dotLottieFile = dotLottieFile {
                        LottieView(dotLottieFile: dotLottieFile)
                            .configuration(LottieConfiguration(renderingEngine: .coreAnimation))
                            .looping()
                            .animationSpeed(1.0)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 160, height: 160)
                    } else {
                        // Fallback shimmer while Lottie loads
                        ProgressView()
                            .progressViewStyle(
                                CircularProgressViewStyle(tint: Color(hex: "#2563EB"))
                            )
                            .scaleEffect(2.0)
                            .frame(width: 160, height: 160)
                    }
                }

                // Text Section
                VStack(spacing: 10) {
                    Text("Preparing your payment...")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .opacity(pulseOpacity)
                        .animation(
                            .easeInOut(duration: 1.2).repeatForever(autoreverses: true),
                            value: pulseOpacity
                        )

                    Text("Please wait while we set things up")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.white.opacity(0.65))
                }

                // Secure payment indicator
                HStack(spacing: 6) {
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#34D399"))
                    Text("100% Secure Payment")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(hex: "#34D399"))
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.white.opacity(0.1))
                .cornerRadius(20)
            }
            .padding(40)
            .background(
                RoundedRectangle(cornerRadius: 24)
                    .fill(.ultraThinMaterial)
                    .shadow(color: Color(hex: "#2563EB").opacity(0.15), radius: 30, y: 10)
            )
            .padding(.horizontal, 32)
        }
        .transition(.opacity.combined(with: .scale(scale: 0.95)))
        .onAppear {
            pulseOpacity = 1.0
        }
        .task {
            do {
                let file = try await DotLottieFile.named("Payment verify loader")
                await MainActor.run {
                    self.dotLottieFile = file
                }
            } catch {
                AppLogger.debug("[PaymentLoading] Failed to load lottie: \(error)")
            }
        }
    }
}
