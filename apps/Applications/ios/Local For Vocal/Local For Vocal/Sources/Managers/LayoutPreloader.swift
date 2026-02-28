import Foundation

/// Handles prefetching all SDUI layouts (headers + pages) on first launch,
/// and background refresh of stale layouts on subsequent launches.
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
        print(
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
        print(
            "[LayoutPreloader] Prefetch complete: \(SDUILayoutStore.shared.layouts.count) layouts in \(String(format: "%.0f", elapsed))ms"
        )
    }

    /// Background refresh for stale layouts (subsequent launches)
    func refreshStaleInBackground() {
        Task(priority: .utility) {
            let staleSlugs = await MainActor.run {
                SDUILayoutStore.shared.staleFlags.filter { $0.value }.map { $0.key }
            }

            guard !staleSlugs.isEmpty else {
                print("[LayoutPreloader] No stale layouts to refresh")
                return
            }

            print("[LayoutPreloader] Refreshing \(staleSlugs.count) stale layouts in background")

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
        do {
            guard
                let response = try await APIService.shared.fetchLayout(
                    slug: slug, forceRefresh: true)
            else { return }

            await MainActor.run {
                SDUILayoutStore.shared.layouts[slug] = response
                SDUILayoutStore.shared.staleFlags[slug] = false
                SDUILayoutStore.shared.lastFetchTime[slug] = Date()
            }

            // Save to disk cache
            if let rawData = try? JSONEncoder().encode(response.components) {
                await SDUICacheManager.shared.saveRawJSON(rawData, slug: slug, userId: nil)
            }

            registerCachedSlug(slug)
            print("[LayoutPreloader] Fetched + cached: \(slug)")

        } catch {
            print("[LayoutPreloader] Failed to fetch \(slug): \(error.localizedDescription)")
        }
    }
}
