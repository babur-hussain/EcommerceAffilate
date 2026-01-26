import Foundation

// MARK: - Product Model

struct Product: Identifiable, Decodable, Hashable {
    let _id: String
    var id: String { _id }
    let name: String
    let price: Double
    let images: [String]
    let category: String
    let rating: Double?
    let reviewCount: Int?
    let stock: Int?
    let mrp: Double?
    let discountPercentage: Int?
    let subtitle: String?
    
    enum CodingKeys: String, CodingKey {
        case _id, name, price, images, category, rating, reviewCount, stock, mrp, discountPercentage, subtitle, title
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        _id = try container.decodeIfPresent(String.self, forKey: ._id) ?? UUID().uuidString
        // Handle potentially different naming conventions (name vs title)
        if let nameVal = try container.decodeIfPresent(String.self, forKey: .name) {
            name = nameVal
        } else {
            name = try container.decodeIfPresent(String.self, forKey: .title) ?? "Unknown Product"
        }
        
        price = try container.decodeIfPresent(Double.self, forKey: .price) ?? 0.0
        images = try container.decodeIfPresent([String].self, forKey: .images) ?? []
        category = try container.decodeIfPresent(String.self, forKey: .category) ?? "General"
        rating = try container.decodeIfPresent(Double.self, forKey: .rating)
        reviewCount = try container.decodeIfPresent(Int.self, forKey: .reviewCount)
        stock = try container.decodeIfPresent(Int.self, forKey: .stock)
        mrp = try container.decodeIfPresent(Double.self, forKey: .mrp)
        discountPercentage = try container.decodeIfPresent(Int.self, forKey: .discountPercentage)
        subtitle = try container.decodeIfPresent(String.self, forKey: .subtitle)
    }
}
