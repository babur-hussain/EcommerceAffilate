import SwiftUI

struct MenCollectionView: View {
    @Environment(\.presentationMode) var presentationMode
    @StateObject var viewModel = SDUIPageViewModel(pageSlug: "men-fashion")
    @State private var selectedTab = "Streetwear"

    let tabs = ["Streetwear", "Formal", "Basics", "Footwear", "Accessories"]

    var body: some View {
        ZStack {
            Color(hex: "#F8FAFC").ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                VStack(spacing: 0) {
                    HStack {
                        Button(action: {
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Image(systemName: "arrow.left")
                                .font(.system(size: 20))
                                .foregroundColor(Color(hex: "#0F172A"))
                        }

                        Spacer()

                        VStack(spacing: 2) {
                            Text("COLLECTION")
                                .font(.system(size: 10, weight: .bold))
                                .tracking(1)
                                .foregroundColor(Color(hex: "#64748B"))
                            Text("Men's Wear")
                                .font(.system(size: 16, weight: .black))
                                .foregroundColor(Color(hex: "#0F172A"))
                        }

                        Spacer()

                        HStack(spacing: 16) {
                            Image(systemName: "bell")
                            Image(systemName: "bag")
                        }
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "#0F172A"))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)

                    // Search
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Color(hex: "#64748B"))
                        Text("Search collection...")
                            .foregroundColor(Color(hex: "#64748B"))
                            .font(.system(size: 14))
                        Spacer()
                    }
                    .padding(.horizontal, 12)
                    .frame(height: 40)
                    .background(Color(hex: "#F1F5F9"))
                    .cornerRadius(4)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)

                    // Tabs
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 24) {
                            ForEach(tabs, id: \.self) { tab in
                                Button(action: { selectedTab = tab }) {
                                    VStack(spacing: 4) {
                                        Text(tab)
                                            .font(
                                                .system(
                                                    size: 14,
                                                    weight: selectedTab == tab ? .bold : .medium)
                                            )
                                            .foregroundColor(
                                                selectedTab == tab
                                                    ? Color(hex: "#0F172A") : Color(hex: "#64748B"))

                                        if selectedTab == tab {
                                            Rectangle()
                                                .fill(Color(hex: "#0F172A"))
                                                .frame(height: 2)
                                        } else {
                                            Rectangle()
                                                .fill(Color.clear)
                                                .frame(height: 2)
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                    .padding(.bottom, 8)
                }
                .background(Color.white)

                Divider()

                // Content
                ScrollView {
                    if viewModel.isLoading {
                        VStack {
                            Spacer().frame(height: 50)
                            ProgressView()
                            Spacer()
                        }
                    } else if let error = viewModel.errorMessage {
                        VStack {
                            Spacer().frame(height: 50)
                            Text("Failed to load: \(error)")
                                .foregroundColor(.red)
                        }
                    } else {
                        VStack(spacing: 0) {
                            ForEach(viewModel.components) { component in
                                SDUIComponentView(component: component)
                            }
                        }
                        .padding(.bottom, 100)
                    }
                }
            }

            // Bottom Floating Bar (Static Mock)
            VStack {
                Spacer()
                HStack(spacing: 0) {
                    Spacer()
                    HStack(spacing: 40) {
                        VStack(spacing: 4) {
                            Image(systemName: "house.fill")
                            Text("Home").font(.system(size: 10, weight: .bold))
                        }
                        VStack(spacing: 4) {
                            Image(systemName: "square.grid.2x2")
                            Text("Shop").font(.system(size: 10))
                        }
                        VStack(spacing: 4) {
                            Image(systemName: "cart")
                            Text("Cart").font(.system(size: 10))
                        }
                    }
                    .padding(.vertical, 16)
                    .padding(.horizontal, 40)
                    .background(Color(hex: "#0F172A"))
                    .foregroundColor(.white)
                    .cornerRadius(100)
                    .shadow(color: .black.opacity(0.3), radius: 10, x: 0, y: 5)
                    Spacer()
                }
                .padding(.bottom, 20)
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            viewModel.fetchLayout()
        }
    }
}
