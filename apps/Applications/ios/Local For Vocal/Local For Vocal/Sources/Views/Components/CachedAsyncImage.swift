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

        // URL SANITIZATION: Strict PNG Enforcement for placehold.co
        if originalString.contains("placehold.co")
            && !originalString.contains(".png")
            && !originalString.contains("/png")
        {
            if var components = URLComponents(url: url, resolvingAgainstBaseURL: true) {
                if !components.path.hasSuffix(".png") {
                    components.path += ".png"
                }
                if let newURL = components.url {
                    finalURL = newURL
                }
            }
        }

        let urlString = finalURL.absoluteString

        // --- LAYER 1: Check persistent ImageDiskCache (survives app restarts) ---
        Task {
            if let diskImage = await ImageDiskCache.shared.loadImage(for: urlString) {
                await MainActor.run {
                    self.image = diskImage
                }
                return
            }

            // --- LAYER 2: Check URLCache (system-managed, may evict) ---
            let request = URLRequest(
                url: finalURL, cachePolicy: .returnCacheDataElseLoad, timeoutInterval: 60)

            if let cachedResponse = APIService.shared.session.configuration.urlCache?
                .cachedResponse(
                    for: request),
                let cachedImage = UIImage(data: cachedResponse.data)
            {
                await MainActor.run {
                    self.image = cachedImage
                }
                // Also save to disk cache for persistence
                await ImageDiskCache.shared.saveData(cachedResponse.data, for: urlString)
                return
            }

            // --- LAYER 3: Check if offline → show placeholder ---
            let isOnline = await MainActor.run { NetworkMonitor.shared.isConnected }
            if !isOnline {
                await MainActor.run {
                    self.hasError = true
                }
                return
            }

            // --- LAYER 4: Download from network ---
            await MainActor.run {
                self.isLoading = true
            }

            self.cancellable = APIService.shared.session.dataTaskPublisher(for: request)
                .tryMap { data, response -> UIImage in
                    if let httpResponse = response as? HTTPURLResponse {
                        if httpResponse.statusCode != 200 {
                            throw URLError(.badServerResponse)
                        }
                    }

                    if let uiImage = UIImage(data: data) {
                        // Save to persistent disk cache in background
                        Task.detached(priority: .utility) {
                            await ImageDiskCache.shared.saveData(data, for: urlString)
                        }
                        return uiImage
                    }

                    throw URLError(.cannotDecodeContentData)
                }
                .receive(on: DispatchQueue.main)
                .sink(
                    receiveCompletion: { [weak self] completion in
                        self?.isLoading = false
                        if case .failure = completion {
                            self?.hasError = true
                        }
                    },
                    receiveValue: { [weak self] downloadedImage in
                        self?.image = downloadedImage
                    }
                )
        }
    }
}
