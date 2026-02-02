import SwiftUI

struct BackToSchoolFourView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SDUIPage(slug: "back-to-school-4")
            }
            .padding(.bottom, 80)
        }
        .background(Color(hex: "FFF7ED"))  // bgLight
        .navigationBarHidden(true)
        .statusBar(hidden: false)
    }
}
