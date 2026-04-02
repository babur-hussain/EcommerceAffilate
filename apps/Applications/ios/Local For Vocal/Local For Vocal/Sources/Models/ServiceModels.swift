import Foundation

// MARK: - Service Category
struct ServiceCategoryModel: Codable, Identifiable {
    let id: String
    let name: String
    let slug: String
    let icon: String
    let description: String
    let isActive: Bool

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case name, slug, icon, description, isActive
    }
}

// MARK: - Service Sub-Category
struct ServiceSubCategoryModel: Codable, Identifiable {
    let id: String
    let categoryId: String
    let name: String
    let slug: String
    let description: String
    let icon: String
    let isActive: Bool

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case categoryId, name, slug, description, icon, isActive
    }

    // Handle categoryId as String or Object
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        slug = try container.decode(String.self, forKey: .slug)
        description = (try? container.decode(String.self, forKey: .description)) ?? ""
        icon = (try? container.decode(String.self, forKey: .icon)) ?? ""
        isActive = (try? container.decode(Bool.self, forKey: .isActive)) ?? true

        if let catId = try? container.decode(String.self, forKey: .categoryId) {
            categoryId = catId
        } else if let catObj = try? container.decode(ServiceCategoryRef.self, forKey: .categoryId) {
            categoryId = catObj._id
        } else {
            categoryId = ""
        }
    }

    struct ServiceCategoryRef: Decodable {
        let _id: String
    }
}

// MARK: - Service Provider
struct ServiceProviderModel: Codable, Identifiable {
    let id: String
    let userId: ServiceProviderUser?
    let serviceCategoryId: ServiceCategoryRef?
    let serviceSubCategoryId: ServiceSubCategoryRef?
    let businessName: String
    let description: String
    let experienceYears: Int
    let rating: Double
    let reviewCount: Int
    let location: ServiceLocation?
    let serviceArea: [String]
    let pricingModel: String
    let startingPrice: Double
    let currency: String
    let images: [String]
    let isVerified: Bool
    let status: String

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case userId, serviceCategoryId, serviceSubCategoryId
        case businessName, description, experienceYears
        case rating, reviewCount, location, serviceArea
        case pricingModel, startingPrice, currency
        case images, isVerified, status
    }

    struct ServiceProviderUser: Codable {
        let _id: String
        let name: String?
        let email: String?
        let profileImage: String?
    }

    struct ServiceCategoryRef: Codable {
        let _id: String
        let name: String?
        let slug: String?
        let icon: String?
    }

    struct ServiceSubCategoryRef: Codable {
        let _id: String
        let name: String?
        let slug: String?
    }

    struct ServiceLocation: Codable {
        let type: String?
        let coordinates: [Double]?
        let address: String?
    }
}

// MARK: - Service Provider List Response
struct ServiceProviderListResponse: Codable {
    let data: [ServiceProviderModel]
    let meta: PaginationMeta

    struct PaginationMeta: Codable {
        let total: Int
        let page: Int
        let limit: Int
        let pages: Int
    }
}

// MARK: - Service Review
struct ServiceReviewModel: Codable, Identifiable {
    let id: String
    let serviceProviderId: String
    let bookingId: String
    let customerId: ReviewCustomer?
    let rating: Int
    let review: String
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case serviceProviderId, bookingId, customerId
        case rating, review, createdAt
    }

    struct ReviewCustomer: Codable {
        let _id: String
        let name: String?
        let profileImage: String?
    }
}

// MARK: - Service Review List Response
struct ServiceReviewListResponse: Codable {
    let data: [ServiceReviewModel]
    let meta: ServiceProviderListResponse.PaginationMeta
}
