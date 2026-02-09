import Combine
import SwiftUI

struct HeroBannerView: View {
    // Model matching the API response structure
    // Model matching the API response structure
    struct BannerData: Decodable, Identifiable {
        let id: String
        let image: String
        let actionUrl: String?
        // Optional/Ignored fields
        let title: String?
        let subtitle: String?
        let backgroundColor: String?
    }

    // Props passed from SDUIComponentView
    var bannersCallback: (() -> [BannerData])?

    @State private var banners: [BannerData] = []
    @State private var isLoading = true
    @State private var selection = 0

    @EnvironmentObject var navigationManager: NavigationManager

    // Timer for auto-scroll check (1s interval)
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    // Track time since last manual interaction
    @State private var timeSinceLastInteraction: TimeInterval = 0

    var body: some View {
        VStack {
            if isLoading {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
                    .frame(height: 200)
                    .overlay(ProgressView())
            } else if !banners.isEmpty {
                VStack(spacing: 2) {
                    TabView(selection: $selection) {
                        ForEach(0..<banners.count, id: \.self) { index in
                            let banner = banners[index]
                            Button(action: {
                                if let action = banner.actionUrl {
                                    print("Navigate to: \(action)")
                                    navigationManager.navigate(to: action)
                                }
                            }) {
                                HeroBannerCard(banner: banner)
                                    .padding(.vertical, 8)  // Space for shadow
                            }
                            .tag(index)
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                    .frame(height: 200)
                    .simultaneousGesture(
                        DragGesture().onChanged { _ in
                            // Pause timer on interaction
                            self.timeSinceLastInteraction = 0
                        }
                    )

                    // Custom Page Indicator - positioned below the slider
                    HStack(spacing: 6) {
                        ForEach(0..<banners.count, id: \.self) { index in
                            if selection == index {
                                // Active indicator - dark capsule
                                Capsule()
                                    .fill(Color(white: 0.2))
                                    .frame(width: 24, height: 6)
                            } else {
                                // Inactive indicator - light gray circle
                                Circle()
                                    .fill(Color.gray.opacity(0.35))
                                    .frame(width: 6, height: 6)
                            }
                        }
                    }
                    .animation(.easeInOut(duration: 0.2), value: selection)
                }
                .onReceive(timer) { _ in
                    // Increment time since last interaction
                    timeSinceLastInteraction += 1

                    // Auto-scroll if 5 seconds have passed since last interaction
                    if timeSinceLastInteraction >= 5 {
                        withAnimation {
                            selection = (selection + 1) % banners.count
                        }
                        timeSinceLastInteraction = 0
                    }
                }
            }
        }
        .padding(.horizontal, 16)  // Even left/right spacing applied to container
        .onAppear {
            if let callback = bannersCallback {
                self.banners = callback()
                self.isLoading = false
            } else {
                self.isLoading = false
            }
        }
    }
}

struct HeroBannerCard: View {
    let banner: HeroBannerView.BannerData

    var body: some View {
        if let url = URL(string: banner.image) {
            AsyncImage(url: url) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }
}
