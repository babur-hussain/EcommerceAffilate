import SwiftUI

struct KidsCollectionView: View {
    @Environment(\.presentationMode) var presentationMode

    // Mock Data based on sectionConfig.ts
    let shopByAge = [
        ("0-2 years", "https://loremflickr.com/300/300/baby,toddler?lock=7"),
        ("2-6 years", "https://loremflickr.com/300/300/child,play?lock=8"),
        ("6-10 years", "https://loremflickr.com/300/300/kid,school?lock=9"),
        ("11-16 years", "https://loremflickr.com/300/300/teenager,cool?lock=10"),
    ]

    let shopByType = [
        ("Combo sets", "https://loremflickr.com/300/300/kids,clothing?lock=11"),
        ("Dresses", "https://loremflickr.com/300/300/girl,dress?lock=12"),
        ("Tees & shirts", "https://loremflickr.com/300/300/shirt,kid?lock=13"),
        ("Jeans & Pants", "https://loremflickr.com/300/300/jeans,kid?lock=14"),
    ]

    let featuredBrands = [
        ("Max", "https://loremflickr.com/300/400/kid,fashion,smile?lock=20"),
        ("Pantaloons", "https://loremflickr.com/300/400/kid,summer,fun?lock=21"),
        ("Allen Solly", "https://loremflickr.com/300/400/kid,cool?lock=22"),
    ]

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(.black)
                    }
                    Spacer()
                    Text("Kids Fashion")
                        .font(.headline)
                    Spacer()
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.black)
                }
                .padding()
                .background(Color.white)

                ScrollView {
                    VStack(spacing: 24) {
                        // Banner
                        VStack(alignment: .leading) {
                            CachedAsyncImage(
                                url: URL(
                                    string:
                                        "https://loremflickr.com/800/600/kids,shoes,running?lock=6")
                            ) { image in
                                image.resizable().aspectRatio(contentMode: .fill)
                            } placeholder: {
                                Color.gray.opacity(0.1)
                            }
                            .frame(height: 200)
                            .clipped()

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Best sellers in footwear!")
                                    .font(.headline)
                                Text("Starting From ₹129")
                                    .font(.subheadline)
                                    .foregroundColor(.green)
                            }
                            .padding()
                        }
                        .background(Color(hex: "#F9FAFB"))
                        .cornerRadius(12)
                        .padding(.horizontal, 16)

                        // Age Scroll
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Shop by age")
                                .font(.headline)
                                .padding(.horizontal, 16)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    ForEach(shopByAge, id: \.0) { item in
                                        VStack {
                                            CachedAsyncImage(url: URL(string: item.1)) { image in
                                                image.resizable().aspectRatio(contentMode: .fill)
                                            } placeholder: {
                                                Circle().fill(Color.gray.opacity(0.1))
                                            }
                                            .frame(width: 80, height: 80)
                                            .clipShape(Circle())

                                            Text(item.0)
                                                .font(.caption)
                                        }
                                    }
                                }
                                .padding(.horizontal, 16)
                            }
                        }

                        // Type Scroll
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Shop by type")
                                .font(.headline)
                                .padding(.horizontal, 16)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    ForEach(shopByType, id: \.0) { item in
                                        VStack {
                                            CachedAsyncImage(url: URL(string: item.1)) { image in
                                                image.resizable().aspectRatio(contentMode: .fill)
                                            } placeholder: {
                                                RoundedRectangle(cornerRadius: 8).fill(
                                                    Color.gray.opacity(0.1))
                                            }
                                            .frame(width: 100, height: 100)
                                            .cornerRadius(8)

                                            Text(item.0)
                                                .font(.caption)
                                        }
                                    }
                                }
                                .padding(.horizontal, 16)
                            }
                        }

                        // Brands
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Featured Brands")
                                .font(.headline)
                                .padding(.horizontal, 16)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    ForEach(featuredBrands, id: \.0) { item in
                                        VStack {
                                            CachedAsyncImage(url: URL(string: item.1)) { image in
                                                image.resizable().aspectRatio(contentMode: .fill)
                                            } placeholder: {
                                                RoundedRectangle(cornerRadius: 8).fill(
                                                    Color.gray.opacity(0.1))
                                            }
                                            .frame(width: 140, height: 200)  // Portrait
                                            .cornerRadius(8)

                                            Text(item.0)
                                                .font(.caption)
                                                .fontWeight(.bold)
                                        }
                                    }
                                }
                                .padding(.horizontal, 16)
                            }
                        }

                        Spacer(minLength: 50)
                    }
                }
            }
        }
        .navigationBarHidden(true)
    }
}
