import SwiftUI

// MARK: - Shoes Sales Renderers
extension SDUIComponentView {

    // MARK: - Header
    @ViewBuilder
    func renderShoesSalesHeader() -> some View {
        ShoesSalesHeaderView(component: component)
    }

    // MARK: - Featured Carousel (3D)
    @ViewBuilder
    func renderShoesSalesFeatured() -> some View {
        let items: [ShoeItem] = component.decodeItems(for: "items")

        if items.isEmpty {
            EmptyView()
        } else {
            ShoesFeaturedCarousel(items: items)
        }
    }

    // MARK: - Grid
    @ViewBuilder
    func renderShoesSalesGrid() -> some View {
        let title = component.prop(for: "title") ?? "Flash Sale Items"
        let items: [FlashSaleItem] = component.decodeItems(for: "items")

        VStack(spacing: 16) {
            HStack {
                Text(title)
                    .font(.system(size: 20, weight: .black))
                    .italic()
                    .foregroundColor(.black)
                Spacer()
                Button("View All") {}
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(red: 0.49, green: 0.07, blue: 1.0))
            }
            .padding(.horizontal, 20)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                ForEach(items) { item in
                    FlashSaleItemView(item: item)
                }
            }
            .padding(.horizontal, 20)
        }
    }
}

// MARK: - Helper Views & Models for Shoes Sales

struct ShoesSalesHeaderView: View {
    let component: SDUIComponent
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        let discount = component.prop(for: "discount") ?? "50% OFF"
        let title = component.prop(for: "title") ?? "FOOTWEAR SALE"
        let subtitle = component.prop(for: "subtitle") ?? "SPECIAL PRICE UP TO 50% OFF"

        let primaryColor = Color(red: 0.99, green: 0.76, blue: 0.16)  // #fcc228
        let accentColor = Color(red: 0.49, green: 0.07, blue: 1.0)

        ZStack(alignment: .top) {
            primaryColor

            // Decorative patterns
            GeometryReader { geometry in
                // Triangle top right
                Path { path in
                    path.move(to: CGPoint(x: geometry.size.width - 50, y: 20))
                    path.addLine(to: CGPoint(x: geometry.size.width + 10, y: 80))
                    path.addLine(to: CGPoint(x: geometry.size.width - 60, y: 80))
                }
                .fill(Color.white.opacity(0.2))
                .rotationEffect(.degrees(12))

                // Circle bottom left
                Circle()
                    .stroke(Color.white, lineWidth: 8)
                    .frame(width: 100, height: 100)
                    .opacity(0.1)
                    .offset(x: -20, y: geometry.size.height - 40)
            }

            VStack(spacing: 0) {
                // Top Navigation
                HStack {
                    Button(action: {
                        presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                            .padding(8)
                            .background(Color.white.opacity(0.2))
                            .clipShape(Circle())
                    }

                    Spacer()

                    HStack(spacing: 12) {
                        Button(action: {}) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.white)
                                .padding(8)
                                .background(Color.white.opacity(0.2))
                                .clipShape(Circle())
                        }

                        Button(action: {}) {
                            ZStack(alignment: .topTrailing) {
                                Image(systemName: "bag")
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(8)

                                Text("2")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(width: 16, height: 16)
                                    .background(accentColor)
                                    .clipShape(Circle())
                                    .overlay(Circle().stroke(primaryColor, lineWidth: 2))
                                    .offset(x: 4, y: 0)
                            }
                            .background(Color.white.opacity(0.2))
                            .clipShape(Circle())
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 60)  // Safe area adjustment

                // Title
                VStack(alignment: .leading, spacing: 4) {
                    Text(discount)
                        .font(.system(size: 40, weight: .black))
                        .italic()
                        .foregroundColor(.white)
                    Text(title)
                        .font(.system(size: 40, weight: .black))
                        .italic()
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)

                    Text(subtitle)
                        .font(.system(size: 14, weight: .bold))
                        .italic()
                        .foregroundColor(Color.white.opacity(0.9))
                        .tracking(1)
                        .padding(.top, 4)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 24)
                .padding(.top, 24)
                .padding(.bottom, 60)
            }
        }
        .frame(height: 340)
    }
}

// 1. Comparison of shoe items
struct ShoeItem: Decodable, Identifiable {
    let id: String
    let badge: String?
    let title: String
    let price: String
    let originalPrice: String?
    let imageUrl: String

    // Custom decoding to handle generated ID if missing
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        self.badge = try container.decodeIfPresent(String.self, forKey: .badge)
        self.title = try container.decode(String.self, forKey: .title)
        self.price = try container.decode(String.self, forKey: .price)
        self.originalPrice = try container.decodeIfPresent(String.self, forKey: .originalPrice)
        self.imageUrl = try container.decode(String.self, forKey: .imageUrl)
    }

    enum CodingKeys: String, CodingKey {
        case id, badge, title, price, originalPrice, imageUrl
    }
}

struct ShoesFeaturedCarousel: View {
    let items: [ShoeItem]
    @State private var currentIndex = 0

    private let primaryColor = Color(red: 0.99, green: 0.76, blue: 0.16)
    private let accentColor = Color(red: 0.49, green: 0.07, blue: 1.0)

