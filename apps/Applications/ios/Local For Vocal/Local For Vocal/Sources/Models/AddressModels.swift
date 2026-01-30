#if false
    import Foundation

    public struct Address: Identifiable, Codable, Hashable {
        public let _id: String
        public var id: String { _id }
        public let userId: String
        public let name: String
        public let phone: String
        public let addressLine1: String
        public let addressLine2: String?
        public let city: String
        public let state: String
        public let pincode: String
        public let country: String
        public let isDefault: Bool

        enum CodingKeys: String, CodingKey {
            case _id, userId, name, phone, addressLine1, addressLine2, city, state, pincode,
                country,
                isDefault
        }

        public init(
            _id: String = UUID().uuidString,
            userId: String = "",
            name: String,
            phone: String,
            addressLine1: String,
            addressLine2: String? = nil,
            city: String,
            state: String,
            pincode: String,
            country: String = "India",
            isDefault: Bool = false
        ) {
            self._id = _id
            self.userId = userId
            self.name = name
            self.phone = phone
            self.addressLine1 = addressLine1
            self.addressLine2 = addressLine2
            self.city = city
            self.state = state
            self.pincode = pincode
            self.country = country
            self.isDefault = isDefault
        }
    }
#endif
