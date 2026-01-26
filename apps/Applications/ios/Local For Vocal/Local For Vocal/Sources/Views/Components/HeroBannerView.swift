import SwiftUI
import Combine

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
    
    // Timer for auto-scroll
    let timer = Timer.publish(every: 5, on: .main, in: .common).autoconnect()
    
    var body: some View {
        VStack {
            if isLoading {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
                    .frame(height: 200)
                    .overlay(ProgressView())
            } else if !banners.isEmpty {
                TabView(selection: $selection) {
                    ForEach(0..<banners.count, id: \.self) { index in
                        let banner = banners[index]
                        Button(action: {
                            if let action = banner.actionUrl {
                                print("Navigate to: \(action)")
                            }
                        }) {
                            HeroBannerCard(banner: banner)
                        }
                        .tag(index)
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .automatic))
                .frame(height: 200)
                .onReceive(timer) { _ in
                    withAnimation {
                        selection = (selection + 1) % banners.count
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
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
        ZStack {
            if let url = URL(string: banner.image) {
                AsyncImage(url: url) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color.gray.opacity(0.2)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.15), radius: 8, y: 4)
    }
}
