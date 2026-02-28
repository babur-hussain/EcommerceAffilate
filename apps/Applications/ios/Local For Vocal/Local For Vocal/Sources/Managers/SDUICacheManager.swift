import CommonCrypto
import Foundation

// MARK: - Thread-Safe NSCache Wrapper (accessible outside actor)

/// NSCache wrapper for in-memory SDUI JSON storage.
/// NSCache is inherently thread-safe — no actor isolation needed.
final class SDUIMemoryCache: @unchecked Sendable {
    static let shared = SDUIMemoryCache()

    private let cache = NSCache<NSString, NSData>()

    private init() {
        // Limit: ~30 MB memory, 100 entries max
        cache.totalCostLimit = 30 * 1024 * 1024
        cache.countLimit = 100
    }

    /// Get raw JSON data from memory cache
    func getFromMemory(key: String) -> Data? {
        return cache.object(forKey: key as NSString) as Data?
    }

    /// Save raw JSON data to memory cache
    func saveToMemory(key: String, jsonData: Data) {
        cache.setObject(
            jsonData as NSData,
            forKey: key as NSString,
            cost: jsonData.count  // Cost = byte size for memory-pressure eviction
        )
    }

    /// Remove a specific key from memory
    func removeFromMemory(key: String) {
        cache.removeObject(forKey: key as NSString)
    }

    /// Clear all memory cache
    func removeAll() {
        cache.removeAllObjects()
    }
}

// MARK: - Disk Cache Layer

