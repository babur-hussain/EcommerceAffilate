import SwiftUI

struct ContentView: View {
    private let api = APIService.shared
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var errorMessage: String?
    
    // Default slug to load
    let slug: String = "for-you"
    
    // Header States
    @State private var activeTab: TabType = .shopping
    @State private var selectedCategory: String = "For You"
    
    var body: some View {
        Group {
            if isLoading {
                ProgressView("Loading...")
            } else if let error = errorMessage {
                VStack {
                    Text("Error loading layout")
                        .font(.headline)
                    Text(error)
                        .font(.caption)
                        .foregroundColor(.gray)
                    Button("Retry") {
                        loadLayout()
                    }
                    .padding()
                }
            } else if let components = layout?.components {
                ZStack {
                    // Layer 1: Global Background
                    Color(hex: "#F9FAFB").ignoresSafeArea()
                    
                    // Layer 2: Main Content Structure
                    // Layer 2: Main Content Structure
                    NavigationView {
                            // Scrollable Content with Sticky Header
                            ScrollView {
                                LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                                    // Part 1: Top Header (Scrolls away)
                                    HomeTopHeaderView(activeTab: $activeTab)
                                        // Removed manual padding, relying on ScrollView's natural safe area handling
                                    
                                    // Part 2: Sticky Header and Content
                                    Section(header: HomeStickyHeaderView(selectedCategory: $selectedCategory)) {
                                        // Content
                                        ForEach(components) { component in
                                            SDUIComponentView(component: component)
                                        }
                                    }
                                }
                            }
                            .background(Color(hex: "#F9FAFB"))
                            // Removed .edgesIgnoringSafeArea(.top) to prevent overlap with notch
                            .navigationBarHidden(true) // Correct placement: Inside NavigationView
                        }
                        .background(Color(hex: "#c21500")) // Status Bar Background
                        .ignoresSafeArea(edges: .top) // Fills the status bar area
                }
            } else {
                Text("No layout found")
            }
        }
        .onAppear {
            loadLayout()
        }
    }
    
    private func loadLayout() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let response = try await api.fetchLayout(slug: slug)
                DispatchQueue.main.async {
                    self.layout = response
                    self.isLoading = false
                }
            } catch {
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
}
