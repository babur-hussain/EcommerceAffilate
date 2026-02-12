import SwiftUI

struct GroceryCategoryPageView: View {
    @State private var categoryGroups: [CategoryGroup] = []
    @State private var isLoading = true

    // Hardcoded ID for the main Grocery category as per requirement
    private let GROCERY_PARENT_ID = "697095953758a7d8f76fa88c"

    // Grid Configuration
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Fixed Header
            HStack {
                Text("All Categories")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#374151"))
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.top, 10)  // Adjust for status bar overlap if needed, though background handles visual
            .padding(.bottom, 12)
            .background(Color(hex: "#FFF8E7").ignoresSafeArea(edges: .top))
            .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
            .zIndex(1)  // Ensure it stays on top

            if isLoading {
                VStack {
                    ProgressView()
                    Text("Loading categories...")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .padding(.top, 8)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView(showsIndicators: false) {
                    LazyVStack(alignment: .leading, spacing: 24) {
                        ForEach(categoryGroups, id: \.name) { group in
                            VStack(alignment: .leading, spacing: 16) {
                                // Group Header
                                Text(group.name)
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(Color(hex: "#111827"))
                                    .padding(.horizontal, 16)

                                // Group Items Grid
                                LazyVGrid(columns: columns, spacing: 20) {
                                    ForEach(group.categories) { category in
                                        NavigationLink(destination: destinationView(for: category))
                                        {
                                            CategoryGridItem(category: category)
                                        }
                                        .buttonStyle(PlainButtonStyle())
                                    }
                                }
                                .padding(.horizontal, 16)
                            }
                        }
                    }
                    .padding(.vertical, 20)
                }
            }
        }
        .background(Color.white)
        .onAppear {
            loadCategories()
        }
    }

    private func destinationView(for category: CategoryModel) -> some View {
        // Navigate to GroceryListingView with the selected subcategory
        GroceryListingView(
            categoryId: GROCERY_PARENT_ID,
            categoryName: "Grocery",
            initialSubCategoryId: category.id
        )
    }

    private func loadCategories() {
        Task {
            do {
                let allCategories = try await APIService.shared.fetchCategories()

                // 1. Find the parent Grocery category to get the group order
                let parentCategory = allCategories.first { $0.id == GROCERY_PARENT_ID }
                let groupOrder = parentCategory?.subCategoryGroupOrder ?? []

                // 2. Filter for subcategories of Grocery
                let grocerySubcategories = allCategories.filter {
                    $0.parentCategory == GROCERY_PARENT_ID
                }

                // 3. Group by 'group' property
                let grouped = Dictionary(grouping: grocerySubcategories) { $0.group ?? "Other" }

                // 4. Sort groups based on groupOrder
                var sortedGroups: [CategoryGroup] = []

                // First add groups that are in the order list
                for groupName in groupOrder {
                    if let cats = grouped[groupName] {
                        sortedGroups.append(CategoryGroup(name: groupName, categories: cats))
                    }
                }

                // Then add any remaining groups (e.g. "Other" or new groups not in order list)
                // Filter out keys already added
                let remainingKeys = grouped.keys.filter { !groupOrder.contains($0) }.sorted()
                for groupName in remainingKeys {
                    if let cats = grouped[groupName] {
                        sortedGroups.append(CategoryGroup(name: groupName, categories: cats))
                    }
                }

                await MainActor.run {
                    self.categoryGroups = sortedGroups
                    self.isLoading = false
                }

            } catch {
                AppLogger.error("Failed to load grocery categories: \(error)")
                await MainActor.run {
                    self.isLoading = false
                }
            }
        }
    }
}

// MARK: - Helper Models & Views

struct CategoryGroup {
    let name: String
    let categories: [CategoryModel]
}

struct CategoryGridItem: View {
    let category: CategoryModel

    var body: some View {
        VStack(spacing: 8) {
            // Image Container
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(hex: "#F3F4F6"))  // Light gray background
                    .aspectRatio(1, contentMode: .fit)

                if let imageUrl = category.image,
                    let url = URL(
                        string: imageUrl.hasPrefix("http")
                            ? imageUrl : "\(APIService.shared.imageHost)\(imageUrl)")
                {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .padding(8)  // Padding inside the box
                    } placeholder: {
                        ProgressView()
                    }
                } else if let icon = category.icon {
                    // Fallback to icon if image is missing
                    Image(systemName: icon)
                        .font(.system(size: 24))
                        .foregroundColor(.gray)
                }
            }
            .frame(maxWidth: .infinity)

            // Category Name
            Text(category.name)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "#374151"))
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}
