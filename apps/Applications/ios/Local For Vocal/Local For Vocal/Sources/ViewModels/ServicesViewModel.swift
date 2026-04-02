import Combine
import Foundation
import SwiftUI

@MainActor
class ServicesViewModel: ObservableObject {
    private let api = APIService.shared

    // Categories
    @Published var categories: [ServiceCategoryModel] = []
    @Published var categoriesLoading = false

    // Sub-Categories
    @Published var subCategories: [ServiceSubCategoryModel] = []
    @Published var subCategoriesLoading = false

    // Providers
    @Published var providers: [ServiceProviderModel] = []
    @Published var providersLoading = false

    // Provider Detail
    @Published var selectedProvider: ServiceProviderModel?
    @Published var providerReviews: [ServiceReviewModel] = []

    // Error
    @Published var errorMessage: String?

    // MARK: - Fetch Categories
    func fetchCategories() async {
        categoriesLoading = true
        errorMessage = nil
        do {
            categories = try await api.fetchServiceCategories()
            categoriesLoading = false
        } catch {
            errorMessage = error.localizedDescription
            categoriesLoading = false
            AppLogger.error("Failed to fetch service categories: \(error)")
        }
    }

    // MARK: - Fetch Sub-Categories
    func fetchSubCategories(categoryId: String) async {
        subCategoriesLoading = true
        errorMessage = nil
        do {
            subCategories = try await api.fetchServiceSubCategories(categoryId: categoryId)
            subCategoriesLoading = false
        } catch {
            errorMessage = error.localizedDescription
            subCategoriesLoading = false
            AppLogger.error("Failed to fetch sub-categories: \(error)")
        }
    }

    // MARK: - Fetch Providers
    func fetchProviders(subCategoryId: String) async {
        providersLoading = true
        errorMessage = nil
        do {
            providers = try await api.fetchServiceProviders(subCategoryId: subCategoryId)
            providersLoading = false
        } catch {
            errorMessage = error.localizedDescription
            providersLoading = false
            AppLogger.error("Failed to fetch providers: \(error)")
        }
    }

    // MARK: - Fetch Provider Detail
    func fetchProviderDetail(id: String) async {
        do {
            selectedProvider = try await api.fetchServiceProviderDetail(id: id)
        } catch {
            AppLogger.error("Failed to fetch provider detail: \(error)")
        }
    }

    // MARK: - Fetch Reviews
    func fetchProviderReviews(providerId: String) async {
        do {
            providerReviews = try await api.fetchServiceProviderReviews(providerId: providerId)
        } catch {
            AppLogger.error("Failed to fetch provider reviews: \(error)")
        }
    }
}
