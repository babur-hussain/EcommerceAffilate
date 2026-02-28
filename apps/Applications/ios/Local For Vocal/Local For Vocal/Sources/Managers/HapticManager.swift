import UIKit

// Fix #5: Pre-warm and reuse generators instead of creating new ones per call
class HapticManager {
    static let shared = HapticManager()

    // Pre-warmed generators — avoids per-call allocation
    private let selectionGenerator = UISelectionFeedbackGenerator()
    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    private let notificationGenerator = UINotificationFeedbackGenerator()

    private init() {
        // Pre-warm all generators
        selectionGenerator.prepare()
        lightImpact.prepare()
        mediumImpact.prepare()
        heavyImpact.prepare()
        notificationGenerator.prepare()
    }

    func selection() {
        selectionGenerator.selectionChanged()
        selectionGenerator.prepare()  // Re-arm for next use
    }

    func impact(style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator: UIImpactFeedbackGenerator
        switch style {
        case .light: generator = lightImpact
        case .medium: generator = mediumImpact
        case .heavy: generator = heavyImpact
        @unknown default: generator = mediumImpact
        }
        generator.impactOccurred()
        generator.prepare()  // Re-arm for next use
    }

    func notification(type: UINotificationFeedbackGenerator.FeedbackType) {
        notificationGenerator.notificationOccurred(type)
        notificationGenerator.prepare()  // Re-arm for next use
    }
}
