import Combine
import SwiftUI

struct BeautyKBeautyView: View {
    struct KBeautyItem: Decodable, Identifiable {
        let id: String
        let brand: String
        let image: String
        let ingredientTitle: String?
        let ingredient: String
        let offer: String
        let bg: String?  // Hex string for background color
        let actionUrl: String?
        let darkText: Bool?
    }

    let title: String
    let headerActionUrl: String?
    let items: [KBeautyItem]

    @State private var activeIndex = 0
    private let timer = Timer.publish(every: 5, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack(alignment: .center) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.primary)

                Spacer()

                if let action = headerActionUrl {
                    Button(action: {
                        AppLogger.debug("Navigate to: \(action)")
                    }) {
                        Text("View All")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#FF6F00"))
                    }
                }
            }
            .padding(.horizontal, 16)

            // Carousel
            TabView(selection: $activeIndex) {
                ForEach(0..<items.count, id: \.self) { index in
                    KBeautyCard(item: items[index])
                        .tag(index)
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            .frame(height: 360)

            // Pagination Dots
            HStack(spacing: 6) {
                ForEach(0..<items.count, id: \.self) { index in
                    Capsule()
                        .fill(index == activeIndex ? Color.primary : Color.gray.opacity(0.3))
                        .frame(width: index == activeIndex ? 20 : 8, height: 4)
                        .animation(.easeInOut(duration: 0.3), value: activeIndex)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .padding(.bottom, 24)
        .onReceive(timer) { _ in
            guard items.count > 1 else { return }
            withAnimation(.easeInOut(duration: 0.4)) {
                activeIndex = (activeIndex + 1) % items.count
            }
        }
    }
}

// MARK: - K-Beauty Card
struct KBeautyCard: View {
    let item: BeautyKBeautyView.KBeautyItem

    private var useDarkText: Bool {
        item.darkText ?? false
    }

    private var textColor: Color {
        useDarkText ? .black : .white
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(hex: item.bg ?? "#F5F5F5"))

            // Main Image — fills the card
            AsyncImage(url: URL(string: item.image)) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .transition(.opacity.animation(.easeIn(duration: 0.3)))
                case .failure:
                    Color(hex: item.bg ?? "#F5F5F5")
                @unknown default:
                    Color(hex: item.bg ?? "#F5F5F5")
                        .overlay(
                            ProgressView()
                                .tint(.gray)
                        )
                }
            }
            .clipped()

            // Top-left: Brand Pill
            VStack {
                HStack {
                    Text(item.brand)
                        .font(.system(size: 20, weight: .medium))
                        .tracking(2)
                        .foregroundColor(useDarkText ? .black : .white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(
                            Capsule()
                                .fill(.ultraThinMaterial)
                        )
                    Spacer()
                }
                .padding(.top, 16)
                .padding(.leading, 16)
                Spacer()
            }

            // Right side: Ingredient Badge
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    ingredientBadge
                }
                Spacer()
                    .frame(height: 70)
            }

            // Bottom: Gradient Overlay + Offer Text
            LinearGradient(
                colors: [.clear, .clear, Color.black.opacity(0.6)],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 140)
            .overlay(alignment: .bottom) {
                Text(item.offer)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.white)
                    .shadow(color: .black.opacity(0.4), radius: 6, x: 0, y: 2)
                    .padding(.bottom, 16)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.08), radius: 12, x: 0, y: 4)
        .padding(.horizontal, 16)
        .onTapGesture {
            if let action = item.actionUrl {
                AppLogger.debug("Navigate to: \(action)")
            }
        }
    }

    // Floating ingredient badge on the right edge
    private var ingredientBadge: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(item.ingredientTitle ?? "STAR\nINGREDIENT")
                .font(.system(size: 9, weight: .heavy))
                .foregroundColor(.white.opacity(0.85))
                .textCase(.uppercase)
                .lineSpacing(2)

            Rectangle()
                .fill(Color.white.opacity(0.35))
                .frame(height: 1)

            Text(item.ingredient)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.white)
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 14)
        .background(
            LinearGradient(
                colors: [Color(hex: "#E91E63"), Color(hex: "#C2185B")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .clipShape(
            CustomCorner(corners: [.topLeft, .bottomLeft], radius: 14)
        )
        .shadow(color: Color(hex: "#E91E63").opacity(0.4), radius: 8, x: -2, y: 4)
    }
}
