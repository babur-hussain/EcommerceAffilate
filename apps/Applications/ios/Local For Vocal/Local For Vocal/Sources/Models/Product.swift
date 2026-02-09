import Foundation

public struct Product: Identifiable, Codable, Hashable {
    public let _id: String
    public var id: String { _id }
    public let name: String
    public let price: Double
    public let images: [String]
    public let category: String
    public let rating: Double?
    public let reviewCount: Int?
    public let stock: Int?
    public let mrp: Double?
    public let discountPercentage: Int?
    public let subtitle: String?
    public let description: String?
    public let shortDescription: String?
    public let saleEndDate: String?
    public let protectPromiseFee: Double?
    public let sellerName: String?
    public let offers: [ProductOffer]?
    public let trustBadges: [TrustBadge]?
    public let lastChanceOffers: [LastChanceOffer]?
    public let highlights: [String]?
    public let shippingCharges: Double?
    public let influencerCommission: Double?

    enum CodingKeys: String, CodingKey {
        case _id, name, price, images, category, rating, reviewCount, stock, mrp,
            discountPercentage, subtitle, title, description, shortDescription,
            saleEndDate, protectPromiseFee, sellerName, offers, trustBadges,
            lastChanceOffers, highlights, shippingCharges, influencerCommission
    }

    public init(from decoder: Decoder) throws {
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

        description = try container.decodeIfPresent(String.self, forKey: .description)
        shortDescription = try container.decodeIfPresent(String.self, forKey: .shortDescription)
        saleEndDate = try container.decodeIfPresent(String.self, forKey: .saleEndDate)
        protectPromiseFee = try container.decodeIfPresent(Double.self, forKey: .protectPromiseFee)
        sellerName = try container.decodeIfPresent(String.self, forKey: .sellerName)
        offers = try container.decodeIfPresent([ProductOffer].self, forKey: .offers)

        // Handle trustBadges - can be [TrustBadge] or [String]
        if let badges = try? container.decodeIfPresent([TrustBadge].self, forKey: .trustBadges) {
            trustBadges = badges
        } else if let badgeStrings = try? container.decodeIfPresent(
            [String].self, forKey: .trustBadges)
        {
            trustBadges = badgeStrings.enumerated().map { index, str in
                TrustBadge(id: "badge_\(index)", name: str, icon: "checkmark.shield.fill")
            }
        } else {
            trustBadges = nil
        }
        lastChanceOffers = try container.decodeIfPresent(
            [LastChanceOffer].self, forKey: .lastChanceOffers)
        highlights = try container.decodeIfPresent([String].self, forKey: .highlights)
        shippingCharges = try container.decodeIfPresent(Double.self, forKey: .shippingCharges)
        influencerCommission = try container.decodeIfPresent(Double.self, forKey: .influencerCommission)
    }

    // Memberwise Initializer for manual creation
    public init(
        _id: String,
        name: String,
        price: Double,
        images: [String],
        category: String,
        rating: Double? = nil,
        reviewCount: Int? = nil,
        stock: Int? = nil,
        mrp: Double? = nil,
        discountPercentage: Int? = nil,
        subtitle: String? = nil,
        description: String? = nil,
        shortDescription: String? = nil,
        saleEndDate: String? = nil,
        protectPromiseFee: Double? = nil,
        sellerName: String? = nil,
        offers: [ProductOffer]? = nil,
        trustBadges: [TrustBadge]? = nil,
        lastChanceOffers: [LastChanceOffer]? = nil,
        highlights: [String]? = nil,
        shippingCharges: Double? = nil,
        influencerCommission: Double? = nil
    ) {
        self._id = _id
        self.name = name
        self.price = price
        self.images = images
        self.category = category
        self.rating = rating
        self.reviewCount = reviewCount
        self.stock = stock
        self.mrp = mrp
        self.discountPercentage = discountPercentage
        self.subtitle = subtitle
        self.description = description
        self.shortDescription = shortDescription
        self.saleEndDate = saleEndDate
        self.protectPromiseFee = protectPromiseFee
        self.sellerName = sellerName
        self.offers = offers
        self.trustBadges = trustBadges
        self.lastChanceOffers = lastChanceOffers
        self.highlights = highlights
        self.shippingCharges = shippingCharges
        self.influencerCommission = influencerCommission
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(_id, forKey: ._id)
        try container.encode(name, forKey: .name)
        try container.encode(price, forKey: .price)
        try container.encode(images, forKey: .images)
        try container.encode(category, forKey: .category)
        try container.encodeIfPresent(rating, forKey: .rating)
        try container.encodeIfPresent(reviewCount, forKey: .reviewCount)
        try container.encodeIfPresent(stock, forKey: .stock)
        try container.encodeIfPresent(mrp, forKey: .mrp)
        try container.encodeIfPresent(discountPercentage, forKey: .discountPercentage)
        try container.encodeIfPresent(subtitle, forKey: .subtitle)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(shortDescription, forKey: .shortDescription)
        try container.encodeIfPresent(saleEndDate, forKey: .saleEndDate)
        try container.encodeIfPresent(protectPromiseFee, forKey: .protectPromiseFee)
        try container.encodeIfPresent(sellerName, forKey: .sellerName)
        try container.encodeIfPresent(offers, forKey: .offers)
        try container.encodeIfPresent(trustBadges, forKey: .trustBadges)
        try container.encodeIfPresent(lastChanceOffers, forKey: .lastChanceOffers)
        try container.encodeIfPresent(highlights, forKey: .highlights)
        try container.encodeIfPresent(shippingCharges, forKey: .shippingCharges)
        try container.encodeIfPresent(influencerCommission, forKey: .influencerCommission)
    }
}
