import SwiftUI

struct SpacerSDUI: View {
    let component: SDUIComponent

    var body: some View {
        let height: CGFloat = {
            if let h = component.props?["height"]?.value as? CGFloat {
                return h
            } else if let h = component.props?["height"]?.value as? Int {
                return CGFloat(h)
            } else if let h = component.props?["height"]?.value as? Double {
                return CGFloat(h)
            } else if let hString = component.props?["height"]?.value as? String,
                let h = Double(hString)
            {
                return CGFloat(h)
            } else {
                return 10
            }
        }()

        // Use Color.clear for a fixed-height spacer that guarantees space
        return Color.clear
            .frame(height: height)
            .frame(maxWidth: .infinity)
    }
}
