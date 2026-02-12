import SwiftUI

struct LocationBarView: View {
    @ObservedObject var locationManager = LocationManager.shared
    var onTap: (() -> Void)? = nil

    var body: some View {
        Button(action: {
            if let action = onTap {
                action()
            } else {
                locationManager.startUpdating()
            }
        }) {
            HStack {
                HStack(spacing: 8) {
                    // Pin Icon
                    Image(systemName: "location.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 16))
                        .rotationEffect(.degrees(45))  // Angled pin

                    VStack(alignment: .leading, spacing: 2) {
                        Text(locationManager.city)  // Dynamic City/State
                            .font(.system(size: 9, weight: .heavy))
                            .foregroundColor(Color(hex: "#FFD700"))
                            .tracking(0.5)

                        HStack(spacing: 4) {
                            Text(locationManager.address)  // Dynamic Address
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)

                            Image(systemName: "chevron.down")
                                .foregroundColor(.white)
                                .font(.system(size: 12, weight: .bold))
                        }
                    }

                    Spacer()
                }

                // Points Badge
                HStack(spacing: 6) {
                    Image(systemName: "star.circle.fill")
                        .foregroundColor(Color(hex: "#FFFFFF"))
                        .font(.system(size: 14))
                    Text("0")
                        .font(.system(size: 14, weight: .heavy))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.white.opacity(0.2))
                .cornerRadius(20)  // More rounded pill
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)  // Taller bar
            .background(Color.black.opacity(0.2))
            .cornerRadius(10)  // Slightly more rounded corners
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
