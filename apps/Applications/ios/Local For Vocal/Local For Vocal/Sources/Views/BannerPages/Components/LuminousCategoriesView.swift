import SwiftUI

struct LuminousCategoriesView: View {
    let title: String
    let linkText: String
    let items: [SubCategory]
    let selectedId: String?
    let onSelect: (String?) -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                // "All Products" button
                Button(action: { onSelect(nil) }) {
                    Text("All Products")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(
                            selectedId == nil ? .white : Color(red: 0.06, green: 0.09, blue: 0.16)
                        )
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(
                            selectedId == nil
                                ? Color(red: 0.91, green: 0.64, blue: 0.66) : Color.white
                        )
                        .cornerRadius(999)
                        .overlay(
                            RoundedRectangle(cornerRadius: 999)
                                .stroke(
                                    Color.pink.opacity(0.15), lineWidth: selectedId == nil ? 0 : 1)
                        )
                        .shadow(
                            color: selectedId == nil
                                ? Color(red: 0.91, green: 0.64, blue: 0.66).opacity(0.3) : .clear,
                            radius: 8, y: 4)
                }

                // Dynamic category items
                ForEach(items) { item in
                    Button(action: { onSelect(item.id) }) {
                        Text(item.name)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(
                                selectedId == item.id
                                    ? .white : Color(red: 0.06, green: 0.09, blue: 0.16)
                            )
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(
                                selectedId == item.id
                                    ? Color(red: 0.91, green: 0.64, blue: 0.66) : Color.white
                            )
                            .cornerRadius(999)
                            .overlay(
                                RoundedRectangle(cornerRadius: 999)
                                    .stroke(
                                        Color.pink.opacity(0.15),
                                        lineWidth: selectedId == item.id ? 0 : 1)
                            )
                            .shadow(
                                color: selectedId == item.id
                                    ? Color(red: 0.91, green: 0.64, blue: 0.66).opacity(0.3)
                                    : .clear,
                                radius: 8, y: 4)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
        .padding(.top, 32)
    }
}
