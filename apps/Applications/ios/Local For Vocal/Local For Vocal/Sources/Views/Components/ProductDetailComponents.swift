import SwiftUI

// MARK: - Product Timer
struct ProductTimerView: View {
    let targetDate: String?

    @State private var timeRemaining: String = ""
    @State private var timer: Timer? = nil

    private static let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    private static let isoFormatterBasic: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    var body: some View {
        if targetDate != nil && !timeRemaining.isEmpty {
            HStack(spacing: 8) {
                Image(systemName: "clock")
                    .foregroundColor(.white)
                    .font(.system(size: 14))

                Text("Ends in \(timeRemaining)")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(Color.red)
            .onAppear {
                startTimer()
            }
            .onDisappear {
                timer?.invalidate()
            }
        }
    }

    private func startTimer() {
        updateTime()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            updateTime()
        }
    }

    private func updateTime() {
        guard let targetDate = targetDate else { return }
        // Use static cached ISO8601DateFormatter
        guard
            let endDate = Self.isoFormatter.date(from: targetDate)
                ?? Self.isoFormatterBasic.date(from: targetDate)
        else { return }

        let diff = endDate.timeIntervalSinceNow

        if diff <= 0 {
            timeRemaining = ""
            timer?.invalidate()
            return
        }

        let hours = Int(diff) / 3600
        let minutes = Int(diff) / 60 % 60
        let seconds = Int(diff) % 60

        timeRemaining = String(format: "%02dh : %02dm : %02ds", hours, minutes, seconds)
    }
}

// MARK: - Image Carousel
// MARK: - Image Carousel
struct ProductImageCarouselView: View {
    let images: [String]
    @State private var currentIndex = 0

    // Fallback if no images
    var displayImages: [String] {
        if !images.isEmpty { return images }
        return ["https://picsum.photos/400/400?grayscale"]
    }

    var body: some View {
        let _ = AppLogger.debug("ProductImageCarouselView images: \(images)")
        ZStack(alignment: .bottom) {
            // Images
            TabView(selection: $currentIndex) {
                ForEach(Array(displayImages.enumerated()), id: \.element) { index, imageUrl in
                    if let url = URL(string: imageUrl) {
                        CachedAsyncImage(url: url) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fit)
                                .padding(20)  // Match RN padding
                        } placeholder: {
                            ProgressView()
                        }
                        .tag(index)
                    } else {
                        Color(hex: "#F3F4F6").tag(index)
                    }
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))  // We build custom dots
            .frame(height: 400)  // Match RN height (400)
            .background(Color.white)

            // Custom Paging Dots
            if displayImages.count > 1 {
                HStack(spacing: 6) {
                    ForEach(0..<displayImages.count, id: \.self) { index in
                        Circle()
                            .fill(
                                index == currentIndex
                                    ? Color(hex: "#2563EB") : Color(hex: "#D1D5DB")
                            )
                            .frame(width: 8, height: 8)
                    }
                }
                .padding(.bottom, 16)
            }

            // Floating Buttons (Top Right)
            VStack(spacing: 12) {
                Button(action: {
                    HapticManager.shared.impact(style: .medium)
                }) {
                    Image(systemName: "heart")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "#374151"))
                        .frame(width: 40, height: 40)
                        .background(Color.white)
                        .clipShape(Circle())
                        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
                }

                Button(action: {
                    HapticManager.shared.impact(style: .light)
                }) {
                    Image(systemName: "square.and.arrow.up")  // Matched to standard share icon
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "#374151"))
                        .frame(width: 40, height: 40)
                        .background(Color.white)
                        .clipShape(Circle())
                        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
            .padding(.top, 16)
            .padding(.trailing, 16)
        }
        .frame(height: 400)
    }
}

// MARK: - Price and Title
struct PriceAndTitleView: View {
    let brand: String?
    let name: String
    let shortDescription: String?
    let price: Double
    let mrp: Double?
    let discount: String?  // "30% off"
    let protectPromiseFee: Double?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Title
            Text(name)
                .font(.system(size: 20, weight: .heavy))  // Bold Title
                .foregroundColor(Color(hex: "#111827"))
                .lineLimit(2)

            // Subtitle / Short Desc
            if let shortDesc = shortDescription {
                Text(shortDesc)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#6B7280"))
            }

