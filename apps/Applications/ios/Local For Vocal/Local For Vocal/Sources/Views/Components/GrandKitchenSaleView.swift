import SwiftUI

struct GrandKitchenSaleView: View {
    // Static promo items matching RN
    private let promoItems = [
        PromoItem(id: "dining", title: "Dining &\nDrinkware", image: "https://images.unsplash.com/photo-1577934214051-94285f25e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", offer: "Up to 80% off"),
        PromoItem(id: "cookware", title: "Cookware\n& Tools", image: "https://images.unsplash.com/photo-1584990347449-a0c92335e953?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", offer: "Up to 70% off"),
        PromoItem(id: "storage", title: "Kitchen\nStorage", image: "https://images.unsplash.com/photo-1517056463774-4b830d1de725?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", offer: "Up to 80% off"),
        PromoItem(id: "deals", title: "Limited time\nDeals", image: "https://cdn-icons-png.flaticon.com/512/2972/2972531.png", offer: "Starting from ₹45", isIllustration: true),
        PromoItem(id: "pressure-cooker", title: "Pressure\nCooker", image: "https://images.unsplash.com/photo-1593922712952-b8f36c56c257?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", offer: "Up to 60% off"),
        PromoItem(id: "winter", title: "Winter\nEssentials", image: "https://images.unsplash.com/photo-1544026230-01d2f838bc35?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", offer: "Starting @ ₹99")
    ]
    
    struct PromoItem: Identifiable {
        let id: String
        let title: String
        let image: String
        let offer: String
        var isIllustration: Bool = false
    }
    
    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header Area
            ZStack(alignment: .bottomTrailing) {
                LinearGradient(
                    gradient: Gradient(colors: [Color(hex: "#FFF8F3"), Color(hex: "#FDEEE4")]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                
                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("GRAND")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(Color(hex: "#6F5C4C"))
                            .tracking(1)
                        Text("KITCHEN")
                            .font(.system(size: 32, weight: .heavy))
                            .foregroundColor(Color(hex: "#0F3443"))
                            .tracking(-1)
                        HStack(spacing: 8) {
                            Text("SALE")
                                .font(.system(size: 32, weight: .heavy))
                                .foregroundColor(Color(hex: "#0F3443"))
                                .tracking(-1)
                            
                            Text("UP TO 80% OFF")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color(hex: "#5D4037"))
                                .cornerRadius(2)
                        }
                    }
                    .padding(.leading, 16)
                    
                    Spacer()
                    
                    AsyncImage(url: URL(string: "https://images.unsplash.com/photo-1556910602-38f53e68e15d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.clear
                    }
                    .frame(width: 160, height: 140)
                    .offset(x: 10, y: 10)
                }
            }
            .frame(height: 180)
            .clipped()
            
            // Grid Items
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(promoItems) { item in
                    Button(action: {}) {
                        VStack(spacing: 0) {
                            VStack {
                                Text(item.title)
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(Color(hex: "#4B5563"))
                                    .multilineTextAlignment(.center)
                                    .fixedSize(horizontal: false, vertical: true)
                                    .frame(height: 32, alignment: .center) // Fix height for 2 lines
                                    .padding(.top, 12)
                                
                                AsyncImage(url: URL(string: item.image)) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                } placeholder: {
                                    Color.gray.opacity(0.1)
                                }
                                .frame(width: item.isIllustration ? 60 : 70, height: 70)
                                .padding(.vertical, 4)
                            }
                            .frame(height: 130)
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            
                            HStack {
                                Text(item.offer)
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 30)
                            .background(Color(hex: "#0F3443"))
                        }
                        .cornerRadius(12)
                        .shadow(color: .black.opacity(0.05), radius: 2, y: 1)
                    }
                }
            }
            .padding(16)
            
            // Bank Offer
            VStack {
                HStack {
                    AsyncImage(url: URL(string: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png")) { image in
                        image.resizable().aspectRatio(contentMode: .fit)
                    } placeholder: { Color.clear }
                    .frame(width: 80, height: 20)
                    
                    Rectangle().fill(Color(hex: "#D1D5DB")).frame(width: 1, height: 16).padding(.horizontal, 12)
                    
                    Text("Flat ₹100 off on orders above ₹999")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
                
                Text("with HSBC Bank Credit Cards")
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
            )
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
    }
}
