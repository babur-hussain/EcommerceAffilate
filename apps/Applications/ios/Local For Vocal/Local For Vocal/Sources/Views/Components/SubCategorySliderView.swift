import SwiftUI

struct SubCategorySliderView: View {
    let parentCategoryId: String

    @State private var subCategories: [SubCategory] = []
    @State private var isLoading = true

    let rows = [
        GridItem(.fixed(100), spacing: 16),
        GridItem(.fixed(100), spacing: 16),
    ]

    var body: some View {
        VStack(alignment: .leading) {
            if isLoading {
                ProgressView()
                    .frame(height: 200)
            } else if !subCategories.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHGrid(rows: rows, spacing: 12) {
                        ForEach(subCategories, id: \.id) { sub in
                            SubCategoryCell(sub: sub)
                        }
                    }
                    .padding(.horizontal, 16)
                }
                .frame(height: 230)
            }
        }
        .task {
            await fetchSubCategories()
        }
    }

    private func fetchSubCategories() async {
        do {
            self.subCategories = try await APIService.shared.fetchSubCategories(
                parentId: parentCategoryId)
            self.isLoading = false
        } catch {
            print("Error loading subcategories: \(error)")
            self.isLoading = false
        }
    }
}

struct SubCategoryCell: View {
    let sub: SubCategory

    var body: some View {
        Button(action: {
            print("Navigate to sub-category: \(sub.name)")
        }) {
            VStack(spacing: 6) {
                // Icon Container
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.white)
                        .frame(width: 70, height: 70)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                        )

                    if let url = URL(string: sub.image ?? sub.icon ?? "") {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .frame(width: 70, height: 70)
                        .cornerRadius(12)
                    }
                }

                Text(sub.name)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "#374151"))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .frame(width: 80)
            }
        }
    }
}
