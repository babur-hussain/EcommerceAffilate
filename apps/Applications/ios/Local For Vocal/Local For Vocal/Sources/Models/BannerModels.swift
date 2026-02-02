import Foundation
import SwiftUI

public struct BTSProduct: Identifiable, Decodable {
    public let id: String
    public let title: String
    public let subtitle: String
    public let price: String
    public let originalPrice: String?
    public let badge: String?
    public let badgeColor: String?  // Hex
    public let image: String
}
