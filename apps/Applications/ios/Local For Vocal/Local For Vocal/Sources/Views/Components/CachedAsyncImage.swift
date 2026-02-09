import Combine
import SwiftUI
import UIKit

struct CachedAsyncImage<Content: View, Placeholder: View>: View {
    let url: URL?
    let content: (Image) -> Content
    let placeholder: () -> Placeholder

    @StateObject private var loader = ImageLoaderObservable()

    init(
        url: URL?,
        @ViewBuilder content: @escaping (Image) -> Content,
        @ViewBuilder placeholder: @escaping () -> Placeholder
    ) {
        self.url = url
        self.content = content
        self.placeholder = placeholder
    }

    var body: some View {
        Group {
            if let image = loader.image {
                content(Image(uiImage: image))
            } else if loader.hasError {
                // Show a fallback for failed images
                ZStack {
                    Color(hex: "#F3F4F6")
                    Image(systemName: "photo")
                        .font(.system(size: 40))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                }
            } else {
                placeholder()
            }
        }
        .onAppear {
            loader.load(url: url)
        }
        .onChange(of: url) { newURL in
            loader.load(url: newURL)
        }
    }
}

// Observable wrapper that can reload with new URLs
class ImageLoaderObservable: ObservableObject {
    @Published var image: UIImage?
    @Published var isLoading = false
    @Published var hasError = false

    private var cancellable: AnyCancellable?
    private var currentURL: URL?

    func load(url: URL?) {
        guard url != currentURL else { return }

        // Reset state
        self.image = nil
        self.hasError = false
        self.currentURL = url

        guard let url = url else {
            hasError = true
            return
        }

        let originalString = url.absoluteString
        var finalURL = url

        // ---------------------------------------------------------
        // URL SANITIZATION: Strict PNG Enforcement for placehold.co
        // ---------------------------------------------------------
        // Problem: placehold.co returns SVG by default. iOS UIImage cannot decode SVG.
        // Solution: Force .png extension to request a raster image.
        // Fix: Append .png to the END of the path, not mid-path.
        if originalString.contains("placehold.co")
            && !originalString.contains(".png")
            && !originalString.contains("/png")
        {
            if var components = URLComponents(url: url, resolvingAgainstBaseURL: true) {
                // Check if path already ends in .png (sanity check)
                if !components.path.hasSuffix(".png") {
                    components.path += ".png"
                }

                if let newURL = components.url {
                    finalURL = newURL
                    AppLogger.debug(
                        "🔧 Enforced PNG (Correct Path) for placehold.co: \(newURL.absoluteString)")
                }
            }
        }

        let urlString = finalURL.absoluteString

        // Check URLCache (Disk + Memory) via APIService session
        let request = URLRequest(
            url: finalURL, cachePolicy: .returnCacheDataElseLoad, timeoutInterval: 60)

        if let cachedResponse = APIService.shared.session.configuration.urlCache?.cachedResponse(
            for: request),
            let cachedImage = UIImage(data: cachedResponse.data)
        {
            AppLogger.debug("📦 Image found in URLCache: \(urlString)")
            self.image = cachedImage
            return
        }

        isLoading = true

        cancellable = APIService.shared.session.dataTaskPublisher(for: request)
            .tryMap { data, response -> UIImage in
                if let httpResponse = response as? HTTPURLResponse {
                    let contentType =
                        httpResponse.value(forHTTPHeaderField: "Content-Type") ?? "unknown"
                    /*AppLogger.debug(
                        "Image response: status=\(httpResponse.statusCode), type=\(contentType), size=\(data.count), url=\(urlString)"
                    )*/

                    if httpResponse.statusCode != 200 {
                        throw URLError(.badServerResponse)
                    }
                }

                if let uiImage = UIImage(data: data) {
                    return uiImage
                }

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
                    self?.image = downloadedImage
                    // URLSession automatically caches the response based on policy, no manual set needed usually
                    // unless we want to force it. Configured session should handle it.
                    // AppLogger.debug("✅ Image loaded successfully: \(urlString)")
                }
            )
    }
}
