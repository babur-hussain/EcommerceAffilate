import SwiftUI

struct LuminousCategoriesView: View {
    let title: String
    let linkText: String

    struct CategoryItem: Decodable, Identifiable {
        let id = UUID()
        let name: String
        let image_url: String

        private enum CodingKeys: String, CodingKey {
            case name, image_url
        }
    }

    let items: [CategoryItem]
    @State private var selectedIndex: Int = 0

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                // "All Products" button (always first, always active style)
                Button(action: { selectedIndex = 0 }) {
                    Text("All Products")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(Color(red: 0.91, green: 0.64, blue: 0.66))
                        .cornerRadius(999)
                        .shadow(
                            color: Color(red: 0.91, green: 0.64, blue: 0.66).opacity(0.3),
                            radius: 8, y: 4)
                }

                // Dynamic category items
                ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                    Button(action: { selectedIndex = index + 1 }) {
                        Text(item.name)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.white)
                            .cornerRadius(999)
                            .overlay(
                                RoundedRectangle(cornerRadius: 999)
                                    .stroke(Color.pink.opacity(0.15), lineWidth: 1)
                            )
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
        .padding(.top, 32)
    }
}
