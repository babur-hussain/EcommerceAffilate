import SwiftUI

struct LumiereHeaderView: View {
    let component: SDUIComponent

    // Derived properties from component.props
    private var titleTop: String { component.prop(for: "title_top") ?? "" }
    private var titleBottom: String { component.prop(for: "title_bottom") ?? "" }
    private var subtitle: String { component.prop(for: "subtitle") ?? "" }
    private var eventTag: String { component.prop(for: "event_tag") ?? "" }
    private var buttonText: String { component.prop(for: "button_text") ?? "Shop Now" }
    private var imageUrl: String { component.prop(for: "image_url") ?? "" }

    @State private var translateY: CGFloat = 0
    @State private var rotate: Double = 0

    var body: some View {
        VStack(spacing: 0) {
            // Header Navigation
            HStack {
                Button(action: {
                    // Router back action - handled by navigation stack usually or coordinator
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 24))
                        .foregroundColor(Color(hex: "121212"))
                }
                .padding(8)

                Spacer()

                Button(action: {
                    // Router to cart
                }) {
                    Image(systemName: "bag")
                        .font(.system(size: 24))
                        .foregroundColor(Color(hex: "121212"))
                }
                .padding(8)
            }
            .padding(.horizontal, 16)
            .padding(.top, 48)  // Status bar spacing approximation
            .padding(.bottom, 16)

            // Hero Card
            ZStack(alignment: .bottomLeading) {
                // Background Image
                AsyncImage(url: URL(string: imageUrl)) { phase in
                    if let image = phase.image {
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } else {
                        Color(hex: "121212")
                    }
                }
                .frame(height: 420)
                .clipped()

                // Gradient Overlay
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0.4), Color.clear, Color.clear]
                    ),
                    startPoint: .bottomLeading,
                    endPoint: .topLeading
                )

                // 50% Off Badge
                VStack(alignment: .center, spacing: 0) {
                    ZStack {
                        Image(systemName: "sparkles")  // auto-awesome replacement
                            .font(.system(size: 24))
                            .foregroundColor(.white)
                            .offset(x: 40, y: -40)

                        Image(systemName: "sparkles")
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                            .offset(x: -40, y: 40)

                        Text("-50")
                            .font(.custom("PlayfairDisplay-Bold", size: 48))
                            .fontWeight(.black)
                            .foregroundColor(.white)
                            + Text("%")
                            .font(.system(size: 24))
                            .foregroundColor(.white)
                    }
                    .shadow(color: Color.black.opacity(0.5), radius: 4, x: 0, y: 2)

                    Text("LIMITED")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .tracking(1)  // Letter spacing
                        .shadow(color: Color.black.opacity(0.5), radius: 2, x: 0, y: 1)
                        .padding(.top, 4)
                }
                .frame(width: 120, height: 120)
                .position(x: 84, y: 92)  // Position relative to top left, adjusted for center pos
                .offset(y: translateY)
                .rotationEffect(.degrees(rotate))
                .onAppear {
                    withAnimation(
                        Animation.easeInOut(duration: 2.0).repeatForever(autoreverses: true)
                    ) {
                        translateY = -5
                        rotate = 2
                    }
                }

                // Content
                VStack(alignment: .leading, spacing: 0) {
                    Text(eventTag)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(.white)
                        .textCase(.uppercase)
                        .tracking(1)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                        .background(Color.white.opacity(0.2))
                        .cornerRadius(999)
                        .overlay(
                            RoundedRectangle(cornerRadius: 999)
                                .stroke(Color.white.opacity(0.3), lineWidth: 1)
                        )
                        .padding(.bottom, 12)

                    Text(titleTop)
                        .font(.custom("PlayfairDisplay-Regular", size: 36))
                        .foregroundColor(.white)
                        + Text("\n")
                        + Text(titleBottom)
                        .font(.custom("PlayfairDisplay-Regular", size: 36))
                        .foregroundColor(.white)

                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(Color.white.opacity(0.8))
                        .padding(.top, 8)
                        .padding(.bottom, 16)
                        .frame(maxWidth: 200, alignment: .leading)

                    Button(action: {
                        // Action
                    }) {
                        Text(buttonText)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.black)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 12)
                            .background(Color.white)
                            .cornerRadius(999)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 32)
            }
            .frame(height: 420)
            .cornerRadius(24)
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 24)
    }
}
