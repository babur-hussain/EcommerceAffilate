import Combine
import SwiftUI

struct ServicesPageView: View {
    @Binding var activeTab: TabType

    // Environment
    @Environment(\.presentationMode) var presentationMode

    // State
    @State private var layout: AdvancedLayoutResponse?
    @State private var isLoading = true
    @State private var errorMessage: String?

    @EnvironmentObject var locationManager: LocationManager

    // Gradient matching React Native: '#2BC0E4', '#EAECC6', '#FFFFFF'
    private let backgroundGradient = LinearGradient(
        gradient: Gradient(colors: [
            Color(hex: "#2BC0E4"),
            Color(hex: "#EAECC6"),
            Color(hex: "#FFFFFF"),
        ]),
        startPoint: .top,
        endPoint: .bottom
    )

    var body: some View {
        ZStack(alignment: .top) {
            // Background
            backgroundGradient
                .ignoresSafeArea()

            if isLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.5)
            } else if let components = layout?.components {
                // Main Content - scrollable
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Spacer for sticky header
                        Color.clear.frame(height: 160)

                        // Render SDUI components (skip service_header since we're using our own)
                        ForEach(components.indices, id: \.self) { index in
                            let component = components[index]
                            if component.type != .serviceHeader {
                                SDUIComponentView(component: component)
                            }
                        }
                    }
                }

            } else if let error = errorMessage {
                VStack {
                    Text("Failed to load services")
                    Text(error).font(.caption).foregroundColor(.red)
                    Button("Retry") {
                        loadLayout()
                    }
                }
            }

            // Sticky Header (stays on top)
            VStack(spacing: 0) {
                // Top Tabs (Shopping, Services, Grocery, Influencers)
                TopCategoryBoxesView(
                    activeTab: $activeTab,
                    activeBgColor: Color(hex: "#FFD700"),
                    inactiveBgColor: Color.white,
                    activeTextColor: Color(hex: "#111827"),
                    inactiveTextColor: Color(hex: "#111827")
                )

                // Location Row
                HStack {
                    HStack(spacing: 8) {
                        Image(systemName: "location.fill")
                            .foregroundColor(Color(hex: "#144bb8"))
                            .font(.system(size: 18))

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Location")
                                .font(.system(size: 10, weight: .regular))
                                .foregroundColor(Color(hex: "#6B7280"))
                            HStack(spacing: 4) {
                                Text(locationManager.address)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(Color(hex: "#111318"))
                                    .lineLimit(1)
                                Image(systemName: "chevron.down")
                                    .font(.system(size: 10, weight: .medium))
                                    .foregroundColor(Color(hex: "#111318"))
                            }
                        }
                    }

                    Spacer()

                    Button(action: {}) {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(Color(hex: "#4B5563"))
                    }
                    .frame(width: 40, height: 40)
                    .background(Color(hex: "#F3F4F6"))
                    .clipShape(Circle())
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .contentShape(Rectangle())  // Make full row content tappable
                .onTapGesture {
                    withAnimation {
                        locationManager.showAddressSelector = true
                    }
                }

                // Search Bar
                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(Color(hex: "#144bb8"))
                        .font(.system(size: 18, weight: .medium))
                    Text("What service do you need?")
                        .font(.system(size: 15, weight: .regular))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                    Spacer()
                }
                .padding(.horizontal, 16)
                .frame(height: 44)
                .background(Color.white)
                .cornerRadius(22)
                .overlay(
                    RoundedRectangle(cornerRadius: 22)
                        .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                )
                .padding(.horizontal, 16)
                .padding(.bottom, 12)
            }
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(hex: "#2BC0E4").opacity(0.95),
                        Color(hex: "#EAECC6").opacity(0.9),
                    ]),
                    startPoint: .top,
                    endPoint: .bottom
                )
            )

        }
        .onAppear {
            loadLayout()
        }
    }

    private func loadLayout() {
        Task {
            isLoading = true
            do {
                // Fetch layout for 'services' slug
                self.layout = try await APIService.shared.fetchLayout(slug: "services")
                self.isLoading = false
            } catch {
                AppLogger.error("Error loading services layout: \(error)")
                self.errorMessage = error.localizedDescription
                self.isLoading = false
            }
        }
    }
}
