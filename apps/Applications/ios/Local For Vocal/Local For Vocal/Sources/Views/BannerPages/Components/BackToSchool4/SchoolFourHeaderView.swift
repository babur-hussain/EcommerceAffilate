import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

struct SchoolFourHeaderView: View {
    let component: SDUIComponent

    private let primary = Color(hex: "1565C0")  // Deep Blue
    private let secondary = Color(hex: "FF8F00")  // Orange

    var body: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .top) {
                // Image
                GeometryReader { geo in
                    AsyncImage(
                        url: URL(
                            string:
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuC30Ofu0s1bAXd0-TjcubNuCcYL2VlIKSZRge7lXbvWbEkktE7MQoizzX-vZ-hm-y5YQ11lzGNh2Q9Zjh4RLz6NJ_1_k0Y2AaSUIi6X_SkjakH4MkKTjUdFi3RSUy3e4V000xVBUSzaqhmnuwoXXvFGw7XOpxDfTZIg0R_MGFOdSA9pVd6Rzr0fdM-EGQGkLQrfSV4hC9LM0Y8iazt23XigEDE30trlEmIdsjVee3zybpCZut_fvXR0xa1jEzOz35Ukn1JF_2nvZGVq"
                        )
                    ) { phase in
                        if let image = phase.image {
                            image.resizable().aspectRatio(contentMode: .fill)
                        } else {
                            Color(hex: "FB923C")
                        }
                    }
                    .frame(width: geo.size.width, height: geo.size.height)
                }
                .frame(height: 256)
                .clipped()
                .cornerRadius(24, corners: [.bottomLeft, .bottomRight])
                .shadow(color: .black.opacity(0.1), radius: 25, x: 0, y: 10)

                // Floating Header
                HStack(spacing: 12) {
                    // Search Blur
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Color(hex: "9CA3AF"))
                        Text("Search uniforms, supplies...")
                            .foregroundColor(Color(hex: "9CA3AF"))
                            .font(.system(size: 14))
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .frame(height: 48)
                    .background(.ultraThinMaterial)
                    .cornerRadius(16)

                    // Notification Button
                    Button(action: {}) {
                        Image(systemName: "bell")
                            .font(.system(size: 24))
                            .foregroundColor(primary)
                            .frame(width: 48, height: 48)
                            .background(.ultraThinMaterial)
                            .cornerRadius(16)
                    }
                }
                .padding(.top, 48)  // Safe area
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 24)
    }
}
