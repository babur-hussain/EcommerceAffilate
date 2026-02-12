import SwiftUI

struct GroceryWholesaleTextComponent: View {
    let component: SDUIComponent
    @StateObject private var viewModel = SDUIComponentViewModel()

    var body: some View {
        VStack(spacing: 4) {
            if let lines = viewModel.data as? [WholesaleTextLine] {
                ForEach(lines, id: \.self) { line in
                    Text(line.text)
                        .font(.system(size: line.size, weight: line.fontWeight))
                        .foregroundColor(Color(hex: line.color))
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                }
            } else {
                // Fallback / Loading state
                Text("You Just Experienced")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(Color(hex: "#D4AF37"))  // Goldish
                Text("3000+")
                    .font(.system(size: 56, weight: .heavy))
                    .foregroundColor(Color(hex: "#D4AF37"))
                Text("Products at\nWholesale Prices")
                    .font(.system(size: 34, weight: .bold))
                    .foregroundColor(Color(hex: "#D4AF37"))
                    .multilineTextAlignment(.center)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 50)
        .padding(.bottom, 10)
        .padding(.horizontal, 16)
        .background(Color.white)  // Or transparent
        .onAppear {
            viewModel.decodeItems(from: component, type: WholesaleTextLine.self, key: "lines")
        }
    }
}

struct WholesaleTextLine: Codable, Hashable {
    let text: String
    let size: CGFloat
    let color: String
    let weight: String?  // "bold", "medium", "regular", "heavy"

    var fontWeight: Font.Weight {
        switch weight?.lowercased() {
        case "ultraLight": return .ultraLight
        case "thin": return .thin
        case "light": return .light
        case "regular": return .regular
        case "medium": return .medium
        case "semibold": return .semibold
        case "bold": return .bold
        case "heavy": return .heavy
        case "black": return .black
        default: return .bold
        }
    }
}
