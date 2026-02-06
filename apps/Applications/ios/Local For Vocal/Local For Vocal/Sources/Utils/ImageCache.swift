import Combine
import SwiftUI

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

    private var cancellable: AnyCancellable?
    private let url: URL?

    init(url: URL?) {
        self.url = url
    }

    func load() {
        guard let url = url else { return }
        let urlString = url.absoluteString

        // Check Cache
        if let cachedImage = ImageCache.shared.get(forKey: urlString) {
            self.image = cachedImage
            return
        }

        isLoading = true

        cancellable = URLSession.shared.dataTaskPublisher(for: url)
            .map { UIImage(data: $0.data) }
            .replaceError(with: nil)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] downloadedImage in
                self?.isLoading = false
                if let image = downloadedImage {
                    ImageCache.shared.set(image, forKey: urlString)
                    self?.image = image
                }
            }
    }

    func cancel() {
        cancellable?.cancel()
    }
}
