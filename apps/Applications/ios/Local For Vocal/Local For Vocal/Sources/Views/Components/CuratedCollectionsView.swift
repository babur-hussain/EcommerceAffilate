import SwiftUI

struct CuratedCollectionsView: View {
    let collections: [CollectionItem]
    
    // Model specific to this view
    struct CollectionItem: Decodable, Identifiable {
        let id = UUID()
        let title: String
        let subtitle: String
        let backgroundColor: String
        let headerImage: String?
        let items: [SubItem]
        
        enum CodingKeys: String, CodingKey {
            case title, subtitle, backgroundColor, headerImage, items
        }
        
        struct SubItem: Decodable, Identifiable {
            let id = UUID()
            let name: String
            let image: String
            let bgColor: String
            let actionUrl: String
            
            enum CodingKeys: String, CodingKey {
                case name, image, bgColor, actionUrl
            }
        }
    }
    
    var body: some View {
        VStack(spacing: 24) {
            ForEach(collections) { collection in
                VStack(alignment: .leading, spacing: 16) {
                    // Start of Card Content
                    
                    // Header Section with Image
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(collection.title)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(Color(hex: "#1F2937")) // Dark Gray
                            
                            Text(collection.subtitle)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#4B5563")) // Medium Gray
                        }
                        
                        Spacer()
                        
                        // Header Image (Floating overlap effect)
                        if let imgStr = collection.headerImage, let url = URL(string: imgStr) {
                            AsyncImage(url: url) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                Color.white.opacity(0.5)
                            }
                            .frame(width: 70, height: 70)
                            // Add a subtle rotation or shadow for "pop"
                            .rotationEffect(.degrees(5))
                            .shadow(color: .black.opacity(0.1), radius: 5, x: 2, y: 2)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    
                    // Items Grid (2x2)
                    LazyVGrid(columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16)
                    ], spacing: 16) {
                        ForEach(collection.items) { item in
                            Button(action: {
                                print("Navigate to: \(item.actionUrl)")
                            }) {
                                HStack(spacing: 12) {
                                    // Icon Container
                                    ZStack {
                                        Circle()
                                            .fill(Color(hex: item.bgColor).opacity(0.8))
                                            .frame(width: 48, height: 48)
                                        
                                        AsyncImage(url: URL(string: item.image)) { image in
                                            image
                                                .resizable()
                                                .aspectRatio(contentMode: .fit)
                                        } placeholder: {
                                            ProgressView()
                                                .scaleEffect(0.5)
                                        }
                                        .frame(width: 28, height: 28)
                                    }
                                    
                                    // Item Name
                                    Text(item.name)
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(Color(hex: "#374151"))
                                        .lineLimit(1)
                                        .minimumScaleFactor(0.9)
                                    
                                    Spacer()
                                }
                                .padding(8)
                                .background(Color.white.opacity(0.6))
                                .cornerRadius(12)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 24)
                }
                .background(Color(hex: collection.backgroundColor))
                .cornerRadius(24)
                .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 4)
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 8)
    }
}
