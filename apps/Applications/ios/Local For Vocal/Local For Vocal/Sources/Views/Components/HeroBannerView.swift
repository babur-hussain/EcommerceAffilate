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

    // Timer for animation (0.1s interval for better performance/less lag)
    let timer = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()

    // Progress state (0.0 to 1.0)
    @State private var progress: CGFloat = 0.0

    // Internal counter to manage 2s fill + 2s wait logic
    // 0.1s * 20 ticks = 2s (Fill)
    // 0.1s * 20 ticks = 2s (Wait)
    // Total 40 ticks = 4s
    @State private var tickCount: Int = 0

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
                    // 1. Slider Content (Images) - Isolated to prevent re-render on progress tick
                    HeroSliderContentView(
                        banners: banners,
                        selection: $selection,
                        onInteraction: { interacting in
                            self.isInteracting = interacting
                            if interacting {
                                self.progress = 0
                                self.tickCount = 0
                            }
                        }
                    )
                    .frame(height: 200)

                    // 2. Indicators - Updates frequently (0.1s)
                    if banners.count > 1 {
                        HeroSliderIndicators(
                            count: banners.count,
                            selection: selection,
                            progress: progress
                        )
                    }
                }
                .onReceive(timer) { _ in
                    guard !isInteracting, banners.count > 1 else { return }

                    tickCount += 1

                    // Phase 1: Animation (0s - 2s) -> 20 ticks
                    if tickCount <= 20 {
                        progress = CGFloat(tickCount) / 20.0
                    }
                    // Phase 2: Wait (2s - 4s) -> 20 to 40 ticks
                    else if tickCount < 40 {
                        progress = 1.0  // Stay full
                    }
                    // Phase 3: Switch
                    else {
                        withAnimation(.easeInOut(duration: 0.5)) {
                            selection = (selection + 1) % banners.count
                        }
                        // Explicitly reset to prevent rapid sliding
                        tickCount = 0
                        progress = 0
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
    let progress: CGFloat

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<count, id: \.self) { index in
                if selection == index {
                    // Active indicator - Larger & Filled
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(Color.gray.opacity(0.3))
                            .frame(width: 32, height: 4)

                        Capsule()
                            .fill(Color(hex: "#111827"))
                            .frame(width: 32 * progress, height: 4)
                    }
                    .animation(.linear(duration: 0.1), value: progress)
                } else {
                    // Inactive indicator
                    Capsule()
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 12, height: 3)
                }
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
