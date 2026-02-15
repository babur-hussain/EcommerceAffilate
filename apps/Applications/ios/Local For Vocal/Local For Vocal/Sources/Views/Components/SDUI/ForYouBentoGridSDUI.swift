import SwiftUI

struct ForYouBentoGridSDUI: View {
    let component: SDUIComponent
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        let items = component.decodeItems(for: "items", as: [BentoGridItem].self)

        // We expect exactly 3 main items for this specific layout
        // Item 0: Big Left Card (Adult Money Corner)
        // Item 1: Top Right Card (Shopping)
        // Item 2: Top Right Card (Grocery) - Wait, the design has 2 columns.
        // Let's look at the reference implementation in ForYouHomeHeaderTheme.swift
        // It has 3 columns effectively:
        // Col 1: Large Vertical (Adult Money)
        // Col 2: VStack of Shopping & Grocery
        // Col 3: VStack of Services & Influencers

        // So we need 5 items total to match that layout?
        // Or 3 groups?
        // 1. Adult Money
        // 2. Shopping
        // 3. Grocery
        // 4. Services
        // 5. Influencers

        HStack(alignment: .top, spacing: 8) {
            // Column 1: Item 0
            if items.indices.contains(0) {
                let item = items[0]
                Button(action: {
                    if let action = item.actionUrl {
                        navigationManager.navigate(to: action)
                    }
                }) {
                    ZStack(alignment: .topLeading) {
                        // Background
                        if let colors = item.gradientColors {
                            LinearGradient(
                                gradient: Gradient(colors: colors.map { Color(hex: $0) }),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        } else {
                            Color(hex: item.backgroundColor ?? "#F27121")
                        }

                        // Content
                        VStack(alignment: .leading, spacing: 4) {
                            Text(item.subtitle ?? "")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.white.opacity(0.9))
                            Text(item.title)
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.white)
                                .multilineTextAlignment(.leading)

                            Spacer()

                            // Image
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
                                .frame(height: 120)  // Increased from 60
                                .frame(maxWidth: .infinity)
                                .padding(.bottom, 10)
                            }
                        }
                        .padding(12)
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 210)
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.15), radius: 5, y: 5)
                }
            }

            // Column 2: Items 1 & 2
            VStack(spacing: 8) {
                if items.indices.contains(1) {
                    SmallGridCardSDUI(item: items[1])
                }
                if items.indices.contains(2) {
                    SmallGridCardSDUI(item: items[2])
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 210)

            // Column 3: Items 3 & 4
            VStack(spacing: 8) {
                if items.indices.contains(3) {
                    SmallGridCardSDUI(item: items[3])
                }
                if items.indices.contains(4) {
                    SmallGridCardSDUI(item: items[4])
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 210)
        }
        .padding(.horizontal, 16)
    }
}

struct SmallGridCardSDUI: View {
    let item: BentoGridItem
    @EnvironmentObject var navigationManager: NavigationManager

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                navigationManager.navigate(to: action)
            }
        }) {
            ZStack(alignment: .top) {  // Layer 1: Background
                if let colors = item.gradientColors {
                    LinearGradient(
                        gradient: Gradient(colors: colors.map { Color(hex: $0) }),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                } else {
                    Color(hex: item.backgroundColor ?? "#2563EB")
                }

                // Layer 2: Image (Bottom Aligned)
                VStack {
                    Spacer()
                    if let imageUrl = item.imageUrl {
                        CachedAsyncImage(url: URL(string: imageUrl)) { image in
                            image.resizable().aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Image(systemName: "bag.fill")  // Fallback
                                .font(.system(size: 30))
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .frame(height: 80)
                        .frame(maxWidth: .infinity)
                        .clipped()
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
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.15), radius: 4, y: 4)
        }
    }
}

struct BentoGridItem: Decodable {
    let title: String
    let subtitle: String?
    let imageUrl: String?
    let actionUrl: String?
    let backgroundColor: String?
    let gradientColors: [String]?
}
