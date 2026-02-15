import SwiftUI

// MARK: - Default Theme (Gradient)
struct DefaultHomeHeaderTheme: HomeHeaderTheme {
    var showIcons: Bool

    var backgroundView: AnyView {
        AnyView(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(hex: "#E94057"),
                    Color(hex: "#F27121"),
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
        )
    }

    var textColor: Color {
        .white
    }
}