            // Price Row
            HStack(alignment: .firstTextBaseline, spacing: 12) {
                // Discount (Green, Bold, First)
                if let discount = discount {
                    Text(discount)
                        .font(.system(size: 20, weight: .bold))  // Larger
                        .foregroundColor(Color(hex: "#16A34A"))  // Green
                }

                // MRP (Strikethrough, Gray)
                if let mrp = mrp, mrp > price {
                    Text("₹\(Int(mrp))")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "#9CA3AF"))
                        .strikethrough()
                }

                // Active Price (Black, Heavy)
                Text("₹\(Int(price))")
                    .font(.system(size: 22, weight: .black))
                    .foregroundColor(Color(hex: "#111827"))
            }

        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
    }
}

// MARK: - Wow Deal Banner
// MARK: - Wow Deal Banner
struct WowDealBannerView: View {
    let price: Double

    var body: some View {
        // Only show if we have some logic, or just generic "Great Deal"
        // For now, let's keep it simple or hide it if we want strictly "no hardcoded claims"
        // User said "remove all hardcoded data". "WOW DEAL" is marketing copy, not data.
        // But "Lowest price in 30 days" IS data/claim.
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("GREAT PRICE")
                    .font(.system(size: 18, weight: .heavy))
                    .foregroundColor(Color(hex: "#92400E"))
                // Removed "Lowest price in 30 days" as it's hardcoded data
            }
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(hex: "#FEF3C7"))
    }
}

// MARK: - Bank Offers
struct BankOffersView: View {
    let offers: [ProductOffer]?

    var body: some View {
        if let offers = offers, !offers.isEmpty {
            let totalSavings = offers.reduce(0) { $0 + $1.discountAmount }

            VStack(alignment: .leading, spacing: 16) {
                Text("Select and apply the best offers")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "#374151"))

                // Summary Rows
                VStack(spacing: 8) {
                    HStack {
                        Image(systemName: "lock.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "#9CA3AF"))
                        Text("Extra off on Exchange + Banks")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#4B5563"))
                        Spacer()
                        Text("₹\(Int(totalSavings)) off")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(8)

                    HStack {
                        Image(systemName: "circle.circle.fill")  // radio button on
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "#2563EB"))
                        Text("All offers")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "#4B5563"))
                        Spacer()
                        Text("₹\(Int(totalSavings)) off")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "#1F2937"))
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(8)
                }

                // Available Offers Header
                HStack {
                    Text("Available offers")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(hex: "#6B7280"))
                    Spacer()
                    Button("View all") {}
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "#374151"))
                        .underline()
                }

                // Offers Grid (Scrollable horizontal or wrapped? RN uses flexWrap wrap)
                // Using LazyVGrid or simply alternating rows if items are few.
                // Since this is inside a scrollview, we should use a custom grid or LazyVGrid with fixed height items.
                // Simpler: Just 2 columns using LazyVGrid
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(offers, id: \.self) { offer in
                        BankOfferCard(offer: offer)
                    }
                }
            }
            .padding(16)
            .background(Color(hex: "#EFF6FF"))  // Light blue bg
        }
    }
}

struct BankOfferCard: View {
    let offer: ProductOffer

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Badge (Only for first item logic? Passing simple for now)
            // Simulating "Best Value" if needed, but let's stick to generic card first or add logic

            // Header
            HStack(alignment: .top) {
                // Icon (Placeholder)
                Image(systemName: "banknote")  // Replaces external URL icon
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 24, height: 24)
                    .foregroundColor(Color(hex: "#374151"))

                VStack(alignment: .leading, spacing: 2) {
                    Text("₹\(Int(offer.discountAmount)) off")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Text(offer.title)
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#6B7280"))
                        .lineLimit(1)
                }
                Spacer()
                Text("Apply")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(Color(hex: "#2563EB"))
            }
            .padding(12)

            Divider()

            // Footer
            HStack {
                Text(offer.description)
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .lineLimit(2)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#9CA3AF"))
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
        )
    }
}

// MARK: - Delivery Info
// MARK: - Delivery Info (Enhanced - matching RN)
struct DeliveryInfoView: View {
    let sellerName: String?
    let trustBadges: [TrustBadge]?
    let productId: String?

