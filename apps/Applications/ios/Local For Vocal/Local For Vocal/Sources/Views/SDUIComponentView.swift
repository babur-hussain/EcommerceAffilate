import SwiftUI

struct SDUIComponentView: View {
    let component: SDUIComponent
    
    var body: some View {
        switch component.type {
        case .container:
            renderContainer()
        case .text:
            renderText()
        case .image:
            renderImage()
        case .button:
            renderButton()
        case .scrollView:
            renderScrollView()
        case .heroCarousel:
            renderHeroCarousel()
        case .recentHistory:
            renderRecentHistory()
        case .groceryRow:
            renderGroceryRow()
        case .curatedCollections:
            renderCuratedCollections()
        case .fiftyPercentOffZone:
            renderFiftyPercentOffZone()
        case .grandKitchenSale:
            renderGrandKitchenSale()
        case .productGrid:
            renderProductGrid()
        case .productListHorizontal:
            renderProductListHorizontal()
        case .lightningDeals:
            renderLightningDeals()
        default:
            // Fallback for unknown or unimplemented types
            Text("Unknown Component: \(component.type.rawValue)")
                .padding()
                .background(Color.red.opacity(0.1))
        }
    }
    
    // MARK: - Renderers
    
    @ViewBuilder
    private func renderContainer() -> some View {
        // Simple Vertical Stack for container children
        // In a real app, you'd parse 'style' for flexDirection (HStack vs VStack)
        VStack(alignment: .leading, spacing: 0) {
            if let children = component.children {
                ForEach(children) { child in
                    SDUIComponentView(component: child)
                }
            }
        }
        .modifier(StyleModifier(styles: component.style))
    }
    
    @ViewBuilder
    private func renderText() -> some View {
        Text(component.prop(for: "text") ?? "")
            .modifier(StyleModifier(styles: component.style))
    }
    
    @ViewBuilder
    private func renderImage() -> some View {
        if let source: String = component.prop(for: "source") {
            AsyncImage(url: URL(string: source)) { phase in
                switch phase {
                case .empty:
                    Color.gray.opacity(0.2)
                case .success(let image):
                    image.resizable()
                case .failure:
                    Color.red.opacity(0.2)
                @unknown default:
                    EmptyView()
                }
            }
            .modifier(StyleModifier(styles: component.style))
        }
    }
    
    @ViewBuilder
    private func renderButton() -> some View {
        Button(action: {
            print("Button tapped")
        }) {
            Text(component.prop(for: "text") ?? "Button")
        }
        .modifier(StyleModifier(styles: component.style))
    }
    
    @ViewBuilder
    private func renderScrollView() -> some View {
        let horizontal: Bool = component.prop(for: "horizontal") ?? false
        ScrollView(horizontal ? .horizontal : .vertical, showsIndicators: false) {
            StackCompat(horizontal: horizontal) {
                if let children = component.children {
                    ForEach(children) { child in
                        SDUIComponentView(component: child)
                    }
                }
            }
        }
    }
    
    @ViewBuilder
    private func renderCuratedCollections() -> some View {
        // Decode logic for collections props
        if let data = try? JSONSerialization.data(withJSONObject: component.props?["data"]?.value ?? [:]),
           let wrapper = try? JSONDecoder().decode(CuratedCollectionsWrapper.self, from: data) {
            CuratedCollectionsView(collections: wrapper.collections)
        } else {
            Text("Error loading collections")
        }
    }
    
    @ViewBuilder
    private func renderFiftyPercentOffZone() -> some View {
        FiftyPercentOffZoneView()
    }
    
    @ViewBuilder
    private func renderGrandKitchenSale() -> some View {
        GrandKitchenSaleView()
    }
    
    @ViewBuilder
    private func renderProductGrid() -> some View {
        let title = component.prop(for: "title") as String?
        // Basic mapping of products if passed in props (often they are empty and fetched by ID, but for now we look for array)
        if let productsData = try? JSONSerialization.data(withJSONObject: component.props?["products"]?.value ?? []),
           let products = try? JSONDecoder().decode([Product].self, from: productsData) {
            ProductCardGrid(products: products, title: title)
        } else {
            // Fallback empty grid or fetch logic could go here
            ProductCardGrid(products: [], title: title)
        }
    }
    
    @ViewBuilder
    private func renderProductListHorizontal() -> some View {
        // Reuse TrendingNearYouView for horizontal product lists
        // Typically checks content type or title to decide. For now, default to Trending if type matches.
        if component.type == .productListHorizontal {
           TrendingNearYouView(
               limit: 10, // Default or parse from props
               productIds: [] // Parse from props if available
           )
        } else {
           Text("List Horizontal")
        }
    }

    @ViewBuilder
    private func renderLightningDeals() -> some View {
        LightningDealsView()
    }
    
    @ViewBuilder
    private func renderHeroCarousel() -> some View {
        HeroBannerView(bannersCallback: {
            guard let bannersValue = component.props?["banners"]?.value else { return [] }
            if let data = try? JSONSerialization.data(withJSONObject: bannersValue),
               let banners = try? JSONDecoder().decode([HeroBannerView.BannerData].self, from: data) {
                return banners
            }
            return []
        })
    }
    
    @ViewBuilder
    private func renderRecentHistory() -> some View {
        RecentHistoryView(userName: "User") // Can inject user name here later
    }
    
    @ViewBuilder
    private func renderGroceryRow() -> some View {
        GroceryRowView()
    }
}

// Wrapper to match decoding structure for Curated Collections prop
private struct CuratedCollectionsWrapper: Decodable {
    let collections: [CuratedCollectionsView.CollectionItem]
}


// Helper to switch stack direction based on scroll view
struct StackCompat<Content: View>: View {
    let horizontal: Bool
    let content: () -> Content
    
    init(horizontal: Bool, @ViewBuilder content: @escaping () -> Content) {
        self.horizontal = horizontal
        self.content = content
    }
    
    var body: some View {
        if horizontal {
            HStack(spacing: 0) { content() }
        } else {
            VStack(spacing: 0) { content() }
        }
    }
}

// MARK: - Styling Engine

struct StyleModifier: ViewModifier {
    let styles: [String: AnyCodable]?
    
    func body(content: Content) -> some View {
        // Basic style parsing
        let width = styles?["width"]?.value as? CGFloat
        let height = styles?["height"]?.value as? CGFloat
        let padding = styles?["padding"]?.value as? CGFloat ?? 0
        let backgroundColor = styles?["backgroundColor"]?.value as? String
        
        return content
            .frame(width: width, height: height)
            .padding(padding)
            .background(Color(hex: backgroundColor ?? "#00000000"))
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
