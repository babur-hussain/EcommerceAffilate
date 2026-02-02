import SwiftUI

struct BackToSchoolTwoView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SDUIPage(slug: "back-to-school-2")
            }
            .padding(.bottom, 80)
        }
        .background(Color(hex: "155e48"))  // Page background is Chalkboard Green based on RN
        .navigationBarHidden(true)
        .statusBar(hidden: false)
    }
}
