import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct SchoolThreeHeaderView: View {
    let component: SDUIComponent

    // Theme Colors
    private let primary = Color(hex: "FF8C42")  // Bright Orange
    private let secondary = Color(hex: "007ea7")  // Teal
    private let accent = Color(hex: "FDE74C")  // Yellow

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                // Background
                secondary

                // Background Pattern (Rotated Icons)
                GeometryReader { geo in
                    ZStack {
                        Image(systemName: "leaf.fill")  // eco
                            .font(.system(size: 120))
                            .foregroundColor(accent.opacity(0.2))
                            .rotationEffect(.degrees(45))
                            .offset(x: geo.size.width - 20, y: 16)

                        Image(systemName: "leaf.fill")
                            .font(.system(size: 100))
                            .foregroundColor(accent.opacity(0.2))
                            .rotationEffect(.degrees(-12))
                            .offset(x: -10, y: 40)

                        Image(systemName: "paperclip")  // attachment
                            .font(.system(size: 48))
                            .foregroundColor(Color.white.opacity(0.3))
                            .rotationEffect(.degrees(12))
                            .offset(x: geo.size.width - 48, y: geo.size.height - 16)

                        Image(systemName: "paperclip")
                            .font(.system(size: 40))
                            .foregroundColor(Color.white.opacity(0.3))
                            .rotationEffect(.degrees(-45))
                            .offset(x: 32, y: 80)
                    }
                }
                .clipped()

                // Content
                VStack {
                    Text("back to")
                        .font(.custom("System", size: 24))  // Ideally italic custom font
                        .italic()
                        .foregroundColor(.white)
                        .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 2)
                        .padding(.bottom, -8)

                    Text("SCHOOL")
                        .font(.system(size: 56, weight: .black))
                        .foregroundColor(accent)
                        .kerning(2)
                        .shadow(color: .black.opacity(0.1), radius: 1, x: 2, y: 2)
                        .padding(.bottom, 24)

                    // Search Bar
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Color(hex: "9CA3AF"))
                        TextField("Find pencils, rulers, backpacks...", text: .constant(""))
                            .foregroundColor(.black)
                    }
                    .padding(12)
                    .background(Color.white.opacity(0.9))
                    .cornerRadius(999)
                }
                .padding(.top, 60)
                .padding(.bottom, 40)
                .padding(.horizontal, 24)
            }
            .cornerRadius(32, corners: [.bottomLeft, .bottomRight])  // Extension required
            .shadow(color: .black.opacity(0.2), radius: 8, x: 0, y: 4)
        }
        .padding(.bottom, 24)
    }
}
