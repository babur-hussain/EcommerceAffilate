import AVKit
import SwiftUI

struct StoryView: View {
    let story: Story
    let onComplete: () -> Void

    @State private var progress: Double = 0.0
    @State private var isAnimating = false

    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            GeometryReader { geometry in
                // Media Content
                if story.mediaType == .video {
                    // Use AVPlayer for video
                    if let url = resolveMediaURL(story.mediaUrl) {
                        VideoPlayerView(url: url)
                    }
                } else {
                    // Image with progress bar
                    CachedAsyncImage(url: resolveMediaURL(story.mediaUrl)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: geometry.size.width, height: geometry.size.height)
                    } placeholder: {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    }
                }

                // Progress Bar (Top)
                VStack {
                    // Custom Linear Progress Bar for smoothness
                    GeometryReader { proxy in
                        ZStack(alignment: .leading) {
                            Capsule()
                                .fill(Color.white.opacity(0.3))
                                .frame(height: 4)

                            Capsule()
                                .fill(Color.white)
                                .frame(width: proxy.size.width * progress, height: 4)
                                .animation(
                                    .linear(duration: isAnimating ? (story.duration ?? 5.0) : 0),
                                    value: progress)
                        }
                    }
                    .frame(height: 4)
                    .padding(.top, 50)
                    .padding(.horizontal)

                    HStack {
                        // User Info
                        // Use CachedAsyncImage for profile too
                        CachedAsyncImage(url: resolveMediaURL(story.userProfileImage)) { image in
                            image.resizable().clipShape(Circle())
                        } placeholder: {
                            Circle().fill(Color.gray)
                        }
                        .frame(width: 32, height: 32)

                        Text(story.userName)
                            .font(.headline)
                            .foregroundColor(.white)

                        Text(timeAgoDisplay(dateString: story.createdAt))
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.8))

                        Spacer()

                        Button(action: onComplete) {
                            Image(systemName: "xmark")
                                .foregroundColor(.white)
                                .padding()
                        }
                    }
                    .padding(.horizontal)

                    Spacer()
                }
            }
        }
        .onAppear {
            startStory()
        }
    }

    private func startStory() {
        isAnimating = true
        // Delay slightly to allow view to appear before animating
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            progress = 1.0
        }

        let duration = story.duration ?? 5.0
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            onComplete()
        }
    }

    private func resolveMediaURL(_ urlString: String?) -> URL? {
        guard let urlString = urlString, !urlString.isEmpty else {
            AppLogger.warning("StoryView: Empty URL string")
            return nil
        }

        var finalURL: URL?

        // If it's already a full URL
        if urlString.lowercased().hasPrefix("http") {
            finalURL = URL(string: urlString)
        } else {
            // Otherwise prepend imageHost
            let baseUrl = APIService.shared.imageHost
            let safeBase = baseUrl.hasSuffix("/") ? String(baseUrl.dropLast()) : baseUrl
            let safePath = urlString.hasPrefix("/") ? urlString : "/" + urlString
            finalURL = URL(string: safeBase + safePath)
        }

        if let url = finalURL {
            // AppLogger.debug("StoryView: Resolved URL: \(url.absoluteString)")
            return url
        }

        // Fallback: Try encoding if creation failed (e.g. spaces)
        if finalURL == nil {
            // Re-construct string to encode
            let baseUrl = APIService.shared.imageHost
            let safeBase = baseUrl.hasSuffix("/") ? String(baseUrl.dropLast()) : baseUrl
            let safePath = urlString.hasPrefix("/") ? urlString : "/" + urlString
            let fullString =
                urlString.lowercased().hasPrefix("http") ? urlString : (safeBase + safePath)

            if let encoded = fullString.addingPercentEncoding(
                withAllowedCharacters: .urlQueryAllowed)
            {
                finalURL = URL(string: encoded)
                AppLogger.debug("StoryView: Encoded URL to: \(encoded)")
            }
        }

        return finalURL
    }

    func timeAgoDisplay(dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = formatter.date(from: dateString) else { return "" }

        let formatter2 = RelativeDateTimeFormatter()
        formatter2.unitsStyle = .abbreviated
        return formatter2.localizedString(for: date, relativeTo: Date())
    }
}

struct VideoPlayerView: UIViewControllerRepresentable {
    let url: URL

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        let player = AVPlayer(url: url)
        controller.player = player
        player.play()
        controller.showsPlaybackControls = false
        controller.videoGravity = .resizeAspect
        return controller
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {}
}
