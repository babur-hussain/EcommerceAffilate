import SwiftUI

// Helper for corners
struct CustomCorner: Shape {
    var corners: ScreenCorner
    var radius: CGFloat

    func path(in rect: CGRect) -> Path {
        var path = Path()

        let w = rect.width
        let h = rect.height
        let r = radius

        // Top Left
        if corners.contains(.topLeft) {
            path.move(to: CGPoint(x: 0, y: r))
            path.addArc(
                center: CGPoint(x: r, y: r), radius: r, startAngle: .degrees(180),
                endAngle: .degrees(270), clockwise: false)
        } else {
            path.move(to: CGPoint(x: 0, y: 0))
        }

        // Top Right
        if corners.contains(.topRight) {
            path.addLine(to: CGPoint(x: w - r, y: 0))
            path.addArc(
                center: CGPoint(x: w - r, y: r), radius: r, startAngle: .degrees(270),
                endAngle: .degrees(0), clockwise: false)
        } else {
            path.addLine(to: CGPoint(x: w, y: 0))
        }

        // Bottom Right
        if corners.contains(.bottomRight) {
            path.addLine(to: CGPoint(x: w, y: h - r))
            path.addArc(
                center: CGPoint(x: w - r, y: h - r), radius: r, startAngle: .degrees(0),
                endAngle: .degrees(90), clockwise: false)
        } else {
            path.addLine(to: CGPoint(x: w, y: h))
        }

        // Bottom Left
        if corners.contains(.bottomLeft) {
            path.addLine(to: CGPoint(x: r, y: h))
            path.addArc(
                center: CGPoint(x: r, y: h - r), radius: r, startAngle: .degrees(90),
                endAngle: .degrees(180), clockwise: false)
        } else {
            path.addLine(to: CGPoint(x: 0, y: h))
        }

        path.closeSubpath()
        return path
    }
}

struct ScreenCorner: OptionSet {
    let rawValue: Int
    static let topLeft = ScreenCorner(rawValue: 1 << 0)
    static let topRight = ScreenCorner(rawValue: 1 << 1)
    static let bottomLeft = ScreenCorner(rawValue: 1 << 2)
    static let bottomRight = ScreenCorner(rawValue: 1 << 3)
    static let allCorners: ScreenCorner = [.topLeft, .topRight, .bottomLeft, .bottomRight]
}

// MARK: - Shimmer Effect

public struct Shimmer: ViewModifier {
    @State private var phase: CGFloat = 0

    public func body(content: Content) -> some View {
        content
            .overlay(
                GeometryReader { geometry in
                    LinearGradient(
                        gradient: Gradient(stops: [
                            .init(color: .clear, location: 0),
                            .init(color: .white.opacity(0.3), location: 0.3),
                            .init(color: .white.opacity(0.7), location: 0.5),
                            .init(color: .white.opacity(0.3), location: 0.7),
                            .init(color: .clear, location: 1),
                        ]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .frame(width: geometry.size.width * 2, height: geometry.size.height * 2)
                    .offset(x: phase * geometry.size.width * 2 - geometry.size.width)
                    .onAppear {
                        withAnimation(
                            Animation.linear(duration: 1.5).repeatForever(autoreverses: false)
                        ) {
                            phase = 1
                        }
                    }
                }
            )
            .mask(content)
    }
}

extension View {
    @ViewBuilder
    public func skeleton(isLoading: Bool) -> some View {
        if isLoading {
            self
                .redacted(reason: .placeholder)
                .modifier(Shimmer())
        } else {
            self
        }
    }
}

// MARK: - ProductCardSkeleton

public struct ProductCardSkeleton: View {
    public init() {}
    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Image Placeholder
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .aspectRatio(0.8, contentMode: .fit)

            // Text Placeholders
            VStack(alignment: .leading, spacing: 6) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.gray.opacity(0.1))
                    .frame(height: 14)
                    .frame(maxWidth: .infinity)

                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.gray.opacity(0.1))
                    .frame(width: 60, height: 12)
            }
            .padding(.horizontal, 4)
            .padding(.bottom, 8)
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
        .skeleton(isLoading: true)
    }
}
