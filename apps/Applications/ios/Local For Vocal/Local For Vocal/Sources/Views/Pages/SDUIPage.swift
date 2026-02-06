import SwiftUI

struct SDUIPage: View {
    let slug: String
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var errorMessage: String?

    var body: some View {
        Group {
            if isLoading {
                SDUIPageSkeleton()
            } else if let error = errorMessage {
                VStack {
                    Text("Error loading page")
                        .font(.headline)
                    Text(error)
                        .font(.caption)
                        .foregroundColor(.gray)
                    Button("Retry") {
                        Task { await loadLayout() }
                    }
                    .padding()
                }
                .frame(maxWidth: .infinity, minHeight: 200)
            } else if let components = layout?.components {
                ForEach(components) { component in
                    SDUIComponentView(component: component)
                }
            } else {
                Text("No content found")
                    .frame(maxWidth: .infinity, minHeight: 200)
            }
        }
        .task(id: slug) {
            await loadLayout()
        }
    }

    private func loadLayout() async {
        isLoading = true
        errorMessage = nil

        let maxRetries = 3
        var lastError: Error?

        for attempt in 0..<maxRetries {
            do {
                // Check if task is cancelled before attempting
                try Task.checkCancellation()

                let response = try await APIService.shared.fetchLayout(slug: slug)
                await MainActor.run {
                    self.layout = response
                    self.isLoading = false
                }
                return  // Success - exit the function
            } catch is CancellationError {
                // Task was cancelled (e.g., view disappeared) - don't retry
                return
            } catch let error as NSError
                where error.domain == NSURLErrorDomain && error.code == -999
            {
                // Request was cancelled - wait briefly and retry
                lastError = error
                if attempt < maxRetries - 1 {
                    try? await Task.sleep(nanoseconds: UInt64(100_000_000 * (attempt + 1)))  // 100ms * attempt
                }
            } catch {
                // Other errors - retry with exponential backoff
                lastError = error
                if attempt < maxRetries - 1 {
                    try? await Task.sleep(nanoseconds: UInt64(500_000_000 * (attempt + 1)))  // 500ms * attempt
                }
            }
        }

        // All retries failed
        await MainActor.run {
            self.errorMessage = lastError?.localizedDescription ?? "Unknown error"
            self.isLoading = false
        }
    }
}
