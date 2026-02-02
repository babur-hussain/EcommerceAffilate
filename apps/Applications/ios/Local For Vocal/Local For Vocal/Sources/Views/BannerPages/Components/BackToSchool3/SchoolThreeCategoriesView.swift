import SwiftUI

struct SchoolThreeCategoriesView: View {
    let component: SDUIComponent

    let categories = ["All", "Pencils", "Notebooks", "Backpacks", "Art"]
    @State private var selected = "All"

    private let primary = Color(hex: "FF8C42")
    private let cardLight = Color.white

    var body: some View {
        VStack {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(categories, id: \.self) { cat in
                        let isSelected = selected == cat
                        Button(action: { selected = cat }) {
                            Text(cat)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(isSelected ? .white : Color(hex: "333333"))
                                .padding(.horizontal, 20)
                                .padding(.vertical, 10)
                                .background(isSelected ? primary : cardLight)
                                .cornerRadius(999)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 999)
                                        .stroke(Color(hex: "333333"), lineWidth: isSelected ? 0 : 1)  // In dark mode border color differs
                                )
                                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 24)
    }
}
