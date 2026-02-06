import SwiftUI

struct SubCategorySliderView: View {
    let parentCategoryId: String

    @State private var subCategories: [SubCategory] = []
    @State private var isLoading = true

    let rows = [
        GridItem(.fixed(100), spacing: 16),
        GridItem(.fixed(100), spacing: 16),
    ]

    var body: some View {
        VStack(alignment: .leading) {
            if isLoading {
                ProgressView()
                    .frame(height: 200)
            } else if !subCategories.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHGrid(rows: rows, spacing: 12) {
                        ForEach(subCategories, id: \.id) { sub in
                            SubCategoryCell(sub: sub)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)  // Add vertical padding inside scroll for shadow/spacing
                }
                .frame(height: 230)
                .padding(.top, 10)  // Add spacing above the slider
            }
        }
        .task {
            await fetchSubCategories()
        }
    }

    private func fetchSubCategories() async {
        let maxRetries = 3

        for attempt in 0..<maxRetries {
            do {
                // Check if task is cancelled before attempting
                try Task.checkCancellation()

                self.subCategories = try await APIService.shared.fetchSubCategories(
                    parentId: parentCategoryId)
                self.isLoading = false
                return  // Success - exit the function
            } catch is CancellationError {
                // Task was cancelled (e.g., view disappeared) - don't retry, just exit
                return
            } catch let error as NSError
                where error.domain == NSURLErrorDomain && error.code == -999
            {
                // Request was cancelled - wait briefly and retry
                if attempt < maxRetries - 1 {
                    try? await Task.sleep(nanoseconds: UInt64(100_000_000 * (attempt + 1)))  // 100ms * attempt
                }
            } catch {
                // Other errors - retry with exponential backoff
                print("Error loading subcategories (attempt \(attempt + 1)): \(error)")
                if attempt < maxRetries - 1 {
                    try? await Task.sleep(nanoseconds: UInt64(500_000_000 * (attempt + 1)))  // 500ms * attempt
                }
            }
        }

        // All retries failed - stop loading but don't show error (component just won't appear)
        self.isLoading = false
    }
}

struct SubCategoryCell: View {
    let sub: SubCategory

    var body: some View {
        Button(action: {
            print("Navigate to sub-category: \(sub.name)")
        }) {
            VStack(spacing: 6) {
                // Icon Container
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.white)
                        .frame(width: 70, height: 70)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                        )

                    if let url = URL(string: sub.image ?? sub.icon ?? "") {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color.gray.opacity(0.1)
                        }
                        .frame(width: 70, height: 70)
                        .clipShape(RoundedRectangle(cornerRadius: 12))  // Ensure radius clips content
                    }
                }

                Text(sub.name)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "#374151"))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .frame(width: 80)
            }
        }
    }
}
