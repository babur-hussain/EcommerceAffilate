import SwiftUI

struct ServicesPageView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    @EnvironmentObject var locationManager: LocationManager

    var body: some View {
        ServicesHomeView()
    }
}
