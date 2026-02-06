import Combine
import SwiftUI
import UIKit

class ImageCache {
    static let shared = ImageCache()

    private let cache = NSCache<NSString, UIImage>()

    private init() {
        cache.countLimit = 200  // Maximum number of objects
        cache.totalCostLimit = 1024 * 1024 * 100  // 100 MB
    }

    func get(forKey key: String) -> UIImage? {
        return cache.object(forKey: key as NSString)
    }

    func set(_ image: UIImage, forKey key: String) {
        cache.setObject(image, forKey: key as NSString)
    }
}

class ImageLoader: ObservableObject {
    @Published var image: UIImage?
    @Published var isLoading = false
    @Published var hasError = false

    private var cancellable: AnyCancellable?
    private let url: URL?
    private var hasLoaded = false

    init(url: URL?) {
        self.url = url
    }

    func load() {
        // Prevent duplicate loads
        guard !hasLoaded else { return }
        guard let url = url else {
            hasError = true
            return
        }

        let urlString = url.absoluteString

        // Check Cache
        if let cachedImage = ImageCache.shared.get(forKey: urlString) {
            self.image = cachedImage
            self.hasLoaded = true
            return
        }

        isLoading = true
        hasLoaded = true

        cancellable = URLSession.shared.dataTaskPublisher(for: url)
            .tryMap { data, response -> UIImage in
                // Log response details
                if let httpResponse = response as? HTTPURLResponse {
                    let contentType =
                        httpResponse.value(forHTTPHeaderField: "Content-Type") ?? "unknown"
                    AppLogger.debug(
                        "Image response: status=\(httpResponse.statusCode), contentType=\(contentType), dataSize=\(data.count) bytes, URL=\(urlString)"
                    )

                    if httpResponse.statusCode != 200 {
                        throw URLError(.badServerResponse)
                    }
                }

                // Try to create UIImage
                if let uiImage = UIImage(data: data) {
                    return uiImage
                }

                // Log first few bytes to debug format
                let prefix = data.prefix(20)
                let hexString = prefix.map { String(format: "%02x", $0) }.joined(separator: " ")
                AppLogger.error(
                    "Failed to decode image. Data size: \(data.count), first bytes: \(hexString), URL: \(urlString)"
                )

                throw URLError(.cannotDecodeContentData)
            }
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.hasError = true
                        AppLogger.error(
                            "Image load error: \(error.localizedDescription) for URL: \(urlString)")
                    }
                },
                receiveValue: { [weak self] downloadedImage in
                    ImageCache.shared.set(downloadedImage, forKey: urlString)
                    self?.image = downloadedImage
                    AppLogger.debug("✅ Image loaded successfully: \(urlString)")
                }
            )
    }

    func cancel() {
        // Don't cancel - let the image finish loading
        // This fixes issues with view updates causing cancellation
    }
}
