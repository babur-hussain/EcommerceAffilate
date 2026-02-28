import SwiftUI
import UIKit

// Fix #9 + #10: Pure async/await image loader — no Combine, no @StateObject per instance
struct CachedAsyncImage<Content: View, Placeholder: View>: View {
    let url: URL?
    let content: (Image) -> Content
    let placeholder: () -> Placeholder

    @State private var loadedImage: UIImage?
    @State private var hasError = false
    @State private var loadTask: Task<Void, Never>?

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
            if let image = loadedImage {
                content(Image(uiImage: image))
            } else if hasError {
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
            startLoad(url: url)
        }
        .onChange(of: url) { _, newURL in
            startLoad(url: newURL)
        }
        .onDisappear {
            loadTask?.cancel()
        }
    }

    private func startLoad(url: URL?) {
        // Cancel previous task
        loadTask?.cancel()
        loadedImage = nil
        hasError = false

        guard let url = url else {
            hasError = true
            return
        }

        var finalURL = url
        let originalString = url.absoluteString

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

        loadTask = Task {
            // Layer 1: Check persistent ImageDiskCache
            if let diskImage = await ImageDiskCache.shared.loadImage(for: urlString) {
                guard !Task.isCancelled else { return }
                await MainActor.run { self.loadedImage = diskImage }
                return
            }

            // Layer 2: Check URLCache
            let request = URLRequest(
                url: finalURL, cachePolicy: .returnCacheDataElseLoad, timeoutInterval: 60)

            if let cachedResponse = APIService.shared.session.configuration.urlCache?
                .cachedResponse(for: request),
                let cachedImage = UIImage(data: cachedResponse.data)
            {
                guard !Task.isCancelled else { return }
                await MainActor.run { self.loadedImage = cachedImage }
                await ImageDiskCache.shared.saveData(cachedResponse.data, for: urlString)
                return
            }

            // Layer 3: Check if offline
            let isOnline = await MainActor.run { NetworkMonitor.shared.isConnected }
            if !isOnline {
                guard !Task.isCancelled else { return }
                await MainActor.run { self.hasError = true }
                return
            }

            // Layer 4: Download
            do {
                let (data, response) = try await APIService.shared.session.data(for: request)
                guard !Task.isCancelled else { return }

                guard let httpResponse = response as? HTTPURLResponse,
                    httpResponse.statusCode == 200,
                    let image = UIImage(data: data)
                else {
                    await MainActor.run { self.hasError = true }
                    return
                }

                // Save to cache
                Task.detached(priority: .utility) {
                    await ImageDiskCache.shared.saveData(data, for: urlString)
                }

                await MainActor.run { self.loadedImage = image }
            } catch {
                guard !Task.isCancelled else { return }
                await MainActor.run { self.hasError = true }
            }
        }
    }
}
