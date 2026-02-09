import Foundation

/// Thread-safe SDUI Cache Manager using FileManager for persistent storage
/// Uses actor for concurrency safety
/// Stores raw JSON data to avoid Encodable conformance requirements
actor SDUICacheManager {
    static let shared = SDUICacheManager()

    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    private let metadataFile: URL
    private var metadata: CacheMetadata

    // Maximum cache age (24 hours for offline fallback)
    private let maxCacheAge: TimeInterval = 24 * 60 * 60

    // MARK: - Cache Metadata

    private struct CacheMetadata: Codable {
        var entries: [String: CacheEntry]

        struct CacheEntry: Codable {
            let version: Int
            let timestamp: Date
            let slug: String
        }

        init() {
            entries = [:]
        }
    }

    // MARK: - Cached Layout Model (returns decoded components)

    struct CachedLayout {
        let components: [SDUIComponent]
        let version: Int
        let timestamp: Date
        let slug: String
    }

    // Internal storage format (Codable - stores raw JSON)
    private struct CacheFile: Codable {
        let rawJSON: Data
        let version: Int
        let timestamp: Date
        let slug: String
    }

    // MARK: - Initialization

    private init() {
        // Create cache directory in Library/Caches
        let cacheBase = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first!
        cacheDirectory = cacheBase.appendingPathComponent("SDUI", isDirectory: true)
        metadataFile = cacheDirectory.appendingPathComponent("cache_metadata.json")

        // Initialize metadata
        metadata = CacheMetadata()

        // Create directory if needed
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)

        // Load existing metadata
        Task { await loadMetadata() }
    }

    // MARK: - Public API

    /// Load cached SDUI components for a page slug
    /// Returns nil if no valid cache exists
    func load(slug: String, userId: String? = nil) async -> CachedLayout? {
        let fileName = cacheFileName(slug: slug, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        guard fileManager.fileExists(atPath: fileURL.path) else {
            log("[SDUI Cache] No cache file for \(slug)")
            return nil
        }

        do {
            let data = try Data(contentsOf: fileURL)
            let cacheFile = try JSONDecoder().decode(CacheFile.self, from: data)

            // Check cache age
            if Date().timeIntervalSince(cacheFile.timestamp) > maxCacheAge {
                log("[SDUI Cache] Cache expired for \(slug)")
                try? fileManager.removeItem(at: fileURL)
                return nil
            }

            // Decode the stored raw JSON to components
            let components = try JSONDecoder().decode([SDUIComponent].self, from: cacheFile.rawJSON)

            log("[SDUI Cache] Loaded \(components.count) components for \(slug)")
            return CachedLayout(
                components: components,
                version: cacheFile.version,
                timestamp: cacheFile.timestamp,
                slug: cacheFile.slug
            )

        } catch {
            log("[SDUI Cache] Failed to load cache for \(slug): \(error)")
            return nil
        }
    }

    /// Save raw JSON data directly (preferred method)
    /// Call this with the raw Data from the API response
    func saveRawJSON(_ jsonData: Data, slug: String, userId: String? = nil, version: Int = 1) async
    {
        let fileName = cacheFileName(slug: slug, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        let cacheFile = CacheFile(
            rawJSON: jsonData,
            version: version,
            timestamp: Date(),
            slug: slug
        )

        do {
            let data = try JSONEncoder().encode(cacheFile)

            // Atomic write for crash safety
            try data.write(to: fileURL, options: .atomic)

            // Update metadata
            metadata.entries[fileName] = CacheMetadata.CacheEntry(
                version: version,
                timestamp: Date(),
                slug: slug
            )
            await saveMetadata()

            log("[SDUI Cache] Saved raw JSON for \(slug)")

        } catch {
            log("[SDUI Cache] Failed to save raw JSON for \(slug): \(error)")
        }
    }

    /// Check if valid cache exists for a slug
    func hasValidCache(slug: String, userId: String? = nil) async -> Bool {
        let fileName = cacheFileName(slug: slug, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        guard fileManager.fileExists(atPath: fileURL.path) else {
            return false
        }

        // Quick check using metadata
        if let entry = metadata.entries[fileName] {
            return Date().timeIntervalSince(entry.timestamp) < maxCacheAge
        }

        return false
    }

    /// Invalidate cache for a specific slug
    func invalidate(slug: String, userId: String? = nil) async {
        let fileName = cacheFileName(slug: slug, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        try? fileManager.removeItem(at: fileURL)
        metadata.entries.removeValue(forKey: fileName)
        await saveMetadata()

        log("[SDUI Cache] Invalidated cache for \(slug)")
    }

    /// Clear all cached layouts
    func clearAll() async {
        do {
            let files = try fileManager.contentsOfDirectory(
                at: cacheDirectory, includingPropertiesForKeys: nil)
            for file in files {
                try? fileManager.removeItem(at: file)
            }
            metadata = CacheMetadata()
            log("[SDUI Cache] Cleared all cache")
        } catch {
            log("[SDUI Cache] Failed to clear cache: \(error)")
        }
    }

    /// Get cache statistics
    func getStats() async -> (entryCount: Int, totalSize: Int64) {
        var totalSize: Int64 = 0

        do {
            let files = try fileManager.contentsOfDirectory(
                at: cacheDirectory, includingPropertiesForKeys: [.fileSizeKey])
            for file in files {
                let attrs = try file.resourceValues(forKeys: [.fileSizeKey])
                totalSize += Int64(attrs.fileSize ?? 0)
            }
            return (files.count, totalSize)
        } catch {
            return (0, 0)
        }
    }

    // MARK: - Private Helpers

    private func cacheFileName(slug: String, userId: String?) -> String {
        if let userId = userId, !userId.isEmpty {
            return "\(slug)_user_\(userId).cache"
        }
        return "\(slug)_v1.cache"
    }

    private func loadMetadata() async {
        guard fileManager.fileExists(atPath: metadataFile.path) else { return }

        do {
            let data = try Data(contentsOf: metadataFile)
            metadata = try JSONDecoder().decode(CacheMetadata.self, from: data)
        } catch {
            log("[SDUI Cache] Failed to load metadata: \(error)")
        }
    }

    private func saveMetadata() async {
        do {
            let data = try JSONEncoder().encode(metadata)
            try data.write(to: metadataFile, options: .atomic)
        } catch {
            log("[SDUI Cache] Failed to save metadata: \(error)")
        }
    }

    // Simple logging helper (avoids AppLogger dependency)
    private func log(_ message: String) {
        #if DEBUG
            print(message)
        #endif
    }
}
