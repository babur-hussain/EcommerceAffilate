import SwiftUI

struct ForYouBentoGridSDUI: View {
    let component: SDUIComponent
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        let items = component.decodeItems(for: "items", as: [BentoGridItem].self)

        // Calculate dynamic dimensions to match the requested container size
        // Left Card Container: 350x650 equivalent aspect ratio
        // Small Card Container: 350x325 equivalent aspect ratio

        let screenWidth = UIScreen.main.bounds.width
        let horizontalPadding: CGFloat = 32
        let spacing: CGFloat = 8
        let totalSpacing = spacing * 2
        let availableWidth = screenWidth - horizontalPadding - totalSpacing
        let columnWidth = availableWidth / 3

        // Container Heights
        let leftCardHeight = columnWidth * (650.0 / 350.0)
        let smallCardHeight = columnWidth * (325.0 / 350.0)

        HStack(alignment: .top, spacing: spacing) {
            // Column 1: Item 0 (Large Card)
            if items.indices.contains(0) {
                let item = items[0]
                Button(action: {
                    if let action = item.actionUrl {
                        navigationManager.navigate(to: action)
                    }
                }) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(item.subtitle ?? "")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.white.opacity(0.9))
                        Text(item.title)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.leading)

                        Spacer()

                        // Foreground Image
                        if let imageUrl = item.imageUrl {
                            CachedAsyncImage(url: URL(string: imageUrl)) { image in
                                image.resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                Image(systemName: "camera.fill")
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .foregroundColor(.white.opacity(0.5))
                            }
                            .frame(height: 120)
                            .frame(maxWidth: .infinity)
                            .padding(.bottom, 10)
                        }
                    }
                    .padding(12)
                    .frame(width: columnWidth, height: leftCardHeight)
                    .background(
                        Group {
                            if let bgImage = item.backgroundImage {
                                CachedAsyncImage(url: URL(string: bgImage)) { image in
                                    // Display ACTUAL size, no resizing/stretching
                                    image
                                } placeholder: {
                                    Color(hex: item.backgroundColor ?? "#F27121")
                                }
                                .frame(width: columnWidth, height: leftCardHeight)
                                .clipped()  // Clip to container bounds
                                .overlay(
                                    LinearGradient(
                                        gradient: Gradient(colors: [.black.opacity(0.3), .clear]),
                                        startPoint: .top,
                                        endPoint: .center
                                    )
                                )
                            } else if let colors = item.gradientColors {
                                LinearGradient(
                                    gradient: Gradient(colors: colors.map { Color(hex: $0) }),
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            } else {
                                Color(hex: item.backgroundColor ?? "#F27121")
                            }
                        }
                    )
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.15), radius: 5, y: 5)
                }
            }

            // Column 2: Items 1 & 2
            VStack(spacing: spacing) {
                if items.indices.contains(1) {
                    SmallGridCardSDUI(item: items[1], width: columnWidth, height: smallCardHeight)
                }
                if items.indices.contains(2) {
                    SmallGridCardSDUI(item: items[2], width: columnWidth, height: smallCardHeight)
                }
            }

            // Column 3: Items 3 & 4
            VStack(spacing: spacing) {
                if items.indices.contains(3) {
                    SmallGridCardSDUI(item: items[3], width: columnWidth, height: smallCardHeight)
                }
                if items.indices.contains(4) {
                    SmallGridCardSDUI(item: items[4], width: columnWidth, height: smallCardHeight)
                }
            }
        }
        .padding(.horizontal, 16)
    }
}

struct SmallGridCardSDUI: View {
    let item: BentoGridItem
    let width: CGFloat
    let height: CGFloat
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                navigationManager.navigate(to: action)
            }
        }) {
            ZStack(alignment: .top) {
                // Layer 2: Foreground Image (Bottom Aligned)
                VStack {
                    Spacer()
                    if let imageUrl = item.imageUrl {
                        CachedAsyncImage(url: URL(string: imageUrl)) { image in
                            image.resizable().aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Image(systemName: "bag.fill")  // Fallback
                                .font(.system(size: 30))
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .frame(height: 80)
                        .frame(maxWidth: .infinity)
                    }
                }

                // Layer 3: Text Content (Top Aligned)
                VStack {
                    Text(item.title)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .padding(.top, 8)
                        .padding(.horizontal, 4)

                    Spacer()
                }
            }
            .frame(width: width, height: height)
            .background(
                Group {
                    if let bgImage = item.backgroundImage {
                        CachedAsyncImage(url: URL(string: bgImage)) { image in
                            // Display ACTUAL size, no resizing/stretching
                            image
                        } placeholder: {
                            Color(hex: item.backgroundColor ?? "#2563EB")
                        }
                        .frame(width: width, height: height)
                        .clipped()  // Clip to container bounds
                        .overlay(
                            LinearGradient(
                                gradient: Gradient(colors: [.black.opacity(0.3), .clear]),
                                startPoint: .top,
                                endPoint: .center
                            )
                        )
                    } else if let colors = item.gradientColors {
                        LinearGradient(
                            gradient: Gradient(colors: colors.map { Color(hex: $0) }),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    } else {
                        Color(hex: item.backgroundColor ?? "#2563EB")
                    }
                }
            )
            .background(Color(hex: item.backgroundColor ?? "#2563EB"))  // Ultimate fallback
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.15), radius: 4, y: 4)
        }
    }
}

struct BentoGridItem: Decodable {
    let title: String
    let subtitle: String?
    let imageUrl: String?
    let backgroundImage: String?
    let actionUrl: String?
    let backgroundColor: String?
    let gradientColors: [String]?
    let icon: String?
}
