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
