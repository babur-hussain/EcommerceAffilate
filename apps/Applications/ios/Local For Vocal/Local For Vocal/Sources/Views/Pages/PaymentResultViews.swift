import Lottie
import SwiftUI

// MARK: - Payment Success View
struct PaymentSuccessView: View {
    let orderNumber: String?
    let amount: Double
    let onContinueShopping: () -> Void
    let onViewOrder: () -> Void

    // Animation states
    @State private var dotLottieFile: DotLottieFile?
    @State private var showContent = false
    @State private var showConfetti = false
    @State private var showButtons = false

    var body: some View {
        ZStack {
            // Gradient Background
            LinearGradient(
                colors: [Color(hex: "#F0FDF4"), Color.white, Color.white],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                // Lottie Animation
                ZStack {
                    // Subtle glow behind animation
                    Circle()
                        .fill(
                            RadialGradient(
                                gradient: Gradient(colors: [
                                    Color(hex: "#22C55E").opacity(0.12),
                                    Color.clear,
                                ]),
                                center: .center,
                                startRadius: 30,
                                endRadius: 120
                            )
                        )
                        .frame(width: 240, height: 240)

                    if let dotLottieFile = dotLottieFile {
                        LottieView(dotLottieFile: dotLottieFile)
                            .configuration(LottieConfiguration(renderingEngine: .coreAnimation))
                            .playing()
                            .animationSpeed(1.0)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 180, height: 180)
                    } else {
                        ProgressView()
                            .scaleEffect(1.5)
                            .frame(width: 180, height: 180)
                    }
                }
                .padding(.bottom, 16)

                // Title
                Text("Payment Successful!")
                    .font(.system(size: 26, weight: .bold, design: .rounded))
                    .foregroundColor(Color(hex: "#111827"))
                    .opacity(showContent ? 1 : 0)
                    .offset(y: showContent ? 0 : 20)
                    .padding(.bottom, 6)

                Text("Your order has been placed successfully")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .opacity(showContent ? 1 : 0)
                    .offset(y: showContent ? 0 : 20)
                    .padding(.bottom, 24)

                // Order Details Card
                VStack(spacing: 14) {
                    if let orderNumber = orderNumber {
                        HStack {
                            HStack(spacing: 6) {
                                Image(systemName: "number")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "#9CA3AF"))
                                Text("Order ID")
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "#6B7280"))
                            }
                            Spacer()
                            Text("#\(String(orderNumber.suffix(8)).uppercased())")
                                .font(.system(size: 14, weight: .bold, design: .monospaced))
                                .foregroundColor(Color(hex: "#111827"))
                        }
                    }

                    HStack {
                        HStack(spacing: 6) {
                            Image(systemName: "indianrupeesign.circle.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#22C55E"))
                            Text("Amount Paid")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#6B7280"))
                        }
                        Spacer()
                        Text("₹\(formatPrice(amount))")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "#22C55E"))
                    }

                    Rectangle()
                        .fill(Color(hex: "#E5E7EB"))
                        .frame(height: 1)

                    HStack(spacing: 8) {
                        Image(systemName: "truck.box.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#3B82F6"))
                        Text("Estimated delivery: 3-5 business days")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#6B7280"))
                        Spacer()
                    }
                }
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color(hex: "#F9FAFB"))
                        .shadow(color: Color.black.opacity(0.04), radius: 8, y: 4)
                )
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(showContent ? 1 : 0)
                .offset(y: showContent ? 0 : 30)

                Spacer()

                // Action Buttons
                VStack(spacing: 12) {
                    Button(action: onViewOrder) {
                        HStack(spacing: 8) {
                            Image(systemName: "cube.box.fill")
                                .font(.system(size: 16))
                            Text("View Order")
                                .font(.system(size: 16, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "#22C55E"), Color(hex: "#16A34A")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(14)
                        .shadow(color: Color(hex: "#22C55E").opacity(0.3), radius: 8, y: 4)
                    }

                    Button(action: onContinueShopping) {
                        Text("Continue Shopping")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "#374151"))
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(Color(hex: "#F3F4F6"))
                            .cornerRadius(14)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(showButtons ? 1 : 0)
                .offset(y: showButtons ? 0 : 20)
            }

            // Confetti Overlay
            if showConfetti {
                ConfettiView()
                    .allowsHitTesting(false)
            }
        }
        .navigationBarHidden(true)
        .task {
            do {
                let file = try await DotLottieFile.named("Payment Successfull")
                await MainActor.run { self.dotLottieFile = file }
            } catch {
                AppLogger.debug("[PaymentSuccess] Failed to load lottie: \(error)")
            }
        }
        .onAppear { animateSuccess() }
    }

    private func animateSuccess() {
        // Step 1: Show confetti
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            showConfetti = true
        }

        // Step 2: Show content
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            withAnimation(.easeOut(duration: 0.6)) {
                showContent = true
            }
        }

        // Step 3: Show buttons
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            withAnimation(.easeOut(duration: 0.5)) {
                showButtons = true
            }
        }

        // Step 4: Hide confetti
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
            showConfetti = false
        }
    }

    private func formatPrice(_ price: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: price)) ?? "\(Int(price))"
    }
}

