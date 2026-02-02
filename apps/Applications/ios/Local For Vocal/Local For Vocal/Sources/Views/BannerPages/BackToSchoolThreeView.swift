import SwiftUI

struct BackToSchoolThreeView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SDUIPage(slug: "back-to-school-3")
            }
            .padding(.bottom, 80)
        }
        .background(Color(hex: "FAFAF9"))  // Light background
        .navigationBarHidden(true)
        .statusBar(hidden: false)
    }
}
