import SwiftUI

struct BackToSchoolCategoriesView: View {
    let component: SDUIComponent

    struct CategoryItem {
        let label: String
        let icon: String
        let color: String
        let bg: String
    }

    let categories = [
        CategoryItem(label: "Bags", icon: "bag.fill", color: "6B9EE6", bg: "E1EBF9"),  // approx bg
        CategoryItem(label: "Books", icon: "book.fill", color: "E66B6B", bg: "F9E1E1"),
        CategoryItem(label: "Uniforms", icon: "tshirt.fill", color: "F4D35E", bg: "FDF6DE"),
        CategoryItem(label: "Art", icon: "paintpalette.fill", color: "4ADE80", bg: "DBF8E5"),
        CategoryItem(
            label: "Lunch", icon: "takeoutbag.and.cup.and.straw.fill", color: "C084FC", bg: "F2E6FE"
        ),
    ]

    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Essentials")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
                Button(action: {}) {
                    Text("See All")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "F4B060"))
                }
            }
            .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(categories, id: \.label) { cat in
                        Button(action: {}) {
                            VStack(spacing: 8) {
                                ZStack {
                                    Circle()
                                        .fill(Color(hex: cat.bg))  // Simplified color handling
                                        .frame(width: 64, height: 64)

                                    Image(systemName: cat.icon)
                                        .font(.system(size: 28))
                                        .foregroundColor(Color(hex: cat.color))
                                }

                                Text(cat.label)
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(Color(hex: "4B5563"))
                            }
                            .frame(minWidth: 70)
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
        .padding(.top, 24)
    }
}
