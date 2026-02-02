import SwiftUI

struct BackToSchoolFiveView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SDUIPage(slug: "back-to-school-5")
            }
            .padding(.bottom, 80)
        }
        .background(Color(hex: "F3F4F6"))  // bgLight
        .navigationBarHidden(true)
        .statusBar(hidden: false)
    }
}
