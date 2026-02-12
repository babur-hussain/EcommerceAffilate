import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct SchoolFiveHeaderView: View {
    let component: SDUIComponent

    private let primary = Color(hex: "DC2626")  // Bright Red
    private let secondary = Color(hex: "FF9F1C")  // Orange

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                // Background
                secondary

                // Pattern (Rotated Text)
                GeometryReader { geo in
                    VStack(spacing: 0) {
                        ForEach(0..<5) { _ in
                            Text("CONFERENCE CONFERENCE")
                                .font(.system(size: 60, weight: .black))
                                .foregroundColor(Color.white.opacity(0.1))
                                .lineLimit(1)
                                .fixedSize()
                        }
                    }
                    .rotationEffect(.degrees(-10))
                    .offset(x: -50, y: -20)
                }
                .clipped()

                // Content
                VStack {
                    // Navbar (Visual only)
                    HStack {
                        Button(action: {}) {
                            Image(systemName: "line.3.horizontal")
                                .foregroundColor(.white)
                                .padding(8)
                                .background(Color.white.opacity(0.2))
                                .clipShape(Circle())
                        }
                        Spacer()
                        HStack(spacing: 12) {
                            Button(action: {}) {
                                Image(systemName: "magnifyingglass")
                                    .foregroundColor(.white)
                                    .padding(8)
                                    .background(Color.white.opacity(0.2))
                                    .clipShape(Circle())
                            }
                            Button(action: {}) {
                                ZStack(alignment: .topTrailing) {
                                    Image(systemName: "bag.fill")
                                        .foregroundColor(.white)
                                        .padding(8)
                                        .background(Color.white.opacity(0.2))
                                        .clipShape(Circle())

                                    Text("2")
                                        .font(.system(size: 8, weight: .bold))
                                        .foregroundColor(.white)
                                        .frame(width: 16, height: 16)
                                        .background(primary)
                                        .clipShape(Circle())
                                        .overlay(Circle().stroke(secondary, lineWidth: 2))
                                        .offset(x: 4, y: -4)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                    .padding(.top, 48)

                    // Promo Image
                    GeometryReader { geo in
                        ZStack {
                            AsyncImage(
                                url: URL(
                                    string:
                                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDoRaUDKZyvSwlgoZOEv9kuTUBsifba_Nd1PpU0-T8RGetGYNhCL_4KjOHOPcuCv_ggOEg5TXSJ5zokyZ3nzIxROXAoNemMOLug0MGdoWTw0oNZ_Oj1RD6Nl_XiQMac76gFjQeXuErIm88C-uTSzMk3aJ2bU2rmNa5MRMRQSz0OoVsMqFuBltbtsA0JGsf8Oy70trIGrryn9ojP11s6fQf1FRHbY6EMW-CB213XCp6a9m3MdSLIXs6ytxAkL_B1ZiqSzicTDL7D0i0j"
                                )
                            ) { phase in
                                if let image = phase.image {
                                    image.resizable().aspectRatio(contentMode: .fill)
                                } else {
                                    Color.gray.opacity(0.3)
                                }
                            }
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.3), lineWidth: 4)
                            )

                            // Floating Emojis
                            Text("✏️")
                                .font(.system(size: 20))
                                .padding(8)
                                .background(Color(hex: "3B82F6"))
                                .cornerRadius(12)
                                .rotationEffect(.degrees(-6))
                                .offset(x: -geo.size.width * 0.4 + 20, y: -60)  // Approx
                                .shadow(radius: 4)

                            Text("⏰")
                                .font(.system(size: 20))
                                .padding(8)
                                .background(Color.white)
                                .cornerRadius(12)
                                .rotationEffect(.degrees(6))
                                .offset(x: geo.size.width * 0.4 - 20, y: 60)
                                .shadow(radius: 4)
                        }
                    }
                    .frame(height: 200)  // Approx
                    .rotationEffect(.degrees(1))
                    .padding(.horizontal, 20)
                    .shadow(color: .black.opacity(0.2), radius: 15, x: 0, y: 10)
                    .padding(.bottom, 16)

                    Text("Get Ready for School!")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.white)
                        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)

                    Text("Huge savings on creative supplies")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color.white.opacity(0.9))
                        .padding(.bottom, 32)
                }
            }
            .cornerRadius(40, corners: [.bottomLeft, .bottomRight])
            .shadow(color: .black.opacity(0.2), radius: 8, x: 0, y: 4)
        }
        .padding(.bottom, 24)
    }
}
