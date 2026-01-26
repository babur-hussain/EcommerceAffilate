import SwiftUI

struct CuratedCollectionsView: View {
    let collections: [CollectionItem]
    
    // Model specific to this view
    struct CollectionItem: Decodable, Identifiable {
        let id = UUID()
        let title: String
        let subtitle: String
        let backgroundColor: String
        let headerImage: String
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
                VStack(spacing: 0) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(collection.title)
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(Color(hex: "#111827"))
                            Text(collection.subtitle)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "#6B7280"))
                        }
                        
                        Spacer()
                        
                        if let url = URL(string: collection.headerImage) {
                            AsyncImage(url: url) { image in
                                image.resizable()
                            } placeholder: {
                                Color.gray.opacity(0.1)
                            }
                            .frame(width: 80, height: 80)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                    .padding(16)
                    .background(Color(hex: collection.backgroundColor).opacity(0.1))
                    
                    // Items Horizontal Scroll
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(collection.items) { item in
                                Button(action: {
                                    print("Navigate to: \(item.actionUrl)")
                                }) {
                                    VStack(spacing: 8) {
                                        ZStack {
                                            Circle()
                                                .fill(Color(hex: item.bgColor))
                                                .frame(width: 70, height: 70)
                                            
                                            AsyncImage(url: URL(string: item.image)) { image in
                                                image
                                                    .resizable()
                                                    .aspectRatio(contentMode: .fit)
                                            } placeholder: {
                                                ProgressView()
                                            }
                                            .frame(width: 50, height: 50)
                                        }
                                        
                                        Text(item.name)
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(Color(hex: "#374151"))
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                    }
                }
                .background(Color.white)
                .cornerRadius(16)
                .shadow(color: .black.opacity(0.05), radius: 2, y: 1)
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 16)
    }
}
