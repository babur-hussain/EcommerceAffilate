import SwiftUI
import UIKit

struct RealAppleGlass: View {
    var style: UIBlurEffect.Style = .systemUltraThinMaterial
    var cornerRadius: CGFloat = 0

    var body: some View {
        if #available(iOS 26.0, *) {
            Color.clear
                .glassEffect(.regular, in: .rect(cornerRadius: cornerRadius))
        } else {
            RealAppleGlassLegacy(style: style)
        }
    }
}

private struct RealAppleGlassLegacy: UIViewRepresentable {
    var style: UIBlurEffect.Style

    func makeUIView(context: Context) -> UIVisualEffectView {
        return UIVisualEffectView(effect: UIBlurEffect(style: style))
    }

    func updateUIView(_ uiView: UIVisualEffectView, context: Context) {
        uiView.effect = UIBlurEffect(style: style)
    }
}
