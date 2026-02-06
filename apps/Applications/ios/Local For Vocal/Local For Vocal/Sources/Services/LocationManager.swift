import Combine
import CoreLocation

public class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    public static let shared = LocationManager()
    private let locationManager = CLLocationManager()
    private let geocoder = CLGeocoder()

    @Published var location: CLLocation?
    @Published var address: String = NSLocalizedString(
        "Locating...", comment: "Location loading state")
    @Published var city: String = NSLocalizedString(
        "Select Location", comment: "Default location prompt")
    @Published var permissionStatus: CLAuthorizationStatus = .notDetermined
    @Published var errorMessage: String?

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
        locationManager.distanceFilter = 10  // Update every 10 meters until stopped
        permissionStatus = locationManager.authorizationStatus
    }

    func requestPermission() {
        locationManager.requestWhenInUseAuthorization()
    }

    func startUpdating() {
        #if os(iOS)
            if permissionStatus == .authorizedWhenInUse || permissionStatus == .authorizedAlways {
                locationManager.startUpdatingLocation()
            } else {
                requestPermission()
            }
        #else
            locationManager.startUpdatingLocation()
        #endif
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        permissionStatus = manager.authorizationStatus

        let isAuthorized: Bool
        #if os(iOS)
            isAuthorized =
                permissionStatus == .authorizedWhenInUse || permissionStatus == .authorizedAlways
        #else
            isAuthorized = permissionStatus == .authorized
        #endif

        if isAuthorized {
            manager.startUpdatingLocation()
        } else if permissionStatus == .denied || permissionStatus == .restricted {
            errorMessage = NSLocalizedString(
                "Location access denied. Please enable it in Settings.",
                comment: "Location permission denied error")
            address = NSLocalizedString("Location Denied", comment: "Location denied state")
            city = NSLocalizedString("Select Location", comment: "Default location prompt")
        }
    }

    public func locationManager(
        _ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]
    ) {
        guard let newLocation = locations.last else { return }
        location = newLocation
        reverseGeocode(location: newLocation)
        manager.stopUpdatingLocation()  // Stop after getting one good fix to save battery
    }

    public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // print("Location error: \(error.localizedDescription)") // Using Logger suggested
        errorMessage = error.localizedDescription
        address = NSLocalizedString("Failed to locate", comment: "Location failure state")
    }

    private func reverseGeocode(location: CLLocation) {
        geocoder.reverseGeocodeLocation(location) { [weak self] placemarks, error in
            guard let self = self else { return }

            // CRITICAL: All @Published property updates must happen on main thread
            DispatchQueue.main.async {
                if error != nil {
                    self.address = NSLocalizedString(
                        "Address not found", comment: "Reverse geocoding failure")
                    return
                }

                if let placemark = placemarks?.first {
                    // Construct address string
                    let street = placemark.thoroughfare ?? ""
                    let subLocality = placemark.subLocality ?? ""
                    let city = placemark.locality ?? ""
                    let state = placemark.administrativeArea ?? ""

                    // Smart formatting
                    if !subLocality.isEmpty {
                        self.address = "\(subLocality), \(city)"
                        self.city = subLocality.uppercased()
                    } else if !street.isEmpty {
                        self.address = "\(street), \(city)"
                        self.city = city.uppercased()
                    } else {
                        self.address = "\(city), \(state)"
                        self.city = city.uppercased()
                    }

                    if self.city.isEmpty {
                        self.city = NSLocalizedString(
                            "CURRENT LOCATION", comment: "Fallback city name")
                    }
                }
            }
        }
    }
}
