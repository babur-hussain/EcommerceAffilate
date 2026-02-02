import SwiftUI

struct SchoolTwoFooterView: View {
    var body: some View {
        BackToSchoolFooterView()  // Use Footer 1 as it's nearly identical in description usually, or duplicate code if needed.
        // RN code for Footer 2 is basically same structure. I can re-use BackToSchoolFooterView content.
        // But to avoid "Ambiguous reference", let's just make it a wrapper or a copy.
        // For now, I'll copy the logic as Swift doesn't like direct reuse if it's not generic.
        // Actually, BackToSchoolFooterView struct is available.
        // Let's implement it custom to be safe and match styles (if any diff).
        // File 4 (SchoolTwoFooter.tsx) size 4919 bytes vs File 5 (BackToSchoolFooter.tsx) 5187 bytes. Very similar.

        VStack(spacing: 0) {
            Divider()
            HStack(alignment: .bottom) {
                // ... same items ...
                NavItem(icon: "house.fill", label: "Home", isActive: true)
                NavItem(icon: "square.grid.2x2.fill", label: "Categories")

                Button(action: {}) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "FACC15"))  // Yellow primary
                            .frame(width: 64, height: 64)
                            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)

                        Image(systemName: "cart.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white)
                    }
                }
                .offset(y: -24)

                NavItem(icon: "heart", label: "Saved")
                NavItem(icon: "person", label: "Profile")
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .shadow(color: .black.opacity(0.05), radius: 15, x: 0, y: -5)
        }
    }

    struct NavItem: View {
        let icon: String
        let label: String
        var isActive: Bool = false

        var body: some View {
            Button(action: {}) {
                VStack(spacing: 4) {
                    Image(systemName: icon)
                        .font(.system(size: 26))
                        .foregroundColor(isActive ? Color(hex: "FACC15") : Color(hex: "9CA3AF"))

                    Text(label)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(isActive ? Color(hex: "FACC15") : Color(hex: "9CA3AF"))
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 12)
            }
        }
    }
}
