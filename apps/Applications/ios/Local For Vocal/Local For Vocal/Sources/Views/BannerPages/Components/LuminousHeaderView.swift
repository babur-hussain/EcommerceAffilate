import SwiftUI

struct LuminousHeaderView: View {
    let titleTop: String
    let titleBottom: String
    let subtitle: String
    let buttonText: String
    let imageUrl: String

    var body: some View {
        ZStack {
            // Background Image
            AsyncImage(url: URL(string: imageUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                LinearGradient(
                    colors: [
                        Color(red: 0.95, green: 0.77, blue: 0.78),
                        Color(red: 0.91, green: 0.64, blue: 0.66),
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            }
            .frame(height: 220)
            .clipped()

            // Gradient Overlay
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    // Eyebrow
                    HStack(spacing: 8) {
                        Text("Betul's Exclusive")
                            .font(.system(size: 10, weight: .bold))
                            .tracking(2)
                            .textCase(.uppercase)
                            .foregroundColor(Color(red: 0.12, green: 0.14, blue: 0.17))

                        Rectangle()
                            .fill(Color(red: 0.12, green: 0.14, blue: 0.17))
                            .frame(width: 48, height: 1)
                    }

                    // Main Title
                    VStack(alignment: .leading, spacing: -8) {
                        Text("BEAUTY")
                            .font(.system(size: 36, weight: .heavy))
                        Text("PERFUME")
                            .font(.system(size: 36, weight: .heavy))
                    }
                    .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))

                    // Subtitle
                    Text(
                        subtitle.isEmpty ? "with new organic formula for your daily use" : subtitle
                    )
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(red: 0.2, green: 0.25, blue: 0.33))
                    .frame(maxWidth: 180, alignment: .leading)
                    .padding(.top, 4)
                    .padding(.bottom, 12)

                    // Button
                    Button(action: {}) {
                        Text("SHOP NOW")
                            .font(.system(size: 12, weight: .bold))
                            .tracking(1)
                            .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))
                            .padding(.horizontal, 24)
                            .padding(.vertical, 10)
                            .overlay(
                                Rectangle()
                                    .stroke(Color(red: 0.06, green: 0.09, blue: 0.16), lineWidth: 2)
                            )
                    }
                }
                .padding(24)

                Spacer()
            }
            .background(
                LinearGradient(
                    gradient: Gradient(stops: [
                        .init(
                            color: Color(red: 0.95, green: 0.77, blue: 0.78).opacity(0.9),
                            location: 0),
                        .init(
                            color: Color(red: 0.95, green: 0.77, blue: 0.78).opacity(0.4),
                            location: 0.5),
                        .init(color: Color.clear, location: 1.0),
                    ]),
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
        }
        .frame(height: 220)
        .cornerRadius(32)
        .padding(.horizontal, 16)
        .padding(.top, 16)
    }
}
