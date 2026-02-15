import Combine
import SwiftUI

struct HeroBannerView: View {
    // Model matching the API response structure
    // Model matching the API response structure
    struct BannerData: Decodable, Identifiable {
        let id: String
        let image: String
        let actionUrl: String?
        // Optional/Ignored fields
        let title: String?
        let subtitle: String?
        let backgroundColor: String?

        enum CodingKeys: String, CodingKey {
            case id, _id
            case image, imageUrl, image_url
            case actionUrl, action_url
            case title, subtitle, backgroundColor
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)

            // ID fallback
            if let idVal = try? container.decode(String.self, forKey: .id) {
                self.id = idVal
            } else if let idVal = try? container.decode(String.self, forKey: ._id) {
                self.id = idVal
            } else {
                self.id = UUID().uuidString
            }

            // Image fallback
            if let img = try? container.decode(String.self, forKey: .image) {
                self.image = img
            } else if let img = try? container.decode(String.self, forKey: .imageUrl) {
                self.image = img
            } else if let img = try? container.decode(String.self, forKey: .image_url) {
                self.image = img
            } else {
                self.image = ""  // Fail gracefully
            }

            // ActionUrl fallback
            if let url = try? container.decode(String.self, forKey: .actionUrl) {
                self.actionUrl = url
            } else {
                self.actionUrl = try? container.decode(String.self, forKey: .action_url)
            }

            self.title = try? container.decode(String.self, forKey: .title)
            self.subtitle = try? container.decode(String.self, forKey: .subtitle)
            self.backgroundColor = try? container.decode(String.self, forKey: .backgroundColor)
        }
    }

    // Props passed from SDUIComponentView
    var bannersCallback: (() -> [BannerData])?

    @State private var banners: [BannerData] = []
    @State private var isLoading = true
    @State private var selection = 0

    @EnvironmentObject var navigationManager: NavigationManager

    // Auto-advance timer — fires once every 4s (NOT 0.1s) to prevent CPU overload
    let timer = Timer.publish(every: 4, on: .main, in: .common).autoconnect()

    // Track if user is interacting to pause auto-scroll
    @State private var isInteracting: Bool = false

    var body: some View {
        VStack {
            if isLoading {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
                    .frame(height: 200)
                    .overlay(ProgressView())
            } else if !banners.isEmpty {
                VStack(spacing: 1) {
                    // 1. Slider Content (Images)
                    HeroSliderContentView(
                        banners: banners,
                        selection: $selection,
                        onInteraction: { interacting in
                            self.isInteracting = interacting
                        }
                    )
                    .frame(height: 200)

                    // 2. Simple dot indicators (no 0.1s progress animation)
                    if banners.count > 1 {
                        HeroSliderIndicators(
                            count: banners.count,
                            selection: selection
                        )
                    }
                }
                .onReceive(timer) { _ in
                    guard !isInteracting, banners.count > 1 else { return }
                    withAnimation(.easeInOut(duration: 0.5)) {
                        selection = (selection + 1) % banners.count
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .onAppear {
            if let callback = bannersCallback {
                self.banners = callback()
                self.isLoading = false
            } else {
                self.isLoading = false
            }
        }
    }
}

// MARK: - Subviews for Performance Optimization

/// content view that holds the heavy TabView and Images
/// Isolated so it doesn't re-evaluate when 'progress' changes in parent
struct HeroSliderContentView: View {
    let banners: [HeroBannerView.BannerData]
    @Binding var selection: Int
    let onInteraction: (Bool) -> Void

    @EnvironmentObject var navigationManager: NavigationManager

    @State private var dragOffset: CGFloat = 0
    @State private var isDragging: Bool = false

    var body: some View {
        GeometryReader { geometry in
            let width = geometry.size.width

            HStack(spacing: 0) {
                ForEach(0..<banners.count, id: \.self) { index in
                    let banner = banners[index]
                    HeroBannerCard(banner: banner)
                        .padding(.vertical, 8)
                        .frame(width: width)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            // Only navigate if user didn't drag
                            if !isDragging, let action = banner.actionUrl {
                                navigationManager.navigate(to: action)
                            }
                        }
                }
            }
            .offset(x: -CGFloat(selection) * width + dragOffset)
            .animation(.easeInOut(duration: 0.5), value: selection)
            .animation(.interactiveSpring(), value: dragOffset)
            .gesture(
                banners.count > 1
                    ? DragGesture(minimumDistance: 10)
                        .onChanged { value in
                            isDragging = true
                            onInteraction(true)
                            dragOffset = value.translation.width
                        }
                        .onEnded { value in
                            let threshold = width * 0.2
                            let predictedEnd = value.predictedEndTranslation.width

                            if value.translation.width < -threshold || predictedEnd < -width / 2 {
                                // Swipe Left -> Next
                                if selection < banners.count - 1 {
                                    selection += 1
                                } else {
                                    withAnimation {
                                        dragOffset = 0
                                    }
                                }
                            } else if value.translation.width > threshold
                                || predictedEnd > width / 2
                            {
                                // Swipe Right -> Previous
                                if selection > 0 {
                                    selection -= 1
                                } else {
                                    withAnimation {
                                        dragOffset = 0
                                    }
                                }
                            } else {
                                // Snap back
                                withAnimation {
                                    dragOffset = 0
                                }
                            }

                            // Clear drag offset after decision
                            withAnimation {
                                dragOffset = 0
                            }

                            onInteraction(false)

                            // Reset dragging flag after a short delay
                            // so onTapGesture doesn't fire immediately
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                                isDragging = false
                            }
                        } : nil
            )
        }
        .clipped()  // Ensure content doesn't bleed
    }
}

/// Lightweight indicator view that handles the progress animation
struct HeroSliderIndicators: View {
    let count: Int
    let selection: Int

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<count, id: \.self) { index in
                Capsule()
                    .fill(selection == index ? Color(hex: "#111827") : Color.gray.opacity(0.3))
                    .frame(width: selection == index ? 24 : 8, height: 4)
                    .animation(.easeInOut(duration: 0.3), value: selection)
            }
        }
        .padding(.top, 0)
    }
}

struct HeroBannerCard: View {
    let banner: HeroBannerView.BannerData

    var body: some View {
        if let url = URL(string: banner.image) {
            AsyncImage(url: url) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }
}
