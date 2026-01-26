import SwiftUI

struct RecentHistoryView: View {
    var userName: String = "User"
    
    // Hardcoded items as per RN implementation
    let recentItems = [
        RecentItem(id: "1", label: "Mobiles", image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755562/1_ibbaod.webp"),
        RecentItem(id: "2", label: "Blankets", image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755563/2_ny7exx.webp"),
        RecentItem(id: "3", label: "Men's Casual Shoes", image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755563/3_vps8qm.webp"),
        RecentItem(id: "4", label: "T-Shirts", image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755563/4_qd8fza.webp")
    ]
    
    var body: some View {
        ZStack {
            // Background
            Color(hex: "#C8E6C9") // Soft mint green
            
            // Decorative elements could be added here
            
            VStack(alignment: .leading, spacing: 16) {
                Text("\(userName), still looking for these?")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "#1B5E20")) // Dark green
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(recentItems) { item in
                            RecentItemCard(item: item)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                }
            }
        }
        .cornerRadius(16)
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(height: 230)
    }
}

struct RecentItem: Identifiable {
    let id: String
    let label: String
    let image: String
}

struct RecentItemCard: View {
    let item: RecentItem
    
    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                if let url = URL(string: item.image) {
                    AsyncImage(url: url) { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        Color.gray.opacity(0.1)
                    }
                }
            }
            .frame(height: 105)
            .frame(maxWidth: .infinity)
            
            Text(item.label)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "#4B5563"))
                .lineLimit(1)
                .frame(maxWidth: .infinity)
        }
        .padding(8)
        .frame(width: 130, height: 150)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 2, y: 1)
    }
}
