import Foundation
import SwiftUI

// MARK: - Special Deal Manager
class SpecialDealManager: BasePageManager {
    // Parent Category ID for Special Deals
    override var parentCategoryId: String {
        return "695f88c75f463eeb3c42e765"
    }

    override func fetchInitialData() {
        Task {
            @MainActor in
            self.isLoading = true

            // 1. Fetch Layout from API to get Categories
            do {
                if let layout = try await APIService.shared.fetchLayout(
                    slug: "special-deal-new-style")
                {
                    if let catComponent = layout.components.first(where: {
                        $0.id == "special-categories"
                    }) {
                        // Manually parse items from props
                        if let items = catComponent.props?["items"]?.value as? [[String: Any]] {
                            self.subCategories = items.compactMap { dict in
                                guard let name = dict["name"] as? String else { return nil }
                                let id = dict["id"] as? String ?? UUID().uuidString
                                let image = dict["image_url"] as? String

                                return SubCategory(
                                    id: id, name: name, image: image, icon: nil, slug: nil)
                            }
                        }
                    }
                }
            } catch {
                AppLogger.debug("Error loading Special Deal layout: \(error)")
            }

            // 2. Fetch Products from API
            await self.fetchProducts()
            self.isLoading = false
        }
    }
}