    var body: some View {
        ZStack {
            // 1. STATIC CARD CONTAINER
            Color.white

            // Curved Accent Background
            GeometryReader { geo in
                VStack {
                    primaryColor.opacity(0.1)
                        .frame(height: geo.size.height * 0.55)
                        .clipShape(ShoesCurvedBottomShape())
                    Spacer()
                }
            }

            // 2. DYNAMIC CONTENT
            TabView(selection: $currentIndex) {
                ForEach(0..<items.count, id: \.self) { index in
                    GeometryReader { geo in
                        let frame = geo.frame(in: .global)
                        let minX = frame.minX

                        featureShoeContent(items[index])
                            .rotation3DEffect(
                                .degrees(Double(minX / -10)),
                                axis: (x: 0, y: 1, z: 0),
                                anchor: .center,
                                anchorZ: 0,
                                perspective: 1.0
                            )
                            .scaleEffect(1.0)
                            .opacity(1.0)
                    }
                    .tag(index)
                }
            }
            #if os(iOS)
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            #else
                .tabViewStyle(DefaultTabViewStyle())
            #endif
            .frame(height: 420)

            // 3. STATIC DECORATIVE ELEMENTS (Dots)
            HStack(spacing: 6) {
                ForEach(0..<items.count, id: \.self) { index in
                    Circle()
                        .fill(currentIndex == index ? accentColor : Color.gray.opacity(0.3))
                        .frame(width: 8, height: 8)
                        .scaleEffect(currentIndex == index ? 1.2 : 1.0)
                        .animation(.spring(), value: currentIndex)
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .trailing)
        }
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.05), radius: 15, x: 0, y: 5)
        .padding(.horizontal, 24)  // Added padding to distinct from screen edges
        //.padding(.top, -60) // Logic handled by parent ZStack usually, but safe to keep neutral here
    }

    private func featureShoeContent(_ shoe: ShoeItem) -> some View {
        VStack {
            HStack {
                if let badge = shoe.badge {
                    Text(badge)
                        .font(.system(size: 10, weight: .bold))
                        .textCase(.uppercase)
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(accentColor)
                        .clipShape(Capsule())
                }
                Spacer()
                Image(systemName: "heart")
                    .foregroundColor(Color.gray.opacity(0.5))
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)

            // Shoe Image
            CachedAsyncImage(url: URL(string: shoe.imageUrl)) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fit)
                    .rotationEffect(.degrees(-12))
                    .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 10)
            } placeholder: {
                Color.clear
            }
            .frame(height: 180)
            .padding(.vertical, 8)

            // Info
            VStack(spacing: 8) {
                Text(shoe.title)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.black)
                    .lineLimit(1)

                HStack(spacing: 8) {
                    Text(shoe.price)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(accentColor)
                    if let original = shoe.originalPrice {
                        Text(original)
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                            .strikethrough()
                    }
                }

                Button(action: {}) {
                    HStack {
                        Text("SHOP NOW")
                            .font(.system(size: 14, weight: .bold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 12))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(accentColor)
                    .cornerRadius(16)
                }
                .padding(.top, 8)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
        }
    }
}

// 2. Flash Sale Structure
struct FlashSaleItem: Decodable, Identifiable {
    let id: String
    let name: String
    let category: String
    let price: String
    let imageUrl: String
    let gradientColors: [String]?

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        self.name = try container.decode(String.self, forKey: .name)
        self.category = try container.decode(String.self, forKey: .category)
        self.price = try container.decode(String.self, forKey: .price)
        self.imageUrl = try container.decode(String.self, forKey: .imageUrl)
        self.gradientColors = try container.decodeIfPresent([String].self, forKey: .gradientColors)
    }

    enum CodingKeys: String, CodingKey {
        case id, name, category, price, imageUrl, gradientColors
    }
}

struct FlashSaleItemView: View {
    let item: FlashSaleItem

    private let primaryColor = Color(red: 0.99, green: 0.76, blue: 0.16)
    private let accentColor = Color(red: 0.49, green: 0.07, blue: 1.0)

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            ZStack(alignment: .topTrailing) {
                // Circular bg with GRADIENT support
                if let hexColors = item.gradientColors, !hexColors.isEmpty {
                    Circle()
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: hexColors.map { Color(hex: $0) }),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 100, height: 100)
                        .scaleEffect(1.2)
                        .opacity(0.2)  // Slight opacity for the gradient bg
                } else {
                    // Fallback to primary color opacity
                    Circle()
                        .fill(primaryColor.opacity(0.05))
                        .frame(width: 100, height: 100)
                        .scaleEffect(1.2)
                }

                CachedAsyncImage(url: URL(string: item.imageUrl)) { img in
                    img.resizable().aspectRatio(contentMode: .fit)
                } placeholder: {
                    Color.clear
                }
                .frame(height: 100)

                Text("-50%")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.black)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(primaryColor)
                    .cornerRadius(4)
                    .offset(x: 10, y: -10)
            }
            .frame(height: 120)
            .frame(maxWidth: .infinity)
            .padding(.bottom, 8)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.black)
                    .lineLimit(1)
                Text(item.category)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }

            HStack {
                Text(item.price)
                    .font(.system(size: 16, weight: .heavy))
                    .foregroundColor(accentColor)
                Spacer()
                Button(action: {}) {
                    Image(systemName: "cart.badge.plus")
                        .font(.system(size: 14))
                        .foregroundColor(.black)
                        .padding(8)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}

// Helper Shape
struct ShoesCurvedBottomShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: rect.height - 40))
        path.addQuadCurve(
            to: CGPoint(x: 0, y: rect.height - 40),
            control: CGPoint(x: rect.width / 2, y: rect.height + 40)
        )
        path.closeSubpath()
        return path
    }
}
