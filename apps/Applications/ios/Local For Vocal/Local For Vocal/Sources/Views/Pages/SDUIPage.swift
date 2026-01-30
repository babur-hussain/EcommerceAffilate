import SwiftUI

struct SDUIPage: View {
    let slug: String
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var errorMessage: String?

    var body: some View {
        Group {
            if isLoading {
                VStack {
                    ProgressView()
                        .padding()
                    Text("Loading \(slug)...")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, minHeight: 200)
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
        do {
            let response = try await APIService.shared.fetchLayout(slug: slug)
            await MainActor.run {
                self.layout = response
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.errorMessage = error.localizedDescription
                self.isLoading = false
            }
        }
    }
}
