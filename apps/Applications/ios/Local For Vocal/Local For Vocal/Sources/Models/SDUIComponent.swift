import Foundation
import SwiftUI

// MARK: - SDUI Component Model

struct SDUIComponent: Identifiable, Decodable, Hashable {
    let id: String
    let type: ComponentType
    let props: [String: AnyCodable]?
    let style: [String: AnyCodable]?
    let children: [SDUIComponent]?
    
    enum CodingKeys: String, CodingKey {
        case id, type, style, children
        case props // JSON key is now 'props'
    }
    
    // Helper to extract specific props
    func prop<T: Decodable>(for key: String, as type: T.Type = T.self) -> T? {
        guard let value = props?[key] else { return nil }
        return value.value as? T
    }
    
    // Hashable conformance
    static func == (lhs: SDUIComponent, rhs: SDUIComponent) -> Bool {
        return lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// MARK: - Component Types

enum ComponentType: String, Decodable {
    case container = "Container"
    case text = "Text"
    case image = "Image"
    case button = "Button"
    case gradient = "Gradient"
    case scrollView = "ScrollView"
    case productGrid = "ProductGrid"
    case productListHorizontal = "product_list_horizontal"
    case heroCarousel = "hero_carousel"
    case curatedCollections = "curated_collections"
    case fiftyPercentOffZone = "fifty_percent_off"
    case grandKitchenSale = "grand_kitchen"
    case lightningDeals = "lightning_deals"
    case recentHistory = "recent_history"
    case groceryRow = "grocery_row"
    case activeOrders = "active_orders" // Future proofing
    case unknown
    
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let rawValue = try container.decode(String.self)
        self = ComponentType(rawValue: rawValue) ?? .unknown
    }
}

// MARK: - AnyCodable Helper
// Need this because `props` can contain anything (String, Int, Arrays, Objects)

struct AnyCodable: Decodable {
    let value: Any
    
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let intVal = try? container.decode(Int.self) {
            value = intVal
        } else if let doubleVal = try? container.decode(Double.self) {
            value = doubleVal
        } else if let stringVal = try? container.decode(String.self) {
            value = stringVal
        } else if let boolVal = try? container.decode(Bool.self) {
            value = boolVal
        } else if let arrayVal = try? container.decode([AnyCodable].self) {
            value = arrayVal.map { $0.value }
        } else if let dictVal = try? container.decode([String: AnyCodable].self) {
            var dict: [String: Any] = [:]
            for (key, val) in dictVal {
                dict[key] = val.value
            }
            value = dict
        } else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "AnyCodable value cannot be decoded")
        }
    }
}
