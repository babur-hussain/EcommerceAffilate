import SwiftUI

struct FiftyPercentOffView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // SDUIPage fetches and renders the components for this slug
                SDUIPage(slug: "50_percent_off")
            }
            .padding(.bottom, 80)  // contentContainerStyle paddingBottom from RN
        }
        .background(Color(hex: "FAFAFA"))
        .navigationBarHidden(true)
        .statusBar(hidden: false)
    }
}

struct FiftyPercentOffView_Previews: PreviewProvider {
    static var previews: some View {
        FiftyPercentOffView()
    }
}