// MARK: - Confetti View
struct ConfettiView: View {
    @State private var particles: [ConfettiParticle] = []

    var body: some View {
        GeometryReader { geo in
            ZStack {
                ForEach(particles) { particle in
                    Circle()
                        .fill(particle.color)
                        .frame(width: particle.size, height: particle.size)
                        .position(particle.position)
                        .opacity(particle.opacity)
                }
            }
            .onAppear {
                createParticles(in: geo.size)
                animateParticles()
            }
        }
    }

    private func createParticles(in size: CGSize) {
        let colors: [Color] = [
            Color(hex: "#22C55E"),
            Color(hex: "#3B82F6"),
            Color(hex: "#F59E0B"),
            Color(hex: "#EF4444"),
            Color(hex: "#8B5CF6"),
            Color(hex: "#EC4899"),
        ]

        particles = (0..<40).map { _ in
            ConfettiParticle(
                position: CGPoint(x: CGFloat.random(in: 0...size.width), y: -20),
                targetY: size.height + 50,
                color: colors.randomElement()!,
                size: CGFloat.random(in: 6...12),
                delay: Double.random(in: 0...0.5)
            )
        }
    }

    private func animateParticles() {
        for i in particles.indices {
            DispatchQueue.main.asyncAfter(deadline: .now() + particles[i].delay) {
                withAnimation(.easeIn(duration: Double.random(in: 2.0...3.5))) {
                    particles[i].position.y = particles[i].targetY
                    particles[i].position.x += CGFloat.random(in: -50...50)
                    particles[i].opacity = 0
                }
            }
        }
    }
}

struct ConfettiParticle: Identifiable {
    let id = UUID()
    var position: CGPoint
    let targetY: CGFloat
    let color: Color
    let size: CGFloat
    let delay: Double
    var opacity: Double = 1.0
}

// MARK: - Payment Failed View
struct PaymentFailedView: View {
    let orderId: String?
    let amount: Double
    let onRetry: () -> Void
    let onCancel: () -> Void

    // Animation states
    @State private var dotLottieFile: DotLottieFile?
    @State private var showContent = false
    @State private var showButtons = false
    @State private var shakeOffset: CGFloat = 0

