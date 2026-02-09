import Foundation

public struct Story: Identifiable, Codable {
    public let id: String
    public let userId: String
    public let userName: String
    public let userProfileImage: String?
    public let mediaUrl: String
    public let mediaType: StoryMediaType
    public let duration: Double?
    public let thumbnailUrl: String?
    public let views: Int
    public let viewedBy: [String]?
    public let isActive: Bool
    public let createdAt: String
    public let expiresAt: String

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case userId, userName, userProfileImage, mediaUrl, mediaType, duration, thumbnailUrl, views,
            viewedBy, isActive, createdAt, expiresAt
    }
}

public enum StoryMediaType: String, Codable {
    case image
    case video
}
