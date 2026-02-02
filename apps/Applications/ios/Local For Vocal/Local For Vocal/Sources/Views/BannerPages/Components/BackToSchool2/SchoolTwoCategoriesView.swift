import SwiftUI

struct SchoolTwoCategoriesView: View {
    let component: SDUIComponent

    let categories = [
        "All Items",
        "Notebooks 📓",
        "Pens & Pencils ✏️",
        "Textbooks 📚",
        "Art Supplies 🎨",
    ]

    @State private var selected = "All Items"
    private let primary = Color(hex: "FACC15")

    var body: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Categories")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
                Button(action: {}) {
                    Text("View All")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(primary)
                        .underline()
                }
            }
            .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(categories, id: \.self) { cat in
                        let isSelected = selected == cat
                        Button(action: { selected = cat }) {
                            Text(cat)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(isSelected ? Color(hex: "155e48") : .white)
                                .padding(.horizontal, 20)
                                .padding(.vertical, 10)
                                .background(isSelected ? Color.white : Color.clear)
                                .cornerRadius(999)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 999)
                                        .stroke(
                                            style: StrokeStyle(
                                                lineWidth: 2, dash: isSelected ? [] : [5])
                                        )
                                        .foregroundColor(
                                            isSelected ? .white : Color.white.opacity(0.6))
                                )
                                .scaleEffect(isSelected ? 1.05 : 1.0)
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.top, 24)
    }
}
