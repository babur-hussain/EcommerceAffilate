import SwiftUI

struct GenZCollectionView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var categories: [GenZCategory] = []
    @State private var isLoading = true

    // COLORS
    let primary = Color(hex: "#bef264")  // Lime green
    let backgroundDark = Color.black
    let backgroundLight = Color.white

    // Mock Data for Hardcoded Sections
    let genderImages = [
        (
            "Girls",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA-RLB1uRr6nsMaOA-njZ-TJmjekXr8Pp6PBIwC7V8sES4o13IoN8WxpVGkv03oyh2wkKRiXLeMT_SwiSGorKkH41cjg-AGZm-ENev4S_uMxdtV3hQlefYnjMXOyMOsHfmb4y6gd3NB43t2i9AJrJYnyJD_jRrhBkBPm6GzMYrIUyYi7hmDinQWvsOvQB7umZqLH7OlUquvEFdYm28MCc4XJTmV9pDqN8gYU4uJOomiwUdPJBd6_8IiCszdoCMCuiClwlOsgxS-xwlL",
            Color(hex: "#e11d48")
        ),
        (
            "Guys",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA-tX8NW7yRqa7ClLQ5hyJwisocbg1fOnQ_9_6y6RKH73J36RJ8Ryh1pzdeXMcgpx09U2EpAfjjzHvex9qMg9X3Z-0rReSlSX0L_q44QfnTe_ds9yeCkmww-YqU5FRtMvgaeVaW4P4ceqBShtwgBoov8nmZ6y5EvLTRpkXz2ItArIV03ULK8WLzr3aVxx7WN2n1KGWvMWA-FxI3a3KEFYaLQyJiDHILsDRp11uje8SMAaB4JXDKftD30pOstq4yYTjj9u_DAF-bCmIA",
            Color(hex: "#10b981")
        ),
    ]

    var body: some View {
        ZStack {
            backgroundDark.ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(.white)
                    }

                    // Search Bar
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Color.gray)
                        Text("Search Gen Z Drip...")
                            .foregroundColor(Color.gray)
                            .font(.system(size: 14))
                        Spacer()
                    }
                    .padding(.horizontal, 12)
                    .frame(height: 40)
                    .background(Color(hex: "#27272a"))
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20).stroke(
                            Color.gray.opacity(0.3), lineWidth: 1)
                    )
                    .padding(.horizontal, 12)

                    Button(action: {}) {
                        Image(systemName: "cart")
                            .font(.system(size: 20))
                            .foregroundColor(.white)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)

                ScrollView {
                    VStack(spacing: 24) {

                        // Gender Grid
                        HStack(spacing: 16) {
                            ForEach(genderImages, id: \.0) { item in
                                ZStack(alignment: .bottom) {
                                    item.2.opacity(0.85)  // Background Color

                                    CachedAsyncImage(url: URL(string: item.1)) { image in
                                        image.resizable().aspectRatio(contentMode: .fit)
                                    } placeholder: {
                                        Color.clear
                                    }
                                    .padding(.bottom, -10)  // Overlap check

                                    Text(item.0)
                                        .font(.system(size: 30, weight: .bold))
                                        .italic()
                                        .foregroundColor(.white)
                                        .shadow(color: .black.opacity(0.3), radius: 4, x: 0, y: 1)
                                        .padding(.bottom, 12)
                                }
                                .frame(height: 140)
                                .cornerRadius(16)
                                .clipped()
                            }
                        }
                        .padding(.horizontal, 16)

                        // Hero Section
                        ZStack(alignment: .bottom) {
                            CachedAsyncImage(
                                url: URL(
                                    string:
                                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAAw9KcuR_KaBrBCrzBK22ziELTXEGbybkUR9LdzmfDu-u5_GBfR5HkoxRW3N1t6dMnJHV35wAxaLXtHe8IqnFd_CUyboUKi-c_mXCpdgpmrBnWRf6AHq4qQOss74K9NpeDxPiZeezjmfIgYP26PzmkJfFGNjuJBb8Fr7u_Fdc1B8DvthKiacf0IfsCdxjsp3o4WQ_vtaVj1jhDlN6nMc_VqA8DDZ9gayIfWifOZEXTn2OoJfIOKIrWVOgDln3dfWNbQfafVnPtwBFG"
                                )
                            ) { image in
                                image.resizable().aspectRatio(contentMode: .fill)
                            } placeholder: {
                                Color(hex: "#18181b")
                            }
                            .frame(height: 480)
                            .clipped()

                            LinearGradient(
                                gradient: Gradient(colors: [.clear, .black.opacity(0.9)]),
                                startPoint: .center, endPoint: .bottom)

                            VStack(spacing: 16) {
                                Text("Satin Jacquard")
                                    .font(.system(size: 42, weight: .black))
                                    .italic()
                                    .foregroundColor(primary)
                                    .multilineTextAlignment(.center)

                                Button(action: {}) {
                                    Text("From ₹249")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 24)
                                        .padding(.vertical, 8)
                                        .background(Color.black)
                                        .cornerRadius(20)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 20).stroke(
                                                Color.white, lineWidth: 1))
                                }
                            }
                            .padding(.bottom, 40)
                        }
                        .cornerRadius(24)
                        .padding(.horizontal, 16)

                        // Categories Grid
                        LazyVGrid(
                            columns: Array(repeating: GridItem(.flexible(), spacing: 16), count: 4),
                            spacing: 24
                        ) {
                            if isLoading {
                                Text("Loading Drip...").foregroundColor(.white)
                            } else {
                                ForEach(Array(categories.enumerated()), id: \.element.id) {
                                    index, cat in
                                    VStack(spacing: 8) {
                                        ZStack {
                                            // Cycle background colors - Simplified for Swift
                                            Circle().fill(Color.white.opacity(0.1))

                                            if let url = URL(string: cat.image) {
                                                CachedAsyncImage(url: url) { image in
                                                    image.resizable().aspectRatio(
                                                        contentMode: .fill)
                                                } placeholder: {
                                                    Color.gray
                                                }
                                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                            }
                                        }
                                        .aspectRatio(1, contentMode: .fit)
                                        .frame(maxWidth: .infinity)

                                        Text(cat.name)
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(Color(hex: "#a1a1aa"))
                                            .multilineTextAlignment(.center)
                                            .lineLimit(2)
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 16)

                        // Footer
                        VStack(spacing: 4) {
                            Text("Republic Day Special")
                                .font(.system(size: 24, weight: .semibold))
                                .italic()
                                .foregroundColor(.white)
                            Text("SHOP THE COLLECTION")
                                .font(.system(size: 10, weight: .bold))
                                .tracking(2)
                                .foregroundColor(Color.gray)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(32)
                        .background(Color(hex: "#18181b"))
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24).stroke(
                                Color(hex: "#27272a"), lineWidth: 1)
                        )
                        .padding(.horizontal, 16)
                        .padding(.bottom, 100)
                    }
                }
            }
        }
        .navigationBarHidden(true)
        .onAppear(perform: fetchCategories)
    }

    func fetchCategories() {
        // Fetch from API
        let urlString = "\(APIService.shared.baseURL)/api/categories?group=GenZ"
        guard let url = URL(string: urlString) else { return }

        URLSession.shared.dataTask(with: url) { data, _, _ in
            if let data = data {
                if let decoded = try? JSONDecoder().decode([GenZCategory].self, from: data) {
                    DispatchQueue.main.async {
                        self.categories = decoded
                        self.isLoading = false
                    }
                }
            }
        }.resume()
    }
}

struct GenZCategory: Decodable, Identifiable {
    let _id: String
    let name: String
    let image: String
    let slug: String

    var id: String { _id }
}
