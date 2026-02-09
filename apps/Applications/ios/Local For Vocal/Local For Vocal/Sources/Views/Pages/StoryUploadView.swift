import AVFoundation
import PhotosUI
import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct StoryUploadView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject private var authManager = AuthManager.shared

    @State private var selectedItem: PhotosPickerItem?
    @State private var selectedImageData: Data?
    @State private var selectedVideoURL: URL?
    @State private var mediaType: MediaType = .none
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var uploadProgress: Double = 0
    @State private var isUploading = false
    @State private var statusMessage = ""

    private let maxVideoDuration: Double = 300  // 5 minutes in seconds

    enum MediaType {
        case none
        case image
        case video
    }

    var body: some View {
        NavigationView {
            ZStack {
                // Background
                Color(red: 18 / 255, green: 18 / 255, blue: 18 / 255)
                    .edgesIgnoringSafeArea(.all)

                VStack(spacing: 24) {
                    // Header
                    headerView

                    Spacer()

                    // Media Preview or Picker
                    if mediaType == .none {
                        mediaPickerView
                    } else {
                        mediaPreviewView
                    }

                    // Show stories list if no media selected (like Instagram tray)
                    if mediaType == .none && !myStories.isEmpty {
                        myStoriesList
                    }

                    Spacer()

                    // Action Buttons
                    if mediaType != .none {
                        actionButtons
                    }
                }
                .padding()

                // Loading Overlay
                if isLoading || isUploading {
                    loadingOverlay
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                Task {
                    await loadMyStories()
                }
            }
        }
        .navigationViewStyle(.stack)
        .alert("Error", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
    }

    // MARK: - Header
    private var headerView: some View {
        HStack {
            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
            }

            Spacer()

            Text("Add Story")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)

            Spacer()

            // Placeholder for symmetry
            Color.clear
                .frame(width: 44, height: 44)
        }
    }

    // MARK: - Media Picker
    private var mediaPickerView: some View {
        VStack(spacing: 32) {
            // Icon
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(red: 253 / 255, green: 29 / 255, blue: 29 / 255),
                                Color(red: 252 / 255, green: 176 / 255, blue: 69 / 255),
                                Color(red: 131 / 255, green: 58 / 255, blue: 180 / 255),
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "plus")
                    .font(.system(size: 40, weight: .medium))
                    .foregroundColor(.white)
            }

            Text("Share a Moment")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white)

            Text("Add photos or videos up to 5 minutes")
                .font(.system(size: 14))
                .foregroundColor(.gray)

            // Picker Button
            PhotosPicker(
                selection: $selectedItem,
                matching: .any(of: [.images, .videos]),
                photoLibrary: .shared()
            ) {
                HStack(spacing: 12) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 18))
                    Text("Choose from Gallery")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 32)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [
                            Color(red: 131 / 255, green: 58 / 255, blue: 180 / 255),
                            Color(red: 253 / 255, green: 29 / 255, blue: 29 / 255),
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(30)
            }
            .onChange(of: selectedItem) { newItem in
                Task {
                    await loadMedia(from: newItem)
                }
            }
        }
    }

    // MARK: - Media Preview
    private var mediaPreviewView: some View {
        VStack(spacing: 16) {
            if mediaType == .image, let imageData = selectedImageData,
                let uiImage = UIImage(data: imageData)
            {
                Image(uiImage: uiImage)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxHeight: 400)
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white.opacity(0.2), lineWidth: 1)
                    )
            } else if mediaType == .video, let videoURL = selectedVideoURL {
                VideoPreviewView(url: videoURL)
                    .frame(height: 400)
                    .cornerRadius(16)
            }

            // Change Media Button
            PhotosPicker(
                selection: $selectedItem,
                matching: .any(of: [.images, .videos]),
                photoLibrary: .shared()
            ) {
                HStack(spacing: 8) {
                    Image(systemName: "arrow.triangle.2.circlepath")
                        .font(.system(size: 14))
                    Text("Change")
                        .font(.system(size: 14, weight: .medium))
                }
                .foregroundColor(.white.opacity(0.8))
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.white.opacity(0.1))
                .cornerRadius(20)
            }
            .onChange(of: selectedItem) { newItem in
                Task {
                    await loadMedia(from: newItem)
                }
            }
        }
    }

    // MARK: - Action Buttons
    private var actionButtons: some View {
        VStack(spacing: 12) {
            // Upload Progress
            if isUploading {
                VStack(spacing: 8) {
                    ProgressView(value: uploadProgress)
                        .progressViewStyle(LinearProgressViewStyle(tint: .purple))
                    Text(
                        statusMessage.isEmpty
                            ? "Uploading... \(Int(uploadProgress * 100))%" : statusMessage
                    )
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                }
            }

            // Share Button
            Button(action: {
                Task {
                    await uploadStoryToS3()
                }
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 16))
                    Text("Share to Story")
                        .font(.system(size: 16, weight: .bold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [
                            Color(red: 131 / 255, green: 58 / 255, blue: 180 / 255),
                            Color(red: 253 / 255, green: 29 / 255, blue: 29 / 255),
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(30)
            }
            .disabled(isUploading)

            // Discard Button
            Button(action: {
                resetMedia()
            }) {
                Text("Discard")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.gray)
            }
        }
    }

    // MARK: - Loading Overlay
    private var loadingOverlay: some View {
        ZStack {
            Color.black.opacity(0.7)
                .edgesIgnoringSafeArea(.all)

            VStack(spacing: 16) {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.5)

                Text(
                    statusMessage.isEmpty
                        ? (isUploading ? "Uploading..." : "Loading...") : statusMessage
                )
                .font(.system(size: 14))
                .foregroundColor(.white)
            }
        }
    }

    // MARK: - Functions
    private func loadMedia(from item: PhotosPickerItem?) async {
        guard let item = item else { return }

        isLoading = true
        statusMessage = "Loading media..."

        // Try loading as video first
        if let videoData = try? await item.loadTransferable(type: VideoTransferable.self) {
            // Check video duration
            let asset = AVURLAsset(url: videoData.url)
            let duration = CMTimeGetSeconds(asset.duration)

            if duration > maxVideoDuration {
                await MainActor.run {
                    isLoading = false
                    statusMessage = ""
                    errorMessage =
                        "Video must be 5 minutes or less. Your video is \(Int(duration / 60)) minutes long."
                    showError = true
                    resetMedia()
                }
                return
            }

            await MainActor.run {
                selectedVideoURL = videoData.url
                mediaType = .video
                selectedImageData = nil
                isLoading = false
                statusMessage = ""
            }
        }
        // Try loading as image
        else if let imageData = try? await item.loadTransferable(type: Data.self) {
            await MainActor.run {
                selectedImageData = imageData
                mediaType = .image
                selectedVideoURL = nil
                isLoading = false
                statusMessage = ""
            }
        } else {
            await MainActor.run {
                isLoading = false
                statusMessage = ""
                errorMessage = "Could not load selected media"
                showError = true
            }
        }
    }

    private func resetMedia() {
        selectedItem = nil
        selectedImageData = nil
        selectedVideoURL = nil
        mediaType = .none
        uploadProgress = 0
        statusMessage = ""
    }

    // MARK: - S3 Upload
    private func uploadStoryToS3() async {
        guard authManager.isLoggedIn, let token = authManager.authToken else {
            await MainActor.run {
                errorMessage = "Please log in to upload stories"
                showError = true
            }
            return
        }

        await MainActor.run {
            isUploading = true
            uploadProgress = 0.1
            statusMessage = "Preparing upload..."
        }

        do {
            // Determine file details
            let fileName: String
            let contentType: String
            let mediaData: Data
            let mediaTypeStr: String

            if mediaType == .image, let imageData = selectedImageData {
                fileName = "story_\(Date().timeIntervalSince1970).jpg"
                contentType = "image/jpeg"
                mediaData = imageData
                mediaTypeStr = "image"
            } else if mediaType == .video, let videoURL = selectedVideoURL {
                fileName = "story_\(Date().timeIntervalSince1970).mov"
                contentType = "video/quicktime"
                mediaData = try Data(contentsOf: videoURL)
                mediaTypeStr = "video"
            } else {
                throw StoryUploadError.noMediaSelected
            }

            await MainActor.run {
                uploadProgress = 0.2
                statusMessage = "Getting upload URL..."
            }

            // Step 1: Get presigned URL from backend
            let presignedData = try await getPresignedUrl(
                fileName: fileName, contentType: contentType, token: token)

            await MainActor.run {
                uploadProgress = 0.3
                statusMessage = "Uploading to cloud..."
            }

            // Step 2: Upload to S3
            try await uploadToS3(
                url: presignedData.uploadUrl, data: mediaData, contentType: contentType)

            await MainActor.run {
                uploadProgress = 0.8
                statusMessage = "Saving story..."
            }

            // Step 3: Create story record in backend
            try await createStoryRecord(
                mediaUrl: presignedData.fileUrl, mediaType: mediaTypeStr, token: token)

            await MainActor.run {
                uploadProgress = 1.0
                statusMessage = "Done!"
                isUploading = false
                // presentationMode.wrappedValue.dismiss() // Don't dismiss, just reset to allow more uploads
                resetMedia()
                Task {
                    await loadMyStories()
                }
            }

        } catch {
            await MainActor.run {
                isUploading = false
                statusMessage = ""
                errorMessage = "Upload failed: \(error.localizedDescription)"
                showError = true
            }
        }
    }

    private func getPresignedUrl(fileName: String, contentType: String, token: String) async throws
        -> PresignedUrlResponse
    {
        let urlString =
            "\(APIService.shared.baseURL)/stories/upload-url?fileName=\(fileName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? fileName)&contentType=\(contentType.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? contentType)"

        guard let url = URL(string: urlString) else {
            throw StoryUploadError.invalidUrl
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw StoryUploadError.serverError
        }

        if httpResponse.statusCode != 200 {
            let responseBody = String(data: data, encoding: .utf8) ?? "No body"
            print(
                "❌ Upload URL Request Failed: Status \(httpResponse.statusCode), Body: \(responseBody)"
            )
            errorMessage = "Server Error: \(httpResponse.statusCode) - \(responseBody)"  // Temporarily show details in UI
            throw StoryUploadError.serverError
        }

        let decoded = try JSONDecoder().decode(PresignedUrlAPIResponse.self, from: data)
        return decoded.data
    }

    private func uploadToS3(url: String, data: Data, contentType: String) async throws {
        guard let uploadUrl = URL(string: url) else {
            throw StoryUploadError.invalidUrl
        }

        var request = URLRequest(url: uploadUrl)
        request.httpMethod = "PUT"
        request.setValue(contentType, forHTTPHeaderField: "Content-Type")
        request.httpBody = data

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw StoryUploadError.uploadFailed
        }
    }

    private func createStoryRecord(mediaUrl: String, mediaType: String, token: String) async throws
    {
        guard let url = URL(string: "\(APIService.shared.baseURL)/stories") else {
            throw StoryUploadError.invalidUrl
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "mediaUrl": mediaUrl,
            "mediaType": mediaType,
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode)
        else {
            throw StoryUploadError.storyCreationFailed
        }
    }

    // MARK: - My Stories
    @State private var myStories: [Story] = []
    @State private var selectedStory: Story? = nil

    private func loadMyStories() async {
        do {
            let stories = try await APIService.shared.fetchMyStories()
            await MainActor.run {
                self.myStories = stories
            }
        } catch {
            print("Failed to load my stories: \(error)")
        }
    }

    private var myStoriesList: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Your Stories")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    // Add New Button (Small version)
                    Button(action: {
                        resetMedia()
                    }) {
                        VStack {
                            ZStack {
                                Circle()
                                    .strokeBorder(Color.gray.opacity(0.5), lineWidth: 1)
                                    .background(Circle().fill(Color.white.opacity(0.1)))
                                    .frame(width: 60, height: 60)

                                Image(systemName: "plus")
                                    .foregroundColor(.white)
                            }
                            Text("Add")
                                .font(.system(size: 12))
                                .foregroundColor(.white)
                        }
                    }

                    ForEach(myStories) { story in
                        Button(action: {
                            selectedStory = story
                        }) {
                            VStack {
                                AsyncImage(
                                    url: resolveMediaURL(story.thumbnailUrl ?? story.mediaUrl)
                                ) {
                                    phase in
                                    switch phase {
                                    case .empty:
                                        Circle().fill(Color.gray.opacity(0.3))
                                    case .success(let image):
                                        image.resizable()
                                            .aspectRatio(contentMode: .fill)
                                            .clipShape(Circle())
                                    case .failure:
                                        Circle().fill(Color.red.opacity(0.3))
                                    @unknown default:
                                        EmptyView()
                                    }
                                }
                                .frame(width: 60, height: 60)
                                .overlay(
                                    Circle().stroke(
                                        LinearGradient(
                                            colors: [.purple, .orange],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        ), lineWidth: 2)
                                )

                                Text(timeAgoDisplay(dateString: story.createdAt))
                                    .font(.system(size: 10))
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
        .fullScreenCover(item: $selectedStory) { story in
            StoryView(story: story) {
                selectedStory = nil
            }
        }
    }

    private func resolveMediaURL(_ urlString: String?) -> URL? {
        guard let urlString = urlString, !urlString.isEmpty else { return nil }

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
            return url
        }

        // Fallback: Try encoding
        if finalURL == nil {
            let baseUrl = APIService.shared.imageHost
            let safeBase = baseUrl.hasSuffix("/") ? String(baseUrl.dropLast()) : baseUrl
            let safePath = urlString.hasPrefix("/") ? urlString : "/" + urlString
            let fullString =
                urlString.lowercased().hasPrefix("http") ? urlString : (safeBase + safePath)

            if let encoded = fullString.addingPercentEncoding(
                withAllowedCharacters: .urlQueryAllowed)
            {
                finalURL = URL(string: encoded)
                print("StoryUploadView: Encoded URL to: \(encoded)")
            }
        }

        return finalURL
    }

    // Simple helper for time ago
    func timeAgoDisplay(dateString: String) -> String {
        // ... (Implement time ago logic or use simple formatter)
        // For now just return "Just now" or implement properly
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = formatter.date(from: dateString) else { return "" }

        let formatter2 = RelativeDateTimeFormatter()
        formatter2.unitsStyle = .abbreviated
        return formatter2.localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Error Types
enum StoryUploadError: LocalizedError {
    case noMediaSelected
    case invalidUrl
    case serverError
    case uploadFailed
    case storyCreationFailed

    var errorDescription: String? {
        switch self {
        case .noMediaSelected: return "No media selected"
        case .invalidUrl: return "Invalid URL"
        case .serverError: return "Server error"
        case .uploadFailed: return "Upload to cloud failed"
        case .storyCreationFailed: return "Failed to save story"
        }
    }
}

// MARK: - API Response Types
struct PresignedUrlResponse: Decodable {
    let uploadUrl: String
    let fileUrl: String
    let key: String
}

struct PresignedUrlAPIResponse: Decodable {
    let success: Bool
    let data: PresignedUrlResponse
}

// MARK: - Video Transferable
struct VideoTransferable: Transferable {
    let url: URL

    static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(contentType: .movie) { video in
            SentTransferredFile(video.url)
        } importing: { received in
            let tempURL = FileManager.default.temporaryDirectory
                .appendingPathComponent(UUID().uuidString)
                .appendingPathExtension("mov")
            try FileManager.default.copyItem(at: received.file, to: tempURL)
            return VideoTransferable(url: tempURL)
        }
    }
}

// MARK: - Video Preview View
struct VideoPreviewView: View {
    let url: URL
    @State private var thumbnail: UIImage?

    var body: some View {
        ZStack {
            if let thumbnail = thumbnail {
                Image(uiImage: thumbnail)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .clipped()
            } else {
                Color.gray.opacity(0.3)
            }

            // Play icon overlay
            Image(systemName: "play.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(.white.opacity(0.9))
        }
        .onAppear {
            generateThumbnail()
        }
    }

    private func generateThumbnail() {
        let asset = AVURLAsset(url: url)
        let generator = AVAssetImageGenerator(asset: asset)
        generator.appliesPreferredTrackTransform = true

        let time = CMTime(seconds: 0, preferredTimescale: 600)

        Task {
            do {
                let cgImage = try await generator.image(at: time).image
                await MainActor.run {
                    thumbnail = UIImage(cgImage: cgImage)
                }
            } catch {
                print("Failed to generate thumbnail: \(error)")
            }
        }
    }
}

#Preview {
    StoryUploadView()
}
