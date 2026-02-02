import SwiftUI

struct SchoolFourCategoriesView: View {
    let component: SDUIComponent

    let categories = [
        "All Items",
        "Girls Uniforms",
        "Boys Uniforms",
        "Sportswear",
        "Accessories",
    ]
    @State private var selected = "All Items"

    private let primary = Color(hex: "1565C0")
    private let secondary = Color(hex: "FF8F00")

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "square.grid.2x2")
                    .foregroundColor(secondary)
                Text("Categories")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
            }
            .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(categories, id: \.self) { cat in
                        let isSelected = selected == cat
                        Button(action: { selected = cat }) {
                            Text(cat)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(isSelected ? .white : Color(hex: "4B5563"))
                                .padding(.horizontal, 24)
                                .padding(.vertical, 10)
                                .background(isSelected ? primary : Color.white)
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "F3F4F6"), lineWidth: isSelected ? 0 : 1)
                                )
                                .shadow(
                                    color: isSelected
                                        ? Color(hex: "3B82F6").opacity(0.3) : .black.opacity(0.05),
                                    radius: 8, x: 0, y: 4)
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
        .padding(.top, 24)
    }
}
