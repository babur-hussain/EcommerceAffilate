import SwiftUI

struct FashionForecastView: View {
    // Props
    var title: String = "FASHION FORECAST"
    var headerActionUrl: String?
    var items: [ForecastItem] = []

    struct ForecastItem: Identifiable, Decodable {
        let id: String
        let image: String
        let title: String
        let sub: String?
        let align: String?  // 'left', 'right', 'bottom-left' (default)
        let actionUrl: String?

        var safeId: String { id }
    }

    var body: some View {
        VStack(alignment: .center, spacing: 16) {
            // Header
            Button(action: {
                if let action = headerActionUrl {
                    print("Navigate to: \(action)")
                }
            }) {
                Text("\(title) ›")
                    .font(.custom("Didot", size: 24))
                    .fontWeight(.bold)
                    .foregroundColor(Color(hex: "#111111"))
                    .textCase(.uppercase)
                    .tracking(1)
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.bottom, 8)

            // Vertical Stack of Cards
            VStack(spacing: 16) {
                ForEach(items) { item in
                    FashionForecastCard(item: item)
                }
            }
        }
        .padding(.vertical, 16)
        .padding(.horizontal, 16)
        .background(Color.clear)
    }
}

struct FashionForecastCard: View {
    let item: FashionForecastView.ForecastItem

    var alignment: Alignment {
        switch item.align {
        case "left":
            return .leading
        case "right":
            return .trailing
        default:
            return .bottomLeading
        }
    }

    var textAlignment: TextAlignment {
        switch item.align {
        case "left":
            return .leading
        case "right":
            return .trailing
        default:
            return .leading
        }
    }

    // For VStack alignment inside the overlay
    var stackAlignment: HorizontalAlignment {
        switch item.align {
        case "left":
            return .leading
        case "right":
            return .trailing
        default:
            return .leading
        }
    }

    var body: some View {
        Button(action: {
            if let action = item.actionUrl {
                print("Navigate to: \(action)")
            }
        }) {
            ZStack(alignment: alignment) {
                // Image
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Color(hex: "#F0F0F0")
                    }
                } else {
                    Color(hex: "#F0F0F0")
                }

                // Overlay Content
                VStack(alignment: stackAlignment, spacing: 4) {
                    Text(item.title)
                        .font(.custom("Didot", size: 28))
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .multilineTextAlignment(textAlignment)
                        .shadow(color: .black.opacity(0.3), radius: 4, x: 0, y: 1)

                    if let sub = item.sub {
                        Text(sub)
                            .font(.system(size: 16, weight: .semibold))  // System font for sub as per appearance in typical Didot pairings, or could be Didot too. React Native code didn't specify font family for sub, but parent View might have. Let's stick to system or Didot. React Native sub style didn't have fontFamily explicitly set in snippet, so it might inherit or be default. I'll use System to differentiate or consistent Didot. Let's use System for contrast or Didot if requested. Native snippet: forecastSub style has no fontFamily. So it is System.
                            .foregroundColor(.white)
                            .multilineTextAlignment(textAlignment)
                            .shadow(color: .black.opacity(0.3), radius: 4, x: 0, y: 1)
                    }
                }
                .padding(20)
                // If alignment is not bottomLeading, we might need to center vertically in the left/right area?
                // The React Native styles:
                // alignLeft: { top: 0, bottom: 0, left: 0, alignItems: 'flex-start' } -> implies centered vertically (justifyContent: center)
                // alignRight: { top: 0, bottom: 0, right: 0, alignItems: 'flex-end' } -> implies centered vertically
                // alignBottomLeft: { bottom: 0, left: 0, alignItems: 'flex-start' } -> only bottom
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: alignment)
            }
            .frame(height: 180)
            .background(Color(hex: "#F0F0F0"))
            .cornerRadius(20)
            .clipped()
        }
    }
}
