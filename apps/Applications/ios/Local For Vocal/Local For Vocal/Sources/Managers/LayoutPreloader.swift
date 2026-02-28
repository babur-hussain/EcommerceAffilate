import Foundation

/// Handles prefetching all SDUI layouts (headers + pages) on first launch,
/// background refresh of stale layouts on subsequent launches,
/// and on-demand preloading via `preloadScreens(keys:)`.
final class LayoutPreloader {
    static let shared = LayoutPreloader()

    /// All header theme slugs (for gradient/lottie backgrounds)
    static let allHeaderSlugs = [
        "for-you-header-theme",
        "ramadan-header-theme",
        "fashion-header-theme",
        "mobiles-header-theme",
        "beauty-header-theme",
        "electronics-header-theme",
        "home-decor-header-theme",
        "appliances-header-theme",
        "toys-header-theme",
        "food-health-header-theme",
        "dry-fruits-header-theme",
        "auto-header-theme",
        "sports-header-theme",
        "books-header-theme",
        "furniture-header-theme",
        "jewellery-header-theme",
    ]

    /// All page content slugs
    static let allPageSlugs = [
        "for-you",
        "ramadan-slider-theme",
        "fashion",
        "mobiles",
        "beauty",
        "electronics",
        "home",
        "appliances",
        "toys",
        "food-health",
        "dry-fruits",
        "auto",
        "sports",
        "books",
        "furniture",
        "jewellery",
    ]

    /// UserDefaults key for dynamically-discovered slugs
    private let discoveredSlugsKey = "LayoutPreloader_DiscoveredSlugs"

    /// UserDefaults key to track if first-launch prefetch completed
    private let firstLaunchCompleteKey = "LayoutPreloader_FirstLaunchComplete"

    private init() {}

    /// Whether this is the very first launch (no cache populated yet)
    var isFirstLaunch: Bool {
        !UserDefaults.standard.bool(forKey: firstLaunchCompleteKey)
    }

    // MARK: - Public API

    /// First-launch: download all headers + pages from network, save to disk & memory.
    /// Called when no cache exists. Updates SDUILayoutStore on completion.
    func prefetchAll() async {
        let startTime = CFAbsoluteTimeGetCurrent()
        AppLogger.debug(
            "[LayoutPreloader] First launch — prefetching all \(Self.allHeaderSlugs.count) headers + \(Self.allPageSlugs.count) pages..."
        )

        let allSlugs = Self.allHeaderSlugs + Self.allPageSlugs

        await withTaskGroup(of: Void.self) { group in
            for slug in allSlugs {
                group.addTask {
                    await self.fetchAndCache(slug: slug)
                }
            }
        }

        // Mark first launch complete
        UserDefaults.standard.set(true, forKey: firstLaunchCompleteKey)

        let elapsed = (CFAbsoluteTimeGetCurrent() - startTime) * 1000
        AppLogger.debug(
            "[LayoutPreloader] Prefetch complete: \(SDUILayoutStore.shared.layouts.count) layouts in \(String(format: "%.0f", elapsed))ms"
        )
    }

    /// Preload SDUI JSON for specific important screens.
    /// Call this at app startup to warm the cache for key screens.
    ///
    /// Example:
    /// ```
    /// LayoutPreloader.shared.preloadScreens(keys: ["home", "fashion", "beauty", "for-you"])
    /// ```
    func preloadScreens(keys: [String]) async {
        guard NetworkMonitor.shared.isConnected else {
            AppLogger.debug("[LayoutPreloader] Offline — skipping preload for \(keys.count) screens")
            return
        }

        AppLogger.debug("[LayoutPreloader] Preloading \(keys.count) screens: \(keys.joined(separator: ", "))")

        await withTaskGroup(of: Void.self) { group in
            for key in keys {
                group.addTask {
                    await self.fetchAndCache(slug: key)
                }
            }
        }

        AppLogger.debug("[LayoutPreloader] Preload complete for \(keys.count) screens")
    }

    /// Background refresh for stale layouts (subsequent launches)
    func refreshStaleInBackground() {
        Task(priority: .utility) {
            // Skip if offline
            guard NetworkMonitor.shared.isConnected else {
                AppLogger.debug("[LayoutPreloader] Offline — skipping stale refresh")
                return
            }

            let staleSlugs = await MainActor.run {
                SDUILayoutStore.shared.staleFlags.filter { $0.value }.map { $0.key }
            }

            guard !staleSlugs.isEmpty else {
                AppLogger.debug("[LayoutPreloader] No stale layouts to refresh")
                return
            }

            AppLogger.debug("[LayoutPreloader] Refreshing \(staleSlugs.count) stale layouts in background")

            for slug in staleSlugs {
                Task.detached(priority: .utility) {
                    await self.fetchAndCache(slug: slug)
                }
            }
        }
    }

    /// Register a slug as successfully cached
    func registerCachedSlug(_ slug: String) {
        var discovered = UserDefaults.standard.stringArray(forKey: discoveredSlugsKey) ?? []
        if !discovered.contains(slug) {
            discovered.append(slug)
            UserDefaults.standard.set(discovered, forKey: discoveredSlugsKey)
        }
    }

    // MARK: - Private

    private func fetchAndCache(slug: String) async {
        // Skip network fetch if offline
        guard NetworkMonitor.shared.isConnected else {
            AppLogger.debug("[LayoutPreloader] Offline — skipping fetch for \(slug)")
            return
        }

        do {
            guard
                let response = try await APIService.shared.fetchLayout(
                    slug: slug, forceRefresh: true)
            else { return }

            // Encode components to raw JSON for caching
            guard let rawData = try? JSONEncoder().encode(response.components) else { return }

            // Check if content actually changed (avoid unnecessary UI updates)
            let changed = await SDUICacheManager.shared.hasContentChanged(
                key: slug, newData: rawData)

            // Save to both memory + disk via unified cache manager
            await SDUICacheManager.shared.saveSDUI(key: slug, jsonData: rawData)

            // Update in-memory layout store (only if changed, to avoid SwiftUI diff churn)
            if changed {
                await MainActor.run {
                    SDUILayoutStore.shared.layouts[slug] = response
                    SDUILayoutStore.shared.staleFlags[slug] = false
                    SDUILayoutStore.shared.lastFetchTime[slug] = Date()
                }
            } else {
                await MainActor.run {
                    SDUILayoutStore.shared.staleFlags[slug] = false
                    SDUILayoutStore.shared.lastFetchTime[slug] = Date()
                }
            }

            registerCachedSlug(slug)
            AppLogger.debug("[LayoutPreloader] Fetched + cached: \(slug) (changed: \(changed))")

        } catch {
            AppLogger.debug("[LayoutPreloader] Failed to fetch \(slug): \(error.localizedDescription)")
        }
    }
}
