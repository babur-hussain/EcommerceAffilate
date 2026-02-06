import SwiftUI

struct SDUIPageSkeleton: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Large Banner Skeleton
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .aspectRatio(16 / 9, contentMode: .fit)
                    .padding(.horizontal)

                // Categories Row Skeleton
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 15) {
                        ForEach(0..<6) { _ in
                            VStack(spacing: 8) {
                                Circle()
                                    .fill(Color.gray.opacity(0.1))
                                    .frame(width: 60, height: 60)
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color.gray.opacity(0.1))
                                    .frame(width: 50, height: 10)
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // Section Title Skeleton
                HStack {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.gray.opacity(0.1))
                        .frame(width: 150, height: 20)
                    Spacer()
                }
                .padding(.horizontal)

                // Product Grid Skeleton
                LazyVGrid(
                    columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16),
                    ], spacing: 16
                ) {
                    ForEach(0..<4) { _ in
                        ProductCardSkeleton()
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .skeleton(isLoading: true)
    }
}

#Preview {
    SDUIPageSkeleton()
}