    var body: some View {
        ZStack {
            // Gradient Background
            LinearGradient(
                colors: [Color(hex: "#FEF2F2"), Color.white, Color.white],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                // Lottie Animation
                ZStack {
                    // Subtle red glow
                    Circle()
                        .fill(
                            RadialGradient(
                                gradient: Gradient(colors: [
                                    Color(hex: "#EF4444").opacity(0.1),
                                    Color.clear,
                                ]),
                                center: .center,
                                startRadius: 30,
                                endRadius: 120
                            )
                        )
                        .frame(width: 240, height: 240)

                    if let dotLottieFile = dotLottieFile {
                        LottieView(dotLottieFile: dotLottieFile)
                            .configuration(LottieConfiguration(renderingEngine: .coreAnimation))
                            .playing()
                            .animationSpeed(0.8)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 180, height: 180)
                    } else {
                        ProgressView()
                            .scaleEffect(1.5)
                            .frame(width: 180, height: 180)
                    }
                }
                .offset(x: shakeOffset)
                .padding(.bottom, 16)

                // Title
                Text("Payment Failed")
                    .font(.system(size: 26, weight: .bold, design: .rounded))
                    .foregroundColor(Color(hex: "#DC2626"))
                    .opacity(showContent ? 1 : 0)
                    .offset(y: showContent ? 0 : 20)
                    .padding(.bottom, 6)

                Text("Your payment could not be processed.\nPlease try again.")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .multilineTextAlignment(.center)
                    .opacity(showContent ? 1 : 0)
                    .offset(y: showContent ? 0 : 20)
                    .padding(.bottom, 24)

                // Details Card
                VStack(spacing: 14) {
                    if let orderId = orderId {
                        HStack {
                            HStack(spacing: 6) {
                                Image(systemName: "number")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "#9CA3AF"))
                                Text("Order ID")
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "#6B7280"))
                            }
                            Spacer()
                            Text("#\(String(orderId.suffix(8)).uppercased())")
                                .font(.system(size: 14, weight: .bold, design: .monospaced))
                                .foregroundColor(Color(hex: "#111827"))
                        }
                    }

                    HStack {
                        HStack(spacing: 6) {
                            Image(systemName: "indianrupeesign.circle.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#EF4444"))
                            Text("Amount")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#6B7280"))
                        }
                        Spacer()
                        Text("₹\(formatPrice(amount))")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "#EF4444"))
                    }

                    Rectangle()
                        .fill(Color(hex: "#FECACA"))
                        .frame(height: 1)

                    HStack(spacing: 8) {
                        Image(systemName: "info.circle.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#F59E0B"))
                        Text("If money was debited, it will be refunded within 5-7 business days")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#6B7280"))
                        Spacer()
                    }
                }
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color(hex: "#FEF2F2"))
                        .shadow(color: Color(hex: "#EF4444").opacity(0.08), radius: 8, y: 4)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color(hex: "#FECACA"), lineWidth: 1)
                )
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(showContent ? 1 : 0)
                .offset(y: showContent ? 0 : 30)

                Spacer()

                // Action Buttons
                VStack(spacing: 12) {
                    Button(action: onRetry) {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.clockwise")
                                .font(.system(size: 16, weight: .semibold))
                            Text("Retry Payment")
                                .font(.system(size: 16, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "#2563EB"), Color(hex: "#1D4ED8")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(14)
                        .shadow(color: Color(hex: "#2563EB").opacity(0.3), radius: 8, y: 4)
                    }

                    Button(action: onCancel) {
                        Text("Cancel Order")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "#EF4444"))
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(Color(hex: "#FEF2F2"))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(Color(hex: "#FECACA"), lineWidth: 1.5)
                            )
                            .cornerRadius(14)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(showButtons ? 1 : 0)
                .offset(y: showButtons ? 0 : 20)
            }
        }
        .navigationBarHidden(true)
        .task {
            do {
                let file = try await DotLottieFile.named("Payment Failed")
                await MainActor.run { self.dotLottieFile = file }
            } catch {
                AppLogger.debug("[PaymentFailed] Failed to load lottie: \(error)")
            }
        }
        .onAppear { animateFailure() }
    }

    private func animateFailure() {
        // Step 1: Shake the animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            withAnimation(.default) { shakeOffset = 12 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) {
                withAnimation(.default) { shakeOffset = -10 }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.16) {
                withAnimation(.default) { shakeOffset = 8 }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.24) {
                withAnimation(.default) { shakeOffset = -5 }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.32) {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) { shakeOffset = 0 }
            }
        }

        // Step 2: Show content
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            withAnimation(.easeOut(duration: 0.6)) {
                showContent = true
            }
        }

        // Step 3: Show buttons
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            withAnimation(.easeOut(duration: 0.5)) {
                showButtons = true
            }
        }
    }

    private func formatPrice(_ price: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: price)) ?? "\(Int(price))"
    }
}

// MARK: - Previews
struct PaymentSuccessView_Previews: PreviewProvider {
    static var previews: some View {
        PaymentSuccessView(
            orderNumber: "ORD123456",
            amount: 1499,
            onContinueShopping: {},
            onViewOrder: {}
        )
    }
}

struct PaymentFailedView_Previews: PreviewProvider {
    static var previews: some View {
        PaymentFailedView(
            orderId: "ORD123456",
            amount: 1499,
            onRetry: {},
            onCancel: {}
        )
    }
}