/// Actor-isolated disk cache for persistent SDUI JSON storage.
/// Uses FileManager with atomic writes for crash safety.
actor SDUIDiskCache {
    static let shared = SDUIDiskCache()

    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    private let metadataFile: URL
    private var metadata: CacheMetadata
    private var checksums: [String: String]  // slug → SHA256 hex

    // Stale threshold (1 hour) — cache is still usable but should refresh in bg
    let staleCacheAge: TimeInterval = 60 * 60

    // MARK: - Internal Types

    struct CacheMetadata: Codable {
        var entries: [String: CacheEntry]

        struct CacheEntry: Codable {
            let version: Int
            let timestamp: Date
            let slug: String
            let checksum: String  // SHA256 of rawJSON
        }

        init() {
            entries = [:]
        }
    }

    struct CacheFile: Codable {
        let rawJSON: Data
        let version: Int
        let timestamp: Date
        let slug: String
        let checksum: String
    }

    // MARK: - Init

    private init() {
        let cacheBase = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first!
        cacheDirectory = cacheBase.appendingPathComponent("SDUI", isDirectory: true)
        metadataFile = cacheDirectory.appendingPathComponent("cache_metadata.json")
        checksums = [:]

        // Load metadata synchronously (ready for preloading)
        var loadedMetadata = CacheMetadata()
        let metaURL = cacheDirectory.appendingPathComponent("cache_metadata.json")
        if fileManager.fileExists(atPath: metaURL.path),
            let data = try? Data(contentsOf: metaURL),
            let decoded = try? JSONDecoder().decode(CacheMetadata.self, from: data)
        {
            loadedMetadata = decoded
        }
        metadata = loadedMetadata

        // Build checksum index from metadata
        for (_, entry) in metadata.entries {
            checksums[entry.slug] = entry.checksum
        }

        // Create directory if needed
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
    }

    // MARK: - Public API

    /// Save raw JSON to disk with checksum
    func saveToDisk(key: String, jsonData: Data, userId: String? = nil, version: Int = 1) {
        let checksum = Self.sha256(data: jsonData)
        let fileName = cacheFileName(slug: key, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        let cacheFile = CacheFile(
            rawJSON: jsonData,
            version: version,
            timestamp: Date(),
            slug: key,
            checksum: checksum
        )

        do {
            let data = try JSONEncoder().encode(cacheFile)
            try data.write(to: fileURL, options: .atomic)

            // Update metadata + checksum index
            metadata.entries[fileName] = CacheMetadata.CacheEntry(
                version: version,
                timestamp: Date(),
                slug: key,
                checksum: checksum
            )
            checksums[key] = checksum
            saveMetadataSync()

            log(
                "[SDUI DiskCache] Saved: \(key) (\(jsonData.count) bytes, checksum: \(checksum.prefix(8))…)"
            )
        } catch {
            log("[SDUI DiskCache] Failed to save \(key): \(error)")
        }
    }

    /// Load raw JSON from disk, returns (data, isStale)
    func loadFromDisk(key: String, userId: String? = nil) -> (data: Data, isStale: Bool)? {
        let fileName = cacheFileName(slug: key, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        guard fileManager.fileExists(atPath: fileURL.path) else {
            return nil
        }

        do {
            let fileData = try Data(contentsOf: fileURL)
            let cacheFile = try JSONDecoder().decode(CacheFile.self, from: fileData)
            let isStale = Date().timeIntervalSince(cacheFile.timestamp) > staleCacheAge
            return (cacheFile.rawJSON, isStale)
        } catch {
            log("[SDUI DiskCache] Failed to load \(key): \(error)")
            return nil
        }
    }

    /// Check if a cache file exists on disk
    func checkIfExists(key: String, userId: String? = nil) -> Bool {
        let fileName = cacheFileName(slug: key, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)
        return fileManager.fileExists(atPath: fileURL.path)
    }

    /// Compare SHA256 of new data vs stored checksum
    func hasContentChanged(key: String, newData: Data) -> Bool {
        let newChecksum = Self.sha256(data: newData)
        guard let existingChecksum = checksums[key] else {
            return true  // No existing data = always "changed"
        }
        return newChecksum != existingChecksum
    }

    /// Get stored checksum for a key
    func getChecksum(key: String) -> String? {
        return checksums[key]
    }

    /// Invalidate cache for a specific slug
    func invalidate(key: String, userId: String? = nil) {
        let fileName = cacheFileName(slug: key, userId: userId)
        let fileURL = cacheDirectory.appendingPathComponent(fileName)

        try? fileManager.removeItem(at: fileURL)
        metadata.entries.removeValue(forKey: fileName)
        checksums.removeValue(forKey: key)
        saveMetadataSync()

        log("[SDUI DiskCache] Invalidated: \(key)")
    }

    /// Clear all cached layouts
    func clearAll() {
        do {
            let files = try fileManager.contentsOfDirectory(
                at: cacheDirectory, includingPropertiesForKeys: nil)
            for file in files {
                try? fileManager.removeItem(at: file)
            }
            metadata = CacheMetadata()
            checksums = [:]
            log("[SDUI DiskCache] Cleared all cache")
        } catch {
            log("[SDUI DiskCache] Failed to clear: \(error)")
        }
    }

    /// Get cache statistics
    func getStats() -> (entryCount: Int, totalSize: Int64) {
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

    // MARK: - Helpers

    func cacheFileName(slug: String, userId: String?) -> String {
        if let userId = userId, !userId.isEmpty {
            return "\(slug)_user_\(userId).cache"
        }
        return "\(slug)_v1.cache"
    }

    private func saveMetadataSync() {
        do {
            let data = try JSONEncoder().encode(metadata)
            try data.write(to: metadataFile, options: .atomic)
        } catch {
            log("[SDUI DiskCache] Failed to save metadata: \(error)")
        }
    }

    /// SHA256 hash of data, returned as lowercase hex string
    static func sha256(data: Data) -> String {
        var hash = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        data.withUnsafeBytes {
            _ = CC_SHA256($0.baseAddress, CC_LONG(data.count), &hash)
        }
        return hash.map { String(format: "%02x", $0) }.joined()
    }

    private func log(_ message: String) {
        #if DEBUG
            AppLogger.debug(message)
        #endif
    }
}

// MARK: - SDUICacheManager (Unified Façade)

/// Production-grade SDUI Cache Manager.
/// Provides a unified API over memory (NSCache) + disk (FileManager) layers.
///
/// - `getCachedSDUI(key:)` → checks memory first, then disk (promotes to memory on disk hit)
/// - `saveSDUI(key:, jsonData:)` → saves to both memory AND disk atomically
/// - `clearCache(key:)` → removes from both layers
/// - `hasContentChanged(key:, newData:)` → SHA256 checksum comparison to avoid unnecessary re-renders
actor SDUICacheManager {
    static let shared = SDUICacheManager()

    private let memoryCache = SDUIMemoryCache.shared
    private let diskCache = SDUIDiskCache.shared

    // Keep legacy stale threshold accessible
    let staleCacheAge: TimeInterval = 60 * 60

    private init() {}

    // MARK: - Unified API

    /// Get cached SDUI JSON: checks memory first, then disk.
    /// Promotes disk hits to memory for subsequent instant access.
    /// Returns (data, isStale) or nil if no cache exists.
    func getCachedSDUI(key: String, userId: String? = nil) async -> (data: Data, isStale: Bool)? {
        // Layer 1: Memory (NSCache) — instant, ~0ms
        if let memData = memoryCache.getFromMemory(key: key) {
            log("[SDUICacheManager] Memory HIT: \(key)")
            // Determine staleness from disk metadata
            let isStale = await diskCache.loadFromDisk(key: key, userId: userId)?.isStale ?? false
            return (memData, isStale)
        }

        // Layer 2: Disk — fast, ~5-10ms
        if let diskResult = await diskCache.loadFromDisk(key: key, userId: userId) {
            log("[SDUICacheManager] Disk HIT: \(key) → promoting to memory")
            // Promote to memory for next access
            memoryCache.saveToMemory(key: key, jsonData: diskResult.data)
            return diskResult
        }

        log("[SDUICacheManager] MISS: \(key)")
        return nil
    }

    /// Save SDUI JSON to both memory AND disk atomically.
    func saveSDUI(key: String, jsonData: Data, userId: String? = nil, version: Int = 1) async {
        // Save to memory (instant)
        memoryCache.saveToMemory(key: key, jsonData: jsonData)

        // Save to disk (atomic write)
        await diskCache.saveToDisk(key: key, jsonData: jsonData, userId: userId, version: version)

        log("[SDUICacheManager] Saved to both layers: \(key)")
    }

    /// Clear cache for a specific key from both layers.
    func clearCache(key: String, userId: String? = nil) async {
        memoryCache.removeFromMemory(key: key)
        await diskCache.invalidate(key: key, userId: userId)
        log("[SDUICacheManager] Cleared: \(key)")
    }

    /// Clear all caches.
    func clearAll() async {
        memoryCache.removeAll()
        await diskCache.clearAll()
    }

    /// Check if new JSON data actually changed vs what's cached (SHA256 comparison).
    /// Returns `true` if data is different (UI should re-render).
    /// Returns `false` if identical (skip re-render).
    func hasContentChanged(key: String, newData: Data) async -> Bool {
        return await diskCache.hasContentChanged(key: key, newData: newData)
    }

    // MARK: - Legacy Compatibility API

    /// Load cached SDUI components for a page slug (legacy API, wraps new system)
    func load(slug: String, userId: String? = nil) async -> CachedLayout? {
        guard let cached = await getCachedSDUI(key: slug, userId: userId) else {
            return nil
        }

        do {
            let components = try JSONDecoder().decode([SDUIComponent].self, from: cached.data)
            let checksum = await diskCache.getChecksum(key: slug) ?? ""

            return CachedLayout(
                components: components,
                version: 1,
                timestamp: Date(),
                slug: slug,
                isStale: cached.isStale,
                checksum: checksum
            )
        } catch {
            log("[SDUICacheManager] Failed to decode components for \(slug): \(error)")
            return nil
        }
    }

    /// Save raw JSON data (legacy API, wraps new system)
    func saveRawJSON(_ jsonData: Data, slug: String, userId: String? = nil, version: Int = 1) async
    {
        await saveSDUI(key: slug, jsonData: jsonData, userId: userId, version: version)
    }

    /// Invalidate cache for a specific slug (legacy API)
    func invalidate(slug: String, userId: String? = nil) async {
        await clearCache(key: slug, userId: userId)
    }

    /// Get cache statistics
    func getStats() async -> (entryCount: Int, totalSize: Int64) {
        return await diskCache.getStats()
    }

    // MARK: - Cached Layout Model

    struct CachedLayout {
        let components: [SDUIComponent]
        let version: Int
        let timestamp: Date
        let slug: String
        let isStale: Bool
        let checksum: String
    }

    // MARK: - Helpers

    private func log(_ message: String) {
        #if DEBUG
            AppLogger.debug(message)
        #endif
    }
}
