import SwiftUI

struct UpcomingLaunchesView: View {
    var title: String = "Upcoming Launches"
    var headerActionUrl: String?
    var items: [LaunchBanner] = []

    struct LaunchBanner: Identifiable, Decodable {
        let id: String
        let image: String
        let actionUrl: String?
        
        var safeId: String { id }
    }

    @State private var currentIndex = 0

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    AppLogger.debug("Navigate to: \(action)")
                }
            }) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.black)
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.horizontal, 16)

            // Banner Carousel
            if !items.isEmpty {
                VStack(spacing: 12) {
                    TabView(selection: $currentIndex) {
                        ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                            Button(action: {
                                if let url = item.actionUrl {
                                    AppLogger.debug("Navigate to: \(url)")
                                }
                            }) {
                                CachedAsyncImage(url: URL(string: item.image)) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Color.gray.opacity(0.1)
                                }
                                .cornerRadius(16)
                                .clipped()
                                .padding(.horizontal, 16)
                            }
                            .buttonStyle(PlainButtonStyle())
                            .tag(index)
                        }
                    }
                    .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                    .frame(height: 200)

                    // Custom Paging Dots
                    HStack(spacing: 6) {
                        ForEach(0..<items.count, id: \.self) { index in
                            if currentIndex == index {
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(Color.black)
                                    .frame(width: 24, height: 4)
                            } else {
                                Circle()
                                    .fill(Color.gray.opacity(0.4))
                                    .frame(width: 6, height: 6)
                            }
                        }
                    }
                }
            }
        }
        .padding(.top, 32)
        .padding(.bottom, 16)
        .background(Color.white)
    }
}
