import SwiftUI

// This component is now a spacer since the actual bottom nav
// is rendered as a fixed overlay in BeautyProductView
struct LuminousBottomNavView: View {
    var body: some View {
        Spacer().frame(height: 0)
    }
}