    private static let deliveryDateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "EEEE, MMM d"
        return f
    }()

    // For computed delivery date
    @State private var deliveryDateText: String = ""
    @State private var timeLeftText: String = ""
    @State private var timer: Timer? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Delivery details")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(Color(hex: "#1F2937"))
                .padding(.bottom, 16)

            // Delivery Date Row
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: "car.fill")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "#4B5563"))
                    .frame(width: 24)

                VStack(alignment: .leading, spacing: 4) {
                    Text(deliveryDateText.isEmpty ? "Calculating..." : deliveryDateText)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))

                    Text("Order in \(timeLeftText)")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#6B7280"))
                }
                Spacer()
            }
            .padding(.vertical, 12)

            Divider()

            // Seller Row
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: "storefront.fill")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "#4B5563"))
                    .frame(width: 24)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Fulfilled by \(sellerName ?? "Seller")")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#1F2937"))

                    // Rating Badge
                    HStack(spacing: 4) {
                        Text("4.7 ★")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "#2563EB"))
                            .cornerRadius(4)
                    }
                }
                Spacer()
            }
            .padding(.vertical, 12)

            // Trust Badges
            if let badges = trustBadges, !badges.isEmpty {
                Divider()
                    .padding(.bottom, 16)

                HStack(spacing: 24) {
                    ForEach(badges, id: \.id) { badge in
                        VStack(spacing: 8) {
                            ZStack {
                                Circle()
                                    .fill(Color(hex: "#2874F0"))
                                    .frame(width: 40, height: 40)

                                Image(systemName: mapBadgeIcon(badge.icon))
                                    .font(.system(size: 18))
                                    .foregroundColor(.white)
                            }

                            Text(badge.name)
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "#4B5563"))
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                        }
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(16)
        .background(Color.white)
        .onAppear {
            calculateDeliveryDate()
            startCountdownTimer()
        }
        .onDisappear {
            timer?.invalidate()
        }
    }

    private func calculateDeliveryDate() {
        // Calculate delivery date (5 days from now as fallback)
        let calendar = Calendar.current
        let deliveryDays = 5
        if let futureDate = calendar.date(byAdding: .day, value: deliveryDays, to: Date()) {
            deliveryDateText = "Delivery by \(Self.deliveryDateFormatter.string(from: futureDate))"
        }
    }

    private func startCountdownTimer() {
        updateTimeLeft()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            updateTimeLeft()
        }
    }

    private func updateTimeLeft() {
        let now = Date()
        let calendar = Calendar.current

        // Target: Midnight today
        var components = calendar.dateComponents([.year, .month, .day], from: now)
        components.hour = 24
        components.minute = 0
        components.second = 0

        guard let midnight = calendar.date(from: components) else { return }

        let diff = midnight.timeIntervalSince(now)

        if diff <= 0 {
            timeLeftText = "00h 00m 00s"
            return
        }

        let hours = Int(diff) / 3600
        let minutes = (Int(diff) % 3600) / 60
        let seconds = Int(diff) % 60

        timeLeftText = String(format: "%02dh %02dm %02ds", hours, minutes, seconds)
    }

    private func mapBadgeIcon(_ iconName: String) -> String {
        // Map RN icon names to SF Symbols
        switch iconName {
        case "shield-outline", "shield-checkmark-outline":
            return "shield.checkered"
        case "repeat-outline":
            return "arrow.trianglehead.2.counterclockwise"
        case "cash-outline":
            return "indianrupeesign"
        case "cube-outline":
            return "shippingbox"
        default:
            return "checkmark.seal"
        }
    }
}

// MARK: - Product Highlights
struct ProductHighlightsView: View {
    let highlights: [String]
    let description: String?
    @State private var isExpanded = true

    var displaySpecs: [String] {
        if !highlights.isEmpty { return highlights }
        if let desc = description { return [desc] }
        return []
    }

    var body: some View {
        if !displaySpecs.isEmpty {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack {
                    Text("Product highlights")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Spacer()
                    Button(action: { withAnimation { isExpanded.toggle() } }) {
                        Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                            .foregroundColor(Color(hex: "#4B5563"))
                            .padding(4)
                            .background(Color(hex: "#F3F4F6"))
                            .cornerRadius(4)
                    }
                }
                .padding(.bottom, 16)

                if isExpanded {
                    // Specs List
                    VStack(alignment: .leading, spacing: 16) {
                        ForEach(displaySpecs, id: \.self) { spec in
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: "info.circle")
                                    .font(.system(size: 20))
                                    .foregroundColor(Color(hex: "#374151"))
                                    .frame(width: 40, height: 40)
                                    .background(Color(hex: "#EFF6FF"))
                                    .cornerRadius(8)

                                Text(spec)
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "#374151"))
                                    .fixedSize(horizontal: false, vertical: true)
                                Spacer()
                            }
                        }
                    }
                    .padding(.bottom, 24)

                }
            }
            .padding(16)
            .background(Color.white)
        }
    }
}

// MARK: - Variant Selector
// MARK: - Variant Selector (Empty for now until dynamic)
struct VariantSelectorView: View {
    var body: some View {
        EmptyView()  // Variants not yet supported dynamically
    }
}

// MARK: - Rich Content
// MARK: - Rich Content (Empty for now)
struct RichContentView: View {
    var body: some View {
        EmptyView()  // Hardcoded specific content removed
    }
}
