import SwiftUI

struct GroceryShopByCategoryComponent: View {
    let component: SDUIComponent
    @EnvironmentObject var navigationManager: NavigationManager
    @State private var fetchedItems: [GroceryCategoryItem] = []
    @State private var isLoading = false

    // 4-column grid layout
    let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(spacing: 16) {
            // Header
            if let title = component.prop(for: "title") as String? {
                HStack {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))
                    Spacer()
                }
                .padding(.horizontal, 16)
            }

            // Grid Content
            let staticItems = component.decodeItems(for: "items", as: [GroceryCategoryItem].self)
            let displayItems = fetchedItems.isEmpty ? staticItems : fetchedItems

            if isLoading {
                ProgressView()
                    .frame(height: 200)
            } else {
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(displayItems, id: \.self) { item in
                        Button(action: {
                            if let actionUrl = item.actionUrl {
                                navigationManager.navigate(to: actionUrl)
                            } else if let subCategoryId = item.subCategoryId {
                                navigationManager.navigate(to: "/category/\(subCategoryId)")
                            }
                        }) {
                            VStack(spacing: 8) {
                                // Image Container
                                ZStack {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color(hex: "#FFF9E5"))  // Light yellow background

                                    CachedAsyncImage(url: URL(string: item.imageUrl)) { image in
                                        image.resizable()
                                            .aspectRatio(contentMode: .fit)
                                    } placeholder: {
                                        Color.clear
                                    }
                                    .padding(8)  // Padding inside the yellow box
                                }
                                .frame(height: 80)  // Fixed height for consistency

                                // Title
                                Text(item.title)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(Color(hex: "#1F2937"))
                                    .multilineTextAlignment(.center)
                                    .lineLimit(2)
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal, 16)
            }

            // View All Button
            Button(action: {
                if let viewAllAction = component.prop(for: "viewAllAction") as String? {
                    navigationManager.navigate(to: viewAllAction)
                }
            }) {
                HStack {
                    Text("View All Categories")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#5C3B1E"))  // Brown text

                    Image(systemName: "arrow.right")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#FFFFFF"))
                        .padding(6)
                        .background(Color(hex: "#5C3B1E"))  // Brown circle background
                        .clipShape(Circle())
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color(hex: "#FFF9E5"))  // Light yellow background
                .cornerRadius(12)
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
        }
        .padding(.vertical, 24)
        .onAppear {
            loadCategories()
        }
    }

    // Fetch categories by ID if provided in JSON
    func loadCategories() {
        guard let ids = component.prop(for: "subCategoryIds") as [String]? else { return }

        isLoading = true
        Task {
            var items: [GroceryCategoryItem] = []
            // Fetch concurrently
            await withTaskGroup(of: GroceryCategoryItem?.self) { group in
                for id in ids {
                    group.addTask {
                        do {
                            // Try fetching as Category first (most likely given current API structure)
                            let category = try await APIService.shared.fetchCategoryDetails(id: id)
                            return GroceryCategoryItem(
                                title: category.name,
                                imageUrl: category.image ?? "",
                                subCategoryId: category.id,
                                actionUrl: "/category/\(category.id)"
                            )
                        } catch {
                            AppLogger.debug("Failed to fetch category \(id): \(error)")
                            return nil
                        }
                    }
                }

                for await item in group {
                    if let item = item {
                        items.append(item)
                    }
                }
            }

            // Sort to match original ID order if needed? Currently unsorted concurrency
            // Improve: Sort by original ID index
            // Just append for now or handle sorting if strict order needed
            // Simple hack: Re-sort by index in `ids`
            let sortedItems = items.sorted { item1, item2 in
                guard let id1 = item1.subCategoryId, let id2 = item2.subCategoryId else {
                    return false
                }
                guard let index1 = ids.firstIndex(of: id1), let index2 = ids.firstIndex(of: id2)
                else { return false }
                return index1 < index2
            }

            await MainActor.run {
                self.fetchedItems = sortedItems
                self.isLoading = false
            }
        }
    }
}

struct GroceryCategoryItem: Codable, Hashable {
    let title: String
    let imageUrl: String
    let subCategoryId: String?
    let actionUrl: String?
}
