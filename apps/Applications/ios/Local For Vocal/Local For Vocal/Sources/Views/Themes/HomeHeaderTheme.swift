import SwiftUI

// MARK: - Home Header Theme Protocol
protocol HomeHeaderTheme {
    var backgroundView: AnyView { get }
    var textColor: Color { get }
}
