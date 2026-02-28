import CryptoKit
import Foundation
import UIKit

/// Persistent image disk cache for offline support
/// Stores downloaded images to Library/Caches/Images/ with SHA256-hashed filenames
/// Thread-safe via actor isolation
actor ImageDiskCache {
    static let shared = ImageDiskCache()

    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    private let maxCacheSize: Int64 = 500 * 1024 * 1024  // 500 MB

    // In-memory index for fast lookups: URL hash → file exists
    private var fileIndex: Set<String> = []

    // Fix #13: Track total cache size incrementally
    private var currentCacheSize: Int64 = 0

    // Fix #22: Cache hash results to avoid repeated SHA256
    private var hashCache: [String: String] = [:]

    // Fix #12: In-memory LRU tracking instead of filesystem writes
    private var accessTimes: [String: Date] = [:]

    // In-memory image cache (NSCache auto-evicts under memory pressure)
    // This prevents re-reading from disk when LazyVStack recycles views
    private let memoryCache = NSCache<NSString, UIImage>()

    private init() {
        let cacheBase = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        cacheDirectory = cacheBase.appendingPathComponent("Images", isDirectory: true)

        try? FileManager.default.createDirectory(
            at: cacheDirectory, withIntermediateDirectories: true)

        // NSCache auto-evicts under memory pressure — no artificial limit needed
        // All loaded images stay in RAM for instant access until iOS reclaims memory

        // Build in-memory file index on init
        Task { await buildIndex() }
    }

    // MARK: - Public API

    /// Load image from cache (memory → disk)
    /// Returns instantly from memory if previously loaded this session
    func loadImage(for urlString: String) -> UIImage? {
        let hash = cachedHash(urlString)
        let cacheKey = hash as NSString

        // Layer 1: Check in-memory cache (instant, no disk I/O)
        if let memImage = memoryCache.object(forKey: cacheKey) {
            // Fix #12: Track access time in memory, not filesystem
            accessTimes[hash] = Date()
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

        // Fix #12: Track access in-memory (no filesystem write)
        accessTimes[hash] = Date()

        return image
    }

    /// Save image to disk cache
    func saveImage(_ image: UIImage, for urlString: String) {
        let hash = cachedHash(urlString)
        let cacheKey = hash as NSString

        // Save to memory cache immediately
        memoryCache.setObject(image, forKey: cacheKey)

        // Use JPEG for photos, PNG for images with transparency
        guard let data = image.jpegData(compressionQuality: 0.85) else { return }

        let filePath = cacheDirectory.appendingPathComponent(hash)
        try? data.write(to: filePath, options: .atomic)

        fileIndex.insert(hash)
        accessTimes[hash] = Date()
        // Fix #13: Track size incrementally
        currentCacheSize += Int64(data.count)

        // Trigger eviction check in background (only if over limit)
        if currentCacheSize > maxCacheSize {
            Task.detached(priority: .utility) {
                await self.evictIfNeeded()
            }
        }
    }

    /// Save raw image data to disk cache (avoids re-encoding)
    func saveData(_ data: Data, for urlString: String) {
        let hash = cachedHash(urlString)
        let cacheKey = hash as NSString

        let filePath = cacheDirectory.appendingPathComponent(hash)
        try? data.write(to: filePath, options: .atomic)

        fileIndex.insert(hash)
        accessTimes[hash] = Date()
        // Fix #13: Track size incrementally
        currentCacheSize += Int64(data.count)

        // Also promote to memory cache
        if let image = UIImage(data: data) {
            memoryCache.setObject(image, forKey: cacheKey)
        }
    }

    /// Check if image exists in disk cache
    func hasImage(for urlString: String) -> Bool {
        return fileIndex.contains(cachedHash(urlString))
    }

    /// Prefetch multiple image URLs in parallel
    /// Fix #23: Prefetch with limited concurrency (max 6 concurrent downloads)
    func prefetch(urls: [String]) async {
        let maxConcurrent = 6
        await withTaskGroup(of: Void.self) { group in
            var active = 0
            for urlString in urls {
                // Skip if already cached
                guard !hasImage(for: urlString) else { continue }
                guard let url = URL(string: urlString) else { continue }

                if active >= maxConcurrent {
                    await group.next()  // Wait for one to finish
                    active -= 1
                }

                active += 1
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
                at: cacheDirectory, includingPropertiesForKeys: [.fileSizeKey])
        else { return }
        currentCacheSize = 0
        for file in files {
            fileIndex.insert(file.lastPathComponent)
            let size = (try? file.resourceValues(forKeys: [.fileSizeKey]))?.fileSize ?? 0
            currentCacheSize += Int64(size)
        }
        AppLogger.debug(
            "[ImageDiskCache] Indexed \(fileIndex.count) cached images (\(currentCacheSize / 1024 / 1024)MB)"
        )
    }

    // Fix #13: Uses in-memory accessTimes for LRU instead of re-scanning directory
    private func evictIfNeeded() {
        guard currentCacheSize > maxCacheSize else { return }

        // Sort by in-memory access times (oldest first)
        let sortedHashes = accessTimes.sorted { $0.value < $1.value }.map { $0.key }

        let targetSize = maxCacheSize / 2

        for hash in sortedHashes {
            guard currentCacheSize > targetSize else { break }
            let filePath = cacheDirectory.appendingPathComponent(hash)
            let size = (try? filePath.resourceValues(forKeys: [.fileSizeKey]))?.fileSize ?? 0
            try? fileManager.removeItem(at: filePath)
            fileIndex.remove(hash)
            accessTimes.removeValue(forKey: hash)
            currentCacheSize -= Int64(size)
        }

        AppLogger.debug("[ImageDiskCache] Evicted to \(currentCacheSize / 1024 / 1024)MB")
    }

    // Fix #22: Cache SHA256 results to avoid repeated computation
    private func cachedHash(_ string: String) -> String {
        if let cached = hashCache[string] { return cached }
        let inputData = Data(string.utf8)
        let hashed = SHA256.hash(data: inputData)
        let result = hashed.compactMap { String(format: "%02x", $0) }.joined()
        hashCache[string] = result
        return result
    }
}
