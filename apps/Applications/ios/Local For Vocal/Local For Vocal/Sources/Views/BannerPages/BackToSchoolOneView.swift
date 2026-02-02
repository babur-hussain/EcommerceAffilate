import SwiftUI

struct BackToSchoolOneView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // SDUIPage fetches and renders the components for this slug
                SDUIPage(slug: "back-to-school-1")
            }
            .padding(.bottom, 80)
        }
        .background(Color(hex: "F9F7F2"))
        .navigationBarHidden(true)
        .statusBar(hidden: false)
    }
}

struct BackToSchoolOneView_Previews: PreviewProvider {
    static var previews: some View {
        BackToSchoolOneView()
    }
}
