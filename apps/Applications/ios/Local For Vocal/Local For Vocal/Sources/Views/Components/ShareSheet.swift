import SwiftUI

#if canImport(UIKit)
    import UIKit

    struct ShareSheet: UIViewControllerRepresentable {
        var activityItems: [Any]
        var applicationActivities: [UIActivity]? = nil
        var excludedActivityTypes: [UIActivity.ActivityType]? = nil

        func makeUIViewController(context: Context) -> UIActivityViewController {
            let controller = UIActivityViewController(
                activityItems: activityItems,
                applicationActivities: applicationActivities
            )
            controller.excludedActivityTypes = excludedActivityTypes
            return controller
        }

        func updateUIViewController(
            _ uiViewController: UIActivityViewController, context: Context
        ) {
            // No update needed for static content
        }
    }

    // Alternative: Present share sheet using UIKit directly
    struct ShareSheetButton: View {
        let items: [Any]
        let label: () -> AnyView

        init(items: [Any], @ViewBuilder label: @escaping () -> some View) {
            self.items = items
            self.label = { AnyView(label()) }
        }

        var body: some View {
            Button(action: {
                presentShareSheet()
            }) {
                label()
            }
        }

        private func presentShareSheet() {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                let rootViewController = windowScene.windows.first?.rootViewController
            else {
                return
            }

            // Find the topmost presented view controller
            var topController = rootViewController
            while let presented = topController.presentedViewController {
                topController = presented
            }

            let activityVC = UIActivityViewController(
                activityItems: items,
                applicationActivities: nil
            )

            // For iPad: configure popover presentation
            if let popover = activityVC.popoverPresentationController {
                popover.sourceView = topController.view
                popover.sourceRect = CGRect(
                    x: topController.view.bounds.midX,
                    y: topController.view.bounds.midY,
                    width: 0, height: 0
                )
                popover.permittedArrowDirections = []
            }

            topController.present(activityVC, animated: true)
        }
    }
#endif
