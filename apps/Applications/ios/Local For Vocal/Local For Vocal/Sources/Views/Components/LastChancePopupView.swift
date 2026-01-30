import SwiftUI

// MARK: - Last Chance Popup View
struct LastChancePopupView: View {
    @Binding var isVisible: Bool
    let offers: [LastChanceOffer]
    let onGoToCheckout: () -> Void
    let onContinue: ([String]) -> Void

    @State private var selectedOfferIds: Set<String> = []

    var savings: Double {
        var total = 0.0
        for (index, offer) in offers.enumerated() {
            let id = offer.tempId(index: index)
            if selectedOfferIds.contains(id) {
                total += (offer.originalPrice - offer.offerPrice)
            }
        }
        return total
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            if isVisible {
                // Dimmed background
                Color.black.opacity(0.5)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation { isVisible = false }
                    }

                // Modal Content
                VStack(spacing: 0) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Added to cart")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#6B7280"))
                            Text("Product details...")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "#1F2937"))
                        }
                        Spacer()
                        Button(action: { withAnimation { isVisible = false } }) {
                            Image(systemName: "xmark")
                                .font(.system(size: 20))
                                .foregroundColor(.black)
                        }
                    }
                    .padding(16)
                    .background(Color(hex: "#F9FAFB"))

                    // Content
                    VStack(spacing: 16) {
                        Text("Last Chance at this Price!")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }
                    .padding(.vertical, 20)

                    // Offers Scroll
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 16) {
                            ForEach(Array(offers.enumerated()), id: \.element.id) { index, offer in
                                OfferCard(
                                    offer: offer,
                                    isSelected: selectedOfferIds.contains(
                                        offer.tempId(index: index)),
                                    onTap: { toggleSelection(index: index, offer: offer) },
                                    onRemove: { toggleSelection(index: index, offer: offer) }
                                )
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 20)
                    }
                    .frame(maxHeight: 350)

                    // Savings Footer
                    if savings > 0 {
                        HStack {
                            Spacer()
                            Text("Additional savings unlocked: ₹\(Int(savings))")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "#047857"))
                            Spacer()
                        }
                        .padding(8)
                        .background(Color(hex: "#ECFDF5"))
                    }

                    // Footer Buttons
                    HStack(spacing: 12) {
                        Button(action: {
                            withAnimation { isVisible = false }
                            onGoToCheckout()
                        }) {
                            Text("Go to checkout")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Color(hex: "#374151"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color(hex: "#D1D5DB"), lineWidth: 1)
                                )
                        }

                        Button(action: {
                            withAnimation { isVisible = false }
                            onContinue(Array(selectedOfferIds))
                        }) {
                            Text("Continue")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "#1F2937"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color(hex: "#FFD700"))
                                .cornerRadius(8)
                        }
                    }
                    .padding(16)
                    .background(Color.white)
                    .overlay(
                        Rectangle()
                            .fill(Color(hex: "#F3F4F6"))
                            .frame(height: 1),
                        alignment: .top
                    )
                }
                .background(Color.white)
                .cornerRadius(20, corners: [.topLeft, .topRight])
                .edgesIgnoringSafeArea(.bottom)
                .transition(.move(edge: .bottom))
            }
        }
        .edgesIgnoringSafeArea(.all)
        .zIndex(100)
    }

    private func toggleSelection(index: Int, offer: LastChanceOffer) {
        let id = offer.tempId(index: index)
        if selectedOfferIds.contains(id) {
            selectedOfferIds.remove(id)
        } else {
            selectedOfferIds.insert(id)
        }
    }
}

// MARK: - Offer Card
struct OfferCard: View {
    let offer: LastChanceOffer
    let isSelected: Bool
    let onTap: () -> Void
    let onRemove: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                // Tag Badge
                if let tag = offer.tag {
                    Text(tag)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "#065F46"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "#D1FAE5"))
                        .cornerRadius(8, corners: [.topLeft, .bottomRight])
                }

                // Image Container
                ZStack {
                    if let imageUrl = offer.image, let url = URL(string: imageUrl) {
                        AsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Image(systemName: "shield.checkmark")
                                .font(.system(size: 60))
                                .foregroundColor(Color(hex: "#E5E7EB"))
                        }
                    } else {
                        Image(systemName: "shield.checkmark")
                            .font(.system(size: 60))
                            .foregroundColor(Color(hex: "#E5E7EB"))
                    }

                    // Selected Overlay
                    if isSelected {
                        VStack {
                            Spacer()
                            Text("Selected")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 4)
                                .background(Color(hex: "#2563EB"))
                        }
                    }
                }
                .frame(height: 120)
                .padding(.top, 16)
                .padding(.bottom, 12)

                // Title
                Text(offer.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .lineLimit(2)
                    .padding(.bottom, 4)

                // Price Row
                HStack(spacing: 6) {
                    if let discount = offer.discountPercentage {
                        Text("↓ \(discount)%")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "#16A34A"))
                    }
                    Text("₹\(Int(offer.originalPrice))")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .strikethrough()
                    Text("₹\(Int(offer.offerPrice))")
                        .font(.system(size: 16, weight: .heavy))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
                .padding(.bottom, 4)

                // Description
                if let desc = offer.description {
                    Text(desc)
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#6B7280"))
                        .lineLimit(2)
                        .padding(.bottom, 8)
                }

                // Features
                if let features = offer.features?.prefix(3) {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(Array(features), id: \.self) { feature in
                            HStack(spacing: 6) {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "#4B5563"))
                                Text(feature)
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "#4B5563"))
                                    .lineLimit(1)
                            }
                        }
                    }
                }

                // Remove Button (if selected)
                if isSelected {
                    Button(action: onRemove) {
                        HStack(spacing: 4) {
                            Image(systemName: "xmark")
                                .font(.system(size: 14))
                            Text("Remove")
                                .font(.system(size: 12))
                        }
                        .foregroundColor(Color(hex: "#4B5563"))
                        .frame(maxWidth: .infinity)
                        .padding(.top, 8)
                    }
                    .overlay(
                        Rectangle()
                            .fill(Color(hex: "#E5E7EB"))
                            .frame(height: 1),
                        alignment: .top
                    )
                }
            }
            .padding(12)
            .frame(width: 200)
            .background(isSelected ? Color(hex: "#EFF6FF") : Color.white)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(
                        isSelected ? Color(hex: "#2563EB") : Color(hex: "#E5E7EB"), lineWidth: 1)
            )
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
