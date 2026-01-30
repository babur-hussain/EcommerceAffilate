import Foundation

public struct TrustBadge: Codable, Hashable, Identifiable {
    public let id: String
    public let name: String
    public let icon: String

    public init(id: String, name: String, icon: String) {
        self.id = id
        self.name = name
        self.icon = icon
    }
}

public struct ProductOffer: Codable, Hashable {
    public let type: String
    public let title: String
    public let description: String
    public let discountAmount: Double
    public let code: String?

    public init(
        type: String, title: String, description: String, discountAmount: Double, code: String?
    ) {
        self.type = type
        self.title = title
        self.description = description
        self.discountAmount = discountAmount
        self.code = code
    }
}
