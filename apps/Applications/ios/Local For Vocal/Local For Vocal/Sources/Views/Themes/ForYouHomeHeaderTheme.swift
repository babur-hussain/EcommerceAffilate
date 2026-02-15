import Combine
import Lottie
import SwiftUI

// Local fallback if Extensions are not visible
extension Color {
    fileprivate init(safeHex hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a: UInt64
        let r: UInt64
        let g: UInt64
        let b: UInt64
        switch hex.count {
        case 3:  // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:  // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:  // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 1, 1, 1)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - For You Theme (Deep Crimson Layered)
struct ForYouHomeHeaderTheme: HomeHeaderTheme {
    var backgroundView: AnyView {
        AnyView(
            AnimatedFoundationView(isHeader: false)
        )
    }

    var textColor: Color {
        .white
    }
}

// MARK: - Animated Background Component
// Lottie removed as per request to fix freeze

public struct AnimatedFoundationView: View {
    var isHeader: Bool
    var imageUrl: String?  // Keep for backward compatibility or single image fallback
    var lottieLayers: [LottieLayerConfig] = []
    var gradientColors: [String] = []

    public init(
        isHeader: Bool = false, imageUrl: String? = nil, lottieLayers: [LottieLayerConfig] = [],
        gradientColors: [String] = []
    ) {
        self.isHeader = isHeader
        self.imageUrl = imageUrl
        self.lottieLayers = lottieLayers
        self.gradientColors = gradientColors
    }

    private func color(hex: String) -> Color {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a: UInt64
        let r: UInt64
        let g: UInt64
        let b: UInt64
        switch hex.count {
        case 3:  // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:  // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:  // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 1, 1, 1)
        }

        return Color(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }

    public var body: some View {
        let colors =
            gradientColors.isEmpty
            ? [Color(safeHex: "#EE204D"), Color(safeHex: "#58111A"), Color(safeHex: "#EE204D")]
            : gradientColors.map { Color(safeHex: $0) }

        ZStack {
            // 1. Base Gradient Layer
            LinearGradient(
                gradient: Gradient(colors: colors),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            // 2. Global Lottie Layers (Overlay) - Optimized & Stateless
            ForEach(lottieLayers) { layer in
                GlobalLottieLayer(layer: layer)
                    .equatable()  // Optimization: Only update if layer config changes
                    .allowsHitTesting(false)
                    .ignoresSafeArea()
            }
            // Freely floating anywhere (top of Gradient, bottom of Gradient etc.)

            // 3. Fallback Image Layer (optional, if needed over gradient)
            if let imageUrl = imageUrl, let url = URL(string: imageUrl), lottieLayers.isEmpty {
                CachedAsyncImage(url: url) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(
                            minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity,
                            alignment: .top
                        )
                        .clipped()
                } placeholder: {
                    EmptyView()
                }
                .ignoresSafeArea()
            }
        }
    }
}

// MARK: - Reusable Category Theme Page
// Shared component that powers ALL category theme pages.
public struct CategoryThemePage: View {
    /// The slug used to fetch header theme components (e.g., "for-you-header-theme")
    let headerSlug: String
    /// The slug used for the main page SDUI content (e.g., "for-you")
    let pageSlug: String
    /// Default gradient colors when no JSON is loaded
    let defaultGradientColors: [Color]

    @State private var headerComponents: [SDUIComponent] = []
    @State private var backgroundImage: String?
    @State private var lottieLayers: [LottieLayerConfig] = []
    @State private var gradientColors: [String] = []

    public init(
        headerSlug: String,
        pageSlug: String,
        defaultGradientColors: [Color] = [
            Color(hex: "#1A1A2E"), Color(hex: "#16213E"), Color(hex: "#0F3460"),
        ]
    ) {
        self.headerSlug = headerSlug
        self.pageSlug = pageSlug
        self.defaultGradientColors = defaultGradientColors
    }

    public var body: some View {
        VStack(spacing: 0) {
            // Top Section with Animated Background — gradient scoped here only
            VStack(spacing: 8) {
                if headerComponents.isEmpty {
                    Color.clear.frame(height: 1)
                } else {
                    ForEach(headerComponents.filter { $0.type != .headerBackground }) { component in
                        SDUIComponentView(component: component)
                    }
                }
            }
            .padding(.top, 10)
            .padding(.bottom, 8)
            // Lottie overlay — scoped to header section
            .overlay(
                Group {
                    if !lottieLayers.isEmpty {
                        ZStack {
                            ForEach(lottieLayers) { layer in
                                GlobalLottieLayer(layer: layer)
                                    .equatable()
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 450)
                        .clipped()
                    }
                }
                .offset(y: -300)
                .allowsHitTesting(false)
                .ignoresSafeArea(edges: .top), alignment: .top
            )
            .background(
                // Gradient — only covers header section + upward extension behind headers
                ZStack(alignment: .top) {
                    LinearGradient(
                        gradient: Gradient(colors: resolvedGradientColors),
                        startPoint: .top,
                        endPoint: .bottom
                    )

                    // Fallback image (if no Lottie)
                    if let imageUrl = backgroundImage, let url = URL(string: imageUrl),
                        lottieLayers.isEmpty
                    {
                        CachedAsyncImage(url: url) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            EmptyView()
                        }
                        .clipped()
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.top, -400)
                .ignoresSafeArea(edges: .top), alignment: .top)

            // SDUI Content with fade behind it
            ZStack(alignment: .top) {
                // Fade behind content
                LinearGradient(
                    gradient: Gradient(stops: [
                        .init(
                            color: resolvedGradientColors.last ?? defaultGradientColors.last
                                ?? .blue,
                            location: 0.0),
                        .init(
                            color: (resolvedGradientColors.last ?? defaultGradientColors.last
                                ?? .blue)
                                .opacity(0.85), location: 0.15),
                        .init(
                            color: (resolvedGradientColors.last ?? defaultGradientColors.last
                                ?? .blue)
                                .opacity(0.5), location: 0.35),
                        .init(color: Color(hex: "#F9FAFB").opacity(0.3), location: 0.6),
                        .init(color: Color(hex: "#F9FAFB").opacity(0.7), location: 0.8),
                        .init(color: Color(hex: "#F9FAFB"), location: 1.0),
                    ]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 280)
                .frame(maxWidth: .infinity)

                // Page content — on top of fade
                SDUIPage(slug: pageSlug)
            }
        }
        .padding(.bottom, 100)
        .background(Color(hex: "#F9FAFB"))
        .task {
            await loadComponents()
        }
    }

    // MARK: - Helpers

    private var resolvedGradientColors: [Color] {
        if gradientColors.isEmpty {
            return defaultGradientColors
        }
        return gradientColors.map { Color(hex: $0) }
    }

    private func loadComponents() async {
        do {
            if let layout = try await APIService.shared.fetchLayout(
                slug: headerSlug, forceRefresh: true)
            {
                self.headerComponents = layout.components
                updateBackgroundData()
            }
        } catch {
            // Silently fail — default gradient will show
        }
    }

    private func updateBackgroundData() {
        let bg = headerComponents.first(where: { $0.type == .headerBackground })
        backgroundImage = bg?.prop(for: "imageUrl") as String?
        lottieLayers = bg?.decodeItems(for: "lottieLayers", as: [LottieLayerConfig].self) ?? []
        gradientColors = bg?.decodeItems(for: "gradientColors", as: [String].self) ?? []
    }
}

// MARK: - Main For You Page (powered by shared CategoryThemePage)
// JSON slug: for-you-header-theme
public struct ForYouPage: View {
    public init() {}

    public var body: some View {
        CategoryThemePage(
            headerSlug: "for-you-header-theme",
            pageSlug: "for-you",
            defaultGradientColors: [
                Color(safeHex: "#EE204D"), Color(safeHex: "#58111A"), Color(safeHex: "#EE204D"),
            ]
        )
    }
}

// End of file

// MARK: - Global Lottie Model
public struct LottieLayerConfig: Codable, Identifiable, Equatable {
    public var id: String { animationName }
    public let animationName: String
    public let frame: LottieFrame
    public let loop: Bool
    public let speed: Double
    public let contentMode: String?  // "fit" or "fill", default "fit"
    public let opacity: Double?  // 0.0 to 1.0, default 1.0
    public let rotation: Double?  // Degrees, default 0.0

    public struct LottieFrame: Codable, Equatable {
        public let x: Double
        public let y: Double
        public let width: Double
        public let height: Double
    }
}

// MARK: - Optimized Global Lottie Component
public struct GlobalLottieLayer: View, Equatable {
    public static func == (lhs: GlobalLottieLayer, rhs: GlobalLottieLayer) -> Bool {
        return lhs.layer == rhs.layer
    }

    let layer: LottieLayerConfig
    @State private var dotLottieFile: DotLottieFile?
    @State private var failedToLoadDotLottie = false

    // Computed Normalized Frame (Stateless & Optimized)
    // Always divide by 100 as per 0-100 scale request
    // This avoids State updates inside layout loops, preventing freezes.
    private var nX: Double { layer.frame.x / 100.0 }
    private var nY: Double { layer.frame.y / 100.0 }
    private var nW: Double { layer.frame.width / 100.0 }
    private var nH: Double { layer.frame.height / 100.0 }

    public init(layer: LottieLayerConfig) {
        self.layer = layer
    }

    public var body: some View {
        GeometryReader { proxy in
            let parentWidth = proxy.size.width
            let parentHeight = proxy.size.height

            Group {
                if let dotLottieFile = dotLottieFile {
                    LottieView(dotLottieFile: dotLottieFile)
                        .configuration(LottieConfiguration(renderingEngine: .coreAnimation))
                        .looping()
                        .animationSpeed(layer.speed)
                        .resizable()
                        .aspectRatio(contentMode: layer.contentMode == "fill" ? .fill : .fit)
                        .opacity(layer.opacity ?? 1.0)
                        .rotationEffect(.degrees(layer.rotation ?? 0.0))
                } else if failedToLoadDotLottie {
                    LottieView(animation: .named(layer.animationName, bundle: .main))
                        .configuration(LottieConfiguration(renderingEngine: .coreAnimation))
                        .looping()
                        .animationSpeed(layer.speed)
                        .resizable()
                        .aspectRatio(contentMode: layer.contentMode == "fill" ? .fill : .fit)
                        .opacity(layer.opacity ?? 1.0)
                        .rotationEffect(.degrees(layer.rotation ?? 0.0))
                } else {
                    Color.clear  // Loading state
                }
            }
            // Size: width/height as percentage of parent (0-100 scale)
            .frame(
                width: parentWidth * nW,
                height: parentHeight * nH
            )
            // Position: x/y as percentage of parent (0=top/left, 100=bottom/right)
            .position(
                x: parentWidth * nX + (parentWidth * nW / 2),
                y: parentHeight * nY + (parentHeight * nH / 2)
            )
        }
        .allowsHitTesting(false)
        .task(id: layer.animationName) {
            await loadLottie()
        }
    }

    private func loadLottie() async {
        // Avoid reloading if already loaded correctly
        if dotLottieFile != nil { return }

        do {
            let file = try await DotLottieFile.named(layer.animationName)
            await MainActor.run {
                self.dotLottieFile = file
            }
        } catch {
            print("GlobalLottieLayer: Failed DotLottie '\(layer.animationName)', fallback JSON.")
            await MainActor.run {
                self.failedToLoadDotLottie = true
            }
        }
    }
}
