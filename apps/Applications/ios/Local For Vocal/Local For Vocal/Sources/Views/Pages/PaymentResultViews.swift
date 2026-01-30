import SwiftUI

// MARK: - Payment Success View
struct PaymentSuccessView: View {
    let orderNumber: String?
    let amount: Double
    let onContinueShopping: () -> Void
    let onViewOrder: () -> Void

    // Animation states
    @State private var showCheckmark = false
    @State private var checkmarkScale: CGFloat = 0.3
    @State private var showConfetti = false
    @State private var confettiOffset: CGFloat = -100
    @State private var showContent = false

    var body: some View {
        ZStack {
            // Main Content
            VStack(spacing: 0) {
                Spacer()

                // Success Animation Circle
                ZStack {
                    // Outer glow ring
                    Circle()
                        .fill(Color(hex: "#DCFCE7"))
                        .frame(width: 140, height: 140)
                        .scaleEffect(showCheckmark ? 1.0 : 0.5)
                        .opacity(showCheckmark ? 1.0 : 0)

                    // Inner solid circle
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "#22C55E"), Color(hex: "#16A34A")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 100, height: 100)
                        .scaleEffect(checkmarkScale)
                        .shadow(color: Color(hex: "#22C55E").opacity(0.4), radius: 20, y: 8)

                    // Checkmark
                    Image(systemName: "checkmark")
                        .font(.system(size: 50, weight: .bold))
                        .foregroundColor(.white)
                        .scaleEffect(showCheckmark ? 1.0 : 0)
                        .rotationEffect(.degrees(showCheckmark ? 0 : -30))
                }
                .padding(.bottom, 32)

                // Title
                Text("Payment Successful!")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))
                    .opacity(showContent ? 1 : 0)
                    .offset(y: showContent ? 0 : 20)
                    .padding(.bottom, 8)

                Text("Your order has been placed successfully")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .opacity(showContent ? 1 : 0)
                    .offset(y: showContent ? 0 : 20)
                    .padding(.bottom, 24)

                // Order Details Card
                VStack(spacing: 12) {
                    if let orderNumber = orderNumber {
                        HStack {
                            Text("Order ID")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#6B7280"))
                            Spacer()
                            Text("#\(String(orderNumber.suffix(8)).uppercased())")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Color(hex: "#111827"))
                        }
                    }

                    HStack {
                        Text("Amount Paid")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#6B7280"))
                        Spacer()
                        Text("₹\(formatPrice(amount))")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#22C55E"))
                    }

                    Divider()

                    HStack {
                        Image(systemName: "truck.box.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#3B82F6"))
                        Text("Estimated delivery: 3-5 business days")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }
                .padding(16)
                .background(Color(hex: "#F9FAFB"))
                .cornerRadius(12)
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(showContent ? 1 : 0)
                .offset(y: showContent ? 0 : 30)

                Spacer()

                // Action Buttons
                VStack(spacing: 12) {
                    Button(action: onViewOrder) {
                        HStack {
                            Image(systemName: "cube.box.fill")
                                .font(.system(size: 16))
                            Text("View Order")
                                .font(.system(size: 16, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "#2563EB"), Color(hex: "#1D4ED8")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(12)
                    }

                    Button(action: onContinueShopping) {
                        Text("Continue Shopping")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "#2563EB"))
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "#2563EB"), lineWidth: 1.5)
                            )
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(showContent ? 1 : 0)
            }
            .background(Color.white)

            // Confetti Overlay
            if showConfetti {
                ConfettiView()
                    .allowsHitTesting(false)
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            animateSuccess()
        }
    }

    private func animateSuccess() {
        // Step 1: Scale up checkmark circle with bounce
        withAnimation(.spring(response: 0.5, dampingFraction: 0.6)) {
            checkmarkScale = 1.0
            showCheckmark = true
        }

        // Step 2: Show confetti
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            showConfetti = true
        }

        // Step 3: Show content
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            withAnimation(.easeOut(duration: 0.5)) {
                showContent = true
            }
        }

        // Step 4: Hide confetti after 3 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
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

    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            // Failure Animation Circle
            ZStack {
                Circle()
                    .fill(Color(hex: "#FEE2E2"))
                    .frame(width: 120, height: 120)

                Circle()
                    .fill(Color(hex: "#EF4444"))
                    .frame(width: 80, height: 80)

                Image(systemName: "xmark")
                    .font(.system(size: 40, weight: .bold))
                    .foregroundColor(.white)
            }
            .padding(.bottom, 32)

            Text("Payment Failed")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "#111827"))
                .padding(.bottom, 8)

            Text("Your payment could not be processed.\nPlease try again.")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "#6B7280"))
                .multilineTextAlignment(.center)
                .padding(.bottom, 24)

            // Details Card
            VStack(spacing: 12) {
                if let orderId = orderId {
                    HStack {
                        Text("Order ID")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#6B7280"))
                        Spacer()
                        Text(orderId)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#111827"))
                    }
                }

                HStack {
                    Text("Amount")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#6B7280"))
                    Spacer()
                    Text("₹\(formatPrice(amount))")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "#EF4444"))
                }

                Divider()

                HStack {
                    Image(systemName: "info.circle")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#F59E0B"))
                    Text("If money was debited, it will be refunded within 5-7 business days")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
                }
            }
            .padding(16)
            .background(Color(hex: "#FEF2F2"))
            .cornerRadius(12)
            .padding(.horizontal, 24)
            .padding(.bottom, 40)

            Spacer()

            // Action Buttons
            VStack(spacing: 12) {
                Button(action: onRetry) {
                    Text("Retry Payment")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(Color(hex: "#2563EB"))
                        .cornerRadius(12)
                }

                Button(action: onCancel) {
                    Text("Cancel Order")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "#EF4444"))
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "#EF4444"), lineWidth: 1.5)
                        )
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
        .background(Color.white)
        .navigationBarHidden(true)
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
