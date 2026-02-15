import SwiftUI

/// A reusable ViewModifier that applies Apple's Liquid Glass effect (iOS 26+)
/// to any view when the `isScrolled` condition is true.
/// Falls back to `.ultraThinMaterial` on older iOS versions.
struct LiquidGlassHeaderModifier: ViewModifier {
    let isScrolled: Bool

    func body(content: Content) -> some View {
        if isScrolled {
            if #available(iOS 26.0, *) {
                content
                    .glassEffect(.regular, in: .rect(cornerRadius: 0))
            } else {
                content
                    .background(
                        .ultraThinMaterial,
                        ignoresSafeAreaEdges: .top
                    )
            }
        } else {
            content
        }
    }
}
