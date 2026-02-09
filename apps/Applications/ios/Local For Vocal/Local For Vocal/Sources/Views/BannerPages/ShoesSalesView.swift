import SwiftUI

struct ShoesSalesView: View {
    @State private var components: [SDUIComponent] = []
    @State private var isLoading = true
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                if components.isEmpty {
                    // Loading state
                    GeometryReader { geo in
                        ZStack {
                            Color.white.ignoresSafeArea()
                            ProgressView()
                        }
                        .frame(width: geo.size.width, height: geo.size.height)
                    }
                } else {
                    ForEach(components, id: \.id) { component in
                        SDUIComponentView(component: component)
                    }
                }
            }
        }
        .background(Color.white)
        .ignoresSafeArea()
        .navigationBarHidden(true)
        .onAppear {
            loadData()
        }
    }

    private func loadData() {
        print("Loading Shoes Sales SDUI Data from API...")
        isLoading = true

        Task {
            do {
                if let layout = try await APIService.shared.fetchLayout(slug: "footwear-collection")
                {
                    await MainActor.run {
                        self.components = layout.components
                        self.isLoading = false
                        print(
                            "Successfully loaded \(layout.components.count) components for Shoes Sales"
                        )
                    }
                } else {
                    print("No layout found for shoes-sales")
                    await MainActor.run { self.isLoading = false }
                }
            } catch {
                print("Error loading Shoes SDUI: \(error)")
                await MainActor.run { self.isLoading = false }
            }
        }
    }
}

struct ShoesSalesView_Previews: PreviewProvider {
    static var previews: some View {
        ShoesSalesView()
    }
}
