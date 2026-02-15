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

// MARK: - Main For You Page
public struct ForYouPage: View {
    @State private var headerComponents: [SDUIComponent] = []

    // Pre-computed background data (avoids recomputing in body)
    @State private var backgroundImage: String?
    @State private var lottieLayers: [LottieLayerConfig] = []
    @State private var gradientColors: [String] = []

    public init() {}

    public var body: some View {
        VStack(spacing: 0) {
            // Top Section with Animated Background
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
            .padding(.bottom, 0)

            // Existing SDUI Content
            SDUIPage(slug: "for-you")
        }
        .padding(.bottom, 100)
        // Lottie overlay — separate from gradient, with its own coordinate space
        // y=0 → screen top (behind status bar), y=100 → where gradient ends
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
                    .frame(height: 450)  // Visible gradient area (status bar → gradient end)
                    .clipped()  // Clip to gradient visible bounds
                }
            }
            .offset(y: -300)  // Push up behind headers to reach screen top
            .allowsHitTesting(false)
            .ignoresSafeArea(edges: .top), alignment: .top
        )
        .background(
            // Gradient background — scrolls with content
            ZStack(alignment: .top) {
                // 1. Gradient fills entire extended frame
                LinearGradient(
                    gradient: Gradient(colors: resolvedGradientColors),
                    startPoint: .top,
                    endPoint: .bottom
                )

                // 2. Smooth fade at bottom — blends gradient into page background
                VStack {
                    Spacer()
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color.clear,
                            Color(safeHex: "#F9FAFB").opacity(0.3),
                            Color(safeHex: "#F9FAFB").opacity(0.7),
                            Color(safeHex: "#F9FAFB"),
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 200)  // Blend zone height
                }

                // 3. Fallback image (if no Lottie)
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
            .frame(height: 1200)  // Extended frame to cover header area
            .offset(y: -400)  // Shift up behind header
            .ignoresSafeArea(edges: .top), alignment: .top
        )
        .task {
            await loadComponents()
        }
    }

    /// Resolved gradient colors from server JSON or default fallback
    private var resolvedGradientColors: [Color] {
        if gradientColors.isEmpty {
            return [
                Color(safeHex: "#EE204D"), Color(safeHex: "#58111A"), Color(safeHex: "#EE204D"),
            ]
        }
        return gradientColors.map { Color(safeHex: $0) }
    }

    private func loadComponents() async {
        do {
            if let layout = try await APIService.shared.fetchLayout(
                slug: "for-you-header-theme", forceRefresh: true)
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

        // Debug: confirm JSON frame values are being read
        for layer in lottieLayers {
            print(
                "[Lottie] \(layer.animationName) → x:\(layer.frame.x) y:\(layer.frame.y) w:\(layer.frame.width) h:\(layer.frame.height)"
            )
        }
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
