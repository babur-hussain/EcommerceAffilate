import SwiftUI

/// Skeleton loading view that mimics the home page structure
/// Shows shimmer animation while content is loading
struct HomeSkeletonView: View {
    @State private var isAnimating = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 16) {
                // Hero banner skeleton
                heroSkeleton

                // Category circles skeleton
                categorySkeleton

                // Products grid skeleton
                productGridSkeleton

                // Another section skeleton
                sectionSkeleton

                // More products
                productGridSkeleton
            }
            .padding(.horizontal, 16)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
        }
    }

    // MARK: - Hero Banner Skeleton

    private var heroSkeleton: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(shimmerGradient)
            .frame(height: 180)
    }

    // MARK: - Category Skeleton

    private var categorySkeleton: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Section title
            RoundedRectangle(cornerRadius: 4)
                .fill(shimmerGradient)
                .frame(width: 120, height: 20)

            // Category circles
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(0..<6, id: \.self) { _ in
                        VStack(spacing: 8) {
                            Circle()
                                .fill(shimmerGradient)
                                .frame(width: 60, height: 60)

                            RoundedRectangle(cornerRadius: 4)
                                .fill(shimmerGradient)
                                .frame(width: 50, height: 12)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Product Grid Skeleton

    private var productGridSkeleton: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Section title
            RoundedRectangle(cornerRadius: 4)
                .fill(shimmerGradient)
                .frame(width: 150, height: 20)

            // Product grid
            LazyVGrid(
                columns: [
                    GridItem(.flexible(), spacing: 12),
                    GridItem(.flexible(), spacing: 12),
                ], spacing: 12
            ) {
                ForEach(0..<4, id: \.self) { _ in
                    productCardSkeleton
                }
            }
        }
    }

    // MARK: - Product Card Skeleton

    private var productCardSkeleton: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Product image
            RoundedRectangle(cornerRadius: 8)
                .fill(shimmerGradient)
                .frame(height: 150)

            // Product title
            RoundedRectangle(cornerRadius: 4)
                .fill(shimmerGradient)
                .frame(height: 14)

            // Price
            RoundedRectangle(cornerRadius: 4)
                .fill(shimmerGradient)
                .frame(width: 80, height: 16)
        }
        .padding(8)
        .background(Color.gray.opacity(0.1))
        .cornerRadius(12)
    }

    // MARK: - Section Skeleton

    private var sectionSkeleton: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Section title
            RoundedRectangle(cornerRadius: 4)
                .fill(shimmerGradient)
                .frame(width: 180, height: 20)

            // Horizontal scroll items
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(0..<4, id: \.self) { _ in
                        RoundedRectangle(cornerRadius: 8)
                            .fill(shimmerGradient)
                            .frame(width: 140, height: 180)
                    }
                }
            }
        }
    }

    // MARK: - Shimmer Gradient

    private var shimmerGradient: LinearGradient {
        LinearGradient(
            colors: [
                Color.gray.opacity(0.3),
                Color.gray.opacity(isAnimating ? 0.5 : 0.2),
                Color.gray.opacity(0.3),
            ],
            startPoint: .leading,
            endPoint: .trailing
        )
    }
}

#if DEBUG
    struct HomeSkeletonView_Previews: PreviewProvider {
        static var previews: some View {
            HomeSkeletonView()
        }
    }
#endif
