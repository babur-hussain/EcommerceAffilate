import SwiftUI

struct SchoolFiveCategoriesView: View {
    let component: SDUIComponent

    let categories = [
        "🔥 All Items",
        "🖊️ Pens & Pencils",
        "📓 Notebooks",
        "🎒 Bags",
        "🎨 Art",
    ]
    @State private var selected = "🔥 All Items"

    private let primary = Color(hex: "DC2626")
    private let cardLight = Color.white

    var body: some View {
        VStack {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(categories, id: \.self) { cat in
                        let isSelected = selected == cat
                        Button(action: { selected = cat }) {
                            Text(cat)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(isSelected ? .white : Color(hex: "4B5563"))
                                .padding(.horizontal, 20)
                                .padding(.vertical, 10)
                                .background(isSelected ? primary : cardLight)
                                .cornerRadius(999)
                                .shadow(
                                    color: isSelected ? primary.opacity(0.3) : .black.opacity(0.05),
                                    radius: isSelected ? 10 : 8, x: 0, y: isSelected ? 0 : 4)
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)  // Shadow space
            }
        }
        .padding(.top, 24)
    }
}
