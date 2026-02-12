import CommonCrypto
import Foundation
import UIKit

/// Persistent image disk cache for offline support
/// Stores downloaded images to Library/Caches/Images/ with MD5-hashed filenames
/// Thread-safe via actor isolation
actor ImageDiskCache {
    static let shared = ImageDiskCache()

    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    private let maxCacheSize: Int64 = 500 * 1024 * 1024  // 500 MB

    // In-memory index for fast lookups: URL hash → file exists
    private var fileIndex: Set<String> = []

    // In-memory image cache (NSCache auto-evicts under memory pressure)
    // This prevents re-reading from disk when LazyVStack recycles views
    private let memoryCache = NSCache<NSString, UIImage>()

    private init() {
        let cacheBase = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        cacheDirectory = cacheBase.appendingPathComponent("Images", isDirectory: true)

        try? FileManager.default.createDirectory(
            at: cacheDirectory, withIntermediateDirectories: true)

        // Allow ~100 images in memory (~50MB)
        memoryCache.countLimit = 100

        // Build in-memory file index on init
        Task { await buildIndex() }
    }

    // MARK: - Public API

    /// Load image from cache (memory → disk)
    /// Returns instantly from memory if previously loaded this session
    func loadImage(for urlString: String) -> UIImage? {
        let hash = md5Hash(urlString)
        let cacheKey = hash as NSString

        // Layer 1: Check in-memory cache (instant, no disk I/O)
        if let memImage = memoryCache.object(forKey: cacheKey) {
            return memImage
        }

        // Layer 2: Check disk
        guard fileIndex.contains(hash) else { return nil }

        let filePath = cacheDirectory.appendingPathComponent(hash)
        guard let data = try? Data(contentsOf: filePath),
            let image = UIImage(data: data)
        else {
            fileIndex.remove(hash)
            return nil
        }

        // Promote to memory cache for next access
        memoryCache.setObject(image, forKey: cacheKey)

        // Update access date for LRU (background, non-blocking)
        try? fileManager.setAttributes(
            [.modificationDate: Date()],
            ofItemAtPath: filePath.path
        )

        return image
    }

    /// Save image to disk cache
    func saveImage(_ image: UIImage, for urlString: String) {
        let hash = md5Hash(urlString)
        let cacheKey = hash as NSString

        // Save to memory cache immediately
        memoryCache.setObject(image, forKey: cacheKey)

        // Use JPEG for photos, PNG for images with transparency
        guard let data = image.jpegData(compressionQuality: 0.85) else { return }

        let filePath = cacheDirectory.appendingPathComponent(hash)
        try? data.write(to: filePath, options: .atomic)

        fileIndex.insert(hash)

        // Trigger eviction check in background
        Task.detached(priority: .utility) {
            await self.evictIfNeeded()
        }
    }

    /// Save raw image data to disk cache (avoids re-encoding)
    func saveData(_ data: Data, for urlString: String) {
        let hash = md5Hash(urlString)
        let cacheKey = hash as NSString

        let filePath = cacheDirectory.appendingPathComponent(hash)
        try? data.write(to: filePath, options: .atomic)

        fileIndex.insert(hash)

        // Also promote to memory cache
        if let image = UIImage(data: data) {
            memoryCache.setObject(image, forKey: cacheKey)
        }
    }

    /// Check if image exists in disk cache
    func hasImage(for urlString: String) -> Bool {
        return fileIndex.contains(md5Hash(urlString))
    }

    /// Prefetch multiple image URLs in parallel
    func prefetch(urls: [String]) async {
        await withTaskGroup(of: Void.self) { group in
            for urlString in urls {
                // Skip if already cached
                guard !hasImage(for: urlString) else { continue }
                guard let url = URL(string: urlString) else { continue }

                group.addTask {
                    do {
                        let request = URLRequest(
                            url: url,
                            cachePolicy: .returnCacheDataElseLoad,
                            timeoutInterval: 30
                        )
                        let (data, response) = try await URLSession.shared.data(for: request)

                        if let httpResponse = response as? HTTPURLResponse,
                            httpResponse.statusCode == 200,
                            UIImage(data: data) != nil
                        {
                            await self.saveData(data, for: urlString)
                        }
                    } catch {
                        // Silent fail for prefetch
                    }
                }
            }
        }
    }

    /// Clear all cached images
    func clearAll() {
        let files =
            (try? fileManager.contentsOfDirectory(
                at: cacheDirectory, includingPropertiesForKeys: nil)) ?? []
        for file in files {
            try? fileManager.removeItem(at: file)
        }
        fileIndex.removeAll()
    }

    /// Get cache stats
    func getStats() -> (fileCount: Int, totalSize: Int64) {
        var totalSize: Int64 = 0
        let files =
            (try? fileManager.contentsOfDirectory(
                at: cacheDirectory, includingPropertiesForKeys: [.fileSizeKey])) ?? []
        for file in files {
            let attrs = try? file.resourceValues(forKeys: [.fileSizeKey])
            totalSize += Int64(attrs?.fileSize ?? 0)
        }
        return (files.count, totalSize)
    }

    // MARK: - Private Helpers

    private func buildIndex() {
        guard
            let files = try? fileManager.contentsOfDirectory(
                at: cacheDirectory, includingPropertiesForKeys: nil)
        else { return }
        for file in files {
            fileIndex.insert(file.lastPathComponent)
        }
        print("[ImageDiskCache] Indexed \(fileIndex.count) cached images")
    }

    private func evictIfNeeded() {
        let stats = getStats()
        guard stats.totalSize > maxCacheSize else { return }

        // LRU eviction: delete oldest accessed files first
        guard
            let files = try? fileManager.contentsOfDirectory(
                at: cacheDirectory,
                includingPropertiesForKeys: [.contentModificationDateKey, .fileSizeKey]
            )
        else { return }

        let sorted = files.sorted { a, b in
            let dateA =
                (try? a.resourceValues(forKeys: [.contentModificationDateKey]))?
                .contentModificationDate
                ?? .distantPast
            let dateB =
                (try? b.resourceValues(forKeys: [.contentModificationDateKey]))?
                .contentModificationDate
                ?? .distantPast
            return dateA < dateB  // Oldest first
        }

        var currentSize = stats.totalSize
        let targetSize = maxCacheSize / 2  // Evict down to 50% of max

        for file in sorted {
            guard currentSize > targetSize else { break }
            let size = (try? file.resourceValues(forKeys: [.fileSizeKey]))?.fileSize ?? 0
            try? fileManager.removeItem(at: file)
            fileIndex.remove(file.lastPathComponent)
            currentSize -= Int64(size)
        }

        print("[ImageDiskCache] Evicted to \(currentSize / 1024 / 1024)MB")
    }

    private func md5Hash(_ string: String) -> String {
        let data = Data(string.utf8)
        var digest = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
        data.withUnsafeBytes { buffer in
            _ = CC_MD5(buffer.baseAddress, CC_LONG(buffer.count), &digest)
        }
        return digest.map { String(format: "%02x", $0) }.joined()
    }
}
